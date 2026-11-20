import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';

export const restaurantController = {
  async list(req, res) {
    try {
      let query = supabase.from('restaurants').select('*');
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
      const { data: restaurant } = await supabase.from('restaurants').select('*').eq('id', id).single();
      if (!restaurant) return res.status(404).json({ success: false, error: { message: 'Restaurant not found' } });

      if (req.user.role !== 'super_admin' && req.user.organization_id !== restaurant.organization_id) {
        return res.status(403).json({ success: false, error: { message: 'Access denied' } });
      }

      const { data: locations } = await supabase.from('locations').select('*').eq('restaurant_id', id);

      return res.json({
        success: true,
        data: { ...restaurant, locations: locations || [] }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.role === 'super_admin' ? (req.body.organization_id || req.user.organization_id) : req.user.organization_id;
      const { data } = await supabase.from('restaurants').insert({
        ...req.body,
        organization_id: orgId
      });
      realtimeService.broadcast('RESTAURANT_CREATED', {
        restaurant: data,
        name: req.body.name,
        created_by: req.user.full_name
      }, orgId);
      return res.status(201).json({ success: true, message: 'Restaurant created', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { data } = await supabase.from('restaurants').eq('id', id).update(req.body);
      return res.json({ success: true, message: 'Restaurant updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
