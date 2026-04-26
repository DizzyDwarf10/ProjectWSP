# ProjectWSP Fullstack Exercise App

This project is now fullstack:

- Client: Vue 3 + TypeScript
- Server: Node.js + Express
- Database: SQLite (default local) or Supabase Postgres
- Auth: JWT bearer tokens with server-side authorization rules

## Architecture

Server-side layers are separated by concern:

- db: centralized SQL access and schema setup
- models: all data CRUD and query logic
- controllers: request validation, auth/ownership checks, response shaping
- routes: endpoint definitions and middleware policies

Core controllers/models:

- Users: account CRUD + friend relationships
- Exercise Types: CRUD (admin-managed)
- Activities: CRUD + custom summary + friend feed
- Auth: register/login/me

## Environment Variables

Copy the example file and set values:

1. Root server env: copy .env.example to .env
2. Client env: copy client/.env.example to client/.env

Required server env variables:

- PORT
- CLIENT_ORIGIN
- JWT_SECRET
- JWT_EXPIRES_IN
- DB_PROVIDER (`sqlite` or `supabase`)
- DB_FILE (when `DB_PROVIDER=sqlite`)
- SUPABASE_DB_URL (when `DB_PROVIDER=supabase`)
- SEED_JOE_PASSWORD
- SEED_SAM_PASSWORD
- SEED_LEBRON_PASSWORD

Required client env variable:

- VITE_API_BASE_URL

## Run Locally

Install dependencies:

1. npm install
2. cd client && npm install

Start server:

1. npm run dev:server

Start client in a second terminal:

1. npm run dev:client

## Authorization Rules

- JWT required for all user, activity, and exercise type routes
- User-specific activity writes are always bound to req.user.id from verified JWT
- Users can only edit their own profile unless admin
- Users can only access friend activities if friend relation exists (or admin)
- Only admins can manage exercise types and delete users

## Hosted Environment Notes

- Configure server variables in your host dashboard instead of committing a real .env file.
- Configure VITE_API_BASE_URL in the client host so the built app points at the deployed API.
- Keep JWT_SECRET and the seed account passwords in the server host environment only.

## Supabase Setup (Database)

1. Create a new Supabase project.
2. In Supabase dashboard, open Project Settings > Database and copy the Postgres connection string.
3. In your server environment, set:
	- `DB_PROVIDER=supabase`
	- `SUPABASE_DB_URL=<your Supabase Postgres connection string>`
	- `JWT_SECRET=<long random secret>`
	- `CLIENT_ORIGIN=<your client URL>`
	- `SEED_JOE_PASSWORD`, `SEED_SAM_PASSWORD`, `SEED_LEBRON_PASSWORD`
4. Start the server once. On startup it runs `initSchema()` and creates/tops up the required tables and seed data in Supabase.
5. Verify with `GET /api/health` and a login attempt (`Joe` + your configured seed password).

Notes:
- This app uses Supabase as managed Postgres only (not Supabase Auth).
- If your connection string requires SSL, this server already connects with SSL enabled for Postgres.

## Render Deployment

Deploy the server first, then point the client to it.

Server (Render Web Service):

1. Push repository to GitHub.
2. In Render, create a new Web Service from the repo.
3. Configure:
	- Build Command: `npm install`
	- Start Command: `npm run dev:server`
	- Root Directory: project root
4. Add environment variables:
	- `PORT=10000` (or leave unset and let Render inject)
	- `DB_PROVIDER=supabase`
	- `SUPABASE_DB_URL=<your Supabase Postgres URL>`
	- `JWT_SECRET=<long random secret>`
	- `JWT_EXPIRES_IN=2h`
	- `CLIENT_ORIGIN=<your deployed client URL>`
	- `SEED_JOE_PASSWORD`, `SEED_SAM_PASSWORD`, `SEED_LEBRON_PASSWORD`
5. Deploy and test `https://<server>.onrender.com/api/health`.

Client (Render Static Site):

1. Create a new Static Site from the same repo.
2. Configure:
	- Root Directory: `client`
	- Build Command: `npm install && npm run build`
	- Publish Directory: `dist`
3. Add env var:
	- `VITE_API_BASE_URL=https://<server>.onrender.com/api`
4. Deploy.
5. Update server `CLIENT_ORIGIN` to your static site URL and redeploy server once.

## Default Seed Logins

- Joe / joe123
- Sam / sam123
- Lebron / lebron123

## Data Ownership

All important app data is persisted on the server/database:

- users
- friendships
- exercise types
- activities

No critical records are sourced from client-side JSON.
