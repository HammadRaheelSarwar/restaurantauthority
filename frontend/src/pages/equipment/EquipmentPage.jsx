import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Zap,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  Filter,
  FileText,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function EquipmentPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Rational iCombi Pro 10-Full Size',
    category: 'Heavy Cookline',
    manufacturer: 'Rational USA',
    model_number: 'iCP 10-FULL',
    serial_number: 'E11MH24018892',
    location_id: '',
    voltage: '480V 3-Phase',
    amperage: '50A FLA',
    plug_type: 'NEMA 15-50P Cord Cap',
    panel_feeder: 'MDP-1 (Slots 1, 3, 5)',
    condition: 'excellent',
    status: 'active',
    maintenance_notes: 'Thermal scan verified delta T < 2°C at terminal block. Water filter cartridges replaced.'
  });

  const sampleEquipment = [
    {
      id: 'eq-1',
      name: 'Rational iCombi Pro 10-Full Combi Oven',
      category: 'Heavy Cookline',
      manufacturer: 'Rational USA',
      model_number: 'iCP 10-FULL',
      serial_number: 'E11MH24018892',
      voltage: '480V 3-Phase',
      amperage: '45.0A (50A Breaker)',
      plug_type: 'NEMA 15-50P / Pin & Sleeve',
      panel_feeder: 'MDP-1 (Circuits 1, 3, 5)',
      condition: 'excellent',
      status: 'active',
      lastThermalScan: 'Jan 15, 2026',
      maxLugTemp: '31.4°C (Safe)',
      location_name: 'Downtown Flagship',
      maintenance_notes: 'Tri-annual descaling and gasket inspection passed. Cord strain relief undamaged.'
    },
    {
      id: 'eq-2',
      name: 'Hobart HL600 Legacy 60-Qt Heavy Mixer',
      category: 'Prep Machinery',
      manufacturer: 'Hobart Corporation',
      model_number: 'HL600-1STD',
      serial_number: '31-149-8821',
      voltage: '208V 3-Phase',
      amperage: '14.2A (30A Breaker)',
      plug_type: 'Hardwired NEMA 4X Disconnect Switch',
      panel_feeder: 'MDP-1 (Circuits 6, 8, 10)',
      condition: 'good',
      status: 'active',
      lastThermalScan: 'Jan 15, 2026',
      maxLugTemp: '28.8°C (Safe)',
      location_name: 'Downtown Flagship',
      maintenance_notes: 'Bowl guard safety interlock switch verified. Emergency paddle stop functioning.'
    },
    {
      id: 'eq-3',
      name: 'Pitco Solstice Electric Triple Fryer',
      category: 'Heavy Cookline',
      manufacturer: 'Pitco Frialator',
      model_number: 'SE14-3S/FD',
      serial_number: 'G23B09881',
      voltage: '240V 3-Phase',
      amperage: '42.0A (50A Breaker)',
      plug_type: 'Direct Shunt-Trip Interlock',
      panel_feeder: 'MDP-1 (Circuits 7, 9, 11)',
      condition: 'good',
      status: 'active',
      lastThermalScan: 'Jan 15, 2026',
      maxLugTemp: '34.2°C (Safe)',
      location_name: 'Downtown Flagship',
      maintenance_notes: 'Ansul hood shunt-trip microswitch kills electric power automatically within 0.8s of pull.'
    },
    {
      id: 'eq-4',
      name: 'Traulsen G-Series Reach-In Blast Chiller',
      category: 'Refrigeration',
      manufacturer: 'Traulsen Refrigeration',
      model_number: 'G20010P',
      serial_number: 'T4490182-01',
      voltage: '208-230V 1-Phase',
      amperage: '16.0A (20A Breaker)',
      plug_type: 'NEMA 6-20P Heavy Duty',
      panel_feeder: 'MDP-1 (Circuits 2, 4)',
      condition: 'good',
      status: 'active',
      lastThermalScan: 'Jan 15, 2026',
      maxLugTemp: '26.4°C (Safe)',
      location_name: 'Downtown Flagship',
      maintenance_notes: 'Condenser coils vacuumed. Condensate drain heater circuit operational.'
    },
    {
      id: 'eq-5',
      name: 'CaptiveAire DOAS Makeup Air & Exhaust Hood',
      category: 'Ventilation & Life Safety',
      manufacturer: 'CaptiveAire Systems',
      model_number: 'NDU-15-DOAS',
      serial_number: 'CA-2023-99120',
      voltage: '480V 3-Phase',
      amperage: '18.5A (30A Breaker)',
      plug_type: 'Roof Disconnect NEMA 3R',
      panel_feeder: 'MDP-1 (Circuits 19, 21, 23)',
      condition: 'excellent',
      status: 'active',
      lastThermalScan: 'Jan 15, 2026',
      maxLugTemp: '29.1°C (Safe)',
      location_name: 'Downtown Flagship',
      maintenance_notes: 'Quarterly interlock trip audit verified. Exhaust fan starts on thermal sensor trigger.'
    },
    {
      id: 'eq-6',
      name: 'Hobart AM16 Commercial Conveyor Dishwasher',
      category: 'Sanitation',
      manufacturer: 'Hobart Corporation',
      model_number: 'AM16T-BAS',
      serial_number: 'HB-881204',
      voltage: '208V 3-Phase + Booster 480V',
      amperage: '32.0A (40A Breaker)',
      plug_type: 'Sealed Liquidtight Conduit',
      panel_feeder: 'MDP-1 (Circuits 15, 17)',
      condition: 'good',
      status: 'active',
      lastThermalScan: 'Jan 15, 2026',
      maxLugTemp: '33.0°C (Safe)',
      location_name: 'Downtown Flagship',
      maintenance_notes: '180°F rinse booster element contacts torqued to manufacturer specification.'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eqRes, locRes] = await Promise.all([
        api.getEquipment(),
        api.getLocations()
      ]);
      if (eqRes.success && eqRes.data?.length > 0) {
        setEquipment(eqRes.data);
      } else {
        setEquipment(sampleEquipment);
      }
      if (locRes.success) {
        setLocations(locRes.data || []);
        if (locRes.data?.length > 0) {
          setFormData(prev => ({ ...prev, location_id: locRes.data[0].id }));
        }
      }
    } catch (err) {
      setEquipment(sampleEquipment);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createEquipment(formData);
      if (res.success) {
        addToast('Equipment registered successfully in database');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredEquipment = equipment.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category?.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Commercial Equipment Telemetry</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
              UL 197 & NFPA 70
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Preventive electrical tracking for high-draw foodservice appliances, thermal scans, and NEMA cord caps
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-900 hover:bg-brand-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register Equipment</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Appliances' },
          { id: 'cookline', label: 'Heavy Cookline' },
          { id: 'prep', label: 'Prep Machinery' },
          { id: 'refrigeration', label: 'Refrigeration' },
          { id: 'ventilation', label: 'Exhaust & Life Safety' },
          { id: 'sanitation', label: 'Sanitation' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === cat.id
                ? 'bg-brand-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                    <Cpu className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{item.name}</h3>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {item.manufacturer} • {item.model_number}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  item.condition === 'excellent' || item.condition === 'good'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.condition}
                </span>
              </div>

              {/* Electrical Specs */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Power Rating:</span>
                  <span className="font-mono font-bold text-slate-800">{item.voltage} • {item.amperage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Connection / Plug:</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">{item.plug_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fed From:</span>
                  <span className="font-mono font-bold text-emerald-700">{item.panel_feeder}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                {item.maintenance_notes}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                <span>IR: {item.maxLugTemp || '31.4°C'}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900">
                <span>View Spec</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {selectedItem.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedItem.name}</h3>
                <span className="text-xs text-slate-500">Serial: {selectedItem.serial_number}</span>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Manufacturer</span>
                  <span className="font-bold text-slate-800">{selectedItem.manufacturer}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Model</span>
                  <span className="font-bold text-slate-800">{selectedItem.model_number}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Electrical Feed & Protection</h4>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedItem.voltage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Load Amps:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedItem.amperage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Source Panel:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedItem.panel_feeder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connection:</span>
                  <span className="font-semibold text-slate-700">{selectedItem.plug_type}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Maintenance & Condition Log</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedItem.maintenance_notes}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-brand-900 hover:bg-brand-800 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Equipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register Commercial Equipment</h3>
                <p className="text-xs text-slate-500">Record a high-draw cooking or refrigeration asset</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Heavy Cookline">Heavy Cookline</option>
                    <option value="Prep Machinery">Prep Machinery</option>
                    <option value="Refrigeration">Refrigeration</option>
                    <option value="Ventilation & Life Safety">Ventilation & Life Safety</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair (Schedule Inspection)</option>
                    <option value="poor">Poor (Requires Service)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Number</label>
                  <input
                    type="text"
                    required
                    value={formData.model_number}
                    onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Voltage / Phase</label>
                  <input
                    type="text"
                    value={formData.voltage}
                    onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fed From Panel</label>
                  <input
                    type="text"
                    value={formData.panel_feeder}
                    onChange={(e) => setFormData({ ...formData, panel_feeder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}