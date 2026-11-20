# REST API Documentation & OpenAPI Specification
## Restaurant Electrical Authority (REA)

---

## 1. Overview & Standard API Conventions

The REA backend adheres to RESTful API conventions over HTTPS. All requests and responses communicate via JSON payloads (`Content-Type: application/json`).

### Standard Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [ ... ]
  }
}
```

---

## 2. API Endpoints Map

### 2.1 Authentication & User Management (`/api/auth`, `/api/users`)
- `POST /api/auth/register` - Create account & organization profile.
- `POST /api/auth/login` - Authenticate user & return JWT token.
- `GET /api/auth/me` - Retrieve current session profile and permissions.
- `POST /api/auth/forgot-password` - Trigger password reset link.
- `POST /api/auth/reset-password` - Apply new password via verification token.
- `GET /api/users` - List users (filtered by role and organization).
- `POST /api/users/invite` - Send organization membership invitation.
- `PATCH /api/users/:id/status` - Activate, suspend, or deactivate user.

### 2.2 Organizations (`/api/organizations`)
- `GET /api/organizations` - List organizations (Super Admin: all; Org Admin: own).
- `GET /api/organizations/:id` - Get organization details & statistics.
- `POST /api/organizations` - Create new organization (Super Admin).
- `PUT /api/organizations/:id` - Update organization profile.
- `PATCH /api/organizations/:id/status` - Change status (`active`, `inactive`, `suspended`).

### 2.3 Restaurants & Locations (`/api/restaurants`, `/api/locations`)
- `GET /api/restaurants` - List restaurants in organization.
- `POST /api/restaurants` - Create restaurant brand.
- `GET /api/restaurants/:id` - Get restaurant details and associated locations.
- `PUT /api/restaurants/:id` - Update restaurant brand details.
- `GET /api/locations` - List locations with readiness metrics.
- `POST /api/locations` - Create physical location.
- `GET /api/locations/:id` - Detailed location dashboard & compliance summary.
- `PUT /api/locations/:id` - Update location attributes & assigned personnel.

### 2.4 Electrical Site Assessments (`/api/assessments`, `/api/assessment-templates`)
- `GET /api/assessment-templates` - List active inspection templates.
- `POST /api/assessment-templates` - Create or update inspection templates.
- `GET /api/assessments` - List site assessments (filter by location, status, date).
- `POST /api/assessments` - Schedule or initiate assessment.
- `GET /api/assessments/:id` - Get assessment with checklist sections and items.
- `POST /api/assessments/:id/responses` - Save line-item checklist responses.
- `POST /api/assessments/:id/submit` - Submit completed assessment for review.
- `POST /api/assessments/:id/approve` - Approve assessment & update location readiness.
- `GET /api/assessments/:id/pdf` - Generate and download official PDF report.

### 2.5 Equipment & Electrical Panels (`/api/equipment`, `/api/electrical-panels`)
- `GET /api/equipment` - List equipment inventory.
- `POST /api/equipment` - Register new appliance.
- `GET /api/equipment/:id` - Get equipment profile & maintenance records.
- `PUT /api/equipment/:id` - Update equipment details.
- `GET /api/electrical-panels` - List electrical distribution panels.
- `POST /api/electrical-panels` - Register new panel.
- `GET /api/electrical-panels/:id` - View panel specifications & inspection history.
- `PUT /api/electrical-panels/:id` - Update panel record.

### 2.6 Incidents & Corrective Actions (`/api/incidents`, `/api/corrective-actions`)
- `GET /api/incidents` - List electrical incidents.
- `POST /api/incidents` - Report electrical incident.
- `GET /api/incidents/:id` - Get incident details & timeline.
- `PUT /api/incidents/:id` - Update incident findings and status.
- `GET /api/corrective-actions` - List corrective actions.
- `POST /api/corrective-actions` - Create action from incident or assessment.
- `PATCH /api/corrective-actions/:id/status` - Transition status (`in_progress`, `submitted_for_verification`, `approved`, `closed`).

### 2.7 Annual Electrical Readiness Reviews (`/api/annual-reviews`)
- `GET /api/annual-reviews` - List annual reviews by year and location.
- `POST /api/annual-reviews` - Schedule new annual review.
- `GET /api/annual-reviews/:id` - View review checklist & recommendations.
- `PUT /api/annual-reviews/:id` - Submit evaluation & approval.
- `GET /api/annual-reviews/:id/pdf` - Download annual readiness certificate PDF.

### 2.8 Manager Certification Portal (`/api/certification`)
- `GET /api/certification/programs` - List available certification programs.
- `POST /api/certification/apply` - Submit certification application.
- `GET /api/certification/applications` - List applications (Manager: own; Cert Mgr: all).
- `PATCH /api/certification/applications/:id` - Approve or reject application.
- `GET /api/certification/courses` - Access training modules & materials.
- `POST /api/certification/courses/:moduleId/complete` - Mark module as completed.
- `GET /api/certification/exams/:id` - Fetch exam instructions and questions.
- `POST /api/certification/exams/:id/submit` - Submit answers for automatic evaluation.
- `GET /api/certification/certificates/:id` - Fetch digital certificate metadata.
- `GET /api/certification/verify/:code` - **Public Endpoint**: Verify credential via QR code or verification key.

### 2.9 Reporting, Documents & System (`/api/reports`, `/api/documents`, `/api/notifications`, `/api/audit-logs`, `/api/contact`)
- `GET /api/reports/analytics` - Multi-metric dashboard trends (readiness, incidents, actions).
- `GET /api/reports/export` - Export reports as CSV or PDF.
- `GET /api/documents` - Centralized document list with search and filter.
- `POST /api/documents/upload` - Secure file upload with metadata storage.
- `GET /api/notifications` - In-app notifications for authenticated user.
- `PATCH /api/notifications/:id/read` - Mark notification as read.
- `GET /api/audit-logs` - Immutable audit log stream.
- `POST /api/contact` - Public inquiry submission.
