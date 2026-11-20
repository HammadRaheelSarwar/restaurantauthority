import { supabase } from '../config/supabase.js';

export const certificationController = {
  async listPrograms(req, res) {
    try {
      const { data } = await supabase.from('certification_programs').select('*').eq('is_active', true);
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async listApplications(req, res) {
    try {
      let query = supabase.from('certification_applications').select('*');
      if (req.user.role === 'restaurant_manager') {
        query = query.eq('user_id', req.user.id);
      } else if (req.user.role !== 'super_admin' && req.user.role !== 'certification_manager') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      const { data } = await query;
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async apply(req, res) {
    try {
      const { program_id } = req.body;
      const { data } = await supabase.from('certification_applications').insert({
        program_id,
        user_id: req.user.id,
        organization_id: req.user.organization_id,
        status: 'applied',
        submitted_at: new Date().toISOString()
      });
      return res.status(201).json({ success: true, message: 'Certification application submitted', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async updateApplication(req, res) {
    try {
      const { id } = req.params;
      const { status, review_notes } = req.body;
      const { data: updated } = await supabase.from('certification_applications').eq('id', id).update({
        status,
        review_notes,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString()
      });

      // If approved or passed, issue certificate
      if (status === 'issued') {
        const { data: app } = await supabase.from('certification_applications').select('*').eq('id', id).single();
        const certNumber = `CRESM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const verificationCode = `REA-VRF-${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

        await supabase.from('certifications').insert({
          certificate_number: certNumber,
          application_id: id,
          user_id: app.user_id,
          organization_id: app.organization_id,
          program_id: app.program_id,
          issue_date: new Date().toISOString().split('T')[0],
          expiry_date: new Date(Date.now() + 730 * 86400000).toISOString().split('T')[0],
          status: 'active',
          verification_code: verificationCode,
          qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://rea-compliance.com/verify/${verificationCode}`,
          issued_by: req.user.id
        });
      }

      return res.json({ success: true, message: 'Application updated', data: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async listCertificates(req, res) {
    try {
      let query = supabase.from('certifications').select('*');
      if (req.user.role === 'restaurant_manager') {
        query = query.eq('user_id', req.user.id);
      } else if (req.user.role !== 'super_admin' && req.user.role !== 'certification_manager') {
        query = query.eq('organization_id', req.user.organization_id);
      }
      const { data } = await query;
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  // Public endpoint for QR code & certificate number verification
  async verifyPublic(req, res) {
    try {
      const { code } = req.params;
      const { data: cert } = await supabase
        .from('certifications')
        .select('*')
        .eq('verification_code', code)
        .single();

      let certificate = cert;
      if (!certificate) {
        // Fallback search by certificate_number
        const { data: certByNumber } = await supabase
          .from('certifications')
          .select('*')
          .eq('certificate_number', code)
          .single();
        certificate = certByNumber;
      }

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'No valid certificate found matching this credential identifier' }
        });
      }

      const { data: user } = await supabase.from('profiles').select('full_name').eq('id', certificate.user_id).single();
      const { data: program } = await supabase.from('certification_programs').select('title').eq('id', certificate.program_id).single();
      const { data: org } = await supabase.from('organizations').select('name').eq('id', certificate.organization_id).single();

      return res.json({
        success: true,
        data: {
          verified: true,
          certificate_number: certificate.certificate_number,
          verification_code: certificate.verification_code,
          recipient_name: user?.full_name || 'Authorized Restaurant Manager',
          organization_name: org?.name || 'Authorized Hospitality Group',
          program_title: program?.title || 'Certified Restaurant Electrical Safety Manager (CRESM)',
          issue_date: certificate.issue_date,
          expiry_date: certificate.expiry_date,
          status: certificate.status,
          qr_code_url: certificate.qr_code_url
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
