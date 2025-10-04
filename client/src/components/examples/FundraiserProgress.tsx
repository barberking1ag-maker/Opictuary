import FundraiserProgress from '../FundraiserProgress';

export default function FundraiserProgressExample() {
  const mockDonors = [
    { name: "John Smith", amount: 500, timestamp: "2 hours ago" },
    { name: "Emily Rodriguez", amount: 250, timestamp: "5 hours ago" },
    { name: "Michael Chen", amount: 1000, timestamp: "1 day ago" },
    { name: "Sarah Johnson", amount: 100, timestamp: "2 days ago" },
    { name: "David Kim", amount: 300, timestamp: "3 days ago" }
  ];

  return (
    <div className="p-6 max-w-xl">
      <FundraiserProgress 
        title="Memorial Fund"
        description="Help us cover the funeral expenses and celebrate Margaret's life with dignity."
        currentAmount={8450}
        goalAmount={15000}
        donors={mockDonors}
        onDonate={() => console.log('Donate clicked')}
      />
    </div>
  );
}
