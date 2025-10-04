import InviteCodeModal from '../InviteCodeModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function InviteCodeModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        Open Invite Code Modal
      </Button>
      <InviteCodeModal 
        open={open}
        onOpenChange={setOpen}
        onSubmit={(code) => {
          console.log('Code submitted:', code);
          setOpen(false);
        }}
      />
    </div>
  );
}
