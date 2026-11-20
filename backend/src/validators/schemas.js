// Comprehensive validation rules for compliance entities

export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: err.errors ? err.errors.map(e => ({ field: e.path.join('.'), message: e.message })) : err.message
        }
      });
    }
  };
}

// Lightweight schema validators (supports both Zod if installed, or fallback object validator)
export const schemas = {
  login: {
    parse(data) {
      if (!data.email || !data.password) throw new Error('Email and password are required');
      if (!/\S+@\S+\.\S+/.test(data.email)) throw new Error('Invalid email address format');
      return data;
    }
  },
  register: {
    parse(data) {
      if (!data.full_name || data.full_name.trim().length < 2) throw new Error('Full name is required (min 2 characters)');
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) throw new Error('Valid email address is required');
      if (!data.password || data.password.length < 6) throw new Error('Password must be at least 6 characters');
      return data;
    }
  },
  organization: {
    parse(data) {
      if (!data.name || data.name.trim().length < 2) throw new Error('Organization name is required');
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) throw new Error('Valid organization email is required');
      return data;
    }
  },
  restaurant: {
    parse(data) {
      if (!data.name || data.name.trim().length < 2) throw new Error('Restaurant name is required');
      if (!data.organization_id) throw new Error('Organization ID is required');
      return data;
    }
  },
  location: {
    parse(data) {
      if (!data.name) throw new Error('Location name is required');
      if (!data.restaurant_id) throw new Error('Restaurant ID is required');
      if (!data.address) throw new Error('Street address is required');
      if (!data.city || !data.state) throw new Error('City and State are required');
      return data;
    }
  },
  assessment: {
    parse(data) {
      if (!data.location_id) throw new Error('Location ID is required');
      if (!data.title) throw new Error('Assessment title is required');
      return data;
    }
  },
  equipment: {
    parse(data) {
      if (!data.name) throw new Error('Equipment name is required');
      if (!data.location_id) throw new Error('Location ID is required');
      return data;
    }
  },
  panel: {
    parse(data) {
      if (!data.panel_name) throw new Error('Panel name is required');
      if (!data.panel_identifier) throw new Error('Panel identifier is required (e.g. MDP-1)');
      if (!data.location_id) throw new Error('Location ID is required');
      return data;
    }
  },
  incident: {
    parse(data) {
      if (!data.location_id) throw new Error('Location ID is required');
      if (!data.title) throw new Error('Incident title is required');
      if (!data.category) throw new Error('Incident category is required');
      if (!data.severity) throw new Error('Severity rating is required (low, medium, high, critical)');
      if (!data.incident_date) throw new Error('Incident date is required');
      return data;
    }
  },
  correctiveAction: {
    parse(data) {
      if (!data.location_id) throw new Error('Location ID is required');
      if (!data.title) throw new Error('Corrective action title is required');
      if (!data.due_date) throw new Error('Due date is required');
      return data;
    }
  },
  contact: {
    parse(data) {
      if (!data.name) throw new Error('Name is required');
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) throw new Error('Valid email is required');
      if (!data.subject) throw new Error('Subject is required');
      if (!data.message || data.message.length < 5) throw new Error('Message is required (min 5 chars)');
      return data;
    }
  }
};
