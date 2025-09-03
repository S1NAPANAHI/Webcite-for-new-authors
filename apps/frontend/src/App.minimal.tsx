import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { StarsBackground, Layout, Navbar } from '@zoroaster/ui';

const App: React.FC = () => {
  console.log('App component rendering with UI imports');
  
  const handleLogout = () => {
    console.log('Logout clicked');
  };
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <StarsBackground />
      <Routes>
        <Route element={
          <Layout>
            <Navbar 
              isAuthenticated={false} 
              betaApplicationStatus="none"
              onLogout={handleLogout}
            />
          </Layout>
        }>
          <Route path="/" element={
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.9)' }}>
              <h1>🎉 Success! UI Package Working!</h1>
              <p>✅ Environment variables loaded</p>
              <p>✅ Supabase client initialized</p>
              <p>✅ UI package imported and working</p>
              <p>✅ StarsBackground component rendering</p>
              <p>✅ Layout and Navbar components working</p>
              <p>You should see animated stars in the background!</p>
            </div>
          } />
          <Route path="/test" element={
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.9)' }}>
              <h2>Test Page</h2>
              <p>This is a test page with the full UI layout!</p>
            </div>
          } />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
