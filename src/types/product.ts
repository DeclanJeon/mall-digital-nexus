export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peermallName: string;
  peermallId?: string;
  category: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  isCertified?: boolean;
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