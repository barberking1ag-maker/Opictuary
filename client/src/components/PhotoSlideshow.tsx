import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Play, Pause, SkipBack, SkipForward, Maximize2, Minimize2, 
  Volume2, VolumeX, X, ChevronLeft, ChevronRight, Music
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  caption?: string;
  authorName?: string;
}

interface PhotoSlideshowProps {
  photos: Photo[];
  memorialName: string;
  autoPlayInterval?: number;
  onClose?: () => void;
  className?: string;
}

export function PhotoSlideshow({
  photos,
  memorialName,
  autoPlayInterval = 5000,
  onClose,
  className
}: PhotoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const currentPhoto = photos[currentIndex];

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      const interval = setInterval(nextPhoto, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextPhoto, autoPlayInterval, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevPhoto();
          break;
        case "ArrowRight":
          nextPhoto();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen?.();
          } else if (onClose) {
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPhoto, prevPhoto, isFullscreen, onClose]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  if (photos.length === 0) {
    return (
      <Card className={cn("p-8 text-center", className)} data-testid="slideshow-empty">
        <p className="text-muted-foreground">No photos available for slideshow</p>
      </Card>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "rounded-lg aspect-video",
        className
      )}
      onMouseMove={handleMouseMove}
      data-testid="photo-slideshow"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.caption || `Photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-500"
          data-testid="slideshow-image"
        />
      </div>

      <div 
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {currentPhoto.caption && (
          <p className="text-white text-center mb-2" data-testid="slideshow-caption">
            {currentPhoto.caption}
          </p>
        )}
        {currentPhoto.authorName && (
          <p className="text-white/70 text-sm text-center mb-4">
            Shared by {currentPhoto.authorName}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevPhoto}
            className="text-white hover:bg-white/20"
            data-testid="button-prev"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/20 h-12 w-12"
            data-testid="button-play-pause"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextPhoto}
            className="text-white hover:bg-white/20"
            data-testid="button-next"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-white/70 text-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
              data-testid="button-mute"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Music className="h-4 w-4" />
            <span className="text-xs">Background music</span>
          </div>
          
          <div className="text-center">
            {currentIndex + 1} / {photos.length}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
              data-testid="button-fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
                data-testid="button-close"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={prevPhoto}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/20 h-12 w-12 transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
        data-testid="button-prev-side"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextPhoto}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/20 h-12 w-12 transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
        data-testid="button-next-side"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div 
        className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <h3 className="text-white font-serif text-lg">
          In Loving Memory of {memorialName}
        </h3>
      </div>

      <div 
        className={cn(
          "absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1 transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {photos.slice(0, 10).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              idx === currentIndex ? "bg-white" : "bg-white/40"
            )}
            data-testid={`dot-${idx}`}
          />
        ))}
        {photos.length > 10 && (
          <span className="text-white/40 text-xs ml-1">+{photos.length - 10}</span>
        )}
      </div>
    </div>
  );
}
