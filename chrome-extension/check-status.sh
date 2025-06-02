#!/bin/bash

# Quick TNF Extension Status Checker
echo "🔍 TNF Extension & Relay Status Check"
echo "======================================"

PROJECT_PATH="/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse"

# Check if relay is running
echo "📡 Checking TNF Relay status..."
if curl -s --connect-timeout 3 http://localhost:3000/status > /dev/null 2>&1; then
    echo "✅ TNF Relay is running"
    RELAY_STATUS=$(curl -s http://localhost:3000/status | jq -r '.version // "unknown"' 2>/dev/null || echo "running")
    echo "   Version: $RELAY_STATUS"
else
    echo "❌ TNF Relay is not running"
    echo "   To start: cd '$PROJECT_PATH' && ./start-enhanced-relay.sh"
    
    # Try to start it automatically
    echo "🔄 Attempting to start TNF Relay..."
    cd "$PROJECT_PATH"
    pkill -f enhanced-tnf-relay.js 2>/dev/null
    sleep 1
    nohup node enhanced-tnf-relay.js start > relay.log 2>&1 &
    sleep 3
    
    if curl -s --connect-timeout 3 http://localhost:3000/status > /dev/null 2>&1; then
        echo "✅ TNF Relay started successfully"
    else
        echo "❌ Failed to start TNF Relay automatically"
    fi
fi

# Check extension files
echo ""
echo "📦 Checking Chrome Extension files..."
EXTENSION_PATH="$PROJECT_PATH/chrome-extension/dist"
REQUIRED_FILES=("manifest.json" "background.js" "popup.html" "popup.js" "content.js" "element-selection.css" "options.html" "options.js")

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$EXTENSION_PATH/$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

# Check icons
echo ""
echo "🎨 Checking extension icons..."
ICON_PATH="$EXTENSION_PATH/icons"
ICON_FILES=("icon16.png" "icon48.png" "icon128.png")

for icon in "${ICON_FILES[@]}"; do
    if [ -f "$ICON_PATH/$icon" ]; then
        echo "✅ $icon"
    else
        echo "❌ $icon (missing)"
    fi
done

# WebSocket test
echo ""
echo "🔌 Testing WebSocket connection..."
if command -v python3 > /dev/null 2>&1; then
    WS_TEST=$(timeout 5 python3 -c "
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = s.connect_ex(('localhost', 3001))
    s.close()
    print('accessible' if result == 0 else 'not accessible')
except:
    print('error')
" 2>/dev/null)
    
    if [ "$WS_TEST" = "accessible" ]; then
        echo "✅ WebSocket port 3001 is accessible"
    else
        echo "❌ WebSocket port 3001 is not accessible"
    fi
else
    echo "⚠️ Python3 not available for WebSocket test"
fi

echo ""
echo "🚀 INSTALLATION INSTRUCTIONS:"
echo "1. Open Chrome: chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select: $EXTENSION_PATH"
echo "5. Pin extension to toolbar"
echo ""
echo "🧪 TESTING SITES:"
echo "• https://chat.openai.com"
echo "• https://claude.ai"
echo "• https://gemini.google.com"
echo "• Test page: file://$PROJECT_PATH/chrome-extension/test-page.html"
echo ""
echo "⚙️ EXTENSION OPTIONS:"
echo "• Right-click extension icon → Options"
echo "• Or visit: chrome-extension://[extension-id]/options.html"
