# Production Deployment & Operations Guide
## Restaurant Electrical Authority (REA)

---

## 1. Infrastructure Overview

The REA architecture is designed for turnkey cloud deployment:
- **Frontend SPA**: Hosted on Vercel / Netlify / Cloudflare Pages (Static Edge CDN).
- **Backend API**: Hosted on Render / Railway / AWS ECS / Ubuntu VPS (Node.js Container).
- **Database & Storage**: Supabase Managed Cloud (PostgreSQL 15, Supabase Auth, Storage Buckets).

```
   [Browser / Mobile Client]
              │
              ├─── (Static Assets) ───► [Vercel Edge CDN]
              │
              └─── (REST API) ────────► [Render / VPS Backend Node.js]
                                                 │
                                                 ├───► [Supabase PostgreSQL (RLS)]
                                                 └───► [Supabase Storage (S3)]
```

---

## 2. Supabase Setup & Migration Sequence

1. **Create Supabase Project**:
   - Navigate to [supabase.com](https://supabase.com) and create a new project.
   - Note your Project URL, Anon Key, and Service Role Key from Project Settings > API.

2. **Execute Migrations**:
   Run the SQL scripts in the Supabase SQL Editor in the following order:
   - `supabase/migrations/20260101000000_create_schema.sql` (Creates all 37 tables, constraints, indexes, triggers).
   - `supabase/migrations/20260101000001_rls_policies.sql` (Applies strict Row Level Security policies).
   - `supabase/migrations/20260101000002_storage_buckets.sql` (Creates `documents`, `evidence`, `certificates`, `photos` buckets).
   - `supabase/seed.sql` (Populates complete initial data, 7 users, sample organizations, assessments, courses, and credentials).

---

## 3. Backend Deployment (Render / VPS)

### Environment Variables
Configure the following in your hosting provider's environment settings:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://rea-compliance.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=production-grade-random-secret-key-64-characters
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM="Restaurant Electrical Authority" <notifications@rea-compliance.com>
```

### Build & Start Commands
- **Build Command**: `npm install --omit=dev`
- **Start Command**: `node src/server.js`

---

## 4. Frontend Deployment (Vercel)

### Environment Variables
```env
VITE_API_URL=https://api.rea-compliance.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Vercel Configuration
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites for SPA Routing**: Add `vercel.json` with rewrites `[{"source": "/(.*)", "destination": "/index.html"}]`.
