-- Consolidated Trigger Definitions

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for email change
DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users CASCADE;
CREATE TRIGGER on_auth_user_email_updated
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION public.handle_email_change();

-- Trigger for beta application status change
DROP TRIGGER IF EXISTS on_beta_application_status_change ON public.beta_applications CASCADE;
CREATE TRIGGER on_beta_application_status_change
    AFTER INSERT OR UPDATE OF status
    ON public.beta_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profile_beta_status();

-- Generic updated_at triggers for all relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles CASCADE;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles CASCADE;
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats CASCADE;
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_spins_updated_at ON public.daily_spins CASCADE;
CREATE TRIGGER update_daily_spins_updated_at
    BEFORE UPDATE ON public.daily_spins
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_activities_updated_at ON public.user_activities CASCADE;
CREATE TRIGGER update_user_activities_updated_at
BEFORE UPDATE ON public.user_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_reading_history_updated_at ON public.user_reading_history CASCADE;
CREATE TRIGGER update_user_reading_history_updated_at
BEFORE UPDATE ON public.user_reading_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_reading_stats ON public.user_reading_history CASCADE;
CREATE TRIGGER trigger_update_reading_stats
BEFORE UPDATE ON public.user_reading_history
FOR EACH ROW
WHEN (OLD.progress IS DISTINCT FROM NEW.progress)
EXECUTE FUNCTION public.update_reading_stats();

DROP TRIGGER IF EXISTS update_beta_applications_updated_at ON public.beta_applications CASCADE;
CREATE TRIGGER update_beta_applications_updated_at
    BEFORE UPDATE ON public.beta_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_works_updated_at ON public.works CASCADE;
CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON public.works
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON public.chapters CASCADE;
CREATE TRIGGER update_chapters_updated_at
    BEFORE UPDATE ON public.chapters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts CASCADE;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages CASCADE;
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_characters_updated_at ON public.characters CASCADE;
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_paths ON public.wiki_items CASCADE;
CREATE TRIGGER trigger_update_paths
  BEFORE INSERT OR UPDATE OF parent_id, slug
  ON public.wiki_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_item_paths();

DROP TRIGGER IF EXISTS update_wiki_categories_updated_at ON public.wiki_categories CASCADE;
CREATE TRIGGER update_wiki_categories_updated_at
    BEFORE UPDATE ON public.wiki_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_revisions_updated_at ON public.wiki_revisions CASCADE;
CREATE TRIGGER update_wiki_revisions_updated_at
    BEFORE UPDATE ON public.wiki_revisions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_content_blocks_updated_at ON public.wiki_content_blocks CASCADE;
CREATE TRIGGER update_wiki_content_blocks_updated_at
    BEFORE UPDATE ON public.wiki_content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_media_updated_at ON public.wiki_media CASCADE;
CREATE TRIGGER update_wiki_media_updated_at
    BEFORE UPDATE ON public.wiki_media
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products CASCADE;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_availability_trigger ON public.products CASCADE;
CREATE TRIGGER update_product_availability_trigger
    BEFORE INSERT OR UPDATE OF active, status, published_at
    ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_availability();

DROP TRIGGER IF EXISTS update_variant_availability_trigger ON public.product_variants CASCADE;
CREATE TRIGGER update_variant_availability_trigger
    AFTER INSERT OR UPDATE OF is_active, inventory_quantity, track_inventory
    ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_variant_availability();

DROP TRIGGER IF EXISTS update_variant_availability_on_product_trigger ON public.products CASCADE;
CREATE TRIGGER update_variant_availability_on_product_trigger
    AFTER UPDATE OF is_available, active, status, published_at
    ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_variant_availability_on_product_change();

DROP TRIGGER IF EXISTS update_category_level_trigger ON public.product_categories CASCADE;
CREATE TRIGGER update_category_level_trigger
    BEFORE INSERT OR UPDATE OF path
    ON public.product_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_category_level();

DROP TRIGGER IF EXISTS on_category_updated ON public.product_categories CASCADE;
CREATE TRIGGER on_category_updated
    BEFORE UPDATE ON public.product_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_category_updated_at();

DROP TRIGGER IF EXISTS on_variant_updated ON public.product_variants CASCADE;
CREATE TRIGGER on_variant_updated
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_variant_updated_at();

DROP TRIGGER IF EXISTS on_variant_change_update_product ON public.product_variants CASCADE;
CREATE TRIGGER on_variant_change_update_product
    AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_on_variant_change();

DROP TRIGGER IF EXISTS update_prices_updated_at ON public.prices CASCADE;
CREATE TRIGGER update_prices_updated_at
    BEFORE UPDATE ON public.prices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions CASCADE;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS on_subscription_item_updated ON public.subscription_items CASCADE;
CREATE TRIGGER on_subscription_item_updated
    BEFORE UPDATE ON public.subscription_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_subscription_item_updated_at();

DROP TRIGGER IF EXISTS on_order_updated ON public.orders CASCADE;
CREATE TRIGGER on_order_updated
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_order_status();

DROP TRIGGER IF EXISTS on_order_update_timestamp ON public.orders CASCADE;
CREATE TRIGGER on_order_update_timestamp
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_order_timestamps();

DROP TRIGGER IF EXISTS on_order_items_change ON public.order_items CASCADE;
CREATE TRIGGER on_order_items_change
    AFTER INSERT OR UPDATE OF quantity, unit_amount, tax_amount, discount_amount OR DELETE
    ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_order_totals();

DROP TRIGGER IF EXISTS update_stripe_sync_logs_updated_at ON public.stripe_sync_logs CASCADE;
CREATE TRIGGER update_stripe_sync_logs_updated_at
BEFORE UPDATE ON public.stripe_sync_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_movements_updated_at ON public.inventory_movements CASCADE;
CREATE TRIGGER update_inventory_movements_updated_at
BEFORE UPDATE ON public.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_inventory ON public.inventory_movements CASCADE;
CREATE TRIGGER trigger_update_inventory
AFTER INSERT ON public.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_on_movement();

DROP TRIGGER IF EXISTS update_user_reading_history_updated_at ON public.user_reading_history CASCADE;
CREATE TRIGGER update_user_reading_history_updated_at
BEFORE UPDATE ON public.user_reading_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans CASCADE;
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_sync_subscription_plan_insert ON public.subscription_plans CASCADE;
CREATE TRIGGER trigger_sync_subscription_plan_insert
AFTER INSERT ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.sync_subscription_plan_with_stripe();

DROP TRIGGER IF EXISTS trigger_sync_subscription_plan_update ON public.subscription_plans CASCADE;
CREATE TRIGGER trigger_sync_subscription_plan_update
AFTER UPDATE ON public.subscription_plans
FOR EACH ROW
WHEN (
    OLD.name IS DISTINCT FROM NEW.name OR
    OLD.description IS DISTINCT FROM NEW.description OR
    OLD.price_amount IS DISTINCT FROM NEW.price_amount OR
    OLD.currency IS DISTINCT FROM NEW.currency OR
    OLD.billing_interval IS DISTINCT FROM NEW.billing_interval OR
    OLD.interval_count IS DISTINCT FROM NEW.interval_count OR
    OLD.trial_period_days IS DISTINCT FROM NEW.trial_period_days OR
    OLD.is_active IS DISTINCT FROM NEW.is_active
)
EXECUTE FUNCTION public.sync_subscription_plan_with_stripe();

DROP TRIGGER IF EXISTS update_learn_sections_updated_at ON public.learn_sections CASCADE;
CREATE TRIGGER update_learn_sections_updated_at
BEFORE UPDATE ON public.learn_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_learn_cards_updated_at ON public.learn_cards CASCADE;
CREATE TRIGGER update_learn_cards_updated_at
BEFORE UPDATE ON public.learn_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_authors_journey_post_defaults_trigger ON public.authors_journey_posts CASCADE;
CREATE TRIGGER set_authors_journey_post_defaults_trigger
BEFORE INSERT OR UPDATE ON public.authors_journey_posts
FOR EACH ROW EXECUTE FUNCTION public.set_authors_journey_post_defaults();

DROP TRIGGER IF EXISTS set_writing_guide_defaults_trigger ON public.writing_guides CASCADE;
CREATE TRIGGER set_writing_guide_defaults_trigger
BEFORE INSERT OR UPDATE ON public.writing_guides
FOR EACH ROW EXECUTE FUNCTION public.set_writing_guide_defaults();
