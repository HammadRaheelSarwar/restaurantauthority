import { supabase } from '../config/supabase.js';

export const documentController = {
  async list(req, res) {
    try {
      let query = supabase.from('documents').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      if (req.query.category) {
        query = query.eq('category', req.query.category);
      }
      const { data } = await query;
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async upload(req, res) {
    try {
      const { title, category, location_id, file_name, file_url, file_size, file_type } = req.body;
      const { data } = await supabase.from('documents').insert({
        organization_id: req.user.organization_id,
        location_id,
        category: category || 'general',
        title: title || file_name || 'Compliance Document',
        file_name: file_name || 'document.pdf',
        file_url: file_url || 'https://rea-compliance.com/sample.pdf',
        storage_path: `documents/${file_name || 'doc.pdf'}`,
        file_type: file_type || 'application/pdf',
        file_size: file_size || 1024,
        uploaded_by: req.user.id
      });
      return res.status(201).json({ success: true, message: 'Document cataloged', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
