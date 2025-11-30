import { db } from "./db";
import { 
  alumniMemorials,
  celebrityMemorials,
  hoodMemorials,
  neighborhoods,
  essentialWorkersMemorials
} from "@shared/schema";
import { eq, and, or, like, sql } from "drizzle-orm";
import { emailService } from "./emailService";

export interface UniversityVerificationData {
  memorialId: string;
  universityEmail: string;
  studentId?: string;
  graduationYear: number;
  degreeName: string;
  verificationDocuments?: string[];
}

export interface CelebrityEstateVerificationData {
  memorialId: string;
  estateRepresentativeName: string;
  estateRepresentativeEmail: string;
  estateDocuments: string[];
  relationshipToDeceased: string;
  legalDocumentationType: 'power_of_attorney' | 'estate_executor' | 'family_member' | 'management_company';
}

export interface HoodVerificationData {
  memorialId: string;
  verifiedBy: string;
  communityReferences: string[];
  localNewsArticles?: string[];
  socialMediaProfiles?: string[];
}

export interface EssentialWorkerVerificationData {
  memorialId: string;
  employerName: string;
  employerContact?: string;
  employeeId?: string;
  departmentOrUnit: string;
  serviceYears: number;
  verificationDocuments?: string[];
}

class VerificationService {
  /**
   * Verify alumni memorial with university
   */
  async verifyAlumniMemorial(data: UniversityVerificationData): Promise<boolean> {
    const { memorialId, universityEmail, studentId, graduationYear, degreeName, verificationDocuments } = data;

    try {
      const memorial = await db.query.alumniMemorials.findFirst({
        where: eq(alumniMemorials.id, memorialId)
      });

      if (!memorial) {
        throw new Error('Alumni memorial not found');
      }

      const now = new Date();

      // Check if email domain matches university domain
      const emailDomain = universityEmail.split('@')[1];
      const isUniversityEmail = emailDomain.includes('.edu') || this.isKnownUniversityDomain(emailDomain);

      if (!isUniversityEmail) {
        // Mark as pending verification
        await db.update(alumniMemorials)
          .set({
            verificationStatus: 'pending',
            verificationNotes: 'Non-university email provided, manual verification required',
            verificationDocuments: verificationDocuments,
            updatedAt: now
          })
          .where(eq(alumniMemorials.id, memorialId));

        await this.sendManualVerificationRequest('alumni', memorial);
        return false;
      }

      // Auto-verify if university email is provided
      await db.update(alumniMemorials)
        .set({
          verificationStatus: 'verified',
          verifiedAt: now,
          verifiedBy: 'system',
          verificationMethod: 'university_email',
          verificationDocuments: verificationDocuments,
          updatedAt: now
        })
        .where(eq(alumniMemorials.id, memorialId));

      // Send verification confirmation
      await this.sendVerificationConfirmation('alumni', memorial, universityEmail);

      console.log(`[VERIFICATION] Alumni memorial ${memorialId} verified via university email`);
      return true;
    } catch (error) {
      console.error('[VERIFICATION] Error verifying alumni memorial:', error);
      throw error;
    }
  }

  /**
   * Verify celebrity estate authorization
   */
  async verifyCelebrityEstate(data: CelebrityEstateVerificationData): Promise<boolean> {
    const { 
      memorialId, 
      estateRepresentativeName, 
      estateRepresentativeEmail,
      estateDocuments,
      relationshipToDeceased,
      legalDocumentationType
    } = data;

    try {
      const memorial = await db.query.celebrityMemorials.findFirst({
        where: eq(celebrityMemorials.id, memorialId)
      });

      if (!memorial) {
        throw new Error('Celebrity memorial not found');
      }

      const now = new Date();

      // Store estate verification request
      await db.update(celebrityMemorials)
        .set({
          estateVerified: false,
          estateRepresentativeName: estateRepresentativeName,
          estateRepresentativeEmail: estateRepresentativeEmail,
          estateDocuments: estateDocuments,
          verificationStatus: 'pending',
          verificationSubmittedAt: now,
          verificationNotes: `${legalDocumentationType}: ${relationshipToDeceased}`,
          updatedAt: now
        })
        .where(eq(celebrityMemorials.id, memorialId));

      // Send to manual review queue
      await this.sendEstateVerificationForReview({
        memorial,
        representativeName: estateRepresentativeName,
        representativeEmail: estateRepresentativeEmail,
        documents: estateDocuments,
        documentationType: legalDocumentationType
      });

      console.log(`[VERIFICATION] Celebrity estate verification submitted for ${memorialId}`);
      return true;
    } catch (error) {
      console.error('[VERIFICATION] Error verifying celebrity estate:', error);
      throw error;
    }
  }

  /**
   * Approve celebrity estate verification (admin function)
   */
  async approveCelebrityEstateVerification(memorialId: string, approvedBy: string, notes?: string): Promise<boolean> {
    try {
      const now = new Date();

      await db.update(celebrityMemorials)
        .set({
          estateVerified: true,
          estateApprovedAt: now,
          estateApprovedBy: approvedBy,
          verificationStatus: 'verified',
          verificationNotes: notes,
          canReceiveDonations: true,
          canSellProducts: true,
          updatedAt: now
        })
        .where(eq(celebrityMemorials.id, memorialId));

      // Send approval notification
      const memorial = await db.query.celebrityMemorials.findFirst({
        where: eq(celebrityMemorials.id, memorialId)
      });

      if (memorial && memorial.estateRepresentativeEmail) {
        await this.sendEstateApprovalNotification(memorial);
      }

      console.log(`[VERIFICATION] Celebrity estate approved for ${memorialId}`);
      return true;
    } catch (error) {
      console.error('[VERIFICATION] Error approving celebrity estate:', error);
      throw error;
    }
  }

  /**
   * Verify hood memorial with community references
   */
  async verifyHoodMemorial(data: HoodVerificationData): Promise<boolean> {
    const { memorialId, verifiedBy, communityReferences, localNewsArticles, socialMediaProfiles } = data;

    try {
      const memorial = await db.query.hoodMemorials.findFirst({
        where: eq(hoodMemorials.id, memorialId)
      });

      if (!memorial) {
        throw new Error('Hood memorial not found');
      }

      const now = new Date();

      // Check community references count
      const hasEnoughReferences = communityReferences.length >= 3;
      const hasNewsArticles = localNewsArticles && localNewsArticles.length > 0;

      const verificationStatus = hasEnoughReferences || hasNewsArticles ? 'verified' : 'pending';

      await db.update(hoodMemorials)
        .set({
          verificationStatus: verificationStatus,
          verifiedAt: verificationStatus === 'verified' ? now : null,
          verifiedBy: verifiedBy,
          communityReferences: communityReferences,
          newsArticles: localNewsArticles,
          socialProfiles: socialMediaProfiles,
          updatedAt: now
        })
        .where(eq(hoodMemorials.id, memorialId));

      if (verificationStatus === 'pending') {
        await this.sendManualVerificationRequest('hood', memorial);
      }

      console.log(`[VERIFICATION] Hood memorial ${memorialId} verification status: ${verificationStatus}`);
      return verificationStatus === 'verified';
    } catch (error) {
      console.error('[VERIFICATION] Error verifying hood memorial:', error);
      throw error;
    }
  }

  /**
   * Verify essential worker memorial
   */
  async verifyEssentialWorkerMemorial(data: EssentialWorkerVerificationData): Promise<boolean> {
    const { 
      memorialId, 
      employerName, 
      employerContact, 
      employeeId,
      departmentOrUnit, 
      serviceYears,
      verificationDocuments
    } = data;

    try {
      const memorial = await db.query.essentialWorkersMemorials.findFirst({
        where: eq(essentialWorkersMemorials.id, memorialId)
      });

      if (!memorial) {
        throw new Error('Essential worker memorial not found');
      }

      const now = new Date();

      // Check if employer is a known/verified organization
      const isKnownEmployer = this.isKnownEssentialEmployer(employerName);

      const verificationStatus = isKnownEmployer && verificationDocuments && verificationDocuments.length > 0
        ? 'verified' 
        : 'pending';

      await db.update(essentialWorkersMemorials)
        .set({
          verificationStatus: verificationStatus,
          verifiedAt: verificationStatus === 'verified' ? now : null,
          verifiedBy: verificationStatus === 'verified' ? 'system' : null,
          employerVerificationContact: employerContact,
          employeeId: employeeId,
          verificationDocuments: verificationDocuments,
          updatedAt: now
        })
        .where(eq(essentialWorkersMemorials.id, memorialId));

      if (verificationStatus === 'pending') {
        await this.sendEmployerVerificationRequest(memorial, employerName, employerContact);
      }

      console.log(`[VERIFICATION] Essential worker memorial ${memorialId} verification status: ${verificationStatus}`);
      return verificationStatus === 'verified';
    } catch (error) {
      console.error('[VERIFICATION] Error verifying essential worker memorial:', error);
      throw error;
    }
  }

  /**
   * Add community moderation for hood memorials
   */
  async moderateHoodMemorial(memorialId: string, action: 'approve' | 'flag' | 'remove', reason?: string): Promise<boolean> {
    try {
      const now = new Date();

      const updateData: any = {
        moderationStatus: action === 'approve' ? 'approved' : action === 'flag' ? 'flagged' : 'removed',
        moderatedAt: now,
        moderationReason: reason,
        updatedAt: now
      };

      if (action === 'remove') {
        updateData.isActive = false;
      }

      await db.update(hoodMemorials)
        .set(updateData)
        .where(eq(hoodMemorials.id, memorialId));

      console.log(`[VERIFICATION] Hood memorial ${memorialId} moderated: ${action}`);
      return true;
    } catch (error) {
      console.error('[VERIFICATION] Error moderating hood memorial:', error);
      throw error;
    }
  }

  /**
   * Get nearby hood memorials (geographic clustering)
   */
  async getNearbyHoodMemorials(latitude: number, longitude: number, radiusMiles: number = 10): Promise<any[]> {
    try {
      // Using Haversine formula for distance calculation
      // In production, use PostGIS or similar for better performance
      const radiusKm = radiusMiles * 1.60934;
      
      const memorials = await db.query.hoodMemorials.findMany({
        where: and(
          eq(hoodMemorials.isActive, true),
          eq(hoodMemorials.verificationStatus, 'verified')
        )
      });

      // Filter by distance
      const nearbyMemorials = memorials.filter(memorial => {
        if (!memorial.latitude || !memorial.longitude) return false;
        
        const distance = this.calculateDistance(
          latitude, 
          longitude,
          memorial.latitude, 
          memorial.longitude
        );

        return distance <= radiusKm;
      });

      // Group by neighborhood
      const grouped = nearbyMemorials.reduce((acc: any, memorial) => {
        const key = memorial.neighborhoodId || 'unassigned';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(memorial);
        return acc;
      }, {});

      return Object.entries(grouped).map(([neighborhoodId, memorials]) => ({
        neighborhoodId,
        memorials,
        count: (memorials as any[]).length
      }));
    } catch (error) {
      console.error('[VERIFICATION] Error getting nearby memorials:', error);
      throw error;
    }
  }

  /**
   * Helper: Check if domain is known university
   */
  private isKnownUniversityDomain(domain: string): boolean {
    const knownDomains = [
      'harvard.edu',
      'stanford.edu',
      'mit.edu',
      'yale.edu',
      'princeton.edu',
      'columbia.edu',
      'upenn.edu',
      'cornell.edu',
      // Add more as needed
    ];

    return knownDomains.some(known => domain.includes(known));
  }

  /**
   * Helper: Check if employer is known essential service
   */
  private isKnownEssentialEmployer(employerName: string): boolean {
    const keywords = [
      'hospital',
      'medical center',
      'fire department',
      'police department',
      'ems',
      'paramedic',
      'nursing home',
      'grocery',
      'pharmacy',
      'transit authority',
      'postal service',
      'sanitation department'
    ];

    const lowerEmployer = employerName.toLowerCase();
    return keywords.some(keyword => lowerEmployer.includes(keyword));
  }

  /**
   * Helper: Calculate distance between two coordinates
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  /**
   * Send manual verification request to admin
   */
  private async sendManualVerificationRequest(type: string, memorial: any): Promise<void> {
    console.log(`[VERIFICATION] Manual verification requested for ${type} memorial ${memorial.id}`);
    // In production, send to admin queue or email
  }

  /**
   * Send verification confirmation email
   */
  private async sendVerificationConfirmation(type: string, memorial: any, email: string): Promise<void> {
    const html = `
      <h2>Memorial Verified</h2>
      <p>Your ${type} memorial has been successfully verified.</p>
      <p>Memorial: ${memorial.name}</p>
      <p>You can now access all verified memorial features.</p>
    `;

    await emailService.sendEmail({
      to: email,
      subject: 'Memorial Verification Successful',
      html: html,
      text: html.replace(/<[^>]*>/g, '')
    });
  }

  /**
   * Send estate verification for review
   */
  private async sendEstateVerificationForReview(data: any): Promise<void> {
    console.log('[VERIFICATION] Estate verification sent for review:', data.memorial.id);
    // In production, add to admin review queue
  }

  /**
   * Send estate approval notification
   */
  private async sendEstateApprovalNotification(memorial: any): Promise<void> {
    const html = `
      <h2>Estate Verification Approved</h2>
      <p>The estate verification for ${memorial.name} has been approved.</p>
      <p>You can now:</p>
      <ul>
        <li>Receive donations on behalf of the estate</li>
        <li>Manage exclusive content</li>
        <li>Access monetization features</li>
      </ul>
    `;

    await emailService.sendEmail({
      to: memorial.estateRepresentativeEmail,
      subject: 'Estate Verification Approved - Opictuary',
      html: html,
      text: html.replace(/<[^>]*>/g, '')
    });
  }

  /**
   * Send employer verification request
   */
  private async sendEmployerVerificationRequest(memorial: any, employerName: string, contact?: string): Promise<void> {
    console.log(`[VERIFICATION] Employer verification requested from ${employerName} for memorial ${memorial.id}`);
    // In production, send verification request to employer
  }
}

// Export singleton instance
export const verificationService = new VerificationService();