#!/bin/bash

# Auto-switch to correct Node.js version and start dev server
echo "🚀 Starting Tableau Embedding Playbook Development Server"
echo "========================================================"

# Check if nvm is available
if command -v nvm &> /dev/null; then
    echo "📦 Switching to Node.js version specified in .nvmrc..."
    nvm use
else
    echo "⚠️  nvm not found. Please ensure you're using Node.js 18.17.0+"
fi

echo "🔧 Starting development server on port 3001..."
npm run dev
