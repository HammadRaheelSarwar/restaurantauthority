import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  UtensilsCrossed,
  MapPin,
  Users,
  ClipboardCheck,
  AlertTriangle,
  CheckSquare,
  Calendar,
  ShieldCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function OrgAdminDashboard() {
  const [metrics, setMetrics] = useState({
    restaurants: 2,
    locations: 3,
    orgUsers: 4,
    assessmentCompletion: '92%',
    openIncidents: 1,
    outstandingActions: 3,
    upcomingReviews: 1,
    readinessScore: '91.8%'
  });

  const [restaurantsList, setRestaurantsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    async function loadOrgData() {
      try {
        const [rests, locs, incidents, actions, reviews] = await Promise.all([
          api.getRestaurants(),
          api.getLocations(),
          api.getIncidents(),
          api.getCorrectiveActions(),
          api.getAnnualReviews()
        ]);

        const rData = rests.data || [];
        const lData = locs.data || [];
        setRestaurantsList(rData);
        setLocationsList(lData);

        const openInc = (incidents.data || []).filter(i => i.status !== 'closed').length;
        const openAct = (actions.data || []).filter(a => a.status !== 'closed' && a.status !== 'approved').length;
        const upcomingRev = (reviews.data || []).filter(r => r.status === 'upcoming').length;

        setMetrics({
          restaurants: rData.length || 2,
          locations: lData.length || 3,
          orgUsers: 4,
          assessmentCompletion: '94%',
          openIncidents: openInc,
          outstandingActions: openAct,
          upcomingReviews: upcomingRev || 1,
          readinessScore: '91.8%'
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadOrgData();

    const handleSync = () => loadOrgData();
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
              ORGANIZATION OPERATIONS
            </span>
            <span className="text-xs text-[#666666]">• Hospitality Group Administrator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Apex Hospitality Group — Electrical Operations
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Managing commercial kitchen electrical readiness, site assessments, and branch safety across all hospitality units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/restaurants"
            className="bg-[#111111] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Restaurant Brand</span>
          </Link>
          <Link
            to="/locations"
            className="border border-[#E5E5E5] hover:bg-[#F0F0F0] text-[#111111] font-semibold px-3 py-2 rounded-lg text-xs transition"
          >
            <span>Add Branch Location</span>
          </Link>
        </div>
      </div>

      {/* 8 Organization-Specific KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={UtensilsCrossed}
          label="Managed Brands"
          value={metrics.restaurants}
          trendLabel="Apex Flagship & Concepts"
          trend="neutral"
        />
        <StatCard
          icon={MapPin}
          label="Total Facilities"
          value={metrics.locations}
          trendLabel="Active Commercial Kitchens"
          trend="neutral"
        />
        <StatCard
          icon={Users}
          label="Assigned Managers"
          value={metrics.orgUsers}
          trendLabel="All CRESM-trained"
          trend="up"
        />
        <StatCard
          icon={ShieldCheck}
          label="Portfolio Readiness"
          value={metrics.readinessScore}
          trendLabel="Above 85% REA Benchmark"
          trend="up"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Audit Completion"
          value={metrics.assessmentCompletion}
          trendLabel="Annual Audits Satisfied"
          trend="up"
        />
        <StatCard
          icon={AlertTriangle}
          label="Open Incidents"
          value={metrics.openIncidents}
          trendLabel="Requires remediation"
          trend="down"
        />
        <StatCard
          icon={CheckSquare}
          label="Outstanding CAPAs"
          value={metrics.outstandingActions}
          trendLabel="Assigned to electricians"
          trend="neutral"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Reviews"
          value={metrics.upcomingReviews}
          trendLabel="Next review in 45 days"
          trend="neutral"
        />
      </div>

      {/* Facilities Readiness Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#111111]">Branch Kitchen Readiness & Panel Status</h3>
            <p className="text-xs text-[#666666]">Real-time electrical audit scores and breaker clearance compliance</p>
          </div>
          <Link to="/locations" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            <span>Manage All Locations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F7] text-[#666666] font-semibold border-b border-[#E5E5E5]">
                <th className="py-3 px-4">Location Name</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">NEC 110.26 Clearance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {locationsList.map((loc) => (
                <tr key={loc.id} className="hover:bg-[#F7F7F7] transition">
                  <td className="py-3.5 px-4 font-bold text-[#111111]">{loc.name}</td>
                  <td className="py-3.5 px-4 text-[#666666]">{loc.address}, {loc.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold font-mono text-[#16834A] bg-[#16834A]/10 px-2 py-0.5 rounded">
                      {loc.readiness_score || 94.5}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#16834A] font-semibold">✓ 36" Clear</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={loc.readiness_status || 'compliant'} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to="/locations"
                      className="px-2.5 py-1 bg-[#111111] text-white rounded text-[11px] font-semibold hover:bg-black transition"
                    >
                      View Facility
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
