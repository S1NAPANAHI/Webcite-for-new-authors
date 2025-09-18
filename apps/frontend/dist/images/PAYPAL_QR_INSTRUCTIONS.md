# PayPal QR Code Setup

## 📥 Save Your QR Code Here

Please save your PayPal donation QR code image as `paypal-qr.png` in this directory.

**Required filename:** `paypal-qr.png`

## 🎯 Component Usage

The PayPalButton component will automatically load the QR code from `/images/paypal-qr.png`.

## ✨ Features

When users click the "☕ Buy me a coffee" button, it will:
1. Expand with a smooth animation
2. Show a card containing your QR code
3. Include instructions for scanning
4. Provide a fallback link for direct donations
5. Include a backdrop that can be clicked to close

## 🔧 Custom Configuration

You can also customize the button by passing props:

```tsx
<PayPalButton 
  buttonId="YOUR_ACTUAL_PAYPAL_BUTTON_ID"
  text="🚀 Support the project"
  qrCodeImage="/images/custom-qr.png"
/>
```
