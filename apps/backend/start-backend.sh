#!/bin/bash
# Comprehensive Backend Startup Script for Mac/Linux

echo "========================================"
echo "    ZOROASTERVERS BACKEND STARTUP     "
echo "========================================"
echo ""

# Check if we're in the correct directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please run this script from the apps/backend directory"
    echo "Example: cd apps/backend && ./start-backend.sh"
    exit 1
fi

# Make script executable if it isn't already
chmod +x "$0"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating example .env file from env.example..."
    
    if [ -f "env.example" ]; then
        cp "env.example" ".env"
        echo "✅ Created .env from env.example"
        echo "Please edit .env with your actual values before continuing"
        echo ""
    else
        echo "❌ No env.example found either!"
        echo "Please create a .env file with the required environment variables"
    fi
fi

# Check Node.js and npm
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js not found! Please install Node.js"
    exit 1
fi

# Check if dependencies are installed
echo "🔍 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Run environment check
echo "🔍 Running environment check..."
node check-env.js
if [ $? -ne 0 ]; then
    echo "⚠️  Environment check failed - continuing anyway"
fi

# Run database connection test
echo "🔍 Testing database connection..."
node test-db-simple.js
if [ $? -ne 0 ]; then
    echo "⚠️  Database connection failed - continuing anyway"
fi

# Show important URLs
echo ""
echo "🚀 Starting backend server..."
echo "📍 Server will be available at: http://localhost:3001"
echo "🏥 Health check: http://localhost:3001/api/health"
echo "💳 Stripe endpoint: http://localhost:3001/api/stripe/create-subscription"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Start the server
npm run dev