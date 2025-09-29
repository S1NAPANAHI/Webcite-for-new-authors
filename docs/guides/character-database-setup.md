# Character Database Setup Guide

This guide will help you set up the character management database tables in your Supabase project.

## 🚨 **URGENT: Database Setup Required**

Your application is currently showing "Error loading characters" because the character management tables don't exist in your Supabase database yet. Follow one of the methods below to fix this.

---

## Method 1: Quick Setup via Supabase Dashboard (Recommended)

### **Step 1: Access Supabase Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `opukvvmumyegtkukqint`
3. Navigate to **SQL Editor** in the left sidebar

### **Step 2: Run the Schema**
1. Click **"New Query"**
2. Copy the entire contents of [`database/migrations/create_characters_schema_fixed.sql`](https://github.com/S1NAPANAHI/Webcite-for-new-authors/blob/main/database/migrations/create_characters_schema_fixed.sql)
3. Paste it into the SQL editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

### **Step 3: Verify Success**
If successful, you should see:
- Several "Command completed successfully" messages
- New tables created: `characters`, `character_abilities`, `character_relationships`, etc.
- Sample data inserted (Zoroaster and other characters)

---

## Method 2: Automated Script (Advanced)

### **Prerequisites**
- Node.js installed locally
- Supabase Service Role Key (from Supabase Dashboard > Settings > API)

### **Step 1: Set Environment Variables**
```bash
export VITE_SUPABASE_URL="https://opukvvmumyegtkukqint.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

### **Step 2: Run Setup Script**
```bash
cd your-project-directory
node scripts/setup-character-database.js
```

---

## Method 3: Manual Table Creation

If the above methods don't work, you can create tables manually:

### **Core Tables to Create:**

#### 1. Characters Table
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT NOT NULL,
  character_type TEXT NOT NULL DEFAULT 'minor',
  status TEXT NOT NULL DEFAULT 'alive',
  power_level TEXT NOT NULL DEFAULT 'mortal',
  importance_score INTEGER NOT NULL DEFAULT 50,
  is_major_character BOOLEAN DEFAULT FALSE,
  is_pov_character BOOLEAN DEFAULT FALSE,
  portrait_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. Character Abilities
```sql
CREATE TABLE character_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  power_level TEXT NOT NULL DEFAULT 'mortal',
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Character Relationships
```sql
CREATE TABLE character_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  related_character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  description TEXT,
  strength INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Sample Data
```sql
INSERT INTO characters (
  name, slug, title, description, character_type, status, 
  power_level, importance_score, is_major_character, is_pov_character
) VALUES (
  'Zoroaster Zarathustra',
  'zoroaster-zarathustra', 
  'The Prophet',
  'The central figure of Zoroastrianism and the founding prophet of the religion.',
  'protagonist',
  'immortal',
  'divine',
  100,
  true,
  true
);
```

---

## 🧪 **Testing the Setup**

### **Check Tables Created**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'character%';
```

### **Check Sample Data**
```sql
SELECT name, character_type, importance_score 
FROM characters 
LIMIT 5;
```

### **Test Character Loading**
After setup, visit: `https://zoroastervers.com/admin/world/characters`

You should see:
- ✅ Character statistics dashboard
- ✅ Sample characters loaded
- ✅ No more "Error loading characters" messages

---

## 🎯 **Expected Results**

Once setup is complete, your character management system will have:

### **5 Core Tables Created:**
- `characters` - Main character data
- `character_abilities` - Powers and skills
- `character_relationships` - Character connections
- `character_appearances` - Story appearances
- `character_versions` - Character evolution

### **Sample Characters:**
- **Zoroaster Zarathustra** (Protagonist, Divine, 100% importance)
- **Angra Mainyu** (Antagonist, Divine, 95% importance)
- **Spenta Armaiti** (Supporting, Divine, 80% importance)
- **King Vishtaspa** (Supporting, Mortal, 70% importance)
- **Jamasp** (Supporting, Mortal, 60% importance)

### **Admin Features Available:**
- ✅ Character creation/editing
- ✅ Advanced filtering and sorting
- ✅ Bulk operations
- ✅ Relationship management
- ✅ Statistics dashboard

---

## 🚨 **Troubleshooting**

### **Error: "relation does not exist"**
- The table creation failed or wasn't completed
- Try running the schema again
- Check for error messages during execution

### **Error: "permission denied"**
- Make sure you're using the Service Role key, not the anon key
- Check that RLS policies are correctly configured

### **Error: "already exists"**
- This is normal when running the schema multiple times
- The setup handles existing objects gracefully

### **Characters Still Not Loading**
1. Check browser console for specific errors
2. Verify tables exist in Supabase Dashboard > Table Editor
3. Test queries directly in SQL Editor
4. Clear browser cache and reload

---

## 🎉 **Success Indicators**

You'll know the setup worked when:

1. **Console logs show:** `✅ Loaded X characters` instead of `❌ Error loading characters`
2. **Admin page displays:** Character statistics and sample data
3. **No more errors:** The repeated error messages stop appearing
4. **Character creation works:** You can create new characters via the admin interface

---

**Once setup is complete, your sophisticated character management system will be fully operational!** 🚀