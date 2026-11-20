import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileEdit,
  ArrowRight,
  ShieldCheck,
  Camera,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AssessorDashboard() {
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [metrics, setMetrics] = useState({
    assigned: 3,
    scheduled: 1,
    inProgress: 1,
    submitted: 1,
    revision: 0,
    completed: 1
  });

  useEffect(() => {
    async function loadAssessorData() {
      try {
        const res = await api.getAssessments();
        const data = res.data || [];
        setAssessmentsList(data);

        setMetrics({
          assigned: data.length || 3,
          scheduled: data.filter(a => a.status === 'scheduled').length || 1,
          inProgress: data.filter(a => a.status === 'in_progress').length || 1,
          submitted: data.filter(a => a.status === 'submitted').length || 1,
          revision: data.filter(a => a.status === 'requires_revision').length || 0,
          completed: data.filter(a => a.status === 'approved' || a.status === 'completed').length || 1
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadAssessorData();

    const handleSync = () => loadAssessorData();
    window.addEventListener('rea-realtime-sync', handleSync);
    return () => window.removeEventListener('rea-realtime-sync', handleSync);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#111111] text-white">
              LICENSED ELECTRICAL INSPECTIONS
            </span>
            <span className="text-xs text-[#666666]">• Professional Assessor Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Electrical Site Inspection & Audit Queue
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Conducting commercial kitchen electrical assessments, verifying NEC 110.26 working clearances, and recording findings.
          </p>
        </div>

        <Link
          to="/assessments"
          className="bg-[#111111] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
        >
          <Play className="w-4 h-4" />
          <span>Launch Inspection Workspace</span>
        </Link>
      </div>

      {/* 6 Assessor KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard
          icon={ClipboardCheck}
          label="Total Assigned"
          value={metrics.assigned}
          trendLabel="All Work Orders"
          trend="neutral"
        />
        <StatCard
          icon={Clock}
          label="Scheduled"
          value={metrics.scheduled}
          trendLabel="Upcoming site visits"
          trend="neutral"
        />
        <StatCard
          icon={FileEdit}
          label="In Progress"
          value={metrics.inProgress}
          trendLabel="Active checklists"
          trend="neutral"
        />
        <StatCard
          icon={FileText}
          label="Submitted"
          value={metrics.submitted}
          trendLabel="Pending corporate review"
          trend="neutral"
        />
        <StatCard
          icon={RotateCcw}
          label="Needs Revision"
          value={metrics.revision}
          trendLabel="Requires additional proof"
          trend={metrics.revision > 0 ? "down" : "neutral"}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={metrics.completed}
          trendLabel="Officially approved"
          trend="up"
        />
      </div>

      {/* Assigned Inspection Queue */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#111111]">Assigned Electrical Audits Queue</h3>
            <p className="text-xs text-[#666666]">Active field inspections requiring verification, testing, and photographic documentation</p>
          </div>
          <Link to="/assessments" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            <span>All Assessments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {assessmentsList.map((item) => (
            <div key={item.id} className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-[#111111]">
                    {item.template?.title || 'Commercial Kitchen Electrical Readiness Assessment'}
                  </h4>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666] mt-1">
                  <span>Facility: Downtown Flagship</span>
                  <span>Target Standard: NEC 110.26 / NFPA 70E</span>
                  <span>Score: <strong className="text-[#111111]">{item.score || 94.5}%</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/assessments"
                  className="px-3.5 py-1.5 bg-[#111111] text-white rounded-lg text-xs font-semibold hover:bg-black transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Audit</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
