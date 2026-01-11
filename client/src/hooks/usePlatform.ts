import { useState, useEffect } from 'react';

interface PlatformInfo {
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  platform: 'ios' | 'android' | 'web';
}

export function usePlatform(): PlatformInfo {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isNative: false,
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        isTablet: false,
        platform: 'web',
      };
    }

    const capacitor = (window as any).Capacitor;
    const isNative = capacitor?.isNativePlatform?.() ?? false;
    const platform = capacitor?.getPlatform?.() ?? 'web';
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = platform === 'ios' || /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = platform === 'android' || /android/.test(userAgent);
    
    const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isMobileWidth = window.innerWidth < 768;
    const isMobile = isNative || isMobileUA || isMobileWidth;
    
    const isTabletWidth = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isTablet = isTabletWidth && !isNative;

    return {
      isNative,
      isIOS,
      isAndroid,
      isMobile,
      isTablet,
      platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const capacitor = (window as any).Capacitor;
      const isNative = capacitor?.isNativePlatform?.() ?? false;
      const platform = capacitor?.getPlatform?.() ?? 'web';
      
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = platform === 'ios' || /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = platform === 'android' || /android/.test(userAgent);
      
      const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileWidth = window.innerWidth < 768;
      const isMobile = isNative || isMobileUA || isMobileWidth;
      
      const isTabletWidth = window.innerWidth >= 768 && window.innerWidth < 1024;
      const isTablet = isTabletWidth && !isNative;

      setPlatformInfo({
        isNative,
        isIOS,
        isAndroid,
        isMobile,
        isTablet,
        platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web',
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return platformInfo;
}
