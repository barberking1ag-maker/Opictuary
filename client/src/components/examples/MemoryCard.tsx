import MemoryCard from '../MemoryCard';

export default function MemoryCardExample() {
  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <MemoryCard 
        authorName="Sarah Williams"
        caption="I remember when Margaret taught me how to bake her famous apple pie. She was so patient and kind, always making sure I got every step just right. Those Sunday afternoons in her kitchen are some of my fondest memories."
        timestamp="2 hours ago"
        commentCount={12}
        onComment={() => console.log('Comment clicked')}
      />
      
      <MemoryCard 
        authorName="David Chen"
        caption="Such a beautiful soul. Will be deeply missed by everyone who knew her."
        timestamp="5 hours ago"
        commentCount={3}
        isPending={true}
        onApprove={() => console.log('Approved')}
        onReject={() => console.log('Rejected')}
        onComment={() => console.log('Comment clicked')}
      />
    </div>
  );
}
