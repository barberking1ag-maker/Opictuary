import { db } from "./db";
import { scheduledMessages } from "@shared/schema";
import { eq, and, or, lte, isNull } from "drizzle-orm";

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
        // TODO: Actually send the message via email/SMS here
        console.log(`[SCHEDULED JOB] Sending message ${message.id} to ${message.recipientEmail || message.recipientName}`);
        
        // For now, just log the message
        console.log(`[SCHEDULED JOB] Message content: ${message.message}`);
        
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
            // Update for next occurrence
            await db
              .update(scheduledMessages)
              .set({
                nextSendDate: nextSendDate,
                lastSentAt: now,
                sentCount: (message.sentCount || 0) + 1,
                updatedAt: now
              })
              .where(eq(scheduledMessages.id, message.id));
              
            console.log(`[SCHEDULED JOB] Updated message ${message.id} for next send on ${nextSendDate}`);
          } else {
            // Mark as completed
            await db
              .update(scheduledMessages)
              .set({
                status: 'completed',
                isSent: true,
                sentAt: now,
                lastSentAt: now,
                updatedAt: now
              })
              .where(eq(scheduledMessages.id, message.id));
              
            console.log(`[SCHEDULED JOB] Marked recurring message ${message.id} as completed`);
          }
        } else {
          // One-time message - mark as sent
          await db
            .update(scheduledMessages)
            .set({
              status: 'sent',
              isSent: true,
              sentAt: now,
              updatedAt: now
            })
            .where(eq(scheduledMessages.id, message.id));
            
          console.log(`[SCHEDULED JOB] Marked one-time message ${message.id} as sent`);
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