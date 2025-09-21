#!/bin/bash

# Deployment build script
echo "🚀 Starting deployment build..."

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Run build
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"