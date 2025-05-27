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
  type: string; // 'peermall'과 같은 타입을 나타내는 필드 추가
  
  // 메타데이터
  tags?: string[];
  rating: number;
  reviewCount: number;
  likes?: number;
  followers?: number;
  featured?: boolean;
  recommended?: boolean;
  certified?: boolean;
  
  // 위치 정보
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // 타임스탬프
  createdAt: string;
  updatedAt?: string;
  
  // 추가 필드
  [key: string]: any;
}

export interface PeermallCardProps {
  id: string;
  title: string;
  owner: string;
  description: string;
  imageUrl: string;
  likes: number;
  rating: number;
  followers: number;
  tags: string[];
  isPopular?: boolean;          // 인기 피어몰
  isFamilyCertified?: boolean;  // 패밀리 멤버 인증
  isRecommended?: boolean;      // 추천 피어몰
  className?: string;
  onShowQrCode?: (id: string, title: string) => void;
  onOpenMap?: (location: { lat: number; lng: number; address: string; title: string }) => void;
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
  representativeName: string;
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
