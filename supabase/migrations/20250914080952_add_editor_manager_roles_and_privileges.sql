-- Add new roles to user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'EDITOR';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'MANAGER';

-- Add privileges column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS privileges text[] DEFAULT ARRAY[]::text[];
