-- Migration: Cleanup old tables
-- This script removes all tables from the old schema except for the 'profiles' table to preserve user data.
-- It uses CASCADE to ensure all dependent objects (views, policies, etc.) are also removed.

BEGIN;

DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.artist_collaborations CASCADE;
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.authors_journey_posts CASCADE;
DROP TABLE IF EXISTS public.beta_applications CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.chapters CASCADE;
DROP TABLE IF EXISTS public.characters CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.content_works CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.daily_spins CASCADE;
DROP TABLE IF EXISTS public.downloadable_templates CASCADE;
DROP TABLE IF EXISTS public.ebooks CASCADE;
DROP TABLE IF EXISTS public.entitlements CASCADE;
DROP TABLE IF EXISTS public.friends CASCADE;
DROP TABLE IF EXISTS public.homepage_content CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.inventory_movements CASCADE;
DROP TABLE IF EXISTS public.learn_cards CASCADE;
DROP TABLE IF EXISTS public.learn_sections CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.order_notes CASCADE;
DROP TABLE IF EXISTS public.order_refunds CASCADE;
DROP TABLE IF EXISTS public.order_shipments CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.prices CASCADE;
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.product_category_relations CASCADE;
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.professional_services CASCADE;
DROP TABLE IF EXISTS public.promotions CASCADE;
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.refunds CASCADE;
DROP TABLE IF EXISTS public.release_items CASCADE;
DROP TABLE IF EXISTS public.shopping_carts CASCADE;
DROP TABLE IF EXISTS public.stripe_customers CASCADE;
DROP TABLE IF EXISTS public.stripe_sync_logs CASCADE;
DROP TABLE IF EXISTS public.stripe_webhook_events CASCADE;
DROP TABLE IF EXISTS public.subscription_discounts CASCADE;
DROP TABLE IF EXISTS public.subscription_invoice_items CASCADE;
DROP TABLE IF EXISTS public.subscription_invoices CASCADE;
DROP TABLE IF EXISTS public.subscription_items CASCADE;
DROP TABLE IF EXISTS public.subscription_notes CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.subscription_usage CASCADE;
DROP TABLE IF EXISTS public.subscription_usage_records CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.timeline_nested_events CASCADE;
DROP TABLE IF EXISTS public.user_activities CASCADE;
DROP TABLE IF EXISTS public.user_reading_history CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.video_tutorials CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.wiki_categories CASCADE;
DROP TABLE IF EXISTS public.wiki_content_blocks CASCADE;
DROP TABLE IF EXISTS public.wiki_entries CASCADE;
DROP TABLE IF EXISTS public.wiki_items CASCADE;
DROP TABLE IF EXISTS public.wiki_media CASCADE;
DROP TABLE IF EXISTS public.wiki_revisions CASCADE;
DROP TABLE IF EXISTS public.works CASCADE;
DROP TABLE IF EXISTS public.writing_guides CASCADE;

-- Drop the helper function as it's no longer needed.
DROP FUNCTION IF EXISTS public.get_public_tables();

COMMIT;
