import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { BookmarkItem } from '@/components/navigation/SearchAndFilterBar';
import EcosystemMap from '@/components/EcosystemMap';
import { zGenDesignTokens } from '@/styles/designTokens';
import { useNavigate } from 'react-router-dom';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import { 
  ChevronRight, ShoppingBag, Sparkles, Map, Users, Heart, Star, Phone, MessageSquare, 
  Navigation, RefreshCw, Filter, Grid, List, Store, Search, Eye, LayoutGrid, 
  Image, BookOpen, Calendar, MapPin, ThumbsUp, MessageCircle, Share2, Bookmark,
  ChevronLeft, Settings, Maximize2, Minimize2, RotateCcw, Newspaper, Clock, TrendingUp,
  Zap, Rocket, Compass, Globe, Target, Layers, ArrowRight, Play, Pause, Volume2,
  VolumeX, MoreHorizontal, Plus, Minus, X, Check, AlertCircle, Info, ChevronDown,
  ChevronUp, ExternalLink, Download, Upload, Copy, Edit, Trash2, Archive,
  Bell, BellOff, Lock, Unlock, Sun, Moon, Wifi, WifiOff, Battery, Bluetooth,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { peermallStorage, Peermall } from '@/services/storage/peermallStorage';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import SearchAndFilterBar from '@/components/navigation/SearchAndFilterBar';
import { getAllPeerMallList } from '@/services/peerMallService';
import PeermallCard from '@/components/peermall-features/PeermallCard';
import productService from '@/services/productService';
import { Product } from '@/types/product';
import ProductGrid from '@/components/shopping/products/ProductGrid';
import CommunityFeed from '@/components/community/CommunityFeed';
import MainHeroSection from '@/components/peer-space/sections/MainHeroSection';
import { HashtagFilterOption, PeermallType } from '@/components/navigation/HashtagFilter';
import FavoriteServicesSection from '@/components/feature-sections/FavoriteServicesSection';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

// 🎨 Z세대 감성의 뷰어 모드 타입
type ViewMode = 'grid' | 'list' | 'cards';

// 🎯 섹션별 뷰어 상태 타입
interface SectionViewModes {
  newMalls: ViewMode;
  allMalls: ViewMode;
  products: ViewMode;
}

// 🎨 확장된 뷰 모드 옵션 - 모바일 최적화
const viewModeOptions = [
  { 
    value: 'grid' as ViewMode, 
    label: '그리드', 
    icon: Grid, 
    description: '깔끔한 카드 레이아웃',
    gradient: 'from-blue-500 to-cyan-500',
    bestFor: '빠른 탐색',
    emoji: '📱'
  },
  // { 
  //   value: 'cards' as ViewMode, 
  //   label: '카드', 
  //   icon: Layers, 
  //   description: '인스타그램 스타일',
  //   gradient: 'from-pink-500 to-rose-500',
  //   bestFor: '시각적 임팩트',
  //   emoji: '💳'
  // },
  { 
    value: 'list' as ViewMode, 
    label: '리스트', 
    icon: List, 
    description: '상세 정보 중심',
    gradient: 'from-green-500 to-emerald-500',
    bestFor: '정보 중심',
    emoji: '📋'
  }
];

// 🎯 모바일 최적화 뷰어 모드 선택 컴포넌트
const MobileOptimizedViewModeSelector = ({ 
  currentMode, 
  onModeChange, 
  sectionTitle,
  itemCount,
  compact = true 
}: {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  sectionTitle: string;
  itemCount: number;
  compact?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentOption = viewModeOptions.find(opt => opt.value === currentMode);

  return (
    <div className="relative">
      {/* 🚀 모바일 친화적 컴팩트 모드 */}
      <div className="flex items-center space-x-2">
        {/* 현재 모드 표시 - 모바일 최적화 */}
        <motion.div 
          className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-lg sm:rounded-xl shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className={`p-1 rounded-md bg-gradient-to-r ${currentOption?.gradient}`}>
            {currentOption && <currentOption.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {currentOption?.emoji} {currentOption?.label}
          </span>
          <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs px-1.5 py-0.5">
            {itemCount}
          </Badge>
        </motion.div>

        {/* 뷰 모드 선택 버튼들 - 모바일 최적화 */}
        <div className="flex items-center space-x-1">
          {viewModeOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isActive = currentMode === option.value;
            
            return (
              <motion.button
                key={option.value}
                onClick={() => onModeChange(option.value)}
                className={cn(
                  "relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive 
                    ? `bg-gradient-to-r ${option.gradient} shadow-lg` 
                    : "bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/30"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <IconComponent className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
                )} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 🎨 모바일 최적화 뷰어 렌더러
const MobileOptimizedViewRenderer = ({ 
  items, 
  viewMode, 
  type,
  onOpenMap, 
  onShowQrCode,
  onDetailView
}: {
  items: (Peermall | Product)[];
  viewMode: ViewMode;
  type: 'peermall' | 'product';
  onOpenMap?: (location: Location) => void;
  onShowQrCode?: (id: string, title: string) => void;
  onDetailView?: (id: string) => void;
}) => {
  const navigate = useNavigate();

  // 🎯 기본 아이템 렌더러 - 모바일 최적화
  const renderBaseItem = (item: Peermall | Product, variant: 'card' | 'list' | 'grid' = 'grid') => {
    const isProduct = type === 'product';
    const title = isProduct ? (item as Product).name : (item as Peermall).peerMallName;
    const description = isProduct ? (item as Product).description : (item as Peermall).description;
    const imageUrl = isProduct 
      ? (item as Product).imageUrl 
      : (item as Peermall).profileImage || (item as Peermall).bannerImage;
    const itemId = isProduct ? (item as Product).productKey : (item as Peermall).peerMallKey || (item as Peermall).id;
    const price = isProduct ? (item as Product).price : null;
    const rating = !isProduct ? (item as Peermall).rating || 0 : null;

    const handleClick = () => {
      if (isProduct) {
        onDetailView?.((item as Product).productKey);
      } else {
        navigate(`/space/${(item as Peermall).peerMallName}?mk=${(item as Peermall).peerMallKey}`);
      }
    };

    // 📱 카드 스타일 - 모바일 최적화
    if (variant === 'card') {
      return (
        <motion.div
          key={itemId}
          className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-800"
          onClick={handleClick}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          layout
        >
          {/* 🖼️ 이미지 영역 - 모바일 최적화 */}
          <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <div className="text-center">
                  {isProduct ? (
                    <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
                  ) : (
                    <Store className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
                  )}
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {isProduct ? '상품 이미지' : '피어몰'}
                  </span>
                </div>
              </div>
            )}
            
            {/* 상단 배지 */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {!isProduct && (item as Peermall).featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-1 shadow-lg">
                    <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    인기
                  </Badge>
                )}
                {isProduct && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 text-xs px-2 py-1 shadow-lg">
                    <ShoppingBag className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    상품
                  </Badge>
                )}
              </div>
            </div>

            {/* 하단 정보 */}
            {rating !== null && rating > 0 && (
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* 📝 콘텐츠 영역 - 모바일 최적화 */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white line-clamp-2">
                {title}
              </h3>
              {description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {/* 가격 및 액션 */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              {price !== null ? (
                <div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₩{price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>{Math.floor(Math.random() * 1000)}</span>
                </div>
              )}
              
              <motion.button
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <span className="flex items-center space-x-1">
                  <span>{isProduct ? '구매' : '보기'}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    }

    // 📱 리스트 스타일 - 모바일 최적화
    if (variant === 'list') {
      return (
        <motion.div
          key={itemId}
          className="group relative p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md cursor-pointer transition-all duration-300"
          onClick={handleClick}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                isProduct ? <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" /> : <Store className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                {description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>방금 전</span>
                </div>
                {price !== null && (
                  <span className="text-sm sm:text-base font-bold text-blue-600">
                    ₩{price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
          </div>
        </motion.div>
      );
    }

    // 📱 그리드 스타일 - 모바일 최적화 (기본)
    return (
      <motion.div
        key={itemId}
        className="group relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-800"
        onClick={handleClick}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isProduct ? (
          <div className="p-3 sm:p-6">
            <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl mb-3 sm:mb-4 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 line-clamp-2">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-xl font-bold text-blue-600">₩{price?.toLocaleString()}</span>
              <Badge variant="outline" className="text-xs">{(item as Product).peerMallName}</Badge>
            </div>
          </div>
        ) : (
          <PeermallCard
            {...(item as Peermall)}
            isPopular={(item as Peermall).featured}
            isFamilyCertified={(item as Peermall).certified}
            isRecommended={(item as Peermall).recommended}
            onShowQrCode={onShowQrCode || (() => {})}
            onOpenMap={onOpenMap || (() => {})}
            className="border-0 shadow-none"
          />
        )}
      </motion.div>
    );
  };

  // 🎯 뷰 모드별 렌더링 - 모바일 최적화
  switch (viewMode) {
    case 'cards':
      return (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          variants={zGenDesignTokens.animations.staggerChildren}
          initial="initial"
          animate="animate"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              variants={zGenDesignTokens.animations.fadeInUp}
              transition={{ delay: index * 0.05 }}
            >
              {renderBaseItem(item, 'card')}
            </motion.div>
          ))}
        </motion.div>
      );

    case 'list':
      return (
        <div className="space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              {renderBaseItem(item, 'list')}
            </motion.div>
          ))}
        </div>
      );

    default: // grid
      return (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          variants={zGenDesignTokens.animations.staggerChildren}
          initial="initial"
          animate="animate"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              variants={zGenDesignTokens.animations.fadeInUp}
              transition={{ delay: index * 0.03 }}
            >
              {renderBaseItem(item, 'grid')}
            </motion.div>
          ))}
        </motion.div>
      );
  }
};

// 🚀 메인 컴포넌트 - 완전히 새로운 모바일 최적화 레이아웃
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scrollY } = useScroll();
  
  // 🎯 기본 상태 관리
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
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🎨 섹션별 뷰어 모드 상태 관리
  const [sectionViewModes, setSectionViewModes] = useState<SectionViewModes>({
    newMalls: 'cards',
    allMalls: 'grid',
    products: 'cards'
  });

  // 📱 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🎯 섹션별 뷰어 모드 변경 핸들러
  const handleSectionViewModeChange = useCallback((section: keyof SectionViewModes, mode: ViewMode) => {
    setSectionViewModes(prev => ({
      ...prev,
      [section]: mode
    }));
    
    localStorage.setItem(`viewMode_${section}`, mode);
    
    toast({
      title: "🎨 뷰 모드 변경됨",
      description: `${section === 'newMalls' ? '신규 피어몰' : section === 'allMalls' ? '전체 피어몰' : '상품'} 뷰가 변경되었습니다.`,
      duration: 2000,
    });
  }, [toast]);

  // 기존 핸들러들 유지...
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
    setPeermalls(searchedPeerMalls);
  }, [peermalls, originPeerMalls]);

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

  const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleShowPeermallQrCode = useCallback((peerMallKey: string, peerMallName: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peerMallName}?mk=${peerMallKey}`);
    setQrModalTitle(`${peerMallName} QR 코드`);
    setQrModalOpen(true);
  }, []);

  const handleProductDetailView = useCallback((productKey: string) => {
    const product = products.find(p => p.productKey === productKey);
    if (product && product.peerMallKey) {
      navigate(`/space/${product.peerMallName}/product?mk=${product.peerMallKey}&pk=${productKey}`);
    } else {
      console.error('Product or peermallKey not found:', productKey);
    }
  }, [products, navigate]);

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
    
    // 다크모드 설정 확인
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // 저장된 뷰어 모드 설정 복원
    const savedNewMallsMode = localStorage.getItem('viewMode_newMalls') as ViewMode;
    const savedAllMallsMode = localStorage.getItem('viewMode_allMalls') as ViewMode;
    const savedProductsMode = localStorage.getItem('viewMode_products') as ViewMode;
    
    if (savedNewMallsMode || savedAllMallsMode || savedProductsMode) {
      setSectionViewModes({
        newMalls: savedNewMallsMode || 'cards',
        allMalls: savedAllMallsMode || 'grid',
        products: savedProductsMode || 'cards'
      });
    }
    
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

  // 📊 통계 및 데이터 계산
  const stats = useMemo(() => ({
    totalMalls: peermalls.length,
    myMalls: mySpaces.length,
    totalRating: peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0),
    avgRating: peermalls.length > 0 ? (Number(peermalls.reduce((sum, mall) => sum + (mall.rating || 0), 0) / peermalls.length)).toFixed(1) : '0.0',
    totalLikes: peermalls.reduce((sum, mall) => sum + (mall.likes || 0), 0),
    totalFollowers: peermalls.reduce((sum, mall) => sum + (mall.followers || 0), 0),
    totalProducts: products.length,
    avgPrice: products.length > 0 ? Math.round(products.reduce((sum, product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) || 0 : product.price || 0;
      return sum + price;
    }, 0) / products.length) : 0
  }), [peermalls, mySpaces, products]);
  
  // ✨ 신규 피어몰 계산
  const newestMalls = useMemo(() => [...peermalls]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, isMobile ? 4 : 8), [peermalls, isMobile]);

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
    
    // if (peermall) {
    //   const path = `/space/${peermall['peerMallName']}?mk=${peermall['peerMallKey']}`;
    //   window.open(path, '_blank');
    // }
  }, [peermalls]);

  // 로딩 상태 렌더링 - 모바일 최적화
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-purple-900/20 dark:to-black flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          {...zGenDesignTokens.animations.scaleIn}
        >
          <div className="relative mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse mx-auto" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">피어몰 로딩 중...</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">잠시만 기다려주세요 ✨</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900/20 to-black" 
        : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"
    )}>
      {/* 🎯 메인 콘텐츠 - 모바일 최적화 */}
      <main className="relative z-10 px-3 sm:px-4 py-4 sm:py-8 lg:py-16" id="explore-section">
        
        {/* 🌟 즐겨찾기 서비스 섹션 - 모바일 최적화 */}
        {isLoggedIn && (
          <motion.section 
            className="mb-6 sm:mb-8 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          나만의 즐겨찾기
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                          자주 사용하는 서비스들을 빠르게 접근하세요
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-xs">
                      개인화됨
                    </Badge>
                  </div>
                  <FavoriteServicesSection />
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* 🔍 검색 및 필터 바 - 모바일 최적화 */}
        <motion.section 
          className="mb-6 sm:mb-8 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        스마트 검색 & 필터 🔍
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                        원하는 피어몰과 상품을 빠르게 찾아보세요
                      </p>
                    </div>
                  </div>
                </div>
                
                <SearchAndFilterBar
                  hashtags={hashtagOptions}
                  peermallTypeOptions={peermallTypeOptions}
                  bookmarks={bookmarks}
                  onSearchChange={handleSearchChange}
                  onFilterChange={handleFilterChange}
                  onBookmarkToggle={handleBookmarkToggle}
                  onBookmarkRemove={handleBookmarkRemove}
                />
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 📊 메인 콘텐츠 컨테이너 - 모바일 최적화 */}
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-16">
          
          {/* 🎯 상단 섹션: 신규 피어몰 + 피어맵 - 모바일 스택 레이아웃 */}
          <section className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            
            {/* ✨ 신규 피어몰 섹션 - 모바일 최적화 */}
            <motion.div 
              className="xl:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 backdrop-blur-sm h-full">
                <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                  {/* 헤더 - 모바일 최적화 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                          ✨ 신규 피어몰
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                          따끈따끈한 새로운 피어몰들을 만나보세요
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs px-2 py-1">
                        {newestMalls.length}개
                      </Badge>
                      <MobileOptimizedViewModeSelector
                        currentMode={sectionViewModes.newMalls}
                        onModeChange={(mode) => handleSectionViewModeChange('newMalls', mode)}
                        sectionTitle="신규 피어몰"
                        itemCount={newestMalls.length}
                        compact={true}
                      />
                    </div>
                  </div>
                  
                  {/* 콘텐츠 - 모바일 최적화 */}
                  <div className="flex-1 min-h-0">
                    {newestMalls.length > 0 ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={sectionViewModes.newMalls}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="h-full overflow-y-auto pr-1 -mr-1"
                        >
                          <MobileOptimizedViewRenderer
                            items={newestMalls}
                            viewMode={sectionViewModes.newMalls}
                            type="peermall"
                            onOpenMap={handleOpenMap}
                            onShowQrCode={handleShowPeermallQrCode}
                          />
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center p-4">
                          <motion.div 
                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500" />
                          </motion.div>
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            새로운 피어몰을 기다리고 있어요
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-md mx-auto">
                            지금 바로 피어몰을 만들어 첫 번째 신규 피어몰이 되어보세요! ✨
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 🗺️ 피어맵 - 모바일 최적화 */}
            <motion.div 
              className="xl:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30 backdrop-blur-sm h-full min-h-[300px] sm:min-h-[400px] xl:min-h-[600px]">
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  {/* 헤더 - 모바일 최적화 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Map className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          🗺️ 피어맵
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                          피어몰 위치 탐색
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs px-2 py-1">
                      {allLocations.length}개
                    </Badge>
                  </div>
                  
                  {/* 지도 영역 - 모바일 최적화 */}
                  <div className="flex-1 min-h-0 rounded-lg sm:rounded-xl overflow-hidden">
                    <EcosystemMap onLocationSelect={handleLocationSelect} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* 🏢 전체 피어몰 섹션 - 모바일 최적화 */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 border-slate-100 dark:border-slate-800/30 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* 헤더 - 모바일 최적화 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-slate-600 to-gray-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        🏢 전체 피어몰
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                        모든 피어몰을 다양한 방식으로 탐색해보세요
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-xs px-2 py-1">
                      총 {peermalls.length}개
                    </Badge>
                    
                    <motion.button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ scale: 1.05, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      title="새로고침"
                    >
                      <RefreshCw className={cn("w-3 h-3 sm:w-4 sm:h-4", refreshing && "animate-spin")} />
                    </motion.button>
                    
                    <MobileOptimizedViewModeSelector
                      currentMode={sectionViewModes.allMalls}
                      onModeChange={(mode) => handleSectionViewModeChange('allMalls', mode)}
                      sectionTitle="전체 피어몰"
                      itemCount={peermalls.length}
                      compact={true}
                    />
                  </div>
                </div>
                
                {/* 콘텐츠 - 모바일 최적화 */}
                {peermalls.length > 0 ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* 검색 결과 정보 - 모바일 최적화 */}
                    {searchQuery && (
                      <motion.div 
                        className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-blue-50/80 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-100 dark:border-blue-800/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Search className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="flex-1 min-w-0">
                          '<strong className="text-blue-600 dark:text-blue-400">{searchQuery}</strong>' 검색 결과: {peermalls.length}개
                        </span>
                      </motion.div>
                    )}
                    
                    {/* 활성 필터 표시 - 모바일 최적화 */}
                    {(selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) && (
                      <motion.div 
                        className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-gray-50/80 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-center space-x-2">
                          <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>활성 필터:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {selectedHashtags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs bg-white dark:bg-gray-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* 피어몰 뷰 렌더러 - 모바일 최적화 */}
                    <AnimatePresence mode="wait">
<motion.div
                        key={sectionViewModes.allMalls}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MobileOptimizedViewRenderer
                          items={peermalls}
                          viewMode={sectionViewModes.allMalls}
                          type="peermall"
                          onOpenMap={handleOpenMap}
                          onShowQrCode={handleShowPeermallQrCode}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 lg:py-16">
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Store className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      {searchQuery ? '검색 결과가 없습니다' : '아직 피어몰이 없어요'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
                      {searchQuery 
                        ? `'${searchQuery}'에 대한 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해보세요.`
                        : '첫 번째 피어몰을 만들어 커뮤니티를 시작해보세요! 당신의 아이디어가 새로운 연결을 만들어낼 거예요.'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* 🛍️ 전체 상품 보기 섹션 - 모바일 최적화 */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* 헤더 - 모바일 최적화 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        🛍️ 전체 상품 보기
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                        피어몰에 등록된 모든 상품들을 만나보세요
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs px-2 py-1">
                      {products.length}개 상품
                    </Badge>
                    <MobileOptimizedViewModeSelector
                      currentMode={sectionViewModes.products}
                      onModeChange={(mode) => handleSectionViewModeChange('products', mode)}
                      sectionTitle="전체 상품"
                      itemCount={products.length}
                      compact={true}
                    />
                  </div>
                </div>
                
                {/* 콘텐츠 - 모바일 최적화 */}
                {products.length > 0 ? (
                  <div className="space-y-6 sm:space-y-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={sectionViewModes.products}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MobileOptimizedViewRenderer
                          items={getDisplayedProducts()}
                          viewMode={sectionViewModes.products}
                          type="product"
                          onDetailView={handleProductDetailView}
                        />
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* 페이지네이션 - 모바일 최적화 */}
                    {totalPages > 1 && (
                      <motion.div 
                        className="flex justify-center mt-8 sm:mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <motion.button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                          
                          {/* 페이지 번호들 - 모바일 최적화 */}
                          {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                            let pageNum;
                            const maxVisible = isMobile ? 3 : 5;
                            
                            if (totalPages <= maxVisible) {
                              pageNum = i + 1;
                            } else if (currentPage <= Math.ceil(maxVisible / 2)) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
                              pageNum = totalPages - maxVisible + 1 + i;
                            } else {
                              pageNum = currentPage - Math.floor(maxVisible / 2) + i;
                            }
                            
                            const isActive = currentPage === pageNum;
                            
                            return (
                              <motion.button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={cn(
                                  "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-200",
                                  isActive 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25" 
                                    : "bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {pageNum}
                              </motion.button>
                            );
                          })}
                          
                          <motion.button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 lg:py-16">
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      등록된 상품이 없습니다
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                      첫 번째 상품을 등록해보세요! 🛍️
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>

      {/* 🚀 플로팅 액션 버튼 - 모바일 최적화 */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Rocket className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
        </motion.button>
      </motion.div>

      {/* 📱 QR 코드 모달 */}
      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={qrCodeUrl}
        title={qrModalTitle}
      />

      {/* 🌙 다크모드 토글 - 모바일 최적화 (선택사항) */}
      {/* <motion.div
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          onClick={toggleDarkMode}
          className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm",
            isDarkMode 
              ? "bg-yellow-500/90 text-white shadow-yellow-500/25" 
              : "bg-gray-800/90 text-white shadow-gray-800/25"
          )}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
        >
          {isDarkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </motion.button>
      </motion.div> */}
    </div>
  );
};

export default Index;