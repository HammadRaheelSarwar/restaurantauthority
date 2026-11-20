import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Zap,
  Wrench,
  Camera,
  MapPin,
  ArrowRight,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function IncidentsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [incidents, setIncidents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const [formData, setFormData] = useState({
    title: 'Water Spray Ingress into Bar Prep GFCI Receptacle',
    category: 'water_ingress',
    severity: 'critical',
    location_id: '',
    incident_date: new Date().toISOString().split('T')[0],
    incident_time: '21:30',
    description: 'During closing kitchen washdown, high-pressure water spray entered the bar blender receptacle due to a damaged hinged in-use cover. The 20A GFCI tripped instantly, preventing worker shock.',
    immediate_actions: 'Power isolated at panel MDP-1 circuit #12. Warning lockout tag applied. Temporary cover placed over receptacle.'
  });

  const sampleIncidents = [
    {
      id: 'inc-1',
      title: 'Water Spray Ingress into Bar Prep GFCI Receptacle',
      category: 'water_ingress',
      severity: 'critical',
      location_name: 'Midtown Galleria',
      incident_date: '2026-02-14',
      incident_time: '21:30',
      description: 'During closing washdown, water spray bypassed a cracked weatherproof bubble cover on prep counter. GFCI tripped in 16ms.',
      immediate_actions: 'Circuit locked out. Receptacle dried with warm air blower. Assigned to Titan Electric for NEMA 4X wet-cover replacement.',
      status: 'under_investigation',
      assignedContractor: 'Titan Electric Contracting LLC (Lic #ME-88410)'
    },
    {
      id: 'inc-2',
      title: 'Beverage Pallets Infringing NEC 110.26 36-Inch Clearance',
      category: 'code_violation',
      severity: 'major',
      location_name: 'Midtown Galleria',
      incident_date: '2026-02-12',
      incident_time: '08:15',
      description: 'Morning soda delivery driver stacked 4 pallets of canned beverages directly in front of subpanel MP-1, leaving only 18 inches clearance.',
      immediate_actions: 'General Manager instructed back-of-house staff to relocate pallets to beverage storage bay. Yellow 36" clearance perimeter repainted.',
      status: 'remediation_scheduled',
      assignedContractor: 'Internal Facility Staff'
    },
    {
      id: 'inc-3',
      title: 'Intermittent Nuisance Tripping on Combi Oven Feeder',
      category: 'equipment_malfunction',
      severity: 'medium',
      location_name: 'Downtown Flagship',
      incident_date: '2026-01-28',
      incident_time: '18:45',
      description: '50A 3-pole breaker tripped twice during peak evening roast cycle. Thermal imaging revealed loose Phase C lug running at 48°C.',
      immediate_actions: 'Electrician torqued lug to 50 in-lbs per manufacturer spec. Secondary thermal scan verified normal 31°C operating temp.',
      status: 'closed',
      assignedContractor: 'Metro Commercial MEP Services'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [incRes, locRes] = await Promise.all([
        api.getIncidents(),
        api.getLocations()
      ]);
      if (incRes.success && incRes.data?.length > 0) {
        setIncidents(incRes.data);
      } else {
        setIncidents(sampleIncidents);
      }
      if (locRes.success) {
        setLocations(locRes.data || []);
        if (locRes.data?.length > 0) {
          setFormData(prev => ({ ...prev, location_id: locRes.data[0].id }));
        }
      }
    } catch (err) {
      setIncidents(sampleIncidents);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createIncident(formData);
      if (res.success) {
        addToast('Incident reported successfully. Remedial tracking initiated.');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filtered = incidents.filter(i => {
    if (filterSeverity === 'all') return true;
    return i.severity === filterSeverity;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Electrical Incidents & Anomalies</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-300">
              OSHA 1904 & NFPA 70E
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Rapid hazard intake, arc fault investigation, root-cause analysis, and closed-loop corrective action triage
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Electrical Hazard</span>
        </button>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex gap-2">
        {['all', 'critical', 'major', 'medium', 'minor'].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
              filterSeverity === sev
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Incidents Cards List */}
      <div className="space-y-4">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            onClick={() => setSelectedIncident(inc)}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-rose-300 transition cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                  inc.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{inc.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span>{inc.location_name || 'Midtown Galleria'}</span>
                    <span>•</span>
                    <span className="font-mono">{inc.incident_date} at {inc.incident_time}</span>
                    <span>•</span>
                    <span className="capitalize">{inc.category?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  inc.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {inc.severity}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  inc.status === 'closed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {inc.status?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
              {inc.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Assigned: <strong className="text-slate-800">{inc.assignedContractor || 'Titan Electric Contracting LLC'}</strong></span>
              </div>
              <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                <span>View CAPA Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {selectedIncident.severity} Severity Anomaly
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedIncident.title}</h3>
                <span className="text-xs text-slate-500 font-mono">Logged: {selectedIncident.incident_date}</span>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Incident Narrative</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Immediate Containment Taken</span>
                <p className="text-slate-600 leading-relaxed bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-emerald-950 font-medium">
                  {selectedIncident.immediate_actions}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Remediation Contractor</span>
                <span className="font-bold text-slate-800">{selectedIncident.assignedContractor || 'Titan Electric Contracting LLC'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="bg-brand-900 hover:bg-brand-800 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Electrical Incident</h3>
                <p className="text-xs text-slate-500">Log an electrical hazard, breaker trip, or clearance violation</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Headline</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="water_ingress">Water Spray / Moisture Ingress</option>
                    <option value="equipment_malfunction">Appliance Malfunction / Tripping</option>
                    <option value="code_violation">NEC 110.26 Clearance Infringement</option>
                    <option value="arc_fault">Arc Fault / Scorching / Odor</option>
                    <option value="shock_hazard">Micro-Shock / Grounding Defect</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="critical">Critical (Immediate Shut-off)</option>
                    <option value="major">Major (24-Hour SLA)</option>
                    <option value="medium">Medium</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description of Incident</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Immediate Actions Taken to Make Safe</label>
                <textarea
                  rows={2}
                  required
                  value={formData.immediate_actions}
                  onChange={(e) => setFormData({ ...formData, immediate_actions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}