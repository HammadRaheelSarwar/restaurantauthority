import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  User,
  QrCode,
  Award,
  Download,
  Printer,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

export default function VerifyCertificatePage() {
  const { code: urlCode } = useParams();
  const [query, setQuery] = useState(urlCode || 'REA-VRF-88492-X7');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlCode) {
      setQuery(urlCode);
      executeVerify(urlCode);
    } else {
      executeVerify('REA-VRF-88492-X7');
    }
  }, [urlCode]);

  const executeVerify = async (searchTerm) => {
    if (!searchTerm?.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.verifyCertificatePublic(searchTerm.trim());
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error?.message || 'Certificate verification failed');
      }
    } catch (err) {
      setError('No authentic credential found matching this verification code or certificate number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    executeVerify(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-emerald-800 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
          National Credential Registry & Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2d22] tracking-tight">
          Public Certificate Verification
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
          Verify the real-time active status of a Certified Restaurant Electrical Safety Manager (CRESM) credential for insurance underwriters, municipal fire marshals, and corporate risk directors.
        </p>
      </div>

      {/* Verification Search Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Certificate Number (e.g. CRESM-2026-88492) or Token (e.g. REA-VRF-88492-X7)"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-900 hover:bg-brand-950 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{loading ? 'Verifying...' : 'Verify Credential'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <span>Sample test tokens:</span>
          <button
            type="button"
            onClick={() => {
              setQuery('REA-VRF-88492-X7');
              executeVerify('REA-VRF-88492-X7');
            }}
            className="font-mono text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-semibold transition"
          >
            REA-VRF-88492-X7
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('CRESM-2026-88492');
              executeVerify('CRESM-2026-88492');
            }}
            className="font-mono text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-semibold transition"
          >
            CRESM-2026-88492
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Credential Not Found</h4>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Official Verified Credential Certificate Display */}
      {result && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden animate-in fade-in duration-300">
          
          {/* Top Authentic Header */}
          <div className="bg-gradient-to-r from-brand-950 to-brand-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                <ShieldCheck className="w-9 h-9 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block font-mono">
                    NATIONAL REGISTRY AUTHENTICATION: VERIFIED
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight mt-0.5">
                  {result.program_title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                ● {result.status}
              </span>
              <button
                onClick={() => window.print()}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition border border-white/20"
                title="Print Official Record"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center certificate-pattern">
            
            {/* Left 8 cols: Detailed Metadata */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Certified Professional</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    {result.recipient_name}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Hospitality Group</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    {result.organization_name}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Certificate Serial Number</span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {result.certificate_number}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Cryptographic Token</span>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    {result.verification_code}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Date of Examination & Issue</span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {result.issue_date}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Validity Period Through</span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {result.expiry_date}
                  </span>
                </div>
              </div>

              {/* Legal & Standards Seal Box */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Authenticated by Restaurant Electrical Authority Governance Board</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  The holder of this credential has demonstrated practical and technical proficiency in commercial restaurant electrical safety, 36-inch electrical panel clearances under OSHA 1910.303, wet location GFCI testing, and emergency shutdown procedures.
                </p>
              </div>
            </div>

            {/* Right 4 cols: QR Verification Stamp */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-inner">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                SECURE QR VALIDATION
              </span>
              <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                <img
                  src={result.qr_code_url}
                  alt="Official Verification QR"
                  className="w-36 h-36"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono leading-tight block">
                Point smartphone camera to inspect live record
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
