import { supabase } from '../config/supabase.js';

export const organizationController = {
  async list(req, res) {
    try {
      let query = supabase.from('organizations').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('id', req.user.organization_id);
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
      if (req.user.role !== 'super_admin' && req.user.organization_id !== id) {
        return res.status(403).json({ success: false, error: { message: 'Access denied to organization' } });
      }

      const { data: org } = await supabase.from('organizations').select('*').eq('id', id).single();
      if (!org) return res.status(404).json({ success: false, error: { message: 'Organization not found' } });

      const { data: restaurants } = await supabase.from('restaurants').select('*').eq('organization_id', id);
      const { data: members } = await supabase.from('profiles').select('*').eq('organization_id', id);

      return res.json({
        success: true,
        data: { ...org, restaurants: restaurants || [], members: members || [] }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({ success: false, error: { message: 'Only Super Admin can create organizations' } });
      }
      const { data } = await supabase.from('organizations').insert(req.body);
      return res.status(201).json({ success: true, message: 'Organization created', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      if (req.user.role !== 'super_admin' && req.user.organization_id !== id) {
        return res.status(403).json({ success: false, error: { message: 'Access denied' } });
      }
      const { data } = await supabase.from('organizations').eq('id', id).update(req.body);
      return res.json({ success: true, message: 'Organization updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
