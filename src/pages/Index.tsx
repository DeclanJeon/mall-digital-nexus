import React, { useState, useCallback, useEffect } from 'react';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import HashtagFilter, { HashtagFilterOption, PeermallType } from '@/components/navigation/HashtagFilter';
import FavoriteServicesSection from '@/components/feature-sections/FavoriteServicesSection';
import EcosystemMap from '@/components/EcosystemMap';
import CommunityHighlights from '@/components/CommunityHighlights';
import CreatePeermall from '@/components/peermall-features/CreatePeermall';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import { ChevronRight, TrendingUp, Sparkles, Map, Users, Heart, Star, Phone, MessageSquare, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Peermall } from '@/types/peermall';
import { PeermallDetailDialog } from '@/components/peermall-features/PeermallDetailDialog';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

// 🎨 인지 과학 기반 디자인 토큰
const designTokens = {
  // 색상 시스템 - 시각적 팝아웃과 인지 부하 최소화
  colors: {
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9', 
      200: '#e2e8f0',
      300: '#cbd5e1',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      900: '#0f172a'
    },
    accent: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    }
  },
  // 타이포그래피 - 인지적 계층 구조
  typography: {
    hero: 'text-3xl font-bold tracking-tight',
    heading: 'text-xl font-semibold',
    subheading: 'text-lg font-medium',
    body: 'text-sm',
    caption: 'text-xs text-gray-500'
  },
  // 공간 시스템 - 시각적 그룹화와 인지 부하 관리
  spacing: {
    section: 'mb-12',
    card: 'p-6',
    cardGap: 'gap-6',
    element: 'mb-4'
  },
  // 그림자와 깊이 - 시각적 계층 구조
  elevation: {
    card: 'shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200',
    feature: 'shadow-lg border-0',
    interactive: 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200'
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    const loadFromLocalStorage = () => {
      try {
        const storedPeermalls = localStorage.getItem('peermalls');

        console.log(storedPeermalls)

        if (storedPeermalls) {
          const peermallsFromStorage: Peermall[] = JSON.parse(storedPeermalls);
          setPeermalls(peermallsFromStorage);
          setMySpaces(peermallsFromStorage.filter((mall: Peermall) => mall.owner === '나'));
        } else {
          setPeermalls([]);
          setMySpaces([]);
        }
      } catch (error) {
        console.error("Error loading peermalls:", error);
        setPeermalls([]);
        setMySpaces([]);
      }
    };
    loadFromLocalStorage();
  }, []);

  const handleCreatePeermall = (newMallData: Omit<Peermall, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPeermallWithDefaults: Peermall = {
      // 기본값 설정
      title: newMallData.title || '새로운 피어몰',
      description: newMallData.description || '',
      owner: newMallData.owner || '나',
      imageUrl: newMallData.imageUrl || '/placeholder.svg',
      category: newMallData.category || '기타',
      rating: 0,
      reviewCount: 0,
      // 기존 값 유지
      ...newMallData,
      // ID와 타임스탬프 설정
      id: `pm-${Date.now().toString()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now
    };
    
    setPeermalls(prevMalls => {
      const updatedMalls = [newPeermallWithDefaults, ...prevMalls];
      try {
        localStorage.setItem('peermalls', JSON.stringify(updatedMalls));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      if (newPeermallWithDefaults.owner === '나') {
        setMySpaces(prevMySpaces => [newPeermallWithDefaults, ...prevMySpaces]);
      }
      return updatedMalls;
    });
  };

  const hashtagOptions: HashtagFilterOption[] = [
    { label: '전체', value: '전체' },
    { label: '#디자인', value: '#디자인' },
    { label: '#푸드', value: '#푸드' },
    { label: '#패션', value: '#패션' },
    { label: '#테크', value: '#테크' },
    { label: '#아트', value: '#아트' },
    { label: '#라이프', value: '#라이프' },
    { label: '#취미', value: '#취미' },
    { label: '#여행', value: '#여행' },
  ];

  const [filteredMalls, setFilteredMalls] = useState<Peermall[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPeermall, setSelectedPeermall] = useState<Peermall | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // Handle location selection from map
  const handleLocationSelect = useCallback((location: any) => {
    // Find the corresponding peermall
    const peermall = peermalls.find(
      p => p.location?.lat === location.lat && p.location?.lng === location.lng
    );
    
    if (peermall) {
      setSelectedPeermall(peermall);
      setIsDetailViewOpen(true);
    }
  }, [peermalls]);

  // Close detail view
  const closeDetailView = useCallback(() => {
    setIsDetailViewOpen(false);
    setSelectedPeermall(null);
  }, []);

  useEffect(() => {
    setFilteredMalls(peermalls);
  }, [peermalls]);

  const allLocations = peermalls
    .filter(mall => mall.location)
    .map(mall => ({
      lat: mall.location!.lat,
      lng: mall.location!.lng,
      address: mall.location!.address,
      title: mall.title
    }));

  const handleFilterChange = useCallback((selectedHashtags: string[], selectedTypes: PeermallType[]) => {
    if ((selectedHashtags.length === 0 || selectedHashtags.includes('전체')) && 
        (selectedTypes.length === 0 || selectedTypes.includes('all'))) {
      setFilteredMalls(peermalls);
      return;
    }
    
    let filtered = [...peermalls];
    
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
      filtered = filtered.filter(mall => selectedTypes.includes(mall.type as PeermallType));
    }
    
    if (selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) {
      filtered = filtered.filter(mall => 
        mall.tags && mall.tags.some(tag => selectedHashtags.includes(tag))
      );
    }
    
    setFilteredMalls(filtered);
  }, [peermalls]);

  const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleCloseMap = useCallback(() => setIsMapOpen(false), []);
  const handleOpenMySpaces = () => setIsMySpacesOpen(true);
  const handleCloseMySpaces = () => setIsMySpacesOpen(false);

  const handleSelectSpace = (id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  };

  const handleShowPeermallQrCode = useCallback((peermallId: string, peermallTitle: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peermallId}`);
    setQrModalTitle(`${peermallTitle} QR 코드`);
    setQrModalOpen(true);
  }, []);

  const POPULAR_MALL_COUNT = 4;
  const NEWEST_MALL_COUNT = 4;

  const popularMalls = [...filteredMalls]
    .sort((a, b) =>
      (b.rating || 0) - (a.rating || 0) ||
      (b.reviewCount || 0) - (a.reviewCount || 0)
    )
    .slice(0, POPULAR_MALL_COUNT);

  const newestMalls = [...filteredMalls]
    .sort((a, b) =>
      (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
      (a.createdAt ? new Date(a.createdAt).getTime() : 0)
    )
    .slice(0, NEWEST_MALL_COUNT);

  // 🎯 통계 데이터 계산 - 사용자의 성취감과 참여도 향상
  const stats = {
    totalMalls: peermalls.length,
    myMalls: mySpaces.length,
    totalRating: peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0),
    avgRating: peermalls.length > 0 ? (peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0) / peermalls.length).toFixed(1) : '0.0'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

      <main className="px-4 py-8">
        {/* 🌟 즐겨찾기 서비스 섹션 - 개인화된 경험 */}
        {isLoggedIn && (
          <section className={`${designTokens.spacing.section}`}>
            <Card className={`${designTokens.elevation.card} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100`}>
              <CardContent className={designTokens.spacing.card}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h2 className={`${designTokens.typography.heading} text-gray-900`}>
                      나만의 즐겨찾기
                    </h2>
                  </div>
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    개인화됨
                  </Badge>
                </div>
                <FavoriteServicesSection />
              </CardContent>
            </Card>
          </section>
        )}

        {/* 🎛️ 필터링 시스템 - 인지 부하 최소화 */}
        <section className={`${designTokens.spacing.section}`}>
          <Card className={designTokens.elevation.card}>
            <CardContent className={designTokens.spacing.card}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h2 className={`${designTokens.typography.heading} text-gray-900`}>
                  카테고리 필터
                </h2>
              </div>
              <HashtagFilter
                hashtags={hashtagOptions}
                onFilterChange={handleFilterChange}
              />
            </CardContent>
          </Card>
        </section>

        {/* ✨ 피어몰 생성 CTA - 명확한 어포던스 */}
        <section className={`${designTokens.spacing.section}`}>
          <CreatePeermall />
        </section>

        {/* 📊 메인 콘텐츠 그리드 - 정보 아키텍처 최적화 */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* 🏪 피어몰 메인 리스트 (3/4 너비) */}
          <div className="lg:col-span-3 space-y-8">
            {/* 🔥 인기 피어몰 섹션 */}
            <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-orange-50 to-red-50`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className={`${designTokens.typography.heading} text-gray-900`}>
                        🔥 인기 피어몰
                      </h2>
                      <p className={`${designTokens.typography.caption} mt-1`}>
                        가장 많은 사랑을 받는 피어몰들
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {/* {popularMalls.length}개 */}
                    </Badge>
                    {popularMalls.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        더 보기 <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {popularMalls.length > 0 ? (
                  <PeermallGrid
                    title=""
                    malls={popularMalls}
                    onOpenMap={handleOpenMap}
                    viewMore={false}
                    viewMode="grid"
                    onShowQrCode={handleShowPeermallQrCode}
                    isPopularSection={true}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className={`${designTokens.typography.subheading} text-gray-700 mb-2`}>
                      아직 인기 피어몰이 없어요
                    </h3>
                    <p className={designTokens.typography.caption}>
                      첫 번째 피어몰을 만들어 인기 순위에 도전해보세요! 🚀
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ✨ 신규 피어몰 섹션 */}
            
          </div>

          {/* 🗺️ 사이드바 - 보조 정보 및 도구 (1/3 너비) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 피어맵 */}
            <Card className={`${designTokens.elevation.card} bg-gradient-to-br from-blue-50 to-cyan-50 h-full`}>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  <h2 className={`${designTokens.typography.subheading} text-gray-900`}>
                    피어맵
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full w-full">
                <div className="h-full overflow-hidden rounded-b-lg">
                  <EcosystemMap onLocationSelect={handleLocationSelect} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="lg:col-span-3 space-y-8">
          <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-green-50 to-emerald-50`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className={`${designTokens.typography.heading} text-gray-900`}>
                        ✨ 신규 피어몰
                      </h2>
                      <p className={`${designTokens.typography.caption} mt-1`}>
                        따끈따끈한 새로운 피어몰들
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {/* {newestMalls.length}개 */}
                    </Badge>
                    {newestMalls.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        더 보기 <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {newestMalls.length > 0 ? (
                  <PeermallGrid
                    title=""
                    malls={newestMalls}
                    onOpenMap={handleOpenMap}
                    viewMore={false}
                    viewMode="grid"
                    onShowQrCode={handleShowPeermallQrCode}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className={`${designTokens.typography.subheading} text-gray-700 mb-2`}>
                      새로운 피어몰을 기다리고 있어요
                    </h3>
                    <p className={designTokens.typography.caption}>
                      지금 바로 피어몰을 만들어 첫 번째 신규 피어몰이 되어보세요! ✨
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>

        {/* 🎪 커뮤니티 하이라이트 */}
        {/* <section className={designTokens.spacing.section}>
          <Card className={`${designTokens.elevation.card} bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50`}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <h2 className={`${designTokens.typography.hero} text-gray-900`}>
                  🎪 커뮤니티 하이라이트
                </h2>
              </div>
              <p className={`${designTokens.typography.caption} mt-2`}>
                피어몰 커뮤니티의 생생한 소식과 이야기들
              </p>
            </CardHeader>
            <CardContent>
              <CommunityHighlights />
            </CardContent>
          </Card>
        </section> */}
      </main>

      {/* 🗺️ 지도 모달 */}
      {/* <PeermallMap 
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        selectedLocation={selectedLocation}
        allLocations={allLocations}
      /> */}

      {/* 📱 내 스페이스 다이얼로그 - 개선된 UI */}
      <Dialog open={isMySpacesOpen} onOpenChange={handleCloseMySpaces}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>내 스페이스</span>
              <Badge variant="secondary">{mySpaces.length}개</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mySpaces.length > 0 ? (
              mySpaces.map((space) => (
                <Card
                  key={space.id}
                  className={`${designTokens.elevation.interactive} cursor-pointer`}
                  onClick={() => handleSelectSpace(space.id!)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl overflow-hidden flex-shrink-0">
                        {space.imageUrl ? (
                          <img
                            src={space.imageUrl}
                            alt={space.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-600 text-xl">
                            🏪
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`${designTokens.typography.subheading} text-gray-900 truncate`}>
                          {space.title}
                        </h3>
                        <p className={`${designTokens.typography.caption} truncate`}>
                          {space.type || '피어몰'} • {space.category || '카테고리 없음'}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            ⭐ {space.rating?.toFixed(1) || '0.0'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            💬 {space.reviewCount || 0}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className={`${designTokens.typography.subheading} text-gray-700 mb-2`}>
                  생성된 피어몰이 없습니다
                </h3>
                <p className={`${designTokens.typography.caption} mb-4`}>
                  새로운 피어몰을 만들어 여정을 시작해보세요! 🎯
                </p>
                <Button 
                  onClick={handleCloseMySpaces}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  피어몰 만들기
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* <PeermallDetailDialog 
        isOpen={isDetailViewOpen}
        onOpenChange={closeDetailView}
        selectedPeermall={selectedPeermall}
      /> */}

      {/* 📱 QR 코드 모달 */}
      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={qrCodeUrl}
        title={qrModalTitle}
      />
    </div>
  );
};

export default Index;