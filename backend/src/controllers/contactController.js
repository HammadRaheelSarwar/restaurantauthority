import { supabase } from '../config/supabase.js';

export const contactController = {
  async submit(req, res) {
    try {
      const { name, email, organization, subject, message } = req.body;
      const { data } = await supabase.from('contact_messages').insert({
        name,
        email,
        organization,
        subject,
        message,
        status: 'new'
      });
      return res.status(201).json({
        success: true,
        message: 'Thank you for contacting Restaurant Electrical Authority. Our compliance advisory team will reach out shortly.',
        data
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async list(req, res) {
    try {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
