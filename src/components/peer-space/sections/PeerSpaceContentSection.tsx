import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/shopping/products/ProductCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { Grid2X2, List, Grid3X3, LayoutGrid, Rows3, Eye, Filter, SlidersHorizontal } from 'lucide-react';
import { Content, PeerMallConfig } from '@/types/space';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/services/storage/productStorage';
import { Product } from '@/types/product';
import { config } from 'process';
import { productService } from '@/services/productService';
import ProductDetailComponent from '@/components/shopping/products/ProductDetailComponent';

interface PeerSpaceContentSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  products: Array<Product>;
  currentView: 'grid-small' | 'grid-medium' | 'grid-large' | 'list' | 'masonry' | 'blog';
  setCurrentView: (view: 'grid-small' | 'grid-medium' | 'grid-large' | 'list' | 'masonry' | 'blog') => void;
  handleShowProductForm: () => void;
  onDetailView: (productKey: string | number) => void;
}

const PeerSpaceContentSection: React.FC<PeerSpaceContentSectionProps> = ({
  isOwner,
  address,
  config,
  products,
  currentView,
  setCurrentView,
  handleShowProductForm,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [ searchParams ] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  // console.log("products", products)
  
  const handleProductDetailView = (productKey: string | number) => {
    navigate(`/space/${config.peerMallName}/product?mk=${peerMallKey}&pk=${productKey}`);
  };

  const categories = ['전체', '전자제품', '패션', '생활용품', '도서', '음식', '취미', '뷰티', '스포츠'];
  const viewOptions = [
    { key: 'grid-large', icon: Grid2X2, label: '큰 카드', cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
    { key: 'grid-medium', icon: Grid3X3, label: '중간 카드', cols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' },
    { key: 'grid-small', icon: LayoutGrid, label: '작은 카드', cols: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' },
    { key: 'list', icon: Rows3, label: '리스트', cols: 'space-y-4' },
    { key: 'masonry', icon: Grid2X2, label: '매거진', cols: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4' }
  ];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'price-asc', label: '가격 낮은순' },
    { value: 'price-desc', label: '가격 높은순' },
  ];

  const [detailView, setDetailView] = useState(false);

  const handleBack = () => {
    setDetailView(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Eye className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            제품 ({products.length})
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {isAuthenticated && (
            <Button
              onClick={handleShowProductForm}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              + 새 제품 등록
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> 필터
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> 정렬
          </Button> */}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-4 rounded-lg mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">카테고리</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">정렬</h4>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          {viewOptions.map((option) => (
            <Button
              key={option.key}
              variant={currentView === option.key ? 'default' : 'outline'}
              size="icon"
              className="hover:scale-105 transition-transform"
              onClick={() => {
                if (option.key === 'grid-small' || option.key === 'grid-medium' || 
                    option.key === 'grid-large' || option.key === 'list' || 
                    option.key === 'masonry' || option.key === 'blog') {
                  setCurrentView(option.key);
                }
              }}
            >
              <option.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      <div>
        {products.length > 0 ? (
          <motion.div
            layout
            className={`gap-6 ${currentView === 'list' ? 'space-y-4' : `grid ${viewOptions.find(v => v.key === currentView)?.cols}`}`}
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={`product-${product.id}-${index}`} // 더 안전한 key 생성
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className={currentView === 'masonry' ? 'break-inside-avoid mb-6' : ''}
                  layout
                >
                  {/* <ProductCard
                    productId={product.id}
                    id={product.id}
                    name={product.name}
                    owner={address}
                    description={product.description}
                    price={Number(product.price || 0)}
                    discountPrice={product.discountPrice}
                    imageUrl={product.imageUrl}
                    rating={product.rating || 4.5}
                    reviewCount={product.reviewCount || 10}
                    peerMallName={config.peerMallName}
                    peerMallKey={config.peerMallKey}
                    peerSpaceAddress={product.peerSpaceAddress}
                    category={product.category || '기타'}
                    tags={product.tags || []}
                    saleUrl={product.saleUrl} // ✨ saleUrl 전달
                    viewMode={currentView === 'list' ? 'list' : 'grid'}
                    cardSize={currentView.includes('grid') ? currentView.split('-')[1] as 'small' | 'medium' | 'large' : 'medium'}
                    onDetailView={handleProductDetailView}
                    productKey={product.productKey}
                  /> */}

                  
                  <ProductDetailComponent product={product} peerMallName={config.peerMallName} peerMallKey={config.peerMallKey} onBack={handleBack} />
                 
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-xl text-gray-500 mb-4">아직 등록된 제품이 없어요</p>
            <p className="text-gray-400 mb-6">첫 번째 멋진 제품을 등록해보세요!</p>
            {isAuthenticated && (
              <Button 
                onClick={handleShowProductForm} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-full hover:scale-105 transition-all duration-300"
              >
                ✨ 첫 제품 등록하기
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PeerSpaceContentSection;