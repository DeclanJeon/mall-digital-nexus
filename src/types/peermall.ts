// src/types/peermall.ts
export interface Peermall {
  id: string;
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  type?: string;
  feedDate?: string;
  recommended?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  lat: number;
  lng: number;
  address: string;
  createdAt: string;
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

export interface CreatePeermallSuccessData extends PeermallFormData {
  id: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
  title: string;
  owner: string;
  type: string;
}

export interface CreatePeermallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: CreatePeermallSuccessData) => void;
}

export interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  certified?: boolean;
  description?: string;
}

