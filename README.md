# Events Feedback Forms Analyzer

A full-stack web application for analyzing event feedback data with AI-powered insights using Google's Gemini API.

## Features

- 📊 **Interactive Data Visualization** - Comprehensive charts and graphs for feedback analysis
- 🤖 **AI-Powered Insights** - Sentiment analysis, theme extraction, and strategic recommendations via Gemini
- 📈 **Multi-Dimensional Analysis** - Session performance, marketing channel effectiveness, aspect comparisons
- 🎨 **Modern UI/UX** - Clean, responsive design with dark theme and smooth animations
- ⚡ **Real-time Processing** - Fast CSV upload and instant analysis generation
- 🔒 **Secure Architecture** - Server-side API proxies, environment variable management

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualizations
- **Material-UI Icons** - Modern iconography

### Backend
- **Flask** - Python web framework
- **Pandas/NumPy** - Data processing and analysis
- **Google Gemini AI** - Advanced AI insights generation
- **Gunicorn** - Production WSGI server

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/peaceyyy/Events-Feedback-Forms-Analyzer.git
   cd Events-Feedback-Forms-Analyzer
   ```

2. **Set up environment variables**
   
   Create `.env` in the root directory:
   ```bash
   GEMINI_API_KEY=your-actual-gemini-api-key
   ```

   Create `frontend/.env.local`:
   ```bash
   BACKEND_API_URL=http://localhost:5000
   NEXT_PUBLIC_DEBUG_MODE=true
   ```

3. **Start the backend**
   ```bash
   pip install -r requirements.txt
   python run_server.py
   ```
   Backend runs on http://localhost:5000

4. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on http://localhost:3000

5. **Upload feedback data**
   - Visit http://localhost:3000
   - Click "Quick Test" or upload your own CSV file
   - Explore the interactive dashboard!

## Deployment

### Production-Ready Setup (Vercel + Render)

This project is optimized for deployment with:
- **Frontend**: Vercel (automatic, zero-config Next.js hosting)
- **Backend**: Render (managed Python hosting with auto-scaling)

📖 **[Complete Deployment Guide](./DEPLOYMENT.md)** - Step-by-step instructions for production deployment

📋 **[Environment Variables Reference](./ENV_VARIABLES.md)** - All required env vars explained

### Quick Deploy Summary

1. **Backend on Render:**
   - Connect GitHub repo → Create Web Service
   - Set `GEMINI_API_KEY` in environment variables
   - Deploy with: `gunicorn -w 4 -b 0.0.0.0:$PORT run_server:app`

2. **Frontend on Vercel:**
   - Import GitHub repo → Select `frontend` as root directory
   - Set `BACKEND_API_URL` to your Render backend URL
   - Deploy (automatic on every git push)

**Total Setup Time:** ~10 minutes  
**Monthly Cost:** Free tier available, or $7/mo for always-on backend

## Project Structure

```
├── backend/                    # Flask API server
│   ├── analysis/              # Analysis modules (metrics, sessions, marketing)
│   ├── app/                   # Flask app and routes
│   ├── gemini/                # Gemini AI service integration
│   ├── processing/            # Data processing utilities
│   └── utils/                 # Helper functions
├── frontend/                  # Next.js application
│   └── src/
│       ├── app/               # Next.js App Router pages & API routes
│       ├── components/        # React components
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Utility libraries
│       └── types/             # TypeScript type definitions
├── test_data/                 # Sample CSV files for testing
├── debug/                     # Testing scripts
├── DEPLOYMENT.md              # Production deployment guide
├── ENV_VARIABLES.md           # Environment variables reference
├── render.yaml                # Render.com configuration
├── vercel.json                # Vercel deployment config
├── requirements.txt           # Python dependencies
└── run_server.py              # Backend entry point
```

## API Endpoints

### Backend (Flask)
- `GET /` - Health check
- `POST /api/upload` - Upload and process CSV
- `POST /api/analyze` - Generate analysis
- `POST /api/ai-analysis` - Comprehensive AI insights
- `POST /api/ai/session-insights` - Session performance AI analysis
- `POST /api/ai/marketing-insights` - Marketing channel AI analysis
- `POST /api/ai/aspect-insights` - Event aspect AI analysis
- `GET /api/test` - Load sample data for quick testing

### Frontend (Next.js API Routes)
All frontend calls route through Next.js API proxies for security:
- `/api/upload` - Proxies to Flask upload endpoint
- `/api/test` - Proxies to Flask test endpoint
- `/api/ai-analysis` - Proxies to Flask AI analysis
- `/api/ai/session-insights` - Proxies to Flask session AI
- `/api/ai/marketing-insights` - Proxies to Flask marketing AI
- `/api/ai/aspect-insights` - Proxies to Flask aspect AI

## Features in Detail

### 📊 Analysis Tab
- Overall satisfaction metrics and NPS scoring
- Session attendance and satisfaction trends
- Time slot and venue preferences
- Correlation analysis between metrics

### 🎯 Sessions Tab
- Session performance matrix (Stars, Hidden Gems, Crowd Favorites)
- AI-powered strategic recommendations
- Attendance vs satisfaction scatter plots
- Quadrant-based categorization

### 🎨 Aspect Comparison
- Event aspect ratings (food, venue, content, speakers)
- Performance vs baseline comparisons
- AI insights for quick wins and strategic priorities
- Visual difference indicators

### 💬 Text Insights Tab
- AI sentiment analysis of feedback comments
- Theme extraction from positive/negative feedback
- Strategic recommendations based on text analysis
- Sample feedback carousel

## Security

- ✅ Environment variables for API keys (never committed)
- ✅ Server-side API proxies (backend URL hidden from browser)
- ✅ CORS enabled with proper configuration
- ✅ Input validation on file uploads
- ✅ Error handling with user-friendly messages

## Development

### Adding New Analysis Features

1. **Backend**: Add analysis logic in `backend/analysis/`
2. **API Route**: Create endpoint in `backend/app/main.py`
3. **Frontend Proxy**: Add Next.js API route in `frontend/src/app/api/`
4. **Component**: Create visualization component in `frontend/src/components/`

### Testing

```bash
# Backend tests
python debug/test_comprehensive_analysis.py

# Frontend type checking
cd frontend
npm run build  # Also runs type checks
npm run lint   # ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Google Gemini AI** for powerful text analysis capabilities
- **Vercel** for seamless Next.js hosting
- **Render** for reliable Python backend hosting
- **Recharts** for beautiful data visualizations

---

**Built with ❤️ for better event feedback analysis**
