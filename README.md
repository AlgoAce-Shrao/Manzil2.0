# Manzil2_0

Minimal setup to run the backend and static client.

## Setup

1. Create a `.env` file in `server/` with:
```
PORT=5000
# optional
MONGODB_URI=
# Groq API key (free tier): https://console.groq.com/
GROQ_API_KEY=
```

2. Install dependencies:
```
cd server
npm install
```

3. Run the server:
```
npm run dev
```
Server: http://localhost:5000

## LLM
- Uses Groq `llama-3.1-70b-versatile` via `/api/career/*` and chatbot.
- If `GROQ_API_KEY` is missing, responses fall back to safe stub text so the app still works for demo.

## Frontend
Static files are in `client/`. You can open pages directly in the browser or serve them from Express if desired.
