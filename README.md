# Sync — Room Tracker

A web app for browsing, booking, and tracking campus rooms. Built with React, TypeScript, Vite, and Supabase.

## Features

- **Authentication** — email/password sign up and login, admin & staff roles, protected routes
- **Room management** — browse rooms with search and filters (building, floor, equipment, status)
- **Room booking** — book with conflict prevention (overlapping bookings blocked at the database level), cancel your own bookings
- **Room dashboard** — real-time room grid grouped by building with quick filters and status (available / occupied / maintenance)
- **Floor plan** — 2D SVG view plus a 3D building view (React Three Fiber) with orbit controls
- **Issue reporting** — report equipment issues; admins verify and resolve them
- **Admin panel** — manage rooms, buildings, equipment, users, and app settings

See [FEATURES.md](./FEATURES.md) for the full feature list.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, React Router, Tailwind CSS 4, Lucide icons |
| 3D / floor plan | Three.js, React Three Fiber, Drei |
| Data / state | TanStack Query, Supabase (Postgres, Auth, Realtime) |
| Build | Vite 8, TypeScript |

## Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 8) and npm
- A **Supabase** account — [supabase.com](https://supabase.com) (free tier is fine)

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd sync
npm install
```

### 2. Create your Supabase project

1. Go to [database.new](https://database.new) and create a project.
2. In the Supabase dashboard, open **SQL Editor** and run the entire contents of [`database-setup.sql`](./database-setup.sql). This creates all tables, row-level security policies, and the booking-conflict trigger.
3. Optionally seed sample data, in this order:
   - [`add-building-dimensions.sql`](./add-building-dimensions.sql) — adds 3D building dimension columns
   - [`sample-floor-plan-data.sql`](./sample-floor-plan-data.sql) — demo floor plan positions
   - [`sti-calooocan-seed.sql`](./sti-calooocan-seed.sql) — a sample building with rooms (requires the dimensions migration above)

### 3. Configure environment variables

The `.env` file is **not committed** to the repo, so you need to create it yourself in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find both values in your Supabase dashboard under **Project Settings → API** (the anon/public key).

### 4. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000**.

### 5. Register and make yourself an admin (optional)

Register an account in the app, then promote yourself in the Supabase **SQL Editor**:

```sql
UPDATE profiles SET role = 'admin' WHERE id = (
  SELECT id FROM auth.users WHERE email = 'you@example.com'
);
```

New accounts default to the `staff` role; admin-only pages (e.g. `/admin`) require the `admin` role.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on port 3000 (hot reload) |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check only (`tsc --noEmit`) |

## Project Structure

```
├── src/
│   ├── components/     # UI, layout, auth, and feature components
│   ├── hooks/          # Auth and data hooks (useAuth, room/booking queries)
│   ├── lib/            # Supabase client and utility helpers
│   ├── pages/          # Route pages (Home, Rooms, FloorPlan, ...)
│   │   └── admin/      # Admin-only pages (Dashboard, ManageRooms, Issues, Settings)
│   └── types/          # Shared TypeScript types
├── database-setup.sql             # Full database schema + RLS policies + triggers
├── add-building-dimensions.sql    # Migration: 3D building dimension columns
├── sample-floor-plan-data.sql     # Optional demo floor plan positions
├── sti-calooocan-seed.sql         # Optional sample building + rooms seed
└── vite.config.ts                 # Vite config (port 3000, `@` alias → src)
```

## Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Home |
| `/rooms`, `/rooms/:id` | Public | Room list & detail |
| `/login`, `/register` | Public | Auth |
| `/book/:roomId`, `/my-bookings` | Signed in | Book a room, your bookings |
| `/dashboard`, `/floor-plan` | Signed in | Room dashboard, floor plans |
| `/admin/*` | Admin | Admin panel |

## Troubleshooting

- **Blank page or Supabase errors after cloning** — make sure `.env` exists with both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart the dev server (Vite only reads env vars at startup).
- **"relation does not exist" errors** — the database schema hasn't been applied. Run `database-setup.sql` in the Supabase SQL Editor.
- **"Error fetching profile" / `PGRST116` in the console** — the schema was applied before the `handle_new_user` trigger existed, so existing accounts have no `profiles` row. Re-run `database-setup.sql` (it is safe to re-run) to install the trigger and backfill missing profiles.
- **Floor plan / rooms pages are empty** — the sample data was never loaded. Run `add-building-dimensions.sql`, then `sti-calooocan-seed.sql` (and optionally `sample-floor-plan-data.sql`) in the Supabase SQL Editor.
- **"email rate limit exceeded" on signup** — the built-in Supabase email service is heavily throttled and only delivers to your organization's members. Turn off **Confirm email** under Authentication → Sign In / Providers → Email while developing, or configure a custom SMTP provider.
- **"Email address ... is invalid" on signup** — Supabase rejects test/example domains and Gmail addresses with fewer than 6 characters before the `@`. Use a real address.
- **Can't access `/admin`** — your account still has the `staff` role. Use the SQL snippet in step 5 above.
- **Port 3000 already in use** — stop the process using it, or change `server.port` in `vite.config.ts` and the `--port` flag in `package.json`.
