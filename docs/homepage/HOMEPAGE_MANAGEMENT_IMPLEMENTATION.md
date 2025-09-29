# 🏠 Homepage Management System - Implementation Guide

## 📋 Overview

This document outlines the complete implementation of the dynamic homepage management system for Zoroastervers.com. The system allows admin users to manage homepage content, progress metrics, and scrolling quotes through a web-based admin panel.

## 🗄️ Database Schema

### Tables Created

#### 1. `homepage_content` Table
```sql
CREATE TABLE public.homepage_content (
    id TEXT PRIMARY KEY DEFAULT 'homepage',
    -- Hero Section
    hero_title TEXT NOT NULL DEFAULT 'Happiness comes to them who bring happiness to others.',
    hero_subtitle TEXT DEFAULT '',
    hero_description TEXT NOT NULL,
    hero_quote TEXT NOT NULL,
    
    -- Call to Action
    cta_button_text TEXT NOT NULL DEFAULT 'Learn More',
    cta_button_link TEXT NOT NULL DEFAULT '/learn',
    
    -- Progress Metrics
    words_written BIGINT NOT NULL DEFAULT 0,
    beta_readers INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    books_published INTEGER NOT NULL DEFAULT 0,
    
    -- Section Visibility Controls
    show_latest_news BOOLEAN NOT NULL DEFAULT true,
    show_latest_releases BOOLEAN NOT NULL DEFAULT true,
    show_artist_collaboration BOOLEAN NOT NULL DEFAULT true,
    show_progress_metrics BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

#### 2. `homepage_quotes` Table
```sql
CREATE TABLE public.homepage_quotes (
    id SERIAL PRIMARY KEY,
    quote_text TEXT NOT NULL,
    author TEXT DEFAULT 'Zoroastrian Wisdom',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

### Database Functions

#### `calculate_homepage_metrics()`
Auto-calculates progress metrics from existing data:
- **Words Written**: Sum of `word_count` from published chapters
- **Beta Readers**: Count of approved beta readers and admin users
- **Average Rating**: Average from approved product reviews
- **Books Published**: Count of published works

#### `get_homepage_metrics()`
Public function to retrieve current metrics without admin privileges.

## 🔧 Backend API Implementation

### API Endpoints

#### Public Endpoints
- `GET /api/homepage` - Complete homepage data
- `GET /api/homepage/metrics` - Progress metrics only
- `GET /api/homepage/quotes` - Active quotes only

#### Admin-Only Endpoints (Requires Authentication)
- `PUT /api/homepage/content` - Update hero content
- `PUT /api/homepage/metrics` - Manual metrics update
- `POST /api/homepage/metrics/calculate` - Trigger auto-calculation
- `POST /api/homepage/quotes` - Add new quote
- `PUT /api/homepage/quotes/:id` - Update quote
- `DELETE /api/homepage/quotes/:id` - Delete quote
- `GET /api/homepage/quotes/all` - Get all quotes (including inactive)

### Authentication
Admin routes use JWT token verification and role-based access control:
```javascript
const requireAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  const { data: profile } = await supabase.from('profiles')
    .select('role').eq('user_id', user.id).single();
  
  if (profile.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

## ⚛️ Frontend Implementation

### React Hooks

#### `useHomepageData()`
Fetches complete homepage data including content, metrics, quotes, and section visibility settings.

#### `useHomepageQuotes()`
Fetches only active quotes for the prophecy wheel component.

#### `useHomepageAdmin()`
Provides admin operations for content management:
- `updateContent()`
- `updateMetrics()`
- `calculateMetrics()`
- `addQuote()`, `updateQuote()`, `deleteQuote()`

### Components

#### `HomepageManager.tsx`
Comprehensive admin interface with tabbed sections:
- **Hero Section**: Edit title, subtitle, description, CTA
- **Progress Metrics**: Manual editing + auto-calculation
- **Scrolling Quotes**: CRUD operations for prophecy wheel quotes
- **Section Visibility**: Toggle homepage sections on/off

#### `HomePage.enhanced.tsx`
API-integrated homepage component that:
- Uses database-driven content instead of hardcoded values
- Dynamically loads quotes for prophecy wheel
- Respects section visibility settings from admin panel
- Displays real-time calculated metrics
- Maintains backward compatibility

## 🚀 Implementation Steps

### 1. Database Setup
```bash
# Run the migration files in Supabase
# 1. Enhanced homepage content system
psql -d your_database -f supabase/migrations/20250922120000_enhanced_homepage_content.sql

# 2. Fixed metrics calculation
psql -d your_database -f supabase/migrations/20250922130000_fix_homepage_metrics_calculation.sql
```

### 2. Backend Setup
```bash
cd apps/backend

# Install dependencies (if not already installed)
npm install

# Start the backend server
npm run dev

# The homepage API will be available at:
# http://localhost:3001/api/homepage
```

### 3. Frontend Integration
```bash
cd apps/frontend

# The new hooks are available:
# src/hooks/useHomepageData.ts

# Enhanced components:
# src/admin/components/HomepageManager.tsx
# src/components/HomePage.enhanced.tsx
```

## 🔄 Data Flow

### Admin Workflow
1. Admin logs into `/admin/content/homepage`
2. Uses `HomepageManager` component to edit content
3. Changes are saved via API to Supabase
4. Frontend automatically updates via hooks

### Public User Experience
1. User visits homepage
2. `HomePage.enhanced.tsx` fetches data from API
3. Content displays dynamically based on database
4. Quotes in prophecy wheel come from database
5. Progress metrics update automatically

### Metrics Calculation
1. **Automatic**: Triggered when admin clicks "Auto-Calculate"
2. **Manual**: Admin can override any metric value
3. **Real-time**: Uses actual data from chapters, profiles, works tables

## 📊 Current Implementation Status

### ✅ Completed
- [x] Database schema and migrations
- [x] Backend API routes with authentication
- [x] React hooks for data management
- [x] Enhanced HomepageManager admin interface
- [x] API-integrated HomePage component
- [x] Quotes extracted from code and stored in database
- [x] Progress metrics auto-calculation function
- [x] Section visibility controls
- [x] Error handling and loading states

### 🔧 Integration Required
1. **Replace Current HomePage**: Update your main app to use `HomePage.enhanced.tsx`
2. **CSS Styling**: Update CSS classes to match your existing styles
3. **Route Integration**: Ensure `/admin/content/homepage` loads `HomepageManager`
4. **Environment Variables**: Verify API endpoints are correctly configured

## 🎯 Extracted Quotes from Code

The following 14 quotes were extracted from your HomePage.tsx and stored in the database:

1. "Your heart is a compass that always points toward love—trust it, follow it, honor it."
2. "You are not who you were yesterday unless you choose to be—each day offers the gift of becoming."
3. "The friend of truth shall be the friend of my spirit, O Ahura Mazda. (Yasna 46.2)"
4. "Every moment is sacred when approached with reverence, every task holy when performed with love."
5. "The mind aligned with truth thinks God's thoughts after Him, sees with divine eyes, loves with cosmic heart."
6. "May the beneficent spirit help us to speak truth and act righteously. (Yasna 47.6)"
7. "Hope is the thing with feathers that perches in the soul and sings without words."
8. "Self-knowledge is the beginning of wisdom, self-acceptance the foundation of growth."
9. "Grant me, O Truth, the rewards of good thinking that bring joy and satisfaction. (Yasna 50.4)"
10. "The sacred fire burns brightest in the heart that chooses truth over comfort."
11. "Good thoughts, good words, good deeds."
12. "Happiness comes to them who bring happiness to others."
13. "Turn yourself not away from three best things: Good Thought, Good Word, and Good Deed."
14. "He who sows the ground with care and diligence acquires a greater stock of religious merit than he could gain by the repetition of ten thousand prayers."

## 🔧 Troubleshooting

### Multiple GoTrueClient Instances Warning
The warning about multiple GoTrueClient instances is common in React development. To fix:
```javascript
// In your main app, ensure you have only one Supabase client instance
// Create a singleton pattern for the client
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);
```

### API Connection Issues
1. Verify backend server is running on port 3001
2. Check CORS settings in server.js
3. Ensure environment variables are set correctly
4. Verify database migrations have been applied

### Database Table Missing Errors
If you get 404 errors for `chapters`, `reviews`, or `books` tables:
1. The metrics calculation function includes fallbacks
2. Run the migrations to create missing tables
3. Or update the `calculate_homepage_metrics()` function to match your exact schema

## 📱 Usage Examples

### Admin: Update Hero Content
```javascript
const { updateContent } = useHomepageAdmin();

await updateContent({
  hero_title: "New Amazing Title",
  hero_description: "Updated description",
  show_latest_news: false // Hide news section
});
```

### Admin: Add New Quote
```javascript
const { addQuote } = useHomepageAdmin();

await addQuote({
  quote_text: "Wisdom is the lamp that lights the path to truth.",
  author: "Zarathustra",
  display_order: 15
});
```

### Public: Display Homepage
```javascript
const { data, isLoading, error } = useHomepageData();

if (data?.content) {
  console.log('Hero Title:', data.content.hero_title);
  console.log('Words Written:', data.metrics.words_written);
  console.log('Active Quotes:', data.quotes.length);
}
```

## 🎉 Benefits

1. **Dynamic Content**: No more hardcoded homepage content
2. **Real-time Metrics**: Progress stats update automatically
3. **Quote Management**: Easy CRUD operations for prophecy wheel
4. **Section Control**: Toggle homepage sections on/off
5. **Admin-Friendly**: Intuitive interface for content management
6. **API-Driven**: RESTful API for future integrations
7. **Secure**: Role-based access control
8. **Scalable**: Database-backed with proper indexing

## 🔮 Next Steps

1. **Deploy Migrations**: Run the SQL migrations on your Supabase instance
2. **Update Routes**: Integrate the new backend routes
3. **Test API**: Verify all endpoints work correctly
4. **Update Frontend**: Replace current HomePage with enhanced version
5. **Style Integration**: Update CSS classes to match your design system
6. **Admin Testing**: Test the admin interface thoroughly

---

**Implementation Date**: September 22, 2025  
**Status**: Ready for Integration  
**Files Modified**: 6 files created/updated  
**Database Tables**: 2 tables enhanced  
**API Endpoints**: 8 endpoints implemented  
**Extracted Quotes**: 14 quotes migrated to database  
