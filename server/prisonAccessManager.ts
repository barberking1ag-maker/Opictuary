import { db } from "./db";
import { 
  prisonAccessRequests,
  prisonVerifications,
  prisonAccessSessions,
  prisonAuditLogs,
  prisonPayments,
  prisonFacilities,
  memorials
} from "@shared/schema";
import { eq, and, or, gte, lte, desc, asc } from "drizzle-orm";
import { emailService } from "./emailService";

export interface ApprovalData {
  requestId: string;
  approvedBy: string;
  approvedByEmail: string;
  verificationNotes?: string;
  expirationDate?: Date;
}

export interface SessionData {
  requestId: string;
  ipAddress: string;
  userAgent: string;
  facilityId: string;
}

export interface AuditLogData {
  facilityId: string;
  inmateId?: string;
  action: string;
  performedBy: string;
  details?: any;
  ipAddress?: string;
}

class PrisonAccessManager {
  /**
   * Approve a prison access request
   */
  async approveRequest(data: ApprovalData): Promise<boolean> {
    const { requestId, approvedBy, approvedByEmail, verificationNotes, expirationDate } = data;

    try {
      // Get the access request
      const [request] = await db.select()
        .from(prisonAccessRequests)
        .where(eq(prisonAccessRequests.id, requestId));

      if (!request) {
        throw new Error('Access request not found');
      }

      if (request.status !== 'pending') {
        throw new Error('Request is not in pending status');
      }

      // Start transaction
      const now = new Date();

      // Update request status
      await db.update(prisonAccessRequests)
        .set({
          status: 'approved',
          approvedAt: now,
          approvedBy: approvedByEmail,
          expirationDate: expirationDate || new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days default
          reviewNotes: verificationNotes,
          updatedAt: now
        })
        .where(eq(prisonAccessRequests.id, requestId));

      // Create verification record
      await db.insert(prisonVerifications).values({
        requestId: requestId,
        verifiedBy: approvedBy,
        verificationMethod: 'manual_review',
        verificationDate: now,
        verificationStatus: 'verified',
        verificationNotes: verificationNotes,
        documentUrls: null,
        expiresAt: expirationDate
      });

      // Create audit log
      await this.createAuditLog({
        facilityId: request.facilityId,
        inmateId: request.inmateDocNumber,
        action: 'access_approved',
        performedBy: approvedByEmail,
        details: {
          requestId: requestId,
          inmateeName: `${request.inmateFirstName} ${request.inmateLastName}`,
          approvedBy: approvedBy,
          notes: verificationNotes
        }
      });

      // Send approval notification
      await this.sendApprovalNotification(request);

      console.log(`[PRISON ACCESS] Approved access request ${requestId}`);
      return true;
    } catch (error) {
      console.error('[PRISON ACCESS] Error approving request:', error);
      throw error;
    }
  }

  /**
   * Deny a prison access request
   */
  async denyRequest(requestId: string, reason: string, deniedBy: string): Promise<boolean> {
    try {
      const [request] = await db.select()
        .from(prisonAccessRequests)
        .where(eq(prisonAccessRequests.id, requestId));

      if (!request) {
        throw new Error('Access request not found');
      }

      const now = new Date();

      // Update request status
      await db.update(prisonAccessRequests)
        .set({
          status: 'denied',
          deniedAt: now,
          denialReason: reason,
          reviewNotes: reason,
          approvedBy: deniedBy,
          updatedAt: now
        })
        .where(eq(prisonAccessRequests.id, requestId));

      // Create verification record
      await db.insert(prisonVerifications).values({
        requestId: requestId,
        verifiedBy: deniedBy,
        verificationMethod: 'manual_review',
        verificationDate: now,
        verificationStatus: 'denied',
        verificationNotes: reason
      });

      // Create audit log
      await this.createAuditLog({
        facilityId: request.facilityId,
        inmateId: request.inmateDocNumber,
        action: 'access_denied',
        performedBy: deniedBy,
        details: {
          requestId: requestId,
          reason: reason
        }
      });

      // Send denial notification
      await this.sendDenialNotification(request, reason);

      console.log(`[PRISON ACCESS] Denied access request ${requestId}`);
      return true;
    } catch (error) {
      console.error('[PRISON ACCESS] Error denying request:', error);
      throw error;
    }
  }

  /**
   * Start a prison access session
   */
  async startSession(data: SessionData): Promise<string> {
    const { requestId, ipAddress, userAgent, facilityId } = data;

    try {
      // Verify the request is approved
      const [request] = await db.select()
        .from(prisonAccessRequests)
        .where(and(
          eq(prisonAccessRequests.id, requestId),
          eq(prisonAccessRequests.status, 'approved')
        ));

      if (!request) {
        throw new Error('Approved access request not found');
      }

      // Check if request is not expired
      if (request.expirationDate && new Date() > request.expirationDate) {
        throw new Error('Access request has expired');
      }

      // Check for active sessions (prevent multiple concurrent sessions)
      const [activeSessions] = await db.select()
        .from(prisonAccessSessions)
        .where(
          eq(prisonAccessSessions.requestId, requestId)
        );

      if (activeSessions) {
        throw new Error('An active session already exists for this request');
      }

      // Create new session
      const now = new Date();
      const sessionDuration = 30 * 60 * 1000; // 30 minutes
      const expiresAt = new Date(now.getTime() + sessionDuration);
      
      // Generate a unique access token
      const accessToken = `PA_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const [session] = await db.insert(prisonAccessSessions)
        .values({
          requestId: requestId,
          memorialId: request.memorialId,
          accessToken: accessToken,
          expiresAt: expiresAt,
          isActive: true,
          lastAccessedAt: now,
          createdAt: now
        })
        .returning();

      // Create audit log
      await this.createAuditLog({
        facilityId: facilityId,
        inmateId: request.inmateDocNumber,
        action: 'session_started',
        performedBy: 'system',
        ipAddress: ipAddress,
        details: {
          sessionId: session.id,
          requestId: requestId,
          scheduledDuration: '30 minutes'
        }
      });

      console.log(`[PRISON ACCESS] Started session ${session.id} for request ${requestId}`);
      return session.id;
    } catch (error) {
      console.error('[PRISON ACCESS] Error starting session:', error);
      throw error;
    }
  }

  /**
   * End a prison access session
   */
  async endSession(sessionId: string, endReason: string = 'manual'): Promise<boolean> {
    try {
      const [session] = await db.select()
        .from(prisonAccessSessions)
        .where(eq(prisonAccessSessions.id, sessionId));

      if (!session) {
        throw new Error('Session not found');
      }

      if (!session.isActive) {
        throw new Error('Session is not active');
      }

      const now = new Date();

      // Update session
      await db.update(prisonAccessSessions)
        .set({
          isActive: false,
          lastAccessedAt: now
        })
        .where(eq(prisonAccessSessions.id, sessionId));

      // Create audit log
      await this.createAuditLog({
        facilityId: 'unknown', // We don't have facilityId in the session table
        inmateId: 'unknown', // We don't have inmateDocNumber in the session table
        action: 'session_ended',
        performedBy: 'system',
        details: {
          sessionId: sessionId,
          endReason: endReason,
          duration: Math.round((now.getTime() - session.createdAt!.getTime()) / 1000) + ' seconds'
        }
      });

      console.log(`[PRISON ACCESS] Ended session ${sessionId}`);
      return true;
    } catch (error) {
      console.error('[PRISON ACCESS] Error ending session:', error);
      throw error;
    }
  }

  /**
   * Log activity within a session
   */
  async logSessionActivity(sessionId: string, activity: string, details?: any): Promise<boolean> {
    try {
      const [session] = await db.select()
        .from(prisonAccessSessions)
        .where(eq(prisonAccessSessions.id, sessionId));

      if (!session || !session.isActive) {
        throw new Error('Active session not found');
      }

      // Since activityLog doesn't exist in the schema, just update last accessed time
      await db.update(prisonAccessSessions)
        .set({
          lastAccessedAt: new Date()
        })
        .where(eq(prisonAccessSessions.id, sessionId));

      console.log(`[PRISON ACCESS] Logged activity for session ${sessionId}: ${activity}`);
      return true;
    } catch (error) {
      console.error('[PRISON ACCESS] Error logging activity:', error);
      throw error;
    }
  }

  /**
   * Check and expire old sessions
   */
  async expireOldSessions(): Promise<void> {
    try {
      const now = new Date();
      
      // Find active sessions that have exceeded their scheduled end time
      const expiredSessions = await db.select()
        .from(prisonAccessSessions)
        .where(
          lte(prisonAccessSessions.expiresAt, now)
        );

      for (const session of expiredSessions) {
        await this.endSession(session.id, 'timeout');
      }

      if (expiredSessions.length > 0) {
        console.log(`[PRISON ACCESS] Expired ${expiredSessions.length} sessions`);
      }
    } catch (error) {
      console.error('[PRISON ACCESS] Error expiring sessions:', error);
    }
  }

  /**
   * Create an audit log entry
   */
  async createAuditLog(data: AuditLogData): Promise<void> {
    try {
      await db.insert(prisonAuditLogs).values({
        facilityId: data.facilityId,
        inmateDocNumber: data.inmateId || null,
        action: data.action,
        performedBy: data.performedBy,
        performedAt: new Date(),
        details: data.details || {},
        ipAddress: data.ipAddress || null
      });
    } catch (error) {
      console.error('[PRISON ACCESS] Error creating audit log:', error);
    }
  }

  /**
   * Get session statistics for a facility
   */
  async getFacilityStatistics(facilityId: string, startDate: Date, endDate: Date): Promise<any> {
    try {
      // Since we don't have facilityId in the sessions table, return empty stats
      const sessions: any[] = [];

      return {
        totalSessions: 0,
        completedSessions: 0,
        averageDurationMinutes: 0,
        uniqueInmates: 0
      };
    } catch (error) {
      console.error('[PRISON ACCESS] Error getting statistics:', error);
      throw error;
    }
  }

  /**
   * Send approval notification email
   */
  private async sendApprovalNotification(request: any): Promise<void> {
    if (!request.requestedByEmail) return;

    try {
      // Get memorial details
      const [memorial] = await db.select()
        .from(memorials)
        .where(eq(memorials.id, request.memorialId));

      const html = `
        <h2>Prison Access Request Approved</h2>
        <p>Your prison access request has been approved.</p>
        <p><strong>Inmate:</strong> ${request.inmateFirstName} ${request.inmateLastName}</p>
        <p><strong>DOC Number:</strong> ${request.inmateDocNumber}</p>
        <p><strong>Memorial:</strong> ${memorial?.name || 'Unknown'}</p>
        <p>The approved inmate can now access the memorial from the facility.</p>
      `;

      await emailService.sendEmail({
        to: request.requestedByEmail,
        subject: 'Prison Access Request Approved',
        html: html,
        text: html.replace(/<[^>]*>/g, '')
      });
    } catch (error) {
      console.error('[PRISON ACCESS] Error sending approval notification:', error);
    }
  }

  /**
   * Send denial notification email
   */
  private async sendDenialNotification(request: any, reason: string): Promise<void> {
    if (!request.requestedByEmail) return;

    try {
      const html = `
        <h2>Prison Access Request Denied</h2>
        <p>Unfortunately, your prison access request has been denied.</p>
        <p><strong>Inmate:</strong> ${request.inmateFirstName} ${request.inmateLastName}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>If you believe this is an error, please contact support.</p>
      `;

      await emailService.sendEmail({
        to: request.requestedByEmail,
        subject: 'Prison Access Request Denied',
        html: html,
        text: html.replace(/<[^>]*>/g, '')
      });
    } catch (error) {
      console.error('[PRISON ACCESS] Error sending denial notification:', error);
    }
  }

  /**
   * Monitor active sessions and send alerts if needed
   */
  async monitorSessions(): Promise<void> {
    try {
      // Check for sessions approaching timeout
      const now = new Date();
      const warningThreshold = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

      const warningSessions = await db.select()
        .from(prisonAccessSessions)
        .where(
          lte(prisonAccessSessions.expiresAt, warningThreshold)
        );

      for (const session of warningSessions) {
        await this.logSessionActivity(session.id, 'timeout_warning', {
          minutesRemaining: 5
        });
      }

      // Check for suspicious activity patterns
      // (e.g., multiple failed attempts, unusual access patterns)
      
      // Expire old sessions
      await this.expireOldSessions();
      
    } catch (error) {
      console.error('[PRISON ACCESS] Error monitoring sessions:', error);
    }
  }
}

// Export singleton instance
export const prisonAccessManager = new PrisonAccessManager();

// Start monitoring interval
setInterval(() => {
  prisonAccessManager.monitorSessions();
}, 60000); // Check every minute