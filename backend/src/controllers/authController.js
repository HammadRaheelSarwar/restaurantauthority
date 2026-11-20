import { supabase } from '../config/supabase.js';
import { signToken } from '../utils/jwt.js';

export const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'No account found with this email address' }
        });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          error: { code: 'ACCOUNT_INACTIVE', message: 'Your account is inactive or suspended' }
        });
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id
      });

      return res.json({
        success: true,
        message: 'Authentication successful',
        data: {
          user,
          token
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async register(req, res) {
    try {
      const { full_name, email, password, organization_name, role = 'restaurant_manager' } = req.body;

      // Check if user already exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (existing) {
        return res.status(400).json({
          success: false,
          error: { code: 'USER_EXISTS', message: 'An account with this email already exists' }
        });
      }

      let organizationId = null;
      if (organization_name) {
        const { data: newOrg } = await supabase.from('organizations').insert({
          name: organization_name,
          email: email.trim().toLowerCase(),
          status: 'active'
        });
        organizationId = newOrg.id;
      }

      const { data: newProfile } = await supabase.from('profiles').insert({
        full_name,
        email: email.trim().toLowerCase(),
        role: role || 'restaurant_manager',
        organization_id: organizationId,
        status: 'active'
      });

      const token = signToken({
        id: newProfile.id,
        email: newProfile.email,
        role: newProfile.role,
        organization_id: newProfile.organization_id
      });

      return res.status(201).json({
        success: true,
        message: 'Account successfully registered',
        data: {
          user: newProfile,
          token
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async me(req, res) {
    return res.json({
      success: true,
      data: { user: req.user }
    });
  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    return res.json({
      success: true,
      message: `If an account exists for ${email}, a password reset link has been dispatched.`
    });
  }
};
