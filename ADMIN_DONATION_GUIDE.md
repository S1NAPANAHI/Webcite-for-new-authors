# Admin Donation Management Guide

Your Zoroastervers website now has a complete donation management system accessible through your admin area at `/admin/donations`. This guide will walk you through using the admin interface to manage all aspects of your donation system.

## 🚪 Access Your Donation Management

1. **Login to Admin**: Go to [https://www.zoroastervers.com/admin](https://www.zoroastervers.com/admin)
2. **Navigate to Donations**: Click on "Donation Management" in the sidebar (Heart icon ❤️)
3. **Start Managing**: Use the comprehensive admin interface to configure everything

## 🗺️ Admin Interface Overview

Your donation management interface has **5 main tabs**:

### 1. **Overview Tab** - Your Dashboard
- **Goal Progress**: See your current fundraising progress percentage
- **Active Tiers**: Count of enabled donation tiers
- **Payment Methods**: Status of configured payment options
- **Page Status**: Whether the donation page is live or disabled
- **Quick Actions**: Copy support URL, add tiers, preview page, refresh stats
- **Live Summary**: See which tiers and payment methods are currently active

### 2. **Page Settings Tab** - Customize Your Page
- **Basic Configuration**:
  - Enable/disable the entire donation page
  - Edit page title (appears as the main heading)
  - Edit page description (the introductory paragraph)
  - Customize thank you message

- **Goal & Progress**:
  - Set your fundraising goal amount
  - Update current amount raised
  - Enable/disable progress bar display
  - Live preview of progress bar

- **Widget Settings**:
  - Show donation widget on homepage
  - Enable floating donation button
  - Future widget placement options

### 3. **Donation Tiers Tab** - Manage Support Levels
- **Add New Tiers**: Create custom donation levels
- **Edit Existing Tiers**:
  - Tier name (e.g., "Coffee Supporter")
  - Amount in USD
  - Description of what the tier supports
  - Benefits list (one per line)
  - Mark as "popular" (highlighted with special styling)
  - Enable/disable individual tiers

- **Smart Features**:
  - Only one tier can be marked as "popular" at a time
  - Disabled tiers appear grayed out
  - Delete tiers you no longer need
  - Reorder tiers (coming soon)

### 4. **Payment Methods Tab** - Configure Payment Options

#### **Buy Me a Coffee**
- Enable/disable Buy Me a Coffee integration
- Set your Buy Me a Coffee username
- Test link functionality
- Links automatically go to: `https://www.buymeacoffee.com/[username]`

#### **Ko-fi** 
- Enable/disable Ko-fi integration
- Set your Ko-fi username
- Test link functionality
- Links automatically go to: `https://ko-fi.com/[username]`

#### **PayPal**
- **Three configuration options**:
  1. **PayPal.me**: Just enter your PayPal.me username
  2. **Email**: Use your PayPal business email
  3. **Hosted Button**: Get a button ID from PayPal's donation button creator
- **Quick Amounts**: Set predefined donation amounts (comma-separated)
- **Test Links**: Verify your PayPal configuration works

#### **Cryptocurrency**
- **Multi-wallet support**: Add unlimited cryptocurrency wallets
- **For each wallet**:
  - Currency Name (e.g., "Bitcoin")
  - Symbol (e.g., "BTC") 
  - Wallet Address (your actual wallet address)
- **Features**:
  - Copy wallet addresses for testing
  - Add/remove wallets as needed
  - Security warnings for users
  - Blockchain explorer integration (coming soon)

### 5. **Analytics Tab** - Track Performance
- **Current Stats**:
  - Total amount raised
  - Monthly donations
  - Number of supporters
  - Most popular tier
- **Future Analytics** (coming soon):
  - Donation trends over time
  - Payment method preferences
  - Tier conversion rates
  - Geographic distribution
  - Seasonal patterns

## 🚀 Quick Setup Steps

### **Step 1: Basic Configuration (2 minutes)**
1. Go to **Page Settings** tab
2. Enable the donation page
3. Customize the page title and description
4. Set your fundraising goal and current amount

### **Step 2: Configure Payment Methods (5 minutes)**
1. Go to **Payment Methods** tab
2. **Buy Me a Coffee**: Add your username
3. **PayPal**: Add your PayPal.me username or email
4. **Crypto**: Add your wallet addresses (copy from your actual wallets)
5. **Test all links** using the test buttons

### **Step 3: Set Up Donation Tiers (3 minutes)**
1. Go to **Donation Tiers** tab
2. Edit the existing tiers or create new ones
3. Set appropriate amounts ($5, $15, $50, $100 are good defaults)
4. Mark one tier as "popular" for highlighting
5. Add compelling benefits for each tier

### **Step 4: Test & Launch (2 minutes)**
1. **Save your changes** using the "Save Changes" button
2. **Preview the page** using "Preview Page" button
3. **Test all payment methods** to ensure they work
4. **Share the link**: Your donation page is at `/support`

## 🔐 Key Features

### **Admin-Friendly**
- **Real-time preview**: See changes as you make them
- **Unsaved changes warning**: Never lose your work
- **Export settings**: Backup your configuration
- **Test buttons**: Verify all payment methods work
- **Copy functionality**: Easy sharing of support page URL

### **User-Friendly Public Page**
- **Responsive design**: Works perfectly on all devices
- **Progress tracking**: Shows fundraising goal progress
- **Security warnings**: Educates users about crypto safety
- **Multiple payment options**: Accommodates different preferences
- **Professional appearance**: Modern, trustworthy design

### **Smart Management**
- **Context-based**: Settings persist across admin sessions
- **Validation**: Prevents invalid configurations
- **Security**: Wallet address validation and warnings
- **Flexibility**: Easy to add/remove payment methods and tiers

## ⚠️ Important Security Notes

### **Cryptocurrency Wallets**
1. **Double-check addresses**: Copy from your actual wallet apps
2. **Test with small amounts**: Send a small test transaction first
3. **Keep private keys safe**: Never share private keys anywhere
4. **Use reputable wallets**: Stick to well-known wallet providers

### **PayPal Configuration**
1. **Use business accounts** for better protection
2. **Enable PayPal hosted buttons** for better security
3. **Monitor transactions** regularly
4. **Set up proper accounting** for tax purposes

## 📈 Advanced Usage

### **Custom Integration**
You can integrate donation widgets anywhere on your site:

```tsx
// Add to any page
import BuyMeACoffeeWidget from '@/components/BuyMeACoffeeWidget';

<BuyMeACoffeeWidget 
  variant="floating" // Floating button in corner
  username="yourusername" 
/>
```

### **Goal Campaigns**
- Set specific goals (e.g., $1000 for new book cover art)
- Update progress regularly
- Use the progress bar to motivate donors
- Celebrate when goals are reached

### **Seasonal Campaigns**
- Create special tiers for holidays or book releases
- Temporarily adjust amounts or benefits
- Add time-limited popular tier designations

## 🚑 Troubleshooting

### **Payment Method Not Working?**
1. Check the **Payment Methods** tab
2. Ensure the method is **enabled**
3. Verify the **configuration** (username, email, wallet address)
4. Use **test buttons** to verify links work
5. Check for **typos** in usernames and addresses

### **Page Not Showing Changes?**
1. **Save changes** in the admin area first
2. **Refresh** the support page
3. **Clear browser cache** if needed
4. Check if donations are **enabled** in Page Settings

### **Crypto Addresses Not Working?**
1. **Double-check** wallet addresses character by character
2. **Copy directly** from your wallet app
3. **Test** with a small amount first
4. Ensure you're using the **correct network** (mainnet, not testnet)

## 📊 Analytics & Tracking

### **Current Tracking**
- Goal progress percentage
- Active tiers and payment methods count
- Basic statistics display

### **Coming Soon**
- Detailed donation analytics
- Payment method performance
- Tier popularity analysis
- Donor geographic data
- Trend analysis

## 🎆 Best Practices

### **Tier Strategy**
- **Start small**: $5-10 entry level
- **Popular tier**: $15-25 sweet spot
- **Premium tiers**: $50+ with exclusive benefits
- **Make benefits clear**: Specific, tangible rewards
- **Update regularly**: Keep benefits fresh and relevant

### **Payment Method Strategy**
- **Enable multiple options**: Accommodate different preferences
- **Start simple**: Buy Me a Coffee + PayPal is a good start
- **Add crypto later**: Once you're comfortable with wallet management
- **Test everything**: Before announcing to your audience

### **Goal Setting**
- **Be realistic**: Set achievable initial goals
- **Be specific**: "$500 for new book cover" vs "Help my writing"
- **Update regularly**: Keep progress current
- **Celebrate milestones**: Thank supporters when goals are met

---

## 🆘 Need Help?

**Access your donation management anytime at**: [https://www.zoroastervers.com/admin/donations](https://www.zoroastervers.com/admin/donations)

**Your donation page is live at**: [https://www.zoroastervers.com/support](https://www.zoroastervers.com/support)

The system is designed to be intuitive and powerful. Start with basic settings and gradually add more payment methods and tiers as you become comfortable with the system.

Happy fundraising for your Zoroastervers project! 🚀✨