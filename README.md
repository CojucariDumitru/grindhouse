# 🍔 GRINDHOUSE

> **No shortcuts. No apologies.**
> A production-grade restaurant website for a premium smash-burger & street-food brand.
> Bold, industrial, neon — Shake Shack meets a 1970s grindhouse poster.

Full-stack TypeScript monorepo: a React + Vite storefront, an Express + Prisma API,
a Postgres database (Neon), transactional email (Resend), and image hosting (Cloudinary).

### 🔗 Live
- **Site (Vercel):** https://grindhouse-one.vercel.app
- **Site (GitHub Pages mirror):** https://cojucaridumitru.github.io/grindhouse/
- **API (Render):** https://grindhouse-api.onrender.com/api/health
- **Admin:** https://grindhouse-one.vercel.app/admin — `admin@grindhouse.com` / `Grind2024!`

---

## ✨ Features

**Storefront**
- Cinematic hero with floating hero image, neon glow & scrolling tickers
- Live menu (22 items across 6 categories) with sticky category tabs, badges (🌶 spicy / 🌱 veg / ⭐ new)
- Reservation booking with validation + confirmation email
- Contact form → saved to DB + email notification
- Parallax About page, auto-scrolling gallery, Google Maps location block
- Fully responsive, Framer Motion throughout, brutalist sharp-edge design system

**Admin panel** (`/admin`, JWT-protected)
- Dashboard: today's bookings, pending confirmations, unread messages, menu counts
- Reservations: filter by status/date, **confirm / cancel** (emails the guest), delete
- Menu manager: add / edit / delete items, **toggle availability**, Cloudinary image upload
- Messages: read/unread, delete

---

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router v6, TanStack Query, React Hook Form + Zod, Axios |
| Backend   | Node.js, Express, TypeScript, Prisma ORM, JWT, Helmet, CORS, rate limiting |
| Database  | PostgreSQL (Neon) |
| Email     | Resend |
| Images    | Cloudinary |
| Hosting   | Vercel (frontend) · Render (backend) |

---

## 📁 Structure

```
grindhouse/
├── server/          # Express + Prisma API
│   ├── src/
│   │   ├── config/        # env, database, cloudinary, resend
│   │   ├── middleware/     # auth (JWT), errorHandler, rateLimiter
│   │   ├── controllers/    # menu, reservation, contact, admin
│   │   ├── routes/         # route definitions
│   │   ├── services/       # email.service.ts
│   │   └── index.ts        # app entrypoint
│   └── prisma/             # schema.prisma + seed.ts
├── client/          # React + Vite app
│   └── src/
│       ├── pages/          # Home, Menu, Reservations, About, Contact, admin/*
│       ├── components/     # layout, home, menu, ui
│       ├── api/            # axios client + typed endpoints
│       ├── context/        # AuthContext
│       └── lib/            # types, site constants
├── render.yaml      # Render blueprint (backend)
└── client/vercel.json
```

---

## 🔑 Admin Access

| | |
|---|---|
| URL | `https://grindhouse.vercel.app/admin` (or `http://localhost:5173/admin` locally) |
| Email | `admin@grindhouse.com` |
| Password | `Grind2024!` |

The admin user is created by the seed script.

---

## 💻 Run Locally

**Prerequisites:** Node 18+, a Postgres URL.

### 1. Backend
```bash
cd server
npm install
cp .env.example .env          # then fill in DATABASE_URL etc.
npx prisma migrate dev        # creates tables
npm run seed                  # admin + 20 menu items + demo data
npm run dev                   # → http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev                   # → http://localhost:5173
```

The client reads `VITE_API_URL` from `.env.development` (defaults to `http://localhost:5000/api`).

---

## 🔐 Environment Variables

### `server/.env`
| Var | Notes |
|-----|-------|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `RESEND_API_KEY` | Resend key (emails no-op if unset) |
| `EMAIL_FROM` | `reservations@grindhouse.com` |
| `RESTAURANT_EMAIL` | where new-booking / contact notifications go |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | image uploads |
| `CLIENT_URL` | allowed CORS origin(s), comma-separated |

### `client/.env.production` / `.env.development`
| Var | Value |
|-----|-------|
| `VITE_API_URL` | `https://grindhouse-api.onrender.com/api` (prod) · `http://localhost:5000/api` (dev) |

> ⚠️ `server/.env` is git-ignored. Production secrets live only in the Render/Vercel dashboards.

---

## 🚀 Deploy

### A. Backend → Render
1. **New → Blueprint**, select this repo. Render reads `render.yaml`.
2. When prompted, paste the three secrets:
   - `DATABASE_URL` → your Neon connection string
   - `RESEND_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - (`JWT_SECRET` is auto-generated.)
3. Deploy. The start command runs `prisma migrate deploy` automatically.
4. **Seed the DB once:** open the Render **Shell** and run:
   ```bash
   npx prisma db seed
   ```
5. Note the live URL, e.g. `https://grindhouse-api.onrender.com`.
   > Free Render instances sleep after inactivity; the first request may take ~30s.

### B. Frontend → Vercel
1. **New Project**, import this repo, set **Root Directory = `client`**.
2. Add env var `VITE_API_URL = https://<your-render-app>.onrender.com/api`.
3. Deploy. Vercel auto-detects Vite; `vercel.json` handles SPA routing.

### C. Wire them together
- Set Render's `CLIENT_URL` to your real Vercel URL (CORS).
- Redeploy the backend if you change it.

---

## 🧭 API Reference

**Public**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | health check |
| GET | `/api/menu` | full menu grouped by category |
| GET | `/api/menu/featured` | popular items |
| POST | `/api/reservations` | create booking (+ emails) |
| POST | `/api/contact` | send message (+ email) |

**Admin** (`Authorization: Bearer <token>`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | get JWT |
| GET | `/api/admin/dashboard` | stats |
| GET / POST / PATCH / DELETE | `/api/admin/menu...` | menu CRUD, `/:id/availability` toggle, `/upload` |
| GET / PATCH / DELETE | `/api/admin/reservations...` | list / `/:id/status` / delete |
| GET / PATCH / DELETE | `/api/admin/messages...` | list / `/:id/read` / delete |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Black | `#0D0D0D` · Red `#E63312` · Yellow `#FFD600` · White `#F5F5F0` |
| Display | Bebas Neue · Body Inter · Labels Space Mono |
| Motifs | grain overlay, red neon glow, sharp edges (no rounded corners), uppercase, red rules |

---

Built as a portfolio project. © GRINDHOUSE NYC.
