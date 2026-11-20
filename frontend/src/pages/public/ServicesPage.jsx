import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Zap,
  Cpu,
  AlertTriangle,
  CalendarCheck2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Activity,
  Check,
  Flame,
  Clock,
  ThermometerSnowflake,
  ExternalLink
} from 'lucide-react';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('assessments');

  const services = [
    {
      id: 'assessments',
      icon: ClipboardCheck,
      badge: 'Core Field Service',
      title: 'Digital Electrical Site Assessments',
      subtitle: '36-Point Commercial Kitchen Protocol',
      desc: 'Standardized physical audits conducted by certified electrical inspectors on mobile tablets, covering high-draw appliances, panel working spaces, ground-fault circuit interrupters, and ventilation interlocks.',
      deliverables: [
        'Calibrated sub-25ms GFCI trip test verification in wet prep, dish, and bar stations',
        'NEC Article 110.26 working clearance compliance (36" depth, 30" width, 6.5\' headroom)',
        'Ansul hood fire suppression microswitch electrical shunt-trip verification',
        'Emergency exit lighting 90-minute battery backup illumination test',
        'Signed, tamper-evident executive PDF scorecard with photographic evidence'
      ],
      cadence: 'Bi-Annual or Quarterly Recommended',
      codeRef: 'NEC 110.26, NFPA 96, OSHA 1910.303'
    },
    {
      id: 'panels',
      icon: Zap,
      badge: 'Engineering Documentation',
      title: 'Electrical Panel Schedules & Single-Line Twins',
      subtitle: 'Eliminate Unlabeled Breakers and Overloads',
      desc: 'Digital twin mapping of Main Distribution Panels (MDP), kitchen subpanels (PP-K), and branch circuits with circuit-to-appliance load directories, AIC interrupting ratings, and 36-inch clearance logs.',
      deliverables: [
        '42-Circuit digital schedules mapping breaker numbers to physical cookline appliances',
        'Continuous 3-phase load balance calculations (Phase A/B/C current distribution)',
        'Working clearance floor boundary markings with verified photographic logs',
        'Thermographic infrared scan records detecting abnormal lug thermal gradients',
        'Exportable single-line diagram PDFs for municipal inspectors & utility providers'
      ],
      cadence: 'Annual Baseline + Real-time Change Management',
      codeRef: 'NEC 408.4, NFPA 70E'
    },
    {
      id: 'equipment',
      icon: Cpu,
      badge: 'Asset Life Safety',
      title: 'High-Draw Kitchen Equipment Telemetry',
      subtitle: 'Prevent Food Spoilage & Electrical Fires',
      desc: 'Electrical condition monitoring for critical heavy foodservice appliances: combi ovens, high-recovery fryers, blast chillers, walk-ins, dishwashers, and planetary mixers.',
      deliverables: [
        'Nameplate voltage, phase, FLA amperage, and NEMA plug configuration registry',
        'Thermal imaging inspections of cord caps, receptacles, and disconnect switches',
        'Strain relief and jacket integrity checks for washdown prep lines',
        'Automated preventive inspection schedules and contractor repair histories',
        'Manufacturer-specific electrical maintenance guidelines (Rational, Vulcan, Hobart)'
      ],
      cadence: 'Monthly Self-Check + Annual Electrical Assay',
      codeRef: 'UL 197, NFPA 70'
    },
    {
      id: 'incidents',
      icon: AlertTriangle,
      badge: 'Rapid Remediation',
      title: 'Electrical Incident Triage & Closed-Loop CAPA',
      subtitle: 'Zero Unaddressed Hazards in Kitchens',
      desc: 'Standardized digital incident intake, severity classification, root-cause investigation, and licensed electrical contractor remediation workflow with verified photo sign-offs.',
      deliverables: [
        'Instant mobile logging for breaker trips, burning odors, water spray ingress, or shocks',
        'Automated notification to District Managers and Master Electrical Contractors',
        'Structured Corrective and Preventive Action (CAPA) tracking with strict SLA deadlines',
        'Mandatory post-remediation photographic proof before case sign-off',
        'OSHA 301 log-ready compliance export and trend analytics'
      ],
      cadence: 'Immediate 24/7 Hotline & Mobile Portal',
      codeRef: 'OSHA 1904, NFPA 70E'
    },
    {
      id: 'reviews',
      icon: CalendarCheck2,
      badge: 'Underwriting & Licensing',
      title: 'Annual Electrical Readiness Reviews',
      subtitle: 'Insurance Premium Reductions & Municipal Authority Proof',
      desc: 'Comprehensive annual compliance evaluations aggregating all past assessments, equipment logs, and manager certifications into an authoritative readiness dossier for insurance underwriters and municipal AHJs.',
      deliverables: [
        'Executive Electrical Readiness Score (Compliant, Needs Attention, Non-Compliant)',
        'Portfolio-wide risk benchmark comparing unit performance across brands',
        'Underwriter-ready Loss Control Compliance Dossier',
        'Automated multi-channel expiration alerts (30, 14, 7, and 1 day prior to review)',
        'Official signed Annual Certificate of Electrical Readiness with verification QR code'
      ],
      cadence: 'Annual Recertification Cycle',
      codeRef: 'Commercial Property & Casualty Underwriting Standards'
    },
    {
      id: 'cresm',
      icon: GraduationCap,
      badge: 'Workforce Enablement',
      title: 'Certified Restaurant Electrical Safety Manager (CRESM)',
      subtitle: 'Empowering Restaurant General Managers',
      desc: 'The nationally recognized professional certification curriculum training restaurant operators, general managers, and culinary leaders to recognize, prevent, and manage electrical hazards in daily service.',
      deliverables: [
        'Four self-paced, interactive online modules with kitchen-realistic simulations',
        'Proctored digital examination engine with immediate scoring and review rationales',
        'Cryptographically secured digital certificates with public verification QR codes',
        'Physical wallet card & laminated kitchen safety reference checklist',
        'Biennial continuing education and recertification tracking'
      ],
      cadence: '2-Year Credential Lifecycle',
      codeRef: 'ANSI/ASTM Aligned Hospitality Safety Framework'
    }
  ];

  const currentSvc = services.find(s => s.id === activeTab) || services[0];
  const CurrentIcon = currentSvc.icon;

  const tiers = [
    {
      name: 'Single Location Operator',
      units: '1 – 3 Locations',
      price: '$149',
      period: 'per location / month',
      desc: 'Essential electrical documentation, digital panel schedules, and bi-annual assessment tooling for independent dining and single-unit franchise owners.',
      features: [
        'Full Digital Panel Schedules & Single-Line Twins',
        'Equipment inventory (up to 30 appliances)',
        'Bi-annual self-inspection checklist',
        '2 CRESM manager certification vouchers',
        'Emergency incident reporting portal',
        'Exportable compliance certificates'
      ],
      cta: 'Start Location Audit',
      popular: false
    },
    {
      name: 'Multi-Unit Enterprise',
      units: '4 – 25 Locations',
      price: '$249',
      period: 'per location / month',
      desc: 'Full enterprise safety governance with certified on-site assessor visits, closed-loop CAPA workflows, and insurance underwriter readiness dossiers.',
      features: [
        'Everything in Single Operator, plus:',
        'Annual on-site certified assessor inspection included',
        'Unlimited CRESM manager certifications & LMS access',
        'Closed-loop CAPA with licensed contractor assignment',
        'Automated insurance loss control audit reports',
        'Real-time multi-unit dashboard with readiness scoring',
        'Dedicated corporate compliance officer'
      ],
      cta: 'Schedule Enterprise Demo',
      popular: true
    },
    {
      name: 'National Franchise Network',
      units: '25+ Locations',
      price: 'Custom',
      period: 'tailored portfolio SLA',
      desc: 'Centralized electrical risk management for national restaurant chains, franchisors, and institutional foodservice hospitality groups.',
      features: [
        'Everything in Multi-Unit, plus:',
        'Dedicated enterprise API & CMMS integration',
        'National certified assessor network dispatching',
        'Custom corporate checklist templates & brand standards',
        'Quarterly executive compliance briefing with Chief Engineer',
        'Direct underwriter rate negotiation assistance',
        'Custom SSO (SAML/Okta) & RBAC permission controls'
      ],
      cta: 'Contact Corporate Advisory',
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Full-Spectrum Electrical Governance Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 tracking-tight leading-tight">
          Comprehensive Safety Services for Foodservice Portfolios.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          From single restaurant branches to multinational hospitality enterprises, REA unifies electrical inspections, equipment documentation, incident resolution, and manager training into one authoritative standard.
        </p>
      </div>

      {/* Interactive Service Navigator */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Service Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {services.map((svc) => {
            const Icon = svc.icon;
            const active = svc.id === activeTab;
            return (
              <button
                key={svc.id}
                onClick={() => setActiveTab(svc.id)}
                className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition border ${
                  active
                    ? 'bg-brand-900 text-white border-brand-900 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${active ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className="text-xs font-bold leading-snug">{svc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Service Deep Dive Card */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CurrentIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  {currentSvc.badge}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentSvc.title}</h3>
                <span className="text-xs text-slate-500 font-medium">{currentSvc.subtitle}</span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-400 block font-semibold uppercase">Inspection Cadence</span>
              <span className="text-sm font-bold text-slate-800">{currentSvc.cadence}</span>
              <span className="text-[11px] font-mono text-emerald-700 block mt-0.5">Code: {currentSvc.codeRef}</span>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {currentSvc.desc}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key Technical Deliverables & Protocols:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSvc.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Available across all licensed restaurant groups with real-time PDF generation.
            </span>
            <Link
              to="/dashboard"
              className="bg-brand-900 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
            >
              <span>Explore in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Enterprise Service Plans / Pricing Table */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Portfolio Plans
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Safety Governance Scaled for Every Organization
          </h2>
          <p className="text-sm text-slate-600">
            Predictable monthly subscriptions with zero hidden licensing fees. Protect your brand reputation, reduce equipment downtime, and satisfy insurance underwriters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 border flex flex-col justify-between space-y-6 relative ${
                tier.popular
                  ? 'bg-white border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Most Popular For Restaurant Groups
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <span className="text-xs font-semibold text-emerald-700 block">{tier.units}</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {tier.period}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {tier.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Included Capabilities
                  </span>
                  {tier.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className={`w-full py-3 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-2 ${
                  tier.popular
                    ? 'bg-brand-900 hover:bg-brand-800 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Proven ROI Callout */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="text-3xl font-extrabold text-emerald-400">18.4%</div>
          <h4 className="text-sm font-bold text-slate-200">Insurance Premium Savings</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Leading property and casualty underwriters offer premium credits for locations with verified CRESM managers and annual REA readiness dossiers.
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-extrabold text-emerald-400">72%</div>
          <h4 className="text-sm font-bold text-slate-200">Faster AHJ Inspection Sign-off</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Municipal electrical and health inspectors approve digital panel directories and clearance logs without issuing costly reinspection citations.
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-extrabold text-emerald-400">&lt; 24h</div>
          <h4 className="text-sm font-bold text-slate-200">Average Critical CAPA Resolution</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hazardous open knockouts, damaged GFCI in-use covers, and blocked panels are resolved and verified with photographic closure within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}