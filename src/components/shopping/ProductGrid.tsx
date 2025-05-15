
import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null; // 선택적 속성으로 변경
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
  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
      : "flex flex-col gap-4"
    }>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
