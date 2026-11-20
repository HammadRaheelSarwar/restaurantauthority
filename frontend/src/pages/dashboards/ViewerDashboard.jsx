import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  ShieldCheck,
  UtensilsCrossed,
  ClipboardCheck,
  AlertTriangle,
  CheckSquare,
  Download,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function ViewerDashboard() {
  const [metrics, setMetrics] = useState({
    restaurants: 2,
    readinessScore: '91.8%',
    assessmentStatus: 'Passing (85% Target)',
    incidentSummaries: 1,
    actionStatus: 'In Remediation',
    availableReports: 7
  });

  const [restaurantsList, setRestaurantsList] = useState([]);

  useEffect(() => {
    async function loadViewerData() {
      try {
        const [rests, locs] = await Promise.all([
          api.getRestaurants(),
          api.getLocations()
        ]);
        setRestaurantsList(rests.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadViewerData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Read-Only Notice Banner */}
      <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#111111]">Auditor & Underwriter Read-Only Access</h4>
            <p className="text-[11px] text-[#666666]">
              You have authorized inspection viewing privileges. All database records and reports are presented in verified read-only mode.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#666666] bg-[#FFFFFF] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
          <Lock className="w-3.5 h-3.5 text-[#111111]" />
          <span>Restricted Permissions</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Authorized Restaurant Portfolio Compliance Overview
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time compliance standing, electrical audit scores, and insurance underwriting summaries.
          </p>
        </div>

        <Link
          to="/reports"
          className="bg-[#111111] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Approved Reports</span>
        </Link>
      </div>

      {/* 6 Viewer KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard
          icon={UtensilsCrossed}
          label="Authorized Brands"
          value={metrics.restaurants}
          trendLabel="Apex Hospitality"
          trend="neutral"
        />
        <StatCard
          icon={ShieldCheck}
          label="Portfolio Readiness"
          value={metrics.readinessScore}
          trendLabel="Accredited"
          trend="up"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Audit Standing"
          value="Passing"
          trendLabel="Over 85% Benchmark"
          trend="up"
        />
        <StatCard
          icon={AlertTriangle}
          label="Active Incidents"
          value={metrics.incidentSummaries}
          trendLabel="Isolated in kitchen"
          trend="neutral"
        />
        <StatCard
          icon={CheckSquare}
          label="Remediation Status"
          value="On Track"
          trendLabel="Zero overdue items"
          trend="up"
        />
        <StatCard
          icon={FileText}
          label="Executive Reports"
          value={metrics.availableReports}
          trendLabel="Export Available"
          trend="neutral"
        />
      </div>

      {/* Read-Only Portfolio Summary */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#111111]">Permitted Facility Inspection Records</h3>
            <p className="text-xs text-[#666666]">Authorized location electrical summaries and accreditation standing</p>
          </div>
          <Link to="/reports" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            <span>View Executive Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {restaurantsList.map((r) => (
            <div key={r.id} className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-[#111111]">{r.name}</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666] mt-1">
                  <span>Type: Commercial Restaurant</span>
                  <span>Readiness: <strong className="text-[#16834A]">94.5% Compliant</strong></span>
                  <span>Main Distribution Panel: Inspected & Clear</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#16834A]/10 text-[#16834A] rounded-lg">
                AUDIT VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
