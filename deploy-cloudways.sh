#!/bin/bash
# Cloudways deployment script
# Place this in the repo root and run after git pull on the server
# Or configure as the "Post-deployment" script in Cloudways Git deployment

set -e

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building static export..."
EXPORT=true npm run build

echo "✅ Build complete. Static files are in: out/"
echo ""
echo "Next step: copy contents of out/ to public_html/"
echo "  rsync -av --delete out/ public_html/"
