
import React, { useState, useCallback } from 'react';
import Header from '@/components/CategoryNav';
import Footer from '@/components/Footer';
import CategoryNav from '@/components/CategoryNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ShoppingFilter from '@/components/shopping/ShoppingFilter';
import ProductGrid from '@/components/shopping/ProductGrid';
import PeermallGrid from '@/components/PeermallGrid';
import { ChevronRight, Filter, Grid, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Shopping = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  // 피어몰 목록 (실제로는 API에서 가져올 것)
  const peermalls = [
    {
      title: "디자인 스튜디오",
      description: "전문 그래픽 디자이너가 제공하는 고품질 디자인 서비스와 템플릿",
      owner: "김민지",
      imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80",
      category: "디자인",
      tags: ["#디자인", "#그래픽", "#템플릿"],
      rating: 4.9,
      reviewCount: 124,
      featured: true,
      location: {
        lat: 37.5665, 
        lng: 126.9780, 
        address: "서울시 중구 명동길 14"
      }
    },
    {
      title: "친환경 생활용품",
      description: "지속가능한 생활을 위한 친환경 제품과 제로웨이스트 솔루션",
      owner: "에코라이프",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      category: "리빙",
      tags: ["#라이프", "#친환경"],
      rating: 4.7,
      reviewCount: 89,
      featured: false
    },
    {
      title: "수제 베이커리",
      description: "천연 재료로 만든 건강한 빵과 디저트, 주문 제작 케이크 전문",
      owner: "달콤한숲",
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80",
      category: "푸드",
      tags: ["#푸드", "#베이커리"],
      rating: 4.8,
      reviewCount: 156,
      featured: false
    },
    {
      title: "디지털 아트 갤러리",
      description: "현대 디지털 아티스트들의 작품을 소개하고 판매하는 온라인 갤러리",
      owner: "아트스페이스",
      imageUrl: "https://images.unsplash.com/photo-1561838709-3acc98cf0d2d?auto=format&fit=crop&q=80",
      category: "아트",
      tags: ["#아트", "#디지털"],
      rating: 4.6,
      reviewCount: 73,
      featured: true
    }
  ];

  // 제품 목록 (실제로는 API에서 가져올 것)
  const products = [
    {
      id: 1,
      title: "디자인 템플릿 세트",
      description: "소셜 미디어용 디자인 템플릿 10종 세트",
      price: 29000,
      discountPrice: 19000,
      imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 120,
      peermallName: "디자인 스튜디오",
      category: "디자인",
      tags: ["#템플릿", "#디자인", "#소셜미디어"],
      isBestSeller: true,
      isNew: false,
    },
    {
      id: 2,
      title: "친환경 대나무 칫솔",
      description: "생분해성 대나무 칫솔 4개 세트",
      price: 12000,
      discountPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80",
      rating: 4.7,
      reviewCount: 85,
      peermallName: "친환경 생활용품",
      category: "리빙",
      tags: ["#친환경", "#욕실용품"],
      isBestSeller: false,
      isNew: true,
    },
    {
      id: 3,
      title: "유기농 통밀 빵",
      description: "천연 효모로 발효한 통밀 빵",
      price: 8000,
      discountPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1565181017631-8a8ebac7357f?auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewCount: 92,
      peermallName: "수제 베이커리",
      category: "푸드",
      tags: ["#유기농", "#베이커리"],
      isBestSeller: true,
      isNew: false,
    },
    {
      id: 4,
      title: "디지털 일러스트 프린트",
      description: "한정판 디지털 일러스트 아트 프린트",
      price: 45000,
      discountPrice: 36000,
      imageUrl: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?auto=format&fit=crop&q=80",
      rating: 4.5,
      reviewCount: 48,
      peermallName: "디지털 아트 갤러리",
      category: "아트",
      tags: ["#아트", "#프린트"],
      isBestSeller: false,
      isNew: true,
    },
    {
      id: 5,
      title: "명함 디자인 템플릿",
      description: "다양한 스타일의 명함 디자인 템플릿 5종",
      price: 15000,
      discountPrice: 12000,
      imageUrl: "https://images.unsplash.com/photo-1602249367848-98344e95c3a0?auto=format&fit=crop&q=80",
      rating: 4.6,
      reviewCount: 63,
      peermallName: "디자인 스튜디오",
      category: "디자인",
      tags: ["#명함", "#브랜딩"],
      isBestSeller: false,
      isNew: false,
    },
    {
      id: 6,
      title: "제로웨이스트 키트",
      description: "친환경 생활을 위한 기본 제로웨이스트 키트",
      price: 35000,
      discountPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?auto=format&fit=crop&q=80",
      rating: 4.7,
      reviewCount: 54,
      peermallName: "친환경 생활용품",
      category: "리빙",
      tags: ["#제로웨이스트", "#친환경"],
      isBestSeller: false,
      isNew: true,
    },
    {
      id: 7,
      title: "수제 쿠키 세트",
      description: "계절 과일을 활용한 수제 쿠키 12개 세트",
      price: 18000,
      discountPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1499636136210-6598fdd9c6cd?auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 112,
      peermallName: "수제 베이커리",
      category: "푸드",
      tags: ["#쿠키", "#디저트"],
      isBestSeller: true,
      isNew: false,
    },
    {
      id: 8,
      title: "추상화 캔버스",
      description: "현대적 추상화 캔버스 프린트 30x40cm",
      price: 55000,
      discountPrice: 44000,
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80",
      rating: 4.4,
      reviewCount: 37,
      peermallName: "디지털 아트 갤러리",
      category: "아트",
      tags: ["#캔버스", "#추상화"],
      isBestSeller: false,
      isNew: false,
    }
  ];

  const handleOpenMap = useCallback((location: { lat: number; lng: number; address: string; title: string }) => {
    // 맵 열기 핸들러
  }, []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-bg-100">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h1 className="text-2xl font-bold text-primary-300 mb-2">쇼핑</h1>
            <p className="text-text-200">피어몰에서 큐레이션된 다양한 제품을 만나보세요.</p>
          </div>
          
          {/* 상단 베너 및 추천 컨텐츠 */}
          <div className="relative rounded-lg overflow-hidden mb-6 h-64 bg-gradient-to-r from-primary-300 to-accent-200">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h2 className="text-3xl font-bold text-white mb-4">신규 피어몰 혜택</h2>
              <p className="text-white text-lg mb-6">첫 구매 시 20% 할인 혜택을 놓치지 마세요!</p>
              <Button className="w-fit">자세히 보기</Button>
            </div>
          </div>
          
          {/* 탭 및 필터 */}
          <div className="mb-6">
            <Tabs defaultValue="products" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <TabsList className="mb-4 sm:mb-0">
                  <TabsTrigger value="products">제품</TabsTrigger>
                  <TabsTrigger value="peermalls">피어몰</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleFilters}
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? '필터 숨기기' : '필터 보기'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-bg-200' : ''}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-bg-200' : ''}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* 필터 사이드바 */}
                {showFilters && (
                  <div className="w-full md:w-64 flex-shrink-0">
                    <ShoppingFilter />
                  </div>
                )}
                
                {/* 콘텐츠 */}
                <div className="flex-1">
                  <TabsContent value="products" className="mt-0">
                    <ProductGrid products={products} viewMode={viewMode} />
                    
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </TabsContent>
                  
                  <TabsContent value="peermalls" className="mt-0">
                    <PeermallGrid 
                      title="" 
                      malls={peermalls} 
                      viewMore={false}
                      onOpenMap={handleOpenMap}
                    />
                    
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shopping;
