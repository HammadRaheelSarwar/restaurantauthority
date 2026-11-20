# Testing Strategy & Verification Plan
## Restaurant Electrical Authority (REA)

---

## 1. Multi-Tier Testing Methodology

The REA platform includes verification across four primary dimensions:
1. **Unit & Validation Tests**: Zod schema constraints, score calculation utilities, certificate verification checksums.
2. **Backend API Integration Tests**: Endpoint routing, authentication tokens, organization isolation, role-based authorization barriers.
3. **Database Security & RLS Tests**: Cross-tenant data isolation and role boundaries verified at the PostgreSQL level.
4. **End-to-End Business Workflow Tests**: Simulating full operational lifecycle scenarios from onboarding to certificate issuance.

---

## 2. End-to-End Compliance Workflows

### Workflow 1: Multi-Tenant Onboarding & Asset Registration
1. Super Admin creates Organization (`Apex Hospitality Group`).
2. Org Admin adds Restaurant Brand (`Apex Prime Steakhouse`) and Location (`Downtown Flagship`).
3. Manager registers Electrical Panels (`MDP-1`, `KP-A`) and commercial equipment (`Combi Oven`, `Walk-in Freezer`).
4. **Assertion**: Equipment and panels are isolated to `Apex Hospitality Group` and invisible to other organizations.

### Workflow 2: Site Assessment, Finding & Corrective Action Closure
1. Electrical Assessor visits location and opens scheduled assessment.
2. Assessor fills checklist: passes 6 items, flags 1 item as `needs_attention` (faulty disconnect seal) with severity `medium`.
3. System automatically calculates location readiness score (e.g. 94.5%) and generates Corrective Action (`CA-8812`).
4. Restaurant Manager uploads proof of replaced gasket and submits for verification.
5. Assessor/Admin verifies proof and transitions status to `closed`.

### Workflow 3: Manager Certification & Public QR Verification
1. Restaurant Manager applies for `CRESM` Certification.
2. Certification Manager approves application.
3. Manager navigates LMS modules 1 through 4 and marks them complete.
4. Manager starts timed 45-minute online exam, answers 5 randomized questions, and passes with >=80%.
5. System generates Digital Certificate (`CRESM-2026-88492`) with QR code.
6. Public verification endpoint `/api/certification/verify/:code` and public web page `/verify/:code` confirm authenticity.

---

## 3. Running Automated Tests

```bash
# Run backend test suite
cd backend
npm test

# Run frontend build verification
cd ../frontend
npm run build
```
