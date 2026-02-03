# URL Shortner

A full-stack URL shortener with a Next.js front-end and an Express/TypeScript back-end. The service creates short links with optional expiry dates, stores them in Supabase, and uses Redis for caching and tracking link usage. The front-end provides a simple UI to submit URLs, set an expiry time, and copy or open the generated short link.

## Features

- Create short URLs with optional custom expiry dates.
- Redirect short URLs to the original destination.
- Redis-backed caching for fast lookups.
- Scheduled job to persist "last used" timestamps from Redis to Supabase.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, shadcn/ui, framer-motion.
- **Backend:** Express + TypeScript.
- **Data/Cache:** Supabase (Postgres), Redis.

## Prerequisites

- Node.js 18.x (matches the backend engine requirement).
- Redis instance (local or hosted).
- Supabase project with a `urls` table (see schema notes below).

## Repository Structure

- `backend/` – Express API, Redis cache utilities, Supabase data access, cron job.
- `frontend/` – Next.js UI for shortening and copying URLs.

## Local Installation

### 1) Clone and install dependencies

```bash
# From the repo root
cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure environment variables

Create a `.env` file in `backend/` with:

```bash
# backend/.env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_or_anon_key
REDIS_URL=redis://localhost:6379
SERVER_URL=http://localhost:8000/api/url/
```

Create a `.env.local` file in `frontend/` with:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> `SERVER_URL` is used by the backend to build the public short link. `NEXT_PUBLIC_API_BASE_URL` should point to your running backend.

### 3) Supabase schema notes

The backend expects a `urls` table with at least the following columns:

- `original_url` (text)
- `short_key` (text, unique)
- `cust_expiry` (timestamp, nullable)
- `last_used` (timestamp, nullable)

### 4) Run the backend

```bash
cd backend
npm run build
npm start
```

The API runs on `http://localhost:8000`.

### 5) Run the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` to use the UI.

## API Endpoints

- `POST /api/url/shorten` – Create a short URL.
  - Body: `{ "url": "https://example.com", "cust_expiry": "2025-12-31T23:59:59Z" }`
- `GET /api/url/:shortId` – Redirect to the original URL.

## Notes

- Redis is used for caching short URL lookups and tracking `last_used` timestamps.
- A cron job runs every minute to flush `last_used` updates from Redis to Supabase.
