-- ==============================================================================
-- RESTAURANT ELECTRICAL AUTHORITY (REA) - DATABASE SCHEMA MIGRATION
-- Migration: 20260101000000_create_schema.sql
-- Description: Core Schema with UUID PKs, FKs, Indexes, Triggers, & Constraints
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper Trigger Function: Set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. AUTHENTICATION & MULTI-TENANT ORGANIZATIONS
-- ==============================================================================

-- Organizations Table (Multi-tenancy root)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    business_registration_no VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20),
    logo_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Extends Supabase auth.users or standalone auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',
        'admin',
        'restaurant_operator',
        'restaurant_manager',
        'electrical_assessor',
        'certification_manager',
        'viewer'
    )),
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Memberships (Many-to-Many / Role binding within Organization)
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',
        'admin',
        'restaurant_operator',
        'restaurant_manager',
        'electrical_assessor',
        'certification_manager',
        'viewer'
    )),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- User Invitations
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. RESTAURANTS & LOCATIONS
-- ==============================================================================

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    restaurant_type VARCHAR(100) DEFAULT 'Full Service',
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20),
    assigned_operator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations Table (Individual restaurant branches/facilities)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location_code VARCHAR(50),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20),
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assessor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    readiness_status VARCHAR(50) DEFAULT 'pending_review' CHECK (readiness_status IN ('compliant', 'needs_attention', 'non_compliant', 'pending_review')),
    readiness_score NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. ELECTRICAL SITE ASSESSMENTS & TEMPLATES
-- ==============================================================================

-- Assessment Templates
CREATE TABLE IF NOT EXISTS assessment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Sections
CREATE TABLE IF NOT EXISTS assessment_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Items / Checklist Questions
CREATE TABLE IF NOT EXISTS assessment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES assessment_sections(id) ON DELETE CASCADE,
    code VARCHAR(50),
    question TEXT NOT NULL,
    instructions TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    evidence_required BOOLEAN DEFAULT FALSE,
    severity_if_failed VARCHAR(50) DEFAULT 'medium' CHECK (severity_if_failed IN ('low', 'medium', 'high', 'critical')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Records
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    template_id UUID REFERENCES assessment_templates(id) ON DELETE SET NULL,
    assessor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(50) DEFAULT 'routine' CHECK (assessment_type IN ('initial', 'routine', 'annual_compliance', 'incident_followup')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'assigned', 'in_progress', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled')),
    scheduled_date DATE,
    completed_date DATE,
    score NUMERIC(5,2) DEFAULT 0.00,
    notes TEXT,
    summary TEXT,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Item Responses
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pass', 'fail', 'needs_attention', 'not_applicable')),
    comments TEXT,
    observations TEXT,
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    requires_corrective_action BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id, item_id)
);

-- Assessment Evidence (Photos, documents, inspection proofs)
CREATE TABLE IF NOT EXISTS assessment_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    response_id UUID REFERENCES assessment_responses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    description TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. EQUIPMENT & ELECTRICAL PANELS
-- ==============================================================================

-- Equipment Categories
CREATE TABLE IF NOT EXISTS equipment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Inventory
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES equipment_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(150),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    installation_date DATE,
    condition VARCHAR(50) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'critical')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'under_maintenance', 'decommissioned')),
    inspection_frequency_days INTEGER DEFAULT 180,
    last_inspection_date DATE,
    next_inspection_date DATE,
    maintenance_notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Electrical Panels
CREATE TABLE IF NOT EXISTS electrical_panels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    panel_name VARCHAR(150) NOT NULL,
    panel_identifier VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(150),
    model VARCHAR(100),
    location_description TEXT,
    voltage_rating VARCHAR(50) DEFAULT '120/208V 3-Phase',
    amperage_rating VARCHAR(50) DEFAULT '400A',
    phase_type VARCHAR(50) DEFAULT 'Three Phase',
    specifications JSONB DEFAULT '{}'::jsonb,
    installation_date DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    photo_url TEXT,
    status VARCHAR(50) DEFAULT 'operational' CHECK (status IN ('operational', 'requires_service', 'critical_hazard')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Records
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    panel_id UUID REFERENCES electrical_panels(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    maintenance_date DATE NOT NULL,
    cost NUMERIC(10,2) DEFAULT 0.00,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. ELECTRICAL INCIDENTS & CORRECTIVE ACTIONS
-- ==============================================================================

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
    panel_id UUID REFERENCES electrical_panels(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_investigator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    incident_date DATE NOT NULL,
    incident_time TIME,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'equipment_malfunction',
        'panel_issue',
        'wiring_incident',
        'power_failure',
        'electrical_overheating',
        'shock_injury',
        'other'
    )),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    immediate_actions TEXT,
    findings TEXT,
    investigation_notes TEXT,
    status VARCHAR(50) DEFAULT 'reported' CHECK (status IN (
        'reported',
        'under_review',
        'under_investigation',
        'action_required',
        'resolution_submitted',
        'resolved',
        'closed'
    )),
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incident Comments / Timeline
CREATE TABLE IF NOT EXISTS incident_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Corrective Actions
CREATE TABLE IF NOT EXISTS corrective_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
    response_id UUID REFERENCES assessment_responses(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN (
        'open',
        'assigned',
        'in_progress',
        'submitted_for_verification',
        'approved',
        'rejected',
        'closed'
    )),
    due_date DATE NOT NULL,
    instructions TEXT,
    resolution_notes TEXT,
    evidence_url TEXT,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Corrective Action Progress Updates
CREATE TABLE IF NOT EXISTS corrective_action_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corrective_action_id UUID NOT NULL REFERENCES corrective_actions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    update_type VARCHAR(100) DEFAULT 'comment',
    notes TEXT NOT NULL,
    evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. ANNUAL ELECTRICAL READINESS REVIEWS
-- ==============================================================================

-- Annual Reviews
CREATE TABLE IF NOT EXISTS annual_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    review_year INTEGER NOT NULL,
    review_date DATE,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN (
        'upcoming',
        'due_soon',
        'in_progress',
        'submitted',
        'under_review',
        'approved',
        'requires_followup',
        'overdue'
    )),
    readiness_score NUMERIC(5,2) DEFAULT 0.00,
    summary TEXT,
    recommendations TEXT,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, review_year)
);

-- Annual Review Checklist Items
CREATE TABLE IF NOT EXISTS review_checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annual_review_id UUID NOT NULL REFERENCES annual_reviews(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'needs_review' CHECK (status IN ('compliant', 'non_compliant', 'needs_review', 'not_applicable')),
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. MANAGER CERTIFICATION PORTAL (TRAINING, EXAMS & CREDENTIALS)
-- ==============================================================================

-- Certification Programs
CREATE TABLE IF NOT EXISTS certification_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    eligibility_requirements TEXT,
    duration_hours INTEGER DEFAULT 16,
    validity_months INTEGER DEFAULT 24,
    passing_score NUMERIC(5,2) DEFAULT 80.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certification Applications
CREATE TABLE IF NOT EXISTS certification_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN (
        'applied',
        'pending_review',
        'approved',
        'rejected',
        'training_in_progress',
        'examination_pending',
        'passed',
        'failed',
        'issued',
        'expired',
        'suspended',
        'revoked'
    )),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    document_urls JSONB DEFAULT '[]'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certification Training Courses
CREATE TABLE IF NOT EXISTS certification_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Modules
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES certification_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    resource_urls JSONB DEFAULT '[]'::jsonb,
    duration_minutes INTEGER DEFAULT 45,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Progress Tracking
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES certification_applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(application_id, module_id)
);

-- Online Exams
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 60,
    passing_percentage NUMERIC(5,2) DEFAULT 80.00,
    max_attempts INTEGER DEFAULT 3,
    randomize_questions BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Question Bank
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_type VARCHAR(50) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'multi_select')),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- e.g. [{"id": "A", "text": "Option A"}, ...]
    correct_answers JSONB NOT NULL, -- e.g. ["A"]
    explanation TEXT,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Attempts
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES certification_applications(id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    submit_time TIMESTAMPTZ,
    score NUMERIC(5,2) DEFAULT 0.00,
    percentage NUMERIC(5,2) DEFAULT 0.00,
    passed BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'timed_out', 'evaluated')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Answers
CREATE TABLE IF NOT EXISTS exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
    user_answer JSONB NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issued Digital Certificates
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    application_id UUID REFERENCES certification_applications(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES certification_programs(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
    verification_code VARCHAR(100) UNIQUE NOT NULL,
    qr_code_url TEXT,
    pdf_url TEXT,
    issued_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. SYSTEM, DOCUMENTS, NOTIFICATIONS, AUDIT & CONTACT
-- ==============================================================================

-- Centralized Document Repository
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'assessment',
        'equipment',
        'panel',
        'incident',
        'annual_review',
        'certification',
        'course',
        'general'
    )),
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    version INTEGER DEFAULT 1,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system' CHECK (type IN (
        'assessment',
        'incident',
        'corrective_action',
        'annual_review',
        'certification',
        'system'
    )),
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs (Immutable compliance trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    record_id UUID,
    previous_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Contact Inquiries
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE MULTI-TENANT QUERIES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_restaurants_org_id ON restaurants(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_org_restaurant ON locations(organization_id, restaurant_id);
CREATE INDEX IF NOT EXISTS idx_locations_manager ON locations(manager_id);
CREATE INDEX IF NOT EXISTS idx_assessments_location ON assessments(location_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location_id);
CREATE INDEX IF NOT EXISTS idx_panels_location ON electrical_panels(location_id);
CREATE INDEX IF NOT EXISTS idx_incidents_org_location ON incidents(organization_id, location_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_location ON corrective_actions(location_id);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_status ON corrective_actions(status);
CREATE INDEX IF NOT EXISTS idx_annual_reviews_location_year ON annual_reviews(location_id, review_year);
CREATE INDEX IF NOT EXISTS idx_cert_apps_user ON certification_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_cert_apps_status ON certification_applications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_number ON certifications(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certifications_verification ON certifications(verification_code);
CREATE INDEX IF NOT EXISTS idx_documents_org ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_module ON audit_logs(user_id, module);

-- ==============================================================================
-- UPDATED_AT TRIGGERS
-- ==============================================================================

CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_assessment_templates_updated_at BEFORE UPDATE ON assessment_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_assessment_responses_updated_at BEFORE UPDATE ON assessment_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_electrical_panels_updated_at BEFORE UPDATE ON electrical_panels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_corrective_actions_updated_at BEFORE UPDATE ON corrective_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_annual_reviews_updated_at BEFORE UPDATE ON annual_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_certification_programs_updated_at BEFORE UPDATE ON certification_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_certification_applications_updated_at BEFORE UPDATE ON certification_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
