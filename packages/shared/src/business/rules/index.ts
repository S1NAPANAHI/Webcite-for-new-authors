import { Database } from '../../database.types';
import { BusinessRuleError } from '../errors';

type ProductType = Database['public']['Enums']['product_type'];
type UserRole = Database['public']['Enums']['user_role'];
type SubscriptionStatus = Database['public']['Enums']['subscription_status'];

/**
 * Centralized business rules engine
 */
export class BusinessRulesEngine {
  
  /**
   * Subscription Rules
   */
  static subscription = {
    /**
     * Maximum subscriptions per user based on role
     */
    getMaxSubscriptionsForRole(role: UserRole): number {
      const limits: Record<UserRole, number> = {
        'user': 2,
        'support': 5,
        'accountant': 5,
        'admin': 10,
        'super_admin': 50,
        'beta_reader': 5
      };
      return limits[role] || 2;
    },

    /**
     * Can user subscribe to this product type
     */
    canSubscribeToProductType(userRole: UserRole, productType: ProductType): boolean {
      // All users can subscribe to single issues
      if (productType === 'single_issue') return true;
      
      // Basic users limited to chapter passes only
      if (userRole === 'user') {
        return ['chapter_pass'].includes(productType);
      }
      
      // All other roles can subscribe to any type
      return true;
    },

    /**
     * Minimum subscription duration
     */
    getMinimumSubscriptionDuration(productType: ProductType): number {
      const durations: Record<ProductType, number> = {
        'single_issue': 0, // One-time purchase
        'bundle': 0, // One-time purchase
        'chapter_pass': 30, // 30 days minimum
        'arc_pass': 90, // 90 days minimum
        'subscription': 30, // 30 days minimum for subscription
        'arc_bundle': 0,
        'saga_bundle': 0,
        'volume_bundle': 0,
        'book_bundle': 0,
        'subscription_tier': 30
      };
      return durations[productType] || 0;
    },

    /**
     * Can cancel subscription immediately
     */
    canCancelImmediately(subscriptionStatus: SubscriptionStatus, daysSinceStart: number): boolean {
      // Trialing subscriptions can always be canceled immediately
      if (subscriptionStatus === 'trialing') return true;
      
      // Active subscriptions can be canceled immediately within 3 days
      if (subscriptionStatus === 'active' && daysSinceStart <= 3) return true;
      
      // Otherwise, cancel at period end
      return false;
    }
  };

  /**
   * Pricing Rules
   */
  static pricing = {
    /**
     * Minimum price for product type
     */
    getMinimumPrice(productType: ProductType): number {
      const minimums: Record<ProductType, number> = {
        'single_issue': 99, // $0.99
        'bundle': 299, // $2.99
        'chapter_pass': 499, // $4.99/month
        'arc_pass': 999, // $9.99/month
        'subscription': 999, // $9.99/month
        'arc_bundle': 1999,
        'saga_bundle': 2999,
        'volume_bundle': 3999,
        'book_bundle': 4999,
        'subscription_tier': 999
      };
      return minimums[productType] || 99;
    },

    /**
     * Maximum price for product type
     */
    getMaximumPrice(productType: ProductType): number {
      const maximums: Record<ProductType, number> = {
        'single_issue': 4999, // $49.99
        'bundle': 9999, // $99.99
        'chapter_pass': 2999, // $29.99/month
        'arc_pass': 4999, // $49.99/month
        'subscription': 0, // Subscriptions might not have a fixed maximum price
        'arc_bundle': 9999,
        'saga_bundle': 19999,
        'volume_bundle': 29999,
        'book_bundle': 39999,
        'subscription_tier': 0
      };
      return maximums[productType] || 4999;
    },

    /**
     * Valid currencies for region
     */
    getValidCurrencies(region?: string): string[] {
      const baseCurrencies = ['USD'];
      
      const regionalCurrencies: Record<string, string[]> = {
        'US': ['USD'],
        'CA': ['USD', 'CAD'],
        'EU': ['USD', 'EUR'],
        'GB': ['USD', 'GBP'],
        'AU': ['USD', 'AUD']
      };
      
      return region ? regionalCurrencies[region] || baseCurrencies : baseCurrencies;
    },

    /**
     * Calculate discount limits
     */
    getMaxDiscountPercentage(userRole: UserRole): number {
      const discounts: Record<UserRole, number> = {
        'user': 20, // 20% max discount
        'support': 50,
        'accountant': 75,
        'admin': 90,
        'super_admin': 100,
        'beta_reader': 30
      };
      return discounts[userRole] || 20;
    }
  };

  /**
   * Content Access Rules
   */
  static content = {
    /**
     * Can user access this content type
     */
    canAccessContent(userRole: UserRole, contentType: string, subscriptionStatus?: string): boolean {
      // Public content accessible to all
      if (contentType === 'public') return true;
      
      // Free content accessible to registered users
      if (contentType === 'free' && userRole) return true;
      
      // Premium content requires active subscription
      if (contentType === 'premium') {
        return subscriptionStatus === 'active' || ['admin', 'super_admin'].includes(userRole);
      }
      
      // Beta content requires beta reader status or admin
      if (contentType === 'beta') {
        return ['admin', 'super_admin', 'beta_reader'].includes(userRole);
      }
      
      return false;
    },

    /**
     * Download limits per user role
     */
    getDownloadLimits(userRole: UserRole): { daily: number; concurrent: number } {
      const limits: Record<UserRole, { daily: number; concurrent: number }> = {
        'user': { daily: 10, concurrent: 2 },
        'support': { daily: 50, concurrent: 5 },
        'accountant': { daily: 50, concurrent: 5 },
        'admin': { daily: 100, concurrent: 10 },
        'super_admin': { daily: -1, concurrent: -1 }, // Unlimited
        'beta_reader': { daily: 20, concurrent: 5 }
      };
      return limits[userRole] || limits['user'];
    },

    /**
     * Can user preview content
     */
    canPreviewContent(userRole: UserRole, productType: ProductType): boolean {
      // Single issues allow preview for all users
      if (productType === 'single_issue') return true;
      
      // Bundles allow preview for registered users
      if (productType === 'bundle' && userRole) return true;
      
      // Subscriptions require active subscription or admin
      if (['chapter_pass', 'arc_pass'].includes(productType)) {
        return ['admin', 'super_admin'].includes(userRole);
      }
      
      return false;
    }
  };

  /**
   * User Management Rules
   */
  static user = {
    /**
     * Can user perform this action
     */
    canPerformAction(userRole: UserRole, action: string, targetUserRole?: UserRole): boolean {
      const permissions: Record<UserRole, string[]> = {
        'user': ['read_own_profile', 'update_own_profile'],
        'support': ['read_profiles', 'update_user_profiles', 'manage_tickets'],
        'accountant': ['read_profiles', 'view_financial_data', 'manage_refunds'],
        'admin': ['manage_users', 'manage_content', 'view_analytics', 'manage_subscriptions'],
        'super_admin': ['*'], // All permissions
        'beta_reader': ['read_own_profile', 'update_own_profile', 'read_beta_content']
      };

      const userPermissions = permissions[userRole] || [];
      
      // Super admin can do everything
      if (userPermissions.includes('*')) return true;
      
      // Check specific permission
      if (userPermissions.includes(action)) {
        // Additional checks for user management actions
        if (action.includes('manage_users') && targetUserRole) {
          // Can't manage users with equal or higher role
          const roleHierarchy: Record<UserRole, number> = {
            'user': 1,
            'support': 2,
            'accountant': 2,
            'admin': 3,
            'super_admin': 4,
            'beta_reader': 2
          };
          
          return roleHierarchy[userRole] > roleHierarchy[targetUserRole];
        }
        
        return true;
      }
      
      return false;
    },

    /**
     * Username validation rules
     */
    validateUsername(username: string): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      
      if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
      }
      
      if (username.length > 30) {
        errors.push('Username must be less than 30 characters');
      }
      
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, underscores, and hyphens');
      }
      
      const reservedUsernames = ['admin', 'api', 'www', 'mail', 'support', 'help', 'null', 'undefined'];
      if (reservedUsernames.includes(username.toLowerCase())) {
        errors.push('Username is reserved');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    },

    /**
     * Profile completeness requirements
     */
    getProfileCompletenessRequirements(_userRole: UserRole): string[] {
      const baseRequirements = ['display_name'];
      
      const roleRequirements: Record<UserRole, string[]> = {
        'user': baseRequirements,
        'support': [...baseRequirements, 'username'],
        'accountant': [...baseRequirements, 'username'],
        'admin': [...baseRequirements, 'username', 'avatar_url'],
        'super_admin': [...baseRequirements, 'username', 'avatar_url'],
        'beta_reader': [...baseRequirements, 'username']
      };
      
      return roleRequirements[_userRole] || baseRequirements;
    }
  };

  /**
   * Beta Program Rules
   */
  static beta = {
    /**
     * Application scoring criteria
     */
    calculateApplicationScore(application: any): number {
      let score = 0;
      
      // Interest statement quality (0-25 points)
      if (application.interest_statement && application.interest_statement.length > 100) {
        score += 25;
      } else if (application.interest_statement && application.interest_statement.length > 50) {
        score += 15;
      }
      
      // Feedback philosophy depth (0-25 points)
      if (application.feedback_philosophy && application.feedback_philosophy.length > 200) {
        score += 25;
      } else if (application.feedback_philosophy && application.feedback_philosophy.length > 100) {
        score += 15;
      }
      
      // Time commitment (0-20 points)
      const hoursPerWeek = parseInt(application.hours_per_week) || 0;
      if (hoursPerWeek >= 5) {
        score += 20;
      } else if (hoursPerWeek >= 3) {
        score += 15;
      } else if (hoursPerWeek >= 1) {
        score += 10;
      }
      
      // Communication preference (0-15 points)
      if (application.communication && application.communication.length > 50) {
        score += 15;
      }
      
      // Prior beta experience (0-15 points)
      if (application.prior_beta && application.prior_beta.length > 20) {
        score += 15;
      }
      
      return Math.min(score, 100);
    },

    /**
     * Minimum score for approval
     */
    getMinimumApprovalScore(): number {
      return 70;
    },

    /**
     * Can apply for beta program
     */
    canApplyForBeta(_userRole: UserRole, betaStatus: string): boolean {
      // Already approved or pending
      if (['approved', 'pending'].includes(betaStatus)) return false;
      
      // All user roles can apply
      return true;
    }
  };

  /**
   * Validate multiple business rules at once
   */
  static validateRules(rules: Array<() => boolean>, errorMessage: string): void {
    const failedRules = rules.filter(rule => {
      try {
        return !rule();
      } catch (error) {
        console.error('Error validating business rule:', error);
        return true; // Treat as failed if error occurs
      }
    });

    if (failedRules.length > 0) {
      throw new BusinessRuleError(errorMessage);
    }
  }
}
