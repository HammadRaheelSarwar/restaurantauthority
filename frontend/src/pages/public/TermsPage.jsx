import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-700">
      <h1 className="text-3xl font-extrabold text-brand-900">Terms and Operating Conditions</h1>
      <p className="text-sm text-slate-500">Effective Date: January 1, 2026</p>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">1. Scope of Electrical Assessment</h3>
        <p className="text-sm leading-relaxed">
          Site assessments, reviews, and manager credentials provided by REA evaluate readiness and adherence to client-approved standards. Approval of an internal assessment does not constitute formal municipal regulatory licensing unless conducted by a licensed Professional Engineer (PE).
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">2. Manager Credential Terms</h3>
        <p className="text-sm leading-relaxed">
          The CRESM credential remains active for 24 months from the date of examination passing, subject to adherence to organizational safety policies and annual review completion.
        </p>
      </section>
    </div>
  );
}
