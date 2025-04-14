
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface PeermallProductsProps {
  peermall: any;
}

const PeermallProducts: React.FC<PeermallProductsProps> = ({ peermall }) => {
  const categories = ['전체', '인기', '신상', '세일', '추천'];
  
  // Simulate loading state
  const isLoading = false;
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">제품 & 서비스</h2>
          <p className="text-lg text-text-200 max-w-3xl mx-auto">
            {peermall.title}의 특별한 제품과 서비스를 만나보세요
          </p>
        </div>
        
        <Tabs defaultValue="전체" className="w-full">
          <TabsList className="mx-auto mb-8 flex justify-center">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="px-6 py-2 text-base"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  // Loading skeletons
                  Array(8).fill(0).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  // Product cards
                  peermall.products && peermall.products.length > 0 ? (
                    peermall.products.map((product: any) => (
                      <Card key={product.id} className="overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          {product.discount && (
                            <span className="absolute top-2 right-2 bg-accent-100 text-white text-xs px-2 py-1 rounded-full">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-sm text-text-200 mb-3">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-primary-300 font-semibold">
                              {product.price?.toLocaleString()} 원
                            </div>
                            <Button variant="outline" size="sm">상세보기</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-full text-center py-8 text-text-200">등록된 제품이 없습니다.</p>
                  )
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default PeermallProducts;
