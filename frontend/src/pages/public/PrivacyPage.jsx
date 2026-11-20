import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-700">
      <h1 className="text-3xl font-extrabold text-brand-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Effective Date: January 1, 2026</p>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">1. Data Architecture & Multi-Tenant Separation</h3>
        <p className="text-sm leading-relaxed">
          Restaurant Electrical Authority (REA) isolates all client operational records, facility photographs, electrical single-line diagrams, and assessment findings using cryptographic Row Level Security (RLS) policies within Supabase PostgreSQL.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">2. Credential Verification Data</h3>
        <p className="text-sm leading-relaxed">
          Public verification displays solely authorized credential metadata (certificate number, recipient name, organization, issue and expiration dates). Full inspection checklists and internal proprietary equipment records remain strictly confidential to authorized tenant members.
        </p>
      </section>
    </div>
  );
}
