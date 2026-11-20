import { supabase } from '../config/supabase.js';

export const settingController = {
  async list(req, res) {
    try {
      const { data } = await supabase.from('system_settings').select('*');
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { key } = req.params;
      const { value, description } = req.body;
      const { data } = await supabase.from('system_settings').eq('key', key).update({
        value,
        description,
        updated_by: req.user.id
      });
      return res.json({ success: true, message: 'Setting updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
