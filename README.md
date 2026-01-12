# RoboCon Backend — a friendly, minimal CRUD API

This repository is a compact, production-minded Node.js API that uses Express and Mongoose. It provides a small set of endpoints for managing simple "items" and is written to be easy to read and extend.

---

## Quick start (local)

1. Duplicate the example environment and provide a MongoDB connection string (Atlas or local):

   cp .env.example .env
   # then edit .env and set MONGO_URI

2. Install dependencies:

   npm install

3. Run in development mode (auto restarts on change):

   npm run dev

Server default: http://localhost:4000

Tip: If you don't have a MongoDB URI handy, the app can start an in-memory MongoDB for quick local testing.

---

## API Endpoints

Base path: `/api/items`

- POST /api/items — create a new item (returns 201)
- GET /api/items — list all items (returns 200)
- GET /api/items/:id — fetch a single item (200 or 404)
- PUT /api/items/:id — update an item (200 or 404)
- DELETE /api/items/:id — remove an item (200 or 404)

Responses always use JSON and follow this general pattern:

Success:

{
  "success": true,
  "message": "optional human-friendly message",
  "data": { ... },
  "meta": { ... }
}

Error:

{
  "success": false,
  "message": "short explanation",
  "errors": [ ... ]
}

### Curl examples

Create:

curl -X POST http://localhost:4000/api/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"Widget","price":9.99,"quantity":10}'

List:

curl http://localhost:4000/api/items

Get single:

curl http://localhost:4000/api/items/<id>

Update:

curl -X PUT http://localhost:4000/api/items/<id> \
  -H 'Content-Type: application/json' \
  -d '{"price":12.5}'

Delete:

curl -X DELETE http://localhost:4000/api/items/<id>

You can import these into Postman or any HTTP client.

---

## How it works (plain English)

- A client sends an HTTP request to the server (for example, POST /api/items).
- Express runs middleware (security headers, CORS, body parsing) and then finds the matching route.
- The route may validate and sanitize the request using `express-validator`.
- If validation passes, the controller performs the action using Mongoose models (create, read, update, delete).
- Mongoose also enforces schema-level rules (required fields, types, ranges). If an error happens, it bubbles to a centralized error handler which returns a friendly JSON error response.

---

## Notes on deployment

- Set `MONGO_URI` in your environment (MongoDB Atlas is a good option for production).
- Use a process manager (PM2) or a platform (Render, Railway, AWS) for a reliable deployment.
- Add monitoring and backups for production databases.

### Vercel (Serverless)

- This project can be deployed to Vercel as a single serverless function that handles `/api/*` routes.
- **Important:** Set the `MONGO_URI` environment variable in Vercel (Project Settings → Environment Variables) for production.

Deploy steps:

1. (Optional) Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root and follow prompts, or push to a connected Git repo to trigger automatic deployments.

Notes:

- In production the app requires `MONGO_URI` — the app will refuse to start in production without it. For local development you can keep using the in-memory DB.
- The base API path remains `/api/items` (e.g. `https://<your-deploy>.vercel.app/api/items`).

---

## Next steps

If you'd like, I can add:
- Dockerfile and a small `docker-compose` for local development ✅
- CI that runs linting and tests ✅
- A simple Postman collection or OpenAPI spec ✅

Tell me which of those you'd like me to add first and I'll scaffold it.