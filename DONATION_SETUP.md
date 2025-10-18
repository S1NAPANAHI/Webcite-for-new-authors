# Donation & Support Setup Guide

This guide will help you customize the donation and support functionality that has been added to your Zoroastervers website.

## 🎯 What's Been Added

### 1. Support Page (`/support`)
- Comprehensive donation page with multiple payment options
- Beautiful UI with donation tiers and impact stats
- Support for Buy Me a Coffee, PayPal, and cryptocurrency donations
- Custom amount inputs and quick donation buttons
- Community support options (non-monetary)

### 2. Reusable Components
- **BuyMeACoffeeWidget**: Customizable Buy Me a Coffee button/widget
- **PayPalDonationButton**: Flexible PayPal donation component
- **CryptoWalletDonation**: Multi-cryptocurrency wallet display

## 🔧 Customization Steps

### Step 1: Update Your Account Information

#### Buy Me a Coffee
1. Replace the username in `SupportPage.tsx`:
   ```typescript
   // Line ~100 - Replace with your actual Buy Me a Coffee username
   window.open('https://www.buymeacoffee.com/YOUR_USERNAME', '_blank');
   ```

2. Update the widget component default:
   ```typescript
   // In BuyMeACoffeeWidget.tsx, line 11
   username = 'YOUR_USERNAME'
   ```

#### PayPal Setup
1. **Option A: PayPal.me** (Simplest)
   - Replace in `SupportPage.tsx` and `PayPalDonationButton.tsx`:
   ```typescript
   paypalId = 'YOUR_PAYPAL_ME_USERNAME'
   ```

2. **Option B: Direct Email**
   - Replace with your PayPal business email:
   ```typescript
   paypalId = 'your-paypal-email@example.com'
   ```

3. **Option C: PayPal Hosted Button** (Most Professional)
   - Create a donation button at [PayPal's button creator](https://www.paypal.com/donate/buttons)
   - Get your hosted button ID
   - Replace in components:
   ```typescript
   buttonId = 'YOUR_PAYPAL_BUTTON_ID'
   ```

#### Cryptocurrency Wallets
1. Replace wallet addresses in `SupportPage.tsx` (lines ~20-25):
   ```typescript
   const cryptoWallets = {
     bitcoin: "YOUR_BITCOIN_ADDRESS",
     ethereum: "YOUR_ETHEREUM_ADDRESS",
     solana: "YOUR_SOLANA_ADDRESS",
     cardano: "YOUR_CARDANO_ADDRESS"
   };
   ```

2. Update the default wallets in `CryptoWalletDonation.tsx` (lines ~30-60)

### Step 2: Customize Donation Tiers

Edit the donation tiers in `SupportPage.tsx` (lines ~15-35):

```typescript
const donationTiers: DonationTier[] = [
  {
    name: "Your Custom Tier Name",
    amount: 10, // Amount in USD
    description: "What this tier supports",
    benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],
    popular: false // Set to true for highlighted tier
  },
  // Add more tiers as needed
];
```

### Step 3: Update Impact Stats

Modify the impact statistics in `SupportPage.tsx` (around line 60):

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  <Card className="text-center">
    <CardContent className="pt-6">
      <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
      <h3 className="font-semibold mb-1">Your Statistic</h3>
      <p className="text-sm text-muted-foreground">Description</p>
    </CardContent>
  </Card>
  // Repeat for other stats
</div>
```

### Step 4: Add to Navigation (Optional)

To add a "Support" link to your main navigation, update your Layout component to include:

```typescript
// Add to your navigation items
{
  name: 'Support',
  href: '/support',
  icon: HeartIcon // Import from lucide-react
}
```

## 🎨 Using Components Individually

### Buy Me a Coffee Widget

```tsx
import BuyMeACoffeeWidget from '@/components/BuyMeACoffeeWidget';

// Simple button
<BuyMeACoffeeWidget username="yourusername" />

// Card format
<BuyMeACoffeeWidget 
  username="yourusername" 
  variant="card" 
  className="max-w-sm"
/>

// Floating button (appears in bottom-right corner)
<BuyMeACoffeeWidget 
  username="yourusername" 
  variant="floating" 
/>
```

### PayPal Donation Button

```tsx
import PayPalDonationButton from '@/components/PayPalDonationButton';

// Simple button
<PayPalDonationButton paypalId="yourusername" />

// Card with quick amounts
<PayPalDonationButton 
  paypalId="yourusername" 
  variant="card"
  quickAmounts={[5, 15, 30, 50]}
/>

// Amount selection grid
<PayPalDonationButton 
  paypalId="yourusername" 
  variant="amounts"
/>
```

### Crypto Wallet Display

```tsx
import CryptoWalletDonation from '@/components/CryptoWalletDonation';

// Full detailed view
<CryptoWalletDonation />

// Compact list
<CryptoWalletDonation variant="compact" />

// Grid layout
<CryptoWalletDonation variant="grid" />

// Custom wallets
<CryptoWalletDonation 
  wallets={[
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: 'your-btc-address',
      color: 'text-orange-500'
    }
  ]}
/>
```

## 🚀 Quick Integration Examples

### Add to Homepage

```tsx
// Add to your HomePage.tsx
import BuyMeACoffeeWidget from '@/components/BuyMeACoffeeWidget';

<section className="py-12">
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold mb-4">Support the Project</h2>
    <BuyMeACoffeeWidget variant="card" className="max-w-md mx-auto" />
  </div>
</section>
```

### Add to Footer

```tsx
// Add to your Layout/Footer component
<div className="flex items-center space-x-4">
  <BuyMeACoffeeWidget size="sm" />
  <PayPalDonationButton className="text-sm" />
</div>
```

### Floating Support Button

```tsx
// Add anywhere in your app for a persistent donation button
<BuyMeACoffeeWidget variant="floating" />
```

## 🎯 Testing

1. **Test Buy Me a Coffee**: Verify the link opens to your correct profile
2. **Test PayPal**: Ensure the donation link goes to the right account
3. **Test Crypto**: Double-check all wallet addresses are correct
4. **Mobile Testing**: Test the responsive design on mobile devices

## 🔒 Security Notes

1. **Crypto Addresses**: Always double-check wallet addresses - they cannot be recovered if incorrect
2. **PayPal**: Use PayPal's hosted buttons for better security
3. **SSL**: Ensure your site uses HTTPS for all payment links

## 🎨 Styling Customization

All components use Tailwind CSS and shadcn/ui components. You can customize colors, sizes, and layouts by:

1. Modifying the className props
2. Updating the component's internal styling
3. Using your existing design system colors

## 📈 Analytics (Optional)

To track donation button clicks, you can add analytics events:

```typescript
// Add to button onClick handlers
const handleDonationClick = () => {
  // Google Analytics
  gtag('event', 'donation_click', {
    event_category: 'donation',
    event_label: 'buy_me_coffee'
  });
  
  // Your donation logic
};
```

---

## 🆘 Need Help?

If you need assistance customizing these components:

1. Check the component props and interfaces
2. Look at the example usage above
3. Test changes incrementally
4. Remember to update both the actual values and any default/placeholder values

Enjoy your new donation system! 🚀✨