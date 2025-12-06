import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FONT_OPTIONS = [
  { value: "inter", label: "Inter (Clean & Modern)", family: "Inter, sans-serif" },
  { value: "crimson", label: "Crimson Text (Elegant Serif)", family: "'Crimson Text', serif" },
  { value: "playfair", label: "Playfair Display (Classic)", family: "'Playfair Display', serif" },
  { value: "lora", label: "Lora (Traditional)", family: "'Lora', serif" },
  { value: "merriweather", label: "Merriweather (Warm)", family: "'Merriweather', serif" },
  { value: "montserrat", label: "Montserrat (Contemporary)", family: "'Montserrat', sans-serif" },
  { value: "raleway", label: "Raleway (Refined)", family: "'Raleway', sans-serif" },
  { value: "roboto", label: "Roboto (Simple)", family: "'Roboto', sans-serif" },
  { value: "opensans", label: "Open Sans (Friendly)", family: "'Open Sans', sans-serif" },
];

interface FontSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  testId?: string;
}

export function FontSelector({ value, onChange, testId }: FontSelectorProps) {
  const selectedFont = FONT_OPTIONS.find(f => f.value === value);
  
  return (
    <div className="space-y-2">
      <Label>Typography Style</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger data-testid={testId}>
          <SelectValue placeholder="Choose a font style" />
        </SelectTrigger>
        <SelectContent>
          {FONT_OPTIONS.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.family }}>{font.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedFont && (
        <div 
          className="p-4 bg-muted rounded-lg border text-center"
          style={{ fontFamily: selectedFont.family }}
        >
          <p className="text-lg">Preview: In loving memory</p>
          <p className="text-sm text-muted-foreground mt-1">1950 - 2024</p>
        </div>
      )}
    </div>
  );
}

export { FONT_OPTIONS };
