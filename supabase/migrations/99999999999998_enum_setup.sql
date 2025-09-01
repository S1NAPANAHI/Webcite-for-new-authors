-- ==============================================================================
-- ENUM SETUP MIGRATION
-- ==============================================================================
-- This migration sets up all enum types before the main schema migration
-- This ensures enum values are committed before being used
-- ==============================================================================

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create user roles enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM (
            'admin',
            'support', 
            'accountant',
            'user',
            'super_admin'
        );
    END IF;
END $$;

-- Create subscription statuses enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE public.subscription_status AS ENUM (
            'incomplete',
            'incomplete_expired',
            'trialing',
            'active',
            'past_due',
            'canceled',
            'unpaid',
            'paused'
        );
    END IF;
END $$;

-- Create work types enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_type') THEN
        CREATE TYPE public.work_type AS ENUM (
            'book',
            'volume', 
            'saga',
            'arc',
            'issue'
        );
    END IF;
END $$;

-- Create work status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_status') THEN
        CREATE TYPE public.work_status AS ENUM (
            'planning',
            'writing',
            'editing',
            'published',
            'on_hold'
        );
    END IF;
END $$;

-- Create product types enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE public.product_type AS ENUM (
            'single_issue',
            'bundle',
            'chapter_pass',
            'arc_pass',
            'subscription'
        );
    END IF;
END $$;

-- Add subscription value to product_type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum e 
        JOIN pg_type t ON e.enumtypid = t.oid 
        WHERE t.typname = 'product_type' AND e.enumlabel = 'subscription'
    ) THEN
        ALTER TYPE public.product_type ADD VALUE 'subscription';
    END IF;
END $$;

-- Create content block types enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
        CREATE TYPE public.content_block_type AS ENUM (
            'heading_1',
            'heading_2',
            'heading_3',
            'paragraph',
            'bullet_list',
            'ordered_list',
            'image',
            'table',
            'quote',
            'code',
            'divider'
        );
    END IF;
END $$;

-- Create discount types enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
        CREATE TYPE public.discount_type AS ENUM (
            'percentage',
            'fixed_amount'
        );
    END IF;
END $$;

-- Create beta application status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beta_application_status') THEN
        CREATE TYPE public.beta_application_status AS ENUM (
            'pending',
            'approved', 
            'denied'
        );
    END IF;
END $$;
