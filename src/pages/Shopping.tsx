import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/shopping/products/ProductGrid';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import { Filter, Grid, LayoutGrid, ShoppingBag, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Peermall } from './PeerSpace';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import ShoppingFilter from '@/components/shopping/products/ShoppingFilter';
import CategoryNav from '@/components/CategoryNav';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { ContentType } from '@/types/space';
import { getProducts, saveProduct } from '@/services/storage/productStorage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { Product } from '@/types/product';
import productService from '@/services/productService';

interface ShoppingFilters {
  categories: string[];
  priceRange: number[];
  rating: number | null;
  status: string[];
  searchQuery: string;
}

const ITEMS_PER_PAGE = 8;

const Shopping = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [peermallsData, setPeermallsData] = useState<Peermall[]>([]);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ShoppingFilters>({
    categories: [],
    priceRange: [0, 100000],
    rating: 0,
    status: [],
    searchQuery: '',
  });

  const [displayedPeermalls, setDisplayedPeermalls] = useState<Peermall[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  
  const [peermallsPage, setPeermallsPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  const [hasMorePeermalls, setHasMorePeermalls] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 메모이제이션된 데이터들
  const memoizedFilters = useMemo(() => filters, [filters]);

  const heroSlides = useMemo(() => [
    {
      id: 1,
      title: "봄맞이 신상품 컬렉션",
      description: "봄을 맞아 선보이는 다양한 신상품을 만나보세요. 한정 수량으로 준비되었습니다.",
      imageUrl: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&q=80",
      color: "from-blue-600 to-purple-500",
      buttonText: "컬렉션 보기",
      buttonLink: "/shopping?category=new"
    },
    {
      id: 2,
      title: "친환경 제품 특별 할인",
      description: "지구를 생각하는 친환경 제품을 20% 할인된 가격으로 만나보세요.",
      imageUrl: "https://images.unsplash.com/photo-1605000797499-b4d3fb778b09?auto=format&fit=crop&q=80",
      color: "from-green-600 to-teal-500",
      buttonText: "할인 상품 보기",
      buttonLink: "/shopping?tag=eco"
    },
    {
      id: 3,
      title: "인기 피어몰 추천 제품",
      description: "이번 달 최고의 인기를 얻고 있는 피어몰의 베스트셀러 제품을 소개합니다.",
      imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80",
      color: "from-orange-600 to-red-500",
      buttonText: "베스트셀러 보기",
      buttonLink: "/shopping?category=popular"
    }
  ], []);

  const categories = useMemo(() => [
    { id: 'all', name: '전체', url: '/shopping' },
    { id: 'tech', name: '테크', url: '/shopping?category=tech' },
    { id: 'fashion', name: '패션', url: '/shopping?category=fashion' },
    { id: 'living', name: '리빙', url: '/shopping?category=living' },
    { id: 'food', name: '푸드', url: '/shopping?category=food' },
    { id: 'design', name: '디자인', url: '/shopping?category=design' },
    { id: 'hobby', name: '취미', url: '/shopping?category=hobby' },
  ], []);

  // 최적화된 핸들러 함수들
  const handleFilterChange = useCallback((newFilters: ShoppingFilters) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
  }, []);

  // 검색 및 필터링 로직 (searchQuery 추가)
  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      // 검색어 필터링 (제목, 설명, 태그에서 검색)
      const searchQuery = filters.searchQuery;
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      // 카테고리 필터링
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(product.category);
      
      // 가격 범위 필터링
      const [minPrice, maxPrice] = filters.priceRange;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      // 평점 필터링
      const matchesRating = !filters.rating || (product.rating && product.rating >= filters.rating);
      
      // 상태 필터링 (베스트셀러, 신규, 할인 등)
      const matchesStatus = filters.status.length === 0 || 
        (filters.status.includes('베스트셀러') && product.isBestSeller) ||
        (filters.status.includes('신규') && product.isNew) ||
        (filters.status.includes('할인') && product.discountPrice);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStatus;
    });
  }, [productsData, filters]);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const loadMorePeermalls = useCallback(() => {
    const nextPage = peermallsPage + 1;
    const newPeermalls = peermallsData.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedPeermalls(newPeermalls);
    setPeermallsPage(nextPage);
    setHasMorePeermalls(newPeermalls.length < peermallsData.length);
  }, [peermallsPage, peermallsData]);

  const loadMoreProducts = useCallback(() => {
    const nextPage = productsPage + 1;
    const newProducts = productsData.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedProducts(newProducts);
    setProductsPage(nextPage);
    setHasMoreProducts(newProducts.length < productsData.length);
  }, [productsPage, productsData]);

  const handleOpenMap = useCallback((location: { lat: number; lng: number; address: string; title: string }) => {
    console.log("Open map for:", location);
  }, []);

  const handleShowPeermallQrCode = useCallback((peermallId: string, peermallTitle: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peermallId}`);
    setQrModalTitle(`${peermallTitle} QR 코드`);
    setQrModalOpen(true);
  }, []);

  const handleMobileFilterClose = useCallback((newFilters?: ShoppingFilters) => {
    if (newFilters) {
      handleFilterChange(newFilters);
    }
    setShowMobileFilters(false);
  }, [handleFilterChange]);

  const loadProductsInfo = async () => {
    try {
      const allProducts = await productService.getAllProductList();
      setProductsData(allProducts);
      setDisplayedProducts(allProducts.slice(0, ITEMS_PER_PAGE));
      setHasMoreProducts(allProducts.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error("제품 로딩 실패:", error);
    }
  };

  useEffect(() => {
    const loadPeermalls = () => {
      try {
        const storedPeermalls = localStorage.getItem('peermalls');
        const allPeermalls = storedPeermalls ? JSON.parse(storedPeermalls) : [
          { id: 'pm1', title: "디자인 스튜디오", description: "고품질 디자인", owner: "김민지", imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80", category: "디자인", tags: ["#디자인"], rating: 4.9, reviewCount: 124, featured: true, location: { lat: 37.5665, lng: 126.9780, address: "서울시 중구" }},
          { id: 'pm2', title: "친환경 생활용품", description: "제로웨이스트", owner: "에코라이프", imageUrl: "https://images.unsplash.com/photo-1542601906990-a29f7bb81c04?auto=format&fit=crop&q=80", category: "리빙", tags: ["#친환경"], rating: 4.7, reviewCount: 89, featured: false},
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
    };

    const loadProducts = () => {
      try {
        loadProductsInfo();

      } catch (error) {
        console.error('Error loading products:', error);
        setProductsData([]);
      }
    };

    loadPeermalls();
    loadProducts();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.PRODUCTS) {
        loadProducts();
      }
      if (event.key === STORAGE_KEYS.PEERMALLS) {
        loadPeermalls();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Carousel Section */}
        <Carousel className="relative" opts={{ loop: true }}>
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[350px] md:h-[400px] lg:h-[450px] w-full overflow-hidden">
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-60`}></div>
                  </div>
                  
                  <div className="container mx-auto h-full relative z-10">
                    <div className="flex items-center h-full px-4">
                      <div className="max-w-xl text-white">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 drop-shadow-md">
                          {slide.title}
                        </h1>
                        <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90 max-w-md drop-shadow">
                          {slide.description}
                        </p>
                        <Button 
                          size="lg"
                          className="bg-white text-primary-300 hover:bg-white/90 hover:text-primary-400 border-none shadow-md transition-all"
                        >
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="container mx-auto px-4 relative">
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10" />
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {heroSlides.map((_, index) => (
              <div 
                key={index}
                className="w-2 h-2 rounded-full bg-white/50 backdrop-blur-sm"
              ></div>
            ))}
          </div>
        </Carousel>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filter - Hidden on Mobile */}
            <div className="hidden lg:block">
              <ShoppingFilter 
                onFilterChange={handleFilterChange}
                initialFilters={memoizedFilters}
              />
            </div>
            
            {/* Mobile Filter Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end">
                <div className="w-4/5 bg-white h-full overflow-y-auto p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">필터</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <ShoppingFilter 
                    onFilterChange={handleMobileFilterClose}
                    initialFilters={memoizedFilters}
                  />
                </div>
              </div>
            )}
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="products" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  {/* <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                    <TabsTrigger value="products" className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      상품
                    </TabsTrigger>
                    <TabsTrigger value="peermalls" className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4" />
                      피어몰
                    </TabsTrigger>
                  </TabsList> */}
                  
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewModeChange('grid')}
                      className={viewMode === 'grid' ? 'bg-bg-200 text-primary-300 border-accent-100' : 'text-text-200'}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewModeChange('list')}
                      className={viewMode === 'list' ? 'bg-bg-200 text-primary-300 border-accent-100' : 'text-text-200'}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 lg:hidden"
                      onClick={() => setShowMobileFilters(true)}
                    >
                      <Filter className="h-4 w-4" />
                      필터
                    </Button>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="w-full"> 
                  <TabsContent value="products" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-500">
                        총 <span className="font-medium text-purple-600">{filteredProducts.length}</span>개의 상품
                      </div>
                      {filters.searchQuery && (
                        <Badge variant="outline" className="text-xs">
                          검색: "{filters.searchQuery}"
                        </Badge>
                      )}
                    </div>
                    
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">검색 결과가 없어요 😢</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          다른 키워드로 검색하거나 필터를 조정해보세요!
                        </p>
                        <div className="mt-6">
                          <Button
                            onClick={() => {
                              setFilters({
                                categories: [],
                                priceRange: [0, 100000],
                                rating: 0,
                                status: [],
                                searchQuery: '',
                              });
                            }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            필터 초기화 🔄
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ProductGrid 
                        id="shopping-products"
                        products={filteredProducts} 
                        viewMode={viewMode} 
                        filters={memoizedFilters}
                        onDetailView={(productKey) => {
                          const product = productsData.find(p => p.productKey === productKey);
                          if (product && product.peerMallKey) {
                            navigate(`/space/${product.peerMallName}/product?mk=${product.peerMallKey}&pk=${productKey}`);
                          } else {
                            console.error('Product or peermallId not found:', productKey);
                          }
                        }}
                      />
                    )}
                    {hasMoreProducts && filteredProducts.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={loadMoreProducts}
                        className="mt-6 w-full hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        더 많은 상품 보기 ✨
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="peermalls" className="mt-0">
                    <div className="text-sm text-gray-500 mb-4">
                      총 <span className="font-medium text-purple-600">{displayedPeermalls.length}</span>개의 피어몰
                    </div>
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
                        <Button 
                          onClick={loadMorePeermalls}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                        >
                          더 많은 피어몰 보기 🏪
                        </Button>
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