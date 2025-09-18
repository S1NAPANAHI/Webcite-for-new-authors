-- Consolidated Enum Definitions

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'support', 'accountant', 'user', 'super_admin', 'beta_reader');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE public.subscription_status AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beta_reader_status') THEN
        CREATE TYPE public.beta_reader_status AS ENUM ('not_applied', 'pending', 'approved', 'rejected');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_type') THEN
        CREATE TYPE public.work_type AS ENUM ('book', 'volume', 'saga', 'arc', 'issue');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_status') THEN
        CREATE TYPE public.work_status AS ENUM ('planning', 'writing', 'editing', 'published', 'on_hold');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
        CREATE TYPE public.content_block_type AS ENUM ('heading_1', 'heading_2', 'heading_3', 'paragraph', 'bullet_list', 'ordered_list', 'image', 'table', 'quote', 'code', 'divider');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE public.product_type AS ENUM ('single_issue', 'bundle', 'chapter_pass', 'arc_pass', 'subscription', 'arc_bundle', 'saga_bundle', 'volume_bundle', 'book_bundle', 'subscription_tier');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beta_application_status') THEN
        CREATE TYPE public.beta_application_status AS ENUM ('pending', 'approved', 'denied');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_visibility') THEN
        CREATE TYPE public.profile_visibility AS ENUM ('public', 'private', 'friends_only');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
        CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
        CREATE TYPE public.activity_type AS ENUM ('chapter_read', 'book_completed', 'review_posted', 'comment_posted', 'wiki_edited', 'profile_updated', 'subscription_started', 'achievement_earned');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
        CREATE TYPE public.content_status AS ENUM ('planning', 'writing', 'editing', 'published', 'on_hold', 'archived');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wiki_content_type') THEN
        CREATE TYPE public.wiki_content_type AS ENUM ('heading_1', 'heading_2', 'heading_3', 'paragraph', 'bullet_list', 'ordered_list', 'image', 'video', 'audio', 'table', 'quote', 'code', 'divider', 'file_attachment');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM ('draft', 'pending', 'processing', 'on_hold', 'completed', 'cancelled', 'refunded', 'failed');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE public.payment_method AS ENUM ('credit_card', 'paypal', 'bank_transfer', 'crypto', 'apple_pay', 'google_pay', 'stripe', 'other');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_status') THEN
        CREATE TYPE public.fulfillment_status AS ENUM ('unfulfilled', 'fulfilled', 'partial', 'shipped', 'delivered', 'returned', 'cancelled');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_status') THEN
        CREATE TYPE public.refund_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'cancelled');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE public.invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('paid', 'unpaid', 'no_payment_required', 'failed', 'processing', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'canceled');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collection_method') THEN
        CREATE TYPE public.collection_method AS ENUM ('charge_automatically', 'send_invoice');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_discount_duration') THEN
        CREATE TYPE public.subscription_discount_duration AS ENUM ('forever', 'once', 'repeating');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learn_section_type') THEN
        CREATE TYPE public.learn_section_type AS ENUM ('authors_journey', 'educational_resources', 'professional_services');
    END IF;
END$$;
