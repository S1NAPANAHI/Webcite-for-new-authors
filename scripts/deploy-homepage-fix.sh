#!/bin/bash

# Deploy Homepage News Integration Fix
# Run this script to deploy the Latest News & Updates fix

echo "🚀 Deploying Homepage News Integration Fix..."
echo "==========================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
cd apps/frontend
pnpm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Step 2: Build the project
echo "🔨 Building project..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Step 3: Deployment instructions
echo "📋 Next Steps:"
echo "=============="
echo "1. 🗃️  Run database migration in Supabase SQL Editor:"
echo "   File: supabase/migrations/20250921_create_blog_posts_table.sql"
echo ""
echo "2. 🌐 Deploy to your hosting platform:"
echo "   - Vercel: git push (auto-deploy)"
echo "   - Netlify: Connect to repo or upload dist/ folder"
echo "   - Custom: Upload apps/frontend/dist/ contents"
echo ""
echo "3. ✅ Test your homepage:"
echo "   Visit: https://www.zoroastervers.com/"
echo "   Check: 'Latest News & Updates' section shows content"
echo ""
echo "🎉 Homepage News Integration should now be working!"
echo "💡 Create real blog posts at /admin/content/blog/new to replace sample content"

# Return to root directory
cd ../../

echo "✅ Script completed successfully!"