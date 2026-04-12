#!/bin/bash
# Quick start script for Travel Photo Web App

echo "🌍 Travel Photo Web App - Quick Start"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found"
    echo "📋 Copy .env.example to .env.local and add your Supabase credentials:"
    echo "   cp .env.example .env.local"
    echo ""
    echo "Then edit .env.local with:"
    echo "   VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=your-anon-key"
    read -p "Continue without Supabase config? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build check
echo "🔨 Running production build check..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Success
echo "🚀 Setup complete! Ready to start development:"
echo ""
echo "   npm run dev"
echo ""
echo "App will be available at: http://localhost:5173/My-travel-app/"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - SETUP.md - Supabase configuration guide"
echo "   - IMPLEMENTATION_SUMMARY.md - What was built"
