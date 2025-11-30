import CondolenceMessage from '../CondolenceMessage';

export default function CondolenceMessageExample() {
  return (
    <div className="p-6 max-w-2xl space-y-4">
      <CondolenceMessage 
        authorName="Robert Martinez"
        message="Margaret was a light in this world. Her kindness and warmth touched everyone who knew her. My deepest condolences to the family during this difficult time."
        timestamp="3 hours ago"
      />
      <CondolenceMessage 
        authorName="Lisa Thompson"
        message="Sending prayers and love to the entire family. May her memory be a blessing."
        timestamp="1 day ago"
      />
    </div>
  );
}
