import { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
}

export function OfflineIndicator({ className, showWhenOnline = false }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !showReconnected && !showWhenOnline) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        className
      )}
      role="status"
      aria-live="polite"
      data-testid="status-connection"
    >
      {!isOnline && (
        <div className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
      )}
      
      {isOnline && showReconnected && (
        <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg animate-fade-in">
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back online</span>
        </div>
      )}
    </div>
  );
}

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      className="bg-amber-600 text-white px-4 py-2 text-center text-sm"
      role="alert"
      data-testid="banner-offline"
    >
      <div className="flex items-center justify-center gap-2">
        <CloudOff className="w-4 h-4" />
        <span>You're viewing cached content. Some features may be limited.</span>
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 p-1 hover:bg-amber-500 rounded"
          aria-label="Retry connection"
          data-testid="button-retry-connection"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
