// src/types/peermall.ts
export interface Peermall {
  // 기본 정보
  id: string;
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  phone?: string; // 전화번호 필드 추가
  type?: string; // 'peermall'과 같은 타입을 나타내는 필드 추가 (선택적)

    // 추가 설정 정보
  hashtags?: string; // 쉼표로 구분된 해시태그
  mapAddress?: string; // 피어맵 표시 주소
  
  // 메타데이터
  tags?: string[]; // 선택적
  rating?: number; // 선택적
  reviewCount?: number; // 선택적
  likes?: number; // 선택적
  followers?: number; // 선택적
  featured?: boolean; // 선택적
  recommended?: boolean; // 선택적
  certified?: boolean; // 선택적
  
  // 위치 정보
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // 타임스탬프
  createdAt?: string; // 선택적
  updatedAt?: string;
  
  // 추가 필드
  [key: string]: any;

  peerMallKey: string;
  peerMallName: string;
  peerMallAddress: string;
  ownerName: string;
}

export interface PeermallCardProps extends Peermall {
  isPopular?: boolean;          // 인기 피어몰
  isFamilyCertified?: boolean;  // 패밀리 멤버 인증
  isRecommended?: boolean;      // 추천 피어몰
  className?: string;
  onShowQrCode?: (id: string, title: string) => void;
  onOpenMap?: (location: { lat: number; lng: number; address: string; title: string }) => void;
  type?: string;
}

export interface PeermallGridProps {
  title: string;
  malls: Peermall[];
  viewMore?: boolean;
  onOpenMap: (location: { lat: number; lng: number; address: string; title: string }) => void;
  viewMode: 'grid' | 'list'; 
  onShowQrCode?: (peermallId: string, peermallTitle: string) => void; 
  isPopularSection?: boolean;
}

export interface PeermallFormData {
  address: string;
  name: string;
  description: string;
  ownerName: string;
  email: string;
  membershipType: string;
  imageUrl: string;
  hashtags: string;
  mapAddress: string;
  visibility: 'public' | 'partial' | 'private';
  requestCertification: boolean;
  referralCode: string;
}

export interface CreatePeermallSuccessData extends Peermall {}

export interface CreatePeermallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: CreatePeermallSuccessData) => void;
}

// PeerMallConfig는 이제 src/components/peer-space/types.ts에서 가져와 사용합니다.

export interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  certified?: boolean;
  description?: string;
}

export interface PeermallFilters {
  categories: string[];
  rating: number;
  status: string[];
  searchQuery: string;
  location?: any;  // Make optional
  certified?: boolean;  // Make optional
  featured?: boolean;  // Make optional
}

export interface PeermallFiltersProps {
  onFilterChange: (filters: {
    categories: string[];
    rating: number | null;
    status: string[];
    searchQuery: string;
  }) => void;
  initialFilters?: {
    categories: string[];
    rating: number | null;
    status: string[];
    searchQuery?: string;
  };
}