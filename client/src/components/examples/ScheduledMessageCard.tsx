import { ScheduledMessageCard } from '../ScheduledMessageCard';

const sampleMessage1 = {
  id: "1",
  memorialId: "memorial-1",
  recipientName: "Emily Johnson",
  recipientEmail: "emily@example.com",
  eventType: "graduation" as const,
  customEventName: "College Graduation",
  eventDate: "2028-05-15",
  message: "If you're reading this, it means you just graduated from college. I wish I could be there to see you walk across that stage. I'm so proud of everything you've accomplished...",
  mediaUrl: null,
  mediaType: "text" as const,
  isRecurring: false,
  recurrenceInterval: null,
  isSent: false,
  sentAt: null,
  createdAt: "2024-01-01",
};

const sampleMessage2 = {
  id: "2",
  memorialId: "memorial-1",
  recipientName: "Michael Johnson",
  recipientEmail: "michael@example.com",
  eventType: "wedding" as const,
  customEventName: "Wedding Day",
  eventDate: "2030-01-01",
  message: "On your wedding day, I want you to know how happy I am for you. Remember to cherish every moment and never take love for granted...",
  mediaUrl: null,
  mediaType: "text" as const,
  isRecurring: false,
  recurrenceInterval: null,
  isSent: false,
  sentAt: null,
  createdAt: "2024-01-01",
};

export default function ScheduledMessageCardExample() {
  return (
    <div className="p-6 max-w-md space-y-4">
      <ScheduledMessageCard 
        message={sampleMessage1}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
      <ScheduledMessageCard 
        message={sampleMessage2}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
