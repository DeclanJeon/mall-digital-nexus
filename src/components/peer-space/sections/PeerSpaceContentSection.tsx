import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/shopping/products/ProductCard';
import { useNavigate } from 'react-router-dom';

import { Grid2X2, List, Grid3X3, LayoutGrid, Rows3, Eye, Filter, SlidersHorizontal } from 'lucide-react';
import { Content, PeerMallConfig } from '@/types/space';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/services/storage/productStorage';
import { Product } from '@/types/product';

interface PeerSpaceContentSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  products: Array<Content | Product>;
  currentView: 'grid-small' | 'grid-medium' | 'grid-large' | 'list' | 'masonry' | 'blog';
  setCurrentView: (view: 'grid-small' | 'grid-medium' | 'grid-large' | 'list' | 'masonry' | 'blog') => void;
  handleShowProductForm: () => void;
  filteredProducts: Product[];
  onDetailView: (productId: string | number) => void;
  peerMallName: string;
  peerMallKey: string;
}

const PeerSpaceContentSection: React.FC<PeerSpaceContentSectionProps> = ({
  isOwner,
  address,
  config,
  products,
  currentView,
  setCurrentView,
  handleShowProductForm,
  filteredProducts,
  peerMallName,
  peerMallKey
}) => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  // 🔥 중복 제거 로직 완전 수정
  const validProducts = useMemo(() => {
    const loadedProducts = getProducts();
  
    console.log('🔍 디버깅 시작 - address:', address);
    console.log('🔍 전체 로드된 상품들:', loadedProducts);
    
    // 각 상품의 peerSpaceAddress 확인
    loadedProducts.forEach((product, index) => {
      console.log(`🔍 상품 ${index}:`, {
        id: product.id,
        title: product.title,
        peerSpaceAddress: product.peerSpaceAddress,
        peermallId: product.peerMallKey,
        address_match: product.peerSpaceAddress === address
      });
    });
  
    // 현재 피어스페이스 주소와 일치하는 상품만 필터링 (fallback 포함)
    const currentSpaceProducts = loadedProducts.filter(product => {
      const isValidProduct = product && product.id;
      
      // peerSpaceAddress가 있으면 그것으로 매칭
      let addressMatch = false;
      if (product.peerSpaceAddress) {
        addressMatch = product.peerSpaceAddress === address;
      } 
      // peerSpaceAddress가 없으면 peermallId로 fallback
      else if (product.peerMallKey) {
        addressMatch = product.peerMallKey === address;
      }
      // 둘 다 없으면 모든 상품 포함 (임시 - 개발 중)
      else {
        console.log('⚠️ peerSpaceAddress와 peermallId가 모두 없는 상품:', product.title);
        addressMatch = true; // 개발 중에는 true, 배포시에는 false로 변경
      }
      
      console.log(`🔍 필터링 체크 - ${product.title}:`, {
        isValidProduct,
        addressMatch,
        productAddress: product.peerSpaceAddress,
        productPeermallId: product.peerMallKey,
        targetAddress: address
      });
      
      return isValidProduct && addressMatch;
    });

    // ID 기준으로 중복 제거 - Set 방식으로 더 확실하게
    const seenIds = new Set<string>();
    const uniqueProducts = currentSpaceProducts.filter(product => {
      if (seenIds.has(product.id)) {
        console.log(`🗑️ 중복 제거: ${product.title} (ID: ${product.id})`);
        return false;
      }
      seenIds.add(product.id);
      return true;
    });
    
    console.log('🛍️ 로드된 전체 상품:', loadedProducts.length);
    console.log('🎯 현재 피어스페이스 상품:', currentSpaceProducts.length);
    console.log('✨ 중복 제거 후 상품:', uniqueProducts.length);
    console.log('📦 최종 상품 목록:', uniqueProducts);

    return uniqueProducts; // ✨ 이 return이 빠져있었음!
  }, [address]); // address 의존성 추가

  const categories = ['전체', '전자제품', '패션', '생활용품', '도서', '음식', '취미', '뷰티', '스포츠'];

  const filteredAndSortedProducts = useMemo(() => {
    return validProducts
      .filter(product => selectedCategory === '전체' || product.category === selectedCategory)
      .sort((a, b) => {
        if (sortBy === 'latest') {
          // 날짜 기준 정렬 (date 필드가 있다면)
          if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          // ID 기준 정렬 (fallback)
          if (typeof a.id === 'string' && typeof b.id === 'string') {
            return b.id.localeCompare(a.id);
          }
          return (Number(b.id) || 0) - (Number(a.id) || 0);
        } else if (sortBy === 'popular') {
          return (b.reviewCount * b.rating) - (a.reviewCount * a.rating);
        } else if (sortBy === 'price-asc') {
          return (a.price || 0) - (b.price || 0);
        } else if (sortBy === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
  }, [validProducts, selectedCategory, sortBy]);

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

  const handleProductDetailView = (productKey: string | number) => {
    debugger;
    navigate(`/space/${peerMallName}/product?mk=${peerMallKey}&pk=${productKey}`);
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
            제품 ({filteredAndSortedProducts.length})
            {/* 디버깅용 정보 표시 */}
            <span className="text-sm text-gray-400 ml-2">
              (전체: {validProducts.length})
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {isOwner && (
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
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> 정렬
          </Button>
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
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className={`gap-6 ${currentView === 'list' ? 'space-y-4' : `grid ${viewOptions.find(v => v.key === currentView)?.cols}`}`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
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
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    price={Number(product.price || 0)}
                    discountPrice={product.discountPrice}
                    imageUrl={product.imageUrl}
                    rating={product.rating || 4.5}
                    reviewCount={product.reviewCount || 10}
                    peermallName={config.title}
                    peermallId={address}
                    peerSpaceAddress={product.peerSpaceAddress}
                    category={product.category || '기타'}
                    tags={product.tags || []}
                    saleUrl={product.saleUrl} // ✨ saleUrl 전달
                    viewMode={currentView === 'list' ? 'list' : 'grid'}
                    cardSize={currentView.includes('grid') ? currentView.split('-')[1] as 'small' | 'medium' | 'large' : 'medium'}
                    onDetailView={handleProductDetailView}
                    productKey={product.productKey}
                  />
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
            {isOwner && (
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