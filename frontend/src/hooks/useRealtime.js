import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * useRealtime Hook
 * Subscribes to backend SSE stream / Supabase Realtime channel
 * Emits window events and displays toast notifications for live compliance activities
 */
export function useRealtime(onEventCallback) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('rea_token') || user?.id;
    if (!token) return;

    const streamUrl = `/api/realtime/events?token=${encodeURIComponent(token)}`;

    try {
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log('[Realtime] SSE Connection established for', user?.role);
      };

      // Handler helper
      const handleEvent = (type, e) => {
        try {
          const parsed = JSON.parse(e.data);
          console.log(`[Realtime Event: ${type}]`, parsed);

          // Trigger custom window event so any listening component can re-fetch
          window.dispatchEvent(new CustomEvent('rea-realtime-sync', { detail: { type, ...parsed } }));

          if (onEventCallback) {
            onEventCallback(type, parsed);
          }

          // User-facing real-time toast notifications
          switch (type) {
            case 'RESTAURANT_CREATED':
              addToast(`🏢 New Restaurant Added: ${parsed.payload?.name || 'Commercial Facility'}`);
              break;
            case 'ASSESSMENT_SUBMITTED':
              addToast(`📋 Assessment Submitted: Score ${parsed.payload?.score}% by ${parsed.payload?.submitted_by || 'Inspector'}`);
              break;
            case 'ASSESSMENT_APPROVED':
              addToast(`✅ Assessment Approved by Corporate Compliance`);
              break;
            case 'INCIDENT_REPORTED':
              addToast(`⚠️ Electrical Incident Reported: ${parsed.payload?.title || 'Cookline Defect'} (${parsed.payload?.severity || 'urgent'})`, 'error');
              break;
            case 'ACTION_UPDATED':
              addToast(`🔧 Corrective Action Updated: ${parsed.payload?.action?.title || 'Remediation Step'}`);
              break;
            case 'REVIEW_APPROVED':
              addToast(`🛡️ Annual Electrical Review Approved`);
              break;
            case 'CERTIFICATE_ISSUED':
              addToast(`🎓 Digital CRESM Certificate Issued for ${parsed.payload?.candidate_name || 'Kitchen Manager'}`);
              break;
            case 'USER_INVITED':
              addToast(`✉️ Invitation sent to ${parsed.payload?.email}`);
              break;
            default:
              break;
          }
        } catch (err) {
          console.error('[Realtime] Parse error:', err);
        }
      };

      // Subscribe to all standard compliance event types
      const eventTypes = [
        'RESTAURANT_CREATED',
        'ASSESSMENT_SUBMITTED',
        'ASSESSMENT_APPROVED',
        'INCIDENT_REPORTED',
        'ACTION_UPDATED',
        'REVIEW_APPROVED',
        'CERTIFICATE_ISSUED',
        'USER_INVITED'
      ];

      eventTypes.forEach((evt) => {
        es.addEventListener(evt, (e) => handleEvent(evt, e));
      });

      es.onerror = () => {
        // EventSource will automatically attempt reconnection
        console.warn('[Realtime] SSE connection interrupted; waiting for reconnect...');
      };
    } catch (err) {
      console.error('[Realtime] Failed to initialize SSE:', err);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        console.log('[Realtime] SSE Connection closed cleanly on unmount');
      }
    };
  }, [user?.id, user?.role, addToast]);
}
