import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Receipt } from "lucide-react";

interface Donor {
  name: string;
  amount: number;
  avatar?: string;
  timestamp: string;
}

interface ExpenseBreakdown {
  burialCosts?: number;
  funeralService?: number;
  headstone?: number;
  flowers?: number;
  other?: number;
  otherDescription?: string;
}

interface FundraiserProgressProps {
  title: string;
  description: string;
  currentAmount: number;
  goalAmount: number;
  donors: Donor[];
  expenseBreakdown?: ExpenseBreakdown;
  onDonate?: () => void;
}

export default function FundraiserProgress({
  title,
  description,
  currentAmount,
  goalAmount,
  donors,
  expenseBreakdown,
  onDonate
}: FundraiserProgressProps) {
  const progress = (currentAmount / goalAmount) * 100;

  const expenseItems = expenseBreakdown ? [
    { label: 'Burial Costs', amount: expenseBreakdown.burialCosts },
    { label: 'Funeral Service', amount: expenseBreakdown.funeralService },
    { label: 'Headstone', amount: expenseBreakdown.headstone },
    { label: 'Flowers', amount: expenseBreakdown.flowers },
    { label: expenseBreakdown.otherDescription || 'Other', amount: expenseBreakdown.other },
  ].filter(item => item.amount && item.amount > 0) : [];

  return (
    <Card className="overflow-hidden shadow-sm" data-testid="card-fundraiser">
      <div className="p-8">
        <h3 className="text-3xl font-serif font-semibold text-foreground mb-3" data-testid="text-fundraiser-title">
          {title}
        </h3>
        <p className="text-muted-foreground mb-8 leading-relaxed" data-testid="text-fundraiser-description">
          {description}
        </p>

        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-4xl font-semibold text-foreground" data-testid="text-current-amount">
              ${currentAmount.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground" data-testid="text-goal-amount">
              of ${goalAmount.toLocaleString()} goal
            </span>
          </div>
          <Progress value={progress} className="h-3" data-testid="progress-fundraiser" />
        </div>

        {expenseItems.length > 0 && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border" data-testid="expense-breakdown">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-semibold text-foreground text-sm">Where Your Donation Goes</h4>
            </div>
            <div className="space-y-2">
              {expenseItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground" data-testid={`expense-label-${index}`}>{item.label}</span>
                  <span className="font-medium text-foreground" data-testid={`expense-amount-${index}`}>
                    ${item.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          variant="default"
          className="w-full mb-8" 
          size="lg"
          onClick={onDonate}
          data-testid="button-donate"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Make a Donation
        </Button>

        {donors.length > 0 && (
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">
              Recent Donors ({donors.length})
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {donors.map((donor, index) => {
                const initials = donor.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-md hover-elevate" data-testid={`donor-${index}`}>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={donor.avatar} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate" data-testid={`text-donor-name-${index}`}>
                        {donor.name}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-donor-time-${index}`}>
                        {donor.timestamp}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground" data-testid={`text-donor-amount-${index}`}>
                      ${donor.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
