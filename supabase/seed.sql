-- ==============================================================================
-- RESTAURANT ELECTRICAL AUTHORITY (REA) - COMPREHENSIVE SEED DATA
-- File: supabase/seed.sql
-- Description: Realistic Organizations, 7 Users, Equipment, Panels, Templates,
--              Assessments, Incidents, Actions, Reviews, Courses, Exams & Certifications
-- ==============================================================================

-- 1. ORGANIZATIONS
INSERT INTO organizations (id, name, business_registration_no, email, phone, address, city, state, country, postal_code, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Apex Hospitality Group', 'US-DEL-984721', 'compliance@apexhospitality.com', '+1 (555) 234-5678', '450 Lexington Ave, Suite 1200', 'New York', 'NY', 'USA', '10017', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Oceanic Culinary Brands', 'US-CA-551982', 'safety@oceanicdining.com', '+1 (555) 876-5432', '1200 Ocean Promenade', 'Santa Monica', 'CA', 'USA', '90401', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. USER PROFILES (7 Core Roles)
INSERT INTO profiles (id, organization_id, full_name, email, phone, role, status)
VALUES
    -- 1. Super Admin (Global Authority)
    ('a0000000-0000-0000-0000-000000000001', NULL, 'Sarah Jenkins', 'superadmin@rea-compliance.com', '+1 (555) 001-1001', 'super_admin', 'active'),
    -- 2. Admin (Org Administrator at Apex)
    ('a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Michael Chang', 'admin@apexhospitality.com', '+1 (555) 001-1002', 'admin', 'active'),
    -- 3. Restaurant Operator (Multi-unit oversight)
    ('a0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Robert Vance', 'operator@apexhospitality.com', '+1 (555) 001-1003', 'restaurant_operator', 'active'),
    -- 4. Restaurant Manager (Site-level manager at Flagship)
    ('a0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Elena Rostova', 'manager@apex-downtown.com', '+1 (555) 001-1004', 'restaurant_manager', 'active'),
    -- 5. Electrical Assessor (Certified Inspector)
    ('a0000000-0000-0000-0000-000000000005', NULL, 'David Martinez, PE', 'assessor@rea-compliance.com', '+1 (555) 001-1005', 'electrical_assessor', 'active'),
    -- 6. Certification Manager (Academy Director)
    ('a0000000-0000-0000-0000-000000000006', NULL, 'Rachel Green', 'certification@rea-compliance.com', '+1 (555) 001-1006', 'certification_manager', 'active'),
    -- 7. Viewer (Auditor / Executive)
    ('a0000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Thomas Hall', 'viewer@apexhospitality.com', '+1 (555) 001-1007', 'viewer', 'active')
ON CONFLICT (id) DO NOTHING;

-- Organization Memberships
INSERT INTO organization_members (organization_id, user_id, role, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 'admin', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000003', 'restaurant_operator', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000004', 'restaurant_manager', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000007', 'viewer', 'active')
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- 3. RESTAURANTS
INSERT INTO restaurants (id, organization_id, name, business_name, restaurant_type, email, phone, address, city, state, country, postal_code, assigned_operator_id, status)
VALUES
    ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Apex Prime Steakhouse', 'Apex Steakhouse Holdings LLC', 'Fine Dining', 'prime@apexhospitality.com', '+1 (555) 301-4400', '100 Broadway', 'New York', 'NY', 'USA', '10005', 'a0000000-0000-0000-0000-000000000003', 'active'),
    ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Bistro Lumiere', 'Lumiere French Bistro LLC', 'Casual Dining', 'lumiere@apexhospitality.com', '+1 (555) 302-5500', '52 Spring Street', 'New York', 'NY', 'USA', '10012', 'a0000000-0000-0000-0000-000000000003', 'active'),
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Pacific Pearl Oyster Bar', 'Pearl Seafood Group Inc', 'Seafood Bar', 'pearl@oceanicdining.com', '+1 (555) 401-7700', '300 Pier Ave', 'Santa Monica', 'CA', 'USA', '90405', NULL, 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. LOCATIONS
INSERT INTO locations (id, organization_id, restaurant_id, name, location_code, address, city, state, country, postal_code, manager_id, assessor_id, readiness_status, readiness_score, status)
VALUES
    ('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'Downtown Flagship', 'APX-NY-01', '100 Broadway, Ground & Mezzanine', 'New York', 'NY', 'USA', '10005', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 'compliant', 94.50, 'active'),
    ('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'Midtown Galleria', 'APX-NY-02', '600 5th Avenue', 'New York', 'NY', 'USA', '10020', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 'needs_attention', 78.00, 'active'),
    ('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'SoHo Branch', 'BL-NY-01', '52 Spring Street', 'New York', 'NY', 'USA', '10012', NULL, 'a0000000-0000-0000-0000-000000000005', 'pending_review', 65.00, 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. EQUIPMENT CATEGORIES
INSERT INTO equipment_categories (id, name, description)
VALUES
    ('55555555-5555-5555-5555-555555555501', 'Heavy Cooking Equipment', 'Commercial electric ranges, combi ovens, induction cooktops, and deep fryers'),
    ('55555555-5555-5555-5555-555555555502', 'Refrigeration & Cooling', 'Walk-in freezers, reach-in coolers, ice makers, and blast chillers'),
    ('55555555-5555-5555-5555-555555555503', 'Food Prep & Processing', 'Planetary mixers, meat slicers, food processors, and immersion blenders'),
    ('55555555-5555-5555-5555-555555555504', 'Dishwashing & Sanitation', 'Conveyor dish machines, booster water heaters, and garbage disposals'),
    ('55555555-5555-5555-5555-555555555505', 'HVAC & Ventilation', 'Kitchen exhaust hood motors, make-up air fans, and variable speed drives')
ON CONFLICT (id) DO NOTHING;

-- 6. ELECTRICAL PANELS
INSERT INTO electrical_panels (id, organization_id, location_id, panel_name, panel_identifier, manufacturer, model, location_description, voltage_rating, amperage_rating, phase_type, specifications, installation_date, last_inspection_date, next_inspection_date, status)
VALUES
    ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'Main Distribution Panel', 'MDP-1', 'Square D / Schneider Electric', 'NQ442L225', 'Basement Electrical Room, East Wall', '120/208V 3-Phase', '400A', 'Three Phase', '{"bus_rating": "400A", "aic_rating": "22kA", "enclosure_type": "NEMA 1"}'::jsonb, '2023-04-15', '2026-01-10', '2026-07-10', 'operational'),
    ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'Kitchen Cookline Subpanel', 'KP-A', 'Eaton Cutler-Hammer', 'Pow-R-Line 1a', 'Main Kitchen, adjacent to chef pass', '120/208V 3-Phase', '225A', 'Three Phase', '{"bus_rating": "225A", "aic_rating": "10kA", "enclosure_type": "NEMA 1"}'::jsonb, '2023-04-20', '2026-01-10', '2026-07-10', 'operational'),
    ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'Refrigeration Subpanel', 'REF-1', 'Siemens', 'P1C42MC250', 'Dry Storage Room #2', '208V 3-Phase', '150A', 'Three Phase', '{"bus_rating": "150A", "aic_rating": "14kA", "enclosure_type": "NEMA 3R"}'::jsonb, '2023-05-01', '2025-11-15', '2026-05-15', 'requires_service')
ON CONFLICT (id) DO NOTHING;

-- 7. EQUIPMENT
INSERT INTO equipment (id, organization_id, location_id, category_id, name, manufacturer, model_number, serial_number, installation_date, condition, status, inspection_frequency_days, last_inspection_date, next_inspection_date, maintenance_notes)
VALUES
    ('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555501', 'Rational iCombi Pro 10-Full Size', 'Rational USA', 'LM100CE.XX', 'E11MH23049102', '2023-06-10', 'excellent', 'active', 90, '2026-01-15', '2026-04-15', 'Hardwired 208V 3-phase 37.4kW. Routine descaling and circuit check clean.'),
    ('77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555502', 'Master-Bilt Walk-in Freezer Compressor', 'Master-Bilt', 'MRS030M44C', 'MB-FZ-99214', '2023-05-18', 'fair', 'active', 180, '2025-11-15', '2026-05-15', 'Disconnect handle loose; weather seal degrading. Requires preventive service.'),
    ('77777777-7777-7777-7777-777777777703', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555503', 'Hobart Legacy 60-Qt Commercial Mixer', 'Hobart Corp', 'HL600-1STD', 'HB-60-2023812', '2023-05-22', 'good', 'active', 180, '2026-01-10', '2026-07-10', 'Interlock safety bowl guard verified operational.')
ON CONFLICT (id) DO NOTHING;

-- 8. ASSESSMENT TEMPLATES, SECTIONS & ITEMS
INSERT INTO assessment_templates (id, title, description, category, version, is_active, created_by)
VALUES
    ('88888888-8888-8888-8888-888888888801', 'REA Restaurant Electrical Readiness & Safety Standard', 'Comprehensive commercial kitchen electrical inspection checklist covering panels, cooking lines, wet areas, and emergency systems.', 'Commercial Food Service Safety', '2026.1', true, 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assessment_sections (id, template_id, title, description, order_index)
VALUES
    ('88888888-8888-8888-8888-888888888810', '88888888-8888-8888-8888-888888888801', 'Electrical Panels & Disconnects', 'Clearances, labelling, breaker physical condition, deadfront integrity, and ground continuity', 1),
    ('88888888-8888-8888-8888-888888888820', '88888888-8888-8888-8888-888888888801', 'Cooking Equipment & Heavy Appliance Wiring', 'Cords, strain reliefs, plugs, interlocks, flexible conduits, and thermal insulation near heat sources', 2),
    ('88888888-8888-8888-8888-888888888830', '88888888-8888-8888-8888-888888888801', 'Wet & Damp Location Protection (GFCI)', 'Sink proximity, washdown areas, dishwasher stations, in-use waterproof covers, and GFCI trip testing', 3),
    ('88888888-8888-8888-8888-888888888840', '88888888-8888-8888-8888-888888888801', 'Emergency Lighting & Egress Signage', 'Exit illumination, emergency 90-minute battery backup functionality, push-to-test verification', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO assessment_items (id, section_id, code, question, instructions, is_required, evidence_required, severity_if_failed, order_index)
VALUES
    ('88888888-8888-8888-8888-888888888811', '88888888-8888-8888-8888-888888888810', 'EP-01', 'Are all electrical panels unobstructed with at least 36-inch (3-foot) clear working space?', 'Verify no boxes, prep tables, grease containers, or carts are blocking access to panel door.', true, true, 'high', 1),
    ('88888888-8888-8888-8888-888888888812', '88888888-8888-8888-8888-888888888810', 'EP-02', 'Is the panel directory legibly updated with accurate breaker-to-load identification?', 'Inspect schedule on inside door. Check for pencil markings, missing circuit names, or generic labels.', true, false, 'medium', 2),
    ('88888888-8888-8888-8888-888888888813', '88888888-8888-8888-8888-888888888810', 'EP-03', 'Are all open breaker knockouts / empty slots properly sealed with approved filler plates?', 'Check deadfront for missing twist-outs exposing energized live bus bars.', true, true, 'critical', 3),
    ('88888888-8888-8888-8888-888888888821', '88888888-8888-8888-8888-888888888820', 'EQ-01', 'Are appliance power cords free of frays, cuts, heat damage, or exposed inner insulation?', 'Inspect cords behind fryers, ovens, and warmers. Check for oil buildup softening insulation.', true, true, 'high', 1),
    ('88888888-8888-8888-8888-888888888822', '88888888-8888-8888-8888-888888888820', 'EQ-02', 'Are heavy equipment flexible liquid-tight conduits securely anchored without detachment?', 'Verify conduit fittings have not pulled free from appliance junction boxes or disconnect switches.', true, false, 'medium', 2),
    ('88888888-8888-8888-8888-888888888831', '88888888-8888-8888-8888-888888888830', 'GF-01', 'Are all receptacles within 6 feet of sinks, dish areas, and beverage stations GFCI protected?', 'Test with certified plug-in GFCI circuit tester to verify ground fault interruption occurs.', true, true, 'critical', 1),
    ('88888888-8888-8888-8888-888888888832', '88888888-8888-8888-8888-888888888830', 'GF-02', 'Do wet location outdoor / washdown receptacles possess weatherproof while-in-use covers?', 'Inspect cover gaskets and spring-loaded hinges for watertight sealing.', true, false, 'medium', 2),
    ('88888888-8888-8888-8888-888888888841', '88888888-8888-8888-8888-888888888840', 'EM-01', 'Do all exit signs and emergency battery backup lights illuminate upon test switch depression?', 'Depress test switch for 30 seconds to verify uninterrupted illumination and battery charge.', true, false, 'high', 1)
ON CONFLICT (id) DO NOTHING;

-- 9. ASSESSMENTS & RESPONSES
INSERT INTO assessments (id, organization_id, restaurant_id, location_id, template_id, assessor_id, title, assessment_type, status, scheduled_date, completed_date, score, notes, summary, approved_by, approved_at)
VALUES
    ('99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', '88888888-8888-8888-8888-888888888801', 'a0000000-0000-0000-0000-000000000005', 'Q1 2026 Annual Electrical Readiness Audit - Flagship', 'annual_compliance', 'approved', '2026-01-10', '2026-01-10', 94.50, 'Thorough walk-through completed. High standard maintained overall; minor note on walk-in freezer disconnect.', 'Facility displays exemplary electrical management. All panels labeled and clear.', 'a0000000-0000-0000-0000-000000000001', '2026-01-12 14:30:00Z'),
    ('99999999-9999-9999-9999-999999999902', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', '88888888-8888-8888-8888-888888888801', 'a0000000-0000-0000-0000-000000000005', 'Routine Readiness Inspection - Midtown Galleria', 'routine', 'in_progress', '2026-02-14', NULL, 78.00, 'Inspection in progress. Awaiting corrective action confirmation on panel clearances.', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Responses for Assessment 1
INSERT INTO assessment_responses (assessment_id, item_id, status, comments, observations, severity, requires_corrective_action)
VALUES
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888811', 'pass', 'Full 40-inch clearance observed in front of MDP-1 and KP-A.', 'Floor painted yellow safety boundary line.', 'low', false),
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888812', 'pass', 'Typewritten panel schedules updated November 2025.', 'Accurate labels matching load breaker numbers.', 'low', false),
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888813', 'pass', 'All spare breaker spaces fitted with Schneider twistout blanking plates.', 'No exposed live conductors.', 'low', false),
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888821', 'pass', 'All cookline cables in SOOW heavy oil-resistant jackets.', 'No pinching or thermal damage.', 'low', false),
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888831', 'pass', 'Every outlet along cookline and dish pit verified 5mA GFCI trip.', 'Trip time tested under 25ms.', 'low', false),
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888832', 'needs_attention', 'Walk-in freezer disconnect handle weather seal has minor cracking.', 'Gasket requires replacement before condensation ingress occurs.', 'medium', true),
    ('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888841', 'pass', 'All 8 dual-head emergency fixtures illuminated on test.', 'Full illumination verified.', 'low', false)
ON CONFLICT (assessment_id, item_id) DO NOTHING;

-- 10. INCIDENTS & CORRECTIVE ACTIONS
INSERT INTO incidents (id, organization_id, restaurant_id, location_id, equipment_id, panel_id, reported_by, assigned_investigator_id, incident_date, incident_time, category, severity, title, description, immediate_actions, findings, status)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', '77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666602', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', '2026-02-01', '19:45:00', 'equipment_malfunction', 'medium', 'Oven Breaker Tripped During Friday Dinner Rush', 'The 60A 3-pole circuit breaker serving Combi Oven #1 tripped during high heat preheat cycle.', 'Unit de-energized, food transferred to backup deck oven. Circuit breaker locked out until inspection.', 'Loose screw torque on phase B terminal of breaker caused localized overheating. Terminal retorqued to 50 in-lbs.', 'resolved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO corrective_actions (id, organization_id, location_id, assessment_id, incident_id, title, description, assigned_to, priority, status, due_date, instructions, created_by)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '99999999-9999-9999-9999-999999999901', NULL, 'Replace Weatherproof Seal on Walk-in Freezer Disconnect Switch', 'Replace degraded rubber seal on NEMA 3R disconnect switch serving roof condenser to prevent moisture entry.', 'a0000000-0000-0000-0000-000000000004', 'medium', 'in_progress', '2026-03-01', 'Order OEM gasket kit or replace disconnect enclosure with Hubbell NEMA 4X equivalent.', 'a0000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO NOTHING;

-- 11. ANNUAL REVIEWS
INSERT INTO annual_reviews (id, organization_id, restaurant_id, location_id, reviewer_id, review_year, review_date, due_date, status, readiness_score, summary, recommendations, approved_by, approved_at)
VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'a0000000-0000-0000-0000-000000000005', 2026, '2026-01-15', '2026-01-31', 'approved', 95.00, 'Comprehensive annual readiness confirmed. All 3 electrical panels certified, manager holds current CRESM credential, and zero open critical safety items.', 'Maintain 6-month thermal infrared scan on Main Distribution Panel MDP-1.', 'a0000000-0000-0000-0000-000000000001', '2026-01-20 10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 12. CERTIFICATION PROGRAM, COURSES, EXAMS & CERTIFICATES
INSERT INTO certification_programs (id, title, code, description, eligibility_requirements, duration_hours, validity_months, passing_score, is_active)
VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Certified Restaurant Electrical Safety Manager (CRESM)', 'CRESM-L1', 'Official qualification program for restaurant general managers, executive chefs, and operations supervisors on commercial food service electrical safety, preventive maintenance, and regulatory readiness.', 'Minimum 1 year restaurant operational management experience or hospitality supervisory credential.', 16, 24, 80.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO certification_courses (id, program_id, title, description, order_index)
VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddd10', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Module 1: Principles of Kitchen Electrical Safety & Hazard Recognition', 'Understanding voltage tiers, amperage loads, common causes of commercial kitchen electrical fires, and shock prevention.', 1),
    ('dddddddd-dddd-dddd-dddd-dddddddddd20', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Module 2: Electrical Panel Clearances, Breakers & Safe Disconnects', 'National Electrical Code (NEC) 36-inch clearance requirements, deadfront integrity, and safe circuit breaker operation.', 2),
    ('dddddddd-dddd-dddd-dddd-dddddddddd30', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Module 3: Wet Location Protection, GFCI Standards & Water Proximity', 'GFCI operation, testing frequencies, splash zone standards, and outdoor weatherproof receptacle enclosures.', 3),
    ('dddddddd-dddd-dddd-dddd-dddddddddd40', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Module 4: Incident Response, Lockout/Tagout (LOTO) & Readiness Auditing', 'Safe emergency power shut-off procedures, LOTO execution for managers, and conducting internal monthly electrical walkthroughs.', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO course_modules (id, course_id, title, content, duration_minutes, order_index)
VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddd11', 'dddddddd-dddd-dddd-dddd-dddddddddd10', '1.1 Introduction to Commercial Kitchen Electrical Demands', 'Commercial kitchens operate under harsh electrical conditions: high moisture, ambient heat up to 120°F, grease vapors, and heavy mechanical vibration. Understanding the load dynamics of 208V/480V 3-phase machinery vs standard 120V circuits is fundamental for preventing electrical overloads.', 30, 1),
    ('dddddddd-dddd-dddd-dddd-dddddddddd12', 'dddddddd-dddd-dddd-dddd-dddddddddd10', '1.2 Recognizing Electrical Hazards: Frayed Cords & Pinch Points', 'Identify the warning signs of damaged insulation: discoloration, stiffened cord jackets from grease exposure, loose plug blades, and missing ground pins. Why multi-plug adapters and extension cords are strictly prohibited in prep zones.', 45, 2),
    ('dddddddd-dddd-dddd-dddd-dddddddddd21', 'dddddddd-dddd-dddd-dddd-dddddddddd20', '2.1 The 36-Inch Clearance Rule & Panel Accessibility', 'Under OSHA and NEC standard 110.26, electrical panels must maintain a minimum 36 inches of clear depth, 30 inches of width, and 6.5 feet of headroom. Learn how to train kitchen staff never to stage prep carts, dry goods, or inventory near electrical rooms.', 40, 1),
    ('dddddddd-dddd-dddd-dddd-dddddddddd31', 'dddddddd-dddd-dddd-dddd-dddddddddd30', '3.1 Ground Fault Circuit Interrupters (GFCI) in Food Preparation', 'A GFCI detects current imbalances as small as 4 to 6 milliamperes and disconnects power in less than 1/40th of a second. Hands-on testing procedures with monthly log documentation.', 45, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO exams (id, program_id, title, description, time_limit_minutes, passing_percentage, max_attempts, randomize_questions, is_active)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'CRESM Comprehensive Certification Examination', 'Online credentialing assessment testing manager readiness in commercial kitchen electrical compliance, hazard recognition, panel clearances, and emergency protocol.', 45, 80.00, 3, false, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO exam_questions (id, exam_id, question_type, question_text, options, correct_answers, points, order_index)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'multiple_choice', 'According to standard electrical safety guidelines, what is the minimum clear working depth required in front of a commercial electrical panel?', '[{"id":"A","text":"12 inches"},{"id":"B","text":"24 inches"},{"id":"C","text":"36 inches (3 feet)"},{"id":"D","text":"48 inches"}]'::jsonb, '["C"]'::jsonb, 10, 1),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'multiple_choice', 'Which type of device is specifically designed to protect kitchen staff from lethal electric shock when working near wet areas or sinks?', '[{"id":"A","text":"Standard Thermal Circuit Breaker"},{"id":"B","text":"Ground Fault Circuit Interrupter (GFCI)"},{"id":"C","text":"Surge Protection Strip"},{"id":"D","text":"Rotary Disconnect Switch"}]'::jsonb, '["B"]'::jsonb, 10, 2),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'true_false', 'Temporary extension cords are permitted as permanent wiring for commercial food slicers and warmers if zip-tied to walls.', '[{"id":"A","text":"True"},{"id":"B","text":"False"}]'::jsonb, '["B"]'::jsonb, 10, 3),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'multiple_choice', 'If an electrical circuit breaker repeatedly trips when a piece of cooking equipment is turned on, what should the manager do first?', '[{"id":"A","text":"Tape the breaker handle in the ON position"},{"id":"B","text":"Replace the breaker with one having higher amperage rating"},{"id":"C","text":"Turn off and lock out the equipment and notify an authorized electrical technician"},{"id":"D","text":"Keep resetting it repeatedly until it stays on"}]'::jsonb, '["C"]'::jsonb, 10, 4),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'multiple_choice', 'How frequently should commercial kitchen GFCI receptacles and emergency exit battery-backup lights be tested and logged?', '[{"id":"A","text":"Every 5 years"},{"id":"B","text":"Annually only"},{"id":"C","text":"Monthly"},{"id":"D","text":"Only when an electrical fault occurs"}]'::jsonb, '["C"]'::jsonb, 10, 5)
ON CONFLICT (id) DO NOTHING;

-- Elena Rostova's Certification Application & Issued Certificate
INSERT INTO certification_applications (id, program_id, user_id, organization_id, status, reviewed_by, review_notes, submitted_at, reviewed_at)
VALUES
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'a0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'issued', 'a0000000-0000-0000-0000-000000000006', 'All course modules completed and examination passed with a 100% score.', '2026-01-05 09:00:00Z', '2026-01-08 11:30:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO certifications (id, certificate_number, application_id, user_id, organization_id, program_id, issue_date, expiry_date, status, verification_code, qr_code_url, issued_by)
VALUES
    ('10101010-1010-1010-1010-101010101010', 'CRESM-2026-88492', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'a0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2026-01-08', '2028-01-08', 'active', 'REA-VRF-88492-X7', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://rea-compliance.com/verify/REA-VRF-88492-X7', 'a0000000-0000-0000-0000-000000000006')
ON CONFLICT (id) DO NOTHING;

-- 13. AUDIT LOGS
INSERT INTO audit_logs (user_id, organization_id, action, module, record_id, new_values, ip_address, created_at)
VALUES
    ('a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'APPROVE', 'assessments', '99999999-9999-9999-9999-999999999901', '{"status": "approved", "score": 94.50}'::jsonb, '127.0.0.1', '2026-01-12 14:30:00Z'),
    ('a0000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'ISSUE_CERTIFICATE', 'certifications', '10101010-1010-1010-1010-101010101010', '{"certificate_number": "CRESM-2026-88492", "recipient": "Elena Rostova"}'::jsonb, '127.0.0.1', '2026-01-08 11:35:00Z')
ON CONFLICT DO NOTHING;

-- 14. SYSTEM SETTINGS
INSERT INTO system_settings (category, key, value, description)
VALUES
    ('general', 'platform_name', '"Restaurant Electrical Authority (REA)"'::jsonb, 'Public branding and application header display title'),
    ('assessments', 'default_passing_threshold', '85.0'::jsonb, 'Readiness percentage required for location to achieve Compliant rating'),
    ('certifications', 'auto_issue_certificates', 'false'::jsonb, 'Require manual certification manager verification prior to certificate issuance'),
    ('notifications', 'reminder_days_before_annual_review', '[30, 14, 7, 1]'::jsonb, 'Schedule intervals in days to trigger review reminders prior to due date')
ON CONFLICT (key) DO NOTHING;

-- 15. CONTACT MESSAGES
INSERT INTO contact_messages (name, email, organization, subject, message, status)
VALUES
    ('Marcus Vance', 'mvance@metrosteaks.com', 'Metro Steakhouse Group', 'Multi-Unit Electrical Assessment Onboarding', 'We operate 14 restaurant locations in the Tri-State area and need to implement standardized electrical panel documentation and manager certifications.', 'new')
ON CONFLICT DO NOTHING;
