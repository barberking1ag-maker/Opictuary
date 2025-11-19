import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    href?: string;
  }>;
}

interface FutureMessageData {
  recipientName: string;
  recipientEmail: string;
  message: string;
  eventType: string;
  senderName: string;
  mediaUrl?: string;
  mediaType?: string;
}

interface VideoTimeCapsuleReleaseData {
  recipientEmail: string;
  memorialName: string;
  capsuleTitle: string;
  milestoneType: string;
  recipientName: string;
  memorialUrl: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPassword = process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD;
    const emailHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
    const emailPort = process.env.EMAIL_PORT || process.env.SMTP_PORT;

    if (emailUser && emailPassword) {
      try {
        this.transporter = nodemailer.createTransport({
          host: emailHost || 'smtp.gmail.com',
          port: parseInt(emailPort || '587'),
          secure: emailPort === '465', // true for 465, false for other ports
          auth: {
            user: emailUser,
            pass: emailPassword,
          },
        });

        this.isConfigured = true;
        console.log('[EMAIL SERVICE] Configured successfully');
      } catch (error) {
        console.error('[EMAIL SERVICE] Configuration error:', error);
        this.isConfigured = false;
      }
    } else {
      console.warn('[EMAIL SERVICE] Email credentials not configured. Emails will be logged only.');
      console.warn('[EMAIL SERVICE] To enable email delivery, set: EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST (optional), EMAIL_PORT (optional)');
      this.isConfigured = false;
    }
  }

  /**
   * Generate HTML template for future message email
   */
  private generateFutureMessageHTML(data: FutureMessageData): string {
    const { recipientName, message, eventType, senderName, mediaUrl, mediaType } = data;

    const eventTypeLabels: Record<string, string> = {
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      graduation: 'Graduation',
      wedding: 'Wedding Day',
      baby_birth: 'Baby Birth',
      holiday: 'Holiday',
      mother_day: 'Mother\'s Day',
      father_day: 'Father\'s Day',
      christmas: 'Christmas',
      new_year: 'New Year',
      custom: 'Special Message',
    };

    const eventLabel = eventTypeLabels[eventType] || 'Message';

    let mediaSection = '';
    if (mediaUrl) {
      if (mediaType === 'video' || mediaUrl.includes('youtube') || mediaUrl.includes('vimeo')) {
        mediaSection = `
          <div style="margin: 20px 0; text-align: center;">
            <p style="color: #6B7280; margin-bottom: 10px;">A special video message for you:</p>
            <a href="${mediaUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 6px;">
              Watch Video Message
            </a>
          </div>
        `;
      } else {
        mediaSection = `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${mediaUrl}" alt="Attached memory" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
          </div>
        `;
      }
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventLabel} from ${senderName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
        <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              ${eventLabel}
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              A message from ${senderName}
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #1F2937; font-size: 18px; line-height: 1.6; margin: 0 0 10px 0;">
              Dear ${recipientName},
            </p>

            <div style="background-color: #F9FAFB; border-left: 4px solid #7C3AED; padding: 20px; margin: 20px 0; border-radius: 6px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0; white-space: pre-wrap;">
                ${message}
              </p>
            </div>

            ${mediaSection}

            <p style="color: #6B7280; font-size: 14px; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              This message was scheduled in advance as part of their memorial on Opictuary.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 13px; margin: 0 0 10px 0;">
              Sent with love through Opictuary - Digital Memorial Platform
            </p>
            <a href="https://opictuary.com" style="color: #7C3AED; text-decoration: none; font-size: 13px;">
              Visit Opictuary.com
            </a>
          </div>
        </div>

        <!-- Footer outside card -->
        <div style="text-align: center; padding: 20px;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Opictuary. Preserving memories, connecting hearts.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text version of the email
   */
  private generateFutureMessageText(data: FutureMessageData): string {
    const { recipientName, message, eventType, senderName, mediaUrl } = data;

    const eventTypeLabels: Record<string, string> = {
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      graduation: 'Graduation',
      wedding: 'Wedding Day',
      baby_birth: 'Baby Birth',
      holiday: 'Holiday',
      mother_day: 'Mother\'s Day',
      father_day: 'Father\'s Day',
      christmas: 'Christmas',
      new_year: 'New Year',
      custom: 'Special Message',
    };

    const eventLabel = eventTypeLabels[eventType] || 'Message';

    let text = `${eventLabel} from ${senderName}\n\n`;
    text += `Dear ${recipientName},\n\n`;
    text += `${message}\n\n`;

    if (mediaUrl) {
      text += `View attached media: ${mediaUrl}\n\n`;
    }

    text += `---\n`;
    text += `This message was scheduled in advance as part of their memorial on Opictuary.\n`;
    text += `Visit Opictuary.com to learn more.\n`;

    return text;
  }

  /**
   * Send a future message email
   */
  async sendFutureMessage(data: FutureMessageData): Promise<boolean> {
    const { recipientEmail, recipientName, eventType, senderName } = data;

    const subject = `A message from ${senderName}`;
    
    const html = this.generateFutureMessageHTML(data);
    const text = this.generateFutureMessageText(data);

    const emailOptions: EmailOptions = {
      to: recipientEmail,
      subject,
      html,
      text,
    };

    return this.sendEmail(emailOptions);
  }

  /**
   * Send video time capsule release notification
   */
  async sendVideoTimeCapsuleReleaseNotification(data: VideoTimeCapsuleReleaseData): Promise<boolean> {
    const { recipientEmail, memorialName, capsuleTitle, milestoneType, recipientName, memorialUrl } = data;

    const subject = `Video Time Capsule Released: ${capsuleTitle}`;
    
    const milestoneLabels: Record<string, string> = {
      birthday: 'Birthday',
      graduation: 'Graduation',
      wedding: 'Wedding',
      anniversary: 'Anniversary',
      baby_birth: 'Baby Birth',
      holiday: 'Holiday',
      custom: 'Special Milestone',
    };

    const milestoneLabel = milestoneLabels[milestoneType] || 'Special Milestone';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video Time Capsule Released</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
        <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              🎥 Video Time Capsule Released
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              ${memorialName}
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              A video time capsule has been released for ${memorialName}.
            </p>
            
            <div style="background-color: #F9FAFB; border-left: 4px solid #7C3AED; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h2 style="color: #1F2937; margin: 0 0 10px 0; font-size: 18px;">
                ${capsuleTitle}
              </h2>
              <p style="color: #6B7280; margin: 5px 0; font-size: 14px;">
                <strong>Milestone:</strong> ${milestoneLabel}
              </p>
              <p style="color: #6B7280; margin: 5px 0; font-size: 14px;">
                <strong>For:</strong> ${recipientName}
              </p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              This pre-recorded video message is now available to view on the memorial page.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${memorialUrl}" style="display: inline-block; padding: 14px 32px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Video Capsule
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">
              This is an automated notification from Opictuary
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              Preserving memories with dignity in the digital age
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Video Time Capsule Released

A video time capsule has been released for ${memorialName}.

Title: ${capsuleTitle}
Milestone: ${milestoneLabel}
For: ${recipientName}

This pre-recorded video message is now available to view on the memorial page.

View it here: ${memorialUrl}

---
This is an automated notification from Opictuary
Preserving memories with dignity in the digital age
    `;

    const emailOptions: EmailOptions = {
      to: recipientEmail,
      subject,
      html,
      text,
    };

    return this.sendEmail(emailOptions);
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, html, text, attachments } = options;

    // If email is not configured, log and return failure
    if (!this.isConfigured || !this.transporter) {
      console.log('[EMAIL SERVICE] Email not configured - cannot send:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text: ${text.substring(0, 200)}...`);
      return false; // Return failure when not configured
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@opictuary.com',
        to,
        subject,
        html,
        text,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EMAIL SERVICE] Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE] Error sending email:', error);
      return false;
    }
  }

  /**
   * Verify email service configuration
   */
  async verifyConfiguration(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('[EMAIL SERVICE] Email service verified and ready');
      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE] Verification failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
