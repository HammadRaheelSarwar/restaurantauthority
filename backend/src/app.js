import http from 'http';
import url from 'url';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

let app;

// Attempt to load Express if installed
try {
  const expressModule = await import('express');
  const express = expressModule.default;
  const corsModule = await import('cors');
  const cors = corsModule.default;
  const helmetModule = await import('helmet');
  const helmet = helmetModule.default;

  app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // Mount API Router
  app.use('/api', apiRouter);

  // Central error handler
  app.use(errorHandler);
} catch (loadErr) {
  console.log('[REA Server] Express package not yet installed. Running built-in native HTTP dispatcher.');

  // Create lightweight native server matching the exact router contracts
  app = async (req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost:5000');
    req.query = Object.fromEntries(parsedUrl.searchParams);
    req.params = {};
    req.path = parsedUrl.pathname;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // Helper functions on res
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    // Body parsing
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      if (body) {
        try {
          req.body = JSON.parse(body);
        } catch {
          req.body = {};
        }
      } else {
        req.body = {};
      }

      console.log(`[HTTP Native] ${req.method} ${req.path}`);

      if (!req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, error: { message: 'Not found' } });
      }

      try {
        let routeMatched = false;
        let layerIndex = 0;

        const next = async (err) => {
          if (err) return errorHandler(err, req, res);
          if (layerIndex >= apiRouter.stack.length) {
            if (!routeMatched) {
              return res.status(404).json({ success: false, error: { message: `Route ${req.method} ${req.path} not found` } });
            }
            return;
          }

          const layer = apiRouter.stack[layerIndex++];

          // Case 1: General middleware layer (e.g. router.use(authenticate))
          if (!layer.route) {
            try {
              await layer.handle(req, res, next);
            } catch (e) {
              errorHandler(e, req, res);
            }
            return;
          }

          // Case 2: Route layer (e.g. router.get('/health', ...))
          const routePath = `/api${layer.route.path}`;
          const paramNames = [];
          const regexStr = '^' + routePath.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
          }) + '$';
          const match = req.path.match(new RegExp(regexStr));

          if (match && layer.route.methods[req.method.toLowerCase()]) {
            routeMatched = true;
            paramNames.forEach((name, i) => {
              req.params[name] = match[i + 1];
            });

            // Execute route handlers sequentially
            let handlerIdx = 0;
            const routeNext = async (routeErr) => {
              if (routeErr) return errorHandler(routeErr, req, res);
              if (handlerIdx < layer.route.stack.length) {
                const handlerObj = layer.route.stack[handlerIdx++];
                try {
                  await handlerObj.handle(req, res, routeNext);
                } catch (e) {
                  errorHandler(e, req, res);
                }
              }
            };
            await routeNext();
          } else {
            // Did not match this route, advance to next layer in stack
            await next();
          }
        };

        await next();
      } catch (err) {
        errorHandler(err, req, res);
      }
    });
  };
}

export { app };
export default app;
