// Centralized API configuration
export const API_CONFIG = {
  // Use environment variable for API base URL, fallback to production backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://webcite-for-new-authors.onrender.com',
  
  // Ensure we always append /api to the base URL if not already present
  get API_BASE_URL() {
    const baseUrl = this.BASE_URL;
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
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
  return `${API_CONFIG.API_BASE_URL}/${cleanEndpoint}`;
}

// Helper function to log API configuration (for debugging)
export function logApiConfig() {
  console.log('API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    BASE_URL: API_CONFIG.BASE_URL,
    API_BASE_URL: API_CONFIG.API_BASE_URL,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
  });
}

export default API_CONFIG;