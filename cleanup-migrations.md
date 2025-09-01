# Migration Cleanup Guide

## 🗂️ Unified Migration Created

I've created `99999999999999_unified_zoroasterverse_schema.sql` which consolidates all your database requirements into a single, comprehensive migration file.

## 📋 Obsolete Migration Files (Can be safely removed)

The following migration files are now **obsolete** and can be deleted since their functionality is included in the unified migration:

### Core Schema Files (superseded by unified migration):
- `20250819000100_users_and_profiles.sql` ✅ **REMOVE**
- `20250819000200_content_tables.sql` ✅ **REMOVE** 
- `20250819000300_wiki_tables.sql` ✅ **REMOVE**
- `20250819000400_ecommerce_tables.sql` ✅ **REMOVE**
- `20250819000500_misc_tables.sql` ✅ **REMOVE**

### Individual Table Additions (superseded):
- `20250822000000_add_folder_id_to_pages.sql` ✅ **REMOVE**
- `20250822000001_add_is_published_to_pages.sql` ✅ **REMOVE**
- `20250822000002_add_category_id_to_pages.sql` ✅ **REMOVE**
- `20250822000003_add_published_at_to_pages.sql` ✅ **REMOVE**
- `20250822000004_add_seo_title_to_pages.sql` ✅ **REMOVE**
- `20250822000005_add_seo_description_to_pages.sql` ✅ **REMOVE**
- `20250822000006_add_seo_keywords_to_pages.sql` ✅ **REMOVE**
- `20250822000007_add_view_count_to_pages.sql` ✅ **REMOVE**
- `20250822_create_user_stats_table.sql` ✅ **REMOVE**
- `20250822_create_daily_spins_table.sql` ✅ **REMOVE**
- `20250822_create_user_activities_table.sql` ✅ **REMOVE**
- `20250822004902_create_recent_activity_table.sql` ✅ **REMOVE**
- `20250823000000_create_beta_applications_table.sql` ✅ **REMOVE**
- `20250823000000_create_timeline_events_table.sql` ✅ **REMOVE**
- `20250823000001_add_beta_reader_status_to_profiles.sql` ✅ **REMOVE**
- `20250826000000_create_promotions_table.sql` ✅ **REMOVE**
- `20250826000001_create_product_reviews_table.sql` ✅ **REMOVE**
- `20250828000000_add_content_to_wiki_pages.sql` ✅ **REMOVE**

### Standalone Setup Files (now consolidated):
- `setup-stripe-subscriptions.sql` ✅ **REMOVE** (functionality moved to unified migration)
- `setup-rls-policies.sql` ✅ **REMOVE** (functionality moved to unified migration)

## 🔄 Files to Keep

### Keep these migration files (they contain important fixes/adjustments):
- `20250821000000_fix_rls_recursion.sql` ⚠️ **KEEP** - Contains important RLS fixes
- `20250821000100_fix_remaining_rls_recursion.sql` ⚠️ **KEEP** - Additional RLS fixes
- `20250824000000_fix_profile_rls.sql` ⚠️ **KEEP** - Profile-specific RLS fixes
- `20250824000001_create_detailed_audit_log_view.sql` ⚠️ **KEEP** - Audit logging view
- `20250825000000_add_content_linking_to_products.sql` ⚠️ **KEEP** - Product-content linking
- `20250901000000_add_missing_frontend_tables.sql` ⚠️ **KEEP** - Frontend-specific tables

### Keep the unified migration:
- `99999999999999_unified_zoroasterverse_schema.sql` ✅ **KEEP** - Your new main migration

## 🧹 Cleanup Commands

Run these PowerShell commands to remove the obsolete files:

```powershell
# Navigate to migrations directory
cd "C:\Users\Sinap\OneDrive\WORK\MACHINE LEARNING\MACHINE LEARNING\Website\ZOROASTERVERSE\supabase\migrations"

# Remove core schema files (superseded by unified migration)
Remove-Item "20250819000100_users_and_profiles.sql"
Remove-Item "20250819000200_content_tables.sql"
Remove-Item "20250819000300_wiki_tables.sql"
Remove-Item "20250819000400_ecommerce_tables.sql"
Remove-Item "20250819000500_misc_tables.sql"

# Remove individual table additions
Remove-Item "20250822000000_add_folder_id_to_pages.sql"
Remove-Item "20250822000001_add_is_published_to_pages.sql"
Remove-Item "20250822000002_add_category_id_to_pages.sql"
Remove-Item "20250822000003_add_published_at_to_pages.sql"
Remove-Item "20250822000004_add_seo_title_to_pages.sql"
Remove-Item "20250822000005_add_seo_description_to_pages.sql"
Remove-Item "20250822000006_add_seo_keywords_to_pages.sql"
Remove-Item "20250822000007_add_view_count_to_pages.sql"
Remove-Item "20250822_create_user_stats_table.sql"
Remove-Item "20250822_create_daily_spins_table.sql"
Remove-Item "20250822_create_user_activities_table.sql"
Remove-Item "20250822004902_create_recent_activity_table.sql"
Remove-Item "20250823000000_create_beta_applications_table.sql"
Remove-Item "20250823000000_create_timeline_events_table.sql"
Remove-Item "20250823000001_add_beta_reader_status_to_profiles.sql"
Remove-Item "20250826000000_create_promotions_table.sql"
Remove-Item "20250826000001_create_product_reviews_table.sql"
Remove-Item "20250828000000_add_content_to_wiki_pages.sql"

# Remove standalone setup files (now in unified migration)
Remove-Item "setup-stripe-subscriptions.sql"
Remove-Item "setup-rls-policies.sql"
```

## 📁 Final Migration Structure

After cleanup, your migrations folder will contain:

```
supabase/migrations/
├── 20250821000000_fix_rls_recursion.sql              (RLS fixes)
├── 20250821000100_fix_remaining_rls_recursion.sql    (More RLS fixes)
├── 20250824000000_fix_profile_rls.sql                (Profile RLS fixes)
├── 20250824000001_create_detailed_audit_log_view.sql (Audit view)
├── 20250825000000_add_content_linking_to_products.sql (Product linking)
├── 20250901000000_add_missing_frontend_tables.sql    (Frontend tables)
└── 99999999999999_unified_zoroasterverse_schema.sql  (MAIN MIGRATION)
```

## 🚀 How to Use the Unified Migration

### For Fresh Database:
1. Run only the unified migration: `99999999999999_unified_zoroasterverse_schema.sql`
2. This creates all tables, functions, policies, and initial data

### For Existing Database:
1. The unified migration uses `CREATE TABLE IF NOT EXISTS` and `DROP POLICY IF EXISTS`
2. Safe to run on existing databases - won't break existing data
3. Will add missing tables/columns and update policies

## ✅ What the Unified Migration Includes

- **Complete database schema** for all features
- **Stripe subscription integration** with your actual price IDs
- **Row Level Security policies** for content protection
- **User management** with roles and permissions
- **Content management** (works, chapters, posts, pages)
- **E-commerce** (products, prices, orders, subscriptions)
- **Wiki system** with versioning
- **User engagement** (reading progress, ratings, spins)
- **Admin features** (audit logs, user management)
- **Initial data** for your subscription plans

## 🔍 Validation

After running the unified migration, you can validate it worked by running these queries in Supabase SQL Editor:

```sql
-- Check subscription products are created
SELECT p.slug, p.name, pr.price_id, pr.amount_cents, pr.interval
FROM products p
JOIN prices pr ON p.id = pr.product_id
WHERE p.is_subscription = true;

-- Check all main tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'works', 'chapters', 'products', 'prices', 'subscriptions')
ORDER BY tablename;

-- Check RLS is enabled
SELECT tablename, 
       CASE WHEN rowsecurity THEN 'Enabled' ELSE 'Disabled' END as rls_status
FROM pg_tables pt
JOIN pg_class pc ON pc.relname = pt.tablename
WHERE pt.schemaname = 'public'
ORDER BY tablename;
```

This cleanup will give you a **clean, organized migration structure** that's much easier to maintain! 🎉
