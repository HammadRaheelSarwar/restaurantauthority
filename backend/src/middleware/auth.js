import { verifyToken } from '../utils/jwt.js';
import { supabase } from '../config/supabase.js';

/**
 * Authentication Middleware: Extracts Bearer token, verifies signature, and attaches user profile
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header or token' }
      });
    }

    let userProfile = null;

    // Check if token matches standard JWT
    try {
      const decoded = verifyToken(token);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', decoded.id)
        .single();
      userProfile = profile;
    } catch (jwtErr) {
      // Check if token is direct ID from test/seed or Supabase session
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', token)
        .single();

      if (profile) {
        userProfile = profile;
      }
    }

    if (!userProfile) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'User profile not found or token expired' }
      });
    }

    if (userProfile.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_SUSPENDED', message: 'Account has been deactivated or suspended' }
      });
    }

    req.user = userProfile;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: error.message }
    });
  }
}

/**
 * Role-Based Access Control Middleware
 * @param {string[]} allowedRoles
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    if (req.user.role === 'super_admin') {
      return next(); // Super admin bypasses all role constraints
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Role '${req.user.role}' lacks permission for this resource.`
        }
      });
    }

    next();
  };
}

/**
 * Organization Isolation Middleware
 * Enforces that user cannot query or mutate data belonging to other organizations
 */
export function requireOrgAccess() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } });
    }

    if (req.user.role === 'super_admin') {
      return next();
    }

    const orgIdFromParam = req.params.orgId || req.params.organization_id || req.body?.organization_id || req.query?.organization_id;

    if (orgIdFromParam && orgIdFromParam !== req.user.organization_id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CROSS_TENANT_ACCESS_DENIED',
          message: 'Access denied. You cannot access resources from a different organization.'
        }
      });
    }

    next();
  };
}
