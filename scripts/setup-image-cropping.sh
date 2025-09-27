#!/bin/bash

# 🚀 Enhanced Image Cropping Setup Script
# This script sets up the image cropping functionality for your Webcite project

echo "🎨 Setting up Enhanced Image Cropping for Webcite..."
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory confirmed"

# Navigate to frontend directory
cd apps/frontend || {
    echo "❌ Error: Could not find apps/frontend directory"
    exit 1
}

echo "📎 Installing required dependencies..."

# Install react-easy-crop
if command -v pnpm &> /dev/null; then
    echo "Using pnpm to install dependencies..."
    pnpm add react-easy-crop
else
    echo "Using npm to install dependencies..."
    npm install react-easy-crop
fi

echo "✅ Dependencies installed successfully"

echo "💾 Creating backup of original files..."

# Backup original BlogEditorPage
if [ -f "src/pages/admin/BlogEditorPage.tsx" ]; then
    cp "src/pages/admin/BlogEditorPage.tsx" "src/pages/admin/BlogEditorPage.backup.tsx"
    echo "✅ BlogEditorPage.tsx backed up to BlogEditorPage.backup.tsx"
else
    echo "⚠️ BlogEditorPage.tsx not found - skipping backup"
fi

# Backup original ChapterEditor
if [ -f "src/pages/admin/content/ChapterEditor.tsx" ]; then
    cp "src/pages/admin/content/ChapterEditor.tsx" "src/pages/admin/content/ChapterEditor.backup.tsx"
    echo "✅ ChapterEditor.tsx backed up to ChapterEditor.backup.tsx"
else
    echo "⚠️ ChapterEditor.tsx not found - skipping backup"
fi

echo "📊 Database Migration (Optional)"
echo "=========================================="
echo "To fully utilize the enhanced features, consider adding these columns to your database:"
echo ""
echo "-- Add to blog_posts table:"
echo "ALTER TABLE blog_posts ADD COLUMN featured_image_file_id UUID REFERENCES files(id);"
echo "ALTER TABLE blog_posts ADD COLUMN social_image_file_id UUID REFERENCES files(id);"
echo ""
echo "-- Add to chapters table (if not already present):"
echo "ALTER TABLE chapters ADD COLUMN hero_file_id UUID REFERENCES files(id);"
echo "ALTER TABLE chapters ADD COLUMN banner_file_id UUID REFERENCES files(id);"
echo ""

echo "🎆 Setup Complete!"
echo "================="
echo ""
echo "Next steps:"
echo "1. 🔄 Replace your current ImageInput imports with ImageInputWithCropping"
echo "2. 📊 Run the database migrations above (optional but recommended)"
echo "3. 🎨 Test the new cropping functionality in your editors"
echo "4. 🚀 Deploy and enjoy perfectly cropped images!"
echo ""
echo "Files available:"
echo "- 🇿 ImageInputWithCropping.tsx - Enhanced component with cropping"
echo "- 📋 ChapterEditorWithCropping.tsx - Usage example for chapters"
echo "- 📋 BlogEditorPage.enhanced.tsx - Enhanced blog editor"
echo "- 📖 ENHANCED_IMAGE_INPUT_GUIDE.md - Complete documentation"
echo "- 📖 BLOG_EDITOR_MIGRATION.md - Blog-specific migration guide"
echo ""
echo "🎉 Your image cropping solution is ready!"
echo "Visit your blog editor and enjoy the new cropping capabilities: 🎨✨"