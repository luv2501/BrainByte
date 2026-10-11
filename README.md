# BrainByte

A LeetCode-style coding practice platform, built from scratch.

## Structure
- `server/` — Node.js + Express + MongoDB backend (auth, problems, submissions, code execution via Judge0)
- `client/` — React frontend (coming in the next phase)

## Backend Setup

```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, JUDGE0_API_KEY
npm run dev
```

Server runs on `http://localhost:5000`. Health check: `GET /api/health`.

## Free services used
- **MongoDB Atlas** (free tier) — database
- **Judge0 via RapidAPI** (free tier) — code execution engine
- **JWT** — auth, no third-party cost

## API Endpoints so far

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/problems | No | List/filter problems |
| GET | /api/problems/:slug | No | Single problem |
| POST | /api/problems/:id/save | Yes | Save/unsave problem |
| GET | /api/problems/saved/me | Yes | List saved problems |
| POST | /api/submissions/run | Yes | Quick run (no grading) |
| POST | /api/submissions/:problemId | Yes | Submit for grading |
| GET | /api/submissions/me | Yes | Submission history |

## Next phase
Frontend (React + Vite + Monaco Editor) — connects to these endpoints.
