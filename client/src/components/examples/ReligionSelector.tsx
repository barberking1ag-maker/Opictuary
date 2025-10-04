import ReligionSelector from '../ReligionSelector';
import { useState } from 'react';

export default function ReligionSelectorExample() {
  const [selected, setSelected] = useState('christian');

  const mockReligions = [
    { id: 'christian', name: 'Christian', symbol: '✝️', primaryColor: '#7C3AED', description: 'Traditional Christian themes' },
    { id: 'jewish', name: 'Jewish', symbol: '✡️', primaryColor: '#2563EB', description: 'Jewish traditions and symbols' },
    { id: 'islamic', name: 'Islamic', symbol: '☪️', primaryColor: '#059669', description: 'Islamic faith and culture' },
    { id: 'buddhist', name: 'Buddhist', symbol: '☸️', primaryColor: '#D97706', description: 'Buddhist philosophy and peace' },
    { id: 'hindu', name: 'Hindu', symbol: '🕉️', primaryColor: '#DC2626', description: 'Hindu traditions and beliefs' },
    { id: 'secular', name: 'Non-Religious', symbol: '🌟', primaryColor: '#6B7280', description: 'Secular celebration of life' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-semibold mb-6">Select Religious Tradition</h2>
      <ReligionSelector 
        religions={mockReligions}
        selectedId={selected}
        onSelect={(id) => {
          setSelected(id);
          console.log('Selected religion:', id);
        }}
      />
    </div>
  );
}
