import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  PieChart as PieIcon,
  Filter,
  Eye,
  Printer,
  Sparkles,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function ReportsPage() {
  const { addToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [selectedReportCategory, setSelectedReportCategory] = useState('assessment');
  const [selectedTimeRange, setSelectedTimeRange] = useState('year');
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await api.getAnalytics();
      if (res.success) setAnalytics(res.data);
    }
    loadData();
  }, []);

  const reportCategories = [
    {
      id: 'assessment',
      title: 'Site Assessment Summary',
      code: 'REA-REP-01',
      desc: 'Comprehensive multi-location audit scores, NEC clearance compliance, and passing percentages.'
    },
    {
      id: 'equipment',
      title: 'Commercial Appliance & IR Scans',
      code: 'REA-REP-02',
      desc: 'Cookline heavy appliance electrical loads, thermal scan findings, and maintenance schedules.'
    },
    {
      id: 'incident',
      title: 'Incident Frequency & Severity',
      code: 'REA-REP-03',
      desc: 'Breaker trip histories, water ingress events, and kitchen electrical safety root-cause analyses.'
    },
    {
      id: 'capa',
      title: 'Corrective Action (CAPA) SLA',
      code: 'REA-REP-04',
      desc: 'Deficiency resolution rates, licensed electrician sign-offs, and verification photographic logs.'
    },
    {
      id: 'annual',
      title: 'Annual Readiness Review Dossier',
      code: 'REA-REP-05',
      desc: 'Executive compliance summary, insurance underwriting proof, and legal safety standing.'
    },
    {
      id: 'certification',
      title: 'Manager Certification (CRESM)',
      code: 'REA-REP-06',
      desc: 'Credentialed kitchen supervisor roster, expiration schedules, and proctored exam transcripts.'
    },
    {
      id: 'benchmark',
      title: 'Multi-Unit Portfolio Benchmark',
      code: 'REA-REP-07',
      desc: 'Cross-restaurant comparison metrics, risk indices, and priority electrical remediation tracks.'
    }
  ];

  const barData = [
    { name: 'Downtown Flagship', score: 94, target: 85 },
    { name: 'Midtown Bistro', score: 88, target: 85 },
    { name: 'Harbor Fishhouse', score: 79, target: 85 },
    { name: 'Uptown Express', score: 96, target: 85 },
    { name: 'West End Taqueria', score: 91, target: 85 }
  ];

  const pieData = [
    { name: 'Compliant (>=85%)', value: 4, color: '#16834A' },
    { name: 'Needs Attention (70-84%)', value: 1, color: '#D99A25' },
    { name: 'Critical Non-Compliant (<70%)', value: 0, color: '#D94848' }
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Benchmark Target,Status\n' +
      `Total Facilities,${analytics?.summary?.totalLocations || 5},5,Active\n` +
      `Compliant Facilities,${analytics?.summary?.compliantLocations || 4},>=4,Passing\n` +
      `Total Assessments Logged,${analytics?.summary?.totalAssessments || 12},N/A,Logged\n` +
      `Open Deficiencies,${analytics?.summary?.openIncidents || 0},0,Under Control\n` +
      `Resolved Corrective Actions,${analytics?.summary?.resolvedCorrectiveActions || 8},100%,Closed\n` +
      `Average Readiness Score,91.8%,>=85%,Accredited\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `REA_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Executive Compliance CSV report downloaded');
  };

  const handleGeneratePDF = () => {
    setShowPdfPreview(true);
    addToast('Official Executive PDF dossier compiled');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF5EF] text-[#146B45]">
              Executive Governance
            </span>
            <span className="text-xs text-[#66736B]">• Board-Ready Compliance Dossiers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
            Compliance Analytics & Executive Reports
          </h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Audit analytics, portfolio readiness metrics, insurer underwriting dossiers, and exportable reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleGeneratePDF}
            className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Executive PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart3}
          label="Portfolio Readiness Index"
          value="91.8%"
          trendLabel="+4.2% vs previous quarter"
          trend="up"
        />
        <StatCard
          icon={ShieldCheck}
          label="Code Compliance Passing"
          value="80%"
          trendLabel="4 of 5 Facilities Pass"
          trend="neutral"
        />
        <StatCard
          icon={AlertTriangle}
          label="Active Deficiencies"
          value={analytics?.summary?.openIncidents || 0}
          trendLabel="Zero critical red-tags"
          trend="up"
        />
        <StatCard
          icon={CheckCircle2}
          label="CAPA Resolution Rate"
          value="100%"
          trendLabel="All remediations verified"
          trend="up"
        />
      </div>

      {/* 7 Report Category Selection Cards */}
      <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E6ECE8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#17231D]">Select Regulatory Report Category</h3>
            <p className="text-xs text-[#66736B]">Choose an accredited report template to preview metrics and export</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#66736B]">Reporting Window:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="p-1.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-md text-xs font-medium text-[#17231D]"
            >
              <option value="quarter">Last 90 Days</option>
              <option value="year">Current Year (2026)</option>
              <option value="all">Full Historical Record</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {reportCategories.map((cat) => {
            const isSelected = selectedReportCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedReportCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF5EF] border-[#146B45] ring-1 ring-[#146B45] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#E6ECE8] hover:bg-[#F7F9F8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#146B45]">
                      {cat.code}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#146B45]" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-[#17231D] mt-1.5">{cat.title}</h4>
                  <p className="text-[11px] text-[#66736B] mt-1 leading-snug">{cat.desc}</p>
                </div>
                <div className="pt-2 text-[10px] font-bold text-[#146B45] flex items-center gap-1 mt-2">
                  <span>{isSelected ? 'Active Selection' : 'Click to View'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Index Across Locations */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-6 rounded-xl border border-[#E6ECE8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#17231D]">Facility Readiness Benchmarking</h3>
              <p className="text-xs text-[#66736B]">Electrical assessment scores against the 85% REA Passing Standard</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#146B45]">
              Target: 85%
            </span>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6ECE8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#66736B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#66736B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6ECE8', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#146B45" radius={[6, 6, 0, 0]} name="Audit Score (%)" />
                <Bar dataKey="target" fill="#E6ECE8" radius={[6, 6, 0, 0]} name="Passing Threshold (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Status Distribution Donut */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E6ECE8] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#17231D]">Portfolio Compliance Health</h3>
            <p className="text-xs text-[#66736B]">Distribution of restaurant units by audit tier</p>
          </div>

          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6ECE8', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E6ECE8] text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#17231D]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16834A]" />
                <span>Compliant (&ge; 85%)</span>
              </span>
              <span className="font-bold text-[#17231D]">4 Units (80%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#17231D]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D99A25]" />
                <span>Needs Attention (70-84%)</span>
              </span>
              <span className="font-bold text-[#17231D]">1 Unit (20%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 bg-[#17231D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6ECE8] shadow-2xl max-w-2xl w-full p-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPdfPreview(false)}
              className="absolute top-4 right-4 text-[#66736B] hover:text-[#17231D] p-1.5 rounded-lg hover:bg-[#F1F5F2]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="border-b border-[#E6ECE8] pb-6 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#146B45] uppercase">
                  OFFICIAL EXECUTIVE COMPLIANCE DOSSIER
                </span>
                <h2 className="text-xl font-bold text-[#17231D] mt-1">
                  Restaurant Electrical Safety & Readiness Report
                </h2>
                <p className="text-xs text-[#66736B]">
                  Prepared for: Apex Hospitality Group • Board of Directors & Underwriting
                </p>
              </div>
              <div className="text-right text-[11px] text-[#66736B]">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div className="font-mono text-[#146B45] font-bold">DOC #REA-2026-EX-9912</div>
              </div>
            </div>

            {/* Executive Summary Narrative */}
            <div className="space-y-3 text-xs text-[#17231D] leading-relaxed">
              <h4 className="font-bold text-sm text-[#146B45]">1. Executive Statement of Readiness</h4>
              <p className="text-[#66736B]">
                During the 2026 evaluation cycle, the Restaurant Electrical Authority inspected 5 active commercial facilities. The portfolio demonstrated an aggregate readiness index of <strong>91.8%</strong>, satisfying commercial kitchen fire safety standards and National Electrical Code (NEC) mandates.
              </p>

              <h4 className="font-bold text-sm text-[#146B45] pt-2">2. Critical Life Safety Findings</h4>
              <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8] space-y-1.5">
                <div className="flex justify-between">
                  <span>Main Distribution Panels Inspected:</span>
                  <span className="font-bold">12 MDP Units</span>
                </div>
                <div className="flex justify-between">
                  <span>NEC 110.26 36-Inch Clearance Compliance:</span>
                  <span className="font-bold text-[#16834A]">100% Passing</span>
                </div>
                <div className="flex justify-between">
                  <span>GFCI Trip Verification on Wet Cooklines:</span>
                  <span className="font-bold text-[#16834A]">100% Tested & Certified</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Critical Violations:</span>
                  <span className="font-bold text-[#16834A]">0 Deficiencies</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-[#146B45] pt-2">3. Authorized Sign-Off</h4>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E6ECE8] text-[11px]">
                <div>
                  <div className="font-bold text-[#17231D]">Chief Electrical Inspector:</div>
                  <div className="text-[#146B45] font-serif italic text-sm mt-1">David Vance, PE, CSP</div>
                  <div className="text-[#66736B]">Professional Engineer #PE-49912</div>
                </div>
                <div>
                  <div className="font-bold text-[#17231D]">Corporate Compliance Officer:</div>
                  <div className="text-[#146B45] font-serif italic text-sm mt-1">Elena Rostova, CRESM</div>
                  <div className="text-[#66736B]">Credential #CRESM-2026-8819</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E6ECE8]">
              <button
                onClick={() => setShowPdfPreview(false)}
                className="px-4 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#146B45] hover:bg-[#104B35] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
