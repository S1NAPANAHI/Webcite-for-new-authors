#!/usr/bin/env pwsh
# Comprehensive Backend Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    ZOROASTERVERSE BACKEND STARTUP     " -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (!(Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found!" -ForegroundColor Red
    Write-Host "Please run this script from the apps/backend directory" -ForegroundColor Yellow
    Write-Host "Example: cd apps/backend && ./start-backend.ps1" -ForegroundColor Yellow
    exit 1
}

# Check for .env file
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating example .env file from env.example..." -ForegroundColor Yellow
    
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ Created .env from env.example" -ForegroundColor Green
        Write-Host "Please edit .env with your actual values before continuing" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "❌ No env.example found either!" -ForegroundColor Red
        Write-Host "Please create a .env file with the required environment variables" -ForegroundColor Yellow
    }
}

# Check Node.js and npm
Write-Host "🔍 Checking Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
Write-Host "🔍 Checking dependencies..." -ForegroundColor Blue
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Run environment check
Write-Host "🔍 Running environment check..." -ForegroundColor Blue
node check-env.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Environment check failed - continuing anyway" -ForegroundColor Yellow
}

# Run database connection test
Write-Host "🔍 Testing database connection..." -ForegroundColor Blue
node test-db-simple.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database connection failed - continuing anyway" -ForegroundColor Yellow
}

# Show important URLs
Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host "📍 Server will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🏥 Health check: http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host "💳 Stripe endpoint: http://localhost:3001/api/stripe/create-subscription" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the server
npm run dev