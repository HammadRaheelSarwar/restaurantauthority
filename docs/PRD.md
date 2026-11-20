# Product Requirements Document (PRD)
## Restaurant Electrical Authority (REA)
### Commercial Electrical Safety, Readiness & Compliance Platform

---

## 1. Executive Summary & Problem Statement

Commercial food service operations present one of the most hazardous, energy-dense electrical environments in modern commerce. High-amperage appliances (3-phase 208V/480V combi ovens, dishwashers, walk-in refrigeration units) operate alongside ambient moisture, steam, grease particulates, and high employee turnover. 

Currently, restaurant groups suffer from:
1. **Fragmented Records**: Electrical panel schedules, maintenance receipts, and inspector notes are lost across binders and local file systems.
2. **Untracked Hazards**: Breaker trips, warm disconnect switches, damaged cord insulation, and missing GFCI trip testing go unreported until catastrophic failure or fire occurs.
3. **Regulatory & Insurance Risk**: Lack of an immutable audit trail for annual readiness evaluations jeopardizes liability coverage and health/safety licensing.
4. **Untrained General Management**: Store-level managers lack practical knowledge regarding the 36-inch panel clearance rule, emergency shutdown protocols, and GFCI safety.

**Restaurant Electrical Authority (REA)** delivers an enterprise multi-tenant compliance SaaS that unifies physical site assessments, equipment and panel inventory tracking, incident reporting, annual readiness reviews, and certified manager credentialing into a single real-time platform.

---

## 2. Core User Personas

1. **Enterprise Compliance Director (Admin / Super Admin)**:
   - Needs aggregate oversight across dozens or hundreds of franchised/corporate locations.
   - Requires real-time visibility into high-severity hazards and overdue corrective actions.
2. **Multi-Unit Restaurant Operator**:
   - Manages multiple restaurant brands within a group.
   - Monitors operational equipment uptime, panel maintenance logs, and location readiness scores.
3. **Restaurant General Manager**:
   - Manages the daily operation of a specific physical restaurant.
   - Reports electrical anomalies/incidents, manages corrective action tasks, and takes CRESM certification courses and exams.
4. **Certified Electrical Assessor**:
   - Conducts physical on-site inspections using standardized digital checklists.
   - Captures photographic evidence, rates severity of non-compliance, and issues corrective action mandates.
5. **Certification Manager**:
   - Oversees the manager qualification pipeline.
   - Reviews applications, maintains course curriculum, administers exams, and issues cryptographically verifiable credentials.
6. **Regulatory / Insurance Auditor (Viewer)**:
   - Requires transparent, tamper-proof read-only access to historic inspection records, certifications, and compliance logs.

---

## 3. Product Scope & Functional Pillars

1. **Multi-Tenant Foundation**: Strict organization isolation ensuring complete confidentiality between competitive restaurant groups.
2. **Standardized Assessment Engine**: Configurable checklist templates with severity classifications (`low`, `medium`, `high`, `critical`) and evidence photo attachment.
3. **Asset & Infrastructure Registry**: Comprehensive logging of electrical panels (voltage, amperage, phase, breakers) and connected high-draw kitchen machinery.
4. **Closed-Loop Corrective Actions**: Every identified failure initiates a tracked corrective action with assigned responsibility, due date, photo proof, and formal sign-off.
5. **Annual Readiness Certification**: Structured yearly audits assessing overall operational viability and generating executive summary documentation.
6. **Manager Academy & Digital Credentialing**: Complete LMS subsystem with self-paced courses, timed proctored online examinations, and public QR-code verification.
7. **Audit & Governance**: Immutable audit trail of every status transition, inspection approval, and certificate generation.
