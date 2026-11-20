import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';

export const reviewController = {
  async list(req, res) {
    try {
      let query = supabase.from('annual_reviews').select('*');
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
      const { data: review } = await supabase.from('annual_reviews').select('*').eq('id', id).single();
      if (!review) return res.status(404).json({ success: false, error: { message: 'Review not found' } });

      const { data: location } = await supabase.from('locations').select('*').eq('id', review.location_id).single();
      return res.json({ success: true, data: { ...review, location } });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.organization_id || req.body.organization_id;
      const { data } = await supabase.from('annual_reviews').insert({
        ...req.body,
        organization_id: orgId,
        reviewer_id: req.body.reviewer_id || req.user.id,
        status: 'upcoming'
      });
      return res.status(201).json({ success: true, message: 'Annual review scheduled', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      if (req.body.status === 'approved') {
        updateData.approved_by = req.user.id;
        updateData.approved_at = new Date().toISOString();
      }
      const { data } = await supabase.from('annual_reviews').eq('id', id).update(updateData);
      if (req.body.status === 'approved') {
        realtimeService.broadcast('REVIEW_APPROVED', {
          review_id: id,
          approved_by: req.user.full_name
        });
      }
      return res.json({ success: true, message: 'Annual review updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
