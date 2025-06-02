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

  // 🎯 새로 추가된 필드들
  stock?: string | number; // 재고 수량
  options?: ProductOption[]; // 상품 옵션 (색상, 사이즈 등)
  isPublic?: boolean; // 공개/비공개 설정

  // 🎯 판매자 연락처 정보
  sellerPhone?: string; // 판매자 전화번호
  sellerEmail?: string; // 판매자 이메일

  // 🎯 배송 관련 정보
  shippingInfo?: {
    freeShipping?: boolean; // 무료배송 여부
    shippingCost?: number; // 배송비
    shippingTime?: string; // 배송 소요시간
  };

  // 🎯 A/S 및 보증 정보
  warrantyInfo?: {
    warrantyPeriod?: string; // 보증 기간
    asSupport?: boolean; // A/S 지원 여부
    returnPolicy?: string; // 교환/반품 정책
  };

  // 🎯 상품 상태 정보
  condition?: 'new' | 'used' | 'refurbished'; // 상품 상태
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order'; // 재고 상태

  // 🎯 SEO 및 메타데이터
  metaTitle?: string; // SEO 제목
  metaDescription?: string; // SEO 설명
  keywords?: string[]; // 검색 키워드

  // 🎯 통계 및 분석
  salesCount?: number; // 판매 수량
  wishlistCount?: number; // 찜 수

  create_date: string; // 데이터베이스와 일치
  update_date?: string; // 데이터베이스와 일치
  type: string; // 컨텐츠 타입
  peerSpaceAddress: string; // Content 인터페이스와의 호환성
  date: string; // Content 인터페이스와의 호환성
  likes: number; // Content 인터페이스와의 호환성
  comments: number; // Content 인터페이스와의 호환성
  views: number; // Content 인터페이스와의 호환성
  saves: number; // Content 인터페이스와의 호환성
  richContent?: string; // เพิ่มบรรทัดนี้
}

// 🎯 상품 옵션 인터페이스
export interface ProductOption {
  name: string; // 옵션명 (예: "색상", "사이즈")
  values: string[]; // 옵션값들 (예: ["빨강", "파랑", "검정"])
  required?: boolean; // 필수 선택 여부
  additionalPrice?: number; // 추가 가격
}

// 🎯 상품 리뷰 인터페이스
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 별점
  title?: string;
  content: string;
  images?: string[]; // 리뷰 이미지들
  isVerifiedPurchase: boolean; // 구매 확인된 리뷰
  helpfulCount: number; // 도움됨 수
  createdAt: string;
  updatedAt?: string;
}

// 🎯 상품 Q&A 인터페이스
export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  answer?: string;
  questioner: {
    id: string;
    name: string;
    avatar?: string;
  };
  answerer?: {
    id: string;
    name: string;
    avatar?: string;
    isSeller: boolean;
  };
  isAnswered: boolean;
  isPublic: boolean;
  createdAt: string;
  answeredAt?: string;
}

// 🎯 상품 카테고리 인터페이스
export interface ProductCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | number;
  children?: ProductCategory[];
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

// 🎯 상품 필터 옵션
export interface ProductFilters {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  status?: ('new' | 'bestseller' | 'recommended' | 'certified')[];
  availability?: ('in_stock' | 'out_of_stock' | 'pre_order')[];
  condition?: ('new' | 'used' | 'refurbished')[];
  brands?: string[]; // 제조사/브랜드
  tags?: string[];
  freeShipping?: boolean;
  sortBy?:
    | 'newest'
    | 'oldest'
    | 'price_low'
    | 'price_high'
    | 'rating'
    | 'popular'
    | 'sales';
}

// 🎯 상품 검색 결과
export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: ProductFilters;
  suggestions?: string[]; // 검색어 제안
}

export function isProduct(content: Content): content is Product {
  return content.type === 'Product' && content.reviewCount !== undefined;
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

  // 🎯 새로 추가된 props
  stock?: string | number;
  options?: ProductOption[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isRecommended?: boolean;
  isCertified?: boolean;
  condition?: 'new' | 'used' | 'refurbished';
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
  salesCount?: number;
  wishlistCount?: number;

  peerSpaceAddress?: string; // PeerSpace 주소 추가
  viewMode: 'grid' | 'list';
  cardSize?: 'small' | 'medium' | 'large';
  seller?: {
    id: string;
    name: string;
    image?: string;
    phone?: string; // 🎯 판매자 연락처
    email?: string;
    rating?: number; // 🎯 판매자 평점
    responseTime?: string; // 🎯 응답 시간
    isOnline?: boolean; // 🎯 온라인 상태
  };
  onAddFriend?: (
    sellerId: string,
    sellerName: string,
    sellerImage?: string
  ) => void;
  onDetailView?: (productKey: string | number) => void;
  onWishlist?: (productId: string) => void; // 🎯 찜하기 기능
  onQuickView?: (productId: string) => void; // 🎯 빠른보기 기능
  onCompare?: (productId: string) => void; // 🎯 상품 비교 기능
}

export interface ProductGridProps {
  id: string | number; // number도 허용
  products: Product[];
  viewMode: 'grid' | 'list';
  filters?: ProductFilters; // 🎯 개선된 필터 타입 사용
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onDetailView?: (productKey: string | number) => void;
  onFilterChange?: (filters: ProductFilters) => void; // 🎯 필터 변경 핸들러
  onSortChange?: (sortBy: ProductFilters['sortBy']) => void; // 🎯 정렬 변경 핸들러
  loading?: boolean; // 🎯 로딩 상태
  error?: string; // 🎯 에러 상태
  emptyMessage?: string; // 🎯 빈 상태 메시지
}

export interface ProductDetailComponentProps {
  product: Product;
  peerMallName: string;
  peerMallKey: string;
  onBack: () => void;
  isOwner?: boolean;

  // 🎯 새로 추가된 props
  reviews?: ProductReview[]; // 🎯 상품 리뷰
  qnaList?: ProductQA[]; // 🎯 Q&A 목록
  relatedProducts?: Product[]; // 🎯 관련 상품
  onReviewSubmit?: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  onQASubmit?: (question: string) => void;
  onWishlist?: (productId: string) => void;
  onShare?: (productId: string) => void;
  onCall?: () => void; // 🎯 통화 기능
  onChat?: () => void; // 🎯 채팅 기능
}

// 🎯 상품 등록/수정 폼 데이터
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  discountPrice?: number;
  imageUrl: string;
  category: string;
  tags: string[];
  stock?: number;
  options?: ProductOption[];
  distributor?: string;
  manufacturer?: string;
  saleUrl?: string;
  condition: 'new' | 'used' | 'refurbished';
  isPublic: boolean;
  shippingInfo?: {
    freeShipping: boolean;
    shippingCost?: number;
    shippingTime?: string;
  };
  warrantyInfo?: {
    warrantyPeriod?: string;
    asSupport: boolean;
    returnPolicy?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// 🎯 장바구니 아이템
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: { [optionName: string]: string };
  addedAt: string;
  totalPrice: number;
}

// 🎯 주문 정보
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
  paymentMethod: 'card' | 'bank_transfer' | 'virtual_account' | 'mobile';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
}

// 🎯 상품 통계
export interface ProductStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  topCategories: { category: string; count: number }[];
  recentOrders: Order[];
  popularProducts: Product[];
}
