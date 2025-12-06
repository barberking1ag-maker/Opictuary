import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cross, Heart, Star, Sparkles, Sun, Moon, TreePine, Flower2, Bird, Infinity, HandHeart, Feather, Anchor, CircleDot, Hand, Eye, Workflow, Mountain, Waves, Wind, Flame } from "lucide-react";

const SYMBOL_OPTIONS = [
  { value: "cross", label: "Cross (Christian)", icon: Cross },
  { value: "heart", label: "Heart (Love)", icon: Heart },
  { value: "star", label: "Star of David (Jewish)", icon: Star },
  { value: "moon", label: "Crescent Moon (Islamic)", icon: Moon },
  { value: "ankh", label: "Ankh (Kemetic/Egyptian)", icon: Anchor },
  { value: "dharma-wheel", label: "Dharma Wheel (Buddhist)", icon: CircleDot },
  { value: "om", label: "Om Symbol (Hindu)", icon: Sparkles },
  { value: "lotus", label: "Lotus (Buddhist/Hindu)", icon: Flower2 },
  { value: "hamsa", label: "Hamsa (Protection)", icon: Hand },
  { value: "eye-horus", label: "Eye of Horus (Egyptian)", icon: Eye },
  { value: "yin-yang", label: "Yin Yang (Taoist)", icon: Workflow },
  { value: "tree-life", label: "Tree of Life (Universal)", icon: TreePine },
  { value: "mountain", label: "Sacred Mountain (Spiritual)", icon: Mountain },
  { value: "water", label: "Water (Life & Renewal)", icon: Waves },
  { value: "wind", label: "Spirit Wind (Indigenous)", icon: Wind },
  { value: "flame", label: "Eternal Flame (Memorial)", icon: Flame },
  { value: "sun", label: "Sun (Life & Energy)", icon: Sun },
  { value: "bird", label: "Bird (Freedom & Ascension)", icon: Bird },
  { value: "infinity", label: "Infinity (Eternal Love)", icon: Infinity },
  { value: "handheart", label: "Hand & Heart (Compassion)", icon: HandHeart },
  { value: "feather", label: "Feather (Peace & Journey)", icon: Feather },
];

interface SymbolSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  testId?: string;
}

export function SymbolSelector({ value, onChange, testId }: SymbolSelectorProps) {
  const selectedSymbol = SYMBOL_OPTIONS.find(s => s.value === value);
  const SelectedIcon = selectedSymbol?.icon;
  
  return (
    <div className="space-y-2">
      <Label>Memorial Symbol</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger data-testid={testId}>
          <SelectValue placeholder="Choose a meaningful symbol" />
        </SelectTrigger>
        <SelectContent>
          {SYMBOL_OPTIONS.map((symbol) => {
            const Icon = symbol.icon;
            return (
              <SelectItem key={symbol.value} value={symbol.value}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{symbol.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {SelectedIcon && (
        <div className="p-4 bg-muted rounded-lg border flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <SelectedIcon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{selectedSymbol.label}</p>
        </div>
      )}
    </div>
  );
}

export { SYMBOL_OPTIONS };
