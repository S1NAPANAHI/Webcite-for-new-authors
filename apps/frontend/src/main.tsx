import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bulma/css/bulma.css'
import './index.css'
import '../../../packages/ui/dist/style.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter } from 'react-router-dom' // Added import
import { AuthProvider } from '@zoroaster/shared';
import { supabase } from '../../../packages/shared/src/supabaseClient';

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
