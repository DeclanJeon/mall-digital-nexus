import { Content, ContentType } from './space';

export interface Product {
  productId: string; // 데이터베이스의 product_id와 매핑
  productKey: string; // 데이터베이스의 product_key와 매핑
  id: string; // 호환성 유지용
  name: string;
  title: string; // name과 중복되지만 호환성 유지용
  owner: string;
  description: string;
  price: number | string; // 데이터베이스와 일치
  currency: string; // 화폐 단위 추가
  discountPrice?: string | null; // 데이터베이스와 일치
  distributor?: string; // 데이터베이스에 추가됨
  manufacturer?: string; // 데이터베이스에 추가됨

  imageUrl: string;
  rating: number;
  reviewCount: number;
  peerMallName: string;
  peerMallKey?: string;
  category: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  isCertified?: boolean;
  saleUrl?: string;
  create_date: string; // 데이터베이스와 일치
  update_date?: string; // 데이터베이스와 일치
  type: string; // 컨텐츠 타입
  peerSpaceAddress: string; // Content 인터페이스와의 호환성
  date: string; // Content 인터페이스와의 호환성
  likes: number; // Content 인터페이스와의 호환성
  comments: number; // Content 인터페이스와의 호환성
  views: number; // Content 인터페이스와의 호환성
  saves: number; // Content 인터페이스와의 호환성
}

export function isProduct(content: Content): content is Product {
  return content.type === 'Product' &&
         content.reviewCount !== undefined;
}

export interface ProductCardProps {
  productId: string; // 데이터베이스의 product_id와 매핑
  id: string | number; // 호환성 유지용
  name: string;
  title?: string; // name과 중복되지만 호환성 유지용
  owner: string;
  description: string;
  price: number | string; // 데이터베이스와 일치
  discountPrice?: string | null; // 데이터베이스와 일치
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peerMallName?: string;
  peerMallKey?: string;
  category?: string;
  tags?: string[];
  saleUrl?: string;
  distributor?: string;
  manufacturer?: string;
  create_date: string;
  update_date?: string;
  productKey: string;

  peerSpaceAddress?: string; // PeerSpace 주소 추가
  viewMode: 'grid' | 'list';
  cardSize?: 'small' | 'medium' | 'large';
  seller?: {
    id: string;
    name: string;
    image?: string;
  };
  onAddFriend?: (sellerId: string, sellerName: string, sellerImage?: string) => void;
  onDetailView?: (productKey: string | number) => void;
}

export interface ProductGridProps {
  id: string | number;  // number도 허용
  products: Product[];
  viewMode: 'grid' | 'list';
  filters?: {
    categories?: string[];
    priceRange?: number[];
    rating?: number;
    status?: string[];
  };
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onDetailView?: (productKey: string | number) => void;
}