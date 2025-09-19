// API utilities for subscription management

const API_BASE = typeof window !== 'undefined' 
  ? (import.meta.env?.['VITE_API_URL'] || 'http://localhost:3001')
  : 'http://localhost:3001';

/**
 * Get user's current subscription status from backend
 */
export async function fetchSubscriptionStatus(token: string) {
  const response = await fetch(`${API_BASE}/api/subscription/status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription status: ${response.status}`);
  }

  return response.json();
}

/**
 * Refresh subscription status by syncing with Stripe
 */
export async function refreshSubscriptionFromStripe(token: string) {
  const response = await fetch(`${API_BASE}/api/subscription/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh subscription: ${response.status}`);
  }

  return response.json();
}

/**
 * Get auth token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('supabase.auth.token') || 
         sessionStorage.getItem('supabase.auth.token') ||
         null;
}

/**
 * Refresh subscription status and return updated data
 */
export async function refreshAndGetSubscription() {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  // First refresh from Stripe
  await refreshSubscriptionFromStripe(token);
  
  // Then get updated status
  return fetchSubscriptionStatus(token);
}