import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Music, Plus, Edit, Trash2, Star, Upload, Link } from "lucide-react";
import type { MemorialPlaylist } from "@shared/schema";

interface MusicPlaylistManagerProps {
  memorialId: string;
  canEdit?: boolean;
  onSelectPlaylist?: (playlistId: string) => void;
}

interface PlaylistSong {
  title: string;
  artist: string;
  url: string;
  duration?: number;
}

export function MusicPlaylistManager({ 
  memorialId, 
  canEdit = false,
  onSelectPlaylist
}: MusicPlaylistManagerProps) {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<MemorialPlaylist | null>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isLooped, setIsLooped] = useState(false);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);

  // Fetch playlists
  const { data: playlists = [] } = useQuery<MemorialPlaylist[]>({
    queryKey: [`/api/memorials/${memorialId}/playlists`],
  });

  // Create playlist
  const createPlaylistMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/memorials/${memorialId}/playlists`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/playlists`] });
      setIsCreateOpen(false);
      resetForm();
      toast({
        title: "Playlist Created",
        description: "Your music playlist has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update playlist
  const updatePlaylistMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return apiRequest(`/api/playlists/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/playlists`] });
      setEditingPlaylist(null);
      resetForm();
      toast({
        title: "Playlist Updated",
        description: "Your music playlist has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete playlist
  const deletePlaylistMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/playlists/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/playlists`] });
      toast({
        title: "Playlist Deleted",
        description: "The playlist has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set default playlist
  const setDefaultPlaylistMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/playlists/${id}/set-default`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/playlists`] });
      toast({
        title: "Default Playlist Set",
        description: "This playlist will be used as the default for new slideshows.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set default playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setPlaylistName("");
    setPlaylistDescription("");
    setIsLooped(false);
    setSongs([]);
  };

  const handleEdit = (playlist: MemorialPlaylist) => {
    setEditingPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistDescription(playlist.description || "");
    setIsLooped(playlist.isLooped);
    setSongs(playlist.songs as PlaylistSong[]);
    setIsCreateOpen(true);
  };

  const handleAddSong = () => {
    setSongs([...songs, { title: "", artist: "", url: "" }]);
  };

  const handleRemoveSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const handleUpdateSong = (index: number, field: keyof PlaylistSong, value: string) => {
    const updatedSongs = [...songs];
    updatedSongs[index] = { ...updatedSongs[index], [field]: value };
    setSongs(updatedSongs);
  };

  const handleSave = () => {
    if (!playlistName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for the playlist.",
        variant: "destructive",
      });
      return;
    }

    const validSongs = songs.filter(s => s.title && s.url);
    if (validSongs.length === 0) {
      toast({
        title: "Songs Required",
        description: "Please add at least one song with title and URL.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      name: playlistName,
      description: playlistDescription || undefined,
      songs: validSongs,
      isLooped,
    };

    if (editingPlaylist) {
      updatePlaylistMutation.mutate({ id: editingPlaylist.id, data });
    } else {
      createPlaylistMutation.mutate(data);
    }
  };

  const defaultPlaylist = playlists.find(p => p.isDefault);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Music Playlists</h3>
          <p className="text-sm text-muted-foreground">
            Create playlists for memorial slideshows and videos
          </p>
        </div>
        {canEdit && (
          <Button
            onClick={() => {
              setEditingPlaylist(null);
              resetForm();
              setIsCreateOpen(true);
            }}
            size="sm"
            data-testid="button-create-playlist"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        )}
      </div>

      {/* Playlists Grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className={`p-4 ${onSelectPlaylist ? 'cursor-pointer hover-elevate' : ''}`}
              onClick={() => onSelectPlaylist?.(playlist.id)}
              data-testid={`card-playlist-${playlist.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium">{playlist.name}</h4>
                    {playlist.isDefault && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {playlist.description}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-muted-foreground">
                    {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                    {playlist.isLooped && " • Looped"}
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex gap-1">
                    {!playlist.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDefaultPlaylistMutation.mutate(playlist.id);
                        }}
                        data-testid={`button-set-default-${playlist.id}`}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(playlist);
                      }}
                      data-testid={`button-edit-playlist-${playlist.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this playlist?")) {
                          deletePlaylistMutation.mutate(playlist.id);
                        }
                      }}
                      data-testid={`button-delete-playlist-${playlist.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Song List Preview */}
              <div className="mt-3 space-y-1">
                {playlist.songs.slice(0, 3).map((song: any, index) => (
                  <div key={index} className="text-xs text-muted-foreground truncate">
                    {index + 1}. {song.title} {song.artist && `- ${song.artist}`}
                  </div>
                ))}
                {playlist.songs.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{playlist.songs.length - 3} more...
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No playlists created yet</p>
          {canEdit && (
            <p className="text-sm text-muted-foreground mt-1">
              Create a playlist to add music to slideshows
            </p>
          )}
        </Card>
      )}

      {/* Create/Edit Playlist Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-playlist">
          <DialogHeader>
            <DialogTitle>
              {editingPlaylist ? "Edit Playlist" : "Create Playlist"}
            </DialogTitle>
            <DialogDescription>
              Add songs to create a memorial playlist for slideshows
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="e.g., Mom's Favorite Songs"
                required
                data-testid="input-playlist-name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Brief description of this playlist"
                data-testid="input-playlist-description"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-looped" className="flex-1">
                Loop Playlist
                <p className="text-xs text-muted-foreground">
                  Automatically restart when it ends
                </p>
              </Label>
              <Switch
                id="is-looped"
                checked={isLooped}
                onCheckedChange={setIsLooped}
                data-testid="switch-loop"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Songs</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddSong}
                  data-testid="button-add-song"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Song
                </Button>
              </div>

              <ScrollArea className="h-[300px] border rounded-lg p-4">
                {songs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No songs added yet. Click "Add Song" to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {songs.map((song, index) => (
                      <Card key={index} className="p-4" data-testid={`song-item-${index}`}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Song {index + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveSong(index)}
                              data-testid={`button-remove-song-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`title-${index}`} className="text-xs">
                                Title
                              </Label>
                              <Input
                                id={`title-${index}`}
                                value={song.title}
                                onChange={(e) => handleUpdateSong(index, 'title', e.target.value)}
                                placeholder="Song title"
                                required
                                data-testid={`input-song-title-${index}`}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`artist-${index}`} className="text-xs">
                                Artist (Optional)
                              </Label>
                              <Input
                                id={`artist-${index}`}
                                value={song.artist}
                                onChange={(e) => handleUpdateSong(index, 'artist', e.target.value)}
                                placeholder="Artist name"
                                data-testid={`input-song-artist-${index}`}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`url-${index}`} className="text-xs">
                              Audio URL
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`url-${index}`}
                                value={song.url}
                                onChange={(e) => handleUpdateSong(index, 'url', e.target.value)}
                                placeholder="https://example.com/song.mp3"
                                required
                                data-testid={`input-song-url-${index}`}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Placeholder for file upload
                                  toast({
                                    title: "Coming Soon",
                                    description: "Direct file upload will be available soon.",
                                  });
                                }}
                                data-testid={`button-upload-song-${index}`}
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingPlaylist(null);
                resetForm();
              }}
              data-testid="button-cancel-playlist"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !playlistName || 
                songs.filter(s => s.title && s.url).length === 0 ||
                createPlaylistMutation.isPending ||
                updatePlaylistMutation.isPending
              }
              data-testid="button-save-playlist"
            >
              {createPlaylistMutation.isPending || updatePlaylistMutation.isPending 
                ? "Saving..." 
                : editingPlaylist ? "Update" : "Create"} Playlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}