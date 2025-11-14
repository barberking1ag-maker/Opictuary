import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, X, Check } from "lucide-react";
import type { ReligiousSymbol, MemorialSymbol } from "@shared/schema";

interface ReligiousSymbolGalleryProps {
  memorialId: string;
  canEdit?: boolean;
}

const SYMBOL_CATEGORIES = [
  { value: "christian", label: "Christianity" },
  { value: "islamic", label: "Islam" },
  { value: "jewish", label: "Judaism" },
  { value: "buddhist", label: "Buddhism" },
  { value: "hindu", label: "Hinduism" },
  { value: "spiritual", label: "Spiritual" },
  { value: "nature", label: "Nature" },
  { value: "universal", label: "Universal" },
  { value: "custom", label: "Custom" },
];

export function ReligiousSymbolGallery({ memorialId, canEdit = false }: ReligiousSymbolGalleryProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  // Fetch all available religious symbols
  const { data: availableSymbols = [] } = useQuery<ReligiousSymbol[]>({
    queryKey: ["/api/religious-symbols", selectedCategory],
    queryFn: async () => {
      const params = selectedCategory ? `?category=${selectedCategory}` : '';
      const response = await fetch(`/api/religious-symbols${params}`);
      if (!response.ok) throw new Error("Failed to fetch symbols");
      return response.json();
    },
  });

  // Fetch memorial's selected symbols
  const { data: memorialSymbols = [] } = useQuery<MemorialSymbol[]>({
    queryKey: [`/api/memorials/${memorialId}/symbols`],
    enabled: !!memorialId,
  });

  useEffect(() => {
    // Set initially selected symbols
    setSelectedSymbols(memorialSymbols.map(ms => ms.symbolId));
  }, [memorialSymbols]);

  // Add symbol to memorial
  const addSymbolMutation = useMutation({
    mutationFn: async (symbolId: string) => {
      return apiRequest(`/api/memorials/${memorialId}/symbols`, {
        method: "POST",
        body: JSON.stringify({ symbolId, displayOrder: selectedSymbols.length }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/symbols`] });
      toast({
        title: "Symbol Added",
        description: "The symbol has been added to the memorial.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add symbol. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove symbol from memorial
  const removeSymbolMutation = useMutation({
    mutationFn: async (memorialSymbolId: string) => {
      return apiRequest(`/api/memorial-symbols/${memorialSymbolId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/symbols`] });
      toast({
        title: "Symbol Removed",
        description: "The symbol has been removed from the memorial.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove symbol. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Upload custom symbol
  const uploadSymbolMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      imageUrl?: string;
      unicodeSymbol?: string;
      description?: string;
    }) => {
      return apiRequest("/api/religious-symbols", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/religious-symbols"] });
      setIsUploadOpen(false);
      toast({
        title: "Symbol Uploaded",
        description: "Your custom symbol has been added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload symbol. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSymbolClick = (symbol: ReligiousSymbol) => {
    const memorialSymbol = memorialSymbols.find(ms => ms.symbolId === symbol.id);
    
    if (memorialSymbol) {
      removeSymbolMutation.mutate(memorialSymbol.id);
    } else {
      addSymbolMutation.mutate(symbol.id);
    }
  };

  const isSymbolSelected = (symbolId: string) => {
    return memorialSymbols.some(ms => ms.symbolId === symbolId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Religious & Spiritual Symbols</h3>
          <p className="text-sm text-muted-foreground">
            Select meaningful symbols to display on the memorial page
          </p>
        </div>
        {canEdit && (
          <Button
            onClick={() => setIsUploadOpen(true)}
            size="sm"
            variant="outline"
            data-testid="button-upload-symbol"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Custom
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[200px]" data-testid="select-symbol-category">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {SYMBOL_CATEGORIES.map(category => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Symbols Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {availableSymbols.map((symbol) => {
          const isSelected = isSymbolSelected(symbol.id);
          return (
            <Card
              key={symbol.id}
              className={`relative cursor-pointer transition-all hover-elevate ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${!canEdit ? 'pointer-events-none' : ''}`}
              onClick={() => canEdit && handleSymbolClick(symbol)}
              data-testid={`card-symbol-${symbol.id}`}
            >
              <div className="p-4 text-center">
                {isSelected && canEdit && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                
                {/* Display symbol */}
                {symbol.unicodeSymbol ? (
                  <div className="text-3xl mb-2" data-testid={`text-symbol-${symbol.id}`}>
                    {symbol.unicodeSymbol}
                  </div>
                ) : symbol.imageUrl ? (
                  <img
                    src={symbol.imageUrl}
                    alt={symbol.name}
                    className="w-12 h-12 mx-auto mb-2 object-contain"
                    data-testid={`img-symbol-${symbol.id}`}
                  />
                ) : null}
                
                <p className="text-xs font-medium" data-testid={`text-symbol-name-${symbol.id}`}>
                  {symbol.name}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Symbols Display */}
      {memorialSymbols.length > 0 && !canEdit && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Selected Symbols</h4>
          <div className="flex flex-wrap gap-3">
            {memorialSymbols
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((ms) => {
                const symbol = availableSymbols.find(s => s.id === ms.symbolId);
                if (!symbol) return null;
                
                return (
                  <div
                    key={ms.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
                    data-testid={`selected-symbol-${ms.id}`}
                  >
                    {symbol.unicodeSymbol ? (
                      <span className="text-lg">{symbol.unicodeSymbol}</span>
                    ) : symbol.imageUrl ? (
                      <img
                        src={symbol.imageUrl}
                        alt={symbol.name}
                        className="w-5 h-5 object-contain"
                      />
                    ) : null}
                    <span className="text-sm">{symbol.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Upload Custom Symbol Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent data-testid="dialog-upload-symbol">
          <DialogHeader>
            <DialogTitle>Upload Custom Symbol</DialogTitle>
            <DialogDescription>
              Add a custom religious or spiritual symbol to the library
            </DialogDescription>
          </DialogHeader>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              uploadSymbolMutation.mutate({
                name: formData.get("name") as string,
                category: formData.get("category") as string,
                unicodeSymbol: formData.get("unicodeSymbol") as string || undefined,
                imageUrl: formData.get("imageUrl") as string || undefined,
                description: formData.get("description") as string || undefined,
              });
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Symbol Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Celtic Cross"
                data-testid="input-symbol-name"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger data-testid="select-upload-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SYMBOL_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="unicodeSymbol">Unicode Symbol (Optional)</Label>
              <Input
                id="unicodeSymbol"
                name="unicodeSymbol"
                placeholder="e.g., ✝️"
                data-testid="input-unicode"
              />
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/symbol.png"
                data-testid="input-image-url"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the symbol's meaning..."
                rows={3}
                data-testid="textarea-description"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadOpen(false)}
                data-testid="button-cancel-upload"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploadSymbolMutation.isPending}
                data-testid="button-submit-upload"
              >
                {uploadSymbolMutation.isPending ? "Uploading..." : "Upload Symbol"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}