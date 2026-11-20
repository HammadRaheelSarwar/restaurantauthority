let createClient;
try {
  createClient = (await import('@supabase/supabase-js')).createClient;
} catch {}
try {
  const dotenv = await import('dotenv');
  dotenv.default.config();
} catch {}

const supabaseUrl = process.env.SUPABASE_URL || 'https://sample-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sample-key';

const isMock = !supabaseUrl || supabaseUrl.includes('sample-project') || !supabaseKey || supabaseKey.includes('sample-');

let supabase;

if (!isMock) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('[REA Database] Connected to live Supabase PostgreSQL service at:', supabaseUrl);
  } catch (err) {
    console.warn('[REA Database] Failed to initialize live Supabase client. Falling back to local data store.', err.message);
  }
}

// In-Memory Data Store replicating Supabase DB with initial Seed Records
if (!supabase) {
  console.log('[REA Database] Initializing local resilient compliance data store (Mock Mode)');

  // Initial Mock State seeded with rich enterprise records
  const mockDB = {
    organizations: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Apex Hospitality Group',
        business_registration_no: 'US-DEL-984721',
        email: 'compliance@apexhospitality.com',
        phone: '+1 (555) 234-5678',
        address: '450 Lexington Ave, Suite 1200',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10017',
        status: 'active',
        created_at: new Date('2025-01-01').toISOString(),
        updated_at: new Date('2025-01-01').toISOString()
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Oceanic Culinary Brands',
        business_registration_no: 'US-CA-551982',
        email: 'safety@oceanicdining.com',
        phone: '+1 (555) 876-5432',
        address: '1200 Ocean Promenade',
        city: 'Santa Monica',
        state: 'CA',
        country: 'USA',
        postal_code: '90401',
        status: 'active',
        created_at: new Date('2025-01-15').toISOString(),
        updated_at: new Date('2025-01-15').toISOString()
      }
    ],
    profiles: [
      {
        id: 'a0000000-0000-0000-0000-000000000001',
        organization_id: null,
        full_name: 'Sarah Jenkins',
        email: 'superadmin@rea-compliance.com',
        phone: '+1 (555) 001-1001',
        role: 'super_admin',
        status: 'active',
        created_at: new Date('2025-01-01').toISOString()
      },
      {
        id: 'a0000000-0000-0000-0000-000000000002',
        organization_id: '11111111-1111-1111-1111-111111111111',
        full_name: 'Michael Chang',
        email: 'admin@apexhospitality.com',
        phone: '+1 (555) 001-1002',
        role: 'admin',
        status: 'active',
        created_at: new Date('2025-01-01').toISOString()
      },
      {
        id: 'a0000000-0000-0000-0000-000000000003',
        organization_id: '11111111-1111-1111-1111-111111111111',
        full_name: 'Robert Vance',
        email: 'operator@apexhospitality.com',
        phone: '+1 (555) 001-1003',
        role: 'restaurant_operator',
        status: 'active',
        created_at: new Date('2025-01-05').toISOString()
      },
      {
        id: 'a0000000-0000-0000-0000-000000000004',
        organization_id: '11111111-1111-1111-1111-111111111111',
        full_name: 'Elena Rostova',
        email: 'manager@apex-downtown.com',
        phone: '+1 (555) 001-1004',
        role: 'restaurant_manager',
        status: 'active',
        created_at: new Date('2025-01-10').toISOString()
      },
      {
        id: 'a0000000-0000-0000-0000-000000000005',
        organization_id: null,
        full_name: 'David Martinez, PE',
        email: 'assessor@rea-compliance.com',
        phone: '+1 (555) 001-1005',
        role: 'electrical_assessor',
        status: 'active',
        created_at: new Date('2025-01-01').toISOString()
      },
      {
        id: 'a0000000-0000-0000-0000-000000000006',
        organization_id: null,
        full_name: 'Rachel Green',
        email: 'certification@rea-compliance.com',
        phone: '+1 (555) 001-1006',
        role: 'certification_manager',
        status: 'active',
        created_at: new Date('2025-01-01').toISOString()
      },
      {
        id: 'a0000000-0000-0000-0000-000000000007',
        organization_id: '11111111-1111-1111-1111-111111111111',
        full_name: 'Thomas Hall',
        email: 'viewer@apexhospitality.com',
        phone: '+1 (555) 001-1007',
        role: 'viewer',
        status: 'active',
        created_at: new Date('2025-01-15').toISOString()
      }
    ],
    restaurants: [
      {
        id: '33333333-3333-3333-3333-333333333331',
        organization_id: '11111111-1111-1111-1111-111111111111',
        name: 'Apex Prime Steakhouse',
        business_name: 'Apex Steakhouse Holdings LLC',
        restaurant_type: 'Fine Dining',
        email: 'prime@apexhospitality.com',
        phone: '+1 (555) 301-4400',
        address: '100 Broadway',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10005',
        assigned_operator_id: 'a0000000-0000-0000-0000-000000000003',
        status: 'active',
        created_at: new Date('2025-01-05').toISOString()
      },
      {
        id: '33333333-3333-3333-3333-333333333332',
        organization_id: '11111111-1111-1111-1111-111111111111',
        name: 'Bistro Lumiere',
        business_name: 'Lumiere French Bistro LLC',
        restaurant_type: 'Casual Dining',
        email: 'lumiere@apexhospitality.com',
        phone: '+1 (555) 302-5500',
        address: '52 Spring Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10012',
        assigned_operator_id: 'a0000000-0000-0000-0000-000000000003',
        status: 'active',
        created_at: new Date('2025-01-08').toISOString()
      }
    ],
    locations: [
      {
        id: '44444444-4444-4444-4444-444444444441',
        organization_id: '11111111-1111-1111-1111-111111111111',
        restaurant_id: '33333333-3333-3333-3333-333333333331',
        name: 'Downtown Flagship',
        location_code: 'APX-NY-01',
        address: '100 Broadway, Ground & Mezzanine',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10005',
        manager_id: 'a0000000-0000-0000-0000-000000000004',
        assessor_id: 'a0000000-0000-0000-0000-000000000005',
        readiness_status: 'compliant',
        readiness_score: 94.50,
        status: 'active',
        created_at: new Date('2025-01-05').toISOString()
      },
      {
        id: '44444444-4444-4444-4444-444444444442',
        organization_id: '11111111-1111-1111-1111-111111111111',
        restaurant_id: '33333333-3333-3333-3333-333333333331',
        name: 'Midtown Galleria',
        location_code: 'APX-NY-02',
        address: '600 5th Avenue',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10020',
        manager_id: 'a0000000-0000-0000-0000-000000000004',
        assessor_id: 'a0000000-0000-0000-0000-000000000005',
        readiness_status: 'needs_attention',
        readiness_score: 78.00,
        status: 'active',
        created_at: new Date('2025-01-06').toISOString()
      }
    ],
    electrical_panels: [
      {
        id: '66666666-6666-6666-6666-666666666601',
        organization_id: '11111111-1111-1111-1111-111111111111',
        location_id: '44444444-4444-4444-4444-444444444441',
        panel_name: 'Main Distribution Panel',
        panel_identifier: 'MDP-1',
        manufacturer: 'Square D / Schneider Electric',
        model: 'NQ442L225',
        location_description: 'Basement Electrical Room, East Wall',
        voltage_rating: '120/208V 3-Phase',
        amperage_rating: '400A',
        phase_type: 'Three Phase',
        specifications: { bus_rating: '400A', aic_rating: '22kA' },
        installation_date: '2023-04-15',
        last_inspection_date: '2026-01-10',
        next_inspection_date: '2026-07-10',
        status: 'operational',
        created_at: new Date('2025-01-05').toISOString()
      },
      {
        id: '66666666-6666-6666-6666-666666666602',
        organization_id: '11111111-1111-1111-1111-111111111111',
        location_id: '44444444-4444-4444-4444-444444444441',
        panel_name: 'Kitchen Cookline Subpanel',
        panel_identifier: 'KP-A',
        manufacturer: 'Eaton Cutler-Hammer',
        model: 'Pow-R-Line 1a',
        location_description: 'Main Kitchen, adjacent to chef pass',
        voltage_rating: '120/208V 3-Phase',
        amperage_rating: '225A',
        phase_type: 'Three Phase',
        specifications: { bus_rating: '225A', aic_rating: '10kA' },
        installation_date: '2023-04-20',
        last_inspection_date: '2026-01-10',
        next_inspection_date: '2026-07-10',
        status: 'operational',
        created_at: new Date('2025-01-05').toISOString()
      }
    ],
    equipment: [
      {
        id: '77777777-7777-7777-7777-777777777701',
        organization_id: '11111111-1111-1111-1111-111111111111',
        location_id: '44444444-4444-4444-4444-444444444441',
        name: 'Rational iCombi Pro 10-Full Size',
        category: 'Heavy Cooking Equipment',
        manufacturer: 'Rational USA',
        model_number: 'LM100CE.XX',
        serial_number: 'E11MH23049102',
        installation_date: '2023-06-10',
        condition: 'excellent',
        status: 'active',
        inspection_frequency_days: 90,
        last_inspection_date: '2026-01-15',
        next_inspection_date: '2026-04-15',
        maintenance_notes: 'Hardwired 208V 3-phase 37.4kW. Routine check clean.',
        created_at: new Date('2025-01-05').toISOString()
      },
      {
        id: '77777777-7777-7777-7777-777777777702',
        organization_id: '11111111-1111-1111-1111-111111111111',
        location_id: '44444444-4444-4444-4444-444444444441',
        name: 'Master-Bilt Walk-in Freezer Compressor',
        category: 'Refrigeration & Cooling',
        manufacturer: 'Master-Bilt',
        model_number: 'MRS030M44C',
        serial_number: 'MB-FZ-99214',
        installation_date: '2023-05-18',
        condition: 'fair',
        status: 'active',
        inspection_frequency_days: 180,
        last_inspection_date: '2025-11-15',
        next_inspection_date: '2026-05-15',
        maintenance_notes: 'Disconnect handle loose; weather seal degrading.',
        created_at: new Date('2025-01-05').toISOString()
      }
    ],
    assessment_templates: [
      {
        id: '88888888-8888-8888-8888-888888888801',
        title: 'REA Restaurant Electrical Readiness & Safety Standard',
        description: 'Comprehensive commercial kitchen electrical inspection checklist covering panels, cooking lines, wet areas, and emergency systems.',
        category: 'Commercial Food Service Safety',
        version: '2026.1',
        is_active: true,
        created_at: new Date('2025-01-01').toISOString()
      }
    ],
    assessment_sections: [
      {
        id: '88888888-8888-8888-8888-888888888810',
        template_id: '88888888-8888-8888-8888-888888888801',
        title: 'Electrical Panels & Disconnects',
        description: 'Clearances, labelling, breaker physical condition, deadfront integrity, and ground continuity',
        order_index: 1
      },
      {
        id: '88888888-8888-8888-8888-888888888820',
        template_id: '88888888-8888-8888-8888-888888888801',
        title: 'Cooking Equipment & Heavy Appliance Wiring',
        description: 'Cords, strain reliefs, plugs, interlocks, flexible conduits, and thermal insulation near heat sources',
        order_index: 2
      },
      {
        id: '88888888-8888-8888-8888-888888888830',
        template_id: '88888888-8888-8888-8888-888888888801',
        title: 'Wet & Damp Location Protection (GFCI)',
        description: 'Sink proximity, washdown areas, dishwasher stations, in-use waterproof covers, and GFCI trip testing',
        order_index: 3
      }
    ],
    assessment_items: [
      {
        id: '88888888-8888-8888-8888-888888888811',
        section_id: '88888888-8888-8888-8888-888888888810',
        code: 'EP-01',
        question: 'Are all electrical panels unobstructed with at least 36-inch (3-foot) clear working space?',
        instructions: 'Verify no boxes, prep tables, grease containers, or carts are blocking access to panel door.',
        is_required: true,
        evidence_required: true,
        severity_if_failed: 'high',
        order_index: 1
      },
      {
        id: '88888888-8888-8888-8888-888888888812',
        section_id: '88888888-8888-8888-8888-888888888810',
        code: 'EP-02',
        question: 'Is the panel directory legibly updated with accurate breaker-to-load identification?',
        instructions: 'Inspect schedule on inside door. Check for pencil markings or missing circuit names.',
        is_required: true,
        evidence_required: false,
        severity_if_failed: 'medium',
        order_index: 2
      },
      {
        id: '88888888-8888-8888-8888-888888888831',
        section_id: '88888888-8888-8888-8888-888888888830',
        code: 'GF-01',
        question: 'Are all receptacles within 6 feet of sinks, dish areas, and beverage stations GFCI protected?',
        instructions: 'Test with certified plug-in GFCI circuit tester to verify ground fault interruption occurs.',
        is_required: true,
        evidence_required: true,
        severity_if_failed: 'critical',
        order_index: 1
      }
    ],
    assessments: [
      {
        id: '99999999-9999-9999-9999-999999999901',
        organization_id: '11111111-1111-1111-1111-111111111111',
        restaurant_id: '33333333-3333-3333-3333-333333333331',
        location_id: '44444444-4444-4444-4444-444444444441',
        template_id: '88888888-8888-8888-8888-888888888801',
        assessor_id: 'a0000000-0000-0000-0000-000000000005',
        title: 'Q1 2026 Annual Electrical Readiness Audit - Flagship',
        assessment_type: 'annual_compliance',
        status: 'approved',
        scheduled_date: '2026-01-10',
        completed_date: '2026-01-10',
        score: 94.50,
        notes: 'Thorough walk-through completed. High standard maintained overall.',
        summary: 'Facility displays exemplary electrical management. All panels labeled and clear.',
        approved_by: 'a0000000-0000-0000-0000-000000000001',
        approved_at: '2026-01-12T14:30:00.000Z',
        created_at: new Date('2026-01-05').toISOString()
      },
      {
        id: '99999999-9999-9999-9999-999999999902',
        organization_id: '11111111-1111-1111-1111-111111111111',
        restaurant_id: '33333333-3333-3333-3333-333333333331',
        location_id: '44444444-4444-4444-4444-444444444442',
        template_id: '88888888-8888-8888-8888-888888888801',
        assessor_id: 'a0000000-0000-0000-0000-000000000005',
        title: 'Routine Readiness Inspection - Midtown Galleria',
        assessment_type: 'routine',
        status: 'in_progress',
        scheduled_date: '2026-02-14',
        completed_date: null,
        score: 78.00,
        notes: 'Inspection in progress. Awaiting corrective action confirmation.',
        created_at: new Date('2026-02-10').toISOString()
      }
    ],
    assessment_responses: [
      {
        id: 'response-001',
        assessment_id: '99999999-9999-9999-9999-999999999901',
        item_id: '88888888-8888-8888-8888-888888888811',
        status: 'pass',
        comments: 'Full 40-inch clearance observed in front of MDP-1 and KP-A.',
        severity: 'low',
        requires_corrective_action: false
      },
      {
        id: 'response-002',
        assessment_id: '99999999-9999-9999-9999-999999999901',
        item_id: '88888888-8888-8888-8888-888888888812',
        status: 'pass',
        comments: 'Typewritten panel schedules updated November 2025.',
        severity: 'low',
        requires_corrective_action: false
      },
      {
        id: 'response-003',
        assessment_id: '99999999-9999-9999-9999-999999999901',
        item_id: '88888888-8888-8888-8888-888888888831',
        status: 'pass',
        comments: 'Every outlet along cookline verified 5mA GFCI trip.',
        severity: 'low',
        requires_corrective_action: false
      }
    ],
    incidents: [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        organization_id: '11111111-1111-1111-1111-111111111111',
        restaurant_id: '33333333-3333-3333-3333-333333333331',
        location_id: '44444444-4444-4444-4444-444444444441',
        equipment_id: '77777777-7777-7777-7777-777777777701',
        panel_id: '66666666-6666-6666-6666-666666666602',
        reported_by: 'a0000000-0000-0000-0000-000000000004',
        assigned_investigator_id: 'a0000000-0000-0000-0000-000000000005',
        incident_date: '2026-02-01',
        incident_time: '19:45:00',
        category: 'equipment_malfunction',
        severity: 'medium',
        title: 'Oven Breaker Tripped During Friday Dinner Rush',
        description: 'The 60A 3-pole circuit breaker serving Combi Oven #1 tripped during high heat preheat cycle.',
        immediate_actions: 'Unit de-energized, food transferred to backup deck oven.',
        findings: 'Loose screw torque on phase B terminal of breaker caused localized overheating.',
        status: 'resolved',
        created_at: new Date('2026-02-01').toISOString()
      }
    ],
    corrective_actions: [
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        organization_id: '11111111-1111-1111-1111-111111111111',
        location_id: '44444444-4444-4444-4444-444444444441',
        assessment_id: '99999999-9999-9999-9999-999999999901',
        incident_id: null,
        title: 'Replace Weatherproof Seal on Walk-in Freezer Disconnect Switch',
        description: 'Replace degraded rubber seal on NEMA 3R disconnect switch serving roof condenser to prevent moisture entry.',
        assigned_to: 'a0000000-0000-0000-0000-000000000004',
        priority: 'medium',
        status: 'in_progress',
        due_date: '2026-03-01',
        instructions: 'Order OEM gasket kit or replace disconnect enclosure with Hubbell NEMA 4X equivalent.',
        created_by: 'a0000000-0000-0000-0000-000000000005',
        created_at: new Date('2026-01-11').toISOString()
      }
    ],
    annual_reviews: [
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        organization_id: '11111111-1111-1111-1111-111111111111',
        restaurant_id: '33333333-3333-3333-3333-333333333331',
        location_id: '44444444-4444-4444-4444-444444444441',
        reviewer_id: 'a0000000-0000-0000-0000-000000000005',
        review_year: 2026,
        review_date: '2026-01-15',
        due_date: '2026-01-31',
        status: 'approved',
        readiness_score: 95.00,
        summary: 'Comprehensive annual readiness confirmed. All 3 electrical panels certified, manager holds current CRESM credential.',
        recommendations: 'Maintain 6-month thermal infrared scan on Main Distribution Panel MDP-1.',
        approved_by: 'a0000000-0000-0000-0000-000000000001',
        approved_at: '2026-01-20T10:00:00.000Z',
        created_at: new Date('2026-01-02').toISOString()
      }
    ],
    certification_programs: [
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'Certified Restaurant Electrical Safety Manager (CRESM)',
        code: 'CRESM-L1',
        description: 'Official qualification program for restaurant general managers, executive chefs, and operations supervisors on commercial food service electrical safety.',
        eligibility_requirements: 'Minimum 1 year restaurant operational management experience or hospitality supervisory credential.',
        duration_hours: 16,
        validity_months: 24,
        passing_score: 80.00,
        is_active: true,
        created_at: new Date('2025-01-01').toISOString()
      }
    ],
    certification_courses: [
      {
        id: 'course-01',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'Module 1: Principles of Kitchen Electrical Safety & Hazard Recognition',
        description: 'Understanding voltage tiers, amperage loads, common causes of commercial kitchen electrical fires, and shock prevention.',
        order_index: 1
      },
      {
        id: 'course-02',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'Module 2: Electrical Panel Clearances, Breakers & Safe Disconnects',
        description: 'National Electrical Code (NEC) 36-inch clearance requirements, deadfront integrity, and safe circuit breaker operation.',
        order_index: 2
      },
      {
        id: 'course-03',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'Module 3: Wet Location Protection, GFCI Standards & Water Proximity',
        description: 'GFCI operation, testing frequencies, splash zone standards, and outdoor weatherproof receptacle enclosures.',
        order_index: 3
      },
      {
        id: 'course-04',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'Module 4: Incident Response, Lockout/Tagout (LOTO) & Readiness Auditing',
        description: 'Safe emergency power shut-off procedures, LOTO execution for managers, and conducting internal monthly electrical walkthroughs.',
        order_index: 4
      }
    ],
    course_modules: [
      {
        id: 'module-01',
        course_id: 'course-01',
        title: '1.1 Introduction to Commercial Kitchen Electrical Demands',
        content: 'Commercial kitchens operate under harsh electrical conditions: high moisture, ambient heat up to 120°F, grease vapors, and heavy mechanical vibration. Understanding the load dynamics of 208V/480V 3-phase machinery vs standard 120V circuits is fundamental for preventing electrical overloads.',
        video_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration_minutes: 30,
        order_index: 1
      },
      {
        id: 'module-02',
        course_id: 'course-01',
        title: '1.2 Recognizing Electrical Hazards: Frayed Cords & Pinch Points',
        content: 'Identify the warning signs of damaged insulation: discoloration, stiffened cord jackets from grease exposure, loose plug blades, and missing ground pins. Why multi-plug adapters and extension cords are strictly prohibited in prep zones.',
        video_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration_minutes: 45,
        order_index: 2
      },
      {
        id: 'module-03',
        course_id: 'course-02',
        title: '2.1 The 36-Inch Clearance Rule & Panel Accessibility',
        content: 'Under OSHA and NEC standard 110.26, electrical panels must maintain a minimum 36 inches of clear depth, 30 inches of width, and 6.5 feet of headroom. Learn how to train kitchen staff never to stage prep carts, dry goods, or inventory near electrical rooms.',
        video_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration_minutes: 40,
        order_index: 1
      },
      {
        id: 'module-04',
        course_id: 'course-03',
        title: '3.1 Ground Fault Circuit Interrupters (GFCI) in Food Preparation',
        content: 'A GFCI detects current imbalances as small as 4 to 6 milliamperes and disconnects power in less than 1/40th of a second. Hands-on testing procedures with monthly log documentation.',
        video_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        duration_minutes: 45,
        order_index: 1
      }
    ],
    exams: [
      {
        id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'CRESM Comprehensive Certification Examination',
        description: 'Online credentialing assessment testing manager readiness in commercial kitchen electrical compliance, hazard recognition, panel clearances, and emergency protocol.',
        time_limit_minutes: 45,
        passing_percentage: 80.00,
        max_attempts: 3,
        randomize_questions: false,
        is_active: true,
        created_at: new Date('2025-01-01').toISOString()
      }
    ],
    exam_questions: [
      {
        id: 'q-01',
        exam_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        question_type: 'multiple_choice',
        question_text: 'According to standard electrical safety guidelines, what is the minimum clear working depth required in front of a commercial electrical panel?',
        options: [
          { id: 'A', text: '12 inches' },
          { id: 'B', text: '24 inches' },
          { id: 'C', text: '36 inches (3 feet)' },
          { id: 'D', text: '48 inches' }
        ],
        correct_answers: ['C'],
        points: 20,
        order_index: 1
      },
      {
        id: 'q-02',
        exam_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        question_type: 'multiple_choice',
        question_text: 'Which type of device is specifically designed to protect kitchen staff from lethal electric shock when working near wet areas or sinks?',
        options: [
          { id: 'A', text: 'Standard Thermal Circuit Breaker' },
          { id: 'B', text: 'Ground Fault Circuit Interrupter (GFCI)' },
          { id: 'C', text: 'Surge Protection Strip' },
          { id: 'D', text: 'Rotary Disconnect Switch' }
        ],
        correct_answers: ['B'],
        points: 20,
        order_index: 2
      },
      {
        id: 'q-03',
        exam_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        question_type: 'true_false',
        question_text: 'Temporary extension cords are permitted as permanent wiring for commercial food slicers and warmers if zip-tied to walls.',
        options: [
          { id: 'A', text: 'True' },
          { id: 'B', text: 'False' }
        ],
        correct_answers: ['B'],
        points: 20,
        order_index: 3
      },
      {
        id: 'q-04',
        exam_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        question_type: 'multiple_choice',
        question_text: 'If an electrical circuit breaker repeatedly trips when cooking equipment is turned on, what should the manager do first?',
        options: [
          { id: 'A', text: 'Tape the breaker handle in the ON position' },
          { id: 'B', text: 'Replace the breaker with a higher amperage rating' },
          { id: 'C', text: 'Turn off and lock out the equipment and notify an authorized electrical technician' },
          { id: 'D', text: 'Keep resetting it repeatedly until it stays on' }
        ],
        correct_answers: ['C'],
        points: 20,
        order_index: 4
      },
      {
        id: 'q-05',
        exam_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        question_type: 'multiple_choice',
        question_text: 'How frequently should commercial kitchen GFCI receptacles and emergency exit battery-backup lights be tested and logged?',
        options: [
          { id: 'A', text: 'Every 5 years' },
          { id: 'B', text: 'Annually only' },
          { id: 'C', text: 'Monthly' },
          { id: 'D', text: 'Only when an electrical fault occurs' }
        ],
        correct_answers: ['C'],
        points: 20,
        order_index: 5
      }
    ],
    certification_applications: [
      {
        id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        user_id: 'a0000000-0000-0000-0000-000000000004',
        organization_id: '11111111-1111-1111-1111-111111111111',
        status: 'issued',
        reviewed_by: 'a0000000-0000-0000-0000-000000000006',
        review_notes: 'All course modules completed and examination passed with a 100% score.',
        submitted_at: '2026-01-05T09:00:00.000Z',
        reviewed_at: '2026-01-08T11:30:00.000Z',
        created_at: new Date('2026-01-05').toISOString()
      }
    ],
    certifications: [
      {
        id: '10101010-1010-1010-1010-101010101010',
        certificate_number: 'CRESM-2026-88492',
        application_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        user_id: 'a0000000-0000-0000-0000-000000000004',
        organization_id: '11111111-1111-1111-1111-111111111111',
        program_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        issue_date: '2026-01-08',
        expiry_date: '2028-01-08',
        status: 'active',
        verification_code: 'REA-VRF-88492-X7',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://rea-compliance.com/verify/REA-VRF-88492-X7',
        pdf_url: '/api/certification/certificates/10101010-1010-1010-1010-101010101010/pdf',
        issued_by: 'a0000000-0000-0000-0000-000000000006',
        created_at: new Date('2026-01-08').toISOString()
      }
    ],
    documents: [
      {
        id: 'doc-001',
        organization_id: '11111111-1111-1111-1111-111111111111',
        location_id: '44444444-4444-4444-4444-444444444441',
        category: 'assessment',
        title: 'Q1 2026 Flagship Electrical Audit Certificate.pdf',
        file_name: 'Q1-2026-Audit.pdf',
        file_url: 'https://rea-compliance.com/docs/Q1-2026-Audit.pdf',
        storage_path: 'documents/Q1-2026-Audit.pdf',
        file_type: 'application/pdf',
        file_size: 245000,
        version: 1,
        uploaded_by: 'a0000000-0000-0000-0000-000000000005',
        created_at: new Date('2026-01-12').toISOString()
      }
    ],
    notifications: [
      {
        id: 'notif-001',
        user_id: 'a0000000-0000-0000-0000-000000000004',
        organization_id: '11111111-1111-1111-1111-111111111111',
        title: 'Certificate Issued',
        message: 'Congratulations! Your CRESM certification has been officially issued.',
        type: 'certification',
        link: '/certifications',
        is_read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'notif-002',
        user_id: 'a0000000-0000-0000-0000-000000000004',
        organization_id: '11111111-1111-1111-1111-111111111111',
        title: 'Corrective Action Assigned',
        message: 'Action CA-8812: Replace Weatherproof Seal on Walk-in Freezer Disconnect Switch',
        type: 'corrective_action',
        link: '/corrective-actions',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ],
    audit_logs: [
      {
        id: 'audit-001',
        user_id: 'a0000000-0000-0000-0000-000000000001',
        organization_id: '11111111-1111-1111-1111-111111111111',
        action: 'APPROVE',
        module: 'assessments',
        record_id: '99999999-9999-9999-9999-999999999901',
        new_values: { status: 'approved', score: 94.50 },
        ip_address: '127.0.0.1',
        created_at: new Date('2026-01-12T14:30:00.000Z').toISOString()
      }
    ],
    contact_messages: [
      {
        id: 'contact-001',
        name: 'Marcus Vance',
        email: 'mvance@metrosteaks.com',
        organization: 'Metro Steakhouse Group',
        subject: 'Multi-Unit Electrical Assessment Onboarding',
        message: 'We operate 14 restaurant locations in the Tri-State area and need standardized electrical documentation.',
        status: 'new',
        created_at: new Date('2026-02-15').toISOString()
      }
    ],
    system_settings: [
      {
        id: 'setting-001',
        category: 'general',
        key: 'platform_name',
        value: 'Restaurant Electrical Authority (REA)',
        description: 'Public branding display title'
      },
      {
        id: 'setting-002',
        category: 'assessments',
        key: 'default_passing_threshold',
        value: 85.0,
        description: 'Readiness percentage required for location to achieve Compliant rating'
      }
    ]
  };

  // Create an object supporting Supabase chaining syntax:
  // supabase.from(table).select().eq().order().limit().single()
  // supabase.from(table).insert()
  // supabase.from(table).update()
  // supabase.from(table).delete()
  supabase = {
    from(tableName) {
      if (!mockDB[tableName]) {
        mockDB[tableName] = [];
      }
      const tableData = mockDB[tableName];

      class QueryBuilder {
        constructor(data) {
          this.data = [...data];
          this.isSingle = false;
          this.isCount = false;
        }

        select(fields = '*') {
          return this;
        }

        eq(column, value) {
          this.data = this.data.filter(row => row[column] === value);
          return this;
        }

        neq(column, value) {
          this.data = this.data.filter(row => row[column] !== value);
          return this;
        }

        in(column, values) {
          if (Array.isArray(values)) {
            this.data = this.data.filter(row => values.includes(row[column]));
          }
          return this;
        }

        ilike(column, pattern) {
          const cleanPattern = pattern.replace(/%/g, '').toLowerCase();
          this.data = this.data.filter(row => {
            const val = String(row[column] || '').toLowerCase();
            return val.includes(cleanPattern);
          });
          return this;
        }

        order(column, { ascending = true } = {}) {
          this.data.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
          });
          return this;
        }

        limit(count) {
          this.data = this.data.slice(0, count);
          return this;
        }

        range(from, to) {
          this.data = this.data.slice(from, to + 1);
          return this;
        }

        single() {
          this.isSingle = true;
          return this;
        }

        async insert(payload) {
          const items = Array.isArray(payload) ? payload : [payload];
          const inserted = items.map(item => ({
            id: item.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...item
          }));
          tableData.push(...inserted);
          return { data: Array.isArray(payload) ? inserted : inserted[0], error: null };
        }

        async update(payload) {
          const updated = [];
          this.data.forEach(row => {
            const index = tableData.findIndex(item => item.id === row.id);
            if (index !== -1) {
              tableData[index] = { ...tableData[index], ...payload, updated_at: new Date().toISOString() };
              updated.push(tableData[index]);
            }
          });
          return { data: this.isSingle ? updated[0] || null : updated, error: null };
        }

        async delete() {
          const deletedIds = this.data.map(item => item.id);
          mockDB[tableName] = tableData.filter(item => !deletedIds.includes(item.id));
          return { data: this.data, error: null };
        }

        then(resolve, reject) {
          const result = this.isSingle ? (this.data[0] || null) : this.data;
          resolve({ data: result, error: null, count: this.data.length });
        }
      }

      return new QueryBuilder(tableData);
    },

    auth: {
      async getUser(token) {
        if (!token) return { data: { user: null }, error: new Error('Missing token') };
        // Find profile matching token email or mock profile
        const user = mockDB.profiles.find(p => p.email === token || p.id === token) || mockDB.profiles[0];
        return { data: { user: { id: user.id, email: user.email, user_metadata: { role: user.role, name: user.full_name } } }, error: null };
      },
      async signInWithPassword({ email, password }) {
        const user = mockDB.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
        if (!user) return { data: null, error: new Error('Invalid credentials') };
        return { data: { user, session: { access_token: user.id } }, error: null };
      }
    },

    storage: {
      from(bucketName) {
        return {
          async upload(filePath, fileBuffer, options) {
            return { data: { path: `${bucketName}/${filePath}` }, error: null };
          },
          getPublicUrl(filePath) {
            return { data: { publicUrl: `/uploads/${filePath}` } };
          },
          async createSignedUrl(filePath, expiresIn) {
            return { data: { signedUrl: `/uploads/${filePath}?signed=true&expires=${expiresIn}` }, error: null };
          }
        };
      }
    }
  };
}

export { supabase };
export default supabase;
