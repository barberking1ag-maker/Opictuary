import { useState } from "react";
import { Camera as CameraIcon, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

interface CameraUploadProps {
  onCapture: (imageData: string) => void;
  onCancel?: () => void;
  className?: string;
}

const getCameraPlugin = () => {
  if (typeof window === 'undefined') return null;
  try {
    return (window as any).Capacitor?.Plugins?.Camera;
  } catch {
    return null;
  }
};

export function CameraUpload({ onCapture, onCancel, className }: CameraUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { notification, impact } = useHaptics();

  const takePhoto = async () => {
    const Camera = getCameraPlugin();
    if (!Camera) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    try {
      impact('light');
      setIsLoading(true);
      
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: true,
        resultType: 'base64',
        source: 'CAMERA',
        correctOrientation: true,
      });

      if (photo.base64String) {
        const imageData = `data:image/jpeg;base64,${photo.base64String}`;
        setPreview(imageData);
        notification('success');
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled photos app') {
        console.error('Camera error:', error);
        notification('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const choosePhoto = async () => {
    const Camera = getCameraPlugin();
    if (!Camera) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    try {
      impact('light');
      setIsLoading(true);
      
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: true,
        resultType: 'base64',
        source: 'PHOTOS',
        correctOrientation: true,
      });

      if (photo.base64String) {
        const imageData = `data:image/jpeg;base64,${photo.base64String}`;
        setPreview(imageData);
        notification('success');
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled photos app') {
        console.error('Photo picker error:', error);
        notification('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPhoto = () => {
    if (preview) {
      impact('medium');
      onCapture(preview);
    }
  };

  const clearPhoto = () => {
    impact('light');
    setPreview(null);
  };

  if (preview) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={clearPhoto}
            data-testid="button-clear-photo"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={clearPhoto}
            data-testid="button-retake"
          >
            Retake
          </Button>
          <Button 
            className="flex-1"
            onClick={confirmPhoto}
            data-testid="button-use-photo"
          >
            Use Photo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={takePhoto}
          disabled={isLoading}
          data-testid="button-take-photo"
        >
          <CameraIcon className="w-8 h-8" />
          <span className="text-sm">Take Photo</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={choosePhoto}
          disabled={isLoading}
          data-testid="button-choose-photo"
        >
          <Image className="w-8 h-8" />
          <span className="text-sm">Choose Photo</span>
        </Button>
      </div>
      {onCancel && (
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onCancel}
          data-testid="button-cancel-photo"
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
