# Roles and Permissions Matrix
## Restaurant Electrical Authority (REA)

---

## 1. User Roles Definition

| Role Key | Role Name | Primary Responsibility |
|:---|:---|:---|
| `super_admin` | **Super Admin** | Platform-wide authority: manages all organizations, global templates, system settings, audit logs, and cross-tenant audits. |
| `admin` | **Organization Admin** | Head of corporate safety/compliance for an organization: manages company restaurants, locations, user accounts, and reviews. |
| `restaurant_operator` | **Restaurant Operator** | Multi-unit operations director: oversees operational readiness across all regional restaurant locations and equipment. |
| `restaurant_manager` | **Restaurant Manager** | Location general manager: monitors on-site kitchen safety, reports incidents, tracks corrective actions, and completes manager certification. |
| `electrical_assessor` | **Electrical Assessor** | Licensed electrical professional: conducts physical site assessments, logs checklist findings, submits photographic evidence, and initiates corrective actions. |
| `certification_manager` | **Certification Manager** | Academic and credentialing supervisor: approves manager applications, manages courses and exams, grades tests, and issues certificates. |
| `viewer` | **Viewer / Auditor** | Read-only compliance auditor: inspects documents, reports, and readiness scores without edit privileges. |

---

## 2. Granular Permissions Matrix

| Functional Module | Action / Capability | Super Admin | Org Admin | Operator | Manager | Assessor | Cert Mgr | Viewer |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Organizations** | Create / Delete Organizations | **Yes** | No | No | No | No | No | No |
| | Edit Organization Profile | **Yes** | **Yes** | No | No | No | No | No |
| | View Organization Profile | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| **User Management** | Invite & Assign Roles | **Yes** | **Yes** (Org) | No | No | No | No | No |
| | Deactivate Users | **Yes** | **Yes** (Org) | No | No | No | No | No |
| **Restaurants & Locations** | Create / Edit Restaurants | **Yes** | **Yes** | **Yes** | No | No | No | No |
| | Create / Edit Locations | **Yes** | **Yes** | **Yes** | No | No | No | No |
| | View Location Dashboard | **Yes** | **Yes** | **Yes** | **Yes** (Assigned) | **Yes** (Assigned) | No | **Yes** |
| **Site Assessments** | Create Assessment Templates | **Yes** | No | No | No | No | No | No |
| | Schedule & Assign Assessments | **Yes** | **Yes** | **Yes** | No | No | No | No |
| | Perform Inspection & Fill Checklist | **Yes** | No | No | No | **Yes** | No | No |
| | Approve / Reject Assessments | **Yes** | **Yes** | No | No | No | No | No |
| | Download PDF Inspection Report | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | **Yes** |
| **Equipment & Panels** | Register Electrical Panels | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | Read-only |
| | Register & Edit Equipment | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | Read-only |
| | Log Maintenance Record | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | Read-only |
| **Incidents & Actions** | Report Electrical Incident | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | No |
| | Investigate & Update Incident | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | Read-only |
| | Close Incident | **Yes** | **Yes** | **Yes** | No | No | No | No |
| | Assign Corrective Actions | **Yes** | **Yes** | **Yes** | No | **Yes** | No | No |
| | Update / Complete Corrective Action | **Yes** | **Yes** | **Yes** | **Yes** (Assigned) | **Yes** | No | No |
| | Verify & Close Corrective Action | **Yes** | **Yes** | **Yes** | No | **Yes** | No | No |
| **Annual Reviews** | Schedule Annual Review | **Yes** | **Yes** | **Yes** | No | No | No | No |
| | Perform & Submit Annual Review | **Yes** | **Yes** | No | No | **Yes** | No | No |
| | Approve Annual Review | **Yes** | **Yes** | No | No | No | No | No |
| **Manager Certification** | Apply for Certification | No | No | No | **Yes** | No | No | No |
| | Review & Approve Applications | **Yes** | No | No | No | No | **Yes** | No |
| | Manage Courses & Modules | **Yes** | No | No | No | No | **Yes** | No |
| | Manage Exams & Question Bank | **Yes** | No | No | No | No | **Yes** | No |
| | Take Examination | No | No | No | **Yes** | No | No | No |
| | Issue Digital Certificate | **Yes** | No | No | No | No | **Yes** | No |
| | Public Certificate Verification | **Public** | **Public** | **Public** | **Public** | **Public** | **Public** | **Public** |
| **Reports & Analytics** | Platform-wide Analytics | **Yes** | No | No | No | No | No | No |
| | Org Analytics & PDF/CSV Export | **Yes** | **Yes** | **Yes** | Read (Location) | No | No | Read |
| **System Settings & Audit** | View Audit Logs | **Yes** | **Yes** (Org) | No | No | No | No | No |
| | Configure System Settings | **Yes** | No | No | No | No | No | No |
