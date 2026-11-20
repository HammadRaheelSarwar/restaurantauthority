import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Target,
  Eye,
  Award,
  CheckCircle2,
  Users,
  Building,
  Zap,
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  Flame,
  Check
} from 'lucide-react';

export default function AboutPage() {
  const leadership = [
    {
      name: 'Marcus Vance, PE',
      role: 'Chief Engineering Officer & Co-Founder',
      cred: 'Licensed Professional Engineer (MEP) • 22+ Years in Commercial Foodservice Design',
      bio: 'Former technical contributor to commercial kitchen electrical safety standards. Marcus has engineered power distribution for over 1,200 restaurant facilities across North America.',
      badge: 'NFPA & IEEE Member'
    },
    {
      name: 'Dr. Aris Thorne, CSP',
      role: 'Head of Regulatory Compliance & Standards',
      cred: 'Certified Safety Professional • Former Federal OSHA Facilities Inspector',
      bio: 'Over 18 years enforcing occupational safety and commercial electrical compliance codes (NEC 110.26, OSHA 1910.303). Specializes in arc flash hazard mitigation.',
      badge: 'OSHA Authorized'
    },
    {
      name: 'Sarah Jenkins',
      role: 'VP of Hospitality Operations',
      cred: 'Former VP of Facilities at Apex Restaurant Brands (400+ Units)',
      bio: 'Spearheaded corporate facilities risk governance across 14 multi-unit casual dining and QSR brands. Architect of the REA Closed-Loop Corrective Action methodology.',
      badge: 'Hospitality Executive'
    },
    {
      name: 'David Martinez',
      role: 'Director of Assessor Quality & Field Operations',
      cred: 'Master Electrician (Lic #ME-88410) • Level III Thermographer',
      bio: 'Oversees REA’s national network of certified commercial kitchen assessors. Certified in high-voltage distribution, commercial hood shunt-trips, and infrared electrical diagnostics.',
      badge: 'Master Electrician'
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'The Commercial Kitchen Safety Initiative',
      desc: 'Following a landmark study showing 68% of commercial kitchen electrical fires originate from blocked panel clearances and uninspected multi-phase fryers, our engineering founders drafted the REA 36-Point Readiness Protocol.'
    },
    {
      year: '2022',
      title: 'Digital Panel Twin & CRESM Launch',
      desc: 'Released the cloud-based electrical panel scheduler and launched the Certified Restaurant Electrical Safety Manager (CRESM) training curriculum for restaurant general managers.'
    },
    {
      year: '2024',
      title: 'Enterprise Multi-Unit Expansion',
      desc: 'Scaled to protect over 450+ high-volume commercial kitchens across 18 states, partnering with national restaurant insurance underwriters to reward verified electrical readiness.'
    },
    {
      year: '2026',
      title: 'Real-Time Telemetry & Automated Auditing',
      desc: 'Integrated real-time phase balance monitoring, digital single-line diagrams, and instant cryptographic QR verification for compliance certificates.'
    }
  ];

  const frameworks = [
    {
      code: 'NEC Art. 110.26',
      title: 'Working Space Clearance',
      spec: '36-inch minimum clear depth, 30-inch width, 6.5-foot headroom in front of all service equipment.',
      rea: 'REA enforces photographic working clearance verification and automated staff clearance alert reminders.'
    },
    {
      code: 'NFPA 96',
      title: 'Commercial Cooking Operations',
      spec: 'Exhaust hood interlocks, makeup air fan shutdown, and cookline gas/electric shunt-trip actuation.',
      rea: 'Quarterly interlock trip audits ensuring automatic electrical shut-off during Ansul fire system discharge.'
    },
    {
      code: 'NEC Art. 210.8(B)',
      title: 'Commercial Kitchen GFCI Protection',
      spec: 'Mandatory Class A Ground-Fault Circuit-Interrupter protection on all single & 3-phase receptacles up to 50A.',
      rea: 'Calibrated millisecond trip testing logs verifying sub-25 millisecond response on all wet prep receptacles.'
    },
    {
      code: 'OSHA 1910.303',
      title: 'General Electrical Safety',
      spec: 'Deadfront integrity, conductor insulation, legible circuit labeling, and lockout/tagout readiness.',
      rea: 'Single-line digital panel schedules with verified circuit-to-appliance load directories.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>The Authority in Commercial Kitchen Electrical Governance</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 tracking-tight leading-tight">
          Engineered by Master Electricians & Hospitality Leaders.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Restaurant Electrical Authority (REA) is the national compliance platform purpose-built for the unique, harsh environment of commercial foodservice. We combine professional electrical engineering standards with modern cloud management to protect restaurants, teams, and patrons.
        </p>
      </div>

      {/* Origin Story / The Problem We Solve */}
      <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs bg-white/10 px-3 py-1 rounded-full">
            Our Genesis & Philosophy
          </span>
          <h2 className="text-3xl font-bold tracking-tight">
            Commercial kitchens are high-amperage industrial plants operating inside retail spaces.
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Every day, commercial kitchens combine 480V 3-phase combi ovens, continuous high-pressure washdown water, grease aerosols, and intense thermal cycling. Yet historically, restaurant organizations relied on faded handwritten panel schedules, neglected working clearances, and inspection reports filed away in cardboard boxes.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            REA was founded to transform electrical safety from a passive checkbox into an active, centralized operational system: providing digital single-line panel documentation, verified site assessments, closed-loop repairs, and manager certification that insurance underwriters trust.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">450+</div>
              <div className="text-xs text-slate-300 mt-1">Kitchens Monitored</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-300 mt-1">NEC 110.26 Audited</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">&lt; 25ms</div>
              <div className="text-xs text-slate-300 mt-1">GFCI Trip Baseline</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">0</div>
              <div className="text-xs text-slate-300 mt-1">Catastrophic Losses</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of REA Architecture */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            The REA Compliance Standard
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            The Four Pillars of Restaurant Electrical Governance
          </h2>
          <p className="text-sm text-slate-600">
            A comprehensive, closed-loop methodology designed to meet municipal electrical codes, OSHA workplace standards, and insurance risk underwriting requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Digital Twin Documentation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every electrical distribution panel, circuit breaker, and connected high-draw appliance is digitally cataloged with amperage, voltage, and breaker pole count.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Proactive Field Auditing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              36-point physical inspections conducted by certified electrical assessors using standardized digital tablets with photo evidence and severity rating.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Closed-Loop Remediation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero tolerance for unaddressed defects. Every non-compliance automatically triggers an assigned corrective action (CAPA) with licensed electrician verification.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">4. Manager Certification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              General Managers earn the Certified Restaurant Electrical Safety Manager (CRESM) credential, empowering shift supervisors to prevent hazards daily.
            </p>
          </div>
        </div>
      </div>

      {/* Code Compliance Matrix */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-8">
        <div>
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-100/60 px-3 py-1 rounded-full">
            Regulatory & Code Alignment
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
            Built Directly on National Electrical & Life Safety Standards
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            REA software checklists and field inspection standards are directly mapped to authoritative US standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frameworks.map((fw, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-brand-900 text-white rounded-lg">
                  {fw.code}
                </span>
                <span className="text-xs font-semibold text-emerald-700">{fw.title}</span>
              </div>
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">Code Requirement: </span>
                {fw.spec}
              </div>
              <div className="text-xs text-slate-800 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">REA Implementation:</strong> {fw.rea}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership & Advisory Team */}
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Technical Leadership
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Governed by Safety Engineers, Master Electricians & Hospitality Experts
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Our leadership team unites licensed electrical engineers who design critical infrastructure with veteran multi-unit restaurant operators who understand kitchen urgency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadership.map((leader, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{leader.name}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{leader.role}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                    {leader.badge}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  {leader.cred}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizational Milestones */}
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Chronology of Impact
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Continuous Innovation in Commercial Kitchen Safety
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2 relative">
              <div className="text-2xl font-extrabold text-brand-900 font-mono">{m.year}</div>
              <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-brand-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Protect your restaurant organization today.
          </h3>
          <p className="text-slate-300 text-sm">
            Schedule a compliance assessment or certify your general managers with the national standard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            className="bg-emerald-500 hover:bg-emerald-400 text-brand-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-md flex items-center gap-2"
          >
            <span>Consult an Assessor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/certification"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition border border-white/20"
          >
            CRESM Program
          </Link>
        </div>
      </div>
    </div>
  );
}