
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
  category: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

const ProductGrid = ({ products, viewMode }: ProductGridProps) => {
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

  if (products.length === 0) {
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
      {products.map((product) => (
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
