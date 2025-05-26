import { storage } from '@/utils/storage/storage';

export interface Peermall {
  id: string;
  title: string;
  description: string;
  // 추가 필드들
  [key: string]: any;
}

// 이벤트 리스너 타입 정의
type PeermallStorageEventListener = (peermalls: Peermall[]) => void;

// 이벤트 리스너 관리 객체
const eventListeners = new Set<PeermallStorageEventListener>();

// 스토리지 키
const STORAGE_KEY = 'PEERMALLS';
// const STORAGE_KEY = 'peermall_storage';

// 이벤트 발생 함수
const notifyListeners = () => {
  const peermalls = storage.get<Peermall[]>(STORAGE_KEY) || [];

  console.log(peermalls)

  eventListeners.forEach(listener => listener(peermalls));
};

export const peermallStorage = {
  // 이벤트 리스너 등록
  addEventListener(listener: PeermallStorageEventListener): () => void {
    eventListeners.add(listener);
    // 등록 즉시 현재 상태 전달 (화살표 함수로 this 바인딩 유지)
    const currentPeermalls = this.getAll();
    listener(currentPeermalls);
    
    // 리스너 제거 함수 반환
    return () => {
      eventListeners.delete(listener);
    };
  },

  // 모든 피어몰 가져오기
  getAll(): Peermall[] {
    return storage.get<Peermall[]>(STORAGE_KEY) || [];
  },

  // ID로 피어몰 조회
  getById(id: string): Peermall | undefined {
    const peermalls = this.getAll();
    return peermalls.find(p => p.id === id);
  },

  // 피어몰 저장 또는 업데이트
  save(peermall: Omit<Peermall, 'id'> & { id?: string }): Peermall {
    const peermalls = this.getAll();
    // 필수 필드가 있는지 확인하고 기본값 설정
    const newPeermall: Peermall = {
      id: peermall.id || Date.now().toString(),
      title: peermall.title || '제목 없음',
      description: peermall.description || '설명이 없습니다.',
      ...peermall, // 기존 속성들 유지
      createdAt: peermall['createdAt'] || new Date().toISOString()
    };

    const existingIndex = peermalls.findIndex(p => p.id === newPeermall.id);
    if (existingIndex >= 0) {
      peermalls[existingIndex] = newPeermall;
    } else {
      peermalls.push(newPeermall);
    }

    storage.set(STORAGE_KEY, peermalls);
    notifyListeners(); // 변경 사항 알림
    return newPeermall as Peermall;
  },

  // 피어몰 삭제
  delete(id: string): void {
    const peermalls = this.getAll().filter(p => p.id !== id);
    storage.set(STORAGE_KEY, peermalls);
    notifyListeners(); // 변경 사항 알림
  }
};
