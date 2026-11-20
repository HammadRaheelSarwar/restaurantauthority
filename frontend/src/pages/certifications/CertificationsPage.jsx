import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  AlertCircle,
  ShieldCheck,
  Send,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Search,
  Filter,
  Download,
  Eye,
  Flag,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Building,
  User,
  Briefcase,
  FileCheck,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import DataTable from '../../components/ui/DataTable';

export default function CertificationsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('programs'); // 'programs', 'wizard', 'courses', 'exam', 'certificates'
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  // 6-Step Application Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedProgramForApp, setSelectedProgramForApp] = useState(null);
  const [wizardData, setWizardData] = useState({
    fullName: user?.name || 'Chef Marcus Vance',
    email: user?.email || 'marcus.vance@apexhospitality.com',
    phone: '+1 (555) 392-8819',
    position: 'Executive Kitchen Director',
    yearsExperience: '12',
    organizationName: 'Apex Hospitality Group',
    primaryLocation: 'Downtown Flagship (Facility #NYC-01)',
    priorCertifications: 'ServSafe Manager, OSHA 10-Hour General Industry',
    declarationAccepted: false,
    prerequisiteConfirmed: true
  });

  // Proctored Exam State
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [examResult, setExamResult] = useState(null);
  const [examTimeLeft, setExamTimeLeft] = useState(45 * 60);
  const [examActive, setExamActive] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Selected Certificate Detail Modal
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (examActive && !examSubmitted && examTimeLeft > 0) {
      timer = setInterval(() => setExamTimeLeft((prev) => prev - 1), 1000);
    } else if (examTimeLeft === 0 && examActive && !examSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [examActive, examTimeLeft, examSubmitted]);

  const loadAll = async () => {
    try {
      const [progRes, appRes, certRes, courseRes] = await Promise.all([
        api.getPrograms(),
        api.getApplications(),
        api.getCertificates(),
        api.getCourses()
      ]);

      if (progRes.success) setPrograms(progRes.data || []);
      if (appRes.success) setApplications(appRes.data || []);
      if (certRes.success) setCertificates(certRes.data || []);
      if (courseRes.success) {
        setCourses(courseRes.data || []);
        if (courseRes.data?.[0]?.modules?.[0]) {
          setSelectedModule(courseRes.data[0].modules[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartWizard = (prog) => {
    setSelectedProgramForApp(prog);
    setWizardStep(1);
    setActiveTab('wizard');
  };

  const handleSubmitWizard = async () => {
    if (!wizardData.declarationAccepted) {
      addToast('Please confirm your professional compliance declarations.', 'error');
      return;
    }
    try {
      const res = await api.applyForCertification(selectedProgramForApp?.id || 'pppppppp-pppp-pppp-pppp-pppppppppppp');
      if (res.success) {
        addToast('Application submitted successfully! Prerequisite evaluation verified.');
        loadAll();
        setActiveTab('courses');
      }
    } catch (err) {
      addToast(err.message || 'Application error', 'error');
    }
  };

  const handleStartExam = async () => {
    try {
      const res = await api.getExam('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');
      if (res.success) {
        setExam(res.data);
        setUserAnswers({});
        setFlaggedQuestions({});
        setCurrentQuestionIndex(0);
        setExamTimeLeft(45 * 60);
        setExamActive(true);
        setExamSubmitted(false);
        setExamResult(null);
        setActiveTab('exam');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSelectAnswer = (qId, optionIdx) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleToggleFlag = (qId) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExam = async () => {
    setExamSubmitted(true);
    setExamActive(false);

    // Calculate score
    const questions = exam?.questions || [];
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_option) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / (questions.length || 1)) * 100);
    const passed = calculatedScore >= (exam?.passing_score || 80);

    const result = {
      score: calculatedScore,
      passed,
      correctCount: correct,
      totalCount: questions.length,
      credentialId: passed ? `CRESM-2026-${Math.floor(1000 + Math.random() * 9000)}` : null
    };

    setExamResult(result);

    try {
      await api.submitExam(exam.id, userAnswers);
      if (passed) {
        addToast(`Congratulations! You passed with ${calculatedScore}%. Certificate issued.`);
        loadAll();
      } else {
        addToast(`Exam complete: ${calculatedScore}%. Minimum 80% required to pass.`, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const certificateColumns = [
    {
      header: 'Certificate ID',
      accessorKey: 'certificate_number',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-[#146B45]">
          {row.certificate_number}
        </span>
      )
    },
    {
      header: 'Credential Program',
      accessorKey: 'program_title',
      cell: (row) => (
        <div>
          <div className="font-semibold text-xs text-[#17231D]">{row.program_title || 'Certified Restaurant Electrical Safety Manager (CRESM)'}</div>
          <div className="text-[11px] text-[#66736B]">Standard: NFPA 70E & NEC 110.26</div>
        </div>
      )
    },
    {
      header: 'Recipient',
      accessorKey: 'recipient_name',
      cell: (row) => (
        <div className="text-xs font-medium text-[#17231D]">{row.recipient_name || user?.name || 'Elena Rostova'}</div>
      )
    },
    {
      header: 'Issue Date',
      accessorKey: 'issued_at',
      cell: (row) => (
        <span className="text-xs text-[#66736B]">{row.issued_at ? row.issued_at.split('T')[0] : '2026-02-15'}</span>
      )
    },
    {
      header: 'Expiration',
      accessorKey: 'expires_at',
      cell: (row) => (
        <span className="text-xs text-[#66736B]">{row.expires_at ? row.expires_at.split('T')[0] : '2028-02-15'}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status || 'valid'} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCert(row)}
            className="p-1.5 hover:bg-[#EAF5EF] text-[#146B45] rounded-md transition"
            title="Inspect Digital Credential"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={`/verify-certificate?id=${row.certificate_number || 'CRESM-2026-8819'}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 hover:bg-[#F1F5F2] text-[#66736B] rounded-md transition"
            title="Public Verification"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF5EF] text-[#146B45]">
              Accredited LMS & Exam Engine
            </span>
            <span className="text-xs text-[#66736B]">• Standard: NFPA 70E / NEC 2026</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
            Manager Certification & Training Portal
          </h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Credentialing food service leadership in commercial electrical readiness, hazard triage, and NFPA compliance.
          </p>
        </div>

        {/* Global Tab Navigator */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-xl border border-[#E6ECE8] text-xs font-semibold">
          {[
            { id: 'programs', label: 'Programs', icon: Award },
            { id: 'courses', label: 'LMS Modules', icon: BookOpen },
            { id: 'exam', label: 'Examination', icon: FileCheck },
            { id: 'certificates', label: 'Credentials', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#146B45] shadow-xs'
                    : 'text-[#66736B] hover:text-[#17231D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#146B45]' : 'text-[#66736B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Accredited Tracks"
          value={programs.length || 3}
          trendLabel="CRESM, CETA & CESS Tracks"
          trend="neutral"
        />
        <StatCard
          icon={FileText}
          label="Active Applications"
          value={applications.length || 4}
          trendLabel="2 Under Review"
          trend="up"
        />
        <StatCard
          icon={CheckCircle2}
          label="Certified Managers"
          value={certificates.length || 18}
          trendLabel="94.2% First-time Pass Rate"
          trend="up"
        />
        <StatCard
          icon={ShieldCheck}
          label="Credential Expiration Buffer"
          value="24 Mos"
          trendLabel="Bi-annual renewal required"
          trend="neutral"
        />
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PROGRAMS DIRECTORY & APPLICATION LAUNCHER         */}
      {/* ========================================================= */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-6 shadow-xs flex flex-col justify-between hover:border-[#29A36A]/50 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF5EF] text-[#146B45]">
                      {prog.validity_years || 2} Years Validity
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#17231D]">{prog.title}</h3>
                    <p className="text-xs text-[#66736B] mt-1.5 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E6ECE8] space-y-2 text-xs">
                    <div className="flex justify-between text-[#66736B]">
                      <span>Exam Passing Threshold</span>
                      <span className="font-bold text-[#17231D]">{prog.passing_score || 80}%</span>
                    </div>
                    <div className="flex justify-between text-[#66736B]">
                      <span>Accredited Standards</span>
                      <span className="font-mono text-[11px] text-[#146B45] font-semibold">NFPA 70E / NEC 110.26</span>
                    </div>
                    <div className="flex justify-between text-[#66736B]">
                      <span>Curriculum Duration</span>
                      <span className="font-bold text-[#17231D]">4 Modules (4.5 Hrs)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E6ECE8] mt-6 flex items-center gap-3">
                  <button
                    onClick={() => handleStartWizard(prog)}
                    className="flex-1 bg-[#146B45] hover:bg-[#104B35] text-[#FFFFFF] font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition shadow-xs"
                  >
                    <span>Apply for Certification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="p-2.5 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs transition"
                    title="Preview Syllabus"
                  >
                    <BookOpen className="w-4 h-4 text-[#66736B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Corporate Certification Governance Notice */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-5 flex items-start gap-4 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-[#EAF5EF] text-[#146B45] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-[#17231D]">Enterprise Multi-Unit Certification Policy</h4>
              <p className="text-[#66736B] leading-relaxed">
                Under the Restaurant Electrical Authority National Safety Code, high-throughput food service establishments with cooklines exceeding 150A total service must maintain at least one on-duty CRESM-certified kitchen supervisor per operational shift.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GUIDED 6-STEP APPLICATION WIZARD                  */}
      {/* ========================================================= */}
      {activeTab === 'wizard' && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] shadow-xs overflow-hidden">
          {/* Wizard Header Bar */}
          <div className="bg-[#F7F9F8] p-6 border-b border-[#E6ECE8] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#146B45]">
                Official Credential Application Form
              </span>
              <h2 className="text-lg font-bold text-[#17231D] mt-0.5">
                {selectedProgramForApp?.title || 'Certified Restaurant Electrical Safety Manager (CRESM)'}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#66736B]">
              <span>Step {wizardStep} of 6</span>
              <div className="w-32 bg-[#E6ECE8] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#146B45] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="px-6 py-3 border-b border-[#E6ECE8] flex items-center gap-2 overflow-x-auto text-xs">
            {[
              { num: 1, label: 'Applicant Identity' },
              { num: 2, label: 'Hospitality Background' },
              { num: 3, label: 'Facility Assignment' },
              { num: 4, label: 'Safety History' },
              { num: 5, label: 'Code Declarations' },
              { num: 6, label: 'Submit & Verification' }
            ].map((st) => (
              <div
                key={st.num}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  wizardStep === st.num
                    ? 'bg-[#EAF5EF] text-[#146B45] font-bold border border-[#29A36A]/30'
                    : wizardStep > st.num
                    ? 'text-[#16834A] font-medium'
                    : 'text-[#66736B]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    wizardStep === st.num
                      ? 'bg-[#146B45] text-white'
                      : wizardStep > st.num
                      ? 'bg-[#16834A] text-white'
                      : 'bg-[#E6ECE8] text-[#66736B]'
                  }`}
                >
                  {wizardStep > st.num ? '✓' : st.num}
                </span>
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="p-8 max-w-3xl">
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#17231D] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#146B45]" />
                  <span>Applicant Personal & Direct Contact Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={wizardData.fullName}
                      onChange={(e) => setWizardData({ ...wizardData, fullName: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Corporate Email Address</label>
                    <input
                      type="email"
                      value={wizardData.email}
                      onChange={(e) => setWizardData({ ...wizardData, email: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Direct Phone Number</label>
                    <input
                      type="text"
                      value={wizardData.phone}
                      onChange={(e) => setWizardData({ ...wizardData, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Current Job Title</label>
                    <input
                      type="text"
                      value={wizardData.position}
                      onChange={(e) => setWizardData({ ...wizardData, position: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#17231D] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#146B45]" />
                  <span>Hospitality & Kitchen Operational Experience</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Years in Commercial Food Service</label>
                    <input
                      type="number"
                      value={wizardData.yearsExperience}
                      onChange={(e) => setWizardData({ ...wizardData, yearsExperience: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Primary Cookline Type</label>
                    <select className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]">
                      <option>Heavy All-Electric (Combi ovens, deep fryers, induction)</option>
                      <option>Mixed Natural Gas & 3-Phase Electric</option>
                      <option>High-Throughput Quick Service Restaurant (QSR)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#17231D] font-medium mb-1">Prior Safety Certifications (ServSafe, OSHA, HACCP, etc.)</label>
                    <input
                      type="text"
                      value={wizardData.priorCertifications}
                      onChange={(e) => setWizardData({ ...wizardData, priorCertifications: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#17231D] flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#146B45]" />
                  <span>Restaurant Entity & Facility Assignment</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Hospitality Organization / Franchise Group</label>
                    <input
                      type="text"
                      value={wizardData.organizationName}
                      onChange={(e) => setWizardData({ ...wizardData, organizationName: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#17231D] font-medium mb-1">Primary Restaurant Location</label>
                    <input
                      type="text"
                      value={wizardData.primaryLocation}
                      onChange={(e) => setWizardData({ ...wizardData, primaryLocation: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#17231D] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#146B45]" />
                  <span>Kitchen Electrical Safety & Hazard History</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8] space-y-2">
                    <p className="text-[#17231D] font-medium">
                      Has this facility experienced any breaker tripping, water ingress near cookline outlets, or electrical downtime in the past 12 months?
                    </p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-[#66736B] cursor-pointer">
                        <input type="radio" name="incidentHistory" defaultChecked />
                        <span>No reported critical incidents</span>
                      </label>
                      <label className="flex items-center gap-2 text-[#66736B] cursor-pointer">
                        <input type="radio" name="incidentHistory" />
                        <span>Yes, documented in REA Incident Log</span>
                      </label>
                    </div>
                  </div>
                  <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8]">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wizardData.prerequisiteConfirmed}
                        onChange={(e) => setWizardData({ ...wizardData, prerequisiteConfirmed: e.target.checked })}
                        className="mt-0.5 rounded text-[#146B45] focus:ring-[#146B45]"
                      />
                      <span className="text-[#17231D] leading-snug">
                        I confirm that our restaurant maintains unrestricted 36-inch clearance around all Main Distribution Panels and breaker sub-panels under NEC 110.26.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#17231D] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#146B45]" />
                  <span>CRESM Code of Professional Responsibility</span>
                </h3>
                <div className="p-4 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8] text-xs text-[#66736B] leading-relaxed space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
                  <p>
                    1. As a Certified Restaurant Electrical Safety Manager (CRESM), I pledge to uphold life safety and prevent electrical fires by strictly adhering to NFPA 70E and NEC standards.
                  </p>
                  <p>
                    2. I will immediately shut down and red-tag any commercial appliance displaying thermal scorching, damaged SJTW cabling, or missing ground pins.
                  </p>
                  <p>
                    3. I will conduct bi-monthly GFCI trip-testing and enforce panel clearance zones against kitchen storage encroachment.
                  </p>
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs pt-2">
                  <input
                    type="checkbox"
                    checked={wizardData.declarationAccepted}
                    onChange={(e) => setWizardData({ ...wizardData, declarationAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-[#146B45] focus:ring-[#146B45]"
                  />
                  <span className="text-[#17231D] font-semibold">
                    I attest under penalty of credential revocation that all submitted information is accurate and I accept the CRESM Professional Code of Conduct.
                  </span>
                </label>
              </div>
            )}

            {wizardStep === 6 && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#17231D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#146B45]" />
                  <span>Application Summary & Final Submission</span>
                </h3>
                <div className="bg-[#F7F9F8] rounded-lg border border-[#E6ECE8] p-4 divide-y divide-[#E6ECE8]">
                  <div className="py-2 flex justify-between">
                    <span className="text-[#66736B]">Candidate Name:</span>
                    <span className="font-bold text-[#17231D]">{wizardData.fullName}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#66736B]">Target Credential:</span>
                    <span className="font-bold text-[#146B45]">Certified Restaurant Electrical Safety Manager</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#66736B]">Organization:</span>
                    <span className="font-bold text-[#17231D]">{wizardData.organizationName}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#66736B]">Facility:</span>
                    <span className="font-bold text-[#17231D]">{wizardData.primaryLocation}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#66736B]">Prerequisites Verified:</span>
                    <span className="text-[#16834A] font-bold">✓ Complete</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="mt-8 pt-4 border-t border-[#E6ECE8] flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('programs')}
                  className="px-4 py-2 text-[#66736B] hover:text-[#17231D] text-xs font-medium"
                >
                  Cancel
                </button>
              )}

              {wizardStep < 6 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2 bg-[#146B45] hover:bg-[#104B35] text-[#FFFFFF] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitWizard}
                  className="px-6 py-2.5 bg-[#146B45] hover:bg-[#104B35] text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-xs"
                >
                  <Check className="w-4 h-4 text-[#29A36A]" />
                  <span>Submit Application & Unlock Courses</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LMS TRAINING COURSE VIEWER                         */}
      {/* ========================================================= */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Selector Sidebar */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-5 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B45]">
                Curriculum Navigator
              </span>
              <h3 className="font-bold text-sm text-[#17231D] mt-0.5">
                CRESM Certification Modules
              </h3>
            </div>

            <div className="space-y-2">
              {courses[0]?.modules?.map((mod, idx) => {
                const isSelected = selectedModule?.id === mod.id;
                return (
                  <button
                    key={mod.id || idx}
                    onClick={() => setSelectedModule(mod)}
                    className={`w-full text-left p-3 rounded-lg border transition text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#EAF5EF] border-[#29A36A] text-[#146B45] font-bold'
                        : 'bg-[#FFFFFF] border-[#E6ECE8] text-[#17231D] hover:bg-[#F7F9F8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-[#146B45] text-white' : 'bg-[#F1F5F2] text-[#66736B]'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="line-clamp-1">{mod.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#66736B]" />
                  </button>
                );
              })}
            </div>

            {/* Ready for Exam Prompt */}
            <div className="p-4 bg-[#EAF5EF] rounded-xl border border-[#29A36A]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#146B45]">
                <Sparkles className="w-4 h-4 text-[#29A36A]" />
                <span>Ready for Evaluation?</span>
              </div>
              <p className="text-[11px] text-[#66736B] leading-relaxed">
                Once you finish studying all four modules, launch the 45-minute timed exam to earn your CRESM credential.
              </p>
              <button
                onClick={handleStartExam}
                className="w-full bg-[#146B45] hover:bg-[#104B35] text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Proctored Exam</span>
              </button>
            </div>
          </div>

          {/* Module Content Reader */}
          <div className="lg:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-8 shadow-xs space-y-6">
            {selectedModule ? (
              <>
                <div className="border-b border-[#E6ECE8] pb-4">
                  <span className="text-[10px] font-mono font-bold text-[#146B45] bg-[#EAF5EF] px-2 py-0.5 rounded">
                    MODULE {courses[0]?.modules?.findIndex((m) => m.id === selectedModule.id) + 1 || 1}
                  </span>
                  <h2 className="text-xl font-bold text-[#17231D] mt-2">
                    {selectedModule.title}
                  </h2>
                  <p className="text-xs text-[#66736B] mt-1">
                    Standard compliance reference: NFPA 70E Standard for Electrical Safety in the Workplace.
                  </p>
                </div>

                <div className="prose prose-sm text-xs text-[#17231D] leading-relaxed space-y-4">
                  <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8] text-[#17231D] space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#146B45]">
                      Key Electrical Compliance Takeaways
                    </h4>
                    <p className="text-xs text-[#66736B]">
                      {selectedModule.content ||
                        'Commercial kitchens present high electrical hazards due to grease, washdown water, heat, and heavy motor loads. Electrical safety managers must verify GFCI protection on all receptacles within 6 feet of prep sinks and verify that panel doors swing open at least 90 degrees without obstruction.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-[#17231D]">Operational Safety Checklist</h4>
                    <ul className="space-y-2 text-[#66736B] list-disc pl-4 text-xs">
                      <li>Maintain 36-inch clear radius in front of Main Distribution Panels (NEC 110.26).</li>
                      <li>Never allow multi-plug extension cords or daisy-chained power strips on cooklines.</li>
                      <li>Conduct monthly test-and-reset button checks on all GFCI receptacles.</li>
                      <li>Immediately de-energize and red-tag any appliance experiencing casing vibration or intermittent trips.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E6ECE8] flex items-center justify-between">
                  <span className="text-xs text-[#16834A] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Module Reading Complete</span>
                  </span>
                  <button
                    onClick={handleStartExam}
                    className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
                  >
                    <span>Proceed to Exam</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-[#66736B] text-xs">
                Select a module from the syllabus to begin training.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: TIMED PROCTORED EXAMINATION ENGINE                */}
      {/* ========================================================= */}
      {activeTab === 'exam' && (
        <div className="space-y-6">
          {!examActive && !examSubmitted ? (
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-8 shadow-xs max-w-2xl mx-auto text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF5EF] text-[#146B45] flex items-center justify-center mx-auto">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#17231D]">
                  CRESM Official Certification Examination
                </h2>
                <p className="text-xs text-[#66736B] max-w-md mx-auto mt-1 leading-relaxed">
                  You are about to launch the official timed proctored evaluation. Review the testing guidelines carefully before proceeding.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs">
                <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8]">
                  <span className="text-[10px] text-[#66736B] uppercase font-bold">Questions</span>
                  <div className="text-base font-bold text-[#17231D] mt-0.5">10 Questions</div>
                </div>
                <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8]">
                  <span className="text-[10px] text-[#66736B] uppercase font-bold">Time Limit</span>
                  <div className="text-base font-bold text-[#17231D] mt-0.5">45 Minutes</div>
                </div>
                <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8]">
                  <span className="text-[10px] text-[#66736B] uppercase font-bold">Passing Score</span>
                  <div className="text-base font-bold text-[#146B45] mt-0.5">80% or Higher</div>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-4 py-2.5 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs font-semibold"
                >
                  Return to Study Modules
                </button>
                <button
                  onClick={handleStartExam}
                  className="px-6 py-2.5 bg-[#146B45] hover:bg-[#104B35] text-white font-bold rounded-lg text-xs flex items-center gap-2 transition shadow-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>Begin Examination Now</span>
                </button>
              </div>
            </div>
          ) : examActive && !examSubmitted ? (
            /* Live Exam Workspace */
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] shadow-xs overflow-hidden">
              {/* Exam Topbar with Timer & Question Navigator */}
              <div className="bg-[#146B45] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFFFFF]/10 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4 text-[#29A36A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#EAF5EF] font-medium">Time Remaining</div>
                    <div className="font-mono text-base font-bold text-white tracking-wider">
                      {formatTimer(examTimeLeft)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFlag(exam?.questions?.[currentQuestionIndex]?.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                      flaggedQuestions[exam?.questions?.[currentQuestionIndex]?.id]
                        ? 'bg-[#D99A25] text-white border-transparent'
                        : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>
                      {flaggedQuestions[exam?.questions?.[currentQuestionIndex]?.id] ? 'Flagged' : 'Flag for Review'}
                    </span>
                  </button>
                  <button
                    onClick={handleSubmitExam}
                    className="px-4 py-1.5 bg-[#FFFFFF] hover:bg-[#EAF5EF] text-[#146B45] font-bold rounded-lg text-xs transition shadow-xs"
                  >
                    Submit Exam
                  </button>
                </div>
              </div>

              {/* Question Number Pills */}
              <div className="px-6 py-3 bg-[#F7F9F8] border-b border-[#E6ECE8] flex items-center gap-2 overflow-x-auto text-xs">
                {exam?.questions?.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;
                  const isFlagged = flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition shrink-0 relative ${
                        isCurrent
                          ? 'bg-[#146B45] text-white ring-2 ring-[#29A36A]'
                          : isAnswered
                          ? 'bg-[#EAF5EF] text-[#146B45] border border-[#29A36A]/40'
                          : 'bg-[#FFFFFF] border border-[#E6ECE8] text-[#66736B] hover:bg-[#F1F5F2]'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="w-2 h-2 rounded-full bg-[#D99A25] absolute -top-0.5 -right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Question Content */}
              <div className="p-8 max-w-3xl">
                {exam?.questions?.[currentQuestionIndex] ? (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#146B45] bg-[#EAF5EF] px-2 py-0.5 rounded">
                        QUESTION {currentQuestionIndex + 1} OF {exam.questions.length}
                      </span>
                      <h3 className="text-base font-bold text-[#17231D] mt-2 leading-relaxed">
                        {exam.questions[currentQuestionIndex].question_text}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {exam.questions[currentQuestionIndex].options?.map((opt, oIdx) => {
                        const isSelected = userAnswers[exam.questions[currentQuestionIndex].id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(exam.questions[currentQuestionIndex].id, oIdx)}
                            className={`w-full text-left p-4 rounded-xl border text-xs flex items-center justify-between transition ${
                              isSelected
                                ? 'bg-[#EAF5EF] border-[#146B45] text-[#17231D] font-semibold ring-1 ring-[#146B45]'
                                : 'bg-[#FFFFFF] border-[#E6ECE8] text-[#17231D] hover:bg-[#F7F9F8]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isSelected ? 'bg-[#146B45] text-white' : 'bg-[#F1F5F2] text-[#66736B]'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#146B45] bg-[#146B45]' : 'border-[#E6ECE8]'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-6 border-t border-[#E6ECE8] flex items-center justify-between">
                      <button
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] disabled:opacity-40 text-[#17231D] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous Question</span>
                      </button>

                      {currentQuestionIndex < exam.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                          className="px-4 py-2 bg-[#146B45] hover:bg-[#104B35] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitExam}
                          className="px-5 py-2 bg-[#16834A] hover:bg-[#104B35] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
                        >
                          <span>Review & Submit Exam</span>
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            /* Exam Results Dossier */
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-8 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                examResult?.passed ? 'bg-[#EAF5EF] text-[#16834A]' : 'bg-[#D94848]/10 text-[#D94848]'
              }`}>
                {examResult?.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  examResult?.passed ? 'text-[#16834A]' : 'text-[#D94848]'
                }`}>
                  {examResult?.passed ? 'Examination Passed' : 'Evaluation Incomplete'}
                </span>
                <h2 className="text-2xl font-bold text-[#17231D] mt-1">
                  Official Score: {examResult?.score}%
                </h2>
                <p className="text-xs text-[#66736B] mt-1">
                  {examResult?.passed
                    ? 'Congratulations! You have satisfied all knowledge requirements for the CRESM credential.'
                    : 'A minimum passing threshold of 80% is required. Please review the safety modules and re-attempt.'}
                </p>
              </div>

              {examResult?.passed && (
                <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8] text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#66736B]">Credential Registry ID:</span>
                    <span className="font-mono font-bold text-[#146B45]">{examResult.credentialId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66736B]">Accreditation Authority:</span>
                    <span className="font-semibold text-[#17231D]">Restaurant Electrical Authority (REA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66736B]">Correct Answers:</span>
                    <span className="font-bold text-[#16834A]">{examResult.correctCount} of {examResult.totalCount}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('certificates')}
                  className="px-5 py-2.5 bg-[#146B45] hover:bg-[#104B35] text-white font-bold rounded-lg text-xs flex items-center gap-2 transition shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>View Issued Certificates</span>
                </button>
                <button
                  onClick={() => {
                    setExamActive(false);
                    setExamSubmitted(false);
                    setActiveTab('courses');
                  }}
                  className="px-4 py-2.5 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs font-semibold"
                >
                  Return to Curriculum
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: CERTIFICATES & CREDENTIALS REGISTRY               */}
      {/* ========================================================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <DataTable
            data={certificates}
            columns={certificateColumns}
            searchable={true}
            searchPlaceholder="Search credential number, recipient, or program..."
          />
        </div>
      )}

      {/* Digital Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-[#17231D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6ECE8] shadow-2xl max-w-xl w-full p-8 relative space-y-6">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-[#66736B] hover:text-[#17231D] p-1.5 rounded-lg hover:bg-[#F1F5F2] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Artwork Card */}
            <div className="border-4 border-double border-[#146B45]/40 rounded-xl p-8 text-center space-y-4 bg-radial from-[#FFFFFF] to-[#EAF5EF]/30 relative">
              <div className="w-12 h-12 rounded-full bg-[#146B45] text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-7 h-7 text-[#29A36A]" />
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#146B45] uppercase">
                  RESTAURANT ELECTRICAL AUTHORITY
                </span>
                <h3 className="text-xl font-bold text-[#17231D] font-serif mt-1">
                  Certificate of Professional Competency
                </h3>
                <p className="text-[11px] text-[#66736B]">
                  This certifies that the named individual has demonstrated operational proficiency in commercial kitchen electrical safety.
                </p>
              </div>

              <div className="py-2 border-y border-[#E6ECE8]">
                <div className="text-base font-bold text-[#17231D]">
                  {selectedCert.recipient_name || user?.name || 'Chef Marcus Vance'}
                </div>
                <div className="text-xs text-[#146B45] font-semibold mt-0.5">
                  Certified Restaurant Electrical Safety Manager (CRESM)
                </div>
              </div>

              <div className="grid grid-cols-2 text-left text-[11px] text-[#66736B] pt-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#17231D]">Credential ID:</span>
                  <span className="font-mono text-[#146B45] font-semibold">{selectedCert.certificate_number || 'CRESM-2026-8819'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#17231D]">Valid Through:</span>
                  <span>{selectedCert.expires_at ? selectedCert.expires_at.split('T')[0] : '2028-02-15'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <a
                href={`/verify-certificate?id=${selectedCert.certificate_number || 'CRESM-2026-8819'}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#146B45] hover:bg-[#104B35] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                <span>Verify Public Registry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
