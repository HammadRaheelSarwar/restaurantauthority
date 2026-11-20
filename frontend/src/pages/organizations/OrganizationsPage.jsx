import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  Users,
  UtensilsCrossed,
  Download,
  Calendar,
  Clock,
  Archive,
  Edit,
  Activity,
  Layers,
  ChevronDown,
  MoreVertical,
  Utensils,
  Coffee,
  Sparkles,
  ClipboardCheck,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function OrganizationsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'inactive'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [drawerTab, setDrawerTab] = useState('overview'); // 'overview' | 'restaurants' | 'locations' | 'users' | 'activity'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Reference Organizations matching Image 3
  const [organizationsList, setOrganizationsList] = useState([
    {
      id: 'ORG-0001',
      name: 'Downtown Dining Group',
      email: 'admin@downtowndining.com',
      phone: '(212) 555-0184',
      address: '245 Madison Ave, New York, NY 10016',
      businessRegNo: 'BRN-78451236',
      createdOn: 'Apr 20, 2025',
      restaurants: 28,
      locations: 74,
      users: 62,
      assessments: 18,
      readiness: 82,
      status: 'Active',
      icon: Utensils,
      description: 'A multi-restaurant group with locations across the city.'
    },
    {
      id: 'ORG-0002',
      name: 'Lakeside Restaurants LLC',
      email: 'contact@lakesiderestaurants.com',
      phone: '(312) 555-0192',
      address: '120 Michigan Ave, Chicago, IL 60601',
      businessRegNo: 'BRN-65123891',
      createdOn: 'Apr 15, 2025',
      restaurants: 18,
      locations: 46,
      users: 41,
      assessments: 14,
      readiness: 88,
      status: 'Active',
      icon: Building2,
      description: 'Premier lakeside hospitality and dining chain across Midwest.'
    },
    {
      id: 'ORG-0003',
      name: 'Riverside Hospitality',
      email: 'ops@riversidehospitality.com',
      phone: '(415) 555-0133',
      address: '500 Embarcadero, San Francisco, CA 94105',
      businessRegNo: 'BRN-44218902',
      createdOn: 'Apr 10, 2025',
      restaurants: 16,
      locations: 40,
      users: 38,
      assessments: 12,
      readiness: 94,
      status: 'Active',
      icon: UtensilsCrossed,
      description: 'Waterfront bistros and multi-phase culinary concepts.'
    },
    {
      id: 'ORG-0004',
      name: 'Pinecrest Food Services',
      email: 'info@pinecrestfoods.com',
      phone: '(305) 555-0177',
      address: '800 Brickell Ave, Miami, FL 33131',
      businessRegNo: 'BRN-33129845',
      createdOn: 'Apr 5, 2025',
      restaurants: 12,
      locations: 32,
      users: 28,
      assessments: 10,
      readiness: 76,
      status: 'Active',
      icon: Coffee,
      description: 'Quick-service and casual dining portfolio.'
    },
    {
      id: 'ORG-0005',
      name: 'Metro Kitchen Group',
      email: 'admin@metrokitchen.com',
      phone: '(206) 555-0144',
      address: '400 Pine St, Seattle, WA 98101',
      businessRegNo: 'BRN-22987143',
      createdOn: 'Mar 28, 2025',
      restaurants: 10,
      locations: 26,
      users: 24,
      assessments: 8,
      readiness: 91,
      status: 'Active',
      icon: Building2,
      description: 'Urban kitchens and fast casual dining hubs.'
    },
    {
      id: 'ORG-0006',
      name: 'Hilltop Restaurant Partners',
      email: 'contact@hilltoprestaurants.com',
      phone: '(303) 555-0165',
      address: '1600 Broadway, Denver, CO 80202',
      businessRegNo: 'BRN-11928374',
      createdOn: 'Mar 20, 2025',
      restaurants: 8,
      locations: 20,
      users: 18,
      assessments: 6,
      readiness: 68,
      status: 'Inactive',
      icon: UtensilsCrossed,
      description: 'Seasonal elevated dining lodges undergoing electrical refit.'
    },
    {
      id: 'ORG-0007',
      name: 'Central Eats Corporation',
      email: 'info@centraleats.com',
      phone: '(512) 555-0188',
      address: '700 Congress Ave, Austin, TX 78701',
      businessRegNo: 'BRN-88291034',
      createdOn: 'Mar 15, 2025',
      restaurants: 8,
      locations: 18,
      users: 16,
      assessments: 5,
      readiness: 85,
      status: 'Active',
      icon: Utensils,
      description: 'Tex-Mex and artisan smokehouse restaurant operator.'
    },
    {
      id: 'ORG-0008',
      name: 'West End Dining Co.',
      email: 'admin@westenddining.com',
      phone: '(617) 555-0129',
      address: '100 Newbury St, Boston, MA 02116',
      businessRegNo: 'BRN-77392018',
      createdOn: 'Mar 10, 2025',
      restaurants: 6,
      locations: 14,
      users: 12,
      assessments: 4,
      readiness: 62,
      status: 'Inactive',
      icon: Building2,
      description: 'Historic district culinary locations undergoing panel upgrades.'
    }
  ]);

  // Selected Organization for Right Details Drawer (Defaults to Downtown Dining Group matching Image 3)
  const [selectedOrg, setSelectedOrg] = useState(organizationsList[0]);

  // Add Organization Form State
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    businessRegNo: ''
  });

  const filteredOrgs = organizationsList.filter((org) => {
    if (activeTab === 'active' && org.status !== 'Active') return false;
    if (activeTab === 'inactive' && org.status !== 'Inactive') return false;
    if (statusFilter !== 'All' && org.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return org.name.toLowerCase().includes(q) || org.email.toLowerCase().includes(q) || org.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleExport = () => {
    const csv = [
      ['Organization ID', 'Name', 'Email', 'Restaurants', 'Locations', 'Users', 'Status', 'Created On'],
      ...organizationsList.map(o => [o.id, o.name, o.email, o.restaurants, o.locations, o.users, o.status, o.createdOn])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'REA_Organizations_Export.csv';
    a.click();
    addToast('Organizations exported to CSV');
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!newOrgForm.name) return;
    const newEntry = {
      id: `ORG-000${organizationsList.length + 1}`,
      name: newOrgForm.name,
      email: newOrgForm.email || 'admin@neworg.com',
      phone: newOrgForm.phone || '(555) 000-0000',
      address: newOrgForm.address || 'New York, NY',
      businessRegNo: newOrgForm.businessRegNo || `BRN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdOn: 'Apr 25, 2025',
      restaurants: 1,
      locations: 1,
      users: 1,
      assessments: 0,
      readiness: 75,
      status: 'Active',
      icon: Building2,
      description: 'Newly registered hospitality organization.'
    };
    setOrganizationsList([newEntry, ...organizationsList]);
    setSelectedOrg(newEntry);
    setShowAddModal(false);
    setNewOrgForm({ name: '', email: '', phone: '', address: '', businessRegNo: '' });
    addToast('New organization created successfully');
  };

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto pb-12">
      {/* 1. BREADCRUMBS & HEADER (Matching Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-[#666666] font-medium mb-1">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span className="mx-1.5">›</span>
            <span className="text-[#111111]">Organizations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Organization Management
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Create and manage restaurant organizations, view details, and monitor their electrical readiness.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Organization</span>
        </button>
      </div>

      {/* 2. FOUR TOP STAT CARDS (Matching Image 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111111] leading-tight">12</div>
            <div className="text-xs text-[#666666] font-medium">Organizations</div>
            <div className="text-[10px] text-[#666666] mt-0.5">↑ 2 this month</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111111] leading-tight">128</div>
            <div className="text-xs text-[#666666] font-medium">Restaurants</div>
            <div className="text-[10px] text-[#666666] mt-0.5">↑ 6 this month</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111111] leading-tight">342</div>
            <div className="text-xs text-[#666666] font-medium">Locations</div>
            <div className="text-[10px] text-[#666666] mt-0.5">↑ 12 this month</div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111111] leading-tight">286</div>
            <div className="text-xs text-[#666666] font-medium">Users</div>
            <div className="text-[10px] text-[#666666] mt-0.5">↑ 18 this month</div>
          </div>
        </div>
      </div>

      {/* 3. TABS AND EXPORT ROW (Matching Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-2">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 relative transition ${
              activeTab === 'all'
                ? 'text-[#111111] font-bold'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            <span>All Organizations (12)</span>
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2 relative transition ${
              activeTab === 'active'
                ? 'text-[#111111] font-bold'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            <span>Active (10)</span>
            {activeTab === 'active' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`pb-2 relative transition ${
              activeTab === 'inactive'
                ? 'text-[#111111] font-bold'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            <span>Inactive (2)</span>
            {activeTab === 'inactive' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
            )}
          </button>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 bg-white border border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#111111] px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5 text-[#666666]" />
          <span>Export</span>
        </button>
      </div>

      {/* 4. SEARCH AND FILTER CONTROLS ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations..."
            className="w-full bg-white border border-[#E5E5E5] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] transition"
          />
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E5E5E5] rounded-lg pl-3 pr-8 py-1.5 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111] transition cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Inactive">Status: Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#666666] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white border border-[#E5E5E5] rounded-lg pl-3 pr-8 py-1.5 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111] transition cursor-pointer"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Alphabetical">Sort: Name (A-Z)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#666666] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter button */}
          <button className="p-2 bg-white border border-[#E5E5E5] hover:bg-[#FAFAFA] rounded-lg text-[#111111] transition">
            <Filter className="w-3.5 h-3.5 text-[#666666]" />
          </button>
        </div>
      </div>

      {/* 5. SPLIT LAYOUT: DATA TABLE (LEFT) + ORGANIZATION DETAILS DRAWER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Organization Table (Spans 8 cols when drawer open, 12 if closed) */}
        <div className={`${selectedOrg ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-xl border border-[#E5E5E5] shadow-2xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[#888888] border-b border-[#E5E5E5] bg-[#FAFAFA]">
                  <th className="py-3 px-3.5 w-10">
                    <input type="checkbox" className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0" />
                  </th>
                  <th className="py-3 px-3 font-semibold text-[#666666]">Organization Name</th>
                  <th className="py-3 px-3 font-semibold text-[#666666]">Restaurants</th>
                  <th className="py-3 px-3 font-semibold text-[#666666]">Locations</th>
                  <th className="py-3 px-3 font-semibold text-[#666666]">Users</th>
                  <th className="py-3 px-3 font-semibold text-[#666666]">Status</th>
                  <th className="py-3 px-3 font-semibold text-[#666666]">Created On</th>
                  <th className="py-3 px-3 font-semibold text-[#666666] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {filteredOrgs.map((org) => {
                  const Icon = org.icon || Building2;
                  const isSelected = selectedOrg?.id === org.id;

                  return (
                    <tr
                      key={org.id}
                      onClick={() => setSelectedOrg(org)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-[#FAFAFA]' : 'hover:bg-[#F9F9F9]'
                      }`}
                    >
                      <td className="py-3 px-3.5" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {/* Black square badge with white icon */}
                          <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#111111]">{org.name}</div>
                            <div className="text-[11px] text-[#666666]">{org.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#111111] font-medium">{org.restaurants}</td>
                      <td className="py-3 px-3 text-[#111111] font-medium">{org.locations}</td>
                      <td className="py-3 px-3 text-[#111111] font-medium">{org.users}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                          org.status === 'Active'
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#EAEAEA] text-[#666666]'
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#666666] text-[11px]">{org.createdOn}</td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 text-[#666666] hover:text-[#111111] rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination matching Image 3 */}
          <div className="p-3.5 border-t border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#666666]">
            <div>Showing 1 to 8 of 12 organizations</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded border border-[#E5E5E5] text-[#666666] hover:bg-[#FAFAFA] flex items-center justify-center">
                  ‹
                </button>
                <button className="w-7 h-7 rounded bg-[#111111] text-white font-bold flex items-center justify-center">
                  1
                </button>
                <button className="w-7 h-7 rounded border border-[#E5E5E5] text-[#666666] hover:bg-[#FAFAFA] flex items-center justify-center">
                  2
                </button>
                <button className="w-7 h-7 rounded border border-[#E5E5E5] text-[#666666] hover:bg-[#FAFAFA] flex items-center justify-center">
                  ›
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select className="border border-[#E5E5E5] rounded px-1.5 py-0.5 bg-white text-xs">
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Organization Details Drawer (Spans 4 cols, Matching Image 3) */}
        {selectedOrg && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-[#E5E5E5] shadow-2xs p-5 space-y-5">
            {/* Header with Title and Close Button */}
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-sm text-[#111111]">Organization Details</h2>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-[#888888] hover:text-[#111111] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Organization Identity Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center shrink-0">
                {selectedOrg.icon ? <selectedOrg.icon className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#111111] truncate">{selectedOrg.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    selectedOrg.status === 'Active' ? 'bg-[#EAEAEA] text-[#111111]' : 'bg-[#EAEAEA] text-[#666666]'
                  }`}>
                    {selectedOrg.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#666666] mt-0.5 leading-tight">{selectedOrg.description}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#E5E5E5] text-xs font-semibold gap-4 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'restaurants', label: 'Restaurants' },
                { id: 'locations', label: 'Locations' },
                { id: 'users', label: 'Users' },
                { id: 'activity', label: 'Activity' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerTab(tab.id)}
                  className={`pb-2 transition relative whitespace-nowrap ${
                    drawerTab === tab.id
                      ? 'text-[#111111] font-bold'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {drawerTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview Content */}
            {drawerTab === 'overview' && (
              <div className="space-y-5 text-xs">
                {/* Organization Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#111111]">Organization Information</h4>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#111111] hover:underline font-semibold"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Organization ID</span>
                      <span className="font-semibold text-[#111111] font-mono">{selectedOrg.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Email</span>
                      <span className="font-medium text-[#111111]">{selectedOrg.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Phone</span>
                      <span className="font-medium text-[#111111]">{selectedOrg.phone}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[#666666] shrink-0">Address</span>
                      <span className="font-medium text-[#111111] text-right">{selectedOrg.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Business Reg. No.</span>
                      <span className="font-semibold text-[#111111] font-mono">{selectedOrg.businessRegNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Created On</span>
                      <span className="font-medium text-[#111111]">{selectedOrg.createdOn}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Section (4 Grid Boxes) */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-[#111111]">Summary</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
                      <div className="flex items-center gap-2 text-[#666666] text-[10px]">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#111111]" />
                      </div>
                      <div className="text-base font-bold text-[#111111] mt-1">{selectedOrg.restaurants}</div>
                      <div className="text-[10px] text-[#666666]">Restaurants</div>
                    </div>

                    <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
                      <div className="flex items-center gap-2 text-[#666666] text-[10px]">
                        <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                      </div>
                      <div className="text-base font-bold text-[#111111] mt-1">{selectedOrg.locations}</div>
                      <div className="text-[10px] text-[#666666]">Locations</div>
                    </div>

                    <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
                      <div className="flex items-center gap-2 text-[#666666] text-[10px]">
                        <Users className="w-3.5 h-3.5 text-[#111111]" />
                      </div>
                      <div className="text-base font-bold text-[#111111] mt-1">{selectedOrg.users}</div>
                      <div className="text-[10px] text-[#666666]">Users</div>
                    </div>

                    <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
                      <div className="flex items-center gap-2 text-[#666666] text-[10px]">
                        <ClipboardCheck className="w-3.5 h-3.5 text-[#111111]" />
                      </div>
                      <div className="text-base font-bold text-[#111111] mt-1">{selectedOrg.assessments}</div>
                      <div className="text-[10px] text-[#666666]">Assessments</div>
                    </div>
                  </div>
                </div>

                {/* Electrical Readiness Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#111111] flex items-center gap-1">
                      <span>Electrical Readiness</span>
                      <Info className="w-3 h-3 text-[#888888]" />
                    </span>
                    <span className="font-bold text-xs text-[#111111]">{selectedOrg.readiness}%</span>
                  </div>
                  <div className="w-full bg-[#EAEAEA] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-[#111111]"
                      style={{ width: `${selectedOrg.readiness}%` }}
                    />
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#111111]">Recent Activity</h4>
                    <button className="text-[11px] text-[#111111] hover:underline font-semibold">
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5 text-[11px]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold text-[#111111]">Restaurant "Central Grill" added</div>
                        <div className="text-[10px] text-[#888888]">Apr 24, 2025, 10:14 AM</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold text-[#111111]">New user invited: manager@centralgrill.com</div>
                        <div className="text-[10px] text-[#888888]">Apr 22, 2025, 3:26 PM</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold text-[#111111]">Assessment A-1024 completed</div>
                        <div className="text-[10px] text-[#888888]">Apr 21, 2025, 11:03 AM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Restaurants */}
            {drawerTab === 'restaurants' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#111111]">Restaurants in {selectedOrg.name}</h4>
                  <Link to="/restaurants" className="text-[11px] font-semibold text-[#111111] hover:underline">
                    Manage All
                  </Link>
                </div>
                <div className="space-y-2">
                  {['Downtown Flagship', 'Midtown Bistro', 'Parkside Cafe', 'Harbor Grill'].map((rest, i) => (
                    <div key={i} className="p-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#111111]">{rest}</div>
                        <span className="text-[10px] text-[#666666]">Active Service • 400A Main</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#16834A] bg-[#16834A]/10 px-2 py-0.5 rounded">
                        Compliant
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Locations */}
            {drawerTab === 'locations' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#111111]">Physical Branches</h4>
                  <Link to="/locations" className="text-[11px] font-semibold text-[#111111] hover:underline">
                    Add Location
                  </Link>
                </div>
                <div className="space-y-2">
                  {['145 Main St, Manhattan', '82 5th Ave, Brooklyn', '290 Queens Blvd, Queens'].map((loc, i) => (
                    <div key={i} className="p-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#666666]" />
                        <span className="font-medium text-[#111111]">{loc}</span>
                      </div>
                      <span className="text-[10px] text-[#666666]">Zone 1</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Users */}
            {drawerTab === 'users' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#111111]">Authorized Personnel</h4>
                  <button className="text-[11px] font-semibold text-[#111111] hover:underline">
                    + Invite User
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Sarah Johnson', role: 'Super Admin', email: 'sarah@rea.org' },
                    { name: 'Elena Rostova', role: 'General Manager', email: 'elena@downtowndining.com' },
                    { name: 'David Wilson', role: 'Lead Assessor', email: 'david@inspections.com' }
                  ].map((u, i) => (
                    <div key={i} className="p-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#111111]">{u.name}</div>
                        <div className="text-[10px] text-[#666666]">{u.email}</div>
                      </div>
                      <span className="text-[10px] font-medium bg-[#EAEAEA] px-2 py-0.5 rounded text-[#111111]">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Activity */}
            {drawerTab === 'activity' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-xs text-[#111111]">Tenant Audit Trail</h4>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5]">
                    <div className="font-semibold text-[#111111]">Annual Readiness Review Approved</div>
                    <div className="text-[10px] text-[#888888]">Apr 20, 2025 • Signed by David Wilson</div>
                  </div>
                  <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5]">
                    <div className="font-semibold text-[#111111]">Main Cookline Breaker Inspected</div>
                    <div className="text-[10px] text-[#888888]">Apr 15, 2025 • Thermal log 72°F normal</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD ORGANIZATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="font-bold text-base text-[#111111]">Add New Organization</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#666666] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#111111] mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrgForm.name}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                  placeholder="e.g. Skyline Hospitality Partners"
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111111] mb-1">Primary Email</label>
                <input
                  type="email"
                  required
                  value={newOrgForm.email}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, email: e.target.value })}
                  placeholder="e.g. admin@skylinegroup.com"
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111111] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newOrgForm.phone}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111111] mb-1">Corporate Address</label>
                <input
                  type="text"
                  value={newOrgForm.address}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, address: e.target.value })}
                  placeholder="500 5th Ave, New York, NY"
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-lg font-semibold shadow-xs"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="font-bold text-base text-[#111111]">Edit {selectedOrg.name}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-[#666666] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#111111] mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue={selectedOrg.name}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111111] mb-1">Corporate Email</label>
                <input
                  type="email"
                  defaultValue={selectedOrg.email}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111111] mb-1">Phone</label>
                <input
                  type="text"
                  defaultValue={selectedOrg.phone}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111111] mb-1">Headquarters Address</label>
                <input
                  type="text"
                  defaultValue={selectedOrg.address}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    addToast('Organization details updated');
                  }}
                  className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
