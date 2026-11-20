import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Cpu,
  AlertTriangle,
  GraduationCap,
  CalendarCheck2,
  ArrowRight,
  Building,
  Award,
  Users,
  Check,
  X,
  FileText,
  Activity,
  Layers,
  BarChart3,
  RefreshCw,
  Calendar,
  ChevronDown,
  HelpCircle,
  Send
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function HomePage() {
  const { addToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);

  // Quick Assessment Inquiry Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    facilityCount: '1-5',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  // 6 Core Services matching Image 4
  const services = [
    {
      icon: ClipboardCheck,
      title: 'Electrical Site Assessments',
      desc: 'Conduct structured assessments and track electrical readiness.',
      path: '/services'
    },
    {
      icon: Cpu,
      title: 'Equipment Documentation',
      desc: 'Maintain detailed records of electrical equipment and their status.',
      path: '/services'
    },
    {
      icon: Zap,
      title: 'Electrical Panel Documentation',
      desc: 'Manage panel information, specifications and supporting documents.',
      path: '/services'
    },
    {
      icon: AlertTriangle,
      title: 'Incident Reporting',
      desc: 'Report, investigate and resolve electrical incidents with full tracking.',
      path: '/services'
    },
    {
      icon: CalendarCheck2,
      title: 'Annual Reviews',
      desc: 'Schedule and manage recurring electrical readiness reviews.',
      path: '/services'
    },
    {
      icon: GraduationCap,
      title: 'Manager Certification',
      desc: 'A structured certification program for restaurant managers.',
      path: '/certification'
    }
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Facility Digital Onboarding',
      desc: 'Upload breaker schedules, register heavy cookline assets, and assign CRESM-trained kitchen managers.'
    },
    {
      num: '02',
      title: 'Standardized Site Audit',
      desc: 'Licensed electrical inspectors execute physical 36-point evaluations capturing thermal scans and clearance measurements.'
    },
    {
      num: '03',
      title: 'Defect Triage & Remediation',
      desc: 'Hazards automatically spawn corrective action tickets with SLA countdowns and licensed contractor sign-offs.'
    },
    {
      num: '04',
      title: 'Annual Readiness Certification',
      desc: 'Generate executive underwriting dossiers verifying life safety compliance under NEC 110.26 and NFPA 70E.'
    }
  ];

  const operatorBenefits = [
    {
      title: 'Eliminate Catastrophic Kitchen Fires',
      desc: 'Over 60% of commercial kitchen electrical fires originate from blocked working clearances or uninspected high-draw appliances. REA eliminates these risks proactively.'
    },
    {
      title: 'Reduce Insurance Loss Premiums',
      desc: 'Commercial property and casualty underwriters offer premium credits up to 18% for restaurant groups with verified CRESM managers and annual audit dossiers.'
    },
    {
      title: 'Prevent Unplanned Service Downtime',
      desc: 'Detect overheating breaker lugs and nuisance trip causes during scheduled thermal scans before they shut down dinner service.'
    },
    {
      title: 'Accelerate Health & AHJ Approvals',
      desc: 'Municipal inspectors instantly approve clear digital panel directories and verified clearance boundaries without issuing costly re-inspection notices.'
    }
  ];

  const faqs = [
    {
      q: 'What is the Restaurant Electrical Authority (REA)?',
      a: 'REA is the premier electrical safety, compliance, and readiness SaaS platform purpose-built for commercial food service operations. We standardize panel documentation, field site assessments, and general manager certification across restaurant portfolios.'
    },
    {
      q: 'What does the NEC 110.26 36-inch clearance rule require in kitchens?',
      a: 'National Electrical Code Section 110.26 and OSHA 1910.303 mandate that a clear, unobstructed working space of at least 36 inches in depth, 30 inches in width, and 6.5 feet in height be permanently maintained in front of all electrical panels and disconnect switches. REA enforces this with photo logs and automated staff reminders.'
    },
    {
      q: 'What is the CRESM Manager Certification program?',
      a: 'The Certified Restaurant Electrical Safety Manager (CRESM) credential is a standardized technical curriculum designed for restaurant general managers, kitchen supervisors, and culinary directors. It trains managers to recognize kitchen electrical hazards, enforce working clearances, and manage breaker trips safely.'
    },
    {
      q: 'How does REA support insurance loss control audits?',
      a: 'REA compiles all digital panel schedules, periodic site assessments, equipment thermal scan logs, and manager certifications into a standardized Annual Readiness Dossier that can be exported as a signed PDF for insurance underwriters and municipal licensing boards.'
    },
    {
      q: 'How does a restaurant organization get started with REA?',
      a: 'Restaurant organizations can request an assessment through our portal. An authorized compliance specialist will assist in establishing your multi-unit account, importing panel directories, and scheduling initial site evaluations.'
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      const res = await api.submitContact({
        name: contactForm.name,
        email: contactForm.email,
        organization: contactForm.organization,
        subject: `Assessment Request (${contactForm.facilityCount} Facilities)`,
        message: contactForm.message || 'Requested enterprise electrical site assessment and readiness evaluation.'
      });
      if (res.success) {
        addToast('Assessment request submitted! An REA compliance engineer will contact you.');
        setContactForm({ name: '', email: '', organization: '', facilityCount: '1-5', message: '' });
      }
    } catch (err) {
      addToast(err.message || 'Submission error', 'error');
    } finally {
      setSubmittingContact(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 bg-[#F7F7F7] text-[#111111]">
      {/* 1. HERO SECTION (Exactly Matching Image 4) */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E5E5] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#111111] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <span>Electrical Safety & Compliance for Restaurants</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#111111] tracking-tight leading-[1.12]">
              Building Safer, More<br />
              Electrically Ready<br />
              Restaurants.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-lg">
              A complete platform for electrical assessments, equipment documentation, incident reporting, annual reviews and manager certification.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-xs transition"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#request-assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5F5F5] text-[#111111] border border-[#E5E5E5] px-6 py-3 rounded-lg text-sm font-semibold transition"
              >
                <Calendar className="w-4 h-4 text-[#111111]" />
                <span>Request an Assessment</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual with Inspector & Diagonal Mask (Matching Image 4) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm">
              <img
                src="/hero-inspector.jpg"
                alt="REA Commercial Kitchen Electrical Inspector with Tablet"
                className="w-full h-auto object-cover max-h-[380px]"
                style={{
                  clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 0% 100%)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIVE-COLUMN TRUST BAR (Matching Image 4) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center">
            {/* Column 1 */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#111111]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#111111] leading-tight">
                Improve<br />Electrical Safety
              </span>
            </div>

            {/* Column 2 */}
            <div className="flex items-center gap-3 md:border-l md:border-[#E5E5E5] md:pl-4">
              <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] shrink-0">
                <Layers className="w-5 h-5 text-[#111111]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#111111] leading-tight">
                Centralized<br />Documentation
              </span>
            </div>

            {/* Column 3 */}
            <div className="flex items-center gap-3 md:border-l md:border-[#E5E5E5] md:pl-4">
              <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] shrink-0">
                <BarChart3 className="w-5 h-5 text-[#111111]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#111111] leading-tight">
                Track & Manage<br />Readiness
              </span>
            </div>

            {/* Column 4 */}
            <div className="flex items-center gap-3 md:border-l md:border-[#E5E5E5] md:pl-4">
              <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] shrink-0">
                <Award className="w-5 h-5 text-[#111111]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#111111] leading-tight">
                Manager<br />Certification
              </span>
            </div>

            {/* Column 5 */}
            <div className="flex items-center gap-3 md:border-l md:border-[#E5E5E5] md:pl-4">
              <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] shrink-0">
                <RefreshCw className="w-5 h-5 text-[#111111]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#111111] leading-tight">
                Ongoing<br />Compliance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES SECTION (Matching Image 4) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
            OUR SERVICES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Comprehensive Electrical Readiness Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            End-to-end tools and services to help restaurant organizations maintain safe, compliant and well-documented electrical operations.
          </p>
        </div>

        {/* 6 Service Cards Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <Link
                key={idx}
                to={svc.path}
                className="group bg-white rounded-xl p-6 border border-[#E5E5E5] shadow-xs hover:border-[#111111] transition flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Square Black Icon Badge */}
                  <div className="w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#111111] group-hover:text-black transition">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Right Circle Arrow */}
                <div className="flex justify-end pt-2">
                  <div className="w-8 h-8 rounded-full border border-[#E5E5E5] group-hover:border-[#111111] group-hover:bg-[#111111] group-hover:text-white text-[#111111] flex items-center justify-center transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. PROCESS WORKFLOW SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
            METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
            How the REA Operational Process Works
          </h2>
          <p className="text-xs sm:text-sm text-[#666666]">
            A closed-loop operational workflow engineered to satisfy municipal inspectors, OSHA rules, and insurance carriers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {processSteps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-[#E5E5E5] shadow-xs space-y-3">
              <span className="text-3xl font-black text-[#111111]/20 font-mono block">
                {step.num}
              </span>
              <h4 className="text-sm font-bold text-[#111111]">{step.title}</h4>
              <p className="text-xs text-[#666666] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. OPERATOR VALUE / BENEFITS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
              OPERATIONAL ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
              Why Restaurant Groups Partner with REA
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Measurable safety metrics, insurance loss prevention, and automated compliance tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E5E5]">
            {operatorBenefits.map((b, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">{b.title}</h4>
                  <p className="text-xs text-[#666666] mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ASSESSMENT REQUEST FORM */}
      <section id="request-assessment" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="bg-[#111111] text-white rounded-2xl p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#999999]">
                GET STARTED TODAY
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Request an Electrical Site Assessment for Your Restaurants.
              </h2>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                Connect with an REA compliance specialist to audit your commercial kitchen facilities, document breaker panels, and schedule manager certifications.
              </p>
              <div className="pt-2 space-y-2 text-xs text-[#AAAAAA]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Licensed commercial electrical inspection methodology</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>36-inch clearance verification & photo logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Turnkey insurance compliance dossier export</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-[#111111] rounded-xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. marcus@dinegroup.com"
                      className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Restaurant Organization</label>
                    <input
                      type="text"
                      required
                      value={contactForm.organization}
                      onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                      placeholder="e.g. Apex Hospitality Group"
                      className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Number of Facilities</label>
                    <select
                      value={contactForm.facilityCount}
                      onChange={(e) => setContactForm({ ...contactForm, facilityCount: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    >
                      <option value="1-5">1 – 5 Locations</option>
                      <option value="6-20">6 – 20 Locations</option>
                      <option value="21-50">21 – 50 Locations</option>
                      <option value="50+">50+ Locations (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Notes / Specific Requirements</label>
                  <textarea
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your upcoming inspection, panel upgrade, or manager certification goals..."
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full py-3 bg-[#111111] hover:bg-black text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingContact ? 'Submitting...' : 'Submit Assessment Request'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
            COMMON QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex justify-between items-center text-xs sm:text-sm font-semibold text-[#111111] hover:bg-[#FAFAFA]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#666666] transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[#111111]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-[#666666] leading-relaxed border-t border-[#F0F0F0] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
