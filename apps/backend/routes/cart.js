const express = require('express');
const { OrderService } = require('../../../packages/shared/src/business/services/OrderService');
const { StripeProductService } = require('../../../packages/shared/src/business/services/StripeProductService');

/**
 * Create cart and checkout routes
 */
function createCartRoutes(supabase, stripeSecretKey) {
  const router = express.Router();
  const orderService = new OrderService(supabase, stripeSecretKey);
  const productService = new StripeProductService(supabase, stripeSecretKey);

  /**
   * Add item to cart
   * POST /api/cart/add
   */
  router.post('/add', async (req, res) => {
    try {
      const { product_id, variant_id, quantity = 1 } = req.body;
      const userId = req.user?.id; // From auth middleware
      const sessionId = req.headers['x-session-id']; // For anonymous users

      if (!product_id || !variant_id) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'product_id and variant_id are required'
        });
      }

      const result = await orderService.addToCart(
        product_id, 
        variant_id, 
        quantity, 
        userId, 
        sessionId
      );

      res.json({
        success: true,
        cart_id: result.cart_id,
        item_updated: result.item_updated,
        quantity: result.quantity
      });

    } catch (error) {
      console.error('Add to cart error:', error);
      
      if (error.name === 'ValidationError' || error.name === 'BusinessRuleError') {
        return res.status(400).json({
          error: error.name,
          message: error.message,
          details: error.details
        });
      }

      if (error.name === 'ResourceNotFoundError') {
        return res.status(404).json({
          error: 'Resource not found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to add item to cart',
        message: error.message
      });
    }
  });

  /**
   * Get current cart
   * GET /api/cart
   */
  router.get('/', async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'];

      const cart = await orderService.getCart(userId, sessionId);

      if (!cart) {
        return res.json({
          cart_id: null,
          items: [],
          subtotal: 0,
          item_count: 0,
          currency: 'usd'
        });
      }

      res.json(cart);

    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        error: 'Failed to fetch cart',
        message: error.message
      });
    }
  });

  /**
   * Update cart item quantity
   * PUT /api/cart/items/:itemId
   */
  router.put('/items/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user?.id;

      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({
          error: 'Invalid quantity',
          message: 'Quantity must be a non-negative number'
        });
      }

      const result = await orderService.updateCartItem(itemId, quantity, userId);

      res.json({
        success: true,
        quantity: result.quantity
      });

    } catch (error) {
      console.error('Update cart item error:', error);
      
      if (error.name === 'BusinessRuleError') {
        return res.status(400).json({
          error: 'Business rule violation',
          message: error.message
        });
      }

      if (error.name === 'ResourceNotFoundError') {
        return res.status(404).json({
          error: 'Cart item not found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to update cart item',
        message: error.message
      });
    }
  });

  /**
   * Remove item from cart
   * DELETE /api/cart/items/:itemId
   */
  router.delete('/items/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const userId = req.user?.id;

      const result = await orderService.removeCartItem(itemId, userId);

      res.json({
        success: true,
        message: 'Item removed from cart'
      });

    } catch (error) {
      console.error('Remove cart item error:', error);
      
      if (error.name === 'BusinessRuleError') {
        return res.status(403).json({
          error: 'Access denied',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to remove cart item',
        message: error.message
      });
    }
  });

  /**
   * Clear entire cart
   * DELETE /api/cart
   */
  router.delete('/', async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'];

      const result = await orderService.clearCart(userId, sessionId);

      res.json({
        success: true,
        message: 'Cart cleared successfully'
      });

    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        error: 'Failed to clear cart',
        message: error.message
      });
    }
  });

  /**
   * Create checkout session
   * POST /api/cart/checkout
   */
  router.post('/checkout', async (req, res) => {
    try {
      const { 
        success_url, 
        cancel_url, 
        customer_email,
        allow_promotion_codes = false,
        metadata = {}
      } = req.body;

      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'];

      if (!success_url || !cancel_url) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'success_url and cancel_url are required'
        });
      }

      // Use user email if available, otherwise require customer_email
      const email = req.user?.email || customer_email;
      if (!email) {
        return res.status(400).json({
          error: 'Email required',
          message: 'Customer email is required for checkout'
        });
      }

      const checkoutRequest = {
        success_url,
        cancel_url,
        customer_email: email,
        session_id: sessionId,
        allow_promotion_codes,
        metadata
      };

      const result = await orderService.createCheckoutSession(checkoutRequest, userId);

      res.json({
        success: true,
        session_id: result.session_id,
        session_url: result.session_url,
        order_id: result.order_id,
        order_number: result.order_number,
        expires_at: result.expires_at
      });

    } catch (error) {
      console.error('Create checkout session error:', error);
      
      if (error.name === 'BusinessRuleError') {
        return res.status(400).json({
          error: 'Checkout validation failed',
          message: error.message,
          details: error.details
        });
      }

      res.status(500).json({
        error: 'Failed to create checkout session',
        message: error.message
      });
    }
  });

  /**
   * Get cart item count for header badge
   * GET /api/cart/count
   */
  router.get('/count', async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'];

      const cart = await orderService.getCart(userId, sessionId);

      res.json({
        item_count: cart?.item_count || 0,
        subtotal: cart?.subtotal || 0,
        currency: cart?.currency || 'usd'
      });

    } catch (error) {
      console.error('Get cart count error:', error);
      // Return zero counts on error to prevent UI issues
      res.json({
        item_count: 0,
        subtotal: 0,
        currency: 'usd'
      });
    }
  });

  return router;
}

/**
 * Create order management routes (for user order history)
 */
function createOrderRoutes(supabase, stripeSecretKey) {
  const router = express.Router();
  const orderService = new OrderService(supabase, stripeSecretKey);

  /**
   * Get user's order history
   * GET /api/orders
   */
  router.get('/', async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Must be logged in to view orders'
        });
      }

      const { limit = 20, offset = 0 } = req.query;

      const orders = await orderService.getUserOrders(
        userId, 
        parseInt(limit), 
        parseInt(offset)
      );

      res.json({
        orders,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: orders.length
        }
      });

    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        error: 'Failed to fetch orders',
        message: error.message
      });
    }
  });

  /**
   * Get specific order details
   * GET /api/orders/:orderId
   */
  router.get('/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await orderService.getOrder(orderId, userId);

      res.json(order);

    } catch (error) {
      console.error('Get order error:', error);
      
      if (error.name === 'ResourceNotFoundError') {
        return res.status(404).json({
          error: 'Order not found',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to fetch order',
        message: error.message
      });
    }
  });

  return router;
}

module.exports = { createCartRoutes, createOrderRoutes };
