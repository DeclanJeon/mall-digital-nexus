import { Content, ContentType } from './space';

export interface Product extends Content {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string; // 화폐 단위 추가
  discountPrice?: number | null;

  imageUrl: string; // Content의 imageUrl이 optional이지만, Product에서는 필수
  rating: number;
  reviewCount: number;
  peermallName: string;
  peermallId?: string;
  category: string; // Content의 category가 optional이지만, Product에서는 필수
  tags: string[]; // Content의 tags가 optional이지만, Product에서는 필수
  isBestSeller?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  isCertified?: boolean;
  saleUrl?: string;

  // ContentType.Product로 고정
  type: ContentType.Product;
}

export function isProduct(content: Content): content is Product {
  return (content as Product).type === ContentType.Product &&
         (content as Product).reviewCount !== undefined &&
         (content as Product).peermallName !== undefined;
}

export interface ProductCardProps {
  id: string | number;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peermallName?: string;
  peermallId?: string;
  category?: string;
  tags?: string[];
  saleUrl?: string;

  peerSpaceAddress?: string; // PeerSpace 주소 추가
  viewMode: 'grid' | 'list';
  cardSize?: 'small' | 'medium' | 'large';
  seller?: {
    id: string;
    name: string;
    image?: string;
  };
  onAddFriend?: (sellerId: string, sellerName: string, sellerImage?: string) => void;
  onDetailView?: (productId: string | number) => void;
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
}