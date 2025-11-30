import { FONT_OPTIONS } from "@/components/FontSelector";
import { SYMBOL_OPTIONS } from "@/components/SymbolSelector";
import { LucideIcon } from "lucide-react";

export function getFontFamily(fontValue?: string): string | undefined {
  if (!fontValue) return undefined;
  const font = FONT_OPTIONS.find(f => f.value === fontValue);
  return font?.family;
}

export function getSymbolIcon(symbolValue?: string): LucideIcon | undefined {
  if (!symbolValue) return undefined;
  const symbol = SYMBOL_OPTIONS.find(s => s.value === symbolValue);
  return symbol?.icon;
}

export function getSymbolLabel(symbolValue?: string): string | undefined {
  if (!symbolValue) return undefined;
  const symbol = SYMBOL_OPTIONS.find(s => s.value === symbolValue);
  return symbol?.label;
}
