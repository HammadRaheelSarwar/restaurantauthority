import { supabase } from '../config/supabase.js';
import { emailService } from './emailService.js';

/**
 * Reminder Service: Executes scheduled recurring compliance checks
 */
export const reminderService = {
  /**
   * Scan for upcoming and overdue annual electrical reviews
   */
  async checkAnnualReviews() {
    try {
      console.log('[Reminder Service] Scanning for annual readiness review deadlines...');
      const { data: reviews } = await supabase.from('annual_reviews').select('*');
      if (!reviews) return;

      const today = new Date().toISOString().split('T')[0];

      for (const review of reviews) {
        if (review.due_date && review.due_date < today && review.status !== 'approved') {
          // Mark as overdue if past due date
          await supabase.from('annual_reviews').eq('id', review.id).update({ status: 'overdue' });
          console.log(`[Reminder Service] Flagged Review ${review.id} as OVERDUE`);
        }
      }
    } catch (err) {
      console.error('[Reminder Service] Error running annual review checks:', err.message);
    }
  },

  /**
   * Scan for overdue corrective actions
   */
  async checkOverdueActions() {
    try {
      console.log('[Reminder Service] Scanning for overdue corrective actions...');
      const { data: actions } = await supabase.from('corrective_actions').select('*');
      if (!actions) return;

      const today = new Date().toISOString().split('T')[0];

      for (const action of actions) {
        if (action.due_date && action.due_date < today && !['approved', 'closed'].includes(action.status)) {
          // Trigger alert for overdue action
          await supabase.from('notifications').insert({
            user_id: action.assigned_to,
            organization_id: action.organization_id,
            title: 'OVERDUE Corrective Action',
            message: `Action '${action.title}' passed its due date (${action.due_date}). Immediate resolution required.`,
            type: 'corrective_action',
            link: '/corrective-actions'
          });
        }
      }
    } catch (err) {
      console.error('[Reminder Service] Error checking corrective actions:', err.message);
    }
  },

  /**
   * Start scheduled background intervals (runs every 60 minutes)
   */
  initScheduler() {
    console.log('[Reminder Service] Initializing automated compliance background scheduler');
    // Run initial scan
    this.checkAnnualReviews();
    this.checkOverdueActions();

    // Setup recurring hourly check
    setInterval(() => {
      this.checkAnnualReviews();
      this.checkOverdueActions();
    }, 1000 * 60 * 60);
  }
};
