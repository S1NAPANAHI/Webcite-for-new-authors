// Centralized API configuration
console.log('🔧 Loading API Config...');
console.log('🌍 Environment:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

export const API_CONFIG = {
  // Use environment variable for API base URL, fallback to production backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://webcite-for-new-authors.onrender.com',
  
  // Ensure we always append /api to the base URL if not already present
  get API_BASE_URL() {
    const baseUrl = this.BASE_URL;
    const finalUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    console.log('🔗 Final API URL:', finalUrl);
    return finalUrl;
  },
  
  // Common request configuration
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${API_CONFIG.API_BASE_URL}/${cleanEndpoint}`;
  console.log('🔗 Building API URL:', { endpoint, cleanEndpoint, fullUrl });
  return fullUrl;
}

// Helper function to log API configuration (for debugging)
export function logApiConfig() {
  console.log('📊 API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    BASE_URL: API_CONFIG.BASE_URL,
    API_BASE_URL: API_CONFIG.API_BASE_URL,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
  });
}

// Log configuration on module load
console.log('✅ API Config loaded with BASE_URL:', API_CONFIG.BASE_URL);

export default API_CONFIG;