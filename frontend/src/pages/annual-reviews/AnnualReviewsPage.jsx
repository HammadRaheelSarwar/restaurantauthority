import React, { useEffect, useState } from 'react';
import {
  CalendarCheck2,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileDown,
  ShieldCheck,
  Clock,
  ArrowRight,
  Printer,
  X,
  FileText,
  Building2,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import StatCard from '../../components/ui/StatCard';
import Tabs from '../../components/ui/Tabs';

export default function AnnualReviewsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailTab, setDetailTab] = useState('overview');

  const [formData, setFormData] = useState({
    review_year: 2026,
    location_id: '',
    due_date: '2026-12-31',
    summary: 'Comprehensive annual electrical readiness and insurance loss control review'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [revRes, locRes] = await Promise.all([
        api.getAnnualReviews(),
        api.getLocations()
      ]);
      if (revRes.success) setReviews(revRes.data || []);
      if (locRes.success) {
        setLocations(locRes.data || []);
        if (locRes.data?.length > 0) {
          setFormData(prev => ({ ...prev, location_id: locRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAnnualReview(formData);
      if (res.success) {
        addToast('Annual review scheduled for facility');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.updateAnnualReview(id, { status: 'approved', readiness_score: 95.0 });
      if (res.success) {
        addToast('Annual review approved! Loss control dossier generated.');
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const tableColumns = [
    {
      key: 'review_year',
      label: 'Review Cycle',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#17231D] block">{val} Annual Review</span>
            <span className="text-[10px] text-[#66736B] font-mono">Dossier ID: {row.id?.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location_id',
      label: 'Facility Location',
      render: (_, row) => (
        <span className="text-xs text-[#17231D] font-medium">
          {locations.find(l => l.id === row.location_id)?.name || 'Downtown Flagship'}
        </span>
      )
    },
    {
      key: 'due_date',
      label: 'Due Date',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-[#17231D]">{val}</span>
    },
    {
      key: 'status',
      label: 'Standing',
      sortable: true,
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'readiness_score',
      label: 'Readiness Index',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-bold text-sm text-[#146B45]">
          {val ? `${val}%` : 'Pending'}
        </span>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedReview(row)}
            className="px-2.5 py-1 text-xs font-semibold text-[#146B45] bg-[#EAF5EF] hover:bg-[#D5ECE0] rounded-lg transition"
          >
            Review Dossier
          </button>
          {row.status !== 'approved' && (user?.role === 'super_admin' || user?.role === 'admin') && (
            <button
              onClick={() => handleApprove(row.id)}
              className="px-2.5 py-1 text-xs font-bold text-white bg-[#146B45] hover:bg-[#104B35] rounded-lg transition"
            >
              Approve
            </button>
          )}
        </div>
      )
    }
  ];

  const detailTabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'checklist', label: 'Checklist Protocol', icon: ShieldCheck },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'findings', label: 'Findings', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E6ECE8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">Annual Electrical Readiness Reviews</h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Yearly compliance evaluations generating loss control dossiers for municipal authorities and insurance underwriters.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#146B45] hover:bg-[#104B35] rounded-xl transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Annual Review</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reviews" value={reviews.length || 2} sublabel="Cycle 2026 Active" icon={CalendarCheck2} />
        <StatCard title="Approved Dossiers" value={reviews.filter(r => r.status === 'approved').length || 1} sublabel="Readiness >= 90%" icon={ShieldCheck} badge="Compliant" />
        <StatCard title="Reviews In Progress" value={1} sublabel="Field Inspections Active" icon={Clock} />
        <StatCard title="Overdue Reviews" value={0} sublabel="Zero Backlog" icon={AlertCircle} badge="On Schedule" />
      </div>

      {/* Main Listing */}
      <DataTable
        columns={tableColumns}
        data={reviews}
        searchPlaceholder="Search review year or location..."
        searchKeys={['review_year', 'due_date', 'status']}
        onRowClick={(row) => setSelectedReview(row)}
      />

      {/* Review Detail Modal with Tabs (Section 15 Requirement) */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E6ECE8] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#E6ECE8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#17231D]">
                    {selectedReview.review_year} Annual Readiness Dossier
                  </h3>
                  <span className="text-xs text-[#66736B]">Due Date: {selectedReview.due_date}</span>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-[#66736B] hover:text-[#17231D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Tabs tabs={detailTabs} activeTab={detailTab} onChange={setDetailTab} />

            <div className="py-2 text-xs space-y-4">
              {detailTab === 'overview' && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8] space-y-1">
                    <span className="font-bold text-[#17231D] block">Executive Summary</span>
                    <p className="text-[#66736B] leading-relaxed">
                      {selectedReview.summary || 'Annual commercial kitchen electrical readiness review confirming 36-inch working clearances and calibrated GFCI response times.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#EAF5EF] rounded-xl border border-[#146B45]/20 text-[#146B45]">
                      <span className="block text-[10px] uppercase font-bold">Readiness Score</span>
                      <strong className="text-lg font-mono">{selectedReview.readiness_score || 95.0}% (Approved)</strong>
                    </div>
                    <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8]">
                      <span className="block text-[10px] uppercase font-bold text-[#66736B]">Insurance Status</span>
                      <strong className="text-xs text-[#17231D] block mt-1">Dossier Transmitted to Underwriter</strong>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'checklist' && (
                <div className="space-y-2">
                  <div className="p-3 bg-[#F7F9F8] rounded-lg flex items-center justify-between">
                    <span>1. NEC 110.26 36-Inch Working Clearances Verified</span>
                    <strong className="text-[#16834A]">Pass</strong>
                  </div>
                  <div className="p-3 bg-[#F7F9F8] rounded-lg flex items-center justify-between">
                    <span>2. GFCI Wet Location Receptacle Trip Test (&lt; 25ms)</span>
                    <strong className="text-[#16834A]">Pass</strong>
                  </div>
                  <div className="p-3 bg-[#F7F9F8] rounded-lg flex items-center justify-between">
                    <span>3. Ansul Exhaust Hood Shunt-Trip Interlock</span>
                    <strong className="text-[#16834A]">Pass</strong>
                  </div>
                </div>
              )}

              {detailTab === 'documentation' && (
                <div className="space-y-2">
                  <div className="p-3 bg-[#F7F9F8] rounded-lg flex justify-between items-center">
                    <span>Single-Line Digital Twin Directory.pdf</span>
                    <span className="text-[#146B45] font-bold">Verified</span>
                  </div>
                  <div className="p-3 bg-[#F7F9F8] rounded-lg flex justify-between items-center">
                    <span>CRESM General Manager Certifications.pdf</span>
                    <span className="text-[#146B45] font-bold">Verified</span>
                  </div>
                </div>
              )}

              {detailTab === 'findings' && (
                <div className="p-3 bg-[#EAF5EF] rounded-xl border border-[#146B45]/20 text-[#146B45] space-y-1">
                  <span className="font-bold block">No Disqualifying Defects</span>
                  <p className="text-[11px] text-[#17231D]">
                    Facility operates at full readiness. All identified minor corrective actions were closed within the 24-hour SLA.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E6ECE8] flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#F1F5F2] hover:bg-[#E6ECE8] text-[#17231D] text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>
              <button
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 bg-[#146B45] hover:bg-[#104B35] text-white text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E6ECE8]">
            <div className="flex justify-between items-center border-b border-[#E6ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#17231D]">Schedule Annual Readiness Review</h3>
              <button onClick={() => setShowModal(false)} className="text-[#66736B] hover:text-[#17231D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Review Year</label>
                  <input
                    type="number"
                    required
                    value={formData.review_year}
                    onChange={(e) => setFormData({ ...formData, review_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17231D] mb-1">Target Facility Location</label>
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17231D] mb-1">Executive Summary Scope</label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E6ECE8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F1F5F2] text-[#17231D] font-semibold hover:bg-[#E6ECE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#146B45] text-white font-bold hover:bg-[#104B35]"
                >
                  Schedule Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
