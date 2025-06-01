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
import { 
  ChevronRight, ShoppingBag, Sparkles, Map, Users, Heart, Star, Phone, MessageSquare, 
  Navigation, RefreshCw, Filter, Grid, List, Store, Search, Eye, LayoutGrid, 
  Image, BookOpen, Calendar, MapPin, ThumbsUp, MessageCircle, Share2, Bookmark,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { peermallStorage, Peermall } from '@/services/storage/peermallStorage';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SearchAndFilterBar from '@/components/navigation/SearchAndFilterBar';
import { getAllPeerMallList } from '@/services/peerMallService';
import PeermallCard from '@/components/peermall-features/PeermallCard';
import productService from '@/services/productService';
import { Product } from '@/types/product';
import ProductGrid from '@/components/shopping/products/ProductGrid';
import CommunityFeed from '@/components/community/CommunityFeed';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

// 🎨 뷰어 모드 타입 정의
type ViewMode = 'grid' | 'list' | 'gallery' | 'blog';

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

// 🎨 뷰어 모드별 피어몰 렌더링 컴포넌트
const PeermallViewRenderer = ({ 
  malls, 
  viewMode, 
  onOpenMap, 
  onShowQrCode 
}: {
  malls: Peermall[];
  viewMode: ViewMode;
  onOpenMap: (location: Location) => void;
  onShowQrCode: (id: string, title: string) => void;
}) => {
  const navigate = useNavigate();

  // 🎯 그리드 뷰 (기본) - PeermallCard 사용
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {malls.map((mall, index) => (
          <motion.div
            key={mall.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PeermallCard
              {...mall}
              isPopular={mall.featured}
              isFamilyCertified={mall.certified}
              isRecommended={mall.recommended}
              onShowQrCode={onShowQrCode}
              onOpenMap={onOpenMap}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // 📋 리스트 뷰
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {malls.map((mall, index) => (
          <motion.div
            key={mall.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PeermallCard
              {...mall}
              isPopular={mall.featured}
              isFamilyCertified={mall.certified}
              isRecommended={mall.recommended}
              onShowQrCode={onShowQrCode}
              onOpenMap={onOpenMap}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // 🖼️ 갤러리 뷰
  if (viewMode === 'gallery') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {malls.map((mall, index) => (
          <motion.div
            key={mall.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => navigate(`/space/${mall.peerMallName}?mk=${mall.peerMallKey}`)}
          >
            <PeermallCard
              {...mall}
              isPopular={mall.featured}
              isFamilyCertified={mall.certified}
              isRecommended={mall.recommended}
              onShowQrCode={onShowQrCode}
              onOpenMap={onOpenMap}
              className="aspect-square"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // 📝 블로그 뷰
  if (viewMode === 'blog') {
    return (
      <div className="space-y-8">
        {malls.map((mall, index) => (
          <motion.div
            key={mall.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PeermallCard
              {...mall}
              isPopular={mall.featured}
              isFamilyCertified={mall.certified}
              isRecommended={mall.recommended}
              onShowQrCode={onShowQrCode}
              onOpenMap={onOpenMap}
              className="w-full max-w-4xl mx-auto"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 🎯 상태 관리 - 단순화 및 최적화
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredMalls, setFilteredMalls] = useState<Peermall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['전체']);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originPeerMalls, setOriginPeerMalls] = useState<Peermall[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [refreshing, setRefreshing] = useState(false);

  // 🔍 검색 핸들러
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);

    if(query === '') {
      setPeermalls(originPeerMalls);
      return;
    }

    if(originPeerMalls.length === 0) {
      setOriginPeerMalls(peermalls);
    }

    const searchedPeerMalls = peermalls.filter(peerMall => 
      peerMall.peerMallName.includes(query)
    );
    setFilteredMalls(searchedPeerMalls);
  }, [peermalls, originPeerMalls, filteredMalls]);

  // 📖 북마크 핸들러
  const handleBookmarkToggle = useCallback((itemId: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(bookmark => bookmark.id === itemId);
      if (isBookmarked) {
        return prev.filter(bookmark => bookmark.id !== itemId);
      } else {
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
  }, []);

  // 🗺️ 지도 핸들러
  const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleCloseMap = useCallback(() => setIsMapOpen(false), []);

  // 📱 내 피어몰 관련 핸들러
  const handleOpenMySpaces = useCallback(() => setIsMySpacesOpen(true), []);
  const handleCloseMySpaces = useCallback(() => setIsMySpacesOpen(false), []);

  const handleSelectSpace = useCallback((id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  }, [navigate, handleCloseMySpaces]);

  // 📱 QR 코드 핸들러
  const handleShowPeermallQrCode = useCallback((peerMallKey: string, peerMallName: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peerMallName}?mk=${peerMallKey}`);
    setQrModalTitle(`${peerMallName} QR 코드`);
    setQrModalOpen(true);
  }, []);

  // 🔄 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('🔄 데이터 새로고침 시작...');
      
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

  // 🎯 초기 데이터 로드
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 초기 데이터 로드 시작...');
        
        const allPeermalls = await getAllPeerMallList();
        const allProducts = await productService.getAllProductList();

        setPeermalls(allPeermalls);
        setProducts(allProducts);
        
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
  }, [toast]);

  // 📄 페이지네이션
  const getDisplayedProducts = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔍 필터링 로직
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
    
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
      filtered = filtered.filter(mall => selectedTypes.includes(mall.type as PeermallType));
    }
    
    if (selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) {
      filtered = filtered.filter(mall => 
        mall.tags && mall.tags.some(tag => selectedHashtags.includes(tag))
      );
    }
    
    setFilteredMalls(filtered);
    console.log('✅ 필터링 완료:', filtered.length, '개');
  }, [peermalls]);

  // 📊 통계 및 데이터 계산
  const stats = {
    totalMalls: peermalls.length,
    myMalls: mySpaces.length,
    totalRating: peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0),
    avgRating: peermalls.length > 0 ? (Number(peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0) / peermalls.length)).toFixed(1) : '0.0',
    totalLikes: peermalls.reduce((sum, mall) => sum + (mall.likes || 0), 0),
    totalFollowers: peermalls.reduce((sum, mall) => sum + (mall.followers || 0), 0)
  };
  
  // ✨ 신규 피어몰 계산
  const newestMalls = [...peermalls]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 4);

  // 🗺️ 지도용 위치 데이터
  const allLocations = peermalls.map(mall => ({
    lat: mall.lat,
    lng: mall.lng,
    address: mall.address,
    title: mall.peerMallName
  }));
  
  const handleLocationSelect = useCallback((location: any) => {
    const peermall = peermalls.find(
      p => p.lat === location.lat && p.lng === location.lng
    );
    
    if (peermall) {
      navigate(`/space/${peermall['peerMallName']}?mk=${peermall['peerMallKey']}`);
    }
  }, [peermalls, navigate]);

  // 🎨 뷰 모드 옵션 정의
  const viewModeOptions = [
    { 
      value: 'grid' as ViewMode, 
      label: '그리드', 
      icon: Grid, 
      description: '카드 형태로 깔끔하게',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      value: 'list' as ViewMode, 
      label: '리스트', 
      icon: List, 
      description: '상세 정보와 함께',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      value: 'gallery' as ViewMode, 
      label: '갤러리', 
      icon: Image, 
      description: '이미지 중심으로',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      value: 'blog' as ViewMode, 
      label: '블로그', 
      icon: BookOpen, 
      description: '스토리텔링 방식',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

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
    <div className="container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
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

        {/* 🔍 검색 및 필터 바 */}
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

        {/* 📊 메인 콘텐츠 - 개선된 레이아웃 */}
        <div className="space-y-8">
          
          {/* 🎯 상단 섹션: 신규 피어몰 + 피어맵 */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* ✨ 신규 피어몰 섹션 */}
            <motion.div 
              className="xl:col-span-2"
              {...designTokens.animations.fadeIn} 
              transition={{ delay: 0.2 }}
            >
              <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 h-full`}>
                <CardHeader className="pb-4">
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
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
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
                <CardContent className="pt-0">
                  {newestMalls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newestMalls.slice(0, 4).map((mall, index) => (
                        <motion.div
                          key={mall.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <PeermallCard
                            {...mall}
                            isPopular={mall.featured}
                            isFamilyCertified={mall.certified}
                            isRecommended={mall.recommended}
                            onShowQrCode={handleShowPeermallQrCode}
                            onOpenMap={handleOpenMap}
                            className="h-full"
                          />
                        </motion.div>
                      ))}
                    </div>
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

            {/* 🗺️ 피어맵 */}
            <motion.div 
              {...designTokens.animations.fadeIn} 
              transition={{ delay: 0.3 }}
            >
              <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 h-full min-h-[400px]`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Map className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className={designTokens.typography.subheading}>
                          🗺️ 피어맵
                        </h3>
                        <p className={`${designTokens.typography.caption} mt-1`}>
                          피어몰 위치 탐색
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {allLocations.length}개 위치
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <div className="h-[350px] overflow-hidden rounded-b-lg">
                    <EcosystemMap onLocationSelect={handleLocationSelect} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* 🎯 중간 섹션: 전체 피어몰 + 커뮤니티 피드 */}
          <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* 🏢 전체 피어몰 섹션 */}
            <motion.div 
              className="xl:col-span-3"
              {...designTokens.animations.fadeIn} 
              transition={{ delay: 0.4 }}
            >
              <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200`}>
                <CardHeader className="pb-4">
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
                          모든 피어몰을 다양한 방식으로 탐색해보세요
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                        총 {peermalls.length}개
                      </Badge>
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
                  
                  {/* 🎨 향상된 뷰 모드 선택기 */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-700">보기 방식</h3>
                      <div className="text-xs text-gray-500">
                        현재: <span className="font-medium">{viewModeOptions.find(opt => opt.value === viewMode)?.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {viewModeOptions.map((option) => {
                        const IconComponent = option.icon;
                        const isActive = viewMode === option.value;
                        
                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => setViewMode(option.value)}
                            className={cn(
                              "relative p-3 rounded-lg border-2 transition-all duration-300 group",
                              isActive 
                                ? "border-blue-500 bg-blue-50" 
                                : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className={cn(
                                "p-2 rounded-lg transition-all duration-300",
                                isActive 
                                  ? `bg-gradient-to-r ${option.gradient} text-white` 
                                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                              )}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="text-center">
                                <div className={cn(
                                  "text-sm font-medium transition-colors",
                                  isActive ? "text-blue-700" : "text-gray-700"
                                )}>
                                  {option.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-lg bg-blue-500/10"
                                layoutId="activeViewMode"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {peermalls.length > 0 ? (
                    <div className="space-y-4">
                      {/* 🔍 검색 결과 정보 */}
                      {searchQuery && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <Search className="w-4 h-4" />
                          <span>
                            '<strong>{searchQuery}</strong>' 검색 결과: {peermalls.length}개
                          </span>
                        </div>
                      )}
                      
                      {/* 🏷️ 활성 필터 표시 */}
                      {(selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
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
                      
                      {/* 🎯 향상된 피어몰 뷰 렌더러 */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={viewMode}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PeermallViewRenderer
                            malls={peermalls}
                            viewMode={viewMode}
                            onOpenMap={handleOpenMap}
                            onShowQrCode={handleShowPeermallQrCode}
                          />
                        </motion.div>
                      </AnimatePresence>
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* 🌟 커뮤니티 피드 */}
            <motion.div 
              {...designTokens.animations.fadeIn} 
              transition={{ delay: 0.5 }}
            >
              <CommunityFeed />
            </motion.div>
          </section>
        </div>

        {/* 🛍️ 전체 상품 보기 섹션 */}
        <section className="grid grid-cols-1 gap-6 p-4 md:p-6 mt-12">
          <motion.div {...designTokens.animations.fadeIn} transition={{ delay: 0.6 }}>
            <Card className={`${designTokens.elevation.feature} bg-gradient-to-br from-green-50 to-emerald-50 border-green-100`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className={designTokens.typography.heading}>
                        🛍️ 전체 상품 보기
                      </h2>
                      <p className={`${designTokens.typography.caption} mt-1`}>
                        피어몰에 등록된 모든 상품들을 만나보세요
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    {products.length}개 상품
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <>
                    <ProductGrid 
                      id="product-grid"
                      products={products} 
                      viewMode="grid"
                      onDetailView={(productKey) => {
                        const product = products.find(p => p.productKey === productKey);
                        if (product && product.peerMallKey) {
                          navigate(`/space/${product.peerMallName}/product?mk=${product.peerMallKey}&pk=${productKey}`);
                        } else {
                          console.error('Product or peermallKey not found:', productKey);
                        }
                      }}
                    />
                    {/* 페이지네이션 컨트롤 */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="w-10 h-10 p-0"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className={`w-10 h-10 p-0 ${currentPage === pageNum ? 'font-bold' : ''}`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="w-10 h-10 p-0"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
</div >
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className={`${designTokens.typography.subheading} text-gray-700 mb-2`}>
                      등록된 상품이 없습니다
                    </h3>
                    <p className={designTokens.typography.caption}>
                      첫 번째 상품을 등록해보세요! 🛍️
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
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
