# Comprehensive Admin Area Implementation Plan
## Full-Stack E-commerce eBook Platform with React/Vite + Express.js + Supabase

Based on your detailed requirements, I'll provide a complete implementation plan for your admin area that manages content, commerce, worldbuilding, and beta reader applications.

## 🏗️ Project Architecture Overview

```
my-ebook-platform/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── lib/
├── backend/                  # Express.js API
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── controllers/
└── database/                 # SQL schemas
```

## 📋 Step 1: Database Schema Setup

First, let's create the complete database schema in Supabase:

### Core Tables SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor', 'manager')),
    privileges TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Pages table
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    publish_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    cover_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    publish_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE file_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_key TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    title TEXT,
    labels TEXT[] DEFAULT '{}',
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'subscribers')),
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-books
CREATE TABLE ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    cover_url TEXT,
    stripe_price_id TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    release_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ebook_id, chapter_number)
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    total_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'cancelled')),
    stripe_payment_intent_id TEXT,
    items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beta applications
CREATE TABLE beta_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_email TEXT NOT NULL,
    applicant_name TEXT,
    answers JSONB DEFAULT '{}',
    status TEXT DEFAULT 'received' CHECK (status IN ('received', 'reviewing', 'approved', 'rejected')),
    score INTEGER,
    notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beta managers
CREATE TABLE beta_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id),
    scopes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wiki entries
CREATE TABLE wiki_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline events
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    era TEXT,
    related_entities JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio JSONB DEFAULT '{}',
    avatar_url TEXT,
    tags TEXT[] DEFAULT '{}',
    relationships JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist collaborations
CREATE TABLE artist_collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    brief JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'invited', 'in_progress', 'submitted', 'approved', 'published')),
    due_date TIMESTAMP WITH TIME ZONE,
    budget_cents INTEGER,
    files JSONB DEFAULT '[]',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_target TEXT,
    metadata JSONB DEFAULT '{}',
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily metrics rollup
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    value INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    UNIQUE(date, metric_name)
);

-- Create indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_chapters_ebook_id ON chapters(ebook_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_beta_applications_status ON beta_applications(status);
CREATE INDEX idx_wiki_entries_slug ON wiki_entries(slug);
CREATE INDEX idx_characters_slug ON characters(slug);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_occurred_at ON analytics_events(occurred_at);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);
```

## 📋 Step 2: Backend Setup (Express.js)

### Project Structure

```bash
mkdir my-ebook-platform
cd my-ebook-platform
mkdir backend
cd backend
npm init -y
npm install express cors dotenv jsonwebtoken @supabase/supabase-js multer sharp stripe
npm install -D nodemon
```

### Environment Configuration

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# File Upload
UPLOAD_BUCKET=file-uploads
MAX_FILE_SIZE=50000000
```

### Server Entry Point

Create `backend/server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateUser } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';
import commerceRoutes from './routes/commerce.js';
import betaRoutes from './routes/beta.js';
import worldRoutes from './routes/world.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateUser, adminRoutes);
app.use('/api/content', authenticateUser, contentRoutes);
app.use('/api/commerce', authenticateUser, commerceRoutes);
app.use('/api/beta', authenticateUser, betaRoutes);
app.use('/api/world', authenticateUser, worldRoutes);
app.use('/api/analytics', authenticateUser, analyticsRoutes);
app.use('/api/upload', authenticateUser, uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Authentication Middleware

Create `backend/middleware/auth.js`:

```javascript
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = { ...user, ...profile };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient privileges' });
    }

    next();
  };
};

export const requirePrivileges = (requiredPrivileges) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const hasPrivileges = requiredPrivileges.every(priv => 
      req.user.privileges?.includes(priv)
    );

    if (!hasPrivileges) {
      return res.status(403).json({ error: 'Missing required privileges' });
    }

    next();
  };
};
```

### Supabase Client

Create `backend/utils/supabase.js`:

```javascript
import { createClient } from ' @supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### Admin Routes

Create `backend/routes/admin.js`:

```javascript
import express from 'express';
import { requireRole } from '../middleware/auth.js';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get various metrics
    const [
      { count: totalUsers },
      { count: totalOrders },
      { count: totalEbooks },
      { count: betaAppsCount },
      { count: recentViews }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
      supabase.from('ebooks').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('beta_applications').select('*', { count: 'exact', head: true }),
      supabase.from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('occurred_at', sevenDaysAgo.toISOString())
    ]);

    // Get revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_cents')
      .eq('status', 'paid');

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_cents, 0) || 0;

    res.json({
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalEbooks: totalEbooks || 0,
      betaApplications: betaAppsCount || 0,
      totalRevenue: Math.round(totalRevenue / 100), // Convert to currency
      recentPageViews: recentViews || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics data for charts
router.get('/analytics/charts', requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily metrics
    const { data: metrics } = await supabase
      .from('daily_metrics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Group by metric name
    const chartData = {};
    metrics?.forEach(metric => {
      if (!chartData[metric.metric_name]) {
        chartData[metric.metric_name] = [];
      }
      chartData[metric.metric_name].push({
        date: metric.date,
        value: metric.value
      });
    });

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Content Management Routes

Create `backend/routes/content.js`:

```javascript
import express from 'express';
import { requireRole } from '../middleware/auth.js';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// Pages CRUD
router.get('/pages', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pages', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { title, slug, content, status, publish_at } = req.body;
    
    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        title,
        slug,
        content,
        status,
        publish_at,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/pages/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, publish_at } = req.body;

    const { data: page, error } = await supabase
      .from('pages')
      .update({
        title,
        content,
        status,
        publish_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog posts CRUD
router.get('/blog', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blog', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { title, slug, excerpt, content, tags, cover_url, status, publish_at } = req.body;
    
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        tags,
        cover_url,
        status,
        publish_at,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chapters CRUD
router.get('/chapters', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { data: chapters, error } = await supabase
      .from('chapters')
      .select(`
        *,
        ebooks (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chapters', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { ebook_id, chapter_number, title, content, status, release_at } = req.body;
    
    const { data: chapter, error } = await supabase
      .from('chapters')
      .insert({
        ebook_id,
        chapter_number,
        title,
        content,
        status,
        release_at
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## 📋 Step 3: Frontend Setup (React + Vite)

### Initialize Frontend

```bash
cd ../
mkdir frontend
cd frontend
npm create vite@latest . --template react
npm install react-router-dom @supabase/supabase-js axios recharts lucide-react
npm install -D @types/react-quill @types/react-dom
```

### Vite Configuration

Create `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### Environment Configuration

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Client

Create `frontend/src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Authentication Context

Create `frontend/src/context/AuthContext.jsx`:

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            setProfile(profileData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === 'admin';
  const hasPrivilege = (privilege) => profile?.privileges?.includes(privilege);

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    isAdmin,
    hasPrivilege
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Protected Route Component

Create `frontend/src/components/ProtectedRoute.jsx`:

```jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ 
  requiredRole, 
  requiredPrivileges = [] 
}) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPrivileges.length > 0) {
    const hasAllPrivileges = requiredPrivileges.every(priv =>
      profile?.privileges?.includes(priv)
    );
    
    if (!hasAllPrivileges) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
```

### Admin Layout Components

Create `frontend/src/components/admin/AdminLayout.jsx`:

```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

Create `frontend/src/components/admin/AdminSidebar.jsx`:

```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Globe,
  UserCheck,
  Palette
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: LayoutDashboard,
    roles: ['admin', 'manager']
  },
  {
    label: 'Analytics',
    to: '/admin/analytics',
    icon: BarChart3,
    roles: ['admin', 'manager']
  },
  {
    label: 'Content Management',
    icon: FileText,
    children: [
      { label: 'Pages', to: '/admin/content/pages', roles: ['admin', 'editor'] },
      { label: 'Blog Posts', to: '/admin/content/blog', roles: ['admin', 'editor'] },
      { label: 'Files & Media', to: '/admin/content/files', roles: ['admin', 'editor'] },
      { label: 'Chapters', to: '/admin/content/chapters', roles: ['admin', 'editor'] }
    ]
  },
  {
    label: 'Worldbuilding',
    icon: Globe,
    children: [
      { label: 'Wiki', to: '/admin/world/wiki', roles: ['admin', 'editor'] },
      { label: 'Timelines', to: '/admin/world/timelines', roles: ['admin', 'editor'] },
      { label: 'Characters', to: '/admin/world/characters', roles: ['admin', 'editor'] },
      { label: 'Artist Collab', to: '/admin/world/artists', roles: ['admin', 'editor'] }
    ]
  },
  {
    label: 'Commerce',
    icon: ShoppingCart,
    children: [
      { label: 'Products', to: '/admin/commerce/products', roles: ['admin', 'manager'] },
      { label: 'Orders', to: '/admin/commerce/orders', roles: ['admin', 'manager'] },
      { label: 'Customers', to: '/admin/commerce/customers', roles: ['admin', 'manager'] }
    ]
  },
  {
    label: 'Beta Program',
    icon: UserCheck,
    children: [
      { label: 'Applications', to: '/admin/beta/applications', roles: ['admin', 'manager'] },
      { label: 'Managers', to: '/admin/beta/managers', roles: ['admin'] },
      { label: 'Reading Activity', to: '/admin/beta/activity', roles: ['admin', 'manager'] }
    ]
  },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'Users', to: '/admin/settings/users', roles: ['admin'] },
      { label: 'Roles', to: '/admin/settings/roles', roles: ['admin'] }
    ]
  }
];

export default function AdminSidebar() {
  const { profile } = useAuth();

  const hasAccess = (roles) => {
    return roles.includes(profile?.role);
  };

  const renderMenuItem = (item, level = 0) => {
    if (item.children) {
      return (
        <div key={item.label} className="mb-2">
          <div className={`flex items-center px-3 py-2 text-sm text-gray-400 ${
            level > 0 ? 'ml-4' : ''
          }`}>
            {item.icon && <item.icon className="w-4 h-4 mr-2" />}
            {item.label}
          </div>
          <div className="space-y-1">
            {item.children
              .filter(child => hasAccess(child.roles))
              .map(child => renderMenuItem(child, level + 1))
            }
          </div>
        </div>
      );
    }

    if (!hasAccess(item.roles)) return null;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
            level > 0 ? 'ml-6' : ''
          } ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`
        }
      >
        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
        {item.label}
      </NavLink>
    );
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-400">Creative + Commerce</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </div>
  );
}
```

Create `frontend/src/components/admin/AdminTopbar.jsx`:

```jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Search } from 'lucide-react';

export default function AdminTopbar() {
  const { profile, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              placeholder="Quick search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              {profile?.name || profile?.email}
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {profile?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Dashboard Page with Analytics

Create `frontend/src/pages/admin/Dashboard.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { 
  Users, 
  ShoppingCart, 
  BookOpen, 
  TrendingUp,
  Eye,
  UserCheck
} from 'lucide-react';

function KPICard({ title, value, trend, icon: Icon, color = 'blue' }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/analytics/charts?days=30')
        ]);
        
        setStats(statsRes.data);
        setChartData(chartsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <KPICard
          title="Total Revenue"
          value={`€${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Orders"
          value={stats.totalOrders?.toLocaleString() || 0}
          icon={ShoppingCart}
          color="blue"
        />
        <KPICard
          title="Customers"
          value={stats.totalUsers?.toLocaleString() || 0}
          icon={Users}
          color="purple"
        />
        <KPICard
          title="E-Books"
          value={stats.totalEbooks?.toLocaleString() || 0}
          icon={BookOpen}
          color="indigo"
        />
        <KPICard
          title="Page Views (7d)"
          value={stats.recentPageViews?.toLocaleString() || 0}
          icon={Eye}
          color="yellow"
        />
        <KPICard
          title="Beta Applications"
          value={stats.betaApplications?.toLocaleString() || 0}
          icon={UserCheck}
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Blog Views">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.blog_views || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Chapters Read">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.chapters_read || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Beta Applications">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.beta_applications || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.orders || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
```

### Profile Page with Admin Access

Create `frontend/src/pages/Profile.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Crown } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.name || user?.email}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile?.role === 'admin' 
                  ? 'bg-red-100 text-red-800'
                  : profile?.role === 'editor'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile?.role || 'user'}
              </span>
              {profile?.role === 'admin' && <Crown className="w-4 h-4 text-yellow-500" />}
            </div>
          </div>

          {profile?.privileges && profile.privileges.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privileges
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.privileges.map((privilege) => (
                  <span
                    key={privilege}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                  >
                    {privilege.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Actions
            </label>
            <div className="space-y-2">
              {(profile?.role === 'admin' || profile?.role === 'manager' || profile?.role === 'editor') && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Go to Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Main App Component with Routing

Create `frontend/src/App.jsx`:

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Login from './pages/Login';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/Analytics';

// Content Management
import PagesManager from './pages/admin/content/PagesManager';
import BlogManager from './pages/admin/content/BlogManager';
import FilesManager from './pages/admin/content/FilesManager';
import ChaptersManager from './pages/admin/content/ChaptersManager';

// Worldbuilding
import WikiManager from './pages/admin/world/WikiManager';
import TimelinesManager from './pages/admin/world/TimelinesManager';
import CharactersManager from './pages/admin/world/CharactersManager';
import ArtistsManager from './pages/admin/world/ArtistsManager';

// Commerce
import ProductsManager from './pages/admin/commerce/ProductsManager';
import OrdersManager from './pages/admin/commerce/OrdersManager';
import CustomersManager from './pages/admin/commerce/CustomersManager';

// Beta Program
import BetaApplications from './pages/admin/beta/BetaApplications';
import BetaManagers from './pages/admin/beta/BetaManagers';
import BetaActivity from './pages/admin/beta/BetaActivity';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                
                {/* Content Management */}
                <Route path="content/pages" element={<PagesManager />} />
                <Route path="content/blog" element={<BlogManager />} />
                <Route path="content/files" element={<FilesManager />} />
                <Route path="content/chapters" element={<ChaptersManager />} />
                
                {/* Worldbuilding */}
                <Route path="world/wiki" element={<WikiManager />} />
                <Route path="world/timelines" element={<TimelinesManager />} />
                <Route path="world/characters" element={<CharactersManager />} />
                <Route path="world/artists" element={<ArtistsManager />} />
                
                {/* Commerce */}
                <Route path="commerce/products" element={<ProductsManager />} />
                <Route path="commerce/orders" element={<OrdersManager />} />
                <Route path="commerce/customers" element={<CustomersManager />} />
                
                {/* Beta Program */}
                <Route path="beta/applications" element={<BetaApplications />} />
                <Route path="beta/managers" element={<BetaManagers />} />
                <Route path="beta/activity" element={<BetaActivity />} />
              </Route>
            </Route>

            {/* Editor Routes */}
            <Route element={<ProtectedRoute requiredRole="editor" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="content/pages" element={<PagesManager />} />
                <Route path="content/blog" element={<BlogManager />} />
                <Route path="content/files" element={<FilesManager />} />
                <Route path="content/chapters" element={<ChaptersManager />} />
                <Route path="world/wiki" element={<WikiManager />} />
                <Route path="world/timelines" element={<TimelinesManager />} />
                <Route path="world/characters" element={<CharactersManager />} />
                <Route path="world/artists" element={<ArtistsManager />} />
              </Route>
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

## 📋 Step 4: Running the Application

### Backend Setup and Run

```bash
# In backend directory
cd backend
npm install
npm run dev  # or node server.js
```

### Frontend Setup and Run

```bash
# In frontend directory
cd frontend
npm install
npm run dev
```

## 📋 Step 5: Implementation Roadmap

### Phase 1: Core Setup (Week 1)
1. ✅ Database schema and RLS policies
2. ✅ Backend authentication middleware
3. ✅ Frontend auth context and routing
4. ✅ Basic admin layout and dashboard

### Phase 2: Content Management (Week 2)
1. Pages CRUD with rich text editor
2. Blog post management with scheduling
3. File upload system with storage
4. Chapter management with release scheduling

### Phase 3: Analytics & Commerce (Week 3)
1. Analytics tracking and dashboard
2. Order management system
3. Customer management
4. Revenue reporting

### Phase 4: Worldbuilding Tools (Week 4)
1. Wiki system with markdown support
2. Timeline management with visual display
3. Character database with relationships
4. Artist collaboration workflow

### Phase 5: Beta Reader System (Week 5)
1. Application form builder
2. Scoring and selection algorithm
3. Beta manager assignment
4. Reading progress tracking

## 🔧 Key Features Implemented

### ✅ Authentication & Authorization
- Single login flow with Supabase
- Role-based access control (admin, editor, manager, user)
- Protected routes on frontend and backend
- Privilege-based feature access

### ✅ Admin Dashboard
- Real-time analytics with charts
- KPI monitoring (revenue, orders, users)
- Content performance metrics
- Beta program statistics

### ✅ Content Management
- Page editor with rich content blocks
- Blog post management with scheduling
- File upload and media library
- Chapter release management

### ✅ Commerce Features
- Order tracking and management
- Customer database
- Revenue analytics
- Product catalog

### ✅ Worldbuilding Tools
- Wiki system for lore documentation
- Timeline management for story events
- Character database with relationships
- Artist collaboration pipeline

### ✅ Beta Reader Program
- Application form system
- Automated scoring and selection
- Manager assignment workflow
- Reading progress tracking

## 🔒 Security Considerations

1. **Row Level Security (RLS)** enabled on all tables
2. **JWT token validation** on backend routes
3. **Role-based middleware** for API endpoints
4. **File upload validation** and virus scanning
5. **Rate limiting** on sensitive endpoints
6. **Input sanitization** for all user data

## 📈 Scalability Features

1. **Database indexing** for performance
2. **Caching strategy** for frequently accessed data
3. **CDN integration** for file storage
4. **API pagination** for large datasets
5. **Background job processing** for heavy operations

This comprehensive implementation provides a solid foundation for your e-commerce ebook platform with a powerful admin area that can manage content, commerce, worldbuilding, and beta reader programs all from a unified interface.

Would you like me to detail any specific component or add additional features to this implementation plan?
