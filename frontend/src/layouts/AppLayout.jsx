import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  MapPin,
  ClipboardCheck,
  Cpu,
  Zap,
  AlertTriangle,
  CheckSquare,
  CalendarCheck2,
  Award,
  GraduationCap,
  FileText,
  BarChart3,
  History,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  Menu,
  X,
  Search,
  ChevronRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth, PREVIEW_ACCOUNTS } from '../context/AuthContext';
import { useRealtime } from '../hooks/useRealtime';

export default function AppLayout() {
  const { user, logout, switchRole } = useAuth();
  useRealtime();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Flat sidebar navigation matching Image 2 & 3 references
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['all'] },
    { name: 'Organizations', path: '/organizations', icon: Building2, roles: ['super_admin'] },
    { name: 'Restaurants', path: '/restaurants', icon: UtensilsCrossed, roles: ['super_admin', 'admin', 'restaurant_operator'] },
    { name: 'Locations', path: '/locations', icon: MapPin, roles: ['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager'] },
    { name: 'Assessments', path: '/assessments', icon: ClipboardCheck, roles: ['super_admin', 'admin', 'restaurant_operator', 'electrical_assessor', 'viewer'] },
    { name: 'Equipment', path: '/equipment', icon: Cpu, roles: ['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor'] },
    { name: 'Electrical Panels', path: '/electrical-panels', icon: Zap, roles: ['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor'] },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle, roles: ['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor'] },
    { name: 'Corrective Actions', path: '/corrective-actions', icon: CheckSquare, roles: ['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor'] },
    { name: 'Annual Reviews', path: '/annual-reviews', icon: CalendarCheck2, roles: ['super_admin', 'admin', 'restaurant_operator', 'electrical_assessor'] },
    { name: 'Certifications', path: '/certifications', icon: Award, roles: ['all'] },
    { name: 'Courses & Exams', path: '/certifications?tab=courses', icon: GraduationCap, roles: ['all'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['super_admin', 'admin', 'restaurant_operator', 'viewer'] },
    { name: 'Documents', path: '/documents', icon: FileText, roles: ['all'] },
    { name: 'Notifications', path: '#notifications', icon: Bell, badge: '5', roles: ['all'] },
    { name: 'Audit Logs', path: '/audit-logs', icon: History, roles: ['super_admin', 'admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'admin'] }
  ];

  const currentRole = user?.role || 'super_admin';

  const isVisible = (item) => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(currentRole);
  };

  const getRoleDisplayName = (r) => {
    switch (r) {
      case 'super_admin': return 'Super Admin';
      case 'admin':
      case 'restaurant_operator': return 'Organization Admin';
      case 'restaurant_manager': return 'Restaurant Manager';
      case 'electrical_assessor': return 'Electrical Assessor';
      case 'certification_manager': return 'Certification Manager';
      default: return 'Compliance Viewer';
    }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      const parts = user.full_name.split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return user.full_name.substring(0, 2).toUpperCase();
    }
    return 'SA';
  };

  return (
    <div className="min-h-screen flex bg-[#F7F7F7] text-[#111111] font-sans antialiased">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main REA Sidebar (Matching Image 2 & 3) */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 bg-white border-r border-[#E5E5E5] flex flex-col justify-between transition-all duration-200 select-none ${
          mobileMenuOpen ? 'left-0 w-64' : '-left-64 md:left-0'
        } w-[240px] shrink-0`}
      >
        {/* Top Brand Logo */}
        <div className="h-16 px-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-[#111111]">REA</span>
              <div className="border-l border-[#E5E5E5] pl-2 flex flex-col justify-center">
                <span className="text-[8px] font-black tracking-widest text-[#111111] uppercase leading-none">
                  RESTAURANT
                </span>
                <span className="text-[8px] font-black tracking-widest text-[#666666] uppercase leading-none mt-0.5">
                  ELECTRICAL AUTHORITY
                </span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-[#666666] hover:text-[#111111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-1">
          {navItems.filter(isVisible).map((item) => {
            const Icon = item.icon;
            const isExact = location.pathname === item.path;
            const isNested = item.path !== '/dashboard' && !item.path.startsWith('#') && location.pathname.startsWith(item.path.split('?')[0]);
            const isActive = isExact || isNested;

            if (item.path.startsWith('#')) {
              return (
                <button
                  key={item.name}
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#333333] hover:text-[#111111] hover:bg-[#F5F5F5] transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#666666]" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-[#111111] text-white font-semibold shadow-xs'
                    : 'text-[#333333] hover:text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#666666]'}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Profile Card (Matching Image 2 & 3) */}
        <div className="p-3 border-t border-[#E5E5E5] bg-white">
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F5F5] cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#EAEAEA] text-[#111111] flex items-center justify-center font-bold text-xs shrink-0">
                {getUserInitials()}
              </div>
              <div className="min-w-0 text-left">
                <span className="text-xs font-bold text-[#111111] block truncate leading-tight">
                  {user?.full_name || 'Super Admin'}
                </span>
                <span className="text-[10px] text-[#666666] block truncate">
                  {getRoleDisplayName(user?.role)}
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#888888] shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navigation (Matching Image 1, 2, 3) */}
        <header className="h-16 bg-white border-b border-[#E5E5E5] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar with ⌘ K */}
            <div className="relative hidden md:block w-80 lg:w-96">
              <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, locations, assessments..."
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg pl-8 pr-12 py-1.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] focus:bg-white transition"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <kbd className="bg-[#EDEDED] text-[#666666] text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-[#DDDDDD]">
                  ⌘ K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell with Badge 5 */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-[#111111] hover:bg-[#F5F5F5] transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  5
                </span>
              </button>

              {/* Notification Popup */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E5E5] rounded-xl shadow-xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-2">
                    <span className="text-xs font-bold text-[#111111]">Notifications</span>
                    <span className="text-[10px] font-semibold bg-[#111111] text-white px-2 py-0.5 rounded-full">5 New</span>
                  </div>
                  <div className="space-y-1.5 text-xs max-h-72 overflow-y-auto">
                    <div className="p-2.5 bg-[#F9F9F9] rounded-lg border border-[#EBEBEB]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">Assessment A-1024 Approved</span>
                        <span className="text-[10px] text-[#888888]">10m ago</span>
                      </div>
                      <span className="text-[11px] text-[#666666] block mt-0.5">Downtown Grill passed compliance review.</span>
                    </div>
                    <div className="p-2.5 bg-[#F9F9F9] rounded-lg border border-[#EBEBEB]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">High Severity Incident Reported</span>
                        <span className="text-[10px] text-[#888888]">1h ago</span>
                      </div>
                      <span className="text-[11px] text-[#666666] block mt-0.5">Cookline subpanel breaker tripped under peak load.</span>
                    </div>
                    <div className="p-2.5 bg-[#F9F9F9] rounded-lg border border-[#EBEBEB]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#111111]">CRESM Certificate Issued</span>
                        <span className="text-[10px] text-[#888888]">3h ago</span>
                      </div>
                      <span className="text-[11px] text-[#666666] block mt-0.5">Elena Rostova completed certification requirements.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Help Circle Button */}
            <Link
              to="/about"
              className="p-2 rounded-lg text-[#111111] hover:bg-[#F5F5F5] transition"
              title="REA Compliance Documentation"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* User Profile and Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F5F5F5] transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {getUserInitials()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-[#111111] block leading-tight">
                    {user?.full_name || 'Sarah Johnson'}
                  </span>
                  <span className="text-[10px] text-[#666666] block leading-tight">
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#666666] hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E5E5] rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-2 border-b border-[#E5E5E5]">
                    <div className="text-xs font-bold text-[#111111]">{user?.full_name || 'Sarah Johnson'}</div>
                    <div className="text-[11px] text-[#666666]">{user?.email || 'admin@rea-authority.org'}</div>
                  </div>

                  <div className="py-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] px-1 block mb-1">
                      Quick Role Switcher
                    </span>
                    <div className="space-y-1">
                      {Object.entries(PREVIEW_ACCOUNTS).map(([key, acc]) => (
                        <button
                          key={key}
                          onClick={() => {
                            switchRole(key);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                            user?.role === key
                              ? 'bg-[#111111] text-white font-semibold'
                              : 'hover:bg-[#F5F5F5] text-[#111111]'
                          }`}
                        >
                          <div>
                            <div className="capitalize font-medium">{acc.role.replace(/_/g, ' ')}</div>
                            <span className={`text-[10px] ${user?.role === key ? 'text-white/80' : 'text-[#666666]'}`}>
                              {acc.name}
                            </span>
                          </div>
                          {user?.role === key && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[#D94848] hover:bg-red-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
