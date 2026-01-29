import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Trash2, CloudOff } from 'lucide-react';
import { saveMemorialOffline, getOfflineMemorial, removeOfflineMemorial } from '@/lib/offlineStorage';
import { hapticNotification } from '@/lib/mobileUtils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SaveOfflineButtonProps {
  memorial: any;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function SaveOfflineButton({ 
  memorial, 
  className, 
  variant = 'outline',
  size = 'sm',
  showLabel = true 
}: SaveOfflineButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSaved = async () => {
      if (memorial?.id || memorial?.slug) {
        const saved = await getOfflineMemorial(memorial.slug || memorial.id);
        setIsSaved(!!saved);
      }
    };
    checkSaved();
  }, [memorial?.id, memorial?.slug]);

  const handleToggle = async () => {
    if (!memorial) return;
    
    setIsLoading(true);
    try {
      if (isSaved) {
        await removeOfflineMemorial(memorial.slug || memorial.id);
        setIsSaved(false);
        await hapticNotification('success');
        toast({
          title: 'Removed from offline',
          description: 'This memorial is no longer saved for offline viewing.',
        });
      } else {
        await saveMemorialOffline(memorial);
        setIsSaved(true);
        await hapticNotification('success');
        toast({
          title: 'Saved for offline',
          description: 'You can now view this memorial without an internet connection.',
        });
      }
    } catch (error) {
      await hapticNotification('error');
      toast({
        title: 'Error',
        description: 'Failed to update offline storage.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (size === 'icon') {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          isSaved && 'text-green-500 border-green-500',
          className
        )}
        data-testid={isSaved ? 'button-remove-offline' : 'button-save-offline'}
        aria-label={isSaved ? 'Remove from offline' : 'Save for offline'}
      >
        {isLoading ? (
          <CloudOff className="w-4 h-4 animate-pulse" />
        ) : isSaved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        isSaved && 'text-green-500 border-green-500 hover:text-green-600',
        className
      )}
      data-testid={isSaved ? 'button-remove-offline' : 'button-save-offline'}
    >
      {isLoading ? (
        <CloudOff className="w-4 h-4 animate-pulse" />
      ) : isSaved ? (
        <>
          <Check className="w-4 h-4" />
          {showLabel && <span className="ml-2">Saved Offline</span>}
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          {showLabel && <span className="ml-2">Save Offline</span>}
        </>
      )}
    </Button>
  );
}

export function OfflineMemorialsList() {
  const [memorials, setMemorials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMemorials = async () => {
      const { getOfflineMemorials } = await import('@/lib/offlineStorage');
      const saved = await getOfflineMemorials();
      setMemorials(saved);
      setIsLoading(false);
    };
    loadMemorials();
  }, []);

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-4">Loading saved memorials...</div>;
  }

  if (memorials.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <CloudOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No memorials saved for offline viewing</p>
        <p className="text-sm mt-2">Visit a memorial and tap "Save Offline" to access it without internet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {memorials.length} memorial{memorials.length !== 1 ? 's' : ''} saved offline
      </h3>
      {memorials.map((item) => (
        <div 
          key={item.id} 
          className="flex items-center justify-between p-3 rounded-lg bg-card border"
        >
          <div>
            <p className="font-medium">{item.data?.fullName || item.data?.name || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">
              Saved {new Date(item.savedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              asChild
            >
              <a href={`/memorial/${item.slug || item.id}`}>View</a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await removeOfflineMemorial(item.id);
                setMemorials(m => m.filter(mem => mem.id !== item.id));
              }}
              className="text-destructive hover:text-destructive"
              data-testid={`button-delete-offline-${item.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
