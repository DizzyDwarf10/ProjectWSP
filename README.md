# ProjectWSP Fullstack Exercise App

This project is now fullstack:

- Client: Vue 3 + TypeScript
- Server: Node.js + Express
- Database: SQLite
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
- DB_FILE
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
