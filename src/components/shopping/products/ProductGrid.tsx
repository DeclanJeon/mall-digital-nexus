
import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Product, ProductGridProps } from '@/types/product';

const ProductGrid = ({ 
  products, 
  viewMode, 
  filters, 
  onSearchChange,
  searchQuery = '',
  onDetailView
}: ProductGridProps) => {
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
      // Fix: Check each status condition and OR them together
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
    <div className="space-y-6">
      {/* 검색 영역 (선택적) */}
      {onSearchChange && (
        <div className="relative mb-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            <input 
              type="text" 
              placeholder="제품 검색..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* 제품 그리드 */}
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
          <motion.div key={product.id} variants={item} className="h-full">
            <ProductCard
              id={product.id}
              name={product.name}
              owner={product.owner}
              description={product.description}
              price={product.price}
              discountPrice={product.discountPrice}
              imageUrl={product.imageUrl}
              rating={product.rating}
              reviewCount={product.reviewCount}
              peerMallName={product.peerMallName}
              peerMallKey={product.peerMallKey}
              category={product.category}
              tags={product.tags}
              viewMode={viewMode}
              saleUrl={product.saleUrl}
              onDetailView={onDetailView}
              productKey={product.productKey}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductGrid;
