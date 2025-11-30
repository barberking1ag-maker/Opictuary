import MemorialTabs from '../MemorialTabs';

export default function MemorialTabsExample() {
  return (
    <div className="p-6">
      <MemorialTabs 
        memoriesContent={<div className="p-8 bg-card rounded-lg text-center">Memories Gallery</div>}
        condolencesContent={<div className="p-8 bg-card rounded-lg text-center">Condolences Feed</div>}
        eventsContent={<div className="p-8 bg-card rounded-lg text-center">Legacy Events</div>}
        fundraiserContent={<div className="p-8 bg-card rounded-lg text-center">Fundraiser Details</div>}
        mapContent={<div className="p-8 bg-card rounded-lg text-center">Cemetery Map</div>}
        musicContent={<div className="p-8 bg-card rounded-lg text-center">Memorial Music</div>}
      />
    </div>
  );
}
