# AI Insights Integration Testing Guide

## 🎯 Overview
This guide provides step-by-step instructions for testing the AI-powered insights feature powered by Google Gemini 2.5-flash.

---

## 📋 Prerequisites

### 1. Environment Setup

**Backend Environment (.env)**
```bash
# In root directory: .env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Frontend Environment (.env.local)**
```bash
# In frontend/.env.local
BACKEND_API_URL=http://localhost:5000/api/upload
```

### 2. Dependencies Installed

**Backend:**
```bash
# Check requirements.txt includes:
pip install google-generativeai python-dotenv flask flask-cors pandas numpy
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## 🚀 Testing Procedure

### Step 1: Start Backend Server

```bash
# From root directory
python run_server.py
```

**Expected Output:**
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

**Health Check:**
```bash
# In another terminal
curl http://localhost:5000/

# Expected response:
{
  "status": "iz good",
  "message": "Feedback Form Analyzer API is running",
  "version": "1.0.0"
}
```

---

### Step 2: Test Backend AI Endpoints (Optional)

Run the automated test script:
```bash
python debug/test_ai_endpoints.py
```

**Expected Output:**
```
🧪 AI INSIGHTS API TEST SUITE

============================================================
BACKEND HEALTH CHECK
============================================================

✅ Backend server is running!
Status: iz good
Message: Feedback Form Analyzer API is running
Version: 1.0.0

============================================================
TESTING SESSION INSIGHTS ENDPOINT
============================================================

POST http://localhost:5000/api/ai/session-insights
Status Code: 200

✅ SUCCESS!

AI INSIGHTS:
🔑 Key Insights:
  1. Python session achieves Star status with 45 attendees and 4.2 satisfaction
  2. React workshop shows Hidden Gem potential - high satisfaction, low attendance
  3. Git workshop is Crowd Favorite - needs content improvement despite popularity

🎯 Strategic Recommendations:
  1. Specific action: Double down on Python intro format - proven Star performance
  2. Specific action: Promote React Hooks via social media - Hidden Gem potential
  3. Specific action: Redesign Git content based on 3.9/5 satisfaction scores
  4. Specific action: Consider splitting Git workshop - attendance too high for quality

💡 Growth Opportunities:
  1. Scale React-style workshops - high satisfaction with expansion potential
  2. Experiment with advanced Python topics based on intro session success

⚠️ Risk Areas:
  1. Immediate attention: Git Workshop - high attendance but declining satisfaction

============================================================
TESTING MARKETING INSIGHTS ENDPOINT
============================================================

[Similar structured output for marketing channels...]

============================================================
TEST SUITE COMPLETE
============================================================
```

---

### Step 3: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

### Step 4: Upload Test Data

1. **Navigate to:** `http://localhost:3000`
2. **Upload CSV:** Use `test_data/feedback_forms-3.csv` (or any valid CSV)
3. **Wait for analysis:** Dashboard should load automatically

**Expected Behavior:**
- ✅ File uploads successfully
- ✅ Analysis tab loads with charts
- ✅ No JavaScript errors in console

---

### Step 5: Navigate to Session Analytics Tab

1. **Click:** "Session Analytics" tab (icon: 📊)
2. **Verify charts load:**
   - Session Performance Matrix (bubble chart)
   - Discovery Channel Impact (dual-axis chart)

**Expected Behavior:**
- ✅ Both charts render with data
- ✅ Basic insights show: _"Click 'Generate AI Insights' for..."_
- ✅ Purple "Generate AI Insights" buttons visible on both cards

---

### Step 6: Test Session Insights Generation

#### Actions:
1. **Scroll to:** "Session Performance Matrix" card
2. **Click:** Purple "Generate AI Insights" button

#### Expected States:

**Loading State (1-3 seconds):**
- Button text: "Generating..."
- Button disabled (gray background)
- Cannot click again

**Success State:**
- Button text: "Refresh AI Insights"
- Button re-enabled (purple gradient)
- Insights panel updates with 4 sections:

**🤖 AI-Powered Insights** (Purple stars ✦)
- 3 one-line observations (max 15 words each)
- Example: _"Python session achieves Star status with 45 attendees and 4.2 satisfaction"_

**🎯 Strategic Recommendations** (Blue panel, border)
- 3-4 specific action items
- Example: _"Specific action: Double down on Python intro format - proven Star performance"_

**💡 Growth Opportunities** (Green panel, border)
- 2-3 expansion ideas
- Example: _"Scale React-style workshops - high satisfaction with expansion potential"_

**⚠️ Risk Areas** (Red panel, border)
- 1-2 urgent concerns
- Example: _"Immediate attention: Git Workshop - high attendance but declining satisfaction"_

---

### Step 7: Test Marketing Insights Generation

#### Actions:
1. **Scroll to:** "Discovery Channel Impact" card
2. **Click:** Purple "Generate AI Insights" button

#### Expected States:

**Loading State (1-3 seconds):**
- Button text: "Generating..."
- Button disabled

**Success State:**
- 4 insight panels appear:

**🤖 AI-Powered Insights** (Purple stars ✦)
- 3 one-line channel observations

**📢 Marketing Recommendations** (Blue panel)
- 3-4 specific marketing tactics
- Example: _"Specific tactic: Increase Social Media ad spend by 40% - highest ROI proven"_

**💡 Growth Opportunities** (Green panel)
- 2-3 marketing expansion ideas

**💰 Budget Allocation** (Orange panel)
- 2-3 budget reallocation suggestions
- Example: _"Reallocate 30% budget from Email to Social Media"_

---

### Step 8: Verify Error Handling

#### Test Invalid Data:
```bash
# Stop backend server
# Try generating insights

Expected:
- Loading spinner stops
- Error message appears in panel
- Falls back to basic insights
```

#### Test Network Failure:
```bash
# Disconnect internet
# Click "Generate AI Insights"

Expected:
- Graceful error message
- No app crash
- Can retry when connection restored
```

---

## 🔍 Validation Checklist

### Visual Checks:
- [ ] Basic insights show instructional text before AI generation
- [ ] AI button has purple gradient styling
- [ ] Loading state disables button and shows "Generating..."
- [ ] AI insights use purple stars (✦), basic use blue dots (•)
- [ ] All 4 insight panels render with proper colors
- [ ] Insights are concise (one-liners for key insights)
- [ ] Strategic recommendations are specific and actionable

### Functional Checks:
- [ ] Backend server starts without errors
- [ ] Frontend connects to backend successfully
- [ ] CSV upload and analysis work
- [ ] Session insights generate within 5 seconds
- [ ] Marketing insights generate within 5 seconds
- [ ] "Refresh AI Insights" updates content
- [ ] Multiple clicks don't cause duplicate requests
- [ ] Browser console has no errors

### Content Quality Checks:
- [ ] Key insights are ≤15 words each
- [ ] Recommendations reference actual session/channel names
- [ ] No generic advice ("improve engagement", etc.)
- [ ] Budget allocations include specific percentages/amounts
- [ ] Growth opportunities are data-driven
- [ ] Risk areas identify specific sessions/channels

---

## 🐛 Common Issues & Solutions

### Issue 1: "GEMINI_API_KEY not found"
**Solution:**
```bash
# Create .env in root directory
echo "GEMINI_API_KEY=your_key_here" > .env

# Restart backend server
python run_server.py
```

### Issue 2: Button stuck on "Generating..."
**Cause:** Backend error or timeout  
**Solution:**
1. Check backend terminal for errors
2. Verify Gemini API key is valid
3. Check network connection
4. Refresh page and retry

### Issue 3: "Failed to generate AI insights"
**Cause:** Invalid JSON response from Gemini  
**Solution:**
1. Check backend logs for parsing errors
2. Gemini might have returned markdown - retry
3. Check Gemini API quota limits

### Issue 4: Generic/vague insights
**Cause:** Insufficient data in CSV  
**Solution:**
1. Use CSV with more diverse sessions/channels
2. Ensure satisfaction scores vary
3. Check that session names are descriptive

### Issue 5: CORS errors in browser console
**Solution:**
```bash
# Verify flask-cors is installed
pip install flask-cors

# Check main.py has:
from flask_cors import CORS
CORS(app)
```

---

## 📊 Sample Test Data

### Good Test CSV Characteristics:
- **Minimum:** 30-50 responses
- **Sessions:** 5-10 unique session names
- **Channels:** 4-8 discovery channels
- **Satisfaction:** Range from 2.0 to 5.0
- **Attendance:** Varied (10 to 100+)

### Recommended Files:
- `test_data/feedback_forms-3.csv` - Comprehensive event data
- `test_data/feedback_forms-1.csv` - Alternative dataset

---

## 🎓 Interpreting Results

### Session Insights Quality Indicators:

**✅ Good AI Response:**
```json
{
  "key_insights": [
    "Python session achieves Star status with 45 attendees and 4.2 satisfaction",
    "3 Hidden Gems identified - high quality but low visibility",
    "Git workshop needs redesign despite 60-person attendance"
  ],
  "strategic_recommendations": [
    "Specific action: Double down on Python intro format - proven Star performance",
    "Specific action: Promote React Hooks via social media - Hidden Gem potential"
  ]
}
```

**❌ Poor AI Response (shouldn't happen with updated prompts):**
```json
{
  "key_insights": [
    "Sessions show varied performance across multiple metrics",
    "Some sessions perform better than others"
  ],
  "strategic_recommendations": [
    "Improve session quality",
    "Market better"
  ]
}
```

---

## 📝 Developer Notes

### Prompt Engineering:
- Key insights capped at **15 words max** for UI clarity
- Strategic recommendations require **"Specific action:"** prefix
- All recommendations must reference **actual data** (session names, numbers)
- Gemini instructed to return **ONLY JSON** (no markdown wrappers)

### API Flow:
```
User clicks button
  → page.tsx handler
  → /api/ai/session-insights (Next.js route)
  → Flask /api/ai/session-insights endpoint
  → gemini_service.generate_session_insights()
  → Google Gemini API
  → Parse JSON response
  → Return to frontend
  → Display in UI
```

### Performance:
- **Target response time:** 2-4 seconds
- **Timeout:** 10 seconds
- **Retry logic:** Frontend handles errors gracefully
- **Caching:** Not implemented (generate fresh on each click)

---

## ✅ Success Criteria

Your integration is working correctly if:

1. ✅ Backend server responds to health check
2. ✅ AI endpoints return valid JSON with all required fields
3. ✅ Frontend displays "Generate AI Insights" button
4. ✅ Loading states work smoothly
5. ✅ AI insights are concise, specific, and actionable
6. ✅ All 4 insight panels render with correct styling
7. ✅ Error handling prevents app crashes
8. ✅ Users can regenerate insights (refresh)

---

## 🚀 Next Steps After Testing

Once testing is complete:

1. **Production Deployment:**
   - Set `GEMINI_API_KEY` in production environment
   - Configure CORS for production domains
   - Set `BACKEND_API_URL` to production backend

2. **Enhancements:**
   - Add insight caching (avoid regenerating same data)
   - Implement streaming responses for real-time generation
   - Add user feedback (thumbs up/down on insights)
   - Track which insights users find most valuable

3. **Monitoring:**
   - Log Gemini API usage and costs
   - Track insight generation success rate
   - Monitor response times
   - A/B test prompt variations

---

## 📞 Support

**Issues?**
- Check backend terminal for error logs
- Inspect browser console (F12) for frontend errors
- Verify `.env` files are configured correctly
- Ensure all dependencies are installed

**Still stuck?**
- Review `Notes/AI Insights API Integration.md` for architecture details
- Check `backend/analysis/gemini_service.py` for prompt templates
- Verify network connectivity and API quota limits
