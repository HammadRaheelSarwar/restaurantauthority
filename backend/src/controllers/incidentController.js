import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';

export const incidentController = {
  async list(req, res) {
    try {
      let query = supabase.from('incidents').select('*');
      if (req.user.role !== 'super_admin') {
        query = query.eq('organization_id', req.user.organization_id);
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
      const { data } = await supabase.from('incidents').select('*').eq('id', id).single();
      if (!data) return res.status(404).json({ success: false, error: { message: 'Incident not found' } });
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.organization_id || req.body.organization_id;
      const { data } = await supabase.from('incidents').insert({
        ...req.body,
        organization_id: orgId,
        reported_by: req.user.id,
        status: 'reported'
      });

      // Auto-create notification for organization admin
      await supabase.from('notifications').insert({
        user_id: req.user.id,
        organization_id: orgId,
        title: `Electrical Incident Reported: ${req.body.title}`,
        message: `Severity: ${req.body.severity.toUpperCase()} in location ${req.body.location_id}`,
        type: 'incident',
        link: '/incidents'
      });

      realtimeService.broadcast('INCIDENT_REPORTED', {
        incident: data,
        title: req.body.title,
        severity: req.body.severity,
        reported_by: req.user.full_name
      }, orgId);

      return res.status(201).json({ success: true, message: 'Incident reported successfully', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { data } = await supabase.from('incidents').eq('id', id).update(req.body);
      return res.json({ success: true, message: 'Incident updated', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
