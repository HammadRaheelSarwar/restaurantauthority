import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  MapPin,
  ClipboardCheck,
  AlertTriangle,
  CheckSquare,
  FileWarning,
  Calendar,
  Award,
  Plus,
  ArrowRight,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function RestaurantManagerDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    assignedRestaurants: 1,
    facilityReadiness: '94.5%',
    pendingAssessments: 1,
    openIncidents: 1,
    assignedCapas: 2,
    missingDocs: 0,
    upcomingReviews: 1,
    certStatus: 'ACTIVE (CRESM-2026-8819)'
  });

  const [assignedActions, setAssignedActions] = useState([]);
  const [openIncidentsList, setOpenIncidentsList] = useState([]);

  useEffect(() => {
    async function loadManagerData() {
      try {
        const [incRes, actRes] = await Promise.all([
          api.getIncidents(),
          api.getCorrectiveActions()
        ]);

        const incs = (incRes.data || []).filter(i => i.status !== 'closed');
        const acts = (actRes.data || []).filter(a => a.status !== 'closed' && a.status !== 'approved');

        setOpenIncidentsList(incs);
        setAssignedActions(acts);

        setMetrics(prev => ({
          ...prev,
          openIncidents: incs.length,
          assignedCapas: acts.length
        }));
      } catch (err) {
        console.error(err);
      }
    }

    loadManagerData();

    const handleSync = () => loadManagerData();
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
              STORE OPERATIONS
            </span>
            <span className="text-xs text-[#666666]">• General Kitchen Manager</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Downtown Flagship (Facility #NYC-01) — Safety Manager
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Shift electrical triage, GFCI testing, panel clearance oversight, and appliance defect resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/incidents"
            className="bg-[#D94848] hover:bg-[#b03030] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Kitchen Incident</span>
          </Link>
          <Link
            to="/electrical-panels"
            className="bg-[#111111] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Panel Evidence</span>
          </Link>
        </div>
      </div>

      {/* 8 Restaurant Manager KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={UtensilsCrossed}
          label="Assigned Restaurant"
          value="Apex Downtown"
          trendLabel="Flagship Facility #01"
          trend="neutral"
        />
        <StatCard
          icon={ShieldCheck}
          label="Kitchen Readiness"
          value={metrics.facilityReadiness}
          trendLabel="Compliant with NFPA 70E"
          trend="up"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Pending Audits"
          value={metrics.pendingAssessments}
          trendLabel="Scheduled for Q2"
          trend="neutral"
        />
        <StatCard
          icon={AlertTriangle}
          label="Open Cookline Hazards"
          value={metrics.openIncidents}
          trendLabel="Deep Fryer Breaker Trip"
          trend="down"
        />
        <StatCard
          icon={CheckSquare}
          label="Manager CAPA Tasks"
          value={metrics.assignedCapas}
          trendLabel="Awaiting contractor proof"
          trend="neutral"
        />
        <StatCard
          icon={FileWarning}
          label="Missing Documents"
          value={metrics.missingDocs}
          trendLabel="All Breaker Schedules Valid"
          trend="up"
        />
        <StatCard
          icon={Calendar}
          label="Annual Review Status"
          value="Approved"
          trendLabel="Valid through Dec 2026"
          trend="up"
        />
        <StatCard
          icon={Award}
          label="CRESM Credential"
          value="Valid"
          trendLabel="Certified Safety Manager"
          trend="up"
        />
      </div>

      {/* Active Tasks & Hazards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Corrective Actions Requiring Verification */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#111111]" />
              <h3 className="font-bold text-sm text-[#111111]">Action Items Assigned to Store</h3>
            </div>
            <Link to="/corrective-actions" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
              <span>View All CAPAs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {assignedActions.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#666666]">
                No pending corrective tasks. Cooklines and panels are clear.
              </div>
            ) : (
              assignedActions.map((act) => (
                <div key={act.id} className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-[#111111]">{act.title}</h4>
                    <p className="text-[11px] text-[#666666] mt-0.5">{act.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#666666] mt-2">
                      <Clock className="w-3 h-3 text-[#D99A25]" />
                      <span>Due Date: {act.due_date || 'Within 48 hours'}</span>
                    </div>
                  </div>
                  <Link
                    to="/corrective-actions"
                    className="px-2.5 py-1 bg-[#111111] text-white rounded text-[11px] font-semibold hover:bg-black whitespace-nowrap transition"
                  >
                    Upload Proof
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cookline Electrical Incidents */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D94848]" />
              <h3 className="font-bold text-sm text-[#111111]">Recent Cookline Electrical Incidents</h3>
            </div>
            <Link to="/incidents" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
              <span>All Incidents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {openIncidentsList.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#666666]">
                Zero active electrical trips or thermal alerts reported.
              </div>
            ) : (
              openIncidentsList.map((inc) => (
                <div key={inc.id} className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#111111]">{inc.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D94848]/10 text-[#D94848]">
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1">{inc.description}</p>
                  </div>
                  <Link
                    to="/incidents"
                    className="px-2.5 py-1 border border-[#E5E5E5] hover:bg-[#FFFFFF] text-[#111111] rounded text-[11px] font-semibold transition"
                  >
                    View Log
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
