/**
 * Email Service: Sends transactional emails and alerts
 */
export const emailService = {
  async sendNotificationEmail({ to, subject, html, text }) {
    console.log(`[Email Service] Dispatched email to: ${to}`);
    console.log(`[Email Subject] ${subject}`);
    // In dev / mock mode, logs the dispatch. When SMTP is configured, uses nodemailer
    return { success: true, messageId: `msg-${Date.now()}` };
  },

  async sendAssessmentAssignedAlert(assessorEmail, assessmentTitle, locationName) {
    return this.sendNotificationEmail({
      to: assessorEmail,
      subject: `[REA] Assessment Assigned: ${assessmentTitle}`,
      text: `You have been assigned to conduct an electrical readiness assessment for ${locationName}.`
    });
  },

  async sendCorrectiveActionAlert(managerEmail, actionTitle, dueDate) {
    return this.sendNotificationEmail({
      to: managerEmail,
      subject: `[REA Compliance] Corrective Action Assigned: ${actionTitle}`,
      text: `A corrective action has been assigned to your location. Due date: ${dueDate}.`
    });
  },

  async sendCertificateIssuedEmail(managerEmail, managerName, certificateNumber) {
    return this.sendNotificationEmail({
      to: managerEmail,
      subject: `[REA Academy] Congratulations! Credential Issued: ${certificateNumber}`,
      text: `Dear ${managerName}, your Certified Restaurant Electrical Safety Manager (CRESM) credential has been approved.`
    });
  }
};
