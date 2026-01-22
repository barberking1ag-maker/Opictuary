// Production API URL - this MUST be set for App Store builds
const PRODUCTION_API_URL = 'https://eternal-tribute-barberking1ag.replit.app';

// Cache for the computed API base URL
let cachedApiBaseUrl: string | null = null;

// Lazily compute the API base URL (not at module load time)
export const getApiBaseUrl = (): string => {
  // Return cached value if already computed
  if (cachedApiBaseUrl !== null) {
    return cachedApiBaseUrl;
  }
  
  // Always use explicit VITE_API_URL if provided
  if (import.meta.env.VITE_API_URL) {
    cachedApiBaseUrl = import.meta.env.VITE_API_URL as string;
    return cachedApiBaseUrl;
  }
  
  // Check if running in native platform (with safety check)
  try {
    // Dynamic import check to avoid crashes before Capacitor is ready
    const isNative = typeof window !== 'undefined' && 
                     (window as any).Capacitor && 
                     (window as any).Capacitor.isNativePlatform && 
                     (window as any).Capacitor.isNativePlatform();
    
    if (isNative) {
      cachedApiBaseUrl = PRODUCTION_API_URL;
      return cachedApiBaseUrl;
    }
  } catch (e) {
    // If Capacitor check fails, assume native and use production URL
    console.warn('Capacitor check failed, using production URL', e);
    cachedApiBaseUrl = PRODUCTION_API_URL;
    return cachedApiBaseUrl;
  }
  
  // For web development, use relative URLs (works with Vite dev server)
  cachedApiBaseUrl = '';
  return cachedApiBaseUrl;
};

// Helper to check if we're running in a native app (with safety)
export const isNativeApp = (): boolean => {
  try {
    const result = typeof window !== 'undefined' && 
           (window as any).Capacitor && 
           (window as any).Capacitor.isNativePlatform && 
           (window as any).Capacitor.isNativePlatform();
    return result === true;
  } catch {
    return false;
  }
};

// Get the platform (ios, android, or web)
export const getPlatform = (): string => {
  try {
    if (typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.getPlatform) {
      return (window as any).Capacitor.getPlatform();
    }
  } catch {
    // Ignore
  }
  return 'web';
};
