import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

interface MusicPlayerProps {
  playlist: Track[];
  currentTrackIndex?: number;
}

export default function MusicPlayer({
  playlist,
  currentTrackIndex = 0
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentIndex, setCurrentIndex] = useState(currentTrackIndex);
  
  const currentTrack = playlist[currentIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Paused' : 'Playing');
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    console.log('Next track:', playlist[nextIndex].title);
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    console.log('Previous track:', playlist[prevIndex].title);
  };

  return (
    <Card className="overflow-hidden" data-testid="card-music-player">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-serif font-semibold text-foreground mb-1" data-testid="text-track-title">
            {currentTrack.title}
          </h3>
          <p className="text-muted-foreground" data-testid="text-track-artist">
            {currentTrack.artist}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handlePrevious}
              data-testid="button-previous"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button 
              size="icon" 
              className="w-14 h-14"
              onClick={handlePlayPause}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handleNext}
              data-testid="button-next"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <Slider 
              value={volume} 
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
              data-testid="slider-volume"
            />
            <span className="text-sm text-muted-foreground w-12 text-right" data-testid="text-volume">
              {volume[0]}%
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-3">Playlist</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {playlist.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentIndex(index);
                  console.log('Selected:', track.title);
                }}
                className={`w-full text-left p-3 rounded-md transition-colors hover-elevate active-elevate-2 ${
                  index === currentIndex ? 'bg-primary/10' : 'bg-transparent'
                }`}
                data-testid={`track-${index}`}
              >
                <p className="font-medium text-sm text-foreground">{track.title}</p>
                <p className="text-xs text-muted-foreground">{track.artist} • {track.duration}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
