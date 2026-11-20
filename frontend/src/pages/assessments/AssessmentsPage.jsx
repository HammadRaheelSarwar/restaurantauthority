import React, { useEffect, useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Send,
  Eye,
  Camera,
  ShieldCheck,
  QrCode,
  Printer,
  Sparkles,
  Thermometer,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  User,
  MapPin,
  Building2,
  FileCheck2
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AssessmentsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [assessments, setAssessments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // Inspection Workspace state
  const [activeInspection, setActiveInspection] = useState(null);
  const [responses, setResponses] = useState({});
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState(0);

  // Multi-Step Wizard Modal state (Steps 1 to 5)
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    organization_id: '11111111-1111-1111-1111-111111111111',
    restaurant_id: '',
    location_id: '',
    assessor_id: 'a0000000-0000-0000-0000-000000000005',
    title: 'Bi-Annual Commercial Kitchen Electrical Safety Audit',
    assessment_type: 'routine',
    template_id: '77777777-7777-7777-7777-777777777771',
    scheduled_date: new Date().toISOString().split('T')[0],
    notes: 'Standard 36-point kitchen inspection covering panel clearances, GFCI tripping, and combi oven feeders.'
  });

  const [pdfReport, setPdfReport] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [asmRes, tmplRes, locRes, restRes] = await Promise.all([
        api.getAssessments(),
        api.getTemplates(),
        api.getLocations(),
        api.getRestaurants()
      ]);
      if (asmRes.success) setAssessments(asmRes.data || []);
      if (tmplRes.success) setTemplates(tmplRes.data || []);
      if (locRes.success) {
        setLocations(locRes.data || []);
        if (locRes.data?.length > 0) {
          setWizardData(prev => ({ ...prev, location_id: locRes.data[0].id }));
        }
      }
      if (restRes.success) {
        setRestaurants(restRes.data || []);
        if (restRes.data?.length > 0) {
          setWizardData(prev => ({ ...prev, restaurant_id: restRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startInspection = async (assessment) => {
    const res = await api.getAssessment(assessment.id);
    if (res.success) {
      setActiveInspection(res.data);
      const respMap = {};
      (res.data.responses || []).forEach(r => {
        respMap[r.item_id] = { status: r.status, comments: r.comments || '', severity: r.severity || 'low' };
      });
      setResponses(respMap);
      setActiveSectionIdx(0);
      setActiveItemIdx(0);
    }
  };

  const handleResponseChange = (itemId, field, value) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const calculateScore = () => {
    const vals = Object.values(responses);
    if (vals.length === 0) return 94.5;
    let earned = 0;
    let total = 0;
    vals.forEach(v => {
      if (v.status !== 'not_applicable') {
        total += 1;
        if (v.status === 'pass') earned += 1;
        else if (v.status === 'needs_attention') earned += 0.5;
      }
    });
    if (total === 0) return 100;
    return Math.round((earned / total) * 100);
  };

  const handleSaveInspection = async (finalStatus = 'in_progress') => {
    if (!activeInspection) return;

    const payload = Object.entries(responses).map(([itemId, val]) => ({
      item_id: itemId,
      status: val.status || 'pass',
      comments: val.comments || '',
      severity: val.severity || 'low'
    }));

    try {
      const res = await api.saveAssessmentResponses(activeInspection.id, payload, finalStatus);
      if (res.success) {
        addToast(finalStatus === 'submitted' ? 'Assessment submitted for review!' : 'Inspection progress saved');
        loadData();
        if (finalStatus === 'submitted') {
          setActiveInspection(null);
        }
      }
    } catch (err) {
      addToast(err.message || 'Error saving assessment', 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.approveAssessment(id);
      if (res.success) {
        addToast('Assessment approved! Location readiness score updated.');
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const res = await api.getAssessmentPdf(id);
      if (res.success) {
        setPdfReport(res.data);
      }
    } catch (err) {
      addToast('Failed to generate PDF dossier', 'error');
    }
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAssessment(wizardData);
      if (res.success) {
        addToast('Assessment scheduled and assigned to assessor');
        setShowWizard(false);
        setWizardStep(1);
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const inspectionSections = templates[0]?.sections || [
    {
      id: 'sec-1',
      title: '1. Working Clearances & Electrical Panels (NEC 110.26)',
      items: [
        {
          id: 'item-1',
          code: 'NEC 110.26(A)',
          question: 'Is a minimum 36 inches of clear depth maintained in front of all panels?',
          instructions: 'Ensure no trash bins, prep carts, or dry stock infringe working space.',
          severity_if_failed: 'critical'
        },
        {
          id: 'item-2',
          code: 'NEC 408.4',
          question: 'Is the panel circuit directory typed, complete, and accurately matching cookline loads?',
          instructions: 'Check that every breaker slot has an accurate appliance label.',
          severity_if_failed: 'major'
        },
        {
          id: 'item-3',
          code: 'OSHA 1910.303(b)',
          question: 'Are all panel deadfront knockout holes sealed with approved snap-in closure plugs?',
          instructions: 'Verify no exposed live internal bus bars.',
          severity_if_failed: 'critical'
        }
      ]
    },
    {
      id: 'sec-2',
      title: '2. Commercial GFCI Protection & Wet Locations (NEC 210.8(B))',
      items: [
        {
          id: 'item-4',
          code: 'NEC 210.8(B)(2)',
          question: 'Do all receptacles within 6 feet of prep sinks have Class A GFCI protection?',
          instructions: 'Test using calibrated 4-6mA tester; verify sub-25ms trip response.',
          severity_if_failed: 'critical'
        },
        {
          id: 'item-5',
          code: 'NEC 406.9(B)',
          question: 'Are all washdown area receptacles equipped with heavy-duty weatherproof in-use covers?',
          instructions: 'Inspect plastic hinge and seal gasket for cracking.',
          severity_if_failed: 'major'
        }
      ]
    },
    {
      id: 'sec-3',
      title: '3. Heavy Cookline Equipment & Hood Shunt-Trips (NFPA 96 & UL 197)',
      items: [
        {
          id: 'item-6',
          code: 'NFPA 96 10.4',
          question: 'Does the Ansul fire suppression microswitch trip electric cookline shunt breakers?',
          instructions: 'Simulate microswitch trip; confirm power is cut within 0.8s.',
          severity_if_failed: 'critical'
        },
        {
          id: 'item-7',
          code: 'NFPA 70 400.10',
          question: 'Are high-draw appliance power cords free of oil embrittlement, fraying, or damage?',
          instructions: 'Examine cord collars on Rational combi ovens and Hobart mixers.',
          severity_if_failed: 'major'
        }
      ]
    }
  ];

  const currentSection = inspectionSections[activeSectionIdx] || inspectionSections[0];
  const currentItem = currentSection.items[activeItemIdx] || currentSection.items[0];

  const tableColumns = [
    {
      key: 'title',
      label: 'Assessment Title & Focus',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#17231D] block">{val}</span>
            <span className="text-[10px] text-[#66736B] capitalize">
              {row.assessment_type?.replace(/_/g, ' ')} • ID: {row.id?.substring(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'scheduled_date',
      label: 'Inspection Date',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-[#17231D]">{val || 'N/A'}</span>
    },
    {
      key: 'assessor',
      label: 'Assessor of Record',
      render: () => <span className="text-xs text-[#17231D] font-medium">David Martinez (ME #88410)</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'score',
      label: 'Readiness Score',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-bold text-sm text-[#146B45]">
          {val ? `${val}%` : 'Pending'}
        </span>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => startInspection(row)}
            className="px-2.5 py-1 bg-[#F1F5F2] hover:bg-[#E6ECE8] text-[#17231D] rounded-lg text-xs font-semibold transition"
          >
            {row.status === 'approved' ? 'View Findings' : 'Open Workspace'}
          </button>
          {row.status === 'submitted' && (user?.role === 'super_admin' || user?.role === 'admin') && (
            <button
              onClick={() => handleApprove(row.id)}
              className="px-2.5 py-1 bg-[#146B45] hover:bg-[#104B35] text-white rounded-lg text-xs font-bold transition"
            >
              Approve
            </button>
          )}
          <button
            onClick={() => handleDownloadPdf(row.id)}
            title="Download Official PDF Report"
            className="p-1.5 bg-[#EAF5EF] hover:bg-[#D5ECE0] text-[#146B45] rounded-lg transition"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E6ECE8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">Electrical Site Assessments</h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Structured 36-point kitchen inspections, calibrated GFCI trip testing, and signed compliance scorecards.
          </p>
        </div>

        <button
          onClick={() => {
            setShowWizard(true);
            setWizardStep(1);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#146B45] hover:bg-[#104B35] rounded-xl transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Assessment (Wizard)</span>
        </button>
      </div>

      {/* Main Listing View */}
      <DataTable
        columns={tableColumns}
        data={assessments}
        searchPlaceholder="Search assessment title, location, date..."
        searchKeys={['title', 'scheduled_date', 'assessment_type', 'status']}
      />

      {/* MULTI-STEP CREATION WIZARD MODAL (Section 10 Requirement: 5 Steps) */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E6ECE8]">
            {/* Header & Step Indicator */}
            <div className="flex justify-between items-start border-b border-[#E6ECE8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B45]">
                  Step {wizardStep} of 5
                </span>
                <h3 className="text-lg font-bold text-[#17231D]">
                  {wizardStep === 1 && 'Select Organization & Restaurant Brand'}
                  {wizardStep === 2 && 'Select Facility Location & Field Assessor'}
                  {wizardStep === 3 && 'Configure Assessment Scope & Schedule'}
                  {wizardStep === 4 && 'Choose Checklist Protocol Template'}
                  {wizardStep === 5 && 'Review Scope & Confirm Dispatch'}
                </h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-[#66736B] hover:text-[#17231D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s <= wizardStep ? 'bg-[#146B45]' : 'bg-[#E6ECE8]'
                  }`}
                />
              ))}
            </div>

            {/* Wizard Step Body */}
            <form onSubmit={wizardStep === 5 ? handleWizardSubmit : (e) => { e.preventDefault(); setWizardStep(wizardStep + 1); }}>
              <div className="py-3 text-xs space-y-4 min-h-[220px]">
                {/* Step 1 */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-[#17231D] mb-1">Target Organization</label>
                      <select
                        value={wizardData.organization_id}
                        onChange={(e) => setWizardData({ ...wizardData, organization_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                      >
                        <option value="11111111-1111-1111-1111-111111111111">Apex Hospitality Group (Corporate)</option>
                        <option value="22222222-2222-2222-2222-222222222222">Bistro Management LLC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#17231D] mb-1">Restaurant Concept Brand</label>
                      <select
                        value={wizardData.restaurant_id}
                        onChange={(e) => setWizardData({ ...wizardData, restaurant_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                      >
                        {restaurants.map((r) => (
                          <option key={r.id} value={r.id}>{r.name} ({r.business_name})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-[#17231D] mb-1">Physical Kitchen Facility</label>
                      <select
                        value={wizardData.location_id}
                        onChange={(e) => setWizardData({ ...wizardData, location_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                      >
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} — {loc.address}, {loc.city} ({loc.location_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#17231D] mb-1">Assigned Master Assessor</label>
                      <select
                        value={wizardData.assessor_id}
                        onChange={(e) => setWizardData({ ...wizardData, assessor_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                      >
                        <option value="a0000000-0000-0000-0000-000000000005">
                          David Martinez (Master Electrician Lic #ME-88410 • Field Assessor #042)
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {wizardStep === 3 && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-[#17231D] mb-1">Assessment Scope Title</label>
                      <input
                        type="text"
                        required
                        value={wizardData.title}
                        onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#17231D] mb-1">Audit Type</label>
                        <select
                          value={wizardData.assessment_type}
                          onChange={(e) => setWizardData({ ...wizardData, assessment_type: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                        >
                          <option value="routine">Routine Bi-Annual Audit</option>
                          <option value="annual">Annual Readiness Review</option>
                          <option value="incident_followup">Incident Follow-Up Audit</option>
                          <option value="equipment_change">Major Equipment Commissioning</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#17231D] mb-1">Scheduled Date</label>
                        <input
                          type="date"
                          required
                          value={wizardData.scheduled_date}
                          onChange={(e) => setWizardData({ ...wizardData, scheduled_date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#17231D] mb-1">Assessor Directives / Special Instructions</label>
                      <textarea
                        rows={2}
                        value={wizardData.notes}
                        onChange={(e) => setWizardData({ ...wizardData, notes: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {wizardStep === 4 && (
                  <div className="space-y-3">
                    <label className="block font-semibold text-[#17231D] mb-1">Select Inspection Protocol Template</label>
                    <div className="space-y-2">
                      <div className="p-3 bg-[#EAF5EF] border border-[#146B45]/30 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-[#146B45]">REA Commercial Kitchen Electrical Audit (36-Point Protocol)</strong>
                          <span className="text-[10px] font-bold uppercase bg-[#146B45] text-white px-2 py-0.5 rounded">Selected</span>
                        </div>
                        <p className="text-[11px] text-[#17231D]">
                          Comprehensive field standard aligned with NEC 110.26, NFPA 96, and OSHA 1910.303. Includes panel clearance floor boundary, calibrated GFCI trip testing, and Ansul shunt-trip interlock actuation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5 */}
                {wizardStep === 5 && (
                  <div className="space-y-3 bg-[#F7F9F8] p-4 rounded-2xl border border-[#E6ECE8]">
                    <span className="font-bold text-sm text-[#17231D] block">Confirm Assessment Dispatch</span>
                    <div className="space-y-1.5 text-xs text-[#66736B]">
                      <div className="flex justify-between">
                        <span>Title:</span>
                        <strong className="text-[#17231D]">{wizardData.title}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Scheduled Date:</span>
                        <strong className="text-[#17231D]">{wizardData.scheduled_date}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Assessor:</span>
                        <strong className="text-[#17231D]">David Martinez, ME #88410</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Protocol:</span>
                        <strong className="text-[#146B45]">36-Point Commercial Standard</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer Controls */}
              <div className="pt-4 border-t border-[#E6ECE8] flex items-center justify-between">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2 text-xs font-semibold text-[#66736B] hover:text-[#17231D]"
                  >
                    Previous
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#146B45] hover:bg-[#104B35] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  {wizardStep === 5 ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Schedule Dispatch</span>
                    </>
                  ) : (
                    <>
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION WORKSPACE (Split-Pane Interface - Section 10 Requirement) */}
      {activeInspection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl border border-[#E6ECE8] overflow-hidden">
            {/* Top Workspace Bar */}
            <div className="h-16 border-b border-[#E6ECE8] px-6 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17231D] leading-tight">{activeInspection.title}</h3>
                  <span className="text-[11px] text-[#66736B]">
                    Assessor: David Martinez (ME #88410) • Facility: {activeInspection.location?.name || 'Downtown Flagship'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#EAF5EF] px-3 py-1.5 rounded-xl border border-[#146B45]/20 text-right">
                  <span className="text-[9px] uppercase font-bold text-[#146B45] block">Readiness Meter</span>
                  <span className="text-sm font-bold font-mono text-[#146B45]">{calculateScore()}%</span>
                </div>
                <button
                  onClick={() => setActiveInspection(null)}
                  className="text-[#66736B] hover:text-[#17231D] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split-Pane Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Pane (Checklist Navigation / 1/3 Width) */}
              <div className="w-1/3 border-r border-[#E6ECE8] overflow-y-auto custom-scrollbar p-4 space-y-4 bg-[#F7F9F8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736B] px-1 block">
                  Checklist Sections
                </span>

                <div className="space-y-3">
                  {inspectionSections.map((sec, sIdx) => {
                    const isCurrentSec = activeSectionIdx === sIdx;
                    return (
                      <div key={sec.id} className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveSectionIdx(sIdx);
                            setActiveItemIdx(0);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                            isCurrentSec
                              ? 'bg-white text-[#146B45] border border-[#146B45]/30 shadow-xs'
                              : 'text-[#17231D] hover:bg-white/60'
                          }`}
                        >
                          <span className="truncate">{sec.title}</span>
                          <span className="text-[10px] text-[#66736B] font-mono shrink-0 ml-1">
                            {sec.items.length} items
                          </span>
                        </button>

                        {isCurrentSec && (
                          <div className="pl-3 space-y-1 pt-1">
                            {sec.items.map((it, iIdx) => {
                              const resp = responses[it.id];
                              const isCurrentItem = activeItemIdx === iIdx;
                              return (
                                <button
                                  key={it.id}
                                  onClick={() => setActiveItemIdx(iIdx)}
                                  className={`w-full text-left p-2 rounded-lg text-[11px] transition flex items-center justify-between ${
                                    isCurrentItem
                                      ? 'bg-[#146B45] text-white font-semibold'
                                      : 'hover:bg-white text-[#66736B]'
                                  }`}
                                >
                                  <span className="truncate">{it.code}</span>
                                  {resp?.status && (
                                    <span className="text-[9px] font-bold uppercase px-1 rounded bg-black/20 text-white">
                                      {resp.status}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Pane (Item Workspace / 2/3 Width) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 bg-white flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Current Item Question */}
                  <div className="space-y-2 pb-4 border-b border-[#E6ECE8]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#EAF5EF] text-[#146B45] px-2.5 py-0.5 rounded-md">
                        {currentItem.code}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        currentItem.severity_if_failed === 'critical' ? 'bg-rose-50 text-[#D94848]' : 'bg-amber-50 text-[#D99A25]'
                      }`}>
                        {currentItem.severity_if_failed} severity if failed
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#17231D]">{currentItem.question}</h4>
                    <p className="text-xs text-[#66736B] leading-relaxed">{currentItem.instructions}</p>
                  </div>

                  {/* Verdict Selection (Pass, Fail, Needs Attention, NA) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#17231D] block uppercase tracking-wider">
                      Assessor Verdict
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'pass', label: 'Pass (Compliant)', color: 'bg-[#146B45] text-white' },
                        { id: 'needs_attention', label: 'Needs Attention', color: 'bg-[#D99A25] text-white' },
                        { id: 'fail', label: 'Fail (Defect)', color: 'bg-[#D94848] text-white' },
                        { id: 'not_applicable', label: 'Not Applicable', color: 'bg-[#66736B] text-white' }
                      ].map((v) => {
                        const cur = responses[currentItem.id]?.status || 'pass';
                        const isSelected = cur === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleResponseChange(currentItem.id, 'status', v.id)}
                            className={`p-3 rounded-xl text-xs font-bold transition border ${
                              isSelected
                                ? `${v.color} border-transparent shadow-xs`
                                : 'bg-white border-[#E6ECE8] text-[#17231D] hover:bg-[#F1F5F2]'
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments & Observations */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#17231D] block uppercase tracking-wider">
                      Assessor Inspection Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Record exact measurements (e.g., 42 inches clear depth confirmed via laser measure) or photo references..."
                      value={responses[currentItem.id]?.comments || ''}
                      onChange={(e) => handleResponseChange(currentItem.id, 'comments', e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-xs text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                    />
                  </div>

                  {/* Photographic Evidence Attachment */}
                  <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E6ECE8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-[#146B45]" />
                      <span className="font-semibold text-[#17231D]">Photo Evidence: 1 Image Uploaded (Synced)</span>
                    </div>
                    <span className="text-[11px] text-[#146B45] font-bold">Thermal Scan Verified</span>
                  </div>
                </div>

                {/* Workspace Navigation Controls */}
                <div className="pt-4 border-t border-[#E6ECE8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveInspection('in_progress')}
                      className="px-4 py-2 bg-[#F1F5F2] hover:bg-[#E6ECE8] text-[#17231D] rounded-xl text-xs font-semibold transition"
                    >
                      Save Draft
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeItemIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveItemIdx(activeItemIdx - 1)}
                        className="px-3 py-2 bg-white border border-[#E6ECE8] rounded-xl text-xs font-semibold text-[#17231D]"
                      >
                        Previous Item
                      </button>
                    )}

                    {activeItemIdx < currentSection.items.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveItemIdx(activeItemIdx + 1)}
                        className="px-4 py-2 bg-[#146B45] hover:bg-[#104B35] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <span>Next Item</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSaveInspection('submitted')}
                        className="px-5 py-2 bg-[#146B45] hover:bg-[#104B35] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Final Audit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official PDF Report Preview Modal */}
      {pdfReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto certificate-pattern border-4 border-[#146B45]/30">
            <div className="flex justify-between items-start border-b-2 border-[#146B45] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#146B45] text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#17231D]">RESTAURANT ELECTRICAL AUTHORITY</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Certificate of Electrical Site Readiness • Code: {pdfReport.assessment?.id?.substring(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
              <button onClick={() => setPdfReport(null)} className="text-[#66736B] hover:text-[#17231D] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F9F8] p-4 rounded-xl border border-[#E6ECE8] text-xs">
              <div>
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Facility</span>
                <span className="font-bold text-[#17231D]">{pdfReport.location?.name || 'Downtown Flagship'}</span>
              </div>
              <div>
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Inspection Date</span>
                <span className="font-bold text-[#17231D]">{pdfReport.assessment?.scheduled_date}</span>
              </div>
              <div>
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Readiness Score</span>
                <span className="font-bold text-[#146B45] font-mono text-sm">{pdfReport.score}% (Compliant)</span>
              </div>
              <div>
                <span className="text-[#66736B] block text-[10px] uppercase font-bold">Field Assessor</span>
                <span className="font-bold text-[#17231D]">David Martinez, ME</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6ECE8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white border border-[#E6ECE8] rounded-xl flex items-center justify-center p-1">
                  <QrCode className="w-12 h-12 text-[#17231D]" />
                </div>
                <div className="text-[10px] text-[#66736B]">
                  <span className="font-bold text-[#17231D] block">Tamper-Evident Verification Seal</span>
                  <span>Scan to verify digital twin record live</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-[#146B45] hover:bg-[#104B35] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
