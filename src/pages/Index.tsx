import React, { useState, useCallback, useEffect } from 'react';
import { BookmarkItem } from '@/components/navigation/SearchAndFilterBar';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import HashtagFilter, { HashtagFilterOption, PeermallType } from '@/components/navigation/HashtagFilter';
import FavoriteServicesSection from '@/components/feature-sections/FavoriteServicesSection';
import EcosystemMap from '@/components/EcosystemMap';
import CommunityHighlights from '@/components/CommunityHighlights';
import CreatePeermall from '@/components/peermall-features/CreatePeermall';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import { ChevronRight, TrendingUp, Sparkles, Map, Users, Heart, Star, Phone, MessageSquare, Navigation, RefreshCw, Filter, Grid, List, Store, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { peermallStorage, Peermall } from '@/services/storage/peermallStorage';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SearchAndFilterBar from '@/components/navigation/SearchAndFilterBar';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

// 🎨 프리미엄 디자인 토큰 - Z세대 감성 + 미래지향적
const designTokens = {
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
    },
    // 🌈 Z세대 감성 그라디언트
    gradients: {
      fire: 'from-orange-500 via-red-500 to-pink-600',
      ocean: 'from-blue-500 via-cyan-500 to-teal-600',
      forest: 'from-green-400 via-emerald-500 to-teal-600',
      sunset: 'from-purple-500 via-pink-500 to-rose-600',
      galaxy: 'from-indigo-600 via-purple-600 to-pink-600',
      slate: 'from-slate-500 via-gray-600 to-zinc-700'
    }
  },
  typography: {
    hero: 'text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent',
    heading: 'text-xl font-semibold text-gray-900',
    subheading: 'text-lg font-medium text-gray-800',
    body: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500'
  },
  spacing: {
    section: 'mb-12',
    card: 'p-6',
    cardGap: 'gap-6',
    element: 'mb-4'
  },
  elevation: {
    card: 'shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300',
    feature: 'shadow-lg border-0 backdrop-blur-sm',
    interactive: 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out',
    glass: 'backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl'
  },
  animations: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" }
    },
    slideIn: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }
};

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 🎯 상태 관리 - 단순화 및 최적화
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [filteredMalls, setFilteredMalls] = useState<Peermall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['전체']);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // 여기에 검색 로직 추가
    console.log('검색어 변경:', query);
  }, []);

  const handleBookmarkToggle = useCallback((itemId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(bookmark => bookmark.id === itemId);
      if (isBookmarked) {
        return prev.filter(bookmark => bookmark.id !== itemId);
      } else {
        // 여기서는 예시로 북마크 아이템을 생성합니다. 실제로는 해당 아이템의 정보를 가져와야 합니다.
        const newBookmark: BookmarkItem = {
          id: itemId,
          title: `북마크 ${itemId}`,
          description: '설명이 들어갑니다.',
          addedAt: new Date()
        };
        return [...prev, newBookmark];
      }
    });
  }, []);

  const handleBookmarkRemove = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    console.log('북마크 제거:', id);
  }, []);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);

  // 🚀 스토리지 연동 및 실시간 업데이트
  useEffect(() => {
    // 로그인 상태 확인
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    // 초기 데이터 로드
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 초기 데이터 로드 시작...');
        
        // 스토리지에서 피어몰 데이터 가져오기
        const storedPeermalls = peermallStorage.getAll();
        console.log('📦 스토리지에서 로드된 피어몰:', storedPeermalls.length, '개');
        
        setPeermalls(storedPeermalls);
        setFilteredMalls(storedPeermalls);
        
        // 내 스페이스 필터링
        const myOwnedSpaces = storedPeermalls.filter(mall => mall.owner === '나');
        setMySpaces(myOwnedSpaces);
        
        console.log('✅ 초기 데이터 로드 완료');
      } catch (error) {
        console.error('❌ 초기 데이터 로드 오류:', error);
        toast({
          variant: "destructive",
          title: "데이터 로드 오류",
          description: "피어몰 데이터를 불러오는 중 오류가 발생했습니다."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();

    // 스토리지 변경 이벤트 리스너 등록
    const removeListener = peermallStorage.addEventListener((updatedPeermalls) => {
      console.log('🔔 스토리지 업데이트 감지:', updatedPeermalls.length, '개');
      
      setPeermalls(updatedPeermalls);
      setFilteredMalls(updatedPeermalls);
      
      // 내 스페이스 업데이트
      const myOwnedSpaces = updatedPeermalls.filter(mall => mall.owner === '나');
      setMySpaces(myOwnedSpaces);
    });

    // 클린업
    return () => {
      removeListener?.();
    };
  }, [toast]);

  // 🎨 피어몰 생성 핸들러 - 새로운 스토리지 시스템 사용
  const handleCreatePeermall = useCallback((newMallData: Omit<Peermall, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🆕 새 피어몰 생성 시작:', newMallData.title);
      
      // 스토리지에 저장 (자동으로 ID와 타임스탬프 생성됨)
      const savedPeermall = peermallStorage.save({
        ...newMallData,
        rating: 0,
        reviewCount: 0,
        likes: 0,
        followers: 0
      });
      
      console.log('✅ 피어몰 생성 완료:', savedPeermall.id);
      
      // 성공 토스트
      toast({
        title: "🎉 피어몰 생성 완료!",
        description: `${savedPeermall.title}이(가) 성공적으로 생성되었습니다.`,
      });
      
      // 필요시 상세 페이지로 이동
      // navigate(`/peerspace/${savedPeermall.id}`);
      
    } catch (error) {
      console.error('❌ 피어몰 생성 오류:', error);
      toast({
        variant: "destructive",
        title: "생성 실패",
        description: "피어몰 생성 중 오류가 발생했습니다."
      });
    }
  }, [toast]);

  // 🔍 필터링 로직 - 향상된 검색 기능
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

  const peermallTypeOptions: { label: string; value: PeermallType }[] = [
    { label: '모두', value: 'all' },
    { label: '인기', value: 'trending' },
    { label: '최신', value: 'recent' },
    { label: '추천', value: 'recommended' },
  ];

  const handleFilterChange = useCallback((selectedHashtags: string[], selectedTypes: PeermallType[]) => {
    console.log('🔍 필터 변경:', { selectedHashtags, selectedTypes });
    
    if ((selectedHashtags.length === 0 || selectedHashtags.includes('전체')) && 
        (selectedTypes.length === 0 || selectedTypes.includes('all'))) {
      setFilteredMalls(peermalls);
      return;
    }
    
    let filtered = [...peermalls];
    
    // 타입 필터링
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
      filtered = filtered.filter(mall => selectedTypes.includes(mall.type as PeermallType));
    }
    
    // 해시태그 필터링
    if (selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) {
      filtered = filtered.filter(mall => 
        mall.tags && mall.tags.some(tag => selectedHashtags.includes(tag))
      );
    }
    
    setFilteredMalls(filtered);
    console.log('✅ 필터링 완료:', filtered.length, '개');
  }, [peermalls]);

    const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleCloseMap = useCallback(() => setIsMapOpen(false), []);

  // 📱 내 스페이스 관련 핸들러
  const handleOpenMySpaces = useCallback(() => setIsMySpacesOpen(true), []);
  const handleCloseMySpaces = useCallback(() => setIsMySpacesOpen(false), []);

  const handleSelectSpace = useCallback((id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  }, [navigate, handleCloseMySpaces]);

  // 📱 QR 코드 핸들러
  const handleShowPeermallQrCode = useCallback((peermallId: string, peermallTitle: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peermallId}`);
    setQrModalTitle(`${peermallTitle} QR 코드`);
    setQrModalOpen(true);
  }, []);

  // 🔄 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('🔄 데이터 새로고침 시작...');
      
      // 스토리지에서 최신 데이터 다시 로드
      const refreshedPeermalls = peermallStorage.getAll();
      setPeermalls(refreshedPeermalls);
      setFilteredMalls(refreshedPeermalls);
      
      const myOwnedSpaces = refreshedPeermalls.filter(mall => mall.owner === '나');
      setMySpaces(myOwnedSpaces);
      
      toast({
        title: "✅ 새로고침 완료",
        description: "최신 데이터로 업데이트되었습니다."
      });
      
      console.log('✅ 데이터 새로고침 완료');
    } catch (error) {
      console.error('❌ 새로고침 오류:', error);
      toast({
        variant: "destructive",
        title: "새로고침 실패",
        description: "데이터 새로고침 중 오류가 발생했습니다."
      });
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  // 📊 통계 및 데이터 계산
  const stats = {
    totalMalls: peermalls.length,
    myMalls: mySpaces.length,
    totalRating: peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0),
    avgRating: peermalls.length > 0 ? (Number(peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0) / peermalls.length)).toFixed(1) : '0.0',
    totalLikes: peermalls.reduce((sum, mall) => sum + (mall.likes || 0), 0),
    totalFollowers: peermalls.reduce((sum, mall) => sum + (mall.followers || 0), 0)
  };

  // 🔥 인기 피어몰 계산 (스토리지 내장 함수 사용)
  const popularMalls = peermallStorage.getPopular(4);
  
  // ✨ 신규 피어몰 계산
  const newestMalls = [...filteredMalls]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 4);

  // 🗺️ 지도용 위치 데이터
  const allLocations = peermalls
    .filter(mall => mall.location)
    .map(mall => ({
      lat: mall.location!.lat,
      lng: mall.location!.lng,
      address: mall.location!.address,
      title: mall.title
    }));
  
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


  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <motion.div
          className="text-center"
          {...designTokens.animations.scaleIn}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse mx-auto" />
          </div>
          <h2 className={designTokens.typography.heading}>피어몰 로딩 중...</h2>
          <p className={designTokens.typography.caption}>잠시만 기다려주세요 ✨</p>
        </motion.div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <main className="px-4 py-8">
        {/* 🌟 즐겨찾기 서비스 섹션 */}
        {isLoggedIn && (
          <motion.section 
            className={designTokens.spacing.section}
            {...designTokens.animations.slideIn}
          >
            <Card className={`${designTokens.elevation.feature} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100`}>
              <CardContent className={designTokens.spacing.card}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h2 className={designTokens.typography.heading}>
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
          </motion.section>
        )}

        <motion.section 
          className="mb-8"
          {...designTokens.animations.fadeIn}
        >
          <SearchAndFilterBar
            hashtags={hashtagOptions}
            peermallTypeOptions={peermallTypeOptions}
            bookmarks={bookmarks}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onBookmarkToggle={handleBookmarkToggle}
            onBookmarkRemove={handleBookmarkRemove}
          />
        </motion.section>

        {/* 📊 메인 콘텐츠 그리드 */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          
          {/* 🏪 피어몰 메인 리스트 */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* ✨ 신규 피어몰 섹션 */}
            <motion.div {...designTokens.animations.fadeIn} transition={{ delay: 0.3 }}>
              <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-green-50 to-emerald-50`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className={designTokens.typography.heading}>
                          ✨ 신규 피어몰
                        </h2>
                        <p className={`${designTokens.typography.caption} mt-1`}>
                          따끈따끈한 새로운 피어몰들
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {newestMalls.length}개
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
                      viewMode={viewMode}
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
            </motion.div>

            {/* 🏢 전체 피어몰 섹션 - 새롭게 추가된 섹션 */}
            <motion.div {...designTokens.animations.fadeIn} transition={{ delay: 0.4 }}>
              <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Store className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h2 className={designTokens.typography.heading}>
                          🏢 전체 피어몰
                        </h2>
                        <p className={`${designTokens.typography.caption} mt-1`}>
                          모든 피어몰을 한눈에 탐색해보세요
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        총 {filteredMalls.length}개
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-8 w-8 p-0"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-8 w-8 p-0"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                      >
                        <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredMalls.length > 0 ? (
                    <div className="space-y-4">
                      {/* 🔍 검색 결과 정보 */}
                      {searchQuery && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                          <Search className="w-4 h-4" />
                          <span>
                            '<strong>{searchQuery}</strong>' 검색 결과: {filteredMalls.length}개
                          </span>
                        </div>
                      )}
                      
                      {/* 🏷️ 활성 필터 표시 */}
                      {(selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Filter className="w-4 h-4" />
                          <span>활성 필터:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedHashtags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 🎯 피어몰 그리드 */}
                      <PeermallGrid
                        title=""
                        malls={filteredMalls}
                        onOpenMap={handleOpenMap}
                        viewMore={true}
                        viewMode={viewMode}
                        onShowQrCode={handleShowPeermallQrCode}
                        showPagination={true}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Store className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className={`${designTokens.typography.subheading} text-gray-700 mb-3`}>
                        {searchQuery ? '검색 결과가 없습니다' : '아직 피어몰이 없어요'}
                      </h3>
                      <p className={`${designTokens.typography.caption} mb-6 max-w-md mx-auto`}>
                        {searchQuery 
                          ? `'${searchQuery}'에 대한 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해보세요.`
                          : '첫 번째 피어몰을 만들어 커뮤니티를 시작해보세요! 당신의 아이디어가 새로운 연결을 만들어낼 거예요.'
                        }
                      </p>
                      {!searchQuery && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button 
                            onClick={() => navigate('/create-peermall')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            피어몰 만들기
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/explore')}
                            className="border-slate-300 hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            둘러보기
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 🗺️ 사이드바 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 🗺️ 피어맵 - 반응형 크기 */}
            <motion.div {...designTokens.animations.fadeIn} transition={{ delay: 0.3 }}>
              <Card className={`${designTokens.elevation.card} bg-gradient-to-br from-blue-50 to-cyan-50 
              h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh]
              min-h-[300px] max-h-[800px]`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Map className="w-5 h-5 text-blue-600" />
                      <h2 className={designTokens.typography.subheading}>
                        🗺️ 피어맵
                      </h2>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {allLocations.length}개 위치
                    </Badge>
                  </div>
                  <p className={`${designTokens.typography.caption} mt-1`}>
                    피어몰 위치를 한눈에 확인하세요
                  </p>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <div className="h-full overflow-hidden rounded-b-lg">
                    <EcosystemMap 
                      onLocationSelect={handleLocationSelect}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
          </div>

        </section>
      </main>

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

function setSelectedPeermall(peermall: Peermall) {
  throw new Error('Function not implemented.');
}
function setIsDetailViewOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}