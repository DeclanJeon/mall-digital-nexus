import { STORAGE_KEYS, StorageKey } from './constants';

export const storage = {
  get<T>(key: StorageKey): T | null {
    if (typeof window === 'undefined') return null;
    
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    return item ? JSON.parse(item) : null;
  },

  set<T>(key: StorageKey, value: T): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  },

  remove(key: StorageKey): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEYS[key]);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
