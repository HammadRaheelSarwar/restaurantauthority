import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ChevronRight, Zap, Menu, X, ArrowRight, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Certification', path: '/certification', hasDropdown: true },
    { name: 'Resources', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] text-[#111111] font-sans">
      {/* Top Main Navigation Header (Matching Image 3) */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Matching Image 3: Black Square with Lightning Bolt + REA + RESTAURANT / ELECTRICAL AUTHORITY */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-[#111111]">REA</span>
              <div className="border-l border-[#E5E5E5] pl-2.5 flex flex-col justify-center">
                <span className="text-[9px] font-extrabold tracking-widest text-[#111111] uppercase leading-none">
                  RESTAURANT
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-[#666666] uppercase leading-none mt-0.5">
                  ELECTRICAL AUTHORITY
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1 transition relative py-2 ${
                    active ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 border border-[#E5E5E5] hover:bg-[#F0F0F0] text-[#111111] px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <User className="w-4 h-4 text-[#666666]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-xs transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#666666] hover:text-[#111111] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E5E5] bg-white px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#111111]"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#E5E5E5] flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 border border-[#E5E5E5] rounded-lg text-sm font-semibold text-[#111111]"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-[#111111] text-white rounded-lg text-sm font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5E5] py-12 text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#111111] text-white flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="font-bold text-sm text-[#111111]">Restaurant Electrical Authority</span>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed">
              Standardizing commercial kitchen electrical readiness, panel schedules, and manager safety certifications under NEC and NFPA standards.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] mb-2.5">Platform Solutions</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/services" className="hover:text-[#111111]">Electrical Site Assessments</Link></li>
              <li><Link to="/services" className="hover:text-[#111111]">Electrical Panel Schedules</Link></li>
              <li><Link to="/services" className="hover:text-[#111111]">Equipment Telemetry</Link></li>
              <li><Link to="/services" className="hover:text-[#111111]">Incident Triage & CAPA</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] mb-2.5">Credentials & Safety</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/certification" className="hover:text-[#111111]">CRESM Manager Certification</Link></li>
              <li><Link to="/verify" className="hover:text-[#111111]">Public Credential Verification</Link></li>
              <li><Link to="/about" className="hover:text-[#111111]">NEC 110.26 Working Space</Link></li>
              <li><Link to="/about" className="hover:text-[#111111]">NFPA 70E Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] mb-2.5">Compliance Advisory</h4>
            <p className="text-[11px] text-[#666666] mb-2">
              National Headquarters: 450 Lexington Ave, Suite 1200, New York, NY 10017
            </p>
            <div className="text-[11px] font-semibold text-[#111111]">
              Hotline: +1 (800) 555-0199
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} Restaurant Electrical Authority (REA). All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#111111]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#111111]">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
