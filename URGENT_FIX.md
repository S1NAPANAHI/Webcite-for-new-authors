# URGENT FIX NEEDED

## Problem
You paid but system shows Free Tier because database structure is missing.

## Fix Steps

### 1. Go to Supabase Dashboard > SQL Editor

### 2. Run this SQL:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
```

### 3. Create subscriptions table:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    status VARCHAR(50) NOT NULL,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Update your subscription manually:

```sql
UPDATE profiles 
SET subscription_status = 'active', subscription_tier = 'premium'
WHERE email = 'your-email@domain.com';
```

### 5. Test
Go to /account/subscription and click refresh.

This will fix the issue immediately!