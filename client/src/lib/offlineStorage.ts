import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const OFFLINE_MEMORIALS_KEY = 'offline_memorials';
const OFFLINE_DRAFTS_KEY = 'offline_drafts';
const OFFLINE_FAVORITES_KEY = 'offline_favorites';

export interface OfflineMemorial {
  id: string;
  slug: string;
  data: any;
  savedAt: number;
}

export interface OfflineDraft {
  id: string;
  type: 'message' | 'tribute' | 'memory';
  memorialId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export async function saveMemorialOffline(memorial: any): Promise<void> {
  try {
    const memorialId = memorial.id;
    const existing = await getOfflineMemorials();
    const updated = existing.filter(m => m.id !== memorialId);
    updated.push({
      id: memorialId,
      slug: memorial.slug || memorialId,
      data: memorial,
      savedAt: Date.now()
    });
    
    const limitedMemorials = updated.slice(-50);
    
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: OFFLINE_MEMORIALS_KEY,
        value: JSON.stringify(limitedMemorials)
      });
    } else {
      localStorage.setItem(OFFLINE_MEMORIALS_KEY, JSON.stringify(limitedMemorials));
    }
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_MEMORIAL',
        memorialId: memorialId
      });
    }
  } catch (error) {
    console.error('Failed to save memorial offline:', error);
  }
}

export async function getOfflineMemorials(): Promise<OfflineMemorial[]> {
  try {
    let data: string | null = null;
    
    if (Capacitor.isNativePlatform()) {
      const result = await Preferences.get({ key: OFFLINE_MEMORIALS_KEY });
      data = result.value;
    } else {
      data = localStorage.getItem(OFFLINE_MEMORIALS_KEY);
    }
    
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get offline memorials:', error);
    return [];
  }
}

export async function getOfflineMemorial(id: string): Promise<OfflineMemorial | null> {
  const memorials = await getOfflineMemorials();
  return memorials.find(m => m.id === id || m.slug === id) || null;
}

export async function removeOfflineMemorial(id: string): Promise<void> {
  try {
    const existing = await getOfflineMemorials();
    const updated = existing.filter(m => m.id !== id && m.slug !== id);
    
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: OFFLINE_MEMORIALS_KEY,
        value: JSON.stringify(updated)
      });
    } else {
      localStorage.setItem(OFFLINE_MEMORIALS_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to remove offline memorial:', error);
  }
}

export async function saveDraft(draft: Omit<OfflineDraft, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const existing = await getDrafts();
    const existingDraft = existing.find(
      d => d.memorialId === draft.memorialId && d.type === draft.type
    );
    
    const now = Date.now();
    const newDraft: OfflineDraft = {
      id: existingDraft?.id || `draft_${now}`,
      ...draft,
      createdAt: existingDraft?.createdAt || now,
      updatedAt: now
    };
    
    const updated = existingDraft 
      ? existing.map(d => d.id === existingDraft.id ? newDraft : d)
      : [...existing, newDraft];
    
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: OFFLINE_DRAFTS_KEY,
        value: JSON.stringify(updated)
      });
    } else {
      localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(updated));
    }
    
    return newDraft.id;
  } catch (error) {
    console.error('Failed to save draft:', error);
    throw error;
  }
}

export async function getDrafts(): Promise<OfflineDraft[]> {
  try {
    let data: string | null = null;
    
    if (Capacitor.isNativePlatform()) {
      const result = await Preferences.get({ key: OFFLINE_DRAFTS_KEY });
      data = result.value;
    } else {
      data = localStorage.getItem(OFFLINE_DRAFTS_KEY);
    }
    
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get drafts:', error);
    return [];
  }
}

export async function getDraftForMemorial(memorialId: string, type: OfflineDraft['type']): Promise<OfflineDraft | null> {
  const drafts = await getDrafts();
  return drafts.find(d => d.memorialId === memorialId && d.type === type) || null;
}

export async function deleteDraft(draftId: string): Promise<void> {
  try {
    const existing = await getDrafts();
    const updated = existing.filter(d => d.id !== draftId);
    
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: OFFLINE_DRAFTS_KEY,
        value: JSON.stringify(updated)
      });
    } else {
      localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
}

export async function toggleFavorite(memorialId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(memorialId);
    
    const updated = isFavorite
      ? favorites.filter(id => id !== memorialId)
      : [...favorites, memorialId];
    
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: OFFLINE_FAVORITES_KEY,
        value: JSON.stringify(updated)
      });
    } else {
      localStorage.setItem(OFFLINE_FAVORITES_KEY, JSON.stringify(updated));
    }
    
    return !isFavorite;
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    throw error;
  }
}

export async function getFavorites(): Promise<string[]> {
  try {
    let data: string | null = null;
    
    if (Capacitor.isNativePlatform()) {
      const result = await Preferences.get({ key: OFFLINE_FAVORITES_KEY });
      data = result.value;
    } else {
      data = localStorage.getItem(OFFLINE_FAVORITES_KEY);
    }
    
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
}

export async function isFavorite(memorialId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(memorialId);
}

export async function clearAllOfflineData(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: OFFLINE_MEMORIALS_KEY });
      await Preferences.remove({ key: OFFLINE_DRAFTS_KEY });
      await Preferences.remove({ key: OFFLINE_FAVORITES_KEY });
    } else {
      localStorage.removeItem(OFFLINE_MEMORIALS_KEY);
      localStorage.removeItem(OFFLINE_DRAFTS_KEY);
      localStorage.removeItem(OFFLINE_FAVORITES_KEY);
    }
  } catch (error) {
    console.error('Failed to clear offline data:', error);
  }
}

export async function getOfflineStorageInfo(): Promise<{
  memorialCount: number;
  draftCount: number;
  favoriteCount: number;
}> {
  const [memorials, drafts, favorites] = await Promise.all([
    getOfflineMemorials(),
    getDrafts(),
    getFavorites()
  ]);
  
  return {
    memorialCount: memorials.length,
    draftCount: drafts.length,
    favoriteCount: favorites.length
  };
}
