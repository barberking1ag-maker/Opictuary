import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Music, Image, Settings, Play, Save, Upload, Trash2, GripVertical } from "lucide-react";
import type { MemorialSlideshow, MemorialPlaylist, Memory } from "@shared/schema";

interface SlideshowCreatorProps {
  memorialId: string;
  isOpen: boolean;
  onClose: () => void;
  editingSlideshow?: MemorialSlideshow;
}

const TRANSITION_EFFECTS = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "ken-burns", label: "Ken Burns Effect" },
];

export function SlideshowCreator({ 
  memorialId, 
  isOpen, 
  onClose, 
  editingSlideshow 
}: SlideshowCreatorProps) {
  const { toast } = useToast();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(
    editingSlideshow?.photoIds || []
  );
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | undefined>(
    editingSlideshow?.playlistId || undefined
  );
  const [title, setTitle] = useState(editingSlideshow?.title || "");
  const [description, setDescription] = useState(editingSlideshow?.description || "");
  const [transition, setTransition] = useState(editingSlideshow?.transitionType || "fade");
  const [duration, setDuration] = useState(editingSlideshow?.photoDuration || 5);
  const [syncToMusic, setSyncToMusic] = useState(editingSlideshow?.syncToMusic || false);
  const [autoplay, setAutoplay] = useState(editingSlideshow?.autoplay || false);
  const [showCaptions, setShowCaptions] = useState(editingSlideshow?.showCaptions || true);
  const [isPublic, setIsPublic] = useState(editingSlideshow?.isPublic ?? true);

  // Fetch memorial photos
  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: [`/api/memorials/${memorialId}/memories`],
    enabled: isOpen,
  });

  // Filter to get only photos
  const photos = memories.filter(m => m.type === 'photo');

  // Fetch playlists
  const { data: playlists = [] } = useQuery<MemorialPlaylist[]>({
    queryKey: [`/api/memorials/${memorialId}/playlists`],
    enabled: isOpen,
  });

  // Create/Update slideshow
  const saveSlideshowMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingSlideshow
        ? `/api/slideshows/${editingSlideshow.id}`
        : `/api/memorials/${memorialId}/slideshows`;
      const method = editingSlideshow ? "PUT" : "POST";
      
      return apiRequest(url, {
        method,
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/slideshows`] });
      toast({
        title: editingSlideshow ? "Slideshow Updated" : "Slideshow Created",
        description: "Your slideshow has been saved successfully.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save slideshow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePhotoToggle = (photoId: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      }
      return [...prev, photoId];
    });
  };

  const handlePhotoReorder = (photoId: string, direction: 'up' | 'down') => {
    setSelectedPhotos(prev => {
      const index = prev.indexOf(photoId);
      if (index === -1) return prev;
      
      const newArray = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= newArray.length) return prev;
      
      [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
      return newArray;
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your slideshow.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPhotos.length === 0) {
      toast({
        title: "Photos Required",
        description: "Please select at least one photo for your slideshow.",
        variant: "destructive",
      });
      return;
    }

    saveSlideshowMutation.mutate({
      title,
      description: description || undefined,
      photoIds: selectedPhotos,
      playlistId: selectedPlaylistId || undefined,
      transitionType: transition,
      photoDuration: duration,
      syncToMusic,
      autoplay,
      showCaptions,
      isPublic,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" data-testid="dialog-slideshow-creator">
        <DialogHeader>
          <DialogTitle>
            {editingSlideshow ? "Edit Slideshow" : "Create Memorial Slideshow"}
          </DialogTitle>
          <DialogDescription>
            Select photos and music to create a beautiful memorial slideshow
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
          {/* Left Panel - Photo Selection */}
          <div className="space-y-4">
            <div>
              <Label>Select Photos ({selectedPhotos.length} selected)</Label>
              <ScrollArea className="h-[300px] mt-2 border rounded-lg p-2">
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo) => {
                    const isSelected = selectedPhotos.includes(photo.id);
                    return (
                      <div
                        key={photo.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden hover-elevate ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handlePhotoToggle(photo.id)}
                        data-testid={`photo-select-${photo.id}`}
                      >
                        <img
                          src={photo.mediaUrl}
                          alt={photo.caption || "Memorial photo"}
                          className="w-full h-20 object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {selectedPhotos.indexOf(photo.id) + 1}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Selected Photos Order */}
            {selectedPhotos.length > 0 && (
              <div>
                <Label>Photo Order</Label>
                <ScrollArea className="h-[150px] mt-2 border rounded-lg p-2">
                  {selectedPhotos.map((photoId, index) => {
                    const photo = photos.find(p => p.id === photoId);
                    if (!photo) return null;
                    
                    return (
                      <div
                        key={photoId}
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded"
                        data-testid={`photo-order-${photoId}`}
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{index + 1}.</span>
                        <img
                          src={photo.mediaUrl}
                          alt=""
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="flex-1 text-sm truncate">
                          {photo.caption || "Photo"}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePhotoReorder(photoId, 'up')}
                            disabled={index === 0}
                            data-testid={`button-move-up-${photoId}`}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePhotoReorder(photoId, 'down')}
                            disabled={index === selectedPhotos.length - 1}
                            data-testid={`button-move-down-${photoId}`}
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Right Panel - Settings */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Slideshow Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Celebrating Mom's Life"
                required
                data-testid="input-slideshow-title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this slideshow"
                data-testid="input-slideshow-description"
              />
            </div>

            <div>
              <Label htmlFor="playlist">Background Music</Label>
              <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
                <SelectTrigger data-testid="select-playlist">
                  <SelectValue placeholder="Select a playlist (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Music</SelectItem>
                  {playlists.map(playlist => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transition">Transition Effect</Label>
              <Select value={transition} onValueChange={setTransition}>
                <SelectTrigger data-testid="select-transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSITION_EFFECTS.map(effect => (
                    <SelectItem key={effect.value} value={effect.value}>
                      {effect.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">
                Photo Duration: {duration} seconds
              </Label>
              <Slider
                id="duration"
                value={[duration]}
                onValueChange={(values) => setDuration(values[0])}
                min={2}
                max={15}
                step={1}
                className="w-full"
                data-testid="slider-duration"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-music" className="flex-1">
                  Sync to Music Beat
                  <p className="text-xs text-muted-foreground">
                    Automatically time transitions with music rhythm
                  </p>
                </Label>
                <Switch
                  id="sync-music"
                  checked={syncToMusic}
                  onCheckedChange={setSyncToMusic}
                  disabled={!selectedPlaylistId || selectedPlaylistId === 'none'}
                  data-testid="switch-sync-music"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="flex-1">
                  Autoplay
                  <p className="text-xs text-muted-foreground">
                    Start playing automatically when opened
                  </p>
                </Label>
                <Switch
                  id="autoplay"
                  checked={autoplay}
                  onCheckedChange={setAutoplay}
                  data-testid="switch-autoplay"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-captions" className="flex-1">
                  Show Captions
                  <p className="text-xs text-muted-foreground">
                    Display photo captions during slideshow
                  </p>
                </Label>
                <Switch
                  id="show-captions"
                  checked={showCaptions}
                  onCheckedChange={setShowCaptions}
                  data-testid="switch-captions"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is-public" className="flex-1">
                  Public Slideshow
                  <p className="text-xs text-muted-foreground">
                    Allow anyone to view this slideshow
                  </p>
                </Label>
                <Switch
                  id="is-public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  data-testid="switch-public"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedPhotos.length} photos selected
            {selectedPlaylistId && selectedPlaylistId !== 'none' && " • Music added"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-slideshow"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveSlideshowMutation.isPending || selectedPhotos.length === 0 || !title}
              data-testid="button-save-slideshow"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveSlideshowMutation.isPending ? "Saving..." : editingSlideshow ? "Update" : "Create"} Slideshow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}