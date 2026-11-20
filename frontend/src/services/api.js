const API_BASE = '/api';

function getAuthToken() {
  return localStorage.getItem('rea_token') || '';
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/certification/verify')) {
      console.warn('Session expired or unauthorized');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`[API Call Failed: ${endpoint}]`, err);
    throw err;
  }
}

// API Service Interface
export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => apiRequest('/auth/me'),

  // Organizations
  getOrganizations: () => apiRequest('/organizations'),
  getOrganization: (id) => apiRequest(`/organizations/${id}`),
  createOrganization: (data) => apiRequest('/organizations', { method: 'POST', body: JSON.stringify(data) }),

  // Restaurants & Locations
  getRestaurants: () => apiRequest('/restaurants'),
  getRestaurant: (id) => apiRequest(`/restaurants/${id}`),
  createRestaurant: (data) => apiRequest('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  getLocations: () => apiRequest('/locations'),
  getLocation: (id) => apiRequest(`/locations/${id}`),
  createLocation: (data) => apiRequest('/locations', { method: 'POST', body: JSON.stringify(data) }),

  // Assessments & Templates
  getTemplates: () => apiRequest('/assessment-templates'),
  getAssessments: () => apiRequest('/assessments'),
  getAssessment: (id) => apiRequest(`/assessments/${id}`),
  createAssessment: (data) => apiRequest('/assessments', { method: 'POST', body: JSON.stringify(data) }),
  saveAssessmentResponses: (id, responses, status) => apiRequest(`/assessments/${id}/responses`, {
    method: 'POST',
    body: JSON.stringify({ responses, status })
  }),
  approveAssessment: (id) => apiRequest(`/assessments/${id}/approve`, { method: 'POST' }),
  getAssessmentPdf: (id) => apiRequest(`/assessments/${id}/pdf`),

  // Equipment & Panels
  getEquipment: (params = {}) => apiRequest(`/equipment${params.location_id ? `?location_id=${params.location_id}` : ''}`),
  createEquipment: (data) => apiRequest('/equipment', { method: 'POST', body: JSON.stringify(data) }),
  getPanels: (params = {}) => apiRequest(`/electrical-panels${params.location_id ? `?location_id=${params.location_id}` : ''}`),
  createPanel: (data) => apiRequest('/electrical-panels', { method: 'POST', body: JSON.stringify(data) }),

  // Incidents & Actions
  getIncidents: () => apiRequest('/incidents'),
  createIncident: (data) => apiRequest('/incidents', { method: 'POST', body: JSON.stringify(data) }),
  updateIncident: (id, data) => apiRequest(`/incidents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getCorrectiveActions: (status) => apiRequest(`/corrective-actions${status ? `?status=${status}` : ''}`),
  createCorrectiveAction: (data) => apiRequest('/corrective-actions', { method: 'POST', body: JSON.stringify(data) }),
  updateCorrectiveAction: (id, data) => apiRequest(`/corrective-actions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Annual Reviews
  getAnnualReviews: () => apiRequest('/annual-reviews'),
  getAnnualReview: (id) => apiRequest(`/annual-reviews/${id}`),
  createAnnualReview: (data) => apiRequest('/annual-reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnualReview: (id, data) => apiRequest(`/annual-reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Manager Certification Academy
  getPrograms: () => apiRequest('/certification/programs'),
  getApplications: () => apiRequest('/certification/applications'),
  applyForCertification: (program_id) => apiRequest('/certification/apply', { method: 'POST', body: JSON.stringify({ program_id }) }),
  updateApplication: (id, data) => apiRequest(`/certification/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getCertificates: () => apiRequest('/certification/certificates'),
  verifyCertificatePublic: (code) => apiRequest(`/certification/verify/${encodeURIComponent(code)}`),

  // Courses & Exams
  getCourses: () => apiRequest('/certification/courses'),
  completeModule: (moduleId, application_id) => apiRequest(`/certification/courses/${moduleId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ application_id })
  }),
  getExam: (id) => apiRequest(`/certification/exams/${id}`),
  submitExam: (id, payload) => apiRequest(`/certification/exams/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Documents & Notifications
  getDocuments: (category) => apiRequest(`/documents${category ? `?category=${category}` : ''}`),
  uploadDocument: (data) => apiRequest('/documents/upload', { method: 'POST', body: JSON.stringify(data) }),
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),

  // Analytics, Audits, Contact & Settings
  getAnalytics: () => apiRequest('/reports/analytics'),
  getAuditLogs: () => apiRequest('/audit-logs'),
  submitContact: (data) => apiRequest('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getSettings: () => apiRequest('/settings'),
  updateSetting: (key, data) => apiRequest(`/settings/${key}`, { method: 'PUT', body: JSON.stringify(data) }),
  getUsers: () => apiRequest('/users'),
  inviteUser: (data) => apiRequest('/users/invite', { method: 'POST', body: JSON.stringify(data) })
};
