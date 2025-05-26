// @/utils/storage/storage.ts
import { STORAGE_KEYS, StorageKeyName } from './constants';

export const storage = {
  get<T>(keyName: StorageKeyName): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(STORAGE_KEYS[keyName]);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`스토리지 읽기 오류 (${keyName}):`, error);
      return null;
    }
  },

  set<T>(keyName: StorageKeyName, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS[keyName], JSON.stringify(value));
    } catch (error) {
      console.error(`스토리지 쓰기 오류 (${keyName}):`, error);
    }
  },

  remove(keyName: StorageKeyName): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS[keyName]);
    } catch (error) {
      console.error(`스토리지 삭제 오류 (${keyName}):`, error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('스토리지 전체 삭제 오류:', error);
    }
  },

  // 스토리지 사용량 체크 (선택사항)
  getStorageInfo(): { used: number; available: number } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
      
      // 대략적인 사용 가능 공간 (5MB 기준)
      const available = 5 * 1024 * 1024 - used;
      
      return { used, available };
    } catch (error) {
      console.error('스토리지 정보 조회 오류:', error);
      return null;
    }
  }
};
