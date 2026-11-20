import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  QrCode,
  ArrowRight
} from 'lucide-react';

export default function CertificationPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [sampleAnswer, setSampleAnswer] = useState(null);

  const modules = [
    {
      num: '01',
      title: 'Commercial Kitchen Electrical Fundamentals & Moisture Dynamics',
      hours: '3 Hours • Self-Paced',
      desc: 'Understand the physical principles of 120/208V and 480V 3-phase electrical distribution in commercial kitchen environments, where water, grease aerosols, and heat combine to create extreme shock and fire hazards.',
      topics: [
        'How electricity interacts with high-pressure washdown water & conductive stainless steel surfaces',
        'Single-phase vs. Three-phase restaurant distribution circuits (120V, 208V, 240V, 480V)',
        'NEMA enclosure ratings for washdown areas (NEMA 3R, 4X rain-tight vs. standard dry enclosures)',
        'Understanding circuit overcurrent, short circuits, and arc flash danger zones'
      ]
    },
    {
      num: '02',
      title: 'NEC Article 110.26 Working Space & Electrical Panel Clearances',
      hours: '3 Hours • Self-Paced',
      desc: 'Master the non-negotiable working space mandates enforced by OSHA 1910.303 and National Electrical Code Section 110.26, ensuring Main Distribution Panels remain unobstructed during emergencies.',
      topics: [
        'The 36-Inch Rule: Measuring clear working depth, 30-inch width, and 6.5-foot headroom',
        'Recognizing prohibited storage in front of panels (dry stock boxes, prep carts, linen bins)',
        'Panel deadfront integrity: Identifying missing filler plates and exposed live bus bars',
        'Creating and maintaining legible circuit-to-appliance load directories'
      ]
    },
    {
      num: '03',
      title: 'Commercial GFCI Testing, Wet Locations & Ansul Interlocks',
      hours: '4 Hours • Self-Paced',
      desc: 'Field verification procedures for Class A Ground-Fault Circuit-Interrupters (GFCI) and the vital electrical interlocks connecting commercial kitchen exhaust hoods to the Ansul fire suppression system.',
      topics: [
        'Monthly GFCI testing protocol: Using calibrated testers to verify sub-25ms trip response',
        'Distinguishing between equipment leakage (GFPE 30mA) and personnel protection (GFCI 4-6mA)',
        'Commercial exhaust hood interlocks: How shunt-trip circuit breakers kill fuel & power',
        'Emergency Power Off (EPO) button procedures and generator transfer switch safety'
      ]
    },
    {
      num: '04',
      title: 'Incident Response, NFPA 70E Boundaries & Contractor Oversight',
      hours: '4 Hours • Self-Paced',
      desc: 'Operational management of electrical anomalies, burning odors, breaker trips, and safely supervising licensed electrical contractors performing maintenance in active kitchens.',
      topics: [
        'Immediate triage protocols: Safe power disconnection without entering arc flash boundaries',
        'OSHA 301 electrical incident logging and root-cause analysis documentation',
        'Lockout/Tagout (LOTO) verification: Ensuring contracted technicians de-energize properly',
        'Reviewing electrician certificates of insurance (COI) and municipal permits'
      ]
    }
  ];

  const sampleExamQuestion = {
    q: 'During an evening dinner rush, the circuit breaker supplying the main cookline combi oven trips. What is the correct immediate action for a CRESM-certified General Manager?',
    options: [
      { id: 'A', text: 'Immediately reset the breaker repeatedly until the combi oven turns back on.', correct: false, rationale: 'Repeatedly resetting a tripped high-amperage breaker into an active fault can cause a catastrophic arc flash explosion.' },
      { id: 'B', text: 'Inspect the appliance cord, plug, and receptacle for scorching or water ingress before attempting ONE cautious reset; if it trips again, lock it out and call a licensed electrician.', correct: true, rationale: 'Correct! CRESM protocol allows at most ONE informed reset only after verifying no burning odor or visible damage exists. Recurring trips indicate a dangerous internal short circuit.' },
      { id: 'C', text: 'Prop a wooden wedge against the breaker handle to prevent it from tripping during service.', correct: false, rationale: 'Propping or taping a breaker is a felony-level life safety violation that overrides thermal overcurrent protection.' },
      { id: 'D', text: 'Plug the 480V combi oven into an adjacent 120V convenience outlet using an extension cord.', correct: false, rationale: 'Voltage and phase mismatch will instantly destroy equipment and poses severe electrocution risks.' }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>The National Hospitality Safety Standard</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 tracking-tight leading-tight">
          Certified Restaurant Electrical Safety Manager (CRESM)
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          The credential that elevates restaurant general managers into front-line electrical safety officers. Protect your kitchen staff, maintain zero electrical downtime, and satisfy corporate loss prevention standards.
        </p>
      </div>

      {/* Credential Overview Card */}
      <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs bg-white/10 px-3 py-1 rounded-full">
            Industry Credential
          </span>
          <h2 className="text-3xl font-bold tracking-tight">
            Why Every High-Volume Commercial Kitchen Needs a Certified CRESM On-Duty.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            General managers are trained extensively in foodborne illness (ServSafe) and alcohol service (TIPS), yet commercial kitchens draw tens of thousands of watts of electrical energy daily without formal manager training.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The CRESM credential bridges this dangerous knowledge gap, providing managers with the practical, non-engineering skills needed to enforce 36-inch clearances, verify GFCI protection, safely handle breaker trips, and communicate with licensed electricians.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <Link
              to="/certifications"
              className="bg-emerald-500 hover:bg-emerald-400 text-brand-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-md flex items-center gap-2"
            >
              <span>Enroll in CRESM Program</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/verify"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl text-sm transition border border-white/20 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify a Credential</span>
            </Link>
          </div>
        </div>

        {/* Visual Credential Preview Card */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-2xl border-4 border-emerald-600/40 relative">
            <div className="border border-emerald-800/20 p-5 rounded-xl space-y-4 certificate-pattern">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-brand-900 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-900 block leading-tight">REA NATIONAL BOARD</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Official Credential</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  CRESM #88492
                </span>
              </div>

              <div className="text-center py-3 border-y border-slate-100 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Certified Professional</span>
                <div className="text-lg font-extrabold text-slate-900">Elena Rostova</div>
                <span className="text-xs text-emerald-700 font-semibold block">General Manager • Downtown Flagship</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Issued Date</span>
                  <span className="font-bold text-slate-800">Jan 15, 2026</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Valid Through</span>
                  <span className="font-bold text-emerald-700">Jan 15, 2028</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                <span>Cryptographically Signed</span>
                <span className="font-mono text-emerald-800 font-bold">VERIFIED AUTHENTIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Breakdown */}
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Training Syllabus
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Four-Module Curriculum
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            14 total hours of targeted training combining video walkthroughs, commercial kitchen blueprints, interactive hazard hunting, and practical manager checklists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((mod) => (
            <div key={mod.num} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6 hover:border-emerald-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-brand-900 font-mono">{mod.num}</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {mod.hours}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{mod.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Learning Objectives:
                  </span>
                  {mod.topics.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Exam Simulation Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-100/70 px-3 py-1 rounded-full">
              Interactive Exam Simulator Preview
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">Sample CRESM Examination Scenario</h3>
            <p className="text-xs text-slate-500">Test your electrical compliance decision making:</p>
          </div>
          <span className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700">
            Passing Threshold: 80% (48 / 60)
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {sampleExamQuestion.q}
          </p>

          <div className="space-y-3">
            {sampleExamQuestion.options.map((opt) => {
              const selected = sampleAnswer === opt.id;
              let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
              if (sampleAnswer) {
                if (opt.correct) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                } else if (selected && !opt.correct) {
                  style = 'bg-rose-50 border-rose-400 text-rose-900';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => setSampleAnswer(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs transition flex items-start gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white border font-bold flex items-center justify-center shrink-0">
                    {opt.id}
                  </span>
                  <div className="flex-1">
                    <span>{opt.text}</span>
                    {sampleAnswer && (
                      <span className="block mt-2 text-[11px] font-medium opacity-90">
                        <strong>Rationale:</strong> {opt.rationale}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {sampleAnswer && (
            <div className="pt-2 text-right">
              <button
                onClick={() => setSampleAnswer(null)}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Reset Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recertification & Governance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">2-Year Validity Lifecycle</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Certifications remain active for 24 months. Renewal requires 4 hours of continuing education covering updated NEC code cycles and new equipment safety advisories.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Tamper-Proof Verification</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Each digital certificate is linked to an immutable hash. Municipal health inspectors and insurance auditors can scan the QR code to verify credentials live.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Enterprise LMS Integration</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Restaurant groups can batch enroll general managers, monitor module completion progress, and track renewal deadlines across hundreds of locations.
          </p>
        </div>
      </div>
    </div>
  );
}