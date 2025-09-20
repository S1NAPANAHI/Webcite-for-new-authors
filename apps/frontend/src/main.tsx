import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, supabase } from '@zoroaster/shared';

import './lib/axios';

// Remove console logging of sensitive environment variables
// Only log in development mode if needed for debugging
if (import.meta.env.DEV) {
  console.log('Environment check:', {
    supabaseConfigured: !!import.meta.env.VITE_SUPABASE_URL,
    mode: import.meta.env.MODE
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider supabaseClient={supabase}>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)