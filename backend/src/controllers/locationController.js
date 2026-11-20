import { supabase } from '../config/supabase.js';

export const locationController = {
  async list(req, res) {
    try {
      let query = supabase.from('locations').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      const { data } = await query;
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data: location } = await supabase.from('locations').select('*').eq('id', id).single();
      if (!location) return res.status(404).json({ success: false, error: { message: 'Location not found' } });

      if (req.user.role !== 'super_admin' && req.user.organization_id !== location.organization_id) {
        return res.status(403).json({ success: false, error: { message: 'Access denied' } });
      }

      // Fetch related compliance assets
      const { data: panels } = await supabase.from('electrical_panels').select('*').eq('location_id', id);
      const { data: equipment } = await supabase.from('equipment').select('*').eq('location_id', id);
      const { data: assessments } = await supabase.from('assessments').select('*').eq('location_id', id);
      const { data: incidents } = await supabase.from('incidents').select('*').eq('location_id', id);
      const { data: actions } = await supabase.from('corrective_actions').select('*').eq('location_id', id);

      return res.json({
        success: true,
        data: {
          ...location,
          panels: panels || [],
          equipment: equipment || [],
          assessments: assessments || [],
          incidents: incidents || [],
          actions: actions || []
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.role === 'super_admin' ? (req.body.organization_id || req.user.organization_id) : req.user.organization_id;
      const { data } = await supabase.from('locations').insert({
        ...req.body,
        organization_id: orgId,
        readiness_status: 'pending_review',
        readiness_score: 0.0
      });
      return res.status(201).json({ success: true, message: 'Location created', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { data } = await supabase.from('locations').eq('id', id).update(req.body);
      return res.json({ success: true, message: 'Location updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
