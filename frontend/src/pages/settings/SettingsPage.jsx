import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  Check,
  Building,
  Shield,
  Bell,
  Lock,
  Key,
  Globe,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/ui/StatCard';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('thresholds'); // 'profile', 'thresholds', 'notifications', 'security'

  // Form State
  const [profileSettings, setProfileSettings] = useState({
    orgName: 'Apex Hospitality Group LLC',
    taxId: 'US-EIN-88492019',
    headquarters: '750 3rd Ave, New York, NY 10017',
    primaryContact: 'David Vance, Compliance Officer',
    contactEmail: 'compliance@apexhospitality.com',
    phone: '+1 (555) 392-8819'
  });

  const [thresholds, setThresholds] = useState({
    passingScore: 85,
    annualReviewBufferDays: 60,
    urgentSlaHours: 24,
    highSlaHours: 48,
    recheckIntervalDays: 30,
    requireThermalScans: true,
    requirePhotoProof: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailUrgentIncidents: true,
    emailDailyDigest: false,
    smsTripAlerts: true,
    inspectorReminders: true,
    certRenewalAlerts: true,
    webhookEndpoint: 'https://api.apexhospitality.com/webhooks/rea-safety'
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeoutMinutes: 60,
    mfaEnforced: true,
    ipWhitelisting: false,
    allowedIps: '192.168.1.0/24, 10.0.0.0/16',
    auditLedgerRetentionYears: 7
  });

  const handleSaveTab = (tabName) => {
    addToast(`${tabName} updated and synchronized across all enterprise nodes.`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF5EF] text-[#146B45]">
              Enterprise System Governance
            </span>
            <span className="text-xs text-[#66736B]">• Configuration & Compliance Parameters</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
            System Settings & Compliance Controls
          </h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Configure passing thresholds, inspection intervals, automated alerting webhooks, and security policies.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-xl border border-[#E6ECE8] text-xs font-semibold overflow-x-auto">
        {[
          { id: 'thresholds', label: 'Compliance Thresholds', icon: Sliders },
          { id: 'profile', label: 'Organization Profile', icon: Building },
          { id: 'notifications', label: 'Alerting & Webhooks', icon: Bell },
          { id: 'security', label: 'Security & Governance', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#146B45] shadow-xs'
                  : 'text-[#66736B] hover:text-[#17231D]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#146B45]' : 'text-[#66736B]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPLIANCE THRESHOLDS & SCORING */}
      {activeTab === 'thresholds' && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E6ECE8] pb-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm text-[#17231D]">Safety Audit & Inspection Thresholds</h3>
              <p className="text-xs text-[#66736B]">Define passing benchmark criteria and remediation SLA deadlines</p>
            </div>
            <button
              onClick={() => handleSaveTab('Compliance Thresholds')}
              className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-medium text-[#17231D] mb-1">
                Minimum Assessment Passing Score (%)
              </label>
              <input
                type="number"
                value={thresholds.passingScore}
                onChange={(e) => setThresholds({ ...thresholds, passingScore: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
              <span className="text-[11px] text-[#66736B] mt-1 block">
                Assessments below this threshold trigger automatic CAPA deficiencies.
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#17231D] mb-1">
                Annual Readiness Review Expiration Warning (Days)
              </label>
              <input
                type="number"
                value={thresholds.annualReviewBufferDays}
                onChange={(e) => setThresholds({ ...thresholds, annualReviewBufferDays: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
              <span className="text-[11px] text-[#66736B] mt-1 block">
                Advance alert window to schedule annual review before certification lapses.
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#17231D] mb-1">
                Urgent Hazard Resolution SLA (Hours)
              </label>
              <input
                type="number"
                value={thresholds.urgentSlaHours}
                onChange={(e) => setThresholds({ ...thresholds, urgentSlaHours: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
              <span className="text-[11px] text-[#66736B] mt-1 block">
                Maximum time allowed to isolate and de-energize severe electrical risks.
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#17231D] mb-1">
                Routine Deficiency Resolution SLA (Hours)
              </label>
              <input
                type="number"
                value={thresholds.highSlaHours}
                onChange={(e) => setThresholds({ ...thresholds, highSlaHours: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
              <span className="text-[11px] text-[#66736B] mt-1 block">
                Standard licensed electrician turnaround time for high-priority items.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6ECE8] space-y-3 text-xs">
            <h4 className="font-bold text-[#17231D]">Mandatory Verification Policies</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={thresholds.requirePhotoProof}
                  onChange={(e) => setThresholds({ ...thresholds, requirePhotoProof: e.target.checked })}
                  className="rounded text-[#146B45] focus:ring-[#146B45]"
                />
                <span className="text-[#17231D]">
                  Require photographic upload before any corrective action can be marked as closed.
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={thresholds.requireThermalScans}
                  onChange={(e) => setThresholds({ ...thresholds, requireThermalScans: e.target.checked })}
                  className="rounded text-[#146B45] focus:ring-[#146B45]"
                />
                <span className="text-[#17231D]">
                  Mandate FLIR infrared thermography scans for all Main Distribution Panels during annual audits.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATION PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E6ECE8] pb-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm text-[#17231D]">Corporate Entity & Franchise Credentials</h3>
              <p className="text-xs text-[#66736B]">Master organization identity used across compliance dossiers</p>
            </div>
            <button
              onClick={() => handleSaveTab('Organization Profile')}
              className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#17231D] mb-1">Legal Entity Name</label>
              <input
                type="text"
                value={profileSettings.orgName}
                onChange={(e) => setProfileSettings({ ...profileSettings, orgName: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#17231D] mb-1">Employer Identification / Tax Registration</label>
              <input
                type="text"
                value={profileSettings.taxId}
                onChange={(e) => setProfileSettings({ ...profileSettings, taxId: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#17231D] mb-1">Corporate Compliance Officer</label>
              <input
                type="text"
                value={profileSettings.primaryContact}
                onChange={(e) => setProfileSettings({ ...profileSettings, primaryContact: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#17231D] mb-1">Compliance Email</label>
              <input
                type="email"
                value={profileSettings.contactEmail}
                onChange={(e) => setProfileSettings({ ...profileSettings, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-[#17231D] mb-1">Headquarters Address</label>
              <input
                type="text"
                value={profileSettings.headquarters}
                onChange={(e) => setProfileSettings({ ...profileSettings, headquarters: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALERTING & WEBHOOK ROUTING */}
      {activeTab === 'notifications' && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E6ECE8] pb-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm text-[#17231D]">Automated Incident & Assessment Routing</h3>
              <p className="text-xs text-[#66736B]">Manage multi-channel notifications and external incident webhooks</p>
            </div>
            <button
              onClick={() => handleSaveTab('Alerting & Notifications')}
              className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-3">
              {[
                { key: 'emailUrgentIncidents', label: 'Email Alerts for Critical Incidents', desc: 'Immediately notify corporate directors when a thermal trip or water hazard occurs.' },
                { key: 'smsTripAlerts', label: 'SMS Breaker Trip Dispatch', desc: 'Send direct SMS to on-call licensed master electricians.' },
                { key: 'certRenewalAlerts', label: 'CRESM Manager Renewal Reminders', desc: 'Alert store general managers 60 days prior to credential lapse.' }
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between p-3.5 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8]">
                  <div>
                    <h5 className="font-bold text-[#17231D]">{item.label}</h5>
                    <p className="text-[#66736B] text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                    className="mt-1 rounded text-[#146B45] focus:ring-[#146B45]"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block font-medium text-[#17231D] mb-1">Corporate Webhook URL (Realtime JSON Dispatch)</label>
              <input
                type="text"
                value={notificationSettings.webhookEndpoint}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, webhookEndpoint: e.target.value })}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#146B45]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & GOVERNANCE */}
      {activeTab === 'security' && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E6ECE8] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E6ECE8] pb-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm text-[#17231D]">Authentication & System Security</h3>
              <p className="text-xs text-[#66736B]">Configure session policies, two-factor authentication, and IP whitelisting</p>
            </div>
            <button
              onClick={() => handleSaveTab('Security & Governance')}
              className="bg-[#146B45] hover:bg-[#104B35] text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17231D] mb-1">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeoutMinutes}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeoutMinutes: e.target.value })}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17231D] mb-1">Audit Ledger Retention Window</label>
                <select className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6ECE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#146B45]">
                  <option>7 Years (IRS & OSHA Standard)</option>
                  <option>10 Years (Extended Insurance)</option>
                  <option>Indefinite Retention</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-[#F7F9F8] rounded-lg border border-[#E6ECE8] flex items-center justify-between">
              <div>
                <h5 className="font-bold text-[#17231D]">Mandate Multi-Factor Authentication (MFA)</h5>
                <p className="text-[#66736B] text-[11px] mt-0.5">Enforce authenticator app (TOTP) verification for all corporate roles.</p>
              </div>
              <input
                type="checkbox"
                checked={securitySettings.mfaEnforced}
                onChange={(e) => setSecuritySettings({ ...securitySettings, mfaEnforced: e.target.checked })}
                className="rounded text-[#146B45] focus:ring-[#146B45]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
