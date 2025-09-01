import { SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfileInput,
  UpdateUserProfileInput,
  UserStatsInput,
  BetaApplicationInput,
  UpdateUserRoleInput,
  UserQuery,
  UserProfileSchema,
  UpdateUserProfileSchema,
  UserStatsSchema,
  BetaApplicationSchema,
  UpdateUserRoleSchema,
  UserQuerySchema,
  validateUserBusinessRules,
  validateBetaApplicationBusinessRules
} from '../validators/user.validator';
import {
  ResourceNotFoundError,
  ValidationError,
  BusinessRuleError,
  DatabaseError,
  AuthorizationError
} from '../errors';
import { Database } from '../../database.types';

type UserProfile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type BetaReaderStatus = Database['public']['Enums']['beta_reader_status'];

export class UserService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get all users with filtering and pagination
   */
  async getUsers(query: UserQuery, requestingUserId: string) {
    try {
      // Validate requesting user has admin permissions
      await this.validateAdminAccess(requestingUserId);

      const validatedQuery = UserQuerySchema.parse(query);

      let supabaseQuery = this.supabase
        .from('profiles')
        .select(`
          id, username, display_name, avatar_url, website, role, beta_reader_status, created_at, updated_at,
          user_stats:user_stats(books_read, reading_hours, achievements, currently_reading)
        `);

      // Apply filters
      if (validatedQuery.role) {
        supabaseQuery = supabaseQuery.eq('role', validatedQuery.role);
      }

      if (validatedQuery.beta_reader_status) {
        supabaseQuery = supabaseQuery.eq('beta_reader_status', validatedQuery.beta_reader_status);
      }

      if (validatedQuery.search) {
        supabaseQuery = supabaseQuery.or(
          `username.ilike.%${validatedQuery.search}%,display_name.ilike.%${validatedQuery.search}%`
        );
      }

      // Apply sorting
      const ascending = validatedQuery.sort_order === 'asc';
      supabaseQuery = supabaseQuery.order(validatedQuery.sort_by, { ascending });

      // Apply pagination
      supabaseQuery = supabaseQuery.range(
        validatedQuery.offset,
        validatedQuery.offset + validatedQuery.limit - 1
      );

      const { data: users, error, count } = await supabaseQuery;

      if (error) {
        throw new DatabaseError('Failed to fetch users', { supabaseError: error });
      }

      return {
        users: users || [],
        pagination: {
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          total: count || 0
        }
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof DatabaseError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching users');
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(id: string, requestingUserId?: string) {
    try {
      // Check if requesting user can access this profile
      if (requestingUserId && requestingUserId !== id) {
        await this.validateProfileAccess(id, requestingUserId);
      }

      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select(`
          id, username, display_name, avatar_url, website, role, beta_reader_status, created_at, updated_at,
          user_stats:user_stats(books_read, reading_hours, achievements, currently_reading)
        `)
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        throw new ResourceNotFoundError('User profile', id);
      }

      if (error) {
        throw new DatabaseError('Failed to fetch user profile', { supabaseError: error });
      }

      return profile;
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof DatabaseError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching user profile');
    }
  }

  /**
   * Update user profile with business rule validation
   */
  async updateUserProfile(id: string, input: UpdateUserProfileInput, updatedBy: string) {
    try {
      // Check if profile exists
      const existingProfile = await this.getUserProfile(id);

      // Validate input
      const validatedInput = UpdateUserProfileSchema.parse(input);

      // Check username uniqueness if being updated
      if (validatedInput.username && validatedInput.username !== existingProfile.username) {
        await this.validateUsernameUniqueness(validatedInput.username, id);
      }

      // Validate business rules
      const mergedProfile = { ...existingProfile, ...validatedInput };
      const businessValidation = validateUserBusinessRules(mergedProfile);
      if (!businessValidation.isValid) {
        throw new BusinessRuleError('User profile validation failed', {
          violations: businessValidation.errors
        });
      }

      const { data: profile, error } = await this.supabase
        .from('profiles')
        .update({
          ...validatedInput,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to update user profile', { supabaseError: error });
      }

      return profile;
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof ValidationError || 
          error instanceof BusinessRuleError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while updating user profile');
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(input: UpdateUserRoleInput, requestingUserId: string) {
    try {
      // Validate requesting user has super admin permissions for role changes
      await this.validateSuperAdminAccess(requestingUserId);

      const validatedInput = UpdateUserRoleSchema.parse(input);

      // Check if target user exists
      await this.getUserProfile(validatedInput.user_id);

      // Business rule: Can't change super_admin role unless you're super_admin
      if (validatedInput.role === 'super_admin') {
        const requestingUser = await this.getUserProfile(requestingUserId);
        if (requestingUser.role !== 'super_admin') {
          throw new AuthorizationError('Only super admins can grant super admin role');
        }
      }

      // Business rule: Can't remove your own super_admin role
      if (validatedInput.user_id === requestingUserId) {
        const currentUser = await this.getUserProfile(requestingUserId);
        if (currentUser.role === 'super_admin' && validatedInput.role !== 'super_admin') {
          throw new BusinessRuleError('Cannot remove your own super admin role');
        }
      }

      // Update role in user_roles table
      const { data: roleUpdate, error: roleError } = await this.supabase
        .from('user_roles')
        .upsert({
          user_id: validatedInput.user_id,
          role: validatedInput.role,
          granted_by: validatedInput.granted_by,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (roleError) {
        throw new DatabaseError('Failed to update user role', { supabaseError: roleError });
      }

      // Also update role in profiles table for quick access
      const { error: profileError } = await this.supabase
        .from('profiles')
        .update({ 
          role: validatedInput.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', validatedInput.user_id);

      if (profileError) {
        throw new DatabaseError('Failed to update profile role', { supabaseError: profileError });
      }

      return roleUpdate;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof BusinessRuleError || 
          error instanceof DatabaseError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while updating user role');
    }
  }

  /**
   * Submit beta application with validation
   */
  async submitBetaApplication(input: BetaApplicationInput, userId?: string) {
    try {
      const validatedInput = BetaApplicationSchema.parse(input);

      // Validate business rules
      const businessValidation = validateBetaApplicationBusinessRules(validatedInput);
      if (!businessValidation.isValid) {
        throw new BusinessRuleError('Beta application validation failed', {
          violations: businessValidation.errors
        });
      }

      // Check if user already has a pending or approved application
      if (userId) {
        const { data: existingApplication, error: existingError } = await this.supabase
          .from('beta_applications')
          .select('id, status')
          .eq('user_id', userId)
          .in('status', ['pending', 'approved'])
          .single();

        if (!existingError && existingApplication) {
          throw new BusinessRuleError(`User already has a ${existingApplication.status} beta application`);
        }
      }

      // Check for duplicate email applications
      const { data: emailApplication, error: emailError } = await this.supabase
        .from('beta_applications')
        .select('id, status')
        .eq('email', validatedInput.email)
        .in('status', ['pending', 'approved'])
        .single();

      if (!emailError && emailApplication) {
        throw new BusinessRuleError(`An application with this email is already ${emailApplication.status}`);
      }

      // Create beta application
      const { data: application, error } = await this.supabase
        .from('beta_applications')
        .insert({
          ...validatedInput,
          user_id: userId || null,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to submit beta application', { supabaseError: error });
      }

      // Update user's beta reader status if user is logged in
      if (userId) {
        await this.supabase
          .from('profiles')
          .update({ 
            beta_reader_status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      }

      return application;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof BusinessRuleError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while submitting beta application');
    }
  }

  /**
   * Update user stats with validation
   */
  async updateUserStats(input: UserStatsInput) {
    try {
      const validatedInput = UserStatsSchema.parse(input);

      // Check if user exists
      await this.getUserProfile(validatedInput.user_id);

      const { data: stats, error } = await this.supabase
        .from('user_stats')
        .upsert(validatedInput)
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to update user stats', { supabaseError: error });
      }

      return stats;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while updating user stats');
    }
  }

  /**
   * Get user activity with analytics
   */
  async getUserActivity(userId: string, limit: number = 20) {
    try {
      // Check if user exists
      await this.getUserProfile(userId);

      const { data: activities, error } = await this.supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new DatabaseError('Failed to fetch user activity', { supabaseError: error });
      }

      return activities || [];
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching user activity');
    }
  }

  /**
   * Validate admin access
   */
  private async validateAdminAccess(userId: string) {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        throw new AuthorizationError('User profile not found');
      }

      if (!['admin', 'super_admin'].includes(profile.role)) {
        throw new AuthorizationError('Admin access required');
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Failed to validate admin access');
    }
  }

  /**
   * Validate super admin access
   */
  private async validateSuperAdminAccess(userId: string) {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        throw new AuthorizationError('User profile not found');
      }

      if (profile.role !== 'super_admin') {
        throw new AuthorizationError('Super admin access required');
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Failed to validate super admin access');
    }
  }

  /**
   * Validate profile access permissions
   */
  private async validateProfileAccess(profileId: string, requestingUserId: string) {
    try {
      // Users can always access their own profile
      if (profileId === requestingUserId) {
        return;
      }

      // Check if requesting user is admin
      const { data: requestingProfile, error } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', requestingUserId)
        .single();

      if (error || !requestingProfile) {
        throw new AuthorizationError('Requesting user profile not found');
      }

      if (!['admin', 'super_admin', 'support'].includes(requestingProfile.role)) {
        throw new AuthorizationError('Insufficient permissions to access this profile');
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Failed to validate profile access');
    }
  }

  /**
   * Validate username uniqueness
   */
  private async validateUsernameUniqueness(username: string, excludeUserId?: string) {
    try {
      let query = this.supabase
        .from('profiles')
        .select('id')
        .eq('username', username);

      if (excludeUserId) {
        query = query.neq('id', excludeUserId);
      }

      const { data: existingUser, error } = await query.single();

      if (!error && existingUser) {
        throw new BusinessRuleError('Username is already taken');
      }

      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError('Failed to check username uniqueness');
      }
    } catch (error) {
      if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while validating username');
    }
  }

  /**
   * Create user profile with business rules
   */
  async createUserProfile(userId: string, userEmail: string, userMetadata?: any) {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: existingError } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingError && existingProfile) {
        throw new BusinessRuleError('User profile already exists');
      }

      // Generate unique username from email
      const baseUsername = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      let username = baseUsername;
      let counter = 1;

      // Ensure username uniqueness
      while (true) {
        try {
          await this.validateUsernameUniqueness(username);
          break;
        } catch (error) {
          if (error instanceof BusinessRuleError) {
            username = `${baseUsername}${counter}`;
            counter++;
            if (counter > 100) {
              username = `${baseUsername}_${Date.now()}`;
              break;
            }
          } else {
            throw error;
          }
        }
      }

      const profileData = {
        id: userId,
        username,
        display_name: userMetadata?.full_name || userEmail.split('@')[0] || 'User',
        role: 'user' as UserRole,
        beta_reader_status: 'not_applied' as BetaReaderStatus,
        created_at: new Date().toISOString()
      };

      const { data: profile, error } = await this.supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to create user profile', { supabaseError: error });
      }

      // Create initial user stats
      await this.supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          books_read: 0,
          reading_hours: 0,
          achievements: 0,
          currently_reading: ''
        });

      return profile;
    } catch (error) {
      if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while creating user profile');
    }
  }

  /**
   * Get user dashboard data
   */
  async getUserDashboard(userId: string) {
    try {
      // Get user profile with stats
      const profile = await this.getUserProfile(userId);

      // Get user's active subscriptions
      const { data: subscriptions, error: subscriptionError } = await this.supabase
        .from('subscriptions')
        .select(`
          id, status, current_period_end, prices:prices(unit_amount, currency, interval)
        `)
        .eq('user_id', userId)
        .in('status', ['active', 'trialing']);

      if (subscriptionError) {
        throw new DatabaseError('Failed to fetch user subscriptions');
      }

      // Get recent orders
      const { data: orders, error: ordersError } = await this.supabase
        .from('purchases')
        .select(`
          id, status, purchased_at, metadata,
          products:products(name),
          prices:prices(unit_amount, currency)
        `)
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false })
        .limit(5);

      if (ordersError) {
        throw new DatabaseError('Failed to fetch user orders');
      }

      // Get reading progress
      const { data: readingProgress, error: progressError } = await this.supabase
        .from('reading_progress')
        .select(`
          progress_percentage, last_read_at, is_completed,
          chapters:chapters(title, work_id, works:works(title))
        `)
        .eq('user_id', userId)
        .order('last_read_at', { ascending: false })
        .limit(5);

      if (progressError) {
        throw new DatabaseError('Failed to fetch reading progress');
      }

      return {
        profile,
        subscriptions: subscriptions || [],
        recentOrders: orders || [],
        readingProgress: readingProgress || []
      };
    } catch (error) {
      if (error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while fetching user dashboard');
    }
  }

  /**
   * Deactivate user account with business rules
   */
  async deactivateUser(userId: string, deactivatedBy: string, reason?: string) {
    try {
      // Validate admin access
      await this.validateAdminAccess(deactivatedBy);

      // Check if user exists
      await this.getUserProfile(userId);

      // Business rule: Can't deactivate super admin accounts
      const userProfile = await this.getUserProfile(userId);
      if (userProfile.role === 'super_admin') {
        throw new BusinessRuleError('Cannot deactivate super admin accounts');
      }

      // Business rule: Can't deactivate your own account
      if (userId === deactivatedBy) {
        throw new BusinessRuleError('Cannot deactivate your own account');
      }

      // Cancel all active subscriptions
      const { data: activeSubscriptions, error: subscriptionError } = await this.supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (subscriptionError) {
        throw new DatabaseError('Failed to fetch user subscriptions for deactivation');
      }

      // Cancel subscriptions
      for (const subscription of activeSubscriptions || []) {
        await this.supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
            metadata: {
              cancellation: {
                reason: 'account_deactivated',
                canceled_by: deactivatedBy,
                canceled_at: new Date().toISOString()
              }
            }
          })
          .eq('id', subscription.id);
      }

      // Revoke all entitlements
      await this.supabase
        .from('entitlements')
        .update({
          ends_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .is('ends_at', null);

      console.log(`✅ Deactivated user ${userId} by ${deactivatedBy}`);
      return { success: true };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof BusinessRuleError || 
          error instanceof DatabaseError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new DatabaseError('Unexpected error while deactivating user');
    }
  }
}
