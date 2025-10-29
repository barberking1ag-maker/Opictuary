// From blueprint: javascript_google_analytics
// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    // Only warn in development - it's optional in production
    if (import.meta.env.DEV) {
      console.warn('Google Analytics not configured. Set VITE_GA_MEASUREMENT_ID to enable tracking.');
    }
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = async (url: string) => {
  // Track in database (works for all users)
  try {
    await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: url }),
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
  
  // Also track with Google Analytics if configured
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events
export const trackEvent = async (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number,
  metadata?: Record<string, any>
) => {
  // Track in database (works for all users)
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: action,
        eventCategory: category,
        eventLabel: label,
        eventValue: value,
        metadata,
      }),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
  
  // Also track with Google Analytics if configured
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
