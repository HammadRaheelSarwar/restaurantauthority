import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Lock,
  Mail,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Layers,
  CalendarCheck2,
  Award,
  Sparkles,
  ChevronDown,
  Building
} from 'lucide-react';
import { useAuth, PREVIEW_ACCOUNTS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const { register, switchRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    organization_name: 'Apex Hospitality Group',
    role: 'restaurant_manager'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    const res = await register({
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      organization_name: formData.organization_name || 'Independent Hospitality Group',
      role: formData.role
    });
    setLoading(false);

    if (res.success) {
      addToast('REA Account created successfully! Welcome aboard.');
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  const handleSelectDemoRole = (rKey) => {
    switchRole(rKey);
    const acc = PREVIEW_ACCOUNTS[rKey];
    addToast(`Instant demo access granted: ${rKey.replace(/_/g, ' ')}`);
    navigate('/dashboard');
  };

  const fillDemoRole = (rKey) => {
    const acc = PREVIEW_ACCOUNTS[rKey];
    if (acc) {
      setFormData({
        full_name: acc.full_name || acc.name,
        email: acc.email,
        password: 'password123',
        confirm_password: 'password123',
        organization_name: 'Apex Hospitality Group',
        role: acc.role
      });
      addToast(`Pre-filled registration form with ${acc.full_name || acc.name} (${acc.role.replace(/_/g, ' ')})`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] font-sans">
      {/* Top Header Bar Matching Image 2 */}
      <header className="bg-white border-b border-[#E5E5E5] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold shadow-xs">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <div className="flex items-center gap-2.5">
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

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#666666] hidden sm:inline">Already have an account?</span>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 border border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#111111] px-3.5 py-1.5 rounded-lg font-semibold transition"
          >
            <User className="w-3.5 h-3.5 text-[#666666]" />
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Form Body */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Side: Dark Card with Inspector (Matching Image 2) */}
          <div className="lg:col-span-5 bg-[#111111] text-white rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl border border-neutral-800">
            {/* Real Inspector Photo (Horizontally Oriented & Flipped) */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-900">
              <img
                src="/auth-signup-inspector.jpg"
                alt="REA Commercial Kitchen Inspector with tablet and subpanel"
                className="w-full h-full object-cover object-center opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
            </div>

            {/* Bottom Content with 4 Rows */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Build a Safer,<br />More Electrically<br />Ready Restaurant.
                </h2>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Create your REA account to manage assessments, equipment, incidents, reviews, and certifications — all in one place.
                </p>
              </div>

              {/* 4 Feature Items */}
              <div className="space-y-3 pt-2 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-[#DDDDDD]">Manage Electrical Readiness</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
                    <CalendarCheck2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-[#DDDDDD]">Track Assessments & Incidents</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-[#DDDDDD]">Maintain Equipment & Panel Records</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-[#DDDDDD]">Access Manager Certification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: White Card with Sign Up Form (Matching Image 2) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-xl flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold shadow-xs">
                  <Zap className="w-4 h-4 fill-white text-white" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-black tracking-tight text-[#111111]">REA</span>
                  <div className="border-l border-[#E5E5E5] pl-2.5 flex flex-col justify-center">
                    <span className="text-[8.5px] font-black tracking-widest text-[#111111] uppercase leading-none">
                      RESTAURANT
                    </span>
                    <span className="text-[8.5px] font-black tracking-widest text-[#666666] uppercase leading-none mt-0.5">
                      ELECTRICAL AUTHORITY
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                  Create Your REA Account
                </h1>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Register to get started with the Restaurant Electrical Authority platform.
                </p>
              </div>

              {/* Demo Account Fast Access Pill / Selector */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                    <span className="text-xs font-bold text-[#111111]">Demo Account Quick Fill</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemoSelector(!showDemoSelector)}
                    className="text-[11px] font-semibold text-[#111111] hover:underline flex items-center gap-1"
                  >
                    <span>{showDemoSelector ? 'Hide Demo Roles' : 'Auto-Fill Role'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showDemoSelector ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {showDemoSelector ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                    {Object.entries(PREVIEW_ACCOUNTS).map(([key, acc]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => fillDemoRole(key)}
                        className="text-left p-2 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#111111] hover:shadow-2xs transition"
                      >
                        <div className="font-bold text-[11px] text-[#111111] capitalize truncate">
                          {acc.role.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-[#666666] truncate">{acc.full_name || acc.name}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => fillDemoRole('restaurant_operator')}
                      className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition"
                    >
                      Fill as Org Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoRole('restaurant_manager')}
                      className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition"
                    >
                      Fill as Restaurant Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDemoRole('super_admin')}
                      className="px-2.5 py-1 bg-[#111111] text-white hover:bg-black rounded text-[11px] font-semibold transition"
                    >
                      Instant Demo Enter →
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#D94848] text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#111111] block">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#111111] block">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#111111] block">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#111111] block">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      placeholder="Confirm your password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms and Privacy Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#666666]">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0 mt-0.5 shrink-0"
                    />
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" className="font-bold text-[#111111] hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="font-bold text-[#111111] hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      of REA.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E5E5E5] w-full" />
                <span className="bg-white px-3 text-xs text-[#888888] absolute">or register with</span>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoRole('super_admin')}
                  className="w-full py-2.5 px-4 border border-[#E5E5E5] hover:bg-[#FAFAFA] rounded-xl text-xs font-semibold text-[#111111] flex items-center justify-center gap-2.5 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoRole('restaurant_operator')}
                  className="w-full py-2.5 px-4 border border-[#E5E5E5] hover:bg-[#FAFAFA] rounded-xl text-xs font-semibold text-[#111111] flex items-center justify-center gap-2.5 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>
              </div>
            </div>

            {/* Bottom Switcher */}
            <div className="text-center text-xs text-[#666666] pt-4 border-t border-[#E5E5E5]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#111111] hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
