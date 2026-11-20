import React, { useEffect, useState } from 'react';
import {
  Zap,
  Plus,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Layers,
  Thermometer,
  Activity,
  Maximize2,
  FileText,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function PanelsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [panels, setPanels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [viewMode, setViewMode] = useState('schedule'); // 'schedule' (42-circuit physical view) or 'cards'
  const [selectedPanel, setSelectedPanel] = useState('mdp1');
  const [showModal, setShowModal] = useState(false);

  // 42-circuit schedule data for MDP-1
  const [circuits, setCircuits] = useState([
    { slot: 1, name: 'Rational iCombi Pro #1 (Phase A)', pole: 3, amps: 50, load: 38.2, status: 'on', type: 'Cookline Heavy' },
    { slot: 3, name: 'Rational iCombi Pro #1 (Phase B)', pole: 3, amps: 50, load: 38.2, status: 'on', type: 'Cookline Heavy' },
    { slot: 5, name: 'Rational iCombi Pro #1 (Phase C)', pole: 3, amps: 50, load: 38.2, status: 'on', type: 'Cookline Heavy' },
    { slot: 7, name: 'Pitco Electric Fryer #1 (Phase A)', pole: 3, amps: 50, load: 42.0, status: 'on', type: 'Cookline Heavy' },
    { slot: 9, name: 'Pitco Electric Fryer #1 (Phase B)', pole: 3, amps: 50, load: 42.0, status: 'on', type: 'Cookline Heavy' },
    { slot: 11, name: 'Pitco Electric Fryer #1 (Phase C)', pole: 3, amps: 50, load: 42.0, status: 'on', type: 'Cookline Heavy' },
    { slot: 13, name: 'Dish Prep Sink GFCI Receptacle', pole: 1, amps: 20, load: 6.4, status: 'on', type: 'GFCI Wet' },
    { slot: 15, name: 'Hobart Booster Water Heater (A)', pole: 2, amps: 40, load: 32.0, status: 'on', type: 'Sanitation' },
    { slot: 17, name: 'Hobart Booster Water Heater (B)', pole: 2, amps: 40, load: 32.0, status: 'on', type: 'Sanitation' },
    { slot: 19, name: 'Kitchen Exhaust Hood Makeup Fan', pole: 3, amps: 30, load: 18.5, status: 'on', type: 'Ventilation' },
    { slot: 21, name: 'Kitchen Exhaust Hood Makeup Fan', pole: 3, amps: 30, load: 18.5, status: 'on', type: 'Ventilation' },
    { slot: 23, name: 'Kitchen Exhaust Hood Makeup Fan', pole: 3, amps: 30, load: 18.5, status: 'on', type: 'Ventilation' },
    { slot: 25, name: 'Spare Space', pole: 1, amps: 20, load: 0, status: 'spare', type: 'Spare' },
    { slot: 27, name: 'Spare Space', pole: 1, amps: 20, load: 0, status: 'spare', type: 'Spare' },
    { slot: 29, name: 'Walk-In Cooler Condenser (A)', pole: 2, amps: 30, load: 21.0, status: 'on', type: 'Refrigeration' },
    { slot: 31, name: 'Walk-In Cooler Condenser (B)', pole: 2, amps: 30, load: 21.0, status: 'on', type: 'Refrigeration' },
    { slot: 33, name: 'Walk-In Freezer Defrost Heaters', pole: 2, amps: 30, load: 19.5, status: 'on', type: 'Refrigeration' },
    { slot: 35, name: 'Walk-In Freezer Defrost Heaters', pole: 2, amps: 30, load: 19.5, status: 'on', type: 'Refrigeration' },
    { slot: 37, name: 'Front Counter POS & Receipt Printers', pole: 1, amps: 20, load: 4.8, status: 'on', type: 'Convenience' },
    { slot: 39, name: 'Emergency Egress Battery Lighting', pole: 1, amps: 20, load: 2.1, status: 'on', type: 'Life Safety' },
    { slot: 41, name: 'Spare Space', pole: 1, amps: 20, load: 0, status: 'spare', type: 'Spare' },

    // Right Column (Even circuits 2 to 42)
    { slot: 2, name: 'Traulsen Blast Chiller (Phase A)', pole: 2, amps: 30, load: 16.4, status: 'on', type: 'Refrigeration' },
    { slot: 4, name: 'Traulsen Blast Chiller (Phase B)', pole: 2, amps: 30, load: 16.4, status: 'on', type: 'Refrigeration' },
    { slot: 6, name: 'Hobart HL600 Heavy Planetary Mixer', pole: 3, amps: 30, load: 14.2, status: 'on', type: 'Prep Machinery' },
    { slot: 8, name: 'Hobart HL600 Heavy Planetary Mixer', pole: 3, amps: 30, load: 14.2, status: 'on', type: 'Prep Machinery' },
    { slot: 10, name: 'Hobart HL600 Heavy Planetary Mixer', pole: 3, amps: 30, load: 14.2, status: 'on', type: 'Prep Machinery' },
    { slot: 12, name: 'Bar Blender Prep Station GFCI', pole: 1, amps: 20, load: 5.2, status: 'on', type: 'GFCI Wet' },
    { slot: 14, name: 'Cookline Heat Lamps & Food Warmers', pole: 1, amps: 20, load: 15.0, status: 'on', type: 'Cookline' },
    { slot: 16, name: 'Sub-Panel PP-K Cookline Feeder (A)', pole: 3, amps: 100, load: 64.0, status: 'on', type: 'Subfeed' },
    { slot: 18, name: 'Sub-Panel PP-K Cookline Feeder (B)', pole: 3, amps: 100, load: 64.0, status: 'on', type: 'Subfeed' },
    { slot: 20, name: 'Sub-Panel PP-K Cookline Feeder (C)', pole: 3, amps: 100, load: 64.0, status: 'on', type: 'Subfeed' },
    { slot: 22, name: 'Ansul Hood Shunt-Trip Circuit', pole: 1, amps: 20, load: 1.2, status: 'on', type: 'Life Safety' },
    { slot: 24, name: 'Salad Prep Table Refrigeration', pole: 1, amps: 20, load: 8.4, status: 'on', type: 'Refrigeration' },
    { slot: 26, name: 'Ice Machine Flaker Condenser', pole: 1, amps: 20, load: 11.2, status: 'on', type: 'Refrigeration' },
    { slot: 28, name: 'Kitchen Task Overhead LED Lighting', pole: 1, amps: 20, load: 5.8, status: 'on', type: 'Lighting' },
    { slot: 30, name: 'Dining Room Architectural Lighting', pole: 1, amps: 20, load: 7.2, status: 'on', type: 'Lighting' },
    { slot: 32, name: 'Dishwasher Conveyor Motor Drive', pole: 2, amps: 30, load: 18.0, status: 'on', type: 'Sanitation' },
    { slot: 34, name: 'Dishwasher Conveyor Motor Drive', pole: 2, amps: 30, load: 18.0, status: 'on', type: 'Sanitation' },
    { slot: 36, name: 'Exterior Building Signage & Lights', pole: 1, amps: 20, load: 4.5, status: 'on', type: 'Lighting' },
    { slot: 38, name: 'Office Server & Security Camera Rack', pole: 1, amps: 20, load: 3.2, status: 'on', type: 'IT / Security' },
    { slot: 40, name: 'Spare Space', pole: 1, amps: 20, load: 0, status: 'spare', type: 'Spare' },
    { slot: 42, name: 'Spare Space', pole: 1, amps: 20, load: 0, status: 'spare', type: 'Spare' }
  ]);

  const [formData, setFormData] = useState({
    panel_name: 'Cookline Secondary Subpanel',
    panel_identifier: 'PP-K2',
    manufacturer: 'Square D / Schneider Electric (NQ Series)',
    model: 'NQ442L225',
    location_id: '',
    location_description: 'Adjacent to Cold Prep Kitchen Walkway',
    voltage_rating: '120/208V 3-Phase',
    amperage_rating: '225A',
    phase_type: 'Three Phase 4-Wire',
    status: 'operational'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [panRes, locRes] = await Promise.all([
        api.getPanels(),
        api.getLocations()
      ]);
      if (panRes.success) setPanels(panRes.data || []);
      if (locRes.success) {
        setLocations(locRes.data || []);
        if (locRes.data?.length > 0) {
          setFormData(prev => ({ ...prev, location_id: locRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBreaker = (slotNum) => {
    setCircuits(prev =>
      prev.map(c => {
        if (c.slot === slotNum) {
          if (c.status === 'spare') return c;
          const next = c.status === 'on' ? 'off' : 'on';
          addToast(`Circuit #${slotNum} (${c.name}) switched ${next.toUpperCase()}`, next === 'on' ? 'success' : 'info');
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createPanel(formData);
      if (res.success) {
        addToast('Electrical panel registered in database successfully');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const leftCircuits = circuits.filter(c => c.slot % 2 !== 0).sort((a, b) => a.slot - b.slot);
  const rightCircuits = circuits.filter(c => c.slot % 2 === 0).sort((a, b) => a.slot - b.slot);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Electrical Distribution Panels</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
              NEC 408.4 Enforced
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Digital single-line schedules, circuit-to-appliance directories, and 36-inch clearance monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'schedule'
                  ? 'bg-white text-brand-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>42-Circuit Schedule</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white text-brand-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Panel Directory ({panels.length || 3})</span>
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-900 hover:bg-brand-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Panel</span>
          </button>
        </div>
      </div>

      {viewMode === 'schedule' ? (
        /* Physical 42-Circuit Breaker Schedule View */
        <div className="space-y-6">
          {/* Panel Selector & Spec Summary Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-800 text-emerald-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
                  MDP-1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold tracking-tight">Main Distribution Panel (MDP-1)</h3>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      OPERATIONAL
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Square D NQ Series • Downtown Flagship Service Entrance • Main Electrical Closet #102
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">NEC 110.26 Clearance</span>
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>42 Inches (Compliant)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Spec Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Main Service</span>
                <span className="font-bold text-slate-100">400A 3-Pole</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Voltage & Phase</span>
                <span className="font-bold text-slate-100">120/208V 3Ø 4W</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Bus Rating</span>
                <span className="font-bold text-slate-100">400A Copper Bus</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Interrupting (AIC)</span>
                <span className="font-bold text-emerald-400">65,000 AIC</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Max Lug Temp (IR)</span>
                <span className="font-bold text-emerald-400">31.2°C (ΔT 3.1°C)</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Breaker Spaces</span>
                <span className="font-bold text-slate-100">38 Used / 4 Spare</span>
              </div>
            </div>
          </div>

          {/* Interactive 42-Circuit Visual Directory */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">42-Circuit Directory & Breaker Telemetry</h3>
                <p className="text-xs text-slate-500">Click any operational circuit breaker to toggle position or test simulated trip response</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> Closed (ON)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500"></span> Open (OFF/TRIPPED)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200"></span> Spare Space</span>
              </div>
            </div>

            {/* Breaker Rack Diagram */}
            <div className="bg-slate-100 rounded-2xl p-4 sm:p-6 border-2 border-slate-300 space-y-3">
              {/* Main Breaker Header */}
              <div className="bg-slate-800 text-white p-4 rounded-xl text-center space-y-1 shadow-sm">
                <div className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  MAIN SERVICE BREAKER: 400A 3-POLE MOLDED CASE
                </div>
                <div className="text-[11px] text-slate-300">
                  Thermal-Magnetic Trip • Square D PowerPact L-Frame • 65kAIC at 208V
                </div>
              </div>

              {/* Dual Column Circuits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column (Odd Circuits) */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 flex justify-between">
                    <span>ODD CIRCUITS (PHASE A/B/C)</span>
                    <span>LOAD / AMPS</span>
                  </div>
                  {leftCircuits.map((c) => {
                    const isSpare = c.status === 'spare';
                    return (
                      <div
                        key={c.slot}
                        onClick={() => handleToggleBreaker(c.slot)}
                        className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                          isSpare
                            ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                            : c.status === 'on'
                            ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                            : 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded bg-slate-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {c.slot}
                          </span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {c.type} • {c.pole}-Pole • {c.amps}A
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {!isSpare && (
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {c.status === 'on' ? `${c.load}A` : '0A'}
                            </span>
                          )}
                          <span
                            className={`w-7 h-5 rounded text-[10px] font-bold font-mono flex items-center justify-center uppercase ${
                              isSpare
                                ? 'bg-slate-200 text-slate-500'
                                : c.status === 'on'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {isSpare ? 'SP' : c.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column (Even Circuits) */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 flex justify-between">
                    <span>EVEN CIRCUITS (PHASE A/B/C)</span>
                    <span>LOAD / AMPS</span>
                  </div>
                  {rightCircuits.map((c) => {
                    const isSpare = c.status === 'spare';
                    return (
                      <div
                        key={c.slot}
                        onClick={() => handleToggleBreaker(c.slot)}
                        className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                          isSpare
                            ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                            : c.status === 'on'
                            ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                            : 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded bg-slate-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {c.slot}
                          </span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {c.type} • {c.pole}-Pole • {c.amps}A
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {!isSpare && (
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {c.status === 'on' ? `${c.load}A` : '0A'}
                            </span>
                          )}
                          <span
                            className={`w-7 h-5 rounded text-[10px] font-bold font-mono flex items-center justify-center uppercase ${
                              isSpare
                                ? 'bg-slate-200 text-slate-500'
                                : c.status === 'on'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {isSpare ? 'SP' : c.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {panels.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                    <Zap className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{p.panel_name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-700">{p.panel_identifier}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  p.status === 'operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Voltage & Amperage:</span>
                  <span className="font-semibold text-slate-800">{p.voltage_rating} • {p.amperage_rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Manufacturer:</span>
                  <span className="font-medium text-slate-700">{p.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location In Facility:</span>
                  <span className="font-medium text-slate-700">{p.location_description || 'Main Electrical Room'}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">NEC 110.26 Clearance:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>36"+ Clear</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setViewMode('schedule')}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1"
                >
                  <span>Open 42-Circuit Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Panel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register Electrical Panel</h3>
                <p className="text-xs text-slate-500">Record a new distribution panel or subpanel</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Panel Name</label>
                  <input
                    type="text"
                    required
                    value={formData.panel_name}
                    onChange={(e) => setFormData({ ...formData, panel_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Identifier Code</label>
                  <input
                    type="text"
                    required
                    value={formData.panel_identifier}
                    onChange={(e) => setFormData({ ...formData, panel_identifier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Voltage Rating</label>
                  <select
                    value={formData.voltage_rating}
                    onChange={(e) => setFormData({ ...formData, voltage_rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="120/208V 3-Phase">120/208V 3-Phase (Standard)</option>
                    <option value="480V 3-Phase">480V 3-Phase (Heavy Industrial)</option>
                    <option value="120/240V Single Phase">120/240V Single Phase</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amperage Rating</label>
                  <select
                    value={formData.amperage_rating}
                    onChange={(e) => setFormData({ ...formData, amperage_rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="100A">100A</option>
                    <option value="150A">150A</option>
                    <option value="200A">200A</option>
                    <option value="225A">225A</option>
                    <option value="400A">400A</option>
                    <option value="600A">600A</option>
                    <option value="800A">800A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Manufacturer & Model Series</label>
                <input
                  type="text"
                  required
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location In Facility</label>
                <input
                  type="text"
                  placeholder="e.g. Back hallway adjacent to dry storage"
                  value={formData.location_description}
                  onChange={(e) => setFormData({ ...formData, location_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-900 text-white font-bold hover:bg-brand-800"
                >
                  Save Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}