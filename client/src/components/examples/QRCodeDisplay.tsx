import QRCodeDisplay from '../QRCodeDisplay';

export default function QRCodeDisplayExample() {
  return (
    <div className="p-6 max-w-md">
      <QRCodeDisplay 
        url="https://memorial.app/margaret-johnson"
        title="Tombstone QR Code"
        description="Scan this code at the gravesite to view Margaret's video tribute and life story."
        onDownload={() => console.log('Download QR clicked')}
      />
    </div>
  );
}
