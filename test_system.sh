#!/bin/bash

echo "🧪 Testing Tableau Dashboard System"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Check if server is running
echo -e "${BLUE}Test 1: Server Status${NC}"
if curl -s "http://localhost:3001" > /dev/null; then
    echo -e "${GREEN}✅ Server is running on http://localhost:3001${NC}"
else
    echo -e "${RED}❌ Server is not running${NC}"
    exit 1
fi
echo ""

# Test 2: Check auth page
echo -e "${BLUE}Test 2: Authentication Page${NC}"
if curl -s "http://localhost:3001/demo/veriforce/auth" | grep -q "Sarah Johnson"; then
    echo -e "${GREEN}✅ Auth page is working - Sarah Johnson found${NC}"
else
    echo -e "${RED}❌ Auth page issue - Sarah Johnson not found${NC}"
fi
echo ""

# Test 3: Check current session status
echo -e "${BLUE}Test 3: Current Session Status${NC}"
SESSION_RESPONSE=$(curl -s "http://localhost:3001/api/test/session")
if echo "$SESSION_RESPONSE" | grep -q '"authenticated":false'; then
    echo -e "${YELLOW}⚠️  No user authenticated (expected before login)${NC}"
    echo "   To authenticate: Go to http://localhost:3001/demo/veriforce/auth and click 'Sarah Johnson'"
else
    echo -e "${GREEN}✅ User is authenticated${NC}"
    echo "Session: $SESSION_RESPONSE"
fi
echo ""

# Test 4: Check backend API with dummy data
echo -e "${BLUE}Test 4: Backend API Endpoint${NC}"
API_RESPONSE=$(curl -s "http://localhost:3001/api/tableau/workbooks?siteId=test&userId=test&restToken=test&page=1&pageSize=5")
if echo "$API_RESPONSE" | grep -q "401"; then
    echo -e "${GREEN}✅ Backend API is working (401 expected with dummy token)${NC}"
else
    echo -e "${RED}❌ Backend API issue${NC}"
    echo "Response: $API_RESPONSE"
fi
echo ""

# Test 5: Check safety dashboard
echo -e "${BLUE}Test 5: Safety Dashboard Page${NC}"
if curl -s "http://localhost:3001/demo/veriforce/safety" | grep -q "No Dashboards Available"; then
    echo -e "${YELLOW}⚠️  Safety dashboard shows 'No Dashboards Available' (expected before authentication)${NC}"
else
    echo -e "${GREEN}✅ Safety dashboard is loading${NC}"
fi
echo ""

echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. 🔑 Go to: http://localhost:3001/demo/veriforce/auth"
echo "2. 👤 Click on 'Sarah Johnson' to authenticate"
echo "3. 📊 Navigate to: http://localhost:3001/demo/veriforce/safety"
echo "4. ✨ You should see workbooks in the navigation sidebar"
echo ""
echo "If you see workbooks after authentication, the system is working! 🎉"
