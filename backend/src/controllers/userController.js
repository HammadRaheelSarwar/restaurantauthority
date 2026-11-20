import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';

export const userController = {
  async list(req, res) {
    try {
      let query = supabase.from('profiles').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      const { data } = await query;
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async invite(req, res) {
    try {
      const { email, role, full_name, organization_id } = req.body;
      const targetOrg = req.user.role === 'super_admin' ? (organization_id || req.user.organization_id) : req.user.organization_id;

      const { data: newProfile } = await supabase.from('profiles').insert({
        full_name: full_name || email.split('@')[0],
        email: email.trim().toLowerCase(),
        role: role || 'restaurant_manager',
        organization_id: targetOrg,
        status: 'active'
      });

      realtimeService.broadcast('USER_INVITED', {
        email,
        role,
        full_name,
        organization_id: targetOrg,
        invited_by: req.user.full_name
      }, targetOrg);

      return res.status(201).json({
        success: true,
        message: `Invitation successfully issued to ${email}`,
        data: newProfile
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { data } = await supabase.from('profiles').eq('id', id).update({ status });
      return res.json({ success: true, message: 'User status updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
