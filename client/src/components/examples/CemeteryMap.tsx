import CemeteryMap from '../CemeteryMap';

export default function CemeteryMapExample() {
  return (
    <div className="p-6 max-w-2xl">
      <CemeteryMap 
        cemeteryName="Riverside Memorial Gardens"
        sectionLocation="Section C, Plot 142"
        coordinates={{ lat: 40.7128, lng: -74.0060 }}
        onGetDirections={() => console.log('Get directions clicked')}
      />
    </div>
  );
}
