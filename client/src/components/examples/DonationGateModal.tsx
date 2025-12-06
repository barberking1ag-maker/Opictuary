import DonationGateModal from '../DonationGateModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DonationGateModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        Open Donation Gate Modal
      </Button>
      <DonationGateModal 
        open={open}
        onOpenChange={setOpen}
        celebrityName="Queen Elizabeth II"
        charityName="The Queen's Commonwealth Trust"
        donationAmount={10}
        platformPercentage={5}
        onSubmit={(amount, email) => {
          console.log('Donation submitted:', { amount, email });
          setOpen(false);
        }}
      />
    </div>
  );
}
