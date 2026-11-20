# Security Architecture & Compliance Guidelines
## Restaurant Electrical Authority (REA)

---

## 1. Security Principles & Defense-in-Depth

The REA platform enforces strict multi-layered security controls to protect operational integrity and sensitive restaurant infrastructure data.

```
+--------------------------------------------------------------------------+
|  Layer 1: Network & Perimeter Security (HTTPS, TLS 1.3, Rate Limiting)   |
+--------------------------------------------------------------------------+
|  Layer 2: HTTP Security Headers (Helmet, CSP, HSTS, CORS Whitelisting)  |
+--------------------------------------------------------------------------+
|  Layer 3: Authentication & Token Validation (Supabase Auth JWT)          |
+--------------------------------------------------------------------------+
|  Layer 4: Server-Side RBAC & Tenant Verification (Express Middleware)   |
+--------------------------------------------------------------------------+
|  Layer 5: Input Validation & Sanitization (Zod Payloads)                 |
+--------------------------------------------------------------------------+
|  Layer 6: Database Row Level Security (PostgreSQL RLS Policies)         |
+--------------------------------------------------------------------------+
|  Layer 7: Storage Perimeter (Private S3 Buckets, Short-Lived Signed URLs)|
+--------------------------------------------------------------------------+
|  Layer 8: Audit Logging & Tamper-Resistant Compliance History             |
+--------------------------------------------------------------------------+
```

---

## 2. Authentication & Authorization Enforcement

1. **Cryptographic Tokens**: User sessions are authenticated using Supabase Auth JWTs. Each incoming API request must provide a valid `Authorization: Bearer <token>` header.
2. **Never Trust the Client**: Role and tenant assignments are strictly verified against the database `profiles` and `organization_members` tables on every request. Frontend state cannot escalate permissions.
3. **Least Privilege Principle**:
   - `super_admin` has global administrative oversight.
   - `admin`, `operator`, `manager`, `viewer` are strictly scoped to their verified `organization_id`.
   - `electrical_assessor` can only interact with assessments explicitly assigned to their user ID or authorized for open inspection.
   - `certification_manager` is isolated to the qualification academy workflow.

---

## 3. Storage Security & File Upload Isolation

1. **Private Buckets**: The `documents`, `evidence`, and `photos` buckets are strictly private (`public = false`). Direct public URLs are rejected.
2. **Signed URLs**: When an authorized user requests to view or download a document or inspection photograph, the Express backend generates a short-lived cryptographic signed URL (valid for 15 minutes).
3. **MIME Type & Size Verification**: File uploads via Multer validate magic bytes, file extensions, and enforce strict size limits (max 10MB per document, 5MB per photograph).
4. **Credential Isolation**: The Supabase `SERVICE_ROLE_KEY` is exclusively retained on the Express backend server and never bundled or exposed in frontend JavaScript bundles.

---

## 4. Input Validation & Injection Prevention

1. **Zod Schema Validation**: Every API route validates input parameters, query strings, and request bodies against strict Zod definitions. Malformed or unexpected properties are immediately rejected with HTTP 400.
2. **SQL Injection Defense**: All database queries utilize parameterized queries via the Supabase client and PostgreSQL prepared statements. Raw string concatenation is prohibited.
3. **Cross-Site Scripting (XSS)**: React inherently sanitizes string interpolations in JSX. HTTP security headers prevent unauthorized script execution.

---

## 5. Audit Logging & Non-Repudiation

- Critical compliance actions are written to the immutable `audit_logs` table:
  - Assessment approval and rejection.
  - Corrective action closure and verification.
  - Digital certificate issuance and revocation.
  - User role assignment and permission changes.
- Audit records capture the responsible user ID, organization ID, module, action code, client IP, timestamp, and snapshot of affected record state.
