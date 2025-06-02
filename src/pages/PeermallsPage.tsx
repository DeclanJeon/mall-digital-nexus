import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import { Filter, Grid, LayoutGrid, Plus, Search, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import PeerMallsFilter from '@/components/features/PeerMallsFilter';
import { getAllPeerMallList } from '@/services/peerMallService';
import { Peermall, PeermallFilters } from '@/types/peermall';

const ITEMS_PER_PAGE = 12;

const PeerMallPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [filteredPeermalls, setFilteredPeermalls] = useState<Peermall[]>([]);
  const [displayedPeermalls, setDisplayedPeermalls] = useState<Peermall[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // 모달 상태
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // 필터 상태
  const [filters, setFilters] = useState<PeermallFilters>({
    searchQuery: '',
    categories: [],
    location: '',
    certified: false,
    featured: false,
    rating: null,
    status: [],
  });

  // 🎯 히어로 슬라이드 - 피어몰 중심으로 재구성
  const heroSlides = useMemo(() => [
    {
      id: 1,
      title: "나만의 피어몰을 만들어보세요! 🏪",
      description: "몇 분만에 나만의 온라인 공간을 만들고 전 세계와 연결되세요.",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80",
      color: "from-purple-600 to-pink-500",
      buttonText: "피어몰 만들기",
      action: () => setCreateModalOpen(true)
    },
    {
      id: 2,
      title: "인증된 피어몰을 만나보세요 ✨",
      description: "검증된 피어몰들과 함께 안전하고 신뢰할 수 있는 거래를 경험하세요.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80",
      color: "from-blue-600 to-teal-500",
      buttonText: "인증 피어몰 보기",
      action: () => setFilters(prev => ({ ...prev, certified: true }))
    },
    {
      id: 3,
      title: "피어맵에서 가까운 피어몰 찾기 📍",
      description: "내 주변의 피어몰들을 지도에서 확인하고 직접 방문해보세요.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
      color: "from-green-600 to-blue-500",
      buttonText: "피어맵 보기",
      action: () => navigate('/peermap')
    }
  ], [navigate]);

  // 🎯 피어몰 데이터 로드
  const loadPeermalls = useCallback(async () => {
    try {
      setIsLoading(true);
      const allPeermalls = await getAllPeerMallList();
      setPeermalls(allPeermalls);
    } catch (error) {
      console.error('피어몰 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🎯 필터링 로직 - 피어몰 전용
  const applyFilters = useMemo(() => {
    return peermalls.filter(peermall => {
      // 검색어 필터링
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = !searchLower || 
        peermall.name.toLowerCase().includes(searchLower) ||
        peermall.description.toLowerCase().includes(searchLower) ||
        peermall.ownerName.toLowerCase().includes(searchLower) ||
        (peermall.tags && peermall.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ));
      
      // 카테고리 필터링 (해시태그 기반)
      const matchesCategory = filters.categories.length === 0 || 
        (peermall.tags && filters.categories.some(cat => 
          peermall.tags!.some(tag => tag.toLowerCase().includes(cat.toLowerCase()))
        ));
      
      // 위치 필터링
      const matchesLocation = !filters.location || 
        (peermall.mapAddress && peermall.mapAddress.toLowerCase().includes(filters.location.toLowerCase()));
      
      // 인증 필터링
      const matchesCertified = !filters.certified || peermall.certified;
      
      // 추천 필터링
      const matchesFeatured = !filters.featured || peermall.featured;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesCertified && matchesFeatured;
    });
  }, [peermalls, filters]);

  // 🎯 페이지네이션 처리
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const newDisplayed = applyFilters.slice(startIndex, endIndex);
    
    setFilteredPeermalls(applyFilters);
    setDisplayedPeermalls(newDisplayed);
    setHasMore(endIndex < applyFilters.length);
  }, [applyFilters, currentPage]);

  // 🎯 더 보기 기능
  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  // 🎯 필터 변경 핸들러
  const handleFilterChange = useCallback((newFilters: PeermallFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
  }, []);

  // 🎯 QR 코드 모달
  const handleShowPeermallQrCode = useCallback((peermallId: string, peermallTitle: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peermallId}`);
    setQrModalTitle(`${peermallTitle} QR 코드`);
    setQrModalOpen(true);
  }, []);

  // 🎯 지도 열기
  const handleOpenMap = useCallback((location: { lat: number; lng: number; address: string; title: string }) => {
    navigate(`/peermap?lat=${location.lat}&lng=${location.lng}&focus=${location.title}`);
  }, [navigate]);

  // 🎯 피어몰 생성 성공 핸들러
  const handlePeermallCreated = useCallback((newPeermall: Peermall) => {
    setPeermalls(prev => [newPeermall, ...prev]);
    setCreateModalOpen(false);
  }, []);

  // 초기 로드
  useEffect(() => {
    loadPeermalls();
  }, [loadPeermalls]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎯 히어로 캐러셀 */}
      {/* <Carousel className="relative" opts={{ loop: true }}>
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[350px] md:h-[400px] lg:h-[450px] w-full overflow-hidden">
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-70`}></div>
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
                        onClick={slide.action}
                        className="bg-white text-primary-600 hover:bg-white/90 hover:text-primary-700 border-none shadow-md transition-all"
                      >
                        {slide.buttonText}
                        <Plus className="ml-2 h-4 w-4" />
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
      </Carousel> */}

      {/* 🎯 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 🎯 사이드바 필터 */}
          <div className="hidden lg:block">
            <PeerMallsFilter 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>
          
          {/* 🎯 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3">
            {/* 🎯 상단 컨트롤 바 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">피어몰 둘러보기</h2>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  {filteredPeermalls.length}개
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {/* 뷰 모드 토글 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                
                {/* 모바일 필터 버튼 */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 lg:hidden"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter className="h-4 w-4" />
                  필터
                </Button>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* 🎯 활성 필터 표시 */}
            {(filters.searchQuery || filters.categories.length > 0 || filters.location || filters.certified || filters.featured) && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">활성 필터</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFilters({
                      searchQuery: '',
                      categories: [],
                      location: '',
                      certified: false,
                      featured: false,
                      
                      rating: null,
                      status: [],
                    })}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    모두 지우기
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.searchQuery && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      검색: "{filters.searchQuery}"
                    </Badge>
                  )}
                  {filters.categories.map(cat => (
                    <Badge key={cat} variant="secondary" className="bg-purple-100 text-purple-700">
                      #{cat}
                    </Badge>
                  ))}
                  {filters.location && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <MapPin className="h-3 w-3 mr-1" />
                      {filters.location}
                    </Badge>
                  )}
                  {filters.certified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Star className="h-3 w-3 mr-1" />
                      인증됨
                    </Badge>
                  )}
                  {filters.featured && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      추천
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* 🎯 피어몰 그리드 */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">피어몰을 불러오는 중...</p>
              </div>
            ) : filteredPeermalls.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <Search className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없어요 😢</h3>
                <p className="text-gray-500 mb-6">
                  다른 키워드로 검색하거나 필터를 조정해보세요!
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      searchQuery: '',
                      categories: [],
                      location: '',
                      certified: false,
                      featured: false,
                      
                      rating: null,
                      status: [],
                    })}
                  >
                    필터 초기화
                  </Button>
                  <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    새 피어몰 만들기
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <PeermallGrid
                  title=""
                  malls={displayedPeermalls}
                  viewMode={viewMode}
                  onOpenMap={handleOpenMap}
                  onShowQrCode={handleShowPeermallQrCode}
                />
                
                {/* 더 보기 버튼 */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      className="min-w-[200px]"
                    >
                      더 많은 피어몰 보기 ({filteredPeermalls.length - displayedPeermalls.length}개 더)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🎯 모달들 */}
      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={() => setQrModalOpen(false)}
        url={qrCodeUrl}
        title={qrModalTitle}
      />

      {/* 모바일 필터 모달 */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end">
          <div className="w-4/5 bg-white h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">필터</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                  ✕
                </Button>
              </div>
              <PeerMallsFilter 
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                  setShowMobileFilters(false);
                }}
                initialFilters={filters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerMallPage;