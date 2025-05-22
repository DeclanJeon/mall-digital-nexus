import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '../../shopping/ProductCard';
import { Grid2X2, List } from 'lucide-react';
import { Content, PeerMallConfig } from '../types';

interface PeerSpaceContentSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  products: Content[];
  currentView: 'blog' | 'list';
  setCurrentView: (view: 'blog' | 'list') => void;
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
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">제품 & 콘텐츠</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 cursor-pointer">전체</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">전자제품</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">패션</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">생활용품</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">도서</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">음식</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">취미</Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 border-b">
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
        </div>
        
        <div className="flex items-center gap-2">
          <select className="p-2 border rounded text-sm">
            <option>최신순</option>
            <option>인기순</option>
            <option>가격 낮은순</option>
            <option>가격 높은순</option>
          </select>
          
          {isOwner && (
            <Button variant="outline" size="sm" onClick={handleShowProductForm}>
              제품 추가
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className={currentView === 'blog' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <div key={product.id}>
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
                  viewMode={currentView === 'blog' ? 'grid' : 'list'}
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
      </div>
    </div>
  );
};

export default PeerSpaceContentSection;
