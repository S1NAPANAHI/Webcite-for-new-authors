import { UpdateUserProfileSchema, UserStatsSchema, BetaApplicationSchema, UpdateUserRoleSchema, UserQuerySchema, validateUserBusinessRules, validateBetaApplicationBusinessRules } from '../validators/user.validator';
import { ResourceNotFoundError, ValidationError, BusinessRuleError, DatabaseError, AuthorizationError } from '../errors';
export class UserService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getUsers(query, requestingUserId) {
        try {
            await this.validateAdminAccess(requestingUserId);
            const validatedQuery = UserQuerySchema.parse(query);
            let supabaseQuery = this.supabase
                .from('profiles')
                .select(`
          id, username, display_name, avatar_url, website, role, beta_reader_status, created_at, updated_at,
          user_stats:user_stats(books_read, reading_hours, achievements, currently_reading)
        `);
            if (validatedQuery.role) {
                supabaseQuery = supabaseQuery.eq('role', validatedQuery.role);
            }
            if (validatedQuery.beta_reader_status) {
                supabaseQuery = supabaseQuery.eq('beta_reader_status', validatedQuery.beta_reader_status);
            }
            if (validatedQuery.search) {
                supabaseQuery = supabaseQuery.or(`username.ilike.%${validatedQuery.search}%,display_name.ilike.%${validatedQuery.search}%`);
            }
            const ascending = validatedQuery.sort_order === 'asc';
            supabaseQuery = supabaseQuery.order(validatedQuery.sort_by, { ascending });
            supabaseQuery = supabaseQuery.range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1);
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
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof DatabaseError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching users');
        }
    }
    async getUserProfile(id, requestingUserId) {
        try {
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
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof DatabaseError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching user profile');
        }
    }
    async updateUserProfile(id, input, _updatedBy) {
        try {
            const existingProfile = await this.getUserProfile(id);
            const validatedInput = UpdateUserProfileSchema.parse(input);
            if (validatedInput.username && existingProfile && validatedInput.username !== existingProfile.username) {
                await this.validateUsernameUniqueness(validatedInput.username, id);
            }
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
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof ValidationError ||
                error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while updating user profile');
        }
    }
    async updateUserRole(input, requestingUserId) {
        try {
            await this.validateSuperAdminAccess(requestingUserId);
            const validatedInput = UpdateUserRoleSchema.parse(input);
            await this.getUserProfile(validatedInput.user_id);
            if (validatedInput.role === 'super_admin') {
                const requestingUser = await this.getUserProfile(requestingUserId);
                if (requestingUser && requestingUser.role !== 'super_admin') {
                    throw new AuthorizationError('Only super admins can grant super admin role');
                }
            }
            if (validatedInput.user_id === requestingUserId) {
                const currentUser = await this.getUserProfile(requestingUserId);
                if (currentUser && currentUser.role === 'super_admin' && validatedInput.role !== 'super_admin') {
                    throw new BusinessRuleError('Cannot remove your own super admin role');
                }
            }
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
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof BusinessRuleError ||
                error instanceof DatabaseError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while updating user role');
        }
    }
    async submitBetaApplication(input, userId) {
        try {
            const validatedInput = BetaApplicationSchema.parse(input);
            const businessValidation = validateBetaApplicationBusinessRules(validatedInput);
            if (!businessValidation.isValid) {
                throw new BusinessRuleError('Beta application validation failed', {
                    violations: businessValidation.errors
                });
            }
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
            const { data: emailApplication, error: emailError } = await this.supabase
                .from('beta_applications')
                .select('id, status')
                .eq('email', validatedInput.email)
                .in('status', ['pending', 'approved'])
                .single();
            if (!emailError && emailApplication) {
                throw new BusinessRuleError(`An application with this email is already ${emailApplication.status}`);
            }
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
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while submitting beta application');
        }
    }
    async updateUserStats(input) {
        try {
            const validatedInput = UserStatsSchema.parse(input);
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
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while updating user stats');
        }
    }
    async getUserActivity(userId, limit = 20) {
        try {
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
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching user activity');
        }
    }
    async validateAdminAccess(userId) {
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
        }
        catch (error) {
            if (error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Failed to validate admin access');
        }
    }
    async validateSuperAdminAccess(userId) {
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
        }
        catch (error) {
            if (error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Failed to validate super admin access');
        }
    }
    async validateProfileAccess(profileId, requestingUserId) {
        try {
            if (profileId === requestingUserId) {
                return;
            }
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
        }
        catch (error) {
            if (error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Failed to validate profile access');
        }
    }
    async validateUsernameUniqueness(username, excludeUserId) {
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
        }
        catch (error) {
            if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while validating username');
        }
    }
    async createUserProfile(userId, userEmail, userMetadata) {
        try {
            const { data: existingProfile, error: existingError } = await this.supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
            if (!existingError && existingProfile) {
                throw new BusinessRuleError('User profile already exists');
            }
            const baseUsername = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            let username = baseUsername;
            let counter = 1;
            while (true) {
                try {
                    await this.validateUsernameUniqueness(username);
                    break;
                }
                catch (error) {
                    if (error instanceof BusinessRuleError) {
                        username = `${baseUsername}${counter}`;
                        counter++;
                        if (counter > 100) {
                            username = `${baseUsername}_${Date.now()}`;
                            break;
                        }
                    }
                    else {
                        throw error;
                    }
                }
            }
            const profileData = {
                id: userId,
                username,
                display_name: userMetadata?.full_name || userEmail.split('@')[0] || 'User',
                role: 'user',
                beta_reader_status: 'not_applied',
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
        }
        catch (error) {
            if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while creating user profile');
        }
    }
    async getUserDashboard(userId) {
        try {
            const profile = await this.getUserProfile(userId);
            if (!profile) {
                throw new ResourceNotFoundError('User profile', userId);
            }
            if (profile && profile.user_stats === null) {
                profile.user_stats = {
                    books_read: 0,
                    reading_hours: 0,
                    achievements: 0,
                    currently_reading: ''
                };
            }
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
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching user dashboard');
        }
    }
    async deactivateUser(userId, deactivatedBy, _reason) {
        try {
            await this.validateAdminAccess(deactivatedBy);
            const userProfile = await this.getUserProfile(userId);
            if (!userProfile) {
                throw new ResourceNotFoundError('User profile', userId);
            }
            if (userProfile.role === 'super_admin') {
                throw new BusinessRuleError('Cannot deactivate super admin accounts');
            }
            if (userId === deactivatedBy) {
                throw new BusinessRuleError('Cannot deactivate your own account');
            }
            const { data: activeSubscriptions, error: subscriptionError } = await this.supabase
                .from('subscriptions')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'active');
            if (subscriptionError) {
                throw new DatabaseError('Failed to fetch user subscriptions for deactivation');
            }
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
            await this.supabase
                .from('entitlements')
                .update({
                ends_at: new Date().toISOString()
            })
                .eq('user_id', userId)
                .is('ends_at', null);
            console.log(`✅ Deactivated user ${userId} by ${deactivatedBy}`);
            return { success: true };
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof BusinessRuleError ||
                error instanceof DatabaseError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while deactivating user');
        }
    }
}
//# sourceMappingURL=UserService.js.map