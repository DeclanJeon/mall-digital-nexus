
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PeermallProductsProps {
  peermall: any;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(price);
};

const PeermallProducts: React.FC<PeermallProductsProps> = ({ peermall }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  // Filter products by category
  const filteredProducts = peermall.products.filter(product => {
    if (filter !== 'all' && product.category !== filter) return false;
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  
  // Get unique categories from products
  const categories = ['all', ...new Set(peermall.products.map(product => product.category))];
  
  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">제품 컬렉션</h2>
        <p className="text-lg text-text-200 max-w-3xl mx-auto">
          특별한 공간에 어울리는 다양한 프리미엄 제품들을 살펴보세요
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-bg-100">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? '전체' : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Input
            type="search"
            placeholder="제품 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="relative h-80 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.featured && (
                <span className="absolute top-4 right-4 bg-accent-200 text-white text-xs px-3 py-1 rounded-full">
                  베스트
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="flex justify-center gap-2">
                  <Button variant="secondary" size="sm" className="rounded-full">
                    <Heart className="h-4 w-4 mr-1" />
                    위시리스트
                  </Button>
                  <Button variant="default" size="sm" className="rounded-full bg-accent-200 hover:bg-accent-100">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    장바구니
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-primary-300">{product.name}</h3>
                <span className="font-bold text-accent-200">{formatPrice(product.price)}</span>
              </div>
              <p className="text-text-200 text-sm mb-3">{product.description}</p>
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag, index) => (
                  <span key={index} className="text-xs text-text-200 bg-bg-200 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-text-200">검색 결과가 없습니다.</p>
        </div>
      )}
      
      {filteredProducts.length > 0 && (
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="border-accent-200 text-accent-200 hover:bg-accent-200 hover:text-white"
          >
            더 많은 제품 보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default PeermallProducts;
