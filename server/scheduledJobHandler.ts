import { db } from "./db";
import { scheduledMessages, memorials, videoTimeCapsules } from "@shared/schema";
import { eq, and, or, lte, isNull } from "drizzle-orm";
import { emailService } from "./emailService";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { addDays, addWeeks, addMonths, addYears, format as dateFormat } from "date-fns";

// Utility function to compute next release date in UTC (mirrored from routes.ts)
// Takes a date and time in the memorial's timezone and converts to UTC
function computeNextReleaseDate(releaseDate: string, releaseTime: string = '00:00:00', timezone: string = 'UTC'): Date {
  // Ensure releaseTime has seconds (HH:mm:ss format)
  let normalizedTime = releaseTime;
  if (releaseTime && releaseTime.split(':').length === 2) {
    normalizedTime = `${releaseTime}:00`;
  }
  
  // Combine date and time into ISO datetime string
  const isoDateTimeString = `${releaseDate}T${normalizedTime}`;
  
  // Parse as a date in the memorial's timezone, then convert to UTC
  const utcDate = fromZonedTime(isoDateTimeString, timezone);
  
  // Validate the date
  if (isNaN(utcDate.getTime())) {
    throw new Error(`Invalid date/time combination: ${releaseDate}T${normalizedTime} in timezone ${timezone}`);
  }
  
  return utcDate;
}

// Helper to calculate next local occurrence date for recurring capsules
// Converts UTC to memorial timezone, adds interval, returns new date string
function calculateNextLocalDate(currentUtcDate: Date, interval: string, timezone: string): string {
  // Convert current UTC date to memorial's local time
  const zonedDate = toZonedTime(currentUtcDate, timezone);
  
  // Add the appropriate interval in local time
  let nextLocalDate: Date;
  switch (interval) {
    case 'daily':
      nextLocalDate = addDays(zonedDate, 1);
      break;
    case 'weekly':
      nextLocalDate = addWeeks(zonedDate, 1);
      break;
    case 'monthly':
      nextLocalDate = addMonths(zonedDate, 1);
      break;
    case 'yearly':
      nextLocalDate = addYears(zonedDate, 1);
      break;
    default:
      // For custom intervals, default to yearly
      nextLocalDate = addYears(zonedDate, 1);
  }
  
  // Format as YYYY-MM-DD for use with computeNextReleaseDate
  return dateFormat(nextLocalDate, 'yyyy-MM-dd');
}

// Legacy function kept for scheduled messages
// Uses UTC-safe date math to prevent timezone drift in recurring releases
function calculateNextSendDate(baseDate: Date, interval: string): Date {
  const nextDate = new Date(baseDate);
  
  switch (interval) {
    case 'daily':
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      break;
    case 'weekly':
      nextDate.setUTCDate(nextDate.getUTCDate() + 7);
      break;
    case 'monthly':
      nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
      break;
    case 'yearly':
      nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
      break;
    default:
      // For custom intervals, default to yearly
      nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
  }
  
  return nextDate;
}

// Function to process and send scheduled messages
export async function processScheduledMessages() {
  console.log('[SCHEDULED JOB] Processing scheduled messages...');
  
  const now = new Date();
  
  try {
    // Find messages that should be sent now
    const messagesToSend = await db
      .select()
      .from(scheduledMessages)
      .where(
        and(
          eq(scheduledMessages.status, 'pending'),
          or(
            // One-time messages with eventDate in the past
            and(
              eq(scheduledMessages.isRecurring, false),
              lte(scheduledMessages.eventDate, now.toISOString())
            ),
            // Recurring messages where nextSendDate is in the past
            and(
              eq(scheduledMessages.isRecurring, true),
              lte(scheduledMessages.nextSendDate, now)
            )
          )
        )
      );
    
    console.log(`[SCHEDULED JOB] Found ${messagesToSend.length} messages to send`);
    
    for (const message of messagesToSend) {
      try {
        console.log(`[SCHEDULED JOB] Processing message ${message.id} to ${message.recipientEmail || message.recipientName}`);
        
        // Get memorial details for sender name
        const memorial = await db.query.memorials.findFirst({
          where: eq(memorials.id, message.memorialId),
        });
        
        if (!memorial) {
          console.error(`[SCHEDULED JOB] Memorial not found for message ${message.id}`);
          // Mark as failed with error
          await db
            .update(scheduledMessages)
            .set({
              status: 'failed',
              deliveryStatus: 'failed',
              deliveryError: 'Memorial not found',
              deliveryAttempts: (message.deliveryAttempts || 0) + 1,
              lastDeliveryAttempt: now,
              updatedAt: now
            })
            .where(eq(scheduledMessages.id, message.id));
          continue;
        }
        
        // Send email if recipient email is provided
        let deliveryStatus = 'pending';
        let deliveryError = null;
        
        if (message.recipientEmail) {
          try {
            const emailSent = await emailService.sendFutureMessage({
              recipientName: message.recipientName,
              recipientEmail: message.recipientEmail,
              message: message.message,
              eventType: message.eventType,
              senderName: memorial.name,
              mediaUrl: message.mediaUrl || undefined,
              mediaType: message.mediaType || undefined,
            });
            
            if (emailSent) {
              console.log(`[SCHEDULED JOB] Email sent successfully for message ${message.id}`);
              deliveryStatus = 'sent';
            } else {
              console.error(`[SCHEDULED JOB] Failed to send email for message ${message.id}`);
              deliveryStatus = 'failed';
              deliveryError = 'Email delivery failed - SMTP not configured or error occurred';
            }
          } catch (error) {
            console.error(`[SCHEDULED JOB] Error sending email for message ${message.id}:`, error);
            deliveryStatus = 'failed';
            deliveryError = error instanceof Error ? error.message : 'Unknown error';
          }
        } else {
          console.warn(`[SCHEDULED JOB] No recipient email for message ${message.id}`);
          deliveryStatus = 'failed';
          deliveryError = 'No recipient email provided';
        }
        
        if (message.isRecurring) {
          // Calculate next send date
          const currentDate = message.nextSendDate || new Date(message.eventDate || now);
          const nextSendDate = calculateNextSendDate(currentDate, message.recurrenceInterval || 'yearly');
          
          // Check if we should continue recurring
          let shouldContinue = true;
          
          // Check recurrence count
          if (message.recurrenceCount !== null) {
            const sentCount = (message.sentCount || 0) + 1;
            if (sentCount >= message.recurrenceCount) {
              shouldContinue = false;
            }
          }
          
          // Check end date
          if (message.recurrenceEndDate && nextSendDate > message.recurrenceEndDate) {
            shouldContinue = false;
          }
          
          if (shouldContinue) {
            // Update for next occurrence - keep status as 'pending' for retry
            await db
              .update(scheduledMessages)
              .set({
                status: 'pending', // Keep pending for future retry attempts
                nextSendDate: nextSendDate,
                lastSentAt: deliveryStatus === 'sent' ? now : message.lastSentAt,
                sentCount: deliveryStatus === 'sent' ? (message.sentCount || 0) + 1 : message.sentCount,
                deliveryStatus: deliveryStatus,
                deliveryError: deliveryError,
                deliveryAttempts: (message.deliveryAttempts || 0) + 1,
                lastDeliveryAttempt: now,
                updatedAt: now
              })
              .where(eq(scheduledMessages.id, message.id));
              
            console.log(`[SCHEDULED JOB] Updated recurring message ${message.id} for next send on ${nextSendDate} (delivery: ${deliveryStatus})`);
          } else {
            // Final occurrence - mark as completed or failed based on delivery
            const finalStatus = deliveryStatus === 'sent' ? 'completed' : 'failed';
            await db
              .update(scheduledMessages)
              .set({
                status: finalStatus,
                isSent: deliveryStatus === 'sent',
                sentAt: deliveryStatus === 'sent' ? now : message.sentAt,
                lastSentAt: deliveryStatus === 'sent' ? now : message.lastSentAt,
                deliveryStatus: deliveryStatus,
                deliveryError: deliveryError,
                deliveryAttempts: (message.deliveryAttempts || 0) + 1,
                lastDeliveryAttempt: now,
                updatedAt: now
              })
              .where(eq(scheduledMessages.id, message.id));
              
            console.log(`[SCHEDULED JOB] Marked final recurring message ${message.id} as ${finalStatus}`);
          }
        } else {
          // One-time message - mark status based on delivery outcome
          const finalStatus = deliveryStatus === 'sent' ? 'sent' : 'failed';
          await db
            .update(scheduledMessages)
            .set({
              status: finalStatus,
              isSent: deliveryStatus === 'sent',
              sentAt: deliveryStatus === 'sent' ? now : null,
              deliveryStatus: deliveryStatus,
              deliveryError: deliveryError,
              deliveryAttempts: (message.deliveryAttempts || 0) + 1,
              lastDeliveryAttempt: now,
              updatedAt: now
            })
            .where(eq(scheduledMessages.id, message.id));
            
          console.log(`[SCHEDULED JOB] Marked one-time message ${message.id} as ${finalStatus}`);
        }
        
      } catch (error) {
        console.error(`[SCHEDULED JOB] Error processing message ${message.id}:`, error);
        
        // Mark message as failed
        await db
          .update(scheduledMessages)
          .set({
            status: 'failed',
            updatedAt: now
          })
          .where(eq(scheduledMessages.id, message.id));
      }
    }
    
    console.log('[SCHEDULED JOB] Finished processing scheduled messages');
    
  } catch (error) {
    console.error('[SCHEDULED JOB] Error in processScheduledMessages:', error);
  }
}

// Function to check and release video time capsules
export async function checkAndReleaseVideoTimeCapsules() {
  console.log('[SCHEDULED JOB] Checking for video time capsules to release...');
  
  const now = new Date();
  
  try {
    // Find capsules that should be released now
    const allScheduledCapsules = await db
      .select()
      .from(videoTimeCapsules)
      .where(
        and(
          eq(videoTimeCapsules.isReleased, false),
          eq(videoTimeCapsules.status, 'scheduled')
        )
      );
    
    // Filter capsules where nextReleaseDate is set and in the past
    // Note: nextReleaseDate is now set by create/update routes for all capsules (one-time and recurring)
    const capsulesToRelease = allScheduledCapsules.filter(capsule => {
      if (!capsule.nextReleaseDate) {
        // Skip capsules without nextReleaseDate (should not happen with new system)
        console.warn(`[SCHEDULED JOB] Capsule ${capsule.id} missing nextReleaseDate - skipping`);
        return false;
      }
      return new Date(capsule.nextReleaseDate) <= now;
    });
    
    console.log(`[SCHEDULED JOB] Found ${capsulesToRelease.length} video time capsules to release`);
    
    for (const capsule of capsulesToRelease) {
      try {
        console.log(`[SCHEDULED JOB] Releasing video time capsule ${capsule.id} - ${capsule.title}`);
        
        // Get memorial details for notification
        const memorial = await db.query.memorials.findFirst({
          where: eq(memorials.id, capsule.memorialId),
        });
        
        if (!memorial) {
          console.error(`[SCHEDULED JOB] Memorial not found for capsule ${capsule.id}`);
          continue;
        }
        
        if (capsule.isRecurring) {
          // Calculate next release date using timezone-aware logic
          const memorialTimezone = memorial.timezone || 'America/New_York';
          
          // 1. Get the current release date in UTC
          // Use nextReleaseDate if available, otherwise compute from releaseDate+releaseTime with timezone
          let currentUtcDate: Date;
          if (capsule.nextReleaseDate) {
            currentUtcDate = capsule.nextReleaseDate;
          } else {
            // First occurrence: compute UTC from releaseDate+releaseTime in memorial timezone
            currentUtcDate = computeNextReleaseDate(
              capsule.releaseDate,
              capsule.releaseTime || '00:00:00',
              memorialTimezone
            );
          }
          
          // 2. Calculate next local occurrence date in memorial's timezone
          const nextLocalDateString = calculateNextLocalDate(
            currentUtcDate,
            capsule.recurrenceInterval || 'yearly',
            memorialTimezone
          );
          
          // 3. Convert next local date+time back to UTC using memorial timezone
          const nextReleaseDate = computeNextReleaseDate(
            nextLocalDateString,
            capsule.releaseTime || '00:00:00',
            memorialTimezone
          );
          
          // Check if we should continue recurring
          let shouldContinue = true;
          
          // Check end date (convert recurrenceEndDate to UTC for comparison if needed)
          if (capsule.recurrenceEndDate) {
            // recurrenceEndDate might be a date string, so convert it properly
            const endDate = new Date(capsule.recurrenceEndDate);
            if (nextReleaseDate > endDate) {
              shouldContinue = false;
            }
          }
          
          if (shouldContinue) {
            // Update for next occurrence - keep scheduled for future releases
            // NOTE: For recurring capsules, we keep isReleased=false and status='scheduled'
            // so they can be processed again in the next cycle
            await db
              .update(videoTimeCapsules)
              .set({
                isReleased: false, // Keep false for recurring releases
                releasedAt: now, // Track when last released
                status: 'scheduled', // Keep scheduled for next release
                nextReleaseDate: nextReleaseDate, // Drizzle handles Date to timestamp conversion
                releasedCount: (capsule.releasedCount || 0) + 1,
                lastViewedAt: now, // Track activity
                updatedAt: now
              })
              .where(eq(videoTimeCapsules.id, capsule.id));
              
            console.log(`[SCHEDULED JOB] Released recurring capsule ${capsule.id}, next release on ${nextReleaseDate.toISOString()} (${memorialTimezone})`);
          } else {
            // Final occurrence
            await db
              .update(videoTimeCapsules)
              .set({
                isReleased: true,
                releasedAt: now,
                status: 'released',
                releasedCount: (capsule.releasedCount || 0) + 1,
                updatedAt: now
              })
              .where(eq(videoTimeCapsules.id, capsule.id));
              
            console.log(`[SCHEDULED JOB] Released final recurring capsule ${capsule.id}`);
          }
        } else {
          // One-time release
          await db
            .update(videoTimeCapsules)
            .set({
              isReleased: true,
              releasedAt: now,
              status: 'released',
              releasedCount: 1,
              updatedAt: now
            })
            .where(eq(videoTimeCapsules.id, capsule.id));
            
          console.log(`[SCHEDULED JOB] Released one-time capsule ${capsule.id}`);
        }
        
        // Send email notification to memorial creator
        try {
          await emailService.sendVideoTimeCapsuleReleaseNotification({
            recipientEmail: memorial.creatorEmail || '',
            memorialName: memorial.name,
            capsuleTitle: capsule.title,
            milestoneType: capsule.milestoneType,
            recipientName: capsule.recipientName || 'Unknown',
            memorialUrl: `${process.env.REPL_SLUG || ''}/memorials/${memorial.id}`,
          });
          console.log(`[SCHEDULED JOB] Sent release notification for capsule ${capsule.id}`);
        } catch (error) {
          console.error(`[SCHEDULED JOB] Failed to send notification for capsule ${capsule.id}:`, error);
          // Don't fail the release if notification fails
        }
        
      } catch (error) {
        console.error(`[SCHEDULED JOB] Error processing capsule ${capsule.id}:`, error);
      }
    }
    
    console.log('[SCHEDULED JOB] Finished processing video time capsules');
    
  } catch (error) {
    console.error('[SCHEDULED JOB] Error in checkAndReleaseVideoTimeCapsules:', error);
  }
}

// Run the jobs every minute (in production, you might want to use a proper job scheduler)
let jobInterval: NodeJS.Timeout | null = null;

export function startScheduledMessageJob() {
  console.log('[SCHEDULED JOB] Starting scheduled jobs (runs every minute)');
  
  // Run immediately on startup
  processScheduledMessages();
  checkAndReleaseVideoTimeCapsules();
  
  // Then run every minute
  jobInterval = setInterval(() => {
    processScheduledMessages();
    checkAndReleaseVideoTimeCapsules();
  }, 60000); // 60 seconds
}

export function stopScheduledMessageJob() {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
    console.log('[SCHEDULED JOB] Stopped scheduled jobs');
  }
}