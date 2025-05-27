import { storage } from '@/utils/storage/storage';
import { Peermall } from '@/types/peermall'; // Peermall 타입 임포트

const FAVORITE_PEERMALLS_KEY = 'FAVORITE_PEERMALLS';

type FavoriteStorageEventListener = (favorites: Peermall[]) => void;

class FavoriteEventManager {
  private listeners = new Set<FavoriteStorageEventListener>();

  addListener(listener: FavoriteStorageEventListener): () => void {
    this.listeners.add(listener);
    // 등록 즉시 현재 상태 전달
    const currentFavorites = favoriteStorage.getAllFavorites();
    listener(currentFavorites);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners(): void {
    const favorites = storage.get<Peermall[]>(FAVORITE_PEERMALLS_KEY) || [];
    console.log('🔔 즐겨찾기 데이터 변경 알림:', favorites.length, '개');
    this.listeners.forEach(listener => {
      try {
        listener([...favorites]);
      } catch (error) {
        console.error('즐겨찾기 이벤트 리스너 실행 오류:', error);
      }
    });
  }
}

const favoriteEventManager = new FavoriteEventManager();

export const favoriteStorage = {
  addEventListener(listener: FavoriteStorageEventListener): () => void {
    return favoriteEventManager.addListener(listener);
  },

  getAllFavorites(): Peermall[] {
    return storage.get<Peermall[]>(FAVORITE_PEERMALLS_KEY) || [];
  },

  isFavorite(peermallId: string): boolean {
    const favorites = this.getAllFavorites();
    return favorites.some(fav => fav.id === peermallId);
  },

  addFavorite(peermall: Peermall): void {
    const favorites = this.getAllFavorites();
    if (!this.isFavorite(peermall.id)) {
      favorites.push(peermall);
      storage.set(FAVORITE_PEERMALLS_KEY, favorites);
      favoriteEventManager.notifyListeners();
      console.log(`⭐ 즐겨찾기 추가: ${peermall.title}`);
    }
  },

  removeFavorite(peermallId: string): void {
    let favorites = this.getAllFavorites();
    const initialLength = favorites.length;
    favorites = favorites.filter(fav => fav.id !== peermallId);
    if (favorites.length < initialLength) {
      storage.set(FAVORITE_PEERMALLS_KEY, favorites);
      favoriteEventManager.notifyListeners();
      console.log(`💔 즐겨찾기 제거: ${peermallId}`);
    }
  },

  clearFavorites(): void {
    storage.remove(FAVORITE_PEERMALLS_KEY);
    favoriteEventManager.notifyListeners();
    console.log('🗑️ 모든 즐겨찾기 제거');
  },

  // 개발 환경에서 디버깅용 전역 객체 노출
  initializeDevTools() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).favoriteStorage = this;
      console.log('🔧 개발 모드: window.favoriteStorage 사용 가능');
    }
  }
};

// 개발 도구 초기화
favoriteStorage.initializeDevTools();
