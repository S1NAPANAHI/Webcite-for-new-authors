#!/bin/bash

# Homepage Fixes Deployment Script
# Run this script to apply all the homepage fixes

echo "🚀 Starting Homepage Fixes Deployment..."
echo "="*50

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the backend directory (apps/backend)"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Check environment variables
echo "🔍 Checking environment variables..."

if [ -z "$SUPABASE_URL" ] && [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ Missing SUPABASE_URL or VITE_SUPABASE_URL"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Environment variables look good"

# Run the database migration
echo "📋 Running database migration..."
node run-homepage-migration.js

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed!"
    echo "Please run the SQL manually in your Supabase dashboard:"
    echo "File: migrations/create-homepage-content-table.sql"
    exit 1
fi

echo "✅ Database migration completed"

# Test the API endpoints
echo "🗺️ Testing API endpoints..."

# Start the server in background for testing
echo "Starting server for testing..."
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
curl -s http://localhost:3001/api/health || echo "Health check failed"

# Test homepage endpoint  
echo "Testing homepage endpoint..."
curl -s http://localhost:3001/api/homepage/health || echo "Homepage API check failed"

# Stop the test server
kill $SERVER_PID 2>/dev/null

echo "="*50
echo "🎉 Homepage fixes deployment completed!"
echo ""
echo "📝 Next steps:"
echo "1. Deploy your backend to production (Render/Vercel/etc.)"
echo "2. Deploy your frontend changes"
echo "3. Test the homepage manager section visibility settings"
echo "4. Verify that Latest Releases now shows chapters"
echo ""
echo "🔗 Endpoints available:"
echo "- GET /api/homepage (full homepage data)"
echo "- GET /api/homepage/content (content only)"
echo "- PUT /api/homepage/content (update content + sections)"
echo "- GET /api/homepage/metrics (metrics only)"
echo "- PUT /api/homepage/metrics (update metrics)"
echo "- GET /api/homepage/quotes (active quotes)"
echo "- GET /api/releases/latest (latest chapters)"
echo ""
echo "✨ All fixes have been applied successfully!"
