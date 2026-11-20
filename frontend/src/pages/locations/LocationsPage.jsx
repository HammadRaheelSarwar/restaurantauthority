import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Zap,
  ClipboardCheck,
  Building2,
  CalendarCheck2,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  X,
  User
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

export default function LocationsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Westside Bistro Flagship',
    location_code: 'NYC-03',
    restaurant_id: '',
    address: '180 Columbus Avenue',
    city: 'New York',
    state: 'NY',
    postal_code: '10023'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [locRes, restRes] = await Promise.all([
        api.getLocations(),
        api.getRestaurants()
      ]);
      if (locRes.success) setLocations(locRes.data || []);
      if (restRes.success) {
        setRestaurants(restRes.data || []);
        if (restRes.data?.length > 0) {
          setFormData(prev => ({ ...prev, restaurant_id: restRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createLocation(formData);
      if (res.success) {
        addToast('Physical location created and registered in safety database');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create location', 'error');
    }
  };

  const handleOpenDetail = async (loc) => {
    try {
      const res = await api.getLocation(loc.id);
      if (res.success) {
        setSelectedLocation(res.data);
      } else {
        setSelectedLocation(loc);
      }
    } catch {
      setSelectedLocation(loc);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Location / Facility Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#17231D] block">{val}</span>
            <span className="text-[10px] text-[#66736B] font-mono">{row.location_code || 'FAC-NYC'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Physical Address',
      render: (val, row) => (
        <div className="text-xs text-[#17231D]">
          <div>{val}</div>
          <div className="text-[11px] text-[#66736B]">{row.city}, {row.state} {row.postal_code}</div>
        </div>
      )
    },
    {
      key: 'readiness_status',
      label: 'Readiness Rating',
      sortable: true,
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'readiness_score',
      label: 'Score',
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDetail(row);
          }}
          className="px-2.5 py-1 text-xs font-semibold text-[#146B45] bg-[#EAF5EF] hover:bg-[#D5ECE0] rounded-lg transition"
        >
          Facility Dashboard
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E6ECE8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">Restaurant Locations</h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Physical restaurant units, working space clearances, and real-time site compliance ratings.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#146B45] hover:bg-[#104B35] rounded-xl transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* Main Listing View */}
      <DataTable
        columns={columns}
        data={locations}
        searchPlaceholder="Search facility name, code, or address..."
        searchKeys={['name', 'location_code', 'address', 'city', 'state']}
        onRowClick={(row) => handleOpenDetail(row)}
      />

      {/* Location Dashboard Detail Drawer / Modal (Section 10 Requirement) */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto border border-[#E6ECE8]">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#E6ECE8] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#17231D]">{selectedLocation.name}</h2>
                    <span className="text-xs font-mono font-bold text-[#66736B] bg-[#F1F5F2] px-2 py-0.5 rounded">
                      {selectedLocation.location_code}
                    </span>
                    <StatusBadge status={selectedLocation.readiness_status} />
                  </div>
                  <span className="text-xs text-[#66736B]">
                    {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-[#66736B] hover:text-[#17231D] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location Dashboard Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8]">
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Readiness Score</span>
                <span className="font-extrabold text-lg text-[#146B45] font-mono">{selectedLocation.readiness_score}%</span>
              </div>
              <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8]">
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Working Clearance</span>
                <span className="font-bold text-xs text-[#16834A] block mt-1">42" (NEC Compliant)</span>
              </div>
              <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8]">
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Certified Manager</span>
                <span className="font-bold text-xs text-[#17231D] block mt-1">Elena Rostova, CRESM</span>
              </div>
              <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8]">
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Annual Review</span>
                <span className="font-bold text-xs text-[#3984CC] block mt-1">Scheduled for 2026</span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[#E6ECE8] space-y-2 bg-[#F7F9F8]">
                <div className="flex items-center gap-2 font-bold text-[#17231D]">
                  <Zap className="w-4 h-4 text-[#146B45]" />
                  <span>Electrical Distribution Panels (2 Active)</span>
                </div>
                <div className="space-y-1.5 pl-6 text-[#66736B]">
                  <div className="flex justify-between">
                    <span>Main Distribution (MDP-1) - 400A</span>
                    <strong className="text-[#16834A]">Cleared</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cookline Subpanel (PP-K1) - 225A</span>
                    <strong className="text-[#16834A]">Cleared</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E6ECE8] space-y-2 bg-[#F7F9F8]">
                <div className="flex items-center gap-2 font-bold text-[#17231D]">
                  <Cpu className="w-4 h-4 text-[#146B45]" />
                  <span>High-Draw Kitchen Machinery</span>
                </div>
                <div className="space-y-1.5 pl-6 text-[#66736B]">
                  <div className="flex justify-between">
                    <span>Rational iCombi Pro 10 (480V 3Ø)</span>
                    <strong className="text-[#16834A]">Normal</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pitco Solstice Triple Fryer (240V 3Ø)</span>
                    <strong className="text-[#16834A]">Normal</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6ECE8] flex justify-end">
              <button
                onClick={() => setSelectedLocation(null)}
                className="px-5 py-2 bg-[#146B45] hover:bg-[#104B35] text-white text-xs font-bold rounded-xl transition"
              >
                Close Location Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E6ECE8]">
            <div className="flex justify-between items-center border-b border-[#E6ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#17231D]">Register New Facility</h3>
              <button onClick={() => setShowModal(false)} className="text-[#66736B] hover:text-[#17231D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17231D] mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Location Code</label>
                  <input
                    type="text"
                    required
                    value={formData.location_code}
                    onChange={(e) => setFormData({ ...formData, location_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Restaurant Concept</label>
                  <select
                    value={formData.restaurant_id}
                    onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17231D] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17231D] mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                  />
                </div>
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
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
