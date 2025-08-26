# Zoroasterverse Shop Page

## Overview
The shop page is a comprehensive e-commerce interface designed specifically for the Zoroasterverse brand. It features a beautiful, sci-fi fantasy aesthetic that matches the overall website theme.

## Features

### 🛍️ Product Display
- **Product Cards**: Beautiful, responsive product cards with hover effects
- **Cover Images**: Support for product cover images with fallback designs
- **Product Information**: Title, description, formats, pricing, and metadata
- **Status Badges**: Visual indicators for availability, bundles, and subscriptions

### 🔍 Search & Filtering
- **Search Bar**: Real-time search through product titles and descriptions
- **Category Filters**: Filter by Single Books, Bundles, or Subscriptions
- **Format Filters**: Filter by PDF, EPUB, or other available formats
- **Price Range**: Slider-based price filtering
- **Sorting Options**: Sort by newest, oldest, price, or alphabetical order

### 🎨 Visual Design
- **Responsive Grid**: Adapts from 1 column on mobile to 4 columns on desktop
- **View Modes**: Toggle between grid and list views
- **Glassmorphism**: Modern glass-like card effects with backdrop blur
- **Hover Animations**: Smooth transitions and hover effects
- **Color Scheme**: Consistent with Zoroasterverse brand colors

### 🛒 Shopping Cart
- **Add to Cart**: Add products to cart with visual feedback
- **Cart Icon**: Persistent cart icon in navbar with item count badge
- **Cart Dropdown**: Quick view of cart contents with quantity controls
- **Cart Management**: Add, remove, and update quantities
- **Checkout Flow**: Seamless transition to checkout page

### 💳 Checkout Process
- **Order Summary**: Clear overview of cart contents and totals
- **Customer Form**: Collect customer information
- **Payment Options**: Credit/debit card support
- **Security Features**: Secure checkout with encryption notices
- **Success Handling**: Order confirmation and cart clearing

## Components

### StorePage
Main shop page component with search, filters, and product grid.

### ProductCard
Individual product display with add to cart, buy now, and sample preview.

### CartIcon
Shopping cart icon with dropdown cart management.

### CartContext
Global state management for shopping cart across the application.

### CheckoutPage
Complete checkout process with order summary and payment form.

### LoadingSkeleton
Loading states for products while data is being fetched.

## Usage

### Adding Products
Products are currently using mock data. To integrate with real data:

1. Replace `mockProducts` in `StorePage.tsx` with API calls
2. Update the product interface to match your data structure
3. Implement proper error handling and loading states

### Customizing Styles
The shop uses Tailwind CSS with custom color variables defined in `tailwind.config.js`:

- `primary`: Red tones for primary actions
- `secondary`: Amber/gold tones for highlights
- `accent`: Cyan tones for interactive elements
- `background`: Dark theme colors
- `text`: Text color variations

### Adding New Features
To extend the shop functionality:

1. **New Filters**: Add filter options to the filter state and UI
2. **Product Types**: Extend the product interface for new product categories
3. **Payment Methods**: Integrate additional payment gateways
4. **Inventory**: Add stock management and availability tracking

## Technical Details

### State Management
- Uses React Context for cart state
- Local state for search, filters, and UI interactions
- Responsive design with mobile-first approach

### Performance
- Lazy loading for product images
- Efficient filtering and sorting algorithms
- Optimized re-renders with proper dependency arrays

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management for modals and dropdowns
- High contrast color schemes

### Browser Support
- Modern browsers with ES6+ support
- Responsive design for all screen sizes
- Progressive enhancement for older browsers

## Future Enhancements

- **Wishlist**: Save products for later
- **Product Reviews**: Customer feedback system
- **Related Products**: Recommendation engine
- **Inventory Tracking**: Real-time stock updates
- **Analytics**: Shopping behavior tracking
- **A/B Testing**: Conversion optimization
- **Mobile App**: Native mobile experience
- **Offline Support**: PWA capabilities

## Getting Started

1. Ensure all dependencies are installed
2. Start the development server
3. Navigate to `/store` to view the shop
4. Test the cart functionality by adding products
5. Complete a test checkout flow

The shop page is designed to be both beautiful and functional, providing an excellent user experience while maintaining the unique Zoroasterverse aesthetic.
