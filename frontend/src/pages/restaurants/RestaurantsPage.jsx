import React, { useEffect, useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  MapPin,
  Mail,
  Phone,
  Search,
  ChevronRight,
  Building2,
  FileDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  AlertTriangle,
  CalendarCheck2,
  FileText,
  Users,
  History,
  X,
  Camera,
  LayoutGrid,
  List
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Tabs from '../../components/ui/Tabs';

export default function RestaurantsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    restaurant_type: 'Full Service Hospitality',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: ''
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await api.getRestaurants();
      if (res.success) {
        setRestaurants(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createRestaurant(formData);
      if (res.success) {
        addToast('Restaurant registered successfully');
        setShowModal(false);
        setFormData({
          name: '',
          business_name: '',
          restaurant_type: 'Full Service Hospitality',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          postal_code: ''
        });
        loadRestaurants();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create restaurant', 'error');
    }
  };

  const tableColumns = [
    {
      header: 'Restaurant Concept',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#111111] block">{row.name}</span>
            <span className="text-[11px] text-[#666666]">{row.business_name || 'Apex Hospitality Brands'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Format',
      accessorKey: 'restaurant_type',
      cell: (row) => <span className="text-xs text-[#666666]">{row.restaurant_type || 'Full Service'}</span>
    },
    {
      header: 'Location / Market',
      accessorKey: 'city',
      cell: (row) => <span className="text-xs text-[#111111]">{row.city ? `${row.city}, ${row.state}` : 'New York, NY'}</span>
    },
    {
      header: 'Readiness Index',
      cell: () => (
        <span className="font-bold font-mono text-xs text-[#16834A] bg-[#16834A]/10 px-2 py-0.5 rounded">
          94.5% Compliant
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status || 'active'} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => setSelectedRestaurant(row)}
          className="px-2.5 py-1 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-lg transition"
        >
          Details Drawer
        </button>
      )
    }
  ];

  const detailTabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'assessments', label: 'Assessments', icon: ShieldCheck },
    { id: 'equipment', label: 'Equipment', icon: Cpu },
    { id: 'panels', label: 'Electrical Panels', icon: Zap },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'reviews', label: 'Annual Reviews', icon: CalendarCheck2 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'activity', label: 'Activity Log', icon: History }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#111111] text-white">
              RESTAURANT PORTFOLIO
            </span>
            <span className="text-xs text-[#666666]">• Commercial Food Service Operations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Restaurant Management & Kitchen Safety Roster
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Oversee restaurant concepts, physical kitchen equipment inventories, and electrical readiness status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-[#F7F7F7] border border-[#E5E5E5] p-1 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition ${viewMode === 'table' ? 'bg-white shadow-xs text-[#111111]' : 'text-[#666666]'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded transition ${viewMode === 'cards' ? 'bg-white shadow-xs text-[#111111]' : 'text-[#666666]'}`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#111111] hover:bg-black text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Restaurant</span>
          </button>
        </div>
      </div>

      {/* Main View: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <DataTable
            data={restaurants}
            columns={tableColumns}
            searchable={true}
            searchPlaceholder="Search restaurant concept, address, or city..."
          />
        </div>
      ) : (
        /* Card Grid View Matching Reference 4 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-4 hover:border-[#111111] transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#111111]">{rest.name}</h3>
                      <span className="text-[11px] text-[#666666]">{rest.city || 'New York'}, {rest.state || 'NY'}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#16834A]/10 text-[#16834A]">
                    94.5% Compliant
                  </span>
                </div>

                <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Main Distribution Panel:</span>
                    <span className="font-semibold text-[#111111]">MDP-1 (400A 3-Phase)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Working Clearance:</span>
                    <span className="font-semibold text-[#16834A]">✓ 42" Unobstructed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Certified Manager:</span>
                    <span className="font-semibold text-[#111111]">Elena Rostova, CRESM</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
                <StatusBadge status={rest.status || 'active'} />
                <button
                  onClick={() => setSelectedRestaurant(rest)}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-lg transition"
                >
                  View Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD RESTAURANT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div>
                <h3 className="text-base font-bold text-[#111111]">Add Restaurant Concept</h3>
                <p className="text-xs text-[#666666]">Register a commercial food service unit</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#666666] hover:text-[#111111] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-medium text-[#111111] mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Downtown Flagship"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#111111] mb-1">Brand Entity Name</label>
                  <input
                    type="text"
                    placeholder="Apex Hospitality Brands"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#111111] mb-1">Format</label>
                  <select
                    value={formData.restaurant_type}
                    onChange={(e) => setFormData({ ...formData, restaurant_type: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  >
                    <option>Full Service Hospitality</option>
                    <option>Quick Service Restaurant (QSR)</option>
                    <option>Commercial Commissary Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#111111] mb-1">Corporate Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="manager@apex-downtown.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#111111] mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-[#111111] mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="450 Lexington Ave, New York, NY"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E5E5E5] hover:bg-[#F0F0F0] text-[#111111] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-lg font-bold shadow-xs"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10-TAB RESTAURANT DETAILS DRAWER / MODAL */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#E5E5E5] flex items-start justify-between bg-[#F7F7F7]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#111111]">{selectedRestaurant.name}</h2>
                    <StatusBadge status={selectedRestaurant.status || 'active'} />
                  </div>
                  <span className="text-xs text-[#666666]">
                    {selectedRestaurant.address || '450 Lexington Ave'}, {selectedRestaurant.city || 'New York'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRestaurant(null)}
                className="text-[#666666] hover:text-[#111111] p-1.5 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 10-Tab Navigation Bar */}
            <div className="border-b border-[#E5E5E5] px-6 bg-white overflow-x-auto flex gap-1 text-xs">
              {detailTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = detailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id)}
                    className={`flex items-center gap-1.5 py-3 px-3 border-b-2 font-medium transition whitespace-nowrap ${
                      isActive
                        ? 'border-[#111111] text-[#111111] font-bold'
                        : 'border-transparent text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#111111] block">Electrical Readiness Standing</span>
                      <span className="text-[11px] text-[#666666]">NEC 110.26 working clearance and cookline GFCI compliance</span>
                    </div>
                    <span className="font-mono font-bold text-base text-[#16834A]">94.5% Compliant</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-[#E5E5E5]">
                    <div>
                      <span className="text-[#666666] block">Corporate Manager:</span>
                      <span className="font-semibold text-[#111111]">Elena Rostova, CRESM</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Main Service Entry:</span>
                      <span className="font-semibold text-[#111111]">400A 120/208V 3-Phase</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Contact Email:</span>
                      <span className="font-semibold text-[#111111]">{selectedRestaurant.email || 'manager@apex.com'}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block">Direct Phone:</span>
                      <span className="font-semibold text-[#111111]">{selectedRestaurant.phone || '+1 (555) 234-5678'}</span>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'locations' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                  <span className="font-bold text-[#111111] block">Facility #NYC-01 (Flagship Cookline)</span>
                  <span className="text-[#666666] text-[11px]">Working Clearance: 42 Inches • GFCI: 100% Tested</span>
                </div>
              )}

              {detailTab === 'assessments' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111111]">Annual Site Assessment Q1 2026</span>
                    <span className="text-[11px] text-[#666666] block">Conducted by Inspector Martinez, PE</span>
                  </div>
                  <span className="font-mono font-bold text-[#16834A]">Score: 94.5%</span>
                </div>
              )}

              {detailTab === 'equipment' && (
                <div className="space-y-2">
                  <div className="p-3 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] flex justify-between">
                    <span>Rational iCombi Pro 10-Full (50A 3-Phase)</span>
                    <span className="font-bold text-[#16834A]">Operational</span>
                  </div>
                  <div className="p-3 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] flex justify-between">
                    <span>Pitco Solstice Electric Fryer (40A 208V)</span>
                    <span className="font-bold text-[#16834A]">Operational</span>
                  </div>
                </div>
              )}

              {detailTab === 'panels' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-2">
                  <span className="font-bold text-[#111111] block">Main Distribution Panel (MDP-1)</span>
                  <span className="text-[#666666] text-[11px] block">Square D NQ 42-Circuit • 400A Main • 36" Working Space Clear</span>
                </div>
              )}

              {detailTab === 'incidents' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                  <span className="font-bold text-[#111111] block">Minor Breaker Trip on Fryer Circuit #14</span>
                  <span className="text-[#666666] text-[11px] block">Resolved by licensed contractor • Replaced 40A 2-pole breaker</span>
                </div>
              )}

              {detailTab === 'reviews' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                  <span className="font-bold text-[#111111] block">2026 Annual Electrical Readiness Review</span>
                  <span className="text-[#16834A] text-[11px] font-bold block">Status: Approved by Authority</span>
                </div>
              )}

              {detailTab === 'documents' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                  <span className="font-bold text-[#111111] block">Signed Single-Line Panel Schedule (MDP-1.pdf)</span>
                  <span className="text-[#666666] text-[11px] block">Verified by Municipal Electrical Inspector</span>
                </div>
              )}

              {detailTab === 'team' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                  <span className="font-bold text-[#111111] block">Elena Rostova, CRESM</span>
                  <span className="text-[#666666] text-[11px] block">Certified Restaurant Electrical Safety Manager (Valid through 2028)</span>
                </div>
              )}

              {detailTab === 'activity' && (
                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                  <span className="font-bold text-[#111111] block">Audit sign-off completed</span>
                  <span className="text-[#666666] text-[11px] block">Chief Inspector approved Q1 assessment records</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E5E5E5] bg-[#F7F7F7] flex justify-end">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-lg text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
