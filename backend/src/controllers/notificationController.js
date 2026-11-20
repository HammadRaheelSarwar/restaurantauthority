import { supabase } from '../config/supabase.js';

export const notificationController = {
  async list(req, res) {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async markRead(req, res) {
    try {
      const { id } = req.params;
      if (id === 'all') {
        await supabase.from('notifications').eq('user_id', req.user.id).update({ is_read: true });
        return res.json({ success: true, message: 'All notifications marked as read' });
      }
      const { data } = await supabase.from('notifications').eq('id', id).update({ is_read: true });
      return res.json({ success: true, message: 'Notification marked as read', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
