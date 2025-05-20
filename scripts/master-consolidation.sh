#!/bin/bash
set -e

echo "🚀 Starting master consolidation process..."

# Make scripts executable
chmod +x "/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/consolidated-dependencies.sh"
chmod +x "/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/consolidate-frontend.sh"
chmod +x "/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/cleanup-redundant-scripts.sh"

# Step 1: Run consolidated dependencies script
echo "📦 Step 1: Running consolidated dependencies script..."
"/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/consolidated-dependencies.sh"

# Step 2: Run frontend consolidation script
echo "🔄 Step 2: Running frontend consolidation script..."
"/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/consolidate-frontend.sh"

# Step 3: Clean up redundant scripts
echo "🧹 Step 3: Cleaning up redundant scripts..."
"/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/cleanup-redundant-scripts.sh"

echo "✅ Master consolidation process completed successfully!"
echo "📝 Summary:"
echo "  1. Dependencies have been consolidated and updated"
echo "  2. Frontend has been consolidated with best features from both implementations"
echo "  3. Redundant scripts have been cleaned up"
echo ""
echo "🚀 The New Fuse project is now optimized and ready for development!"