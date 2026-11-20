import test from 'node:test';
import assert from 'node:assert';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { app } from '../src/app.js';
import { signToken } from '../src/utils/jwt.js';

// In-Memory HTTP Dispatcher (Runs 100% within sandbox without loopback socket restrictions)
function invokeApp(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payloadStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const req = Readable.from(payloadStr ? [Buffer.from(payloadStr)] : []);
    req.method = method.toUpperCase();
    req.url = path;
    req.headers = {
      'content-type': 'application/json',
      ...(payloadStr ? { 'content-length': Buffer.byteLength(payloadStr).toString() } : {}),
      ...headers
    };

    const res = new EventEmitter();
    res.statusCode = 200;
    res._headers = {};
    let responseBody = '';

    res.setHeader = (key, val) => {
      res._headers[key.toLowerCase()] = val;
      if (key.toLowerCase() === 'content-type' && val === 'text/event-stream') {
        setTimeout(() => {
          resolve({ status: res.statusCode, headers: res._headers, _headers: res._headers, data: { sse: true } });
        }, 10);
      }
    };

    res.getHeader = (key) => res._headers[key.toLowerCase()];

    res.removeHeader = (key) => {
      delete res._headers[key.toLowerCase()];
    };

    res.writeHead = (code, headers = {}) => {
      res.statusCode = code;
      for (const [k, v] of Object.entries(headers)) {
        res.setHeader(k, v);
      }
      if (res._headers['content-type'] === 'text/event-stream') {
        setTimeout(() => {
          resolve({ status: res.statusCode, headers: res._headers, data: { sse: true } });
        }, 10);
      }
      return res;
    };

    res.flushHeaders = () => {};

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    res.write = (chunk) => {
      if (chunk) responseBody += chunk;
      return true;
    };

    res.json = (data) => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(data));
    };

    res.end = (chunk) => {
      if (chunk) responseBody += chunk;
      let parsed = responseBody;
      try {
        parsed = JSON.parse(responseBody);
      } catch {}
      resolve({ status: res.statusCode, headers: res._headers, data: parsed });
    };

    // Execute application handler
    Promise.resolve(app(req, res)).catch(reject);
  });
}

test('1. Health check returns status healthy', async () => {
  const res = await invokeApp('GET', '/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.status, 'healthy');
});

test('2. Public Certificate Verification resolves valid credential', async () => {
  const res = await invokeApp('GET', '/api/certification/verify/REA-VRF-88492-X7');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.strictEqual(res.data.data.verified, true);
  assert.strictEqual(res.data.data.certificate_number, 'CRESM-2026-88492');
  assert.strictEqual(res.data.data.recipient_name, 'Elena Rostova');
});

test('3. Authentication: Login with valid credentials returns token & user profile', async () => {
  const res = await invokeApp('POST', '/api/auth/login', {
    email: 'superadmin@rea-compliance.com',
    password: 'password123'
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.strictEqual(res.data.data.user.role, 'super_admin');
  assert.ok(res.data.data.token);
});

test('4. Security: Accessing protected endpoints without token returns 401 Unauthorized', async () => {
  const res = await invokeApp('GET', '/api/organizations');
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.data.success, false);
});

test('5. Multi-Tenant: Super Admin can list all organizations', async () => {
  const token = signToken({ id: 'a0000000-0000-0000-0000-000000000001', role: 'super_admin' });
  const res = await invokeApp('GET', '/api/organizations', null, {
    authorization: `Bearer ${token}`
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
  assert.ok(res.data.data.length >= 2);
});

test('6. Assessments: Fetching assessment checklist details', async () => {
  const token = signToken({ id: 'a0000000-0000-0000-0000-000000000001', role: 'super_admin' });
  const res = await invokeApp('GET', '/api/assessments/99999999-9999-9999-9999-999999999901', null, {
    authorization: `Bearer ${token}`
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.strictEqual(res.data.data.status, 'approved');
  assert.strictEqual(res.data.data.score, 94.5);
});

test('7. Examination System: Fetching sanitized exam questions (no leaked answers)', async () => {
  const token = signToken({ id: 'a0000000-0000-0000-0000-000000000004', role: 'restaurant_manager' });
  const res = await invokeApp('GET', '/api/certification/exams/eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, {
    authorization: `Bearer ${token}`
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data.questions));
  assert.strictEqual(res.data.data.questions[0].correct_answers, undefined);
});

test('8. Examination System: Submitting exam answers and automatic grading evaluation', async () => {
  const token = signToken({ id: 'a0000000-0000-0000-0000-000000000004', role: 'restaurant_manager' });
  const res = await invokeApp('POST', '/api/certification/exams/eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee/submit', {
    answers: [
      { question_id: 'q-01', selected_options: ['C'] },
      { question_id: 'q-02', selected_options: ['B'] },
      { question_id: 'q-03', selected_options: ['B'] },
      { question_id: 'q-04', selected_options: ['C'] },
      { question_id: 'q-05', selected_options: ['C'] }
    ]
  }, {
    authorization: `Bearer ${token}`
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.strictEqual(res.data.data.passed, true);
  assert.strictEqual(res.data.data.percentage, 100);
});

test('9. Public Contact: Submitting a valid contact message', async () => {
  const res = await invokeApp('POST', '/api/contact', {
    name: 'John Doe',
    email: 'john@restaurantgroup.com',
    organization: 'Bistro Group',
    subject: 'Inquiry regarding CRESM Certification',
    message: 'We have 8 managers who need electrical readiness certification.'
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.data.success, true);
});

test('10. Real-time System: Authenticated SSE stream connection and handshake', async () => {
  const token = signToken({ id: 'a0000000-0000-0000-0000-000000000001', role: 'super_admin' });
  const res = await invokeApp('GET', `/api/realtime/events?token=${token}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res._headers['content-type'], 'text/event-stream');
});
