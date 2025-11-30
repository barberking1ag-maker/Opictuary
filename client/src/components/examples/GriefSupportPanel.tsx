import GriefSupportPanel from '../GriefSupportPanel';

export default function GriefSupportPanelExample() {
  return (
    <div className="p-6 max-w-2xl">
      <GriefSupportPanel 
        familyContact="Contact the Johnson family"
        pastoralContact="Reach out to Pastor David Miller"
        customContacts={[
          { label: 'Grief Support Group', value: '(555) 123-4567', type: 'crisis' },
          { label: 'Memorial Coordinator', value: '(555) 987-6543', type: 'family' }
        ]}
      />
    </div>
  );
}
