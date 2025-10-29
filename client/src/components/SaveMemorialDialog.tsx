import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Users, Briefcase, Shield, Flame, Award, GraduationCap, Lightbulb, Home as HomeIcon, User, MoreHorizontal } from "lucide-react";

interface SaveMemorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memorialId: string;
  memorialName: string;
}

const RELATIONSHIP_CATEGORIES = [
  { value: "family", label: "Family", icon: Heart, description: "Family member" },
  { value: "friend", label: "Friend", icon: Users, description: "Personal friend" },
  { value: "colleague", label: "Colleague", icon: Briefcase, description: "Work colleague" },
  { value: "police_officer", label: "Police Officer", icon: Shield, description: "Law enforcement" },
  { value: "firefighter", label: "Firefighter", icon: Flame, description: "Firefighter" },
  { value: "military", label: "Military", icon: Award, description: "Military service member" },
  { value: "teacher", label: "Teacher", icon: GraduationCap, description: "Educator" },
  { value: "mentor", label: "Mentor", icon: Lightbulb, description: "Mentor or guide" },
  { value: "neighbor", label: "Neighbor", icon: HomeIcon, description: "Neighbor" },
  { value: "acquaintance", label: "Acquaintance", icon: User, description: "Acquaintance" },
  { value: "other", label: "Other", icon: MoreHorizontal, description: "Other relationship" },
];

export function SaveMemorialDialog({
  open,
  onOpenChange,
  memorialId,
  memorialName,
}: SaveMemorialDialogProps) {
  const [category, setCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/saved-memorials", {
        memorialId,
        relationshipCategory: category,
        customCategory: category === "other" ? customCategory : undefined,
        notes: notes || undefined,
      });
    },
    onSuccess: () => {
      // Invalidate both the general saved memorials list and the specific memorial's saved status
      queryClient.invalidateQueries({ queryKey: ["/api/saved-memorials"] });
      queryClient.invalidateQueries({ queryKey: [`/api/saved-memorials/${memorialId}`] });
      toast({
        title: "Memorial Saved",
        description: `${memorialName} has been added to your saved memorials.`,
      });
      onOpenChange(false);
      setCategory("");
      setCustomCategory("");
      setNotes("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save memorial",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!category) {
      toast({
        title: "Missing Information",
        description: "Please select how you knew this person.",
        variant: "destructive",
      });
      return;
    }

    if (category === "other" && !customCategory.trim()) {
      toast({
        title: "Missing Information",
        description: "Please specify your relationship.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate();
  };

  const selectedCategory = RELATIONSHIP_CATEGORIES.find(c => c.value === category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-save-memorial">
        <DialogHeader>
          <DialogTitle>Save Memorial</DialogTitle>
          <DialogDescription>
            Add {memorialName} to your saved memorials and specify your relationship.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="relationship">How did you know this person? *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="relationship" data-testid="select-relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} data-testid={`option-${cat.value}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="text-sm text-muted-foreground">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {category === "other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-category">Specify Relationship *</Label>
              <Input
                id="custom-category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Church member, Coach, Doctor"
                data-testid="input-custom-category"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Personal Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any personal notes or memories about your relationship..."
              className="min-h-[100px] resize-none"
              data-testid="input-notes"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saveMutation.isPending}
            data-testid="button-cancel-save"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-testid="button-confirm-save"
          >
            {saveMutation.isPending ? "Saving..." : "Save Memorial"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
