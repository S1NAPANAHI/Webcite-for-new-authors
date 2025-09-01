import React from 'react';

const StripeTest: React.FC = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  console.log('🔑 Stripe key loaded:', stripeKey);
  console.log('🔑 Environment variables:', import.meta.env);
  
  const keyStatus = stripeKey ? `Found: ${stripeKey.substring(0, 20)}...` : 'Not found';
  const keyType = stripeKey?.startsWith('pk_test_') ? 'Test Key' : 
                  stripeKey?.startsWith('pk_live_') ? 'Live Key' : 
                  'Unknown';

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Stripe Configuration Test</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <strong>Stripe Key Status:</strong>
          <div style={{ 
            padding: '10px', 
            margin: '5px 0', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: stripeKey ? '#d4edda' : '#f8d7da',
            color: stripeKey ? '#155724' : '#721c24'
          }}>
            {keyStatus}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong>Key Type:</strong>
          <div style={{ padding: '10px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#d1ecf1' }}>
            {keyType}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong>Environment Variables:</strong>
          <div style={{ padding: '10px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(import.meta.env, null, 2)}
          </div>
        </div>
        
        <button
          onClick={() => window.location.href = '/subscriptions'}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Subscriptions Page
        </button>
      </div>
    </div>
  );
};

export default StripeTest;
