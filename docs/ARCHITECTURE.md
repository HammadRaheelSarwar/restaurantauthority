# System Architecture Document
## Restaurant Electrical Authority (REA)
### Complete Electrical Safety, Readiness & Compliance Management Platform

---

## 1. Architectural Overview

Restaurant Electrical Authority (REA) is built as a cloud-native, enterprise-grade multi-tenant Software-as-a-Service (SaaS) platform. The architecture decouples client presentation, application business logic, and transactional persistence while enforcing strict tenant data isolation, role-based authorization, and real-time compliance tracking.

```
                      +---------------------------------------+
                      |       Public Web & Client SPA         |
                      |  React 18 + Vite + Tailwind + shadcn  |
                      +-------------------+-------------------+
                                          | HTTPS / REST
                                          v
                      +---------------------------------------+
                      |        Express.js Backend API         |
                      |   Authentication & RBAC Middleware    |
                      |   Zod Validation & Business Logic     |
                      |   PDF Generation & Nodemailer SMTP    |
                      +---------+-------------------+---------+
                                |                   |
           Service Role / Direct|                   | Storage / Auth SDK
                                v                   v
             +----------------------------+   +----------------------------+
             |    Supabase PostgreSQL     |   |      Supabase Services     |
             |  Row Level Security (RLS)  |   | - Supabase Auth (JWT)      |
             |  Triggers, Constraints     |   | - Supabase Storage         |
             |  Automated Audit Logging   |   | - Supabase Realtime WS     |
             +----------------------------+   +----------------------------+
```

---

## 2. Layered Component Architecture

### A. Presentation Layer (Frontend SPA)
- **Framework**: React 18, Vite build tool, React Router DOM v6.
- **Styling**: Tailwind CSS enterprise palette with professional deep green primary branding (`#0f392b` / `#1b4d3e`), muted gray backgrounds (`#f8fafc`), and clean high-contrast typography (Inter).
- **Component Primitives**: shadcn/ui design standards, Lucide React icons, accessible Radix-style headless dialogs, modals, tabs, and toast notifications.
- **State Management & Data Tables**: TanStack Table v8 for high-density multi-location equipment and assessment audits, custom context hooks (`AuthContext`, `ToastContext`, `NotificationContext`).
- **Data Visualization**: Recharts library visualizing readiness score distributions, incident severities, and corrective action lifecycle trends.

### B. Business & Application Layer (Express REST API)
- **Runtime**: Node.js v24 LTS + Express 4.x.
- **Security & Infrastructure**: Helmet security headers, CORS origin whitelisting, rate limiting per IP and user identity.
- **Data Integrity**: Zod schemas validating incoming request payloads prior to controller execution.
- **Background Orchestration**: Node-cron jobs executing scheduled tasks (annual review proactive alerts, overdue corrective action escalations, certification renewal alerts).
- **Document & Reporting Engine**: Native PDF generation with custom layout grids, inspection scorecards, and verifiable QR codes.

### C. Persistence & Auth Layer (Supabase PostgreSQL & Cloud)
- **Primary Database**: PostgreSQL 15+ hosted on Supabase.
- **Authentication**: Supabase Auth handling cryptographically signed JWT sessions.
- **Authorization**: Dual-layer defense:
  1. Express server-side middleware (`verifyAuth`, `requireRole`, `requireOrganizationAccess`).
  2. PostgreSQL Row-Level Security (RLS) policies enforcing multi-tenant perimeter checks at the SQL engine level.
- **Storage**: Supabase Storage buckets partitioned into `documents`, `evidence`, `photos`, and `certificates`.

---

## 3. Multi-Tenant Organization Isolation Model

1. **Root Tenant Anchor**: All restaurant brands belong to an `organization`.
2. **Entity Hierarchy**:
   ```
   Organization (e.g., Apex Hospitality Group)
       ├── Organization Members (Admins, Operators, Viewers)
       ├── Restaurant Brands (e.g., Apex Prime Steakhouse, Bistro Lumiere)
       │       └── Physical Locations (e.g., Downtown Flagship, Uptown Galleria)
       │               ├── Electrical Panels (MDP-1, Subpanel KP-A)
       │               ├── Commercial Equipment (Ovens, Refrigerators, Mixers)
       │               ├── Site Assessments & Responses
       │               ├── Incidents & Corrective Actions
       │               └── Annual Electrical Readiness Reviews
       └── Manager Certifications & Training Progress
   ```
3. **Cross-Tenant Prevention**: Users cannot read, write, or query entities outside their assigned `organization_id`, strictly rejected by both Express middleware and PostgreSQL RLS filters.

---

## 4. Disaster Recovery & Scalability

- **Database**: Point-in-time recovery (PITR) enabled on PostgreSQL with automated daily snapshots.
- **Stateless Backend**: Express instance maintains zero local state, allowing horizontal autoscaling on container platforms (Render, Railway, ECS, VPS).
- **Asset Storage**: S3-compatible Supabase Object Storage with multi-region replication.
