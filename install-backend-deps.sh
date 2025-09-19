#!/bin/bash
# Install backend dependencies including the new commander package

echo "Installing backend dependencies..."
cd apps/backend
npm install commander
echo "✅ Backend dependencies installed successfully!"

# Also install dependencies for the entire project
echo "Installing all project dependencies..."
cd ../..
npm install

echo "🎉 All dependencies installed!"