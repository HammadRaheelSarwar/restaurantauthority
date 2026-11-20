import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Check,
  Plus,
  Filter,
  Search,
  UserCheck,
  Wrench,
  Calendar,
  AlertTriangle,
  Upload,
  X,
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';

export default function CorrectiveActionsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [actions, setActions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActionForSignOff, setSelectedActionForSignOff] = useState(null);
  const [signOffNotes, setSignOffNotes] = useState('');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('');

  // New Action Form State
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    priority: 'high',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    assigned_to: 'Apex Master Electricians LLC (License #EL-99482)',
    instructions: 'Isolate breaker panel branch, verify zero-energy with multimeter, replace damaged NEMA receptacle, and perform GFCI trip test.'
  });

  useEffect(() => {
    loadActions();
  }, [filterStatus]);

  const loadActions = async () => {
    try {
      const res = await api.getCorrectiveActions(filterStatus === 'all' ? null : filterStatus);
      if (res.success) setActions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const res = await api.updateCorrectiveAction(id, { status: nextStatus });
      if (res.success) {
        addToast(`Corrective action transitioned to ${nextStatus.replace('_', ' ')}`);
        loadActions();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateAction = async (e) => {
    e.preventDefault();
    if (!newAction.title) {
      addToast('Please enter an action title', 'error');
      return;
    }

    try {
      const res = await api.createCorrectiveAction({
        ...newAction,
        status: 'open'
      });
      if (res.success) {
        addToast('Corrective remediation action successfully created');
        setShowCreateModal(false);
        setNewAction({
          title: '',
          description: '',
          priority: 'high',
          due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          assigned_to: 'Apex Master Electricians LLC (License #EL-99482)',
          instructions: ''
        });
        loadActions();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create action', 'error');
    }
  };

  const handleSignOffSubmit = async (e) => {
    e.preventDefault();
    if (!selectedActionForSignOff) return;

    try {
      const res = await api.updateCorrectiveAction(selectedActionForSignOff.id, {
        status: 'closed',
        resolution_notes: signOffNotes || 'Licensed electrician inspected and completed repair with photographic proof.',
        verified_at: new Date().toISOString()
      });
      if (res.success) {
        addToast('Remediation verified & closed under NEC compliance');
        setSelectedActionForSignOff(null);
        setSignOffNotes('');
        setUploadedPhotoUrl('');
        loadActions();
      }
    } catch (err) {
      addToast(err.message || 'Sign-off failed', 'error');
    }
  };

  const filteredActions = actions.filter((act) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      act.title?.toLowerCase().includes(q) ||
      act.description?.toLowerCase().includes(q) ||
      act.assigned_to?.toLowerCase().includes(q)
    );
  });

  const openCount = actions.filter((a) => a.status === 'open').length;
  const inProgressCount = actions.filter((a) => a.status === 'in_progress').length;
  const closedCount = actions.filter((a) => a.status === 'closed' || a.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF5EF] text-[#146B45]">
              CAPA Governance
            </span>
            <span className="text-xs text-[#66736B]">• SLA Tracking & Remediation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
            Corrective Action Management (CAPA)
          </h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Track safety deficiency remediation, assign licensed electricians, and verify photographic closure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Corrective Action</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckSquare}
          label="Total Remediation Items"
          value={actions.length || 6}
          trendLabel="All Active & Historic Items"
          trend="neutral"
        />
        <StatCard
          icon={AlertCircle}
          label="Open Deficiencies"
          value={openCount}
          trendLabel={openCount > 0 ? "Requires Technician Dispatch" : "All Clear"}
          trend={openCount > 0 ? "down" : "up"}
        />
        <StatCard
          icon={Clock}
          label="In Progress Repairs"
          value={inProgressCount}
          trendLabel="Contractor On Site"
          trend="neutral"
        />
        <StatCard
          icon={CheckCircle2}
          label="Remediation Closure"
          value={closedCount}
          trendLabel="100% Photographic Verification"
          trend="up"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6ECE8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]" />
          <input
            type="text"
            placeholder="Search remedial actions, technician, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45] text-[#17231D]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F5F2] p-1 rounded-lg border border-[#E6ECE8] text-xs font-semibold overflow-x-auto">
          {['all', 'open', 'in_progress', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md capitalize transition whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#FFFFFF] text-[#146B45] shadow-xs'
                  : 'text-[#66736B] hover:text-[#17231D]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Action Items List */}
      {filteredActions.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No corrective actions found"
          description="All commercial kitchen electrical hazards are currently addressed or match your filter criteria."
          actionLabel="Create Corrective Action"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredActions.map((act) => {
            const isClosed = act.status === 'closed' || act.status === 'approved';
            const isUrgent = act.priority === 'urgent' || act.priority === 'high';

            return (
              <div
                key={act.id}
                className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E6ECE8] shadow-xs hover:border-[#29A36A]/40 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isClosed
                        ? 'bg-[#EAF5EF] text-[#16834A]'
                        : isUrgent
                        ? 'bg-[#D94848]/10 text-[#D94848]'
                        : 'bg-[#D99A25]/10 text-[#D99A25]'
                    }`}>
                      {isClosed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#17231D]">{act.title}</h3>
                        <span className="font-mono text-[10px] text-[#66736B] bg-[#F1F5F2] px-1.5 py-0.5 rounded">
                          REF #{act.id?.substring(0, 8)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#66736B] mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#66736B]" />
                          <span>Due: {act.due_date || 'Within 72 Hours'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5 text-[#66736B]" />
                          <span>{act.assigned_to || 'Assigned Electrical Contractor'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      act.priority === 'urgent'
                        ? 'bg-[#D94848]/10 text-[#D94848] border border-[#D94848]/30'
                        : act.priority === 'high'
                        ? 'bg-[#D99A25]/10 text-[#D99A25] border border-[#D99A25]/30'
                        : 'bg-[#EAF5EF] text-[#146B45]'
                    }`}>
                      {act.priority || 'High'} Priority
                    </span>
                    <StatusBadge status={act.status} />
                  </div>
                </div>

                <div className="text-xs text-[#17231D] bg-[#F7F9F8] p-3.5 rounded-lg border border-[#E6ECE8] space-y-1">
                  <div className="text-[#66736B] font-medium">{act.description}</div>
                  {act.instructions && (
                    <div className="pt-2 text-[11px] text-[#17231D] border-t border-[#E6ECE8] mt-2">
                      <span className="font-bold text-[#146B45]">Remediation Instructions: </span>
                      <span>{act.instructions}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Row */}
                <div className="pt-3 border-t border-[#E6ECE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-[#66736B]">
                    {act.verified_at ? (
                      <span className="text-[#16834A] font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Photographic Verification Approved • Closed</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#D99A25] font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>SLA Resolution Countdown: 48 Hours Remaining</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {act.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus(act.id, 'in_progress')}
                        className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg font-semibold transition"
                      >
                        Dispatch / In Progress
                      </button>
                    )}

                    {act.status !== 'closed' && act.status !== 'approved' && (
                      <button
                        onClick={() => setSelectedActionForSignOff(act)}
                        className="px-3.5 py-1.5 bg-[#146B45] hover:bg-[#104B35] text-white rounded-lg font-semibold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Sign-off & Verify</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Corrective Action Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#17231D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6ECE8] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6ECE8]">
              <div>
                <h3 className="text-base font-bold text-[#17231D]">Create Corrective Action (CAPA)</h3>
                <p className="text-xs text-[#66736B]">Log a mandatory electrical remediation task</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#66736B] hover:text-[#17231D] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#17231D] mb-1">Deficiency Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Replace Damaged NEMA 14-50 Receptacle on Cookline 1"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17231D] mb-1">Detailed Hazard Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the electrical hazard, overheating, or code non-compliance..."
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#17231D] mb-1">Priority</label>
                  <select
                    value={newAction.priority}
                    onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  >
                    <option value="urgent">Urgent (Immediate Fire Risk)</option>
                    <option value="high">High (48-Hour SLA)</option>
                    <option value="medium">Medium (7-Day SLA)</option>
                    <option value="low">Low (Next Routine Maintenance)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#17231D] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newAction.due_date}
                    onChange={(e) => setNewAction({ ...newAction, due_date: e.target.value })}
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#17231D] mb-1">Assigned Licensed Electrical Contractor</label>
                <input
                  type="text"
                  value={newAction.assigned_to}
                  onChange={(e) => setNewAction({ ...newAction, assigned_to: e.target.value })}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17231D] mb-1">Remediation Instructions for Electrician</label>
                <textarea
                  rows={2}
                  value={newAction.instructions}
                  onChange={(e) => setNewAction({ ...newAction, instructions: e.target.value })}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6ECE8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146B45] hover:bg-[#104B35] text-white rounded-lg font-bold shadow-xs"
                >
                  Create Remediation Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photographic Sign-Off & Verification Modal */}
      {selectedActionForSignOff && (
        <div className="fixed inset-0 z-50 bg-[#17231D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6ECE8] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6ECE8]">
              <div>
                <h3 className="text-base font-bold text-[#17231D]">Verification & Closure Sign-Off</h3>
                <p className="text-xs text-[#66736B]">Certify licensed completion of remedial work</p>
              </div>
              <button
                onClick={() => setSelectedActionForSignOff(null)}
                className="text-[#66736B] hover:text-[#17231D] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSignOffSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8]">
                <div className="font-bold text-[#17231D]">{selectedActionForSignOff.title}</div>
                <div className="text-[#66736B] text-[11px] mt-0.5">{selectedActionForSignOff.description}</div>
              </div>

              {/* Photo Upload Simulator */}
              <div>
                <label className="block font-medium text-[#17231D] mb-1">
                  Photographic Proof of Completion (Mandatory)
                </label>
                <div className="border-2 border-dashed border-[#E6ECE8] hover:border-[#146B45] rounded-xl p-4 text-center cursor-pointer bg-[#F7F9F8] transition">
                  <Camera className="w-6 h-6 text-[#146B45] mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-[#146B45] block">
                    {uploadedPhotoUrl ? 'Photo Uploaded: repair_evidence_verified.jpg' : 'Click to Upload Resolution Photograph'}
                  </span>
                  <span className="text-[11px] text-[#66736B]">
                    JPG, PNG, or thermal scan capture up to 10MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="photoUploadInput"
                    onChange={() => setUploadedPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758')}
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setUploadedPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758')}
                      className="px-3 py-1 bg-[#FFFFFF] border border-[#E6ECE8] rounded-md text-[11px] font-medium text-[#17231D]"
                    >
                      Attach Sample Proof
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#17231D] mb-1">Electrician Resolution Notes & Test Log</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Replaced faulty receptacle, torqued lugs to 35 in-lbs, performed GFCI trip test in 18ms. Operational."
                  value={signOffNotes}
                  onChange={(e) => setSignOffNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div className="p-3 bg-[#EAF5EF] rounded-lg border border-[#29A36A]/30 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#146B45] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#17231D]">
                  By signing off, you certify under NEC NFPA 70 guidelines that this electrical hazard has been fully mitigated.
                </span>
              </div>

              <div className="pt-3 border-t border-[#E6ECE8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedActionForSignOff(null)}
                  className="px-4 py-2 border border-[#E6ECE8] hover:bg-[#F1F5F2] text-[#17231D] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16834A] hover:bg-[#146B45] text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Close Defect</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
