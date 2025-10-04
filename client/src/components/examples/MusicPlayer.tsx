import MusicPlayer from '../MusicPlayer';

export default function MusicPlayerExample() {
  const mockPlaylist = [
    { id: '1', title: 'Amazing Grace', artist: 'Traditional', duration: '3:42' },
    { id: '2', title: 'What a Wonderful World', artist: 'Louis Armstrong', duration: '2:20' },
    { id: '3', title: 'Over the Rainbow', artist: 'Judy Garland', duration: '2:45' },
    { id: '4', title: 'Ave Maria', artist: 'Franz Schubert', duration: '4:15' }
  ];

  return (
    <div className="p-6 max-w-xl">
      <MusicPlayer playlist={mockPlaylist} />
    </div>
  );
}
