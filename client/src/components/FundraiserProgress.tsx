import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign } from "lucide-react";

interface Donor {
  name: string;
  amount: number;
  avatar?: string;
  timestamp: string;
}

interface FundraiserProgressProps {
  title: string;
  description: string;
  currentAmount: number;
  goalAmount: number;
  donors: Donor[];
  onDonate?: () => void;
}

export default function FundraiserProgress({
  title,
  description,
  currentAmount,
  goalAmount,
  donors,
  onDonate
}: FundraiserProgressProps) {
  const progress = (currentAmount / goalAmount) * 100;

  return (
    <Card className="overflow-hidden" data-testid="card-fundraiser">
      <div className="p-6">
        <h3 className="text-2xl font-serif font-semibold text-foreground mb-2" data-testid="text-fundraiser-title">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6" data-testid="text-fundraiser-description">
          {description}
        </p>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-semibold text-foreground" data-testid="text-current-amount">
              ${currentAmount.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground" data-testid="text-goal-amount">
              of ${goalAmount.toLocaleString()} goal
            </span>
          </div>
          <Progress value={progress} className="h-3" data-testid="progress-fundraiser" />
        </div>

        <Button 
          className="w-full mb-6" 
          size="lg"
          onClick={onDonate}
          data-testid="button-donate"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Make a Donation
        </Button>

        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-foreground mb-4">
            Recent Donors ({donors.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {donors.map((donor, index) => {
              const initials = donor.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              return (
                <div key={index} className="flex items-center gap-3" data-testid={`donor-${index}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={donor.avatar} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate" data-testid={`text-donor-name-${index}`}>
                      {donor.name}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-donor-time-${index}`}>
                      {donor.timestamp}
                    </p>
                  </div>
                  <span className="font-semibold text-sm text-foreground" data-testid={`text-donor-amount-${index}`}>
                    ${donor.amount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
