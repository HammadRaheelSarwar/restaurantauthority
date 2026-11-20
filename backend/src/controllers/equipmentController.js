import { supabase } from '../config/supabase.js';

export const equipmentController = {
  async list(req, res) {
    try {
      let query = supabase.from('equipment').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      if (req.query.location_id) {
        query = query.eq('location_id', req.query.location_id);
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
      const { data } = await supabase.from('equipment').select('*').eq('id', id).single();
      if (!data) return res.status(404).json({ success: false, error: { message: 'Equipment not found' } });
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.organization_id || req.body.organization_id;
      const { data } = await supabase.from('equipment').insert({
        ...req.body,
        organization_id: orgId
      });
      return res.status(201).json({ success: true, message: 'Equipment registered', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { data } = await supabase.from('equipment').eq('id', id).update(req.body);
      return res.json({ success: true, message: 'Equipment updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
