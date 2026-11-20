import { supabase } from '../config/supabase.js';

export const auditController = {
  async list(req, res) {
    try {
      let query = supabase.from('audit_logs').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      const { data } = await query.order('created_at', { ascending: false });
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
