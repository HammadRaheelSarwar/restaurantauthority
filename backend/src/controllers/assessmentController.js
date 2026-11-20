import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';
import { pdfService } from '../services/pdfService.js';

export const assessmentController = {
  async list(req, res) {
    try {
      let query = supabase.from('assessments').select('*');
      if (req.user.role !== 'super_admin') {
        if (req.user.role === 'electrical_assessor') {
          query = query.eq('assessor_id', req.user.id);
        } else {
          query = query.eq('organization_id', req.user.organization_id);
        }
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
      const { data: assessment } = await supabase.from('assessments').select('*').eq('id', id).single();
      if (!assessment) return res.status(404).json({ success: false, error: { message: 'Assessment not found' } });

      const { data: location } = await supabase.from('locations').select('*').eq('id', assessment.location_id).single();
      const { data: responses } = await supabase.from('assessment_responses').select('*').eq('assessment_id', id);
      const { data: template } = await supabase.from('assessment_templates').select('*').eq('id', assessment.template_id).single();

      return res.json({
        success: true,
        data: {
          ...assessment,
          location,
          template,
          responses: responses || []
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.user.organization_id || req.body.organization_id;
      const { data } = await supabase.from('assessments').insert({
        ...req.body,
        organization_id: orgId,
        assessor_id: req.body.assessor_id || req.user.id,
        status: 'scheduled',
        score: 0.0
      });
      return res.status(201).json({ success: true, message: 'Assessment scheduled', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async saveResponses(req, res) {
    try {
      const { id } = req.params;
      const { responses = [], status = 'in_progress' } = req.body;

      let passCount = 0;
      let totalEvaluated = 0;

      for (const resp of responses) {
        totalEvaluated++;
        if (resp.status === 'pass') passCount++;

        // Insert or update response
        await supabase.from('assessment_responses').insert({
          assessment_id: id,
          item_id: resp.item_id,
          status: resp.status,
          comments: resp.comments || '',
          severity: resp.severity || 'low',
          requires_corrective_action: resp.status === 'fail' || resp.status === 'needs_attention'
        });

        // Trigger corrective action if item failed
        if (resp.status === 'fail' || (resp.status === 'needs_attention' && resp.requires_corrective_action)) {
          const { data: assessment } = await supabase.from('assessments').select('*').eq('id', id).single();
          await supabase.from('corrective_actions').insert({
            organization_id: assessment.organization_id,
            location_id: assessment.location_id,
            assessment_id: id,
            title: `Resolve Assessment Defect: Item ${resp.item_code || resp.item_id}`,
            description: resp.comments || 'Identified during electrical site inspection',
            priority: resp.severity === 'critical' ? 'urgent' : (resp.severity || 'medium'),
            status: 'open',
            due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            created_by: req.user.id
          });
        }
      }

      const calculatedScore = totalEvaluated > 0 ? Number(((passCount / totalEvaluated) * 100).toFixed(2)) : 0;

      const { data: updated } = await supabase.from('assessments').eq('id', id).update({
        status,
        score: calculatedScore,
        completed_date: status === 'submitted' ? new Date().toISOString().split('T')[0] : null
      });

      if (status === 'submitted') {
        realtimeService.broadcast('ASSESSMENT_SUBMITTED', {
          assessment_id: id,
          score: calculatedScore,
          submitted_by: req.user.full_name
        });
      }

      return res.json({
        success: true,
        message: 'Assessment responses recorded',
        data: { score: calculatedScore, status }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async approve(req, res) {
    try {
      const { id } = req.params;
      const { data: assessment } = await supabase.from('assessments').select('*').eq('id', id).single();
      if (!assessment) return res.status(404).json({ success: false, error: { message: 'Assessment not found' } });

      const { data: updated } = await supabase.from('assessments').eq('id', id).update({
        status: 'approved',
        approved_by: req.user.id,
        approved_at: new Date().toISOString()
      });

      // Update location readiness score based on approved assessment
      const readinessStatus = assessment.score >= 85 ? 'compliant' : (assessment.score >= 70 ? 'needs_attention' : 'non_compliant');
      await supabase.from('locations').eq('id', assessment.location_id).update({
        readiness_status: readinessStatus,
        readiness_score: assessment.score
      });

      realtimeService.broadcast('ASSESSMENT_APPROVED', {
        assessment_id: id,
        approved_by: req.user.full_name,
        location_id: assessment.location_id
      });

      return res.json({ success: true, message: 'Assessment approved successfully', data: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async downloadPdf(req, res) {
    try {
      const { id } = req.params;
      const { data: assessment } = await supabase.from('assessments').select('*').eq('id', id).single();
      const { data: location } = await supabase.from('locations').select('*').eq('id', assessment?.location_id).single();
      const { data: responses } = await supabase.from('assessment_responses').select('*').eq('assessment_id', id);

      const report = await pdfService.generateAssessmentReport(assessment, location, responses);
      return res.json({ success: true, data: report });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
