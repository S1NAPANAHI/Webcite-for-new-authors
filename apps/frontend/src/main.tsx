import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import 'bulma/css/bulma.css'
import './index.css'
// import '@zoroaster/ui/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@zoroaster/shared';
// Use our fixed singleton Supabase client
import { supabase } from './lib/supabase';
import { CartProvider } from './contexts/CartContext';

import './lib/axios';

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

// Only attach to window once, using the singleton, and only if not already attached
if (typeof window !== 'undefined' && !(window as any).supabase) {
  (window as any).supabase = supabase;
  console.log('🌐 Supabase client attached to window');
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider supabaseClient={supabase}>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)