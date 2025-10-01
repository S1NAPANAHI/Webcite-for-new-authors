const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@zoroastervers.com';

/**
 * Send purchase confirmation email with download links
 * @param {string} to - Recipient email
 * @param {Object} data - Purchase data
 * @returns {Promise<Object>} SendGrid response
 */
async function sendPurchaseEmail(to, data) {
  try {
    const { orderId, productId, downloadUrls, expiresIn } = data;
    
    const downloadLinksHtml = downloadUrls.map(url => 
      `<li><strong>${url.format.toUpperCase()}:</strong> <a href="${url.url}" style="color: #6d8bff; text-decoration: none;">Download ${url.format.toUpperCase()}</a> (expires in ${url.expiresIn})</li>`
    ).join('');

    const msg = {
      to,
      from: FROM_EMAIL,
      subject: '🎉 Your Zoroastervers eBook is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your eBook is Ready</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6d8bff, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .download-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6d8bff; }
            .download-links { list-style: none; padding: 0; }
            .download-links li { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .btn { display: inline-block; padding: 12px 24px; background: #6d8bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your eBook is Ready!</h1>
              <p>Thank you for your purchase from Zoroastervers</p>
            </div>
            
            <div class="content">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Product ID:</strong> ${productId}</p>
              
              <div class="download-section">
                <h3>📚 Download Your eBook</h3>
                <p>Your download links are ready. Please note that these links expire in <strong>${expiresIn}</strong> for security reasons.</p>
                
                <ul class="download-links">
                  ${downloadLinksHtml}
                </ul>
                
                <p style="margin-top: 20px;">
                  <strong>Important:</strong> If you need to download your files again after the links expire, 
                  please log into your account or contact our support team.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CORS_ORIGIN}/library" class="btn">View My Library</a>
                <a href="${process.env.CORS_ORIGIN}/support" class="btn">Get Support</a>
              </div>
              
              <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>📖 Reading Tips</h4>
                <ul>
                  <li>For the best reading experience, we recommend using dedicated eBook readers</li>
                  <li>PDF files work great on all devices</li>
                  <li>EPUB files are perfect for e-readers and mobile devices</li>
                  <li>MOBI files are compatible with Kindle devices</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Zoroastervers!</p>
              <p>If you have any questions, please contact us at support@zoroastervers.com</p>
<p>© ${new Date().getFullYear()} Zoroastervers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const response = await sgMail.send(msg);
    console.log(`📧 Purchase confirmation email sent to ${to}`);
    return response;

  } catch (error) {
    console.error('❌ Error sending purchase email:', error);
    throw new Error('Failed to send purchase confirmation email');
  }
}

/**
 * Send subscription-related emails
 * @param {string} to - Recipient email
 * @param {string} type - Email type (welcome, trial_ending, payment_failed, etc.)
 * @param {Object} data - Subscription data
 * @returns {Promise<Object>} SendGrid response
 */
async function sendSubscriptionEmail(to, type, data) {
  try {
    let subject, html;

    switch (type) {
      case 'welcome':
        subject = '🎉 Welcome to Zoroastervers!';
        html = generateWelcomeEmail(data);
        break;
      
      case 'trial_ending':
        subject = '⏰ Your Zoroastervers Trial is Ending Soon';
        html = generateTrialEndingEmail(data);
        break;
      
      case 'payment_failed':
        subject = '❌ Payment Failed - Action Required';
        html = generatePaymentFailedEmail(data);
        break;
      
      case 'subscription_canceled':
        subject = '👋 Your Zoroastervers Subscription Has Been Canceled';
        html = generateSubscriptionCanceledEmail(data);
        break;
      
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const msg = {
      to,
      from: FROM_EMAIL,
      subject,
      html
    };

    const response = await sgMail.send(msg);
    console.log(`📧 ${type} subscription email sent to ${to}`);
    return response;

  } catch (error) {
    console.error('❌ Error sending subscription email:', error);
    throw new Error(`Failed to send ${type} subscription email`);
  }
}

/**
 * Generate welcome email HTML for new subscribers
 */
function generateWelcomeEmail(data) {
  const { subscriptionId, productId, trialEnd } = data;
  const hasTrial = trialEnd && trialEnd > Date.now() / 1000;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Zoroastervers</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6d8bff, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .trial-info { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #6d8bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Zoroastervers!</h1>
          <p>Your subscription is now active</p>
        </div>
        
        <div class="content">
          <h2>Subscription Details</h2>
          <p><strong>Subscription ID:</strong> ${subscriptionId}</p>
          <p><strong>Product ID:</strong> ${productId}</p>
          
          ${hasTrial ? `
            <div class="trial-info">
              <h3>🎁 Free Trial Active</h3>
              <p>Your free trial ends on <strong>${new Date(trialEnd * 1000).toLocaleDateString()}</strong>.</p>
              <p>You can cancel anytime before the trial ends and won't be charged.</p>
            </div>
          ` : ''}
          
          <h3>What's Next?</h3>
          <ul>
            <li>Access your exclusive content in the library</li>
            <li>Download new releases as they become available</li>
            <li>Enjoy early access to upcoming content</li>
            <li>Participate in the Zoroastervers community</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ORIGIN}/library" class="btn">Access My Library</a>
            <a href="${process.env.CORS_ORIGIN}/account" class="btn">Manage Subscription</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Welcome to the Zoroastervers family!</p>
          <p>© ${new Date().getFullYear()} Zoroastervers. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate trial ending email HTML
 */
function generateTrialEndingEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trial Ending Soon</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ffa726); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #6d8bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Trial Ending Soon</h1>
          <p>Don't lose access to Zoroastervers</p>
        </div>
        
        <div class="content">
          <div class="warning">
            <h3>⚠️ Your free trial is ending soon!</h3>
            <p>To continue enjoying unlimited access to Zoroastervers content, please ensure your payment method is up to date.</p>
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>Your subscription will automatically continue</li>
            <li>You'll be charged the regular subscription fee</li>
            <li>You can cancel anytime from your account settings</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ORIGIN}/account" class="btn">Update Payment Method</a>
            <a href="${process.env.CORS_ORIGIN}/support" class="btn">Get Help</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at support@zoroastervers.com</p>
          <p>© ${new Date().getFullYear()} Zoroastervers. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate payment failed email HTML
 */
function generatePaymentFailedEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #d32f2f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .error { background: #ffebee; padding: 20px; border-radius: 8px; border-left: 4px solid #f44336; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #6d8bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Payment Failed</h1>
          <p>Action required to restore access</p>
        </div>
        
        <div class="content">
          <div class="error">
            <h3>🚨 Payment Processing Failed</h3>
            <p>We were unable to process your subscription payment. This could be due to:</p>
            <ul>
              <li>Expired or invalid payment method</li>
              <li>Insufficient funds</li>
              <li>Bank declined the transaction</li>
            </ul>
          </div>
          
          <h3>What you need to do:</h3>
          <ol>
            <li>Update your payment method</li>
            <li>Ensure sufficient funds are available</li>
            <li>Contact your bank if the issue persists</li>
          </ol>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ORIGIN}/account" class="btn">Update Payment Method</a>
            <a href="${process.env.CORS_ORIGIN}/support" class="btn">Contact Support</a>
          </div>
          
          <p><strong>Note:</strong> Your access will be restored immediately once payment is successful.</p>
        </div>
        
        <div class="footer">
          <p>Need help? Contact us at support@zoroastervers.com</p>
          <p>© ${new Date().getFullYear()} Zoroastervers. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate subscription canceled email HTML
 */
function generateSubscriptionCanceledEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Canceled</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9e9e9e, #757575); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #6d8bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 Subscription Canceled</h1>
          <p>We're sorry to see you go</p>
        </div>
        
        <div class="content">
          <div class="info">
            <h3>ℹ️ What happens next?</h3>
            <p>Your subscription has been canceled. You'll continue to have access until the end of your current billing period.</p>
          </div>
          
          <h3>We'd love to have you back!</h3>
          <p>If you change your mind, you can reactivate your subscription anytime from your account settings.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ORIGIN}/account" class="btn">Reactivate Subscription</a>
            <a href="${process.env.CORS_ORIGIN}/support" class="btn">Give Feedback</a>
          </div>
          
          <p>Thank you for being part of the Zoroastervers community!</p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at support@zoroastervers.com</p>
          <p>© ${new Date().getFullYear()} Zoroastervers. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  sendPurchaseEmail,
  sendSubscriptionEmail
};