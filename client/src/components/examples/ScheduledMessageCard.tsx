import ScheduledMessageCard from '../ScheduledMessageCard';

export default function ScheduledMessageCardExample() {
  return (
    <div className="p-6 max-w-md space-y-4">
      <ScheduledMessageCard 
        recipientName="Emily Johnson"
        eventType="College Graduation"
        triggerDate="May 2028"
        messagePreview="If you're reading this, it means you just graduated from college. I wish I could be there to see you walk across that stage. I'm so proud of everything you've accomplished..."
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
      <ScheduledMessageCard 
        recipientName="Michael Johnson"
        eventType="Wedding Day"
        triggerDate="Date to be set"
        messagePreview="On your wedding day, I want you to know how happy I am for you. Remember to cherish every moment and never take love for granted..."
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
