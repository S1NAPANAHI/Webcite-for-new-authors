import React from 'react';
import { Routes, Route } from 'react-router-dom';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test App</h1>
      <p>If you see this, the basic React app is working!</p>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/test" element={<div>Test Page</div>} />
      </Routes>
    </div>
  );
};

export default TestApp;
