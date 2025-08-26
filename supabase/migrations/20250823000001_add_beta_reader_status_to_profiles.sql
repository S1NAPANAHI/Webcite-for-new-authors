
-- Create beta_reader_status enum
CREATE TYPE beta_reader_status AS ENUM ('not_applied', 'pending', 'approved', 'rejected');

-- Add beta_reader_status column to profiles table
ALTER TABLE public.profiles
ADD COLUMN beta_reader_status beta_reader_status DEFAULT 'not_applied'::beta_reader_status NOT NULL;

-- Update RLS policy for profiles to allow admins to update beta_reader_status
-- Assuming the 'Admins can manage all profiles.' policy already exists and grants ALL privileges.
-- If not, you might need to adjust it or create a specific policy for this column.
