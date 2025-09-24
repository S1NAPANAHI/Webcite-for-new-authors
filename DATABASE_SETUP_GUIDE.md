# Database Setup Guide for Beta Applications

## Quick Fix for Current Error

You're getting this error because the `beta_applications` table either doesn't exist or has the wrong column structure:

```
column beta_applications.user_id does not exist
```

### 🚑 Immediate Solution

1. **Open your [Supabase Dashboard](https://app.supabase.io)**
2. **Go to SQL Editor**
3. **Copy and paste this SQL:**

```sql
-- Create beta_applications table with correct structure
CREATE TABLE IF NOT EXISTS public.beta_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    application_data JSONB,
    stage1_data JSONB,
    stage2_data JSONB,
    stage3_data JSONB,
    stage4_data JSONB,
    composite_score INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for security
CREATE POLICY "Users can view own applications" 
    ON public.beta_applications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" 
    ON public.beta_applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" 
    ON public.beta_applications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_beta_applications_user_id 
    ON public.beta_applications(user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.beta_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.beta_applications TO anon;
```

4. **Click "Run"**
5. **Refresh your beta application page**

---

## Understanding the Error

### What Happened?

The beta application was trying to query a database table that either:
- Doesn't exist yet
- Has different column names than expected
- Lacks proper permissions

### Error Types You Might See:

1. **`42P01: relation "beta_applications" does not exist`**
   - The table hasn't been created yet

2. **`42703: column "user_id" does not exist`**
   - The table exists but has wrong column names

3. **`42501: permission denied`**
   - RLS policies aren't set up correctly

---

## Schema-Adaptive Solution

I've updated the beta application component to be **schema-adaptive**, meaning it:

### ✅ **Auto-Detects Database Issues**
- Checks if the table exists
- Finds the correct user column name (`user_id`, `id`, `uuid`, etc.)
- Provides helpful error messages

### ✅ **Graceful Fallback**
- Shows setup instructions when database isn't configured
- Allows retry after fixing database issues
- Maintains all React error fixes from before

### ✅ **Developer-Friendly**
- Provides copy-paste SQL for quick setup
- Links to relevant documentation
- Clear step-by-step instructions

---

## Detailed Table Structure

### Core Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `status` | VARCHAR(50) | Application status (pending, approved, rejected) |
| `submitted_at` | TIMESTAMPTZ | When application was submitted |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |

### Application Data Columns

| Column | Type | Description |
|--------|------|-------------|
| `application_data` | JSONB | Complete application form data |
| `stage1_data` | JSONB | Stage 1 responses and scoring |
| `stage2_data` | JSONB | Stage 2 responses and scoring |
| `stage3_data` | JSONB | Stage 3 responses and scoring |
| `stage4_data` | JSONB | Stage 4 responses and scoring |
| `composite_score` | INTEGER | Final calculated score |

---

## Row Level Security (RLS) Policies

### Why RLS?
RLS ensures users can only access their own application data, providing security without application-level checks.

### Policies Created:

1. **View Policy**: Users can only see their own applications
2. **Insert Policy**: Users can only create applications for themselves
3. **Update Policy**: Users can only update their own applications

### Admin Access
To allow admins to view all applications, add this policy:

```sql
CREATE POLICY "Admins can view all applications" 
    ON public.beta_applications FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );
```

---

## Troubleshooting

### Common Issues

#### 1. "Permission denied for table beta_applications"

**Solution:**
```sql
GRANT SELECT, INSERT, UPDATE ON public.beta_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.beta_applications TO anon;
```

#### 2. "RLS policy violation"

**Check your policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'beta_applications';
```

**Reset policies if needed:**
```sql
DROP POLICY IF EXISTS "Users can view own applications" ON public.beta_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON public.beta_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON public.beta_applications;

-- Then recreate them with the SQL from above
```

#### 3. "Cannot connect to database"

**Check environment variables:**
```bash
# In your .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 4. "User not authenticated"

**Make sure user is logged in:**
- Visit `/login` first
- Check that `user` object exists in the component
- Verify JWT token is valid

---

## Testing the Setup

### 1. Manual Database Test

In Supabase SQL Editor:

```sql
-- Test table exists
SELECT * FROM public.beta_applications LIMIT 1;

-- Test with a fake user ID
INSERT INTO public.beta_applications (user_id, status) 
VALUES (gen_random_uuid(), 'test');

-- Clean up test data
DELETE FROM public.beta_applications WHERE status = 'test';
```

### 2. Frontend Test

1. **Navigate to** `/beta/application`
2. **Check browser console** for errors
3. **Verify** you see either:
   - Setup instructions (if table missing)
   - Application form (if everything works)
   - Existing application status (if already submitted)

### 3. Network Tab Verification

1. **Open DevTools** → Network tab
2. **Navigate to beta application**
3. **Look for Supabase requests**
4. **Should see:**
   - `200` status codes
   - Properly formatted URLs
   - No `:1` suffixes in parameters

---

## Migration from Old Schema

If you had a different table structure before:

### Option 1: Clean Setup (Recommended)

```sql
-- Drop old table (WARNING: This deletes all data!)
DROP TABLE IF EXISTS beta_applications;

-- Create new table with correct structure
-- (Use the CREATE TABLE statement from above)
```

### Option 2: Migrate Existing Data

```sql
-- Rename old table
ALTER TABLE beta_applications RENAME TO beta_applications_old;

-- Create new table
-- (Use the CREATE TABLE statement from above)

-- Migrate data (adjust column names as needed)
INSERT INTO beta_applications (user_id, status, application_data, created_at)
SELECT 
    auth_user_id as user_id,  -- or whatever your old column was called
    status,
    data as application_data,  -- or whatever your old data column was
    created_at
FROM beta_applications_old;

-- Drop old table when satisfied
-- DROP TABLE beta_applications_old;
```

---

## Advanced Configuration

### Custom Column Names

If you prefer different column names, update the schema-adaptive component:

```typescript
// In BetaApplication.schema-adaptive.tsx
const possibleUserColumns = [
    'user_id',     // Default
    'auth_user_id', // Your custom name
    'userid',       // Alternative
    'uuid'          // Another alternative
];
```

### Additional Indexes

For better performance with large datasets:

```sql
-- Index on status for admin queries
CREATE INDEX idx_beta_applications_status 
    ON public.beta_applications(status);

-- Index on submitted_at for chronological queries
CREATE INDEX idx_beta_applications_submitted 
    ON public.beta_applications(submitted_at);

-- Composite index for admin dashboard
CREATE INDEX idx_beta_applications_status_submitted 
    ON public.beta_applications(status, submitted_at);
```

### Audit Trail

For tracking changes:

```sql
-- Add audit columns
ALTER TABLE public.beta_applications 
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Create trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_beta_applications_updated_at 
    BEFORE UPDATE ON public.beta_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Security Best Practices

### 1. Environment Variables

```bash
# Use different keys for development and production
VITE_SUPABASE_URL=https://dev-project.supabase.co     # Development
VITE_SUPABASE_URL=https://prod-project.supabase.co    # Production
```

### 2. RLS Policies

- Always enable RLS on tables with user data
- Test policies thoroughly
- Use `auth.uid()` for user identification
- Consider admin access patterns

### 3. Data Validation

```sql
-- Add constraints for data integrity
ALTER TABLE public.beta_applications 
ADD CONSTRAINT valid_status 
    CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn'));

ALTER TABLE public.beta_applications 
ADD CONSTRAINT valid_score 
    CHECK (composite_score >= 0 AND composite_score <= 100);
```

---

## Monitoring and Maintenance

### Query Performance

```sql
-- Check query performance
EXPLAIN ANALYZE 
SELECT * FROM beta_applications 
WHERE user_id = 'some-uuid';

-- Monitor index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'beta_applications';
```

### Data Cleanup

```sql
-- Archive old applications (after 1 year)
CREATE TABLE beta_applications_archive AS 
SELECT * FROM beta_applications 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM beta_applications 
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## Support

If you continue having issues:

1. **Check the browser console** for detailed error messages
2. **Run the debug script**: `node debug-react-errors.js`
3. **Verify environment variables** are set correctly
4. **Test database connection** in Supabase dashboard
5. **Check RLS policies** are properly configured

For additional help:
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [React Error Decoder](https://reactjs.org/docs/error-decoder.html)