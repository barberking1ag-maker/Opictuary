import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { getApiBaseUrl, isNativeApp } from '@/config/api';

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

let browserListenerRegistered = false;

export async function handleMobileLogin(): Promise<void> {
  await hapticImpact('light');
  
  // Use the in-app auth page for both mobile and web
  // This works everywhere unlike OAuth-based Replit Auth
  window.location.href = '/auth';
}

export async function handleMobileLogout(): Promise<void> {
  await hapticImpact('light');
  
  try {
    localStorage.removeItem('opictuary_auth_token');
  } catch {}
  
  try {
    await fetch('/api/auth/mobile/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    window.location.href = '/';
  }
}

export function getPlatform(): string {
  return Capacitor.getPlatform();
}

export async function openExternalLink(url: string): Promise<void> {
  if (isNativePlatform()) {
    await Browser.open({
      url,
      presentationStyle: 'popover',
      toolbarColor: '#4A1D6A',
    });
  } else {
    window.open(url, '_blank');
  }
}

export async function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
  if (!isNativePlatform()) return;
  
  try {
    const impactStyle = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }[style];
    
    await Haptics.impact({ style: impactStyle });
  } catch (error) {
  }
}

export async function hapticNotification(type: 'success' | 'warning' | 'error' = 'success'): Promise<void> {
  if (!isNativePlatform()) return;
  
  try {
    const notificationType = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    }[type];
    
    await Haptics.notification({ type: notificationType });
  } catch (error) {
  }
}

export async function hapticSelection(): Promise<void> {
  if (!isNativePlatform()) return;
  
  try {
    await Haptics.selectionStart();
    await Haptics.selectionEnd();
  } catch (error) {
  }
}

export async function nativeShare(options: {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}): Promise<boolean> {
  await hapticImpact('light');
  
  if (isNativeApp()) {
    try {
      const canShare = await Share.canShare();
      if (canShare.value) {
        await Share.share({
          title: options.title,
          text: options.text,
          url: options.url,
          dialogTitle: options.dialogTitle || 'Share',
        });
        return true;
      }
    } catch (error) {
    }
  }
  
  if (navigator.share && options.url) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    } catch (error) {
    }
  }
  
  return false;
}
