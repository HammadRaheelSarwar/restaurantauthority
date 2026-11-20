import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Layers,
  BarChart3,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useAuth, PREVIEW_ACCOUNTS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login, switchRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('superadmin@rea-compliance.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      addToast(`Signed in successfully as ${res.data?.user?.full_name || 'Authorized User'}`);
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleSelectRole = (rKey) => {
    switchRole(rKey);
    const acc = PREVIEW_ACCOUNTS[rKey];
    if (acc) {
      setEmail(acc.email);
      setPassword('password123');
    }
    addToast(`Switched to demo role: ${rKey.replace(/_/g, ' ')}`);
    navigate('/dashboard');
  };

  const fillRoleCredentials = (rKey) => {
    const acc = PREVIEW_ACCOUNTS[rKey];
    if (acc) {
      setEmail(acc.email);
      setPassword('password123');
      addToast(`Filled credentials for ${acc.full_name || acc.name} (${acc.role.replace(/_/g, ' ')})`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4 py-8 sm:py-12 relative overflow-hidden font-sans">
      {/* Background Watermark Lightning Bolt */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <Zap className="w-[600px] h-[600px] text-black fill-black" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        {/* Left Side: Dark Card with Inspector Visual (Matching Image 1) */}
        <div className="lg:col-span-5 bg-[#111111] text-white rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl border border-neutral-800">
          {/* Top Half: Real Inspector Photo (Horizontally Oriented & Flipped) */}
          <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-900">
            <img
              src="/auth-signin-inspector.jpg"
              alt="REA Electrical Inspector with tablet checking kitchen distribution panel"
              className="w-full h-full object-cover object-center opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
          </div>

          {/* Bottom Half: Headlines and 4 Highlights */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="w-8 h-1 bg-white/40 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Electrical Readiness<br />for Safer Restaurants.
              </h2>
              <div className="text-xs text-[#888888] font-medium tracking-wide">
                Assess &nbsp;|&nbsp; Document &nbsp;|&nbsp; Manage &nbsp;|&nbsp; Comply
              </div>
            </div>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-800 text-center">
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] text-[#CCCCCC] leading-tight block">
                  Improve<br />Safety
                </span>
              </div>

              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] text-[#CCCCCC] leading-tight block">
                  Centralized<br />Records
                </span>
              </div>

              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] text-[#CCCCCC] leading-tight block">
                  Track<br />Readiness
                </span>
              </div>

              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] text-[#CCCCCC] leading-tight block">
                  Manager<br />Certification
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: White Card with Sign In Form (Matching Image 1) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
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
                Sign In to Your Account
              </h1>
              <p className="text-xs text-[#666666] leading-relaxed">
                Access your REA dashboard to manage assessments, restaurants, equipment, and certifications.
              </p>
            </div>

            {/* Demo Fast Login Banner / Role Quick Selectors */}
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                  <span className="text-xs font-bold text-[#111111]">Demo Account Fast Access</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoSelector(!showDemoSelector)}
                  className="text-[11px] font-semibold text-[#111111] hover:underline flex items-center gap-1"
                >
                  <span>{showDemoSelector ? 'Hide Demo Roles' : '1-Click Instant Login'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showDemoSelector ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {showDemoSelector ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                  {Object.entries(PREVIEW_ACCOUNTS).map(([key, acc]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectRole(key)}
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
                    onClick={() => fillRoleCredentials('super_admin')}
                    className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillRoleCredentials('restaurant_operator')}
                    className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition"
                  >
                    Org Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillRoleCredentials('restaurant_manager')}
                    className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition"
                  >
                    Restaurant Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => fillRoleCredentials('electrical_assessor')}
                    className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition"
                  >
                    Assessor
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

            {/* Main Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#111111] block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#111111] block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#666666]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E5E5E5] text-[#111111] focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="font-semibold text-[#111111] hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E5E5E5] w-full" />
              <span className="bg-white px-3 text-xs text-[#888888] absolute">or</span>
            </div>

            {/* Social OAuth Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectRole('super_admin')}
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
                onClick={() => handleSelectRole('restaurant_operator')}
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
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#111111] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
