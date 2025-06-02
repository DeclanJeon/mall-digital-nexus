import { storage } from '@/utils/storage/storage';
import { Peermall } from '@/types/peermall';

// Peermall 타입을 다시 export
export type { Peermall };

// 이벤트 리스너 타입 정의
type PeermallStorageEventListener = (peermalls: Peermall[]) => void;

// 이벤트 리스너 관리
class PeermallEventManager {
  private listeners = new Set<PeermallStorageEventListener>();

  addListener(listener: PeermallStorageEventListener): () => void {
    this.listeners.add(listener);
    
    // 등록 즉시 현재 상태 전달
    const currentPeermalls = peermallStorage.getAll();
    listener(currentPeermalls);
    
    // 리스너 제거 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners(): void {
    const peermalls = storage.get<Peermall[]>('PEERMALLS') || [];
    
    this.listeners.forEach(listener => {
      try {
        listener([...peermalls]); // 새 배열로 복사하여 리렌더링 보장
      } catch (error) {
        console.error('이벤트 리스너 실행 오류:', error);
      }
    });
  }
}

// 이벤트 매니저 인스턴스
const eventManager = new PeermallEventManager();

// 피어몰 스토리지 서비스
export const peermallStorage = {
  // 이벤트 리스너 등록
  addEventListener(listener: PeermallStorageEventListener): () => void {
    return eventManager.addListener(listener);
  },

// 모든 피어몰 가져오기
  getAll(): Peermall[] {
    const peermalls = storage.get<Peermall[]>('PEERMALLS') || [];
    return peermalls;
  },

  // ID로 피어몰 조회
  getById(id: string): Peermall | undefined {
    if (!id) {
      console.warn('⚠️ 피어몰 ID가 제공되지 않았습니다');
      return undefined;
    }
    
    const peermalls = this.getAll();
    const found = peermalls.find((p: Peermall) => p.id === id);
    return found;
  },

  // 카테고리별 피어몰 조회
  getByCategory(category: string): Peermall[] {
    const peermalls = this.getAll();
    const filtered = peermalls.filter((p: Peermall) => p.category === category);
    return filtered;
  },

  // 인기 피어몰 조회 (좋아요, 평점, 팔로워 기준)
  getPopular(limit: number = 10): Peermall[] {
    const peermalls = this.getAll();
    return peermalls
      .filter(p => p.likes >= 5 || p.rating >= 3.5 || p.featured) // 기본 필터
      .sort((a, b) => {
        // 인기도 점수 계산
        const scoreA = (a.likes || 0) * 2 + (a.rating || 0) * 10 + (a.followers || 0);
        const scoreB = (b.likes || 0) * 2 + (b.rating || 0) * 10 + (b.followers || 0);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  },

  // 검색 기능 (향상된 버전)
  search(query: string): Peermall[] {
    if (!query.trim()) return this.getAll();
    
    const peermalls = this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return peermalls.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.owner.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  },

  // 피어몰 저장 또는 업데이트 (향상된 버전)
  save(peermallData: Omit<Peermall, 'id'> & { id?: string }): Peermall {
    try {
      const peermalls = this.getAll();
      const now = new Date().toISOString();
      
      // 데이터 검증 및 정규화
      const normalizedData = this.normalizeData(peermallData);
      
      // 새 피어몰 객체 생성
      const newPeermall: Peermall = {
        ...normalizedData,
        id: peermallData.id,
        createdAt: peermallData.createdAt || now,
        updatedAt: now
      };

      // 기존 피어몰 업데이트 또는 새로 추가
      const existingIndex = peermalls.findIndex(p => p.id === newPeermall.id);
      
      if (existingIndex >= 0) {
        // 기존 피어몰 업데이트 (createdAt 유지)
        newPeermall.createdAt = peermalls[existingIndex].createdAt;
        peermalls[existingIndex] = newPeermall;
      } else {
        // 새 피어몰 추가
        peermalls.push(newPeermall);
      }

      // 스토리지에 저장
      storage.set('PEERMALLS', peermalls);
      
      // 이벤트 발생 (비동기로 처리하여 성능 최적화)
      setTimeout(() => eventManager.notifyListeners(), 0);
      
      return newPeermall;
    } catch (error) {
      console.error('❌ 피어몰 저장 오류:', error);
      throw new Error('피어몰 저장에 실패했습니다.');
    }
  },

  // 데이터 정규화 함수
  normalizeData(data: Partial<Peermall>): Partial<Peermall> {
    return {
      title: data.title?.trim() || '새로운 피어몰',
      description: data.description?.trim() || '',
      owner: data.owner?.trim() || 'unknown',
      imageUrl: data.imageUrl || '',
      category: data.category || '기타',
      rating: Math.max(0, Math.min(5, data.rating || 0)),
      reviewCount: Math.max(0, data.reviewCount || 0),
      likes: Math.max(0, data.likes || 0),
      followers: Math.max(0, data.followers || 0),
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : [],
      featured: Boolean(data.featured),
      certified: Boolean(data.certified),
      recommended: Boolean(data.recommended),
      location: data.location || undefined,
      ...data
    };
  },

  // 좋아요 업데이트 (최적화된 버전)
  updateLikes(id: string, increment: boolean): boolean {
    try {
      const peermalls = this.getAll();
      const peermallIndex = peermalls.findIndex(p => p.id === id);
      
      if (peermallIndex === -1) {
        console.warn(`⚠️ 피어몰을 찾을 수 없습니다 (ID: ${id})`);
        return false;
      }

      const currentLikes = peermalls[peermallIndex].likes || 0;
      const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
      
      peermalls[peermallIndex] = {
        ...peermalls[peermallIndex],
        likes: newLikes,
        updatedAt: new Date().toISOString()
      };

      storage.set('PEERMALLS', peermalls);
      setTimeout(() => eventManager.notifyListeners(), 0);
      return true;
    } catch (error) {
      console.error('❌ 좋아요 업데이트 오류:', error);
      return false;
    }
  },

  // 팔로워 업데이트
  updateFollowers(id: string, increment: boolean): boolean {
    try {
      const peermalls = this.getAll();
      const peermallIndex = peermalls.findIndex(p => p.id === id);
      
      if (peermallIndex === -1) {
        console.warn(`⚠️ 피어몰을 찾을 수 없습니다 (ID: ${id})`);
        return false;
      }

      const currentFollowers = peermalls[peermallIndex].followers || 0;
      const newFollowers = increment ? currentFollowers + 1 : Math.max(0, currentFollowers - 1);
      
      peermalls[peermallIndex] = {
        ...peermalls[peermallIndex],
        followers: newFollowers,
        updatedAt: new Date().toISOString()
      };

      storage.set('PEERMALLS', peermalls);
      setTimeout(() => eventManager.notifyListeners(), 0);
      return true;
    } catch (error) {
      console.error('❌ 팔로워 업데이트 오류:', error);
      return false;
    }
  },

  // 피어몰 삭제
  delete(id: string): boolean {
    if (!id) {
      console.warn('⚠️ 삭제할 피어몰 ID가 제공되지 않았습니다');
      return false;
    }

    try {
      const peermalls = this.getAll();
      const initialLength = peermalls.length;
      const filteredPeermalls = peermalls.filter(p => p.id !== id);
      
      if (filteredPeermalls.length === initialLength) {
        console.warn(`⚠️ 삭제할 피어몰을 찾을 수 없습니다 (ID: ${id})`);
        return false;
      }

      storage.set('PEERMALLS', filteredPeermalls);
      
      // 이벤트 발생
      setTimeout(() => eventManager.notifyListeners(), 0);
      
      return true;
    } catch (error) {
      console.error('❌ 피어몰 삭제 오류:', error);
      return false;
    }
  },

  // 여러 피어몰 일괄 삭제
  deleteMultiple(ids: string[]): number {
    if (!Array.isArray(ids) || ids.length === 0) {
      console.warn('⚠️ 삭제할 피어몰 ID 배열이 비어있습니다');
      return 0;
    }

    try {
      const peermalls = this.getAll();
      const initialLength = peermalls.length;
      const filteredPeermalls = peermalls.filter(p => !ids.includes(p.id));
      const deletedCount = initialLength - filteredPeermalls.length;

      if (deletedCount > 0) {
        storage.set('PEERMALLS', filteredPeermalls);
        setTimeout(() => eventManager.notifyListeners(), 0);
      }

      return deletedCount;
    } catch (error) {
      console.error('❌ 피어몰 일괄 삭제 오류:', error);
      return 0;
    }
  },

  // 스토리지 초기화
  clear(): void {
    try {
      storage.set('PEERMALLS', []);
      setTimeout(() => eventManager.notifyListeners(), 0);
    } catch (error) {
      console.error('❌ 피어몰 스토리지 초기화 오류:', error);
    }
  },

  // 통계 정보 (향상된 버전)
  getStats(): {
    total: number;
    categories: Record<string, number>;
    averageRating: number;
    totalReviews: number;
    totalLikes: number;
    totalFollowers: number;
    popularCount: number;
    certifiedCount: number;
  } {
    const peermalls = this.getAll();
    
    const categories: Record<string, number> = {};
    let totalRating = 0;
    let totalReviews = 0;
    let totalLikes = 0;
    let totalFollowers = 0;
    let popularCount = 0;
    let certifiedCount = 0;

    peermalls.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
      totalRating += p.rating || 0;
      totalReviews += p.reviewCount || 0;
      totalLikes += p.likes || 0;
      totalFollowers += p.followers || 0;
      
      if (p.featured || (p.likes && p.likes >= 10)) popularCount++;
      if (p.certified) certifiedCount++;
    });

    return {
      total: peermalls.length,
      categories,
      averageRating: peermalls.length > 0 ? totalRating / peermalls.length : 0,
      totalReviews,
      totalLikes,
      totalFollowers,
      popularCount,
      certifiedCount
    };
  },

  // 데이터 내보내기 (백업용)
  exportData(): string {
    try {
      const peermalls = this.getAll();
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: peermalls
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('❌ 데이터 내보내기 오류:', error);
      throw new Error('데이터 내보내기에 실패했습니다.');
    }
  },

  // 데이터 가져오기 (복원용)
  importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.data || !Array.isArray(importData.data)) {
        throw new Error('잘못된 데이터 형식입니다.');
      }

      // 데이터 검증 및 정규화
      const validatedData = importData.data.map((item: any) => this.normalizeData(item));
      
      storage.set('PEERMALLS', validatedData);
      
      setTimeout(() => eventManager.notifyListeners(), 0);
      return true;
    } catch (error) {
      console.error('❌ 데이터 가져오기 오류:', error);
      return false;
    }
  }
};

// 개발 환경에서 디버깅용 전역 객체 노출
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).peermallStorage = peermallStorage;
}