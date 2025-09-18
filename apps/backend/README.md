# Zoroasterverse E-commerce Backend

A complete e-commerce backend for digital eBook sales and subscriptions, built with Node.js, Express, PostgreSQL, and Stripe integration.

## 🚀 Features

- **One-time purchases** with secure file delivery
- **Subscription management** with trial periods and recurring billing
- **Stripe integration** for secure payment processing
- **AWS S3 integration** for secure file storage and delivery
- **Email notifications** for purchases and subscription events
- **Webhook handling** for real-time payment updates
- **Comprehensive analytics** and reporting
- **RESTful API** with proper error handling and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Payment**: Stripe
- **File Storage**: AWS S3
- **Email**: SendGrid
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- AWS Account with S3 access
- Stripe Account
- SendGrid Account

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd src/backend
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/zoroasterverse
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zoroasterverse
DB_USER=your_username
DB_PASSWORD=your_password

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=zoroasterverse-ebooks

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@zoroasterverse.com

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

Create a PostgreSQL database and run the schema:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zoroasterverse;

# Connect to the database
\c zoroasterverse

# Run the schema (copy and paste the contents of database/schema.sql)
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Create products and prices in Stripe Dashboard
4. Set up webhooks pointing to `/api/webhooks/stripe`
5. Copy the webhook signing secret to your `.env` file

### AWS S3 Setup

1. Create an S3 bucket for your eBooks
2. Configure CORS policy for your bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

3. Create an IAM user with S3 access
4. Copy the access key and secret to your `.env` file

### SendGrid Setup

1. Create a SendGrid account
2. Generate an API key
3. Verify your sender domain
4. Copy the API key to your `.env` file

## 📚 API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Archive product
- `POST /api/products/:id/files` - Upload product file

### Stripe Integration

- `POST /api/stripe/create-checkout-session` - Create one-time purchase session
- `POST /api/stripe/create-subscription-session` - Create subscription session
- `POST /api/stripe/create-portal-session` - Customer portal access
- `GET /api/stripe/customer/:customerId` - Get customer details
- `POST /api/stripe/refund` - Process refunds

### Orders

- `GET /api/orders` - List all orders (admin)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/user/:userId` - Get user's orders
- `POST /api/orders/:id/download-links` - Generate download links

### Subscriptions

- `GET /api/subscriptions` - List all subscriptions (admin)
- `GET /api/subscriptions/:id` - Get subscription details
- `GET /api/subscriptions/user/:userId` - Get user's subscriptions
- `POST /api/subscriptions/:id/cancel` - Cancel subscription
- `POST /api/subscriptions/:id/reactivate` - Reactivate subscription

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook endpoint

## 🔒 Security Features

- **CORS protection** with configurable origins
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers
- **Input validation** and sanitization
- **Webhook signature verification** for Stripe
- **Secure file delivery** with expiring URLs

## 📊 Database Schema

The database includes tables for:

- **users** - Customer accounts and Stripe customer IDs
- **products** - eBook information and metadata
- **prices** - Stripe price IDs and subscription details
- **orders** - Purchase records and payment status
- **subscriptions** - Subscription management and billing cycles
- **files** - File storage metadata and S3 keys
- **downloads** - Download tracking and analytics
- **webhook_events** - Event logging for debugging

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use a secure secret management system
2. **Database**: Use managed PostgreSQL service (e.g., AWS RDS)
3. **File Storage**: Configure S3 bucket policies and CDN
4. **SSL**: Ensure HTTPS is enabled
5. **Monitoring**: Set up logging and error tracking
6. **Backups**: Regular database and file backups

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Environment-Specific Configs

Create environment-specific configuration files:

- `.env.development`
- `.env.staging`
- `.env.production`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📈 Monitoring and Analytics

The system provides comprehensive analytics:

- **Order metrics**: Total orders, revenue, conversion rates
- **Subscription metrics**: MRR, churn rate, trial conversions
- **File analytics**: Download patterns and usage
- **Payment analytics**: Success rates, failure reasons

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**: Check PostgreSQL service and credentials
2. **Stripe Webhooks**: Verify webhook endpoint and signing secret
3. **S3 Uploads**: Check AWS credentials and bucket permissions
4. **Email Delivery**: Verify SendGrid API key and sender verification

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=*
```

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [SendGrid Documentation](https://sendgrid.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy coding! 🚀**
