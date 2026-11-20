# Software Requirements Specification (SRS)
## Restaurant Electrical Authority (REA)

---

## 1. Functional Requirements

### 1.1 Authentication & Tenant Management
- **FR-AUTH-01**: System shall authenticate users via Supabase Auth with secure JWT tokens.
- **FR-AUTH-02**: System shall support 7 distinct roles: `super_admin`, `admin`, `restaurant_operator`, `restaurant_manager`, `electrical_assessor`, `certification_manager`, `viewer`.
- **FR-AUTH-03**: System shall enforce multi-tenant isolation such that non-super-admin queries filter strictly by `organization_id`.
- **FR-AUTH-04**: System shall support invitation-based onboarding with cryptographic tokens and expiration windows.

### 1.2 Restaurants & Location Governance
- **FR-LOC-01**: An organization shall own one or more restaurant concepts.
- **FR-LOC-02**: A restaurant concept shall operate one or more physical locations.
- **FR-LOC-03**: Each location shall maintain an aggregated `readiness_status` (`compliant`, `needs_attention`, `non_compliant`, `pending_review`) and `readiness_score` (0.00% to 100.00%).

### 1.3 Assessment & Inspection Management
- **FR-ASM-01**: Administrators shall configure assessment templates with nested sections and question items.
- **FR-ASM-02**: Assessors shall record item outcomes (`pass`, `fail`, `needs_attention`, `not_applicable`), notes, severity, and photo evidence.
- **FR-ASM-03**: Marking an item as `fail` or `needs_attention` with `requires_corrective_action = true` shall trigger an associated corrective action record.
- **FR-ASM-04**: Completed assessments shall compile into downloadable, digitally signed PDF inspection reports.

### 1.4 Electrical Panels & Equipment Registry
- **FR-EQP-01**: System shall maintain records of all electrical panels including manufacturer, amperage, voltage rating, phase, and location descriptions.
- **FR-EQP-02**: System shall record commercial kitchen equipment with serial numbers, warranty/service dates, and condition ratings.
- **FR-EQP-03**: Maintenance history shall track service dates, technician details, and costs.

### 1.5 Incidents & Corrective Action Tracking
- **FR-INC-01**: Any authenticated user can submit an electrical incident report specifying severity, affected equipment/panel, and immediate actions taken.
- **FR-INC-02**: Corrective actions shall follow a strict state progression: `open` -> `assigned` -> `in_progress` -> `submitted_for_verification` -> `approved` -> `closed`.

### 1.6 Manager Credentialing & Academy
- **FR-CRT-01**: Managers can submit certification applications with uploaded professional documentation.
- **FR-CRT-02**: Portal shall provide self-paced course modules with video content and technical references.
- **FR-CRT-03**: Examination engine shall enforce countdown timers, randomized questions, and automatic scoring against client-approved thresholds (default 80%).
- **FR-CRT-04**: Successful completion generates a unique certificate number, cryptographic verification code, QR code, and downloadable PDF.
- **FR-CRT-05**: Public verification portal shall allow instant credential validation without requiring login.

---

## 2. Non-Functional Requirements

### 2.1 Security & Compliance
- **NFR-SEC-01**: All data transmissions must occur over TLS 1.3.
- **NFR-SEC-02**: Sensitive file assets must reside in private Supabase Storage buckets accessible solely via time-limited signed URLs.
- **NFR-SEC-03**: All exposed API routes must enforce rate limiting, CORS restrictions, and Zod schema validation.
- **NFR-SEC-04**: Database must enforce Row Level Security (RLS) on all exposed tables.

### 2.2 Performance & Reliability
- **NFR-PERF-01**: Standard API response times shall be less than 200ms for p95 requests.
- **NFR-PERF-02**: Dashboard metrics and tables must support pagination (default 10-25 records per page).
- **NFR-PERF-03**: Database indexing must be present on all foreign keys and frequently queried status columns.

### 2.3 Usability & Design
- **NFR-UI-01**: UI shall follow the enterprise compliance design standard (Deep Green `#0f392b`, Slate Charcoal `#1e293b`, Clean Backgrounds `#f8fafc`).
- **NFR-UI-02**: All dashboard screens must be fully responsive across desktop, tablet, and mobile browsers.
