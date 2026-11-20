import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error?.message || 'Failed to process request');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F7F7F7] px-4 py-12 font-sans relative">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E5E5] shadow-xl space-y-6">
        {/* Logo */}
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

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-[#111111] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#16834A]" />
            </div>
            <h2 className="text-xl font-bold text-[#111111]">Check Your Inbox</h2>
            <p className="text-xs text-[#666666] leading-relaxed">
              If an account exists for <strong className="text-[#111111]">{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Reset Password</h1>
              <p className="text-xs text-[#666666]">
                Enter your corporate email address to receive recovery instructions.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#D94848] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{loading ? 'Sending Instructions...' : 'Send Reset Instructions'}</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#111111] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
