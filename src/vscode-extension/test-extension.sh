#!/bin/bash

echo "🧪 Testing The New Fuse Extension..."

cd "/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/src/vscode-extension"

echo "1️⃣ Checking dependencies..."
if npm list uuid > /dev/null 2>&1; then
    echo "✅ uuid dependency found"
else
    echo "❌ uuid dependency missing"
    exit 1
fi

echo "2️⃣ Compiling extension..."
npm run compile > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Extension compiles successfully"
else
    echo "❌ Compilation failed"
    exit 1
fi

echo "3️⃣ Checking compiled output..."
if [ -f "out/extension.js" ]; then
    echo "✅ Extension output exists"
else
    echo "❌ Extension output missing"
    exit 1
fi

echo "4️⃣ Testing extension structure..."
if grep -q "theNewFuse" package.json; then
    echo "✅ Package.json contains view configurations"
else
    echo "❌ Package.json missing view configurations"
    exit 1
fi

echo "5️⃣ Launching Extension Development Host..."
echo "📋 To test the extension:"
echo "   - Press F5 in VS Code"
echo "   - Or open Command Palette (Cmd+Shift+P) and run 'Debug: Start Debugging'"
echo "   - Look for 'The New Fuse' robot icon in the Activity Bar (sidebar)"
echo "   - Check the Panel area for 'The New Fuse' tab"

echo "✅ Extension is ready for testing!"