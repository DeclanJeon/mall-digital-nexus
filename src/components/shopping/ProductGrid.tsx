
import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

interface Product {
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

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  filters?: {
    categories?: string[];
    priceRange?: number[];
    rating?: number;
    status?: string[];
  };
}

const ProductGrid = ({ products, viewMode, filters }: ProductGridProps) => {
  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Return true if no filters or if product matches all active filters
    if (!filters) return true;
    
    let matchesCategory = true;
    let matchesPriceRange = true;
    let matchesRating = true;
    let matchesStatus = true;

    // Category filter
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('전체')) {
      matchesCategory = filters.categories.includes(product.category);
    }
    
    // Price range filter
    if (filters.priceRange) {
      const productPrice = product.discountPrice || product.price;
      matchesPriceRange = productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1];
    }
    
    // Rating filter
    if (filters.rating) {
      matchesRating = product.rating >= filters.rating;
    }
    
    // Status filters (bestseller, new, discount)
    if (filters.status && filters.status.length > 0) {
      // Fix: Check if there are any status filters before assuming false
      matchesStatus = filters.status.length === 0 || 
                      (filters.status.includes('베스트셀러') && product.isBestSeller) ||
                      (filters.status.includes('신규') && product.isNew) ||
                      (filters.status.includes('할인중') && !!product.discountPrice);
    }
    
    return matchesCategory && matchesPriceRange && matchesRating && matchesStatus;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl mb-4">🛒</div>
        <h3 className="text-xl font-medium text-primary-200 mb-2">제품을 찾을 수 없습니다</h3>
        <p className="text-text-200">다른 필터나 검색어를 시도해보세요</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6" 
        : "flex flex-col gap-4"
      }
    >
      {filteredProducts.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard
            {...product}
            viewMode={viewMode}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
