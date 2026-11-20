import EventEmitter from 'events';

class RealtimeService extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map(); // clientId -> { res, user }
    this.initHeartbeat();
  }

  initHeartbeat() {
    // Send keepalive comment every 30 seconds to prevent timeout
    const timer = setInterval(() => {
      for (const [clientId, client] of this.clients.entries()) {
        try {
          client.res.write(': keepalive\n\n');
        } catch {
          this.removeClient(clientId);
        }
      }
    }, 30000);
    if (timer.unref) timer.unref();
  }

  addClient(clientId, res, user) {
    this.clients.set(clientId, { res, user });
    console.log(`[Realtime] Client connected: ${user?.full_name || clientId} (${user?.role || 'anonymous'}) [Total: ${this.clients.size}]`);

    // Send connection established event
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);
  }

  removeClient(clientId) {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
      console.log(`[Realtime] Client disconnected: ${clientId} [Remaining: ${this.clients.size}]`);
    }
  }

  /**
   * Broadcast an event to all authorized connected clients
   * @param {string} eventType - e.g. RESTAURANT_CREATED, ASSESSMENT_SUBMITTED, INCIDENT_REPORTED
   * @param {object} payload - data payload
   * @param {string} [targetOrgId] - if specified, only broadcast to users in this organization (or super_admin)
   */
  broadcast(eventType, payload = {}, targetOrgId = null) {
    const eventData = JSON.stringify({
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    });

    let sentCount = 0;
    for (const [clientId, client] of this.clients.entries()) {
      try {
        const user = client.user;
        // Check organization isolation unless user is super_admin
        if (targetOrgId && user?.role !== 'super_admin' && user?.organization_id && user.organization_id !== targetOrgId) {
          continue;
        }

        client.res.write(`event: ${eventType}\ndata: ${eventData}\n\n`);
        sentCount++;
      } catch (err) {
        console.error(`[Realtime] Failed to send to ${clientId}:`, err.message);
        this.removeClient(clientId);
      }
    }

    console.log(`[Realtime] Broadcasted ${eventType} to ${sentCount} active client(s)`);
    this.emit('broadcast', { eventType, payload, targetOrgId });
  }
}

export const realtimeService = new RealtimeService();
