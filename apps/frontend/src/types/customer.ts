export type UserRole = 'free' | 'premium' | 'admin';

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'unpaid'
  | 'inactive';

export type SubscriptionTier = 'free' | 'premium' | 'patron';

export interface Customer {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  
  // Profile information
  reading_preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Subscription information
  subscription_status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  subscription_end_date?: string;
  stripe_customer_id?: string;
  
  // Computed fields from view or joins
  subscription_id?: string;
  plan_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  cancel_at_period_end?: boolean;
  has_premium_access?: boolean;
  subscription_valid?: boolean;
  
  // Activity metrics
  last_active_at?: string;
  total_reading_time?: number;
  chapters_read?: number;
  books_completed?: number;
}

export interface CustomerFilter {
  subscription_tier?: SubscriptionTier[];
  subscription_status?: SubscriptionStatus[];
  has_premium_access?: boolean;
  search?: string;
  created_after?: string;
  created_before?: string;
  last_active_after?: string;
  last_active_before?: string;
}

export interface CustomerSort {
  field: 'created_at' | 'updated_at' | 'email' | 'full_name' | 'subscription_tier' | 'subscription_status' | 'last_active_at';
  direction: 'asc' | 'desc';
}

export interface CustomerStats {
  total_customers: number;
  free_users: number;
  premium_users: number;
  patron_users: number;
  admin_users: number;
  active_subscriptions: number;
  trial_users: number;
  canceled_subscriptions: number;
  monthly_recurring_revenue: number;
  churn_rate: number;
  new_customers_this_month: number;
  new_customers_last_month: number;
}

export interface BulkCustomerAction {
  action: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate' | 'delete' | 'export';
  customer_ids: string[];
  options?: {
    target_tier?: SubscriptionTier;
    reason?: string;
    send_email?: boolean;
  };
}

export interface CustomerActivity {
  id: string;
  customer_id: string;
  activity_type: 'subscription_created' | 'subscription_canceled' | 'subscription_upgraded' | 'subscription_downgraded' | 'payment_succeeded' | 'payment_failed' | 'login' | 'chapter_read' | 'profile_updated';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Configuration for different subscription tiers
export const SUBSCRIPTION_TIER_CONFIG = {
  free: {
    label: 'Free',
    color: 'gray',
    icon: 'User',
    features: ['Basic access', 'Limited chapters'],
    price: 0
  },
  premium: {
    label: 'Premium',
    color: 'blue',
    icon: 'Crown',
    features: ['Full access', 'All chapters', 'Early releases'],
    price: 9.99
  },
  patron: {
    label: 'Patron',
    color: 'gold',
    icon: 'Star',
    features: ['All Premium features', 'Exclusive content', 'Community access'],
    price: 19.99
  }
} as const;

// Configuration for subscription statuses
export const SUBSCRIPTION_STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'green',
    icon: 'CheckCircle'
  },
  trialing: {
    label: 'Trial',
    color: 'blue',
    icon: 'Clock'
  },
  canceled: {
    label: 'Canceled',
    color: 'red',
    icon: 'XCircle'
  },
  past_due: {
    label: 'Past Due',
    color: 'orange',
    icon: 'AlertTriangle'
  },
  unpaid: {
    label: 'Unpaid',
    color: 'red',
    icon: 'AlertTriangle'
  },
  incomplete: {
    label: 'Incomplete',
    color: 'yellow',
    icon: 'AlertCircle'
  },
  incomplete_expired: {
    label: 'Incomplete Expired',
    color: 'red',
    icon: 'AlertCircle'
  },
  inactive: {
    label: 'Inactive',
    color: 'gray',
    icon: 'Minus'
  }
} as const;

// Utility functions
export const getCustomerDisplayName = (customer: Customer): string => {
  return customer.full_name || customer.email || 'Unknown User';
};

export const getCustomerStatusColor = (status: SubscriptionStatus): string => {
  return SUBSCRIPTION_STATUS_CONFIG[status]?.color || 'gray';
};

export const getCustomerTierColor = (tier: SubscriptionTier): string => {
  return SUBSCRIPTION_TIER_CONFIG[tier]?.color || 'gray';
};

export const formatCustomerJoinDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const calculateCustomerLifetimeValue = (customer: Customer): number => {
  // Simple calculation based on subscription tier and duration
  // This would be more sophisticated in a real implementation
  const tierPrice = SUBSCRIPTION_TIER_CONFIG[customer.subscription_tier]?.price || 0;
  const monthsActive = customer.created_at 
    ? Math.ceil((new Date().getTime() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;
  
  return tierPrice * Math.max(1, monthsActive);
};