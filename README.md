# Aivon - AI Voice of Network

Aivon is a modern demo application that simulates a telecom voice assistant experience.
Users can start a fake call, speak (or use demo prompts), receive multilingual AI responses, and view analytics.

This project is presentation-ready and designed to feel like a real product, even without telecom/PSTN integration.

## Stack

### Frontend (repo root)

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### Backend

- FastAPI
- REST + WebSocket endpoints
- OpenAI integration with fallback responses

## Current Project Layout

- app: Next.js app routes (landing, call simulation, dashboard)
- components: UI components
- hooks: frontend hooks
- lib: frontend API and WebSocket client utilities
- backend/app: FastAPI application code
- backend/requirements.txt: Python dependencies

## Implemented Features

- Landing page with product narrative and CTA
- Main call simulation screen with:
  - call status (Connecting, Active, Ended)
  - fake caller ID
  - call timer
  - language selector (Hausa, Yoruba, Igbo, English)
  - transcript stream
  - voice waveform animation
  - mic start/stop controls
  - end call action
- Browser speech-to-text integration
- Text-to-speech playback of assistant responses
- Backend AI processing endpoint
- WebSocket streaming endpoint for chunked response simulation
- Dashboard page with mock analytics and language distribution chart
- Fallback responses when API key/model call fails

## API Endpoints

- GET /health
- POST /process
- WS /ws

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+

## Run Frontend

From repository root:

```bash
npm install
npm run dev
```

Frontend URL:

- http://localhost:3000

## Run Backend

From backend folder:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend URL:

- http://localhost:8000

## Environment Variables

### backend/.env

```env
OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend env (optional)

Create a root .env.local if you want to override defaults:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

If frontend env is not set, defaults already point to localhost:8000.

## Demo Script (Recommended)

1. Open the landing page and click Start Call Simulation.
2. Pick Hausa and run an agriculture query from the demo list.
3. Show transcript updates and waveform while AI is processing.
4. Let response play with text-to-speech.
5. End call and move to dashboard to show usage metrics.

## Notes

- This is a simulation prototype, not real telecom integration.
- Browser speech recognition support varies by browser.
- If OpenAI is unavailable, backend returns multilingual fallback responses.

## Next Enhancements

- Persist call history
- Voice profile selection
- Language auto-detection
- Real call recording and playback
- Telecom gateway integration (future phase)
