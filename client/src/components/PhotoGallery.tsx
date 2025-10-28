import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, Download, Heart, User } from "lucide-react";
import type { Memory } from "@shared/schema";

interface PhotoGalleryProps {
  memories: Memory[];
}

export function PhotoGallery({ memories }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Memory | null>(null);

  // Filter memories that have photos
  const photosWithMemories = memories.filter((m) => m.mediaUrl && m.isApproved);

  if (photosWithMemories.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto mb-4">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
          <p className="text-muted-foreground">
            Photos shared by family and friends will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif font-bold">Photo Gallery</h3>
            <p className="text-muted-foreground">
              {photosWithMemories.length} {photosWithMemories.length === 1 ? 'photo' : 'photos'} shared with love
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <ImageIcon className="w-3 h-3 mr-1" />
            {photosWithMemories.length}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photosWithMemories.map((memory) => (
            <Button
              key={memory.id}
              variant="ghost"
              className="w-full h-auto p-0 flex flex-col rounded-md group"
              onClick={() => setSelectedPhoto(memory)}
              aria-label={`View photo by ${memory.authorName}${memory.caption ? `: ${memory.caption}` : ''}`}
              data-testid={`button-view-photo-${memory.id}`}
            >
              <Card className="overflow-hidden w-full" data-testid={`photo-card-${memory.id}`}>
                <div className="aspect-square relative overflow-hidden w-full">
                  <img
                    src={memory.mediaUrl!}
                    alt={memory.caption || `Photo by ${memory.authorName}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-testid={`photo-img-${memory.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2 text-left drop-shadow-lg" data-testid={`photo-author-${memory.id}`}>
                        <User className="w-3 h-3 inline mr-1" />
                        {memory.authorName}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Button>
          ))}
        </div>
      </div>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none" data-testid="dialog-photo-viewer">
          {selectedPhoto && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo viewer"
                data-testid="button-close-photo"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex flex-col">
                <div className="relative bg-black">
                  <img
                    src={selectedPhoto.mediaUrl!}
                    alt={selectedPhoto.caption || "Memorial photo"}
                    className="w-full max-h-[70vh] object-contain"
                    data-testid="img-photo-viewer"
                  />
                </div>

                <div className="bg-card p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground" data-testid="text-photo-author">
                            {selectedPhoto.authorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPhoto.createdAt 
                              ? new Date(selectedPhoto.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Shared with love'
                            }
                          </p>
                        </div>
                      </div>

                      {selectedPhoto.caption && (
                        <div className="mt-3 p-4 bg-muted/50 rounded-lg">
                          <p className="text-foreground leading-relaxed" data-testid="text-photo-caption">
                            {selectedPhoto.caption}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        data-testid="button-download-photo"
                      >
                        <a
                          href={selectedPhoto.mediaUrl!}
                          download={`memorial-photo-${selectedPhoto.id}.jpg`}
                          aria-label="Download photo"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
