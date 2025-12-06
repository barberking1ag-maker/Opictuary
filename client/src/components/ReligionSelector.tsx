import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Religion {
  id: string;
  name: string;
  symbol: string;
  primaryColor: string;
  description: string;
}

interface ReligionSelectorProps {
  religions: Religion[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function ReligionSelector({
  religions,
  selectedId,
  onSelect
}: ReligionSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {religions.map((religion) => {
        const isSelected = selectedId === religion.id;
        
        return (
          <Card
            key={religion.id}
            className={`relative cursor-pointer transition-all hover-elevate active-elevate-2 ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(religion.id)}
            data-testid={`card-religion-${religion.id}`}
          >
            <div className="p-6">
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className="text-4xl mb-3 text-center" data-testid={`symbol-${religion.id}`}>
                {religion.symbol}
              </div>
              
              <h3 className="font-serif font-semibold text-lg text-center text-foreground mb-2" data-testid={`text-religion-name-${religion.id}`}>
                {religion.name}
              </h3>
              
              <p className="text-sm text-muted-foreground text-center" data-testid={`text-religion-desc-${religion.id}`}>
                {religion.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
