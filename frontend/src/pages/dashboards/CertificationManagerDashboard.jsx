import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function CertificationManagerDashboard() {
  const [metrics, setMetrics] = useState({
    newApplications: 4,
    awaitingReview: 2,
    eligibleApplicants: 3,
    trainingProgress: '88%',
    pendingExamReviews: 1,
    certificatesIssued: 18,
    expiringCertificates: 2,
    renewalApplications: 1
  });

  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    async function loadCertData() {
      try {
        const [appRes, certRes] = await Promise.all([
          api.getApplications(),
          api.getCertificates()
        ]);

        const apps = appRes.data || [];
        const certs = certRes.data || [];
        setApplications(apps);
        setCertificates(certs);

        setMetrics(prev => ({
          ...prev,
          newApplications: apps.length || 4,
          certificatesIssued: certs.length || 18
        }));
      } catch (err) {
        console.error(err);
      }
    }

    loadCertData();

    const handleSync = () => loadCertData();
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
              CREDENTIALING GOVERNANCE
            </span>
            <span className="text-xs text-[#666666]">• Manager Certification Administrator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            CRESM Academy & Certification Registry
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Administer manager safety applications, monitor proctored examination attempts, and issue official credentials.
          </p>
        </div>

        <Link
          to="/certifications"
          className="bg-[#111111] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
        >
          <Award className="w-4 h-4" />
          <span>Certification Registry</span>
        </Link>
      </div>

      {/* 8 Certification Manager KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Applications"
          value={metrics.newApplications}
          trendLabel="Candidates in pipeline"
          trend="up"
        />
        <StatCard
          icon={Clock}
          label="Awaiting Review"
          value={metrics.awaitingReview}
          trendLabel="Prerequisite verification"
          trend="neutral"
        />
        <StatCard
          icon={CheckCircle2}
          label="Eligible for Exam"
          value={metrics.eligibleApplicants}
          trendLabel="Modules Completed"
          trend="up"
        />
        <StatCard
          icon={BookOpen}
          label="LMS Completion"
          value={metrics.trainingProgress}
          trendLabel="Curriculum average"
          trend="up"
        />
        <StatCard
          icon={FileCheck}
          label="Exam Reviews"
          value={metrics.pendingExamReviews}
          trendLabel="Passing score >=80%"
          trend="neutral"
        />
        <StatCard
          icon={Award}
          label="Certificates Issued"
          value={metrics.certificatesIssued}
          trendLabel="Official CRESM Credentials"
          trend="up"
        />
        <StatCard
          icon={AlertCircle}
          label="Expiring Soon"
          value={metrics.expiringCertificates}
          trendLabel="Within 60-day buffer"
          trend="down"
        />
        <StatCard
          icon={RotateCcw}
          label="Renewals Pending"
          value={metrics.renewalApplications}
          trendLabel="Bi-annual recertification"
          trend="neutral"
        />
      </div>

      {/* Candidate Pipeline Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#111111]">Candidate Certification Pipeline</h3>
            <p className="text-xs text-[#666666]">Pending applications, study module completion, and proctored examination status</p>
          </div>
          <Link to="/certifications" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            <span>Review Full Academy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F7] text-[#666666] font-semibold border-b border-[#E5E5E5]">
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Hospitality Organization</th>
                <th className="py-3 px-4">Program Track</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#F7F7F7] transition">
                  <td className="py-3.5 px-4 font-bold text-[#111111]">{app.user?.full_name || 'Chef Marcus Vance'}</td>
                  <td className="py-3.5 px-4 text-[#666666]">Apex Hospitality Group</td>
                  <td className="py-3.5 px-4 text-[#111111] font-medium">Certified Safety Manager (CRESM)</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status || 'applied'} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to="/certifications"
                      className="px-2.5 py-1 bg-[#111111] text-white rounded text-[11px] font-semibold hover:bg-black transition"
                    >
                      Audit Application
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
