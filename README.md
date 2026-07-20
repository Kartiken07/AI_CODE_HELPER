# CodeScope - AI-Powered Code Complexity Analyzer

A full-stack application that analyzes code time and space complexity using Grok AI, with interactive graphs and platform-specific suggestions.

## Tech Stack

- **Frontend:** React + Vite + Recharts + Monaco Editor
- **Backend:** FastAPI + Python
- **AI:** Grok API (x.ai)

## Project Structure

```
code-complexity-analyzer/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx      # Monaco code editor
│   │   │   ├── ComplexityGraph.jsx  # Interactive charts
│   │   │   ├── AnalysisResults.jsx  # Analysis display
│   │   │   └── Selector.jsx        # Language/platform selector
│   │   ├── services/
│   │   │   ├── api.js              # Backend API calls
│   │   │   └── constants.js        # Sample codes & options
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── backend/           # FastAPI backend
    ├── main.py        # API server
    ├── requirements.txt
    └── .env           # API keys (not committed)
```

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add your Grok API key
cp .env.example .env
# Edit .env and add your GROK_API_KEY

# Start the server
python main.py
```

The backend runs at `http://localhost:8000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`

## Features

- **Code Editor** - Monaco editor with syntax highlighting
- **AI Analysis** - Grok AI analyzes time & space complexity
- **Interactive Graphs** - Area, Line, and Bar chart views
- **Platform Suggestions** - LeetCode and GeeksforGeek specific tips
- **Optimized Code** - AI suggests improved versions
- **Bottleneck Detection** - Identifies performance issues

## Getting a Grok API Key

1. Go to https://console.x.ai
2. Sign up / Log in
3. Navigate to API Keys
4. Create a new API key
5. Add it to `backend/.env`
