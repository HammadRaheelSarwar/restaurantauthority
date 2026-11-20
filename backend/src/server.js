import http from 'http';
try {
  const dotenv = await import('dotenv');
  dotenv.default.config();
} catch {}
import { app } from './app.js';
import { reminderService } from './services/reminderService.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = typeof app.listen === 'function' ? app : http.createServer(app);

const runningServer = server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` RESTAURANT ELECTRICAL AUTHORITY (REA) - COMPLIANCE API `);
  console.log(` Server active on port: ${PORT}`);
  console.log(` Health check URL:      http://localhost:${PORT}/api/health`);
  console.log(` Verify Certificate:    http://localhost:${PORT}/api/certification/verify/:code`);
  console.log(` Environment:           ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);

  // Start background compliance reminder jobs
  reminderService.initScheduler();
});

export default runningServer;
