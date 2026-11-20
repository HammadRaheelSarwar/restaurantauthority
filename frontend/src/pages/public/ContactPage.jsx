import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Building2 } from 'lucide-react';
import { api } from '../../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    facility_count: '6-25 locations',
    inquiry_type: 'enterprise_pilot',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error?.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl space-y-4">
        <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 inline-flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>National Compliance Advisory & Technical Support</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 tracking-tight leading-tight">
          Connect with the Restaurant Electrical Authority.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Speak with our licensed safety engineers and compliance directors regarding multi-unit restaurant portfolio onboarding, certified field assessor dispatching, or CRESM corporate manager training.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info & Hubs column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-slate-900">National Headquarters</h3>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>450 Lexington Avenue, Suite 1200, New York, NY 10017</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">+1 (800) 555-0199</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>compliance@rea-safety.com</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Compliance Helpdesk Hours</span>
              <span className="text-sm font-semibold text-slate-800 block">
                Monday – Friday: 8:00 AM – 8:00 PM EST
              </span>
              <span className="text-xs text-emerald-700 block font-medium">
                *24/7 Emergency Incident Hotline Active for Registered Facilities
              </span>
            </div>
          </div>

          {/* Regional Inspection Hubs */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Regional Field Assessor Hubs
            </h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Northeast Hub</span>
                <span>New York, NY (HQ)</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Midwest Hub</span>
                <span>Chicago, IL</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Southern Hub</span>
                <span>Dallas / Fort Worth, TX</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Western Hub</span>
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Inquiry Received</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Restaurant Electrical Authority. A regional compliance director has been assigned to your message and will contact you within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', organization: '', facility_count: '6-25 locations', inquiry_type: 'enterprise_pilot', subject: '', message: '' });
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Consultation Request</h3>
                  <p className="text-xs text-slate-500">Provide your restaurant group details to connect with an engineering specialist.</p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jmiller@restaurantgroup.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Restaurant Organization / Brand</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Hospitality Brands"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Count</label>
                    <select
                      value={formData.facility_count}
                      onChange={(e) => setFormData({ ...formData, facility_count: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="1-5 locations">1 – 5 Locations</option>
                      <option value="6-25 locations">6 – 25 Locations</option>
                      <option value="26-100 locations">26 – 100 Locations</option>
                      <option value="100+ locations">100+ Locations (National)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.inquiry_type}
                    onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="enterprise_pilot">Enterprise Safety Governance Pilot</option>
                    <option value="cresm_certification">CRESM General Manager Certification Vouchers</option>
                    <option value="field_assessment">Schedule Certified Electrical Site Assessment</option>
                    <option value="insurance_review">Loss Control / Insurance Readiness Audit</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Multi-Unit Assessment Scheduling for Northeast Region"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Operational Requirements / Questions</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please describe your restaurant kitchen footprint, current panel documentation status, or upcoming insurance audit deadlines..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Compliance Advisory Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}