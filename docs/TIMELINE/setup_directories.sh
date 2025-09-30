#!/bin/bash
# COSMIC TIMELINE - PHASE 1: DIRECTORY SETUP
# Run this script from your project root directory

echo "🌌 Creating Cosmic Timeline Directory Structure..."

# Create all required directories
mkdir -p apps/frontend/src/assets/glyphs
mkdir -p apps/frontend/src/components/timeline/CosmicRings
mkdir -p apps/frontend/src/components/timeline/LinearTimeline
mkdir -p apps/frontend/src/components/timeline/Navigation
mkdir -p apps/frontend/src/components/timeline/hooks
mkdir -p apps/frontend/src/contexts
mkdir -p apps/frontend/src/styles

echo "✅ Directory structure created!"

# Backup existing timeline files
echo "📁 Backing up existing timeline files..."

cd apps/frontend/src/pages || exit

if [ -f "Timelines.tsx" ]; then
    mv "Timelines.tsx" "Timelines.classic.tsx"
    echo "✅ Timelines.tsx backed up as Timelines.classic.tsx"
else
    echo "ℹ️ Timelines.tsx not found (this is normal for new setup)"
fi

if [ -f "Timelines.module.css" ]; then
    mv "Timelines.module.css" "Timelines.classic.module.css"
    echo "✅ Timelines.module.css backed up as Timelines.classic.module.css"
else
    echo "ℹ️ Timelines.module.css not found (this is normal for new setup)"
fi

echo ""
echo "🎯 Phase 1 Directory Setup Complete!"
echo "Next: Run the database seeding script in Supabase"
