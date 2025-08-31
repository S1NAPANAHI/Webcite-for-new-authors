import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bulma/css/bulma.css'
import './index.css'
import '../../../packages/ui/dist/style.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@zoroaster/shared'
import { BrowserRouter } from 'react-router-dom' // Added import

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Added BrowserRouter */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter> {/* Added BrowserRouter */}
  </React.StrictMode>,
)
