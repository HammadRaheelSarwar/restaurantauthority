-- ==============================================================================
-- RESTAURANT ELECTRICAL AUTHORITY (REA) - ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 20260101000001_rls_policies.sql
-- Description: Strict Multi-tenant Organization Isolation & Role-Based Access
-- ==============================================================================

-- Enable RLS on all exposed tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE electrical_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_action_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- HELPER FUNCTIONS FOR RLS EVALUATION
-- ==============================================================================

-- Get authenticated user's role from profiles table
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get authenticated user's organization_id from profiles table
CREATE OR REPLACE FUNCTION auth_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT (auth_user_role() = 'super_admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- POLICIES: ORGANIZATIONS
-- ==============================================================================
CREATE POLICY "Super Admins have full access to organizations"
    ON organizations FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "Users can view their own organization"
    ON organizations FOR SELECT
    USING (id = auth_user_organization_id());

CREATE POLICY "Org Admins can update their own organization"
    ON organizations FOR UPDATE
    USING (id = auth_user_organization_id() AND auth_user_role() = 'admin')
    WITH CHECK (id = auth_user_organization_id() AND auth_user_role() = 'admin');

-- ==============================================================================
-- POLICIES: PROFILES
-- ==============================================================================
CREATE POLICY "Super Admins have full access to profiles"
    ON profiles FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "Users can view profiles in their organization"
    ON profiles FOR SELECT
    USING (organization_id = auth_user_organization_id() OR id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ==============================================================================
-- POLICIES: RESTAURANTS & LOCATIONS
-- ==============================================================================
CREATE POLICY "Super Admins manage all restaurants"
    ON restaurants FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "Org members view restaurants in their organization"
    ON restaurants FOR SELECT
    USING (organization_id = auth_user_organization_id());

CREATE POLICY "Org Admins & Operators manage restaurants in their organization"
    ON restaurants FOR ALL
    USING (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'restaurant_operator'))
    WITH CHECK (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'restaurant_operator'));

CREATE POLICY "Super Admins manage all locations"
    ON locations FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "Org members view locations in their organization"
    ON locations FOR SELECT
    USING (organization_id = auth_user_organization_id());

CREATE POLICY "Org Admins, Operators, and assigned Managers manage locations"
    ON locations FOR ALL
    USING (
        organization_id = auth_user_organization_id() AND (
            auth_user_role() IN ('admin', 'restaurant_operator') OR
            (auth_user_role() = 'restaurant_manager' AND manager_id = auth.uid())
        )
    )
    WITH CHECK (
        organization_id = auth_user_organization_id() AND (
            auth_user_role() IN ('admin', 'restaurant_operator') OR
            (auth_user_role() = 'restaurant_manager' AND manager_id = auth.uid())
        )
    );

-- ==============================================================================
-- POLICIES: ASSESSMENTS & TEMPLATES
-- ==============================================================================
CREATE POLICY "Super Admins manage all assessment templates"
    ON assessment_templates FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "Authenticated users view active assessment templates"
    ON assessment_templates FOR SELECT
    USING (is_active = TRUE OR is_super_admin() OR auth_user_role() IN ('admin', 'electrical_assessor'));

CREATE POLICY "Assessment sections viewable by authenticated users"
    ON assessment_sections FOR SELECT
    USING (TRUE);

CREATE POLICY "Assessment items viewable by authenticated users"
    ON assessment_items FOR SELECT
    USING (TRUE);

CREATE POLICY "Super Admins manage all assessments"
    ON assessments FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "Org members view assessments for their organization"
    ON assessments FOR SELECT
    USING (
        organization_id = auth_user_organization_id() OR
        (auth_user_role() = 'electrical_assessor' AND assessor_id = auth.uid())
    );

CREATE POLICY "Assessors and Admins create and edit assessments"
    ON assessments FOR INSERT
    WITH CHECK (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'electrical_assessor'))
    );

CREATE POLICY "Assessors update their assigned assessments"
    ON assessments FOR UPDATE
    USING (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND (
            auth_user_role() IN ('admin', 'restaurant_operator') OR
            (auth_user_role() = 'electrical_assessor' AND assessor_id = auth.uid())
        ))
    );

CREATE POLICY "Assessment responses viewable by org members"
    ON assessment_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM assessments a
            WHERE a.id = assessment_responses.assessment_id
            AND (a.organization_id = auth_user_organization_id() OR a.assessor_id = auth.uid() OR is_super_admin())
        )
    );

CREATE POLICY "Assessors and Admins manage assessment responses"
    ON assessment_responses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM assessments a
            WHERE a.id = assessment_responses.assessment_id
            AND (a.organization_id = auth_user_organization_id() OR a.assessor_id = auth.uid() OR is_super_admin())
        )
    );

-- ==============================================================================
-- POLICIES: EQUIPMENT & PANELS
-- ==============================================================================
CREATE POLICY "Org members view equipment"
    ON equipment FOR SELECT
    USING (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Admins, Operators, and Managers manage equipment"
    ON equipment FOR ALL
    USING (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'restaurant_operator', 'restaurant_manager'))
    );

CREATE POLICY "Org members view electrical panels"
    ON electrical_panels FOR SELECT
    USING (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Admins, Operators, and Managers manage electrical panels"
    ON electrical_panels FOR ALL
    USING (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'restaurant_operator', 'restaurant_manager'))
    );

-- ==============================================================================
-- POLICIES: INCIDENTS & CORRECTIVE ACTIONS
-- ==============================================================================
CREATE POLICY "Org members view incidents"
    ON incidents FOR SELECT
    USING (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Org members can report incidents"
    ON incidents FOR INSERT
    WITH CHECK (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Authorized roles update incidents"
    ON incidents FOR UPDATE
    USING (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'restaurant_operator', 'restaurant_manager'))
    );

CREATE POLICY "Org members view corrective actions"
    ON corrective_actions FOR SELECT
    USING (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Assignees and Admins update corrective actions"
    ON corrective_actions FOR ALL
    USING (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND (
            auth_user_role() IN ('admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor') OR
            assigned_to = auth.uid()
        ))
    );

-- ==============================================================================
-- POLICIES: ANNUAL REVIEWS
-- ==============================================================================
CREATE POLICY "Org members view annual reviews"
    ON annual_reviews FOR SELECT
    USING (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Admins and Assessors manage annual reviews"
    ON annual_reviews FOR ALL
    USING (
        is_super_admin() OR
        (organization_id = auth_user_organization_id() AND auth_user_role() IN ('admin', 'electrical_assessor', 'restaurant_operator'))
    );

-- ==============================================================================
-- POLICIES: CERTIFICATIONS, COURSES & EXAMS
-- ==============================================================================
CREATE POLICY "Everyone views active certification programs"
    ON certification_programs FOR SELECT
    USING (is_active = TRUE OR is_super_admin() OR auth_user_role() = 'certification_manager');

CREATE POLICY "Certification managers manage programs"
    ON certification_programs FOR ALL
    USING (is_super_admin() OR auth_user_role() = 'certification_manager');

CREATE POLICY "Users view own certification applications"
    ON certification_applications FOR SELECT
    USING (user_id = auth.uid() OR is_super_admin() OR auth_user_role() = 'certification_manager' OR organization_id = auth_user_organization_id());

CREATE POLICY "Managers submit own certification applications"
    ON certification_applications FOR INSERT
    WITH CHECK (user_id = auth.uid() OR is_super_admin());

CREATE POLICY "Certification Managers update applications"
    ON certification_applications FOR UPDATE
    USING (is_super_admin() OR auth_user_role() = 'certification_manager');

CREATE POLICY "Authenticated users view certification courses"
    ON certification_courses FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users view course modules"
    ON course_modules FOR SELECT
    USING (TRUE);

CREATE POLICY "Users manage own course progress"
    ON course_progress FOR ALL
    USING (user_id = auth.uid() OR is_super_admin() OR auth_user_role() = 'certification_manager');

CREATE POLICY "Authenticated users view active exams"
    ON exams FOR SELECT
    USING (is_active = TRUE OR is_super_admin() OR auth_user_role() = 'certification_manager');

CREATE POLICY "Users manage own exam attempts"
    ON exam_attempts FOR ALL
    USING (user_id = auth.uid() OR is_super_admin() OR auth_user_role() = 'certification_manager');

CREATE POLICY "Users insert answers for own attempts"
    ON exam_answers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM exam_attempts ea
            WHERE ea.id = exam_answers.attempt_id
            AND (ea.user_id = auth.uid() OR is_super_admin() OR auth_user_role() = 'certification_manager')
        )
    );

-- Public Certificate Verification: Anyone can read approved certificates
CREATE POLICY "Public certificate verification"
    ON certifications FOR SELECT
    USING (status = 'active' OR is_super_admin() OR organization_id = auth_user_organization_id() OR user_id = auth.uid());

CREATE POLICY "Certification Managers manage certificates"
    ON certifications FOR ALL
    USING (is_super_admin() OR auth_user_role() = 'certification_manager');

-- ==============================================================================
-- POLICIES: DOCUMENTS, NOTIFICATIONS, AUDIT & CONTACT
-- ==============================================================================
CREATE POLICY "Org members view documents"
    ON documents FOR SELECT
    USING (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Org members upload documents"
    ON documents FOR INSERT
    WITH CHECK (organization_id = auth_user_organization_id() OR is_super_admin());

CREATE POLICY "Users view own notifications"
    ON notifications FOR ALL
    USING (user_id = auth.uid() OR is_super_admin());

CREATE POLICY "Super Admins view all audit logs, Orgs view own"
    ON audit_logs FOR SELECT
    USING (is_super_admin() OR (organization_id = auth_user_organization_id() AND auth_user_role() = 'admin'));

CREATE POLICY "Public can submit contact messages"
    ON contact_messages FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Super Admins and Admins manage contact messages"
    ON contact_messages FOR ALL
    USING (is_super_admin() OR auth_user_role() = 'admin');

CREATE POLICY "Super Admins manage system settings"
    ON system_settings FOR ALL
    USING (is_super_admin());
