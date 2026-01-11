export function useHaptics() {
  const isNative = typeof window !== 'undefined' && 
    (window as any).Capacitor?.isNativePlatform?.();

  const getHapticsPlugin = () => {
    if (!isNative) return null;
    try {
      return (window as any).Capacitor?.Plugins?.Haptics;
    } catch {
      return null;
    }
  };

  const impact = async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    const Haptics = getHapticsPlugin();
    if (!Haptics) return;
    try {
      const styleMap = { light: 'LIGHT', medium: 'MEDIUM', heavy: 'HEAVY' };
      await Haptics.impact({ style: styleMap[style] });
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const notification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    const Haptics = getHapticsPlugin();
    if (!Haptics) return;
    try {
      const typeMap = { success: 'SUCCESS', warning: 'WARNING', error: 'ERROR' };
      await Haptics.notification({ type: typeMap[type] });
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  const selection = async () => {
    const Haptics = getHapticsPlugin();
    if (!Haptics) return;
    try {
      await Haptics.selectionStart();
      await Haptics.selectionEnd();
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  return { impact, notification, selection, isNative };
}
