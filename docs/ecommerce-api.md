# ZOROASTERVERSE E-commerce API Documentation

## Overview

This document describes the enhanced e-commerce API endpoints that provide complete shopping cart, order management, and Stripe integration functionality.

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the Supabase auth token in the `Authorization` header:
```
Authorization: Bearer <supabase_auth_token>
```

## Cart Management Endpoints

### Add Item to Cart
**POST** `/cart/add`

Adds a product variant to the user's cart.

**Body:**
```json
{
  "productId": "uuid",
  "variantId": "uuid", // optional
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "cartItem": {
    "id": "uuid",
    "cart_id": "uuid",
    "product_id": "uuid",
    "variant_id": "uuid",
    "quantity": 2,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Cart
**GET** `/cart`

Retrieves the user's current cart with products and variants.

**Response:**
```json
{
  "success": true,
  "cart": {
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "session_123",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "variant_id": "uuid",
        "quantity": 2,
        "product": {
          "name": "Product Name",
          "price": 29.99,
          "stripe_price_id": "price_123"
        },
        "variant": {
          "name": "Size: Large",
          "price": 29.99,
          "stripe_price_id": "price_456"
        }
      }
    ]
  }
}
```

### Update Cart Item
**PUT** `/cart/update`

Updates the quantity of a cart item.

**Body:**
```json
{
  "cartItemId": "uuid",
  "quantity": 3
}
```

### Remove Cart Item
**DELETE** `/cart/remove/:cartItemId`

Removes a specific item from the cart.

### Clear Cart
**DELETE** `/cart/clear`

Removes all items from the user's cart.

### Get Cart Count
**GET** `/cart/count`

Returns the total number of items in the cart.

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

## Order Management Endpoints

### Create Checkout Session
**POST** `/orders/checkout`

Creates a Stripe Checkout session for the current cart.

**Body:**
```json
{
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/cancel",
  "mode": "payment", // or "subscription"
  "metadata": {
    "order_type": "product_purchase"
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_123",
  "url": "https://checkout.stripe.com/pay/cs_123"
}
```

### Get Order History
**GET** `/orders/history`

Retrieves the user's order history.

**Query Parameters:**
- `limit` (optional): Number of orders to return (default: 20)
- `offset` (optional): Number of orders to skip (default: 0)
- `status` (optional): Filter by order status

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "total_amount": 59.98,
      "status": "completed",
      "created_at": "2024-01-01T00:00:00Z",
      "items": [
        {
          "product_name": "Product Name",
          "variant_name": "Size: Large",
          "quantity": 2,
          "price": 29.99
        }
      ]
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Order Details
**GET** `/orders/:orderId`

Retrieves detailed information about a specific order.

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "user_id": "uuid",
    "total_amount": 59.98,
    "currency": "usd",
    "status": "completed",
    "stripe_session_id": "cs_123",
    "stripe_payment_intent_id": "pi_123",
    "created_at": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "variant_id": "uuid",
        "quantity": 2,
        "unit_price": 29.99,
        "total_price": 59.98,
        "product": {
          "name": "Product Name",
          "description": "Product description"
        },
        "variant": {
          "name": "Size: Large",
          "attributes": {"size": "large"}
        }
      }
    ]
  }
}
```

## Admin Endpoints

### Update Order Status
**PUT** `/orders/:orderId/status`

Updates the status of an order (admin only).

**Body:**
```json
{
  "status": "shipped",
  "notes": "Tracking number: 123456789"
}
```

## Webhook Endpoints

### Stripe Webhook
**POST** `/webhook`

Handles Stripe webhook events for:
- Product and price synchronization
- Checkout session completion
- Payment processing
- Subscription management
- Invoice handling
- Customer updates
- Dispute management

This endpoint is called automatically by Stripe and should not be called manually.

## Product Management (Enhanced)

### Create Product with Stripe Integration
**POST** `/api/products-v2`

Creates a product in both Supabase and Stripe.

**Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "currency": "usd",
  "category": "electronics",
  "images": ["https://example.com/image.jpg"],
  "variants": [
    {
      "name": "Size: Large",
      "price": 29.99,
      "attributes": {"size": "large"},
      "inventory_quantity": 100
    }
  ],
  "createInStripe": true
}
```

### Sync with Stripe
**POST** `/api/products-v2/sync-stripe`

Synchronizes products and prices between Supabase and Stripe.

**Body:**
```json
{
  "direction": "both", // "stripe_to_supabase", "supabase_to_stripe", or "both"
  "productIds": ["uuid1", "uuid2"] // optional, sync specific products
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid auth token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., insufficient inventory)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited to 100 requests per 15-minute window per IP address.

## Security

- All endpoints use HTTPS in production
- Authentication tokens are validated on each request
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS is configured for frontend domains only

## Notes

- Cart items are automatically cleaned up after 30 days of inactivity
- Anonymous users can add items to cart using session-based identification
- Inventory is automatically decremented when orders are completed
- Failed payments do not affect inventory levels
- Digital products grant access automatically upon successful payment
