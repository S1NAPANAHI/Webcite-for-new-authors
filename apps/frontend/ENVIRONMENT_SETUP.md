# Environment Setup for Zoroasterverse Shop

## Quick Setup

1. **Copy the environment template:**
   ```bash
   copy env.example .env
   ```

2. **Edit the `.env` file** and add your actual values:
   ```env
   # Stripe Configuration (Required for checkout)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_key_here
   
   # API Configuration (Optional)
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_BACKEND_URL=http://localhost:3001
   ```

## Stripe Setup

### 1. Get Your Stripe Keys
- Sign up at [stripe.com](https://stripe.com)
- Go to Dashboard → Developers → API keys
- Copy your **Publishable key** (starts with `pk_test_` for testing)

### 2. Update Environment File
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG
```

### 3. Test Mode vs Live Mode
- **Test Mode**: Use `pk_test_...` keys (safe for development)
- **Live Mode**: Use `pk_live_...` keys (for production)

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payments | ✅ Yes | `pk_test_your_key_here` |
| `VITE_API_BASE_URL` | Backend API base URL | ❌ No | `http://localhost:3001/api` |
| `VITE_BACKEND_URL` | Backend server URL | ❌ No | `http://localhost:3001` |
| `VITE_APP_NAME` | Application name | ❌ No | `Zoroasterverse` |
| `VITE_DEBUG` | Enable debug mode | ❌ No | `true` |

## Development vs Production

### Development
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Production
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_DEBUG=false
VITE_LOG_LEVEL=error
```

## Troubleshooting

### "Stripe Not Configured" Error
- Check that `.env` file exists in the `src/frontend` directory
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
- Restart the development server after changing environment variables

### Environment Variables Not Loading
- Ensure variable names start with `VITE_`
- Restart the development server
- Check that `.env` file is in the correct location

### Stripe Integration Issues
- Verify your Stripe key is valid
- Check Stripe dashboard for any account issues
- Ensure you're using the correct key type (test vs live)

## Security Notes

- **Never commit `.env` files** to version control
- **Keep your Stripe secret keys secure** (only on backend)
- **Use test keys** for development and testing
- **Rotate keys regularly** for production security

## Next Steps

After setting up environment variables:

1. **Test the shop page** at `/store`
2. **Add products to cart** and test checkout flow
3. **Configure backend API** for real product data
4. **Set up Stripe webhooks** for payment processing
5. **Test with real Stripe test cards**

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Stripe account is properly configured
4. Check the development server logs
