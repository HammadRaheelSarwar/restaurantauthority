import { Router } from '../utils/router.js';
import { authenticate, requireRole, requireOrgAccess } from '../middleware/auth.js';
import { authController } from '../controllers/authController.js';
import { userController } from '../controllers/userController.js';
import { organizationController } from '../controllers/organizationController.js';
import { restaurantController } from '../controllers/restaurantController.js';
import { locationController } from '../controllers/locationController.js';
import { assessmentController } from '../controllers/assessmentController.js';
import { templateController } from '../controllers/templateController.js';
import { equipmentController } from '../controllers/equipmentController.js';
import { panelController } from '../controllers/panelController.js';
import { incidentController } from '../controllers/incidentController.js';
import { actionController } from '../controllers/actionController.js';
import { reviewController } from '../controllers/reviewController.js';
import { certificationController } from '../controllers/certificationController.js';
import { courseController } from '../controllers/courseController.js';
import { examController } from '../controllers/examController.js';
import { documentController } from '../controllers/documentController.js';
import { notificationController } from '../controllers/notificationController.js';
import { reportController } from '../controllers/reportController.js';
import { auditController } from '../controllers/auditController.js';
import { contactController } from '../controllers/contactController.js';
import { settingController } from '../controllers/settingController.js';
import { realtimeService } from '../services/realtimeService.js';

const router = Router();

// ==========================================
// 1. PUBLIC ROUTES (No Auth Required)
// ==========================================
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/contact', contactController.submit);
router.get('/certification/verify/:code', certificationController.verifyPublic);
router.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// ==========================================
// 2. AUTHENTICATED COMPLIANCE ROUTES
// ==========================================
router.use(authenticate);

// Current User Profile
router.get('/auth/me', authController.me);

// Realtime SSE Event Stream
router.get('/realtime/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  realtimeService.addClient(clientId, res, req.user);

  req.on('close', () => {
    realtimeService.removeClient(clientId);
  });
});

// User Management
router.get('/users', requireRole(['super_admin', 'admin']), userController.list);
router.post('/users/invite', requireRole(['super_admin', 'admin']), userController.invite);
router.patch('/users/:id/status', requireRole(['super_admin', 'admin']), userController.updateStatus);

// Organizations
router.get('/organizations', organizationController.list);
router.get('/organizations/:id', organizationController.getById);
router.post('/organizations', requireRole(['super_admin']), organizationController.create);
router.put('/organizations/:id', requireRole(['super_admin', 'admin']), organizationController.update);

// Restaurants
router.get('/restaurants', restaurantController.list);
router.get('/restaurants/:id', restaurantController.getById);
router.post('/restaurants', requireRole(['super_admin', 'admin', 'restaurant_operator']), restaurantController.create);
router.put('/restaurants/:id', requireRole(['super_admin', 'admin', 'restaurant_operator']), restaurantController.update);

// Locations
router.get('/locations', locationController.list);
router.get('/locations/:id', locationController.getById);
router.post('/locations', requireRole(['super_admin', 'admin', 'restaurant_operator']), locationController.create);
router.put('/locations/:id', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager']), locationController.update);

// Site Assessments & Templates
router.get('/assessment-templates', templateController.list);
router.post('/assessment-templates', requireRole(['super_admin', 'admin']), templateController.create);

router.get('/assessments', assessmentController.list);
router.get('/assessments/:id', assessmentController.getById);
router.post('/assessments', requireRole(['super_admin', 'admin', 'restaurant_operator', 'electrical_assessor']), assessmentController.create);
router.post('/assessments/:id/responses', requireRole(['super_admin', 'electrical_assessor']), assessmentController.saveResponses);
router.post('/assessments/:id/approve', requireRole(['super_admin', 'admin']), assessmentController.approve);
router.get('/assessments/:id/pdf', assessmentController.downloadPdf);

// Equipment & Panels
router.get('/equipment', equipmentController.list);
router.get('/equipment/:id', equipmentController.getById);
router.post('/equipment', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor']), equipmentController.create);
router.put('/equipment/:id', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor']), equipmentController.update);

router.get('/electrical-panels', panelController.list);
router.get('/electrical-panels/:id', panelController.getById);
router.post('/electrical-panels', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor']), panelController.create);
router.put('/electrical-panels/:id', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor']), panelController.update);

// Incidents & Corrective Actions
router.get('/incidents', incidentController.list);
router.get('/incidents/:id', incidentController.getById);
router.post('/incidents', incidentController.create);
router.put('/incidents/:id', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor']), incidentController.update);

router.get('/corrective-actions', actionController.list);
router.get('/corrective-actions/:id', actionController.getById);
router.post('/corrective-actions', requireRole(['super_admin', 'admin', 'restaurant_operator', 'restaurant_manager', 'electrical_assessor']), actionController.create);
router.put('/corrective-actions/:id', actionController.update);

// Annual Reviews
router.get('/annual-reviews', reviewController.list);
router.get('/annual-reviews/:id', reviewController.getById);
router.post('/annual-reviews', requireRole(['super_admin', 'admin', 'restaurant_operator']), reviewController.create);
router.put('/annual-reviews/:id', requireRole(['super_admin', 'admin', 'electrical_assessor']), reviewController.update);

// Certification Portal, Courses & Exams
router.get('/certification/programs', certificationController.listPrograms);
router.get('/certification/applications', certificationController.listApplications);
router.post('/certification/apply', certificationController.apply);
router.patch('/certification/applications/:id', requireRole(['super_admin', 'certification_manager']), certificationController.updateApplication);
router.get('/certification/certificates', certificationController.listCertificates);

router.get('/certification/courses', courseController.listCourses);
router.post('/certification/courses/:moduleId/complete', courseController.markModuleCompleted);

router.get('/certification/exams/:id', examController.getExam);
router.post('/certification/exams/:id/submit', examController.submitExam);

// Documents & Notifications
router.get('/documents', documentController.list);
router.post('/documents/upload', documentController.upload);

router.get('/notifications', notificationController.list);
router.patch('/notifications/:id/read', notificationController.markRead);

// Reports, Analytics & Audits
router.get('/reports/analytics', reportController.getAnalytics);
router.get('/audit-logs', requireRole(['super_admin', 'admin']), auditController.list);
router.get('/contact', requireRole(['super_admin', 'admin']), contactController.list);

// System Settings
router.get('/settings', settingController.list);
router.put('/settings/:key', requireRole(['super_admin']), settingController.update);

export default router;
