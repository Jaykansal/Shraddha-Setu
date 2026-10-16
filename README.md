# ShraddhaSetu (श्रद्धासेतु) 🕉️

> **Connecting Faith with Divine Services** — Premium Vedic Pooja booking platform connecting devotees across India with verified Gurukul-trained Pandits and authentic Hawan Samagri.

---

## 🏛️ Platform Architecture Overview

ShraddhaSetu has been modernized into a high-performance, full-stack Vedic platform:

1. **Golang + PostgreSQL Backend (`backend-go/`)**:
   - Ultra-fast RESTful API written in Go 1.22 using standard `net/http` and `database/sql`.
   - Native PostgreSQL database support via `github.com/lib/pq` with automated connection pooling and schema migrations.
   - Built-in zero-config in-memory replica pre-seeded with all 6 master Pujas, verified Acharyas, and demo accounts.
   - Secure bcrypt password hashing and JWT authentication (`golang-jwt/jwt/v5`).
   - Dynamic Samagri price calculation and booking lifecycle management.

2. **Next.js 14 Frontend**:
   - Modern App Router with server-side rendered pages and client interactivity.
   - **0ms Instant Image Delivery**: Unoptimized static routing with gold shimmer skeleton placeholders (`<FastImage />`) eliminating render lag and CLS.
   - **Fixed JSON Parsing Crash**: Completely solved `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` by introducing dedicated `route.js` handlers and Content-Type guarded API clients.
   - **Sacred Vedic Palette**: Auspicious Maroon (`#801318`), Saffron Gold (`#E88B00` / `#D97706`), and Temple Ivory (`#FFFDF7`).

3. **3 Distinct Portals**:
   - 🕉️ **Devotee / Yajman Portal** (`/dashboard/devotee`)
   - 🪔 **Vedic Pandit / Acharya Portal** (`/dashboard/pandit`)
   - 🏛️ **Mandir Samiti Admin Console** (`/dashboard/admin`)

---

## 🔑 Portals & Instant Demo Logins

The front landing page contains a **Unified Portal Modal** with 1-click demo login buttons for every role:

| Portal | Role | Route | Demo Email | Demo Password | Key Features |
|---|---|---|---|---|---|
| **Devotee / Yajman** | `CLIENT` | `/dashboard/devotee` | `devotee@shraddhasetu.com` | `shree108` | Track booking status, call/WhatsApp assigned Pandit, toggle Samagri kit, view DIY checklist, download Sankalp receipt |
| **Vedic Pandit** | `PANDIT` | `/dashboard/pandit` | `pandit@shraddhasetu.com` | `shree108` | View local city bookings, **Accept & Lock Muhurat**, mark **Purnaahuti (Completed)**, track Dakshina earnings |
| **Mandir Samiti Admin** | `ADMIN` | `/dashboard/admin` | `admin@shraddhasetu.com` | `shree108` | Pandit Verification Desk (Approve/Revoke Gurukul credentials), nationwide puja operations monitor |

---

## 🚀 Quick Start Guide

### 1. Backend (Golang + PostgreSQL)

```bash
cd backend-go

# (Optional) Set your PostgreSQL connection string:
# export DATABASE_URL="postgres://postgres:password@localhost:5432/shraddhasetu?sslmode=disable"
# psql -d shraddhasetu -f scripts/schema.sql
# psql -d shraddhasetu -f scripts/seed.sql

# Run Go API server:
go run ./cmd/server
# Listening on http://localhost:8080
```
> *Note: If `DATABASE_URL` is omitted, the Go server automatically boots in high-performance in-memory mode with all seed data ready to go!*

### 2. Frontend (Next.js 14)

```bash
# In the root directory:
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 📁 Repository Structure

```
├── backend-go/                # Golang Backend Service
│   ├── cmd/server/main.go     # HTTP server entrypoint & REST router
│   ├── internal/
│   │   ├── config/            # Environment configuration
│   │   ├── database/          # PostgreSQL & in-memory store
│   │   ├── handlers/          # Auth, Pujas, Pandits, Bookings, Stats
│   │   ├── middleware/        # JWT Auth, CORS, Logger
│   │   └── models/            # Domain models & DTOs
│   ├── scripts/
│   │   ├── schema.sql         # PostgreSQL schema (Users, Poojas, Bookings)
│   │   └── seed.sql           # Master seed data
│   ├── Dockerfile
│   └── go.mod
│
├── public/                    # Local optimized static assets & illustrations
│   └── images/                # Puja cards, hero illustrations, logos
│
├── src/
│   ├── app/
│   │   ├── api/               # Next.js App Router API routes (route.js)
│   │   ├── dashboard/         # 3 Specialized Portals
│   │   │   ├── devotee/       # Devotee / Yajman Dashboard
│   │   │   ├── pandit/        # Vedic Pandit / Acharya Dashboard
│   │   │   └── admin/         # Mandir Samiti Admin Console
│   │   ├── poojas/            # Pooja catalog & booking
│   │   ├── pandits/           # Verified Acharyas directory
│   │   ├── samagri/           # Pure Vedic samagri details
│   │   ├── page.jsx           # Vedic landing page with portal switcher
│   │   └── layout.jsx
│   ├── components/            # Reusable UI components & modals
│   │   ├── ui/FastImage.jsx   # 0ms shimmer image loader
│   │   ├── ui/AuthModal.jsx   # 3-in-1 Portal login & register modal
│   │   └── ui/BookingModal.jsx# Dynamic samagri pricing calculator
│   ├── context/AuthContext.jsx# Role-based auth session provider
│   └── lib/api.js             # Content-Type safe API client with offline fallback
│
├── next.config.mjs            # Image optimization settings & API proxy rewrites
└── package.json
```

---

## 🕊️ Vedic Pujas Offered

1. **Griha Pravesh Pooja** (Vastu Purush & Ganesha — Auspicious new home)
2. **Maha Mrityunjaya Pooja** (Lord Shiva — Health, protection & longevity)
3. **Lakshmi Pooja** (Mata Lakshmi & Lord Kuber — Wealth & prosperity)
4. **Satyanarayan Katha** (Lord Vishnu — Happiness & domestic harmony)
5. **Navagraha Shanti** (Nine Planetary Deities — Planetary balance)
6. **Grah Shanti Pooja** (Lord Ganesha & Navagraha — Peace & obstacle removal)

---

## 📜 License
MIT License. Dedicated with devotion for spiritual seekers and Acharyas across the globe.