let RouterClass;

try {
  const express = (await import('express')).default;
  RouterClass = express.Router;
} catch {
  // Built-in resilient Router when express is not yet installed
  RouterClass = function () {
    const stack = [];

    const router = function (req, res, next) {
      next();
    };

    router.stack = stack;

    const addRoute = (method, path, handlers) => {
      stack.push({
        route: {
          path,
          methods: { [method.toLowerCase()]: true },
          stack: handlers.map(h => ({ handle: h }))
        }
      });
    };

    router.get = (path, ...handlers) => addRoute('GET', path, handlers);
    router.post = (path, ...handlers) => addRoute('POST', path, handlers);
    router.put = (path, ...handlers) => addRoute('PUT', path, handlers);
    router.patch = (path, ...handlers) => addRoute('PATCH', path, handlers);
    router.delete = (path, ...handlers) => addRoute('DELETE', path, handlers);
    router.use = (...handlers) => {
      handlers.forEach(h => {
        if (typeof h === 'function') {
          stack.push({ handle: h });
        }
      });
    };

    return router;
  };
}

export const Router = RouterClass;
export default Router;
