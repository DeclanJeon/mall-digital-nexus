import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CustomCard from '@/components/peer-space/ui/CustomCard';
import ProductCard from '@/components/shopping/products/ProductCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { 
  Grid2X2, List, Grid3X3, LayoutGrid, Rows3, Eye, Filter, 
  SlidersHorizontal, Plus, Search, Star, Download, Sparkles 
} from 'lucide-react';
import { Content, PeerMallConfig } from '@/types/space';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/services/storage/productStorage';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

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
  onDetailView,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

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

  // 필터링된 제품들
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => (Number(  a.price || 0) - Number(b.price || 0)));
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => (Number(b.price || 0) - Number(a.price || 0)));
        break;
      default: // latest
        filtered = [...filtered].sort((a, b) => 
          new Date(b.create_date).getTime() - new Date(a.create_date).getTime()
        );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleProductDetailView = (productKey: string | number) => {
    onDetailView(productKey);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 헤더 영역 - 원본 Products 스타일 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            제품 갤러리
          </h1>
          <p className="text-gray-600">
            {config.peerMallName}의 멋진 제품들을 만나보세요 ({filteredProducts.length}개)
          </p>
        </div>
        {isAuthenticated && (
          <Button 
            onClick={handleShowProductForm}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 제품 등록
          </Button>
        )}
      </div>

      {/* 검색 및 필터 영역 - 원본 Products의 CustomCard 스타일 */}
      <CustomCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 영역 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="제품명, 설명으로 검색..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 flex-wrap">
            {categories.slice(0, 5).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "transition-all duration-200",
                  selectedCategory === category && "bg-purple-500 hover:bg-purple-600"
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* 추가 필터 버튼 */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-purple-50 hover:text-purple-600"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? '필터 닫기' : '더보기'}
          </Button>
        </div>
      </CustomCard>

      {/* 확장 필터 영역 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <CustomCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 전체 카테고리 */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">카테고리</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        className={cn(
                          "cursor-pointer hover:scale-105 transition-transform",
                          selectedCategory === category && "bg-purple-500 hover:bg-purple-600"
                        )}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 정렬 옵션 */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">정렬</h4>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant={sortBy === option.value ? 'default' : 'outline'}
                        className={cn(
                          "cursor-pointer hover:scale-105 transition-transform",
                          sortBy === option.value && "bg-blue-500 hover:bg-blue-600"
                        )}
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CustomCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 뷰 옵션 및 통계 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            총 <span className="font-semibold text-purple-600">{filteredProducts.length}</span>개 제품
          </span>
          {searchQuery && (
            <Badge variant="outline" className="text-xs">
              "{searchQuery}" 검색 결과
            </Badge>
          )}
        </div>

        {/* 뷰 옵션 버튼들 */}
        <div className="flex space-x-2">
          {viewOptions.map((option) => (
            <Button
              key={option.key}
              variant={currentView === option.key ? 'default' : 'outline'}
              size="icon"
              className={cn(
                "hover:scale-105 transition-transform",
                currentView === option.key && "bg-purple-500 hover:bg-purple-600"
              )}
              onClick={() => {
                if (option.key === 'grid-small' || option.key === 'grid-medium' || 
                    option.key === 'grid-large' || option.key === 'list' || 
                    option.key === 'masonry' || option.key === 'blog') {
                  setCurrentView(option.key);
                }
              }}
              title={option.label}
            >
              <option.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* 제품 그리드 */}
      <div>
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className={cn(
              "gap-6",
              currentView === 'list' ? 'space-y-4' : `grid ${viewOptions.find(v => v.key === currentView)?.cols}`
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={`product-${product.id}-${index}`}
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
                    productId={product.id}
                    id={product.id}
                    name={product.name}
                    owner={address}
                    create_date={product.create_date}
                    productKey={product.productKey}
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
                    saleUrl={product.saleUrl}
                    viewMode={currentView === 'list' ? 'list' : 'grid'}
                    cardSize={currentView.includes('grid') ? currentView.split('-')[1] as 'small' | 'medium' | 'large' : 'medium'}
                    onDetailView={handleProductDetailView}
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
            <CustomCard className="max-w-md mx-auto">
              <div className="p-8">
                <div className="text-6xl mb-4">
                  {searchQuery || selectedCategory !== '전체' ? '🔍' : '🛍️'}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchQuery || selectedCategory !== '전체' 
                    ? '검색 결과가 없어요' 
                    : '아직 등록된 제품이 없어요'
                  }
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory !== '전체'
                    ? '다른 검색어나 카테고리를 시도해보세요'
                    : '첫 번째 멋진 제품을 등록해보세요!'
                  }
                </p>
                {/* {isAuthenticated && !searchQuery && selectedCategory === '전체' && (
                  <Button 
                    onClick={handleShowProductForm} 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 py-3 rounded-full hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    첫 제품 등록하기
                  </Button>
                )} */}
              </div>
            </CustomCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PeerSpaceContentSection;
