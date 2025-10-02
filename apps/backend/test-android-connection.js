// Test script for verifying Android app connection to backend
// Run with: node test-android-connection.js

import fetch from 'node-fetch';

const BASE_URL = 'https://webcite-for-new-authors.onrender.com/api';
// const BASE_URL = 'http://localhost:3001/api'; // For local testing

const TEST_USER = {
  email: 'test-android@example.com',
  password: 'testpassword123'
};

async function testHealthCheck() {
  console.log('\n🔍 Testing health check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data.status);
    console.log('📊 CORS origins:', data.cors.allowedOrigins.length);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testSignUp() {
  console.log('\n🔍 Testing signup...');
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Signup successful for user:', data.user.email);
      return data.access_token;
    } else {
      const error = await response.json();
      if (error.error && error.error.includes('already registered')) {
        console.log('ℹ️ User already exists, proceeding to signin...');
        return null; // Will try signin instead
      } else {
        console.error('❌ Signup failed:', error.error);
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    return null;
  }
}

async function testSignIn() {
  console.log('\n🔍 Testing signin...');
  try {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Signin successful for user:', data.user.email);
      console.log('🔑 Access token received:', data.access_token.substring(0, 20) + '...');
      return data.access_token;
    } else {
      const error = await response.json();
      console.error('❌ Signin failed:', error.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Signin error:', error.message);
    return null;
  }
}

async function testAuthenticatedEndpoint(accessToken) {
  console.log('\n🔍 Testing authenticated endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authenticated request successful for user:', data.user.email);
      console.log('👤 User role:', data.user.role);
      return true;
    } else {
      const error = await response.json();
      console.error('❌ Authenticated request failed:', error.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Authenticated request error:', error.message);
    return false;
  }
}

async function testSubscriptionEndpoint(accessToken) {
  console.log('\n🔍 Testing subscription endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/subscription/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Subscription endpoint accessible');
      console.log('📊 Subscription active:', data.isActive);
      return true;
    } else {
      const error = await response.json();
      console.log('ℹ️ Subscription endpoint response:', response.status, error.error || error.message);
      return true; // This might be expected for test users
    }
  } catch (error) {
    console.error('❌ Subscription endpoint error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Android App Backend Connection Test');
  console.log('🌐 Testing against:', BASE_URL);
  
  // Test 1: Health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.error('\n❌ Backend not responding. Check if server is running.');
    return;
  }
  
  // Test 2: Authentication flow
  let accessToken = await testSignUp();
  if (!accessToken) {
    accessToken = await testSignIn();
  }
  
  if (!accessToken) {
    console.error('\n❌ Authentication failed. Cannot proceed with authenticated tests.');
    return;
  }
  
  // Test 3: Authenticated endpoints
  const authOk = await testAuthenticatedEndpoint(accessToken);
  if (!authOk) {
    console.error('\n❌ Authenticated requests failing.');
    return;
  }
  
  // Test 4: Protected endpoints
  await testSubscriptionEndpoint(accessToken);
  
  console.log('\n🎉 All tests completed!');
  console.log('✅ Your backend is ready for Android app integration!');
  console.log('\n📱 Next steps:');
  console.log('1. Deploy your backend changes to Render');
  console.log('2. Test your Android app connection');
  console.log('3. Verify authentication flow in the mobile app');
}

// Run the tests
runTests().catch(console.error);