import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import ProductCard from '@/components/shopping/products/ProductCard';
import { Grid2X2, List, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProductContentSectionProps {
  isOwner: boolean;
  products: Product[];
  currentView: 'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry';
  setCurrentView: (view: 'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry') => void;
  handleShowProductForm: () => void;
  onNavigateToSection?: (section: string) => void;
  showAll?: boolean;
  onDetailView?: (productId: string | number) => void;
}

const ProductContentSection: React.FC<ProductContentSectionProps> = ({
  isOwner,
  products,
  currentView,
  setCurrentView,
  handleShowProductForm,
  onNavigateToSection,
  showAll = false,
  onDetailView
}) => {
  const navigate = useNavigate();
  const { address } = useParams<{ address: string }>();

  const displayedProducts = showAll ? products : products.slice(0, 8);

  const handleProductClick = (productId: string) => {
    onDetailView?.(productId);
  };

  return (
    <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">제품</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={currentView === 'blog' ? 'bg-gray-100' : ''}
              onClick={() => setCurrentView('blog')}
            >
              <Grid2X2 className="w-4 h-4 mr-1" />
              블로그형
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={currentView === 'list' ? 'bg-gray-100' : ''}
              onClick={() => setCurrentView('list')}
            >
              <List className="w-4 h-4 mr-1" />
              리스트형
            </Button>
            {isOwner && (
              <Button variant="outline" size="sm" onClick={handleShowProductForm}>
                제품 추가
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {displayedProducts.length > 0 ? (
          <div className={currentView === 'blog' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {displayedProducts.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product.id)} className="cursor-pointer">
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price || 0)}
                  discountPrice={product.discountPrice || null}
                  imageUrl={product.imageUrl}
                  rating={product.rating || 0}
                  reviewCount={product.reviewCount || 0}
                  viewMode={currentView === 'blog' ? 'grid' : 'list'}
                  peermallName={product.peermallName}
                  peermallId={product.peermallId}
                  category={product.category}
                  tags={product.tags}
                  onDetailView={onDetailView}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">등록된 제품이 없습니다.</p>
            {isOwner && (
              <Button onClick={handleShowProductForm} className="mt-2">
                첫 제품 등록하기
              </Button>
            )}
          </div>
        )}
        
        {!showAll && products.length > 8 && onNavigateToSection && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => onNavigateToSection('content')}>
              더 보기 <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductContentSection;
