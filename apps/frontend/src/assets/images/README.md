# PayPal QR Code Image

Please save your PayPal QR code image as `paypal-qr.png` in this directory.

The image should be:
- Named: `paypal-qr.png`
- Format: PNG (recommended) or JPG
- Size: Ideally 200x200px or larger (square aspect ratio)
- Quality: High enough to be scannable when displayed at 180x180px

The PayPalButton component will automatically use this image when the QR card expands.

## Alternative placement options:
- You can also place it in `public/images/paypal-qr.png` and update the component prop to use `/images/paypal-qr.png`
- Or use any other path and pass it as the `qrCodeImage` prop to the PayPalButton component
