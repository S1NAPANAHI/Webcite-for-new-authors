-- ==============================================================================
-- VALIDATION SCRIPT FOR UNIFIED ZOROASTERVERSE MIGRATION
-- ==============================================================================
-- Run this script after applying the unified migration to verify everything
-- was created correctly
-- ==============================================================================

-- Check all required tables exist
SELECT 'CHECKING TABLES...' as status;

SELECT 
    tablename,
    CASE 
        WHEN tablename IN (
            'profiles', 'user_roles', 'user_stats', 'daily_spins',
            'works', 'chapters', 'posts', 'pages', 'characters',
            'products', 'prices', 'subscriptions', 'orders', 'purchases',
            'invoices', 'refunds', 'entitlements', 'stripe_customers',
            'wiki_folders', 'wiki_categories', 'wiki_pages', 'wiki_revisions',
            'wiki_content_blocks', 'wiki_media', 'reading_progress',
            'user_ratings', 'homepage_content', 'news_items', 'release_items',
            'recent_activity', 'beta_applications', 'audit_log', 'webhook_events',
            'promotions', 'product_reviews'
        ) THEN '✅ REQUIRED'
        ELSE '⚠️ EXTRA'
    END as table_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check custom types exist
SELECT 'CHECKING CUSTOM TYPES...' as status;

SELECT 
    typname as type_name,
    CASE 
        WHEN typname IN (
            'user_role', 'subscription_status', 'work_type', 'work_status',
            'product_type', 'content_block_type', 'discount_type', 
            'beta_application_status'
        ) THEN '✅ REQUIRED'
        ELSE '⚠️ EXTRA'
    END as type_status
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND typtype = 'e'  -- enum types
ORDER BY typname;

-- Check functions exist
SELECT 'CHECKING FUNCTIONS...' as status;

SELECT 
    proname as function_name,
    CASE 
        WHEN proname IN (
            'update_updated_at_column', 'is_admin', 'has_active_subscription',
            'get_user_subscription_tier', 'handle_new_user'
        ) THEN '✅ REQUIRED'
        ELSE '⚠️ EXTRA'
    END as function_status
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- Check RLS is enabled on key tables
SELECT 'CHECKING ROW LEVEL SECURITY...' as status;

SELECT 
    pc.relname as table_name,
    CASE 
        WHEN pc.relrowsecurity THEN '✅ ENABLED'
        ELSE '❌ DISABLED'
    END as rls_status
FROM pg_class pc
JOIN pg_namespace pn ON pn.oid = pc.relnamespace
WHERE pn.nspname = 'public'
AND pc.relkind = 'r'  -- regular tables
AND pc.relname IN (
    'profiles', 'works', 'chapters', 'posts', 'pages',
    'products', 'prices', 'subscriptions', 'entitlements'
)
ORDER BY pc.relname;

-- Check subscription products are created correctly
SELECT 'CHECKING STRIPE SUBSCRIPTION SETUP...' as status;

SELECT 
    p.slug,
    p.name,
    p.is_subscription,
    pr.price_id,
    pr.amount_cents,
    pr.currency,
    pr.interval,
    CASE 
        WHEN p.slug IN ('monthly-membership', 'annual-membership') 
        AND pr.price_id IN ('price_1S2L8JQv3TvmaocsYofzFKgm', 'price_1S2L95Qv3TvmaocsN5zRIEXO')
        THEN '✅ CORRECT'
        ELSE '❌ ISSUE'
    END as subscription_status
FROM products p
JOIN prices pr ON p.id = pr.product_id
WHERE p.is_subscription = true
ORDER BY pr.interval;

-- Check critical indexes exist
SELECT 'CHECKING CRITICAL INDEXES...' as status;

SELECT 
    i.relname as index_name,
    t.relname as table_name,
    '✅ EXISTS' as index_status
FROM pg_class i
JOIN pg_index ix ON i.oid = ix.indexrelid
JOIN pg_class t ON t.oid = ix.indrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
AND i.relname IN (
    'idx_profiles_subscription_status',
    'idx_subscriptions_user_id',
    'idx_works_premium',
    'idx_chapters_premium',
    'idx_prices_price_id',
    'idx_stripe_customers_stripe_id'
)
ORDER BY i.relname;

-- Check sample data was inserted
SELECT 'CHECKING SAMPLE DATA...' as status;

-- Check subscription products
SELECT 
    'Subscription Products' as data_type,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) >= 2 THEN '✅ GOOD'
        ELSE '⚠️ MISSING'
    END as data_status
FROM products 
WHERE is_subscription = true;

-- Check homepage content
SELECT 
    'Homepage Content' as data_type,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ GOOD'
        ELSE '⚠️ MISSING'
    END as data_status
FROM homepage_content;

-- Check release items
SELECT 
    'Release Items' as data_type,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ GOOD'
        ELSE '⚠️ MISSING'
    END as data_status
FROM release_items;

-- Final validation summary
SELECT 'VALIDATION COMPLETE!' as status;

-- Count total tables created
SELECT 
    COUNT(*) as total_tables,
    'Total tables in public schema' as description
FROM pg_tables 
WHERE schemaname = 'public';

-- Count total policies created
SELECT 
    COUNT(*) as total_policies,
    'Total RLS policies' as description
FROM pg_policies 
WHERE schemaname = 'public';

-- Count total functions created
SELECT 
    COUNT(*) as total_functions,
    'Total custom functions' as description
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

SELECT 'Migration validation complete. Check results above for any issues.' as final_message;
