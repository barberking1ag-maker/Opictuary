import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Safe check for native platform without importing Capacitor at module load
const isNativePlatform = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           !!(window as any).Capacitor && 
           typeof (window as any).Capacitor.isNativePlatform === 'function' &&
           (window as any).Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

// Fix for Capacitor iOS: normalize URL path to "/" if it's "/index.html" or empty
// This prevents 404 errors when the app loads with a non-standard initial path
if (isNativePlatform()) {
  const path = window.location.pathname;
  console.log('[Opictuary] Native app initial path:', path);
  if (path === '/index.html' || path === '' || path === '/capacitor' || !path.startsWith('/')) {
    console.log('[Opictuary] Normalizing path to /');
    window.history.replaceState({}, '', '/');
  }
}

// Global error handler for debugging white screen issues on native apps
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', message, source, lineno, colno, error);
  if (isNativePlatform()) {
    const errorMsg = `Error: ${message}\nSource: ${source}\nLine: ${lineno}`;
    console.error('Native app error:', errorMsg);
  }
  return false;
};

// Catch unhandled promise rejections
window.onunhandledrejection = function(event) {
  console.error('Unhandled rejection:', event.reason);
};

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error('Failed to render app:', error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 20px; color: red;';
  errorDiv.textContent = 'App failed to load. Please try again.';
  document.body.appendChild(errorDiv);
}

// Only register service worker on web platform, not native apps
if ('serviceWorker' in navigator && !isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
