import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/components/navigation/CategoryNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/shopping/ProductGrid';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import { Filter, Grid, LayoutGrid, QrCode as QrCodeIcon, ShoppingBag } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Peermall } from './Index';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import ShoppingFilter from '@/components/shopping/ShoppingFilter';
import CategoryNav from '@/components/CategoryNav';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peermallName: string; 
  peermallId?: string; 
  category: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
}

const ITEMS_PER_PAGE = 8;

const Shopping = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [peermallsData, setPeermallsData] = useState<Peermall[]>([]);
  const [productsData, setProductsData] = useState<Product[]>([]);

  const [displayedPeermalls, setDisplayedPeermalls] = useState<Peermall[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  
  const [peermallsPage, setPeermallsPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  const [hasMorePeermalls, setHasMorePeermalls] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');

  const categories = [
    { id: 'all', name: '전체', url: '/shopping' },
    { id: 'tech', name: '테크', url: '/shopping?category=tech' },
    { id: 'fashion', name: '패션', url: '/shopping?category=fashion' },
    { id: 'living', name: '리빙', url: '/shopping?category=living' },
    { id: 'food', name: '푸드', url: '/shopping?category=food' },
    { id: 'design', name: '디자인', url: '/shopping?category=design' },
    { id: 'hobby', name: '취미', url: '/shopping?category=hobby' },
  ];

  const popularTags = [
    { value: '베스트셀러', label: '베스트셀러' },
    { value: '신규', label: '신규 상품' },
    { value: '할인', label: '할인중' },
    { value: '친환경', label: '친환경' },
    { value: '수제품', label: '수제품' },
  ];

  useEffect(() => {
    try {
      const storedPeermalls = localStorage.getItem('peermalls');
      const allPeermalls = storedPeermalls ? JSON.parse(storedPeermalls) : [
        { id: 'pm1', title: "디자인 스튜디오", description: "고품질 디자인", owner: "김민지", imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80", category: "디자인", tags: ["#디자인"], rating: 4.9, reviewCount: 124, featured: true, location: { lat: 37.5665, lng: 126.9780, address: "서울시 중구" }},
        { id: 'pm2', title: "친환경 생활용품", description: "제로웨이스트", owner: "에코라이프", imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80", category: "리빙", tags: ["#친환경"], rating: 4.7, reviewCount: 89, featured: false},
        // 추가 목업 데이터
        { id: 'pm3', title: "수제 베이커리", description: "매일 신선한 빵", owner: "빵순이", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80", category: "푸드", tags: ["#베이커리"], rating: 4.8, reviewCount: 200},
        { id: 'pm4', title: "핸드메이드 액세서리", description: "세상에 하나뿐인 디자인", owner: "공예가", imageUrl: "https://images.unsplash.com/photo-1588444650733-100091305961?auto=format&fit=crop&q=80", category: "패션", tags: ["#수공예"], rating: 4.9, reviewCount: 150},
      ];
      setPeermallsData(allPeermalls);
      setDisplayedPeermalls(allPeermalls.slice(0, ITEMS_PER_PAGE));
      setHasMorePeermalls(allPeermalls.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading peermalls from localStorage:', error);
      setPeermallsData([]);
    }

    try {
      const storedProducts = localStorage.getItem('products');
      const allProducts = storedProducts ? JSON.parse(storedProducts) : [
        { id: 'prod1', title: "디자인 템플릿 세트", description: "소셜 미디어용", price: 29000, imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80", rating: 4.9, reviewCount: 120, peermallName: "디자인 스튜디오", peermallId: "pm1", category: "디자인", tags: ["#템플릿"]},
        { id: 'prod2', title: "친환경 대나무 칫솔", description: "생분해성", price: 12000, imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80", rating: 4.7, reviewCount: 85, peermallName: "친환경 생활용품", peermallId: "pm2", category: "리빙", tags: ["#친환경"]},
        // 추가 목업 데이터
        { id: 'prod3', title: "유기농 통밀빵", description: "건강한 아침", price: 8000, imageUrl: "https://images.unsplash.com/photo-1565181017631-8a8ebac7357f?auto=format&fit=crop&q=80", rating: 4.8, reviewCount: 92, peermallName: "수제 베이커리", peermallId: "pm3", category: "푸드", tags: ["#유기농"]},
        { id: 'prod4', title: "은하수 귀걸이", description: "수제 은 귀걸이", price: 25000, imageUrl: "https://images.unsplash.com/photo-1611081588019-8de899071033?auto=format&fit=crop&q=80", rating: 4.9, reviewCount: 70, peermallName: "핸드메이드 액세서리", peermallId: "pm4", category: "패션", tags: ["#액세서리"]},
      ];
      setProductsData(allProducts);
      setDisplayedProducts(allProducts.slice(0, ITEMS_PER_PAGE));
      setHasMoreProducts(allProducts.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      setProductsData([]);
    }
  }, []);

  const loadMorePeermalls = () => {
    const nextPage = peermallsPage + 1;
    const newPeermalls = peermallsData.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedPeermalls(newPeermalls);
    setPeermallsPage(nextPage);
    setHasMorePeermalls(newPeermalls.length < peermallsData.length);
  };

  const loadMoreProducts = () => {
    const nextPage = productsPage + 1;
    const newProducts = productsData.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedProducts(newProducts);
    setProductsPage(nextPage);
    setHasMoreProducts(newProducts.length < productsData.length);
  };

  const handleOpenMap = useCallback((location: { lat: number; lng: number; address: string; title: string }) => {
    console.log("Open map for:", location);
  }, []);

  const handleShowPeermallQrCode = useCallback((peermallId: string, peermallTitle: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peermallId}`);
    setQrModalTitle(`${peermallTitle} QR 코드`);
    setQrModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-100">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-200 to-accent-100 text-white">
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">피어몰 쇼핑</h1>
              <p className="text-lg mb-6 opacity-90">
                지역 피어몰에서 엄선된 제품들을 만나보세요. 수공예품부터 친환경 제품까지, 
                모든 제품은 우리 커뮤니티의 창작자들이 정성껏 만든 것입니다.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                  🔥 BEST
                </Badge>
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                  🆕 NEW
                </Badge>
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                  💸 SALE
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Category Navigation */}
          <div className="mb-6">
            <CategoryNav 
              categories={categories} 
              activeId={categories[0].id} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filter - Hidden on Mobile */}
            <div className="hidden lg:block">
              <ShoppingFilter />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="products" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <TabsList className="mb-4 sm:mb-0 bg-bg-200 p-1">
                    <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-primary-100">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      제품
                    </TabsTrigger>
                    <TabsTrigger value="peermalls" className="data-[state=active]:bg-white data-[state=active]:text-primary-100">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      피어몰
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-bg-200 text-primary-300 border-accent-100' : 'text-text-200'}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-bg-200 text-primary-300 border-accent-100' : 'text-text-200'}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    
                    {/* Mobile Filter Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 lg:hidden"
                    >
                      <Filter className="h-4 w-4" />
                      필터
                    </Button>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                {/* Popular Tags - Mobile Only */}
                <div className="lg:hidden mb-4">
                  <div className="flex overflow-x-auto gap-2 py-2 scrollbar-hide">
                    {popularTags.map(tag => (
                      <Badge key={tag.value} variant="outline" className="whitespace-nowrap">
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="w-full"> 
                  <TabsContent value="products" className="mt-0">
                    <ProductGrid products={displayedProducts} viewMode={viewMode} />
                    {hasMoreProducts && (
                      <div className="mt-8 text-center">
                        <Button onClick={loadMoreProducts}>더보기</Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="peermalls" className="mt-0">
                    <PeermallGrid 
                      title="" 
                      malls={displayedPeermalls} 
                      viewMore={false}
                      onOpenMap={handleOpenMap}
                      viewMode={viewMode}
                      onShowQrCode={handleShowPeermallQrCode}
                    />
                    {hasMorePeermalls && (
                      <div className="mt-8 text-center">
                        <Button onClick={loadMorePeermalls}>더보기</Button>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={qrCodeUrl}
        title={qrModalTitle}
      />
    </div>
  );
};

export default Shopping;
