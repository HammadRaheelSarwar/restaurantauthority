import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';

export const actionController = {
  async list(req, res) {
    try {
      let query = supabase.from('corrective_actions').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      if (req.query.status) {
        query = query.eq('status', req.query.status);
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
      const { data } = await supabase.from('corrective_actions').select('*').eq('id', id).single();
      if (!data) return res.status(404).json({ success: false, error: { message: 'Corrective action not found' } });
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.organization_id || req.body.organization_id;
      const { data } = await supabase.from('corrective_actions').insert({
        ...req.body,
        organization_id: orgId,
        created_by: req.user.id,
        status: req.body.status || 'open'
      });
      return res.status(201).json({ success: true, message: 'Corrective action registered', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      if (req.body.status === 'approved' || req.body.status === 'closed') {
        updateData.verified_by = req.user.id;
        updateData.verified_at = new Date().toISOString();
      }
      const { data } = await supabase.from('corrective_actions').eq('id', id).update(updateData);
      realtimeService.broadcast('ACTION_UPDATED', {
        action: data,
        action_id: id,
        updated_by: req.user.full_name
      });
      return res.json({ success: true, message: 'Corrective action updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
