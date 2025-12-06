import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, X } from "lucide-react";
import type { MemorialSlideshow, MemorialPlaylist, Memory } from "@shared/schema";

interface SlideshowPlayerProps {
  slideshow: MemorialSlideshow;
  memorialId: string;
  onClose?: () => void;
}

export function SlideshowPlayer({ slideshow, memorialId, onClose }: SlideshowPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(slideshow.autoplay || false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch photos
  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: [`/api/memorials/${memorialId}/memories`],
  });

  // Filter and sort photos based on slideshow configuration
  const photos = slideshow.photoIds
    .map(id => memories.find(m => m.id === id))
    .filter(Boolean) as Memory[];

  // Fetch playlist if configured
  const { data: playlist } = useQuery<MemorialPlaylist>({
    queryKey: [`/api/playlists/${slideshow.playlistId}`],
    enabled: !!slideshow.playlistId,
  });

  // Track view
  const trackViewMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/slideshows/${slideshow.id}/view`, {
        method: "POST",
      });
    },
  });

  useEffect(() => {
    // Track view on mount
    trackViewMutation.mutate();
  }, [slideshow.id]);

  // Handle slideshow timing
  useEffect(() => {
    if (isPlaying && photos.length > 0) {
      const duration = slideshow.photoDuration * 1000;
      const progressInterval = 100; // Update progress every 100ms

      // Update progress
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (progressInterval / duration) * 100;
          if (newProgress >= 100) {
            return 0;
          }
          return newProgress;
        });
      }, progressInterval);

      // Change slide
      intervalRef.current = setTimeout(() => {
        handleNext();
        setProgress(0);
      }, duration);

      return () => {
        clearInterval(progressTimer);
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
      };
    }
  }, [isPlaying, currentIndex, photos.length, slideshow.photoDuration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setProgress(0);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setProgress(0);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  if (photos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No photos available for this slideshow</p>
      </Card>
    );
  }

  const currentPhoto = photos[currentIndex];
  const transitionClass = 
    slideshow.transitionType === 'fade' ? 'animate-fade-in' :
    slideshow.transitionType === 'slide' ? 'animate-slide-in' :
    slideshow.transitionType === 'zoom' ? 'animate-zoom-in' :
    slideshow.transitionType === 'ken-burns' ? 'animate-ken-burns' : '';

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden"
      data-testid="slideshow-player"
    >
      {/* Background Music */}
      {playlist && playlist.songs.length > 0 && (
        <audio
          ref={audioRef}
          src={playlist.songs[0].url}
          loop={playlist.isLooped}
          muted={isMuted}
          autoPlay={slideshow.autoplay}
        />
      )}

      {/* Close Button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
          onClick={onClose}
          data-testid="button-close-slideshow"
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      {/* Photo Display */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        <img
          key={currentIndex}
          src={currentPhoto.mediaUrl}
          alt={currentPhoto.caption || "Memorial photo"}
          className={`max-w-full max-h-full object-contain ${transitionClass}`}
          data-testid={`slideshow-photo-${currentIndex}`}
        />
        
        {/* Caption Overlay */}
        {slideshow.showCaptions && currentPhoto.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-white text-lg" data-testid="photo-caption">
              {currentPhoto.caption}
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <Progress 
        value={progress} 
        className="absolute bottom-16 left-0 right-0 h-1 bg-white/20"
        data-testid="slideshow-progress"
      />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handlePlayPause}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {/* Previous */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handlePrevious}
              disabled={photos.length <= 1}
              data-testid="button-previous"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            {/* Next */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleNext}
              disabled={photos.length <= 1}
              data-testid="button-next"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            {/* Photo Counter */}
            <span className="text-white text-sm ml-2" data-testid="photo-counter">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute/Unmute */}
            {playlist && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
                data-testid="button-mute"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            )}

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleFullscreen}
              data-testid="button-fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Slideshow Title */}
        <div className="text-center mt-2">
          <h3 className="text-white text-sm font-medium" data-testid="slideshow-title">
            {slideshow.title}
          </h3>
        </div>
      </div>
    </div>
  );
}