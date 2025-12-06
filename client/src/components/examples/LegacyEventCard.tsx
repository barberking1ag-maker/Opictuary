import LegacyEventCard from '../LegacyEventCard';

export default function LegacyEventCardExample() {
  return (
    <div className="p-6 max-w-md">
      <LegacyEventCard 
        title="Annual Memorial Picnic"
        date="June 15, 2025"
        time="12:00 PM"
        location="Riverside Park, Pavilion 3"
        attendeeCount={28}
        description="Join us for our annual gathering to celebrate Margaret's life with food, music, and cherished memories."
        isUpcoming={true}
        onRSVP={() => console.log('RSVP clicked')}
      />
    </div>
  );
}
