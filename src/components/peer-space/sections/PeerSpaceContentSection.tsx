import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '../../shopping/ProductCard';
import { Grid2X2, List, Grid3X3, LayoutGrid, Rows3, Eye, Filter, SlidersHorizontal } from 'lucide-react';
import { Content, PeerMallConfig } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PeerSpaceContentSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  products: Content[];
  currentView: 'grid-small' | 'grid-medium' | 'grid-large' | 'list' | 'masonry' | 'blog';
  setCurrentView: (view: 'grid-small' | 'grid-medium' | 'grid-large' | 'list' | 'masonry' | 'blog') => void;
  handleShowProductForm: () => void;
  filteredProducts: Content[];
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
}) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

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
    { value: 'price-low', label: '가격 낮은순' },
    { value: 'price-high', label: '가격 높은순' },
    { value: 'rating', label: '평점순' },
    { value: 'views', label: '조회순' }
  ];

  return (
    <motion.div 
      className="mb-8 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg overflow-hidden border border-gray-100/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 헤더 섹션 */}
      <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              제품 & 콘텐츠
            </h2>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-medium">
              {filteredProducts.length}개
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              필터
            </Button>
            {isOwner && (
              <Button 
                onClick={handleShowProductForm}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium gap-2"
              >
                ✨ 제품 추가
              </Button>
            )}
          </div>
        </div>
        
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                    : 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 확장 필터 섹션 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-gray-100 bg-gray-50/50"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">가격 범위</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="최소" className="flex-1 p-2 border rounded-lg text-sm" />
                    <span className="self-center text-gray-400">~</span>
                    <input type="number" placeholder="최대" className="flex-1 p-2 border rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">평점</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option>전체</option>
                    <option>⭐⭐⭐⭐⭐ 5점</option>
                    <option>⭐⭐⭐⭐ 4점 이상</option>
                    <option>⭐⭐⭐ 3점 이상</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">특별 혜택</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-red-50 hover:text-red-600">할인중</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-green-50 hover:text-green-600">무료배송</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 hover:text-blue-600">신상품</Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 뷰 옵션 & 정렬 컨트롤 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/50">
        <div className="flex items-center gap-1">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.div key={option.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 transition-all duration-200 ${
                    currentView === option.key 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentView(option.key as any)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{filteredProducts.length}개 상품</span>
          </div>
          <select 
            className="p-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 제품 그리드 */}
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <motion.div 
            className={
              currentView === 'masonry' 
                ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                : currentView === 'list'
                ? "space-y-4"
                : `grid gap-6 ${viewOptions.find(v => v.key === currentView)?.cols}`
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={currentView === 'masonry' ? 'break-inside-avoid mb-6' : ''}
              >
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price || 0)}
                  discountPrice={null}
                  imageUrl={product.imageUrl}
                  rating={4.5}
                  reviewCount={10}
                  peermallName={config.title}
                  peermallId={address}
                  category={product.category || '기타'}
                  tags={product.tags || []}
                  viewMode={currentView === 'list' ? 'list' : 'grid'}
                  cardSize={currentView.includes('grid') ? currentView.split('-')[1] as 'small' | 'medium' | 'large' : 'medium'}
                />
              </motion.div>
            ))}
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
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-full"
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