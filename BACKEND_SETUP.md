# Backend Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Navigate to backend directory (create if doesn't exist)
cd apps/backend

# Initialize npm if not already done
npm init -y

# Install dependencies
npm install express cors helmet morgan compression dotenv
npm install @supabase/supabase-js zod

# Install dev dependencies
npm install -D @types/express @types/cors @types/node 
npm install -D ts-node typescript nodemon
```

### 2. Create Basic Server Structure

**apps/backend/src/server.ts**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import contentRoutes from './routes/content';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/content', contentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
```

**apps/backend/src/lib/supabase.ts**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

**apps/backend/src/middleware/auth.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (roles.length > 0 && !roles.includes(req.user.role || 'user')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

### 3. Environment Variables

**apps/backend/.env**
```bash
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Package.json Scripts

**apps/backend/package.json**
```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 5. TypeScript Configuration

**apps/backend/tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🎯 Testing Your Setup

### 1. Start the Backend Server

```bash
cd apps/backend
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📱 API available at http://localhost:3001
🏥 Health check: http://localhost:3001/health
```

### 2. Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Get content items
curl http://localhost:3001/api/content/items

# Create a new book (requires auth)
curl -X POST http://localhost:3001/api/content/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "type": "book",
    "title": "My Test Book",
    "slug": "my-test-book",
    "description": "A test book",
    "status": "draft"
  }'
```

### 3. Update Frontend API Configuration

Update `apps/frontend/src/lib/contentApi.ts`:

```typescript
// Base API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:3001/api';
```

## 🔧 Alternative: Use Supabase Direct

If you don't want to set up a backend right now, the frontend is already configured to use Supabase directly:

1. In `WorksManager.tsx`, it uses `supabaseContentApi` functions
2. These connect directly to your Supabase database
3. No backend server needed - just run the migrations!

## 🚀 Quick Start (Supabase Direct)

1. **Run the database migrations** (most important!):
   ```bash
   supabase migration up
   ```

2. **Your admin interface will work immediately** with:
   - ✅ Create new content items
   - ✅ Edit existing content
   - ✅ Delete content items
   - ✅ Hierarchical structure
   - ✅ Real-time updates

3. **No backend setup required** - everything connects directly to Supabase!

---

**Priority**: Run the database migrations first, then your admin interface will be fully functional! The backend setup can be done later when you need more advanced features.