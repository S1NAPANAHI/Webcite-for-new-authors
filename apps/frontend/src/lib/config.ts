/**
 * Centralized API Configuration for Next.js
 * 
 * This configuration allows the frontend to connect to different backends
 * based on environment variables, making it easy to switch between
 * development, staging, and production environments.
 */

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get environment variables (Next.js style)
const getEnvVar = (key: string, fallback?: string) => {
  if (isBrowser) {
    // In browser, use the runtime config or fallback
    return (window as any).__NEXT_DATA__?.env?.[key] || fallback;
  }
  // On server, use process.env
  return process.env[key] || fallback;
};

export const API_CONFIG = {
  // Use Next.js environment variable for API base URL, fallback to Render backend
  BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://webcite-for-new-authors.onrender.com'),
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,
  
  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

/**
 * Build complete API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/api/homepage/hero')
 * @returns Complete URL for the API call
 */
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Get base URL and ensure it doesn't end with slash
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  
  // Build complete URL
  const fullUrl = `${baseUrl}/${cleanEndpoint}`;
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 API URL: ${fullUrl}`);
  }
  
  return fullUrl;
};

/**
 * Create fetch configuration with default settings
 * @param options - Additional fetch options
 * @returns Complete fetch configuration
 */
export const createFetchConfig = (options: RequestInit = {}): RequestInit => {
  return {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    // Note: fetch timeout is handled differently in modern browsers
    ...options,
  };
};

/**
 * Environment-aware API client
 * Handles different backend configurations based on environment
 */
export const apiClient = {
  /**
   * Make a GET request to the API
   */
  get: async (endpoint: string, options: RequestInit = {}) => {
    const url = buildApiUrl(endpoint);
    const config = createFetchConfig({ method: 'GET', ...options });
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`❌ API GET Error (${url}):`, error);
      throw error;
    }
  },

  /**
   * Make a POST request to the API
   */
  post: async (endpoint: string, data?: any, options: RequestInit = {}) => {
    const url = buildApiUrl(endpoint);
    const config = createFetchConfig({
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`❌ API POST Error (${url}):`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request to the API
   */
  put: async (endpoint: string, data?: any, options: RequestInit = {}) => {
    const url = buildApiUrl(endpoint);
    const config = createFetchConfig({
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`❌ API PUT Error (${url}):`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request to the API
   */
  delete: async (endpoint: string, options: RequestInit = {}) => {
    const url = buildApiUrl(endpoint);
    const config = createFetchConfig({ method: 'DELETE', ...options });
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error(`❌ API DELETE Error (${url}):`, error);
      throw error;
    }
  },
};

/**
 * Development utilities
 */
export const debugApi = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 API Configuration Debug:', {
      baseUrl: API_CONFIG.BASE_URL,
      environment: process.env.NODE_ENV,
      nextPublicApiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      sampleHeroUrl: buildApiUrl('api/homepage/hero'),
      sampleContentUrl: buildApiUrl('api/homepage/content'),
      renderBackend: 'https://webcite-for-new-authors.onrender.com',
    });
  }
};

/**
 * Helper to get API configuration info
 */
export const getApiInfo = () => {
  return {
    baseUrl: API_CONFIG.BASE_URL,
    isRenderBackend: API_CONFIG.BASE_URL.includes('onrender.com'),
    isLocalhost: API_CONFIG.BASE_URL.includes('localhost'),
    environment: process.env.NODE_ENV,
  };
};

// Log API configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('✅ API Config loaded:', {
    baseUrl: API_CONFIG.BASE_URL,
    isRenderBackend: API_CONFIG.BASE_URL.includes('onrender.com'),
  });
}

export default API_CONFIG;