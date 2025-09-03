import Stripe from 'stripe';
import { ResourceNotFoundError, ValidationError, BusinessRuleError, DatabaseError } from '../errors';
export class OrderService {
    constructor(supabase, stripeSecretKey) {
        this.supabase = supabase;
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2024-12-18.acacia'
        });
    }
    /**
     * Add item to cart (persistent cart system)
     */
    async addToCart(productId, variantId, quantity = 1, userId, sessionId) {
        try {
            if (!userId && !sessionId) {
                throw new ValidationError('Either userId or sessionId must be provided');
            }
            // Validate product and variant exist and are active
            const { data: variant, error: variantError } = await this.supabase
                .from('product_variants')
                .select(`
          id, name, unit_amount, inventory_quantity, track_inventory,
          products!inner(id, name, active, track_inventory)
        `)
                .eq('id', variantId)
                .eq('product_id', productId)
                .eq('active', true)
                .eq('products.active', true)
                .single();
            if (variantError || !variant) {
                throw new ResourceNotFoundError('Product variant', variantId);
            }
            // Check inventory if tracking is enabled
            if (variant.track_inventory && variant.inventory_quantity < quantity) {
                throw new BusinessRuleError(`Insufficient inventory. Available: ${variant.inventory_quantity}, Requested: ${quantity}`);
            }
            // Get or create cart
            const { data: cartId, error: cartError } = await this.supabase
                .rpc('get_or_create_cart', {
                p_user_id: userId || null,
                p_session_id: sessionId || null
            });
            if (cartError) {
                throw new DatabaseError('Failed to get or create cart', { supabaseError: cartError });
            }
            // Check if item already exists in cart
            const { data: existingItem } = await this.supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('cart_id', cartId)
                .eq('product_id', productId)
                .eq('variant_id', variantId)
                .single();
            if (existingItem) {
                // Update quantity
                const newQuantity = existingItem.quantity + quantity;
                // Check inventory again for new total
                if (variant.track_inventory && variant.inventory_quantity < newQuantity) {
                    throw new BusinessRuleError(`Insufficient inventory for total quantity. Available: ${variant.inventory_quantity}, Requested: ${newQuantity}`);
                }
                await this.supabase
                    .from('cart_items')
                    .update({
                    quantity: newQuantity,
                    updated_at: new Date().toISOString()
                })
                    .eq('id', existingItem.id);
                return { cart_id: cartId, item_updated: true, quantity: newQuantity };
            }
            else {
                // Add new item
                const { error: insertError } = await this.supabase
                    .from('cart_items')
                    .insert({
                    cart_id: cartId,
                    product_id: productId,
                    variant_id: variantId,
                    quantity
                });
                if (insertError) {
                    throw new DatabaseError('Failed to add item to cart', { supabaseError: insertError });
                }
                return { cart_id: cartId, item_updated: false, quantity };
            }
        }
        catch (error) {
            console.error('Error adding to cart:', error);
            if (error instanceof ValidationError || error instanceof ResourceNotFoundError ||
                error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error adding to cart');
        }
    }
    /**
     * Get cart with items
     */
    async getCart(userId, sessionId) {
        try {
            if (!userId && !sessionId) {
                throw new ValidationError('Either userId or sessionId must be provided');
            }
            // Find cart
            let query = this.supabase
                .from('shopping_carts')
                .select(`
          id, created_at, updated_at, expires_at,
          cart_items(
            id, quantity, created_at,
            product_variants!inner(
              id, name, unit_amount, currency, inventory_quantity, sku,
              products!inner(
                id, name, description, images, track_inventory
              )
            )
          )
        `)
                .gt('expires_at', new Date().toISOString())
                .order('updated_at', { ascending: false })
                .limit(1);
            if (userId) {
                query = query.eq('user_id', userId);
            }
            else {
                query = query.eq('session_id', sessionId);
            }
            const { data: carts, error } = await query;
            if (error) {
                throw new DatabaseError('Failed to fetch cart', { supabaseError: error });
            }
            if (!carts || carts.length === 0) {
                return null;
            }
            const cart = carts[0];
            // Calculate totals
            let subtotal = 0;
            let itemCount = 0;
            const items = (cart.cart_items || []).map(item => {
                const itemTotal = item.product_variants.unit_amount * item.quantity;
                subtotal += itemTotal;
                itemCount += item.quantity;
                return {
                    id: item.id,
                    product_id: item.product_variants.products.id,
                    product_name: item.product_variants.products.name,
                    product_description: item.product_variants.products.description,
                    product_images: item.product_variants.products.images,
                    variant_id: item.product_variants.id,
                    variant_name: item.product_variants.name,
                    sku: item.product_variants.sku,
                    unit_amount: item.product_variants.unit_amount,
                    currency: item.product_variants.currency,
                    quantity: item.quantity,
                    total_amount: itemTotal,
                    inventory_available: item.product_variants.inventory_quantity,
                    track_inventory: item.product_variants.products.track_inventory,
                    created_at: item.created_at
                };
            });
            return {
                cart_id: cart.id,
                items,
                subtotal,
                item_count: itemCount,
                currency: items[0]?.currency || 'usd',
                created_at: cart.created_at,
                updated_at: cart.updated_at,
                expires_at: cart.expires_at
            };
        }
        catch (error) {
            console.error('Error fetching cart:', error);
            if (error instanceof ValidationError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error fetching cart');
        }
    }
    /**
     * Update cart item quantity
     */
    async updateCartItem(cartItemId, quantity, userId) {
        try {
            if (quantity <= 0) {
                return await this.removeCartItem(cartItemId, userId);
            }
            // Verify cart item belongs to user and get variant info
            let query = this.supabase
                .from('cart_items')
                .select(`
          id, quantity,
          product_variants!inner(inventory_quantity, track_inventory),
          shopping_carts!inner(user_id, session_id)
        `)
                .eq('id', cartItemId);
            const { data: cartItem, error } = await query.single();
            if (error || !cartItem) {
                throw new ResourceNotFoundError('Cart item', cartItemId);
            }
            // Verify ownership (if userId provided)
            if (userId && cartItem.shopping_carts.user_id !== userId) {
                throw new BusinessRuleError('Cart item does not belong to user');
            }
            // Check inventory
            if (cartItem.product_variants.track_inventory &&
                cartItem.product_variants.inventory_quantity < quantity) {
                throw new BusinessRuleError(`Insufficient inventory. Available: ${cartItem.product_variants.inventory_quantity}, Requested: ${quantity}`);
            }
            // Update quantity
            await this.supabase
                .from('cart_items')
                .update({
                quantity,
                updated_at: new Date().toISOString()
            })
                .eq('id', cartItemId);
            return { success: true, quantity };
        }
        catch (error) {
            console.error('Error updating cart item:', error);
            if (error instanceof ResourceNotFoundError || error instanceof BusinessRuleError ||
                error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error updating cart item');
        }
    }
    /**
     * Remove item from cart
     */
    async removeCartItem(cartItemId, userId) {
        try {
            // Verify ownership if userId provided
            if (userId) {
                const { data: cartItem } = await this.supabase
                    .from('cart_items')
                    .select(`
            id,
            shopping_carts!inner(user_id)
          `)
                    .eq('id', cartItemId)
                    .single();
                if (cartItem && cartItem.shopping_carts.user_id !== userId) {
                    throw new BusinessRuleError('Cart item does not belong to user');
                }
            }
            const { error } = await this.supabase
                .from('cart_items')
                .delete()
                .eq('id', cartItemId);
            if (error) {
                throw new DatabaseError('Failed to remove cart item', { supabaseError: error });
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error removing cart item:', error);
            if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error removing cart item');
        }
    }
    /**
     * Clear entire cart
     */
    async clearCart(userId, sessionId) {
        try {
            if (!userId && !sessionId) {
                throw new ValidationError('Either userId or sessionId must be provided');
            }
            // Find cart
            let query = this.supabase.from('shopping_carts').select('id');
            if (userId) {
                query = query.eq('user_id', userId);
            }
            else {
                query = query.eq('session_id', sessionId);
            }
            const { data: cart } = await query.single();
            if (!cart) {
                return { success: true }; // Cart doesn't exist, consider it cleared
            }
            // Delete all cart items
            const { error } = await this.supabase
                .from('cart_items')
                .delete()
                .eq('cart_id', cart.id);
            if (error) {
                throw new DatabaseError('Failed to clear cart', { supabaseError: error });
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error clearing cart:', error);
            if (error instanceof ValidationError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error clearing cart');
        }
    }
    /**
     * Create Stripe Checkout Session from cart
     */
    async createCheckoutSession(request, userId) {
        try {
            // Get cart
            const cart = await this.getCart(userId, request.session_id);
            if (!cart || cart.items.length === 0) {
                throw new BusinessRuleError('Cart is empty or not found');
            }
            // Validate inventory one more time
            const inventoryErrors = [];
            for (const item of cart.items) {
                if (item.track_inventory && item.inventory_available < item.quantity) {
                    inventoryErrors.push(`Insufficient inventory for ${item.product_name}. Available: ${item.inventory_available}, Requested: ${item.quantity}`);
                }
            }
            if (inventoryErrors.length > 0) {
                throw new BusinessRuleError('Inventory validation failed', { details: inventoryErrors });
            }
            // Create pending order first
            const { data: order, error: orderError } = await this.supabase
                .from('orders')
                .insert({
                user_id: userId || null,
                email: request.customer_email || '',
                status: 'pending',
                payment_status: 'unpaid',
                currency: cart.currency,
                subtotal: cart.subtotal,
                total_amount: cart.subtotal, // Will be updated by Stripe
                billing_address: {},
                shipping_address: {}
            })
                .select('id, order_number')
                .single();
            if (orderError || !order) {
                throw new DatabaseError('Failed to create pending order', { supabaseError: orderError });
            }
            // Create order items
            const orderItems = cart.items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                product_name: item.product_name,
                variant_name: item.variant_name,
                sku: item.sku,
                quantity: item.quantity,
                unit_amount: item.unit_amount,
                total_amount: item.total_amount
            }));
            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(orderItems);
            if (itemsError) {
                // Cleanup order on failure
                await this.supabase.from('orders').delete().eq('id', order.id);
                throw new DatabaseError('Failed to create order items', { supabaseError: itemsError });
            }
            // Prepare line items for Stripe
            const lineItems = [];
            for (const item of cart.items) {
                // Check if variant has a Stripe price ID
                const { data: variant } = await this.supabase
                    .from('product_variants')
                    .select('stripe_price_id')
                    .eq('id', item.variant_id)
                    .single();
                if (variant?.stripe_price_id) {
                    // Use existing Stripe price
                    lineItems.push({
                        price: variant.stripe_price_id,
                        quantity: item.quantity
                    });
                }
                else {
                    // Create dynamic price
                    lineItems.push({
                        price_data: {
                            currency: item.currency,
                            unit_amount: item.unit_amount,
                            product_data: {
                                name: `${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ''}`,
                                description: item.product_description || undefined,
                                images: item.product_images || [],
                                metadata: {
                                    product_id: item.product_id,
                                    variant_id: item.variant_id
                                }
                            }
                        },
                        quantity: item.quantity
                    });
                }
            }
            // Create Stripe Checkout Session
            const sessionParams = {
                mode: 'payment',
                line_items: lineItems,
                success_url: `${request.success_url}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: request.cancel_url,
                metadata: {
                    order_id: order.id,
                    order_number: order.order_number,
                    cart_id: cart.cart_id,
                    ...request.metadata
                },
                invoice_creation: {
                    enabled: true
                },
                allow_promotion_codes: request.allow_promotion_codes || false,
                billing_address_collection: 'required',
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'GB', 'AU'] // Configure as needed
                },
                customer_email: request.customer_email,
                expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
            };
            const session = await this.stripe.checkout.sessions.create(sessionParams);
            // Update order with Stripe session ID
            await this.supabase
                .from('orders')
                .update({
                stripe_checkout_session_id: session.id,
                updated_at: new Date().toISOString()
            })
                .eq('id', order.id);
            return {
                session_id: session.id,
                session_url: session.url,
                order_id: order.id,
                order_number: order.order_number,
                expires_at: sessionParams.expires_at
            };
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error creating checkout session');
        }
    }
    /**
     * Handle successful checkout completion (called by webhook)
     */
    async completeOrder(checkoutSessionId) {
        try {
            // Get full session details from Stripe
            const session = await this.stripe.checkout.sessions.retrieve(checkoutSessionId, {
                expand: ['line_items', 'customer']
            });
            const orderId = session.metadata?.order_id;
            if (!orderId) {
                throw new ValidationError('No order ID found in session metadata');
            }
            // Update order with payment details
            const updateData = {
                payment_status: 'paid',
                status: 'confirmed',
                confirmed_at: new Date().toISOString(),
                stripe_payment_intent_id: session.payment_intent,
                total_amount: session.amount_total || 0,
                updated_at: new Date().toISOString()
            };
            // Add customer information
            if (session.customer_details) {
                updateData.email = session.customer_details.email || updateData.email;
                updateData.phone = session.customer_details.phone;
                if (session.customer_details.address) {
                    updateData.billing_address = session.customer_details.address;
                }
            }
            if (session.shipping_details?.address) {
                updateData.shipping_address = session.shipping_details.address;
            }
            if (session.customer) {
                updateData.stripe_customer_id = typeof session.customer === 'string'
                    ? session.customer
                    : session.customer.id;
            }
            // Update order
            const { error: updateError } = await this.supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId);
            if (updateError) {
                throw new DatabaseError('Failed to update order', { supabaseError: updateError });
            }
            // Process inventory deductions
            await this.processInventoryDeductions(orderId);
            // Clear the cart
            const cartId = session.metadata?.cart_id;
            if (cartId) {
                await this.supabase
                    .from('cart_items')
                    .delete()
                    .eq('cart_id', cartId);
            }
            // Grant digital access for applicable items
            await this.grantDigitalAccess(orderId);
            return { success: true, order_id: orderId };
        }
        catch (error) {
            console.error('Error completing order:', error);
            if (error instanceof ValidationError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error completing order');
        }
    }
    /**
     * Process inventory deductions for completed order
     */
    async processInventoryDeductions(orderId) {
        try {
            // Get order items that need inventory deduction
            const { data: orderItems, error } = await this.supabase
                .from('order_items')
                .select(`
          id, variant_id, quantity,
          product_variants!inner(
            id, track_inventory,
            products!inner(track_inventory)
          )
        `)
                .eq('order_id', orderId);
            if (error || !orderItems) {
                throw new DatabaseError('Failed to fetch order items for inventory processing');
            }
            // Process each item
            for (const item of orderItems) {
                if (item.product_variants.track_inventory) {
                    try {
                        await this.supabase.rpc('update_inventory', {
                            p_variant_id: item.variant_id,
                            p_quantity_change: -item.quantity,
                            p_movement_type: 'out',
                            p_reason: 'Order fulfillment',
                            p_reference_type: 'order',
                            p_reference_id: orderId
                        });
                    }
                    catch (inventoryError) {
                        console.error(`Failed to update inventory for variant ${item.variant_id}:`, inventoryError);
                        // Log but don't fail the entire order
                    }
                }
            }
        }
        catch (error) {
            console.error('Error processing inventory deductions:', error);
            // Don't throw error to avoid failing order completion
        }
    }
    /**
     * Grant digital access for applicable items
     */
    async grantDigitalAccess(orderId) {
        try {
            // Update order items to grant access for digital products
            const { error } = await this.supabase
                .from('order_items')
                .update({
                access_granted: true,
                access_granted_at: new Date().toISOString()
            })
                .eq('order_id', orderId);
            if (error) {
                console.error('Failed to grant digital access:', error);
            }
            // Here you could also:
            // - Send download links via email
            // - Create user entitlements
            // - Trigger content delivery systems
        }
        catch (error) {
            console.error('Error granting digital access:', error);
        }
    }
    /**
     * Get order details
     */
    async getOrder(orderId, userId) {
        try {
            let query = this.supabase
                .from('orders')
                .select(`
          *,
          order_items(
            *,
            products(id, name, images),
            product_variants(id, name, sku)
          )
        `)
                .eq('id', orderId);
            // If userId provided, ensure user can only see their own orders
            if (userId) {
                query = query.eq('user_id', userId);
            }
            const { data: order, error } = await query.single();
            if (error) {
                throw new ResourceNotFoundError('Order', orderId);
            }
            return order;
        }
        catch (error) {
            console.error('Error fetching order:', error);
            if (error instanceof ResourceNotFoundError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error fetching order');
        }
    }
    /**
     * Get user's order history
     */
    async getUserOrders(userId, limit = 20, offset = 0) {
        try {
            const { data: orders, error } = await this.supabase
                .from('orders')
                .select(`
          id, order_number, status, payment_status, total_amount, currency,
          created_at, confirmed_at,
          order_items(
            id, product_name, variant_name, quantity, unit_amount,
            products(id, images)
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
            if (error) {
                throw new DatabaseError('Failed to fetch user orders', { supabaseError: error });
            }
            return orders || [];
        }
        catch (error) {
            console.error('Error fetching user orders:', error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error fetching user orders');
        }
    }
    /**
     * Update order status (admin function)
     */
    async updateOrderStatus(orderId, status, fulfillmentStatus, adminNotes) {
        try {
            const updateData = {
                status,
                updated_at: new Date().toISOString()
            };
            if (fulfillmentStatus) {
                updateData.fulfillment_status = fulfillmentStatus;
                if (fulfillmentStatus === 'fulfilled') {
                    updateData.delivered_at = new Date().toISOString();
                }
            }
            if (adminNotes) {
                updateData.admin_notes = adminNotes;
            }
            const { data: order, error } = await this.supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId)
                .select()
                .single();
            if (error) {
                throw new DatabaseError('Failed to update order status', { supabaseError: error });
            }
            return order;
        }
        catch (error) {
            console.error('Error updating order status:', error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error updating order status');
        }
    }
    /**
     * Handle payment failure (called by webhook)
     */
    async handlePaymentFailure(checkoutSessionId) {
        try {
            // Find order by session ID
            const { data: order, error } = await this.supabase
                .from('orders')
                .select('id')
                .eq('stripe_checkout_session_id', checkoutSessionId)
                .single();
            if (error || !order) {
                console.warn(`Order not found for failed checkout session: ${checkoutSessionId}`);
                return;
            }
            // Update order status
            await this.supabase
                .from('orders')
                .update({
                payment_status: 'failed',
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
                .eq('id', order.id);
            return { success: true, order_id: order.id };
        }
        catch (error) {
            console.error('Error handling payment failure:', error);
            throw new DatabaseError('Failed to handle payment failure');
        }
    }
    /**
     * Get order analytics for admin dashboard
     */
    async getOrderAnalytics(startDate, endDate) {
        try {
            const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const end = endDate || new Date().toISOString();
            // Get order metrics
            const { data: metrics, error: metricsError } = await this.supabase
                .from('orders')
                .select('status, payment_status, total_amount, currency, created_at')
                .gte('created_at', start)
                .lte('created_at', end);
            if (metricsError) {
                throw new DatabaseError('Failed to fetch order metrics');
            }
            const orders = metrics || [];
            // Calculate analytics
            const totalOrders = orders.length;
            const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
            const paidOrders = orders.filter(o => o.payment_status === 'paid').length;
            const totalRevenue = orders
                .filter(o => o.payment_status === 'paid')
                .reduce((sum, o) => sum + (o.total_amount || 0), 0);
            const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;
            const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;
            // Get top products
            const { data: topProducts, error: topProductsError } = await this.supabase
                .from('order_items')
                .select(`
          product_name, quantity, total_amount,
          orders!inner(payment_status, created_at)
        `)
                .eq('orders.payment_status', 'paid')
                .gte('orders.created_at', start)
                .lte('orders.created_at', end);
            if (topProductsError) {
                throw new DatabaseError('Failed to fetch top products');
            }
            // Aggregate product sales
            const productSales = (topProducts || []).reduce((acc, item) => {
                if (!acc[item.product_name]) {
                    acc[item.product_name] = {
                        name: item.product_name,
                        quantity_sold: 0,
                        revenue: 0
                    };
                }
                acc[item.product_name].quantity_sold += item.quantity;
                acc[item.product_name].revenue += item.total_amount;
                return acc;
            }, {});
            const topProductsList = Object.values(productSales)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10);
            return {
                summary: {
                    total_orders: totalOrders,
                    confirmed_orders: confirmedOrders,
                    paid_orders: paidOrders,
                    total_revenue: totalRevenue,
                    average_order_value: Math.round(averageOrderValue),
                    conversion_rate: Math.round(conversionRate * 100) / 100
                },
                top_products: topProductsList,
                date_range: { start, end }
            };
        }
        catch (error) {
            console.error('Error fetching order analytics:', error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error fetching order analytics');
        }
    }
}
