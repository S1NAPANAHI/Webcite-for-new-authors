import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import 'bulma/css/bulma.css'
import './index.css'
// import '@zoroaster/ui/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter } from 'react-router-dom' // Added import
import { AuthProvider, supabase } from '@zoroaster/shared';

import './lib/axios'; // <--- Add this line

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Added BrowserRouter */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider supabaseClient={supabase}>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter> {/* Added BrowserRouter */}
  </React.StrictMode>,
)
