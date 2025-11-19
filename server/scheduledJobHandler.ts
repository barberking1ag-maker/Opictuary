import { db } from "./db";
import { scheduledMessages, memorials } from "@shared/schema";
import { eq, and, or, lte, isNull } from "drizzle-orm";
import { emailService } from "./emailService";

// Helper function to calculate next send date based on recurrence
function calculateNextSendDate(baseDate: Date, interval: string): Date {
  const nextDate = new Date(baseDate);
  
  switch (interval) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      // For custom intervals, default to yearly
      nextDate.setFullYear(nextDate.getFullYear() + 1);
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

// Run the job every minute (in production, you might want to use a proper job scheduler)
let jobInterval: NodeJS.Timeout | null = null;

export function startScheduledMessageJob() {
  console.log('[SCHEDULED JOB] Starting scheduled message job (runs every minute)');
  
  // Run immediately on startup
  processScheduledMessages();
  
  // Then run every minute
  jobInterval = setInterval(() => {
    processScheduledMessages();
  }, 60000); // 60 seconds
}

export function stopScheduledMessageJob() {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
    console.log('[SCHEDULED JOB] Stopped scheduled message job');
  }
}