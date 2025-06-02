import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Grid, EffectCards, EffectCoverflow } from 'swiper/modules';
import { 
  Plus, ExternalLink, Globe, Clock, ArrowRight, Loader2, Heart, TrendingUp, 
  Grid3X3, List, LayoutGrid, Eye, Star, Bookmark, Share2, MoreHorizontal,
  Zap, Users, Calendar, Award, Filter, Settings, Maximize2, Minimize2,
  Image, BookOpen, Layers, Sparkles, Crown, Shield, Activity, Pin, PinOff,
  X, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddServiceModal from '@/components/feature-sections/AddServiceModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Swiper 스타일
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/grid';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import { FavoriteService, OpenGraphData } from '@/types/favoriteService';

// 🎨 확장된 뷰 모드 타입
type ViewMode = 'compact' | 'medium' | 'large' | 'grid' | 'list' | 'cards' | 'gallery' | 'timeline' | 'magazine';

// 🎯 뷰 모드 옵션 정의
const viewModeOptions = [
  { 
    value: 'compact' as ViewMode, 
    label: '컴팩트', 
    icon: Grid3X3, 
    description: '작은 카드',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    value: 'medium' as ViewMode, 
    label: '미디엄', 
    icon: LayoutGrid, 
    description: '표준 크기',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    value: 'large' as ViewMode, 
    label: '라지', 
    icon: Maximize2, 
    description: '큰 카드',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    value: 'grid' as ViewMode, 
    label: '그리드', 
    icon: Layers, 
    description: '격자 배열',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    value: 'list' as ViewMode, 
    label: '리스트', 
    icon: List, 
    description: '목록형',
    gradient: 'from-indigo-500 to-blue-500'
  },
  { 
    value: 'cards' as ViewMode, 
    label: '카드', 
    icon: Sparkles, 
    description: '3D 카드',
    gradient: 'from-pink-500 to-rose-500'
  },
  { 
    value: 'gallery' as ViewMode, 
    label: '갤러리', 
    icon: Image, 
    description: '이미지 중심',
    gradient: 'from-teal-500 to-cyan-500'
  },
  { 
    value: 'timeline' as ViewMode, 
    label: '타임라인', 
    icon: Calendar, 
    description: '시간순 배열',
    gradient: 'from-violet-500 to-purple-500'
  },
  { 
    value: 'magazine' as ViewMode, 
    label: '매거진', 
    icon: BookOpen, 
    description: '매거진 스타일',
    gradient: 'from-amber-500 to-orange-500'
  }
];

// Open Graph 메타데이터 추출 함수
const extractOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  try {
    const response = await fetch('/api/extract-opengraph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('메타데이터 추출 실패');
    }

    const ogData = await response.json();
    return ogData;
  } catch (error) {
    console.error('Open Graph 데이터 추출 실패:', error);
    
    const domain = new URL(url).hostname;
    return {
      title: domain,
      description: `${domain}에서 제공하는 서비스`,
      siteName: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      url: url
    };
  }
};

const FavoriteServices: React.FC = () => {
  const [services, setServices] = useState<FavoriteService[]>([
    // ... 기존 서비스 데이터 (동일)
    {
      id: 1,
      name: "Notion",
      link: "https://notion.so",
      description: "올인원 워크스페이스로 노트, 데이터베이스, 칸반보드를 통합 관리",
      iconUrl: "https://www.notion.so/images/favicon.ico",
      thumbnailUrl: "https://www.notion.so/images/meta/default.png",
      domain: "notion.so",
      usageCount: 127,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'productivity',
      rating: 4.8,
      ogData: {
        title: "Notion",
        description: "올인원 워크스페이스",
        image: "https://www.notion.so/images/meta/default.png",
        siteName: "Notion",
        favicon: "https://www.notion.so/images/favicon.ico"
      }
    },
    {
      id: 2,
      name: "Figma",
      link: "https://figma.com",
      description: "실시간 협업이 가능한 UI/UX 디자인 도구",
      iconUrl: "https://static.figma.com/app/icon/1/favicon.ico",
      thumbnailUrl: "https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png",
      domain: "figma.com",
      usageCount: 89,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'design',
      rating: 4.9,
      isPopular: true,
      isTrending: true,
      ogData: {
        title: "Figma",
        description: "협업 디자인 도구",
        image: "https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png",
        siteName: "Figma",
        favicon: "https://static.figma.com/app/icon/1/favicon.ico"
      }
    },
    {
      id: 3,
      name: "GitHub",
      link: "https://github.com",
      description: "개발자를 위한 코드 저장소 및 협업 플랫폼",
      iconUrl: "https://github.com/favicon.ico",
      domain: "github.com",
      usageCount: 203,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'development',
      rating: 4.7,
      isPopular: true,
      isTrending: true,
      ogData: {
        title: "GitHub",
        description: "코드 저장소",
        siteName: "GitHub",
        favicon: "https://github.com/favicon.ico"
      }
    },
    {
      id: 4,
      name: "ChatGPT",
      link: "https://chat.openai.com",
      description: "AI 기반 대화형 어시스턴트",
      iconUrl: "https://chat.openai.com/favicon.ico",
      domain: "chat.openai.com",
      usageCount: 156,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'ai',
      rating: 4.6,
      isTrending: true,
      ogData: {
        title: "ChatGPT",
        description: "AI 어시스턴트",
        siteName: "OpenAI",
        favicon: "https://chat.openai.com/favicon.ico"
      }
    },
    {
      id: 5,
      name: "Slack",
      link: "https://slack.com",
      description: "팀 커뮤니케이션 및 협업 플랫폼",
      iconUrl: "https://slack.com/favicon.ico",
      domain: "slack.com",
      usageCount: 78,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'communication',
      rating: 4.5,
      ogData: {
        title: "Slack",
        description: "팀 커뮤니케이션",
        siteName: "Slack",
        favicon: "https://slack.com/favicon.ico"
      }
    },
    {
      id: 6,
      name: "Spotify",
      link: "https://spotify.com",
      description: "음악 스트리밍 서비스",
      iconUrl: "https://spotify.com/favicon.ico",
      domain: "spotify.com",
      usageCount: 245,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'entertainment',
      rating: 4.4,
      ogData: {
        title: "Spotify",
        description: "음악 스트리밍",
        siteName: "Spotify",
        favicon: "https://spotify.com/favicon.ico"
      }
    }
  ]);
  
  const [viewMode, setViewMode] = useState<ViewMode>('medium');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState<Set<string>>(new Set());
  
  // 🎯 뷰 모드 패널 상태 개선
  const [showViewModePanel, setShowViewModePanel] = useState(false);
  const [isViewModePinned, setIsViewModePinned] = useState(false); // 핀 상태 추가
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'usage' | 'recent' | 'name' | 'rating'>('usage');
  const swiperRef = useRef<any>(null);

  // 🎨 뷰 모드별 설정 타입 정의
  interface ViewConfig {
    containerClass: string;
    cardWidth: string;
    cardHeight: string;
    thumbnailHeight: string;
    iconSize: string;
    titleSize: string;
    showDescription: boolean;
    showStats: boolean;
    slidesPerView: number | 'auto';
    spaceBetween: number;
    layout: string;
  }

  // 🎨 뷰 모드별 설정 (기존과 동일)
  const viewConfig: Record<ViewMode, ViewConfig> = {
    compact: {
      containerClass: 'space-x-4',
      cardWidth: 'w-64',
      cardHeight: 'h-20',
      thumbnailHeight: 'h-12',
      iconSize: 'w-5 h-5',
      titleSize: 'text-sm',
      showDescription: false,
      showStats: true,
      slidesPerView: 2.5,
      spaceBetween: 16,
      layout: 'swiper'
    },
    medium: {
      containerClass: 'space-y-4',
      cardWidth: 'w-56',
      cardHeight: 'h-36',
      thumbnailHeight: 'h-16',
      iconSize: 'w-8 h-8',
      titleSize: 'text-sm',
      showDescription: true,
      showStats: true,
      slidesPerView: 4,
      spaceBetween: 12,
      layout: 'swiper'
    },
    large: {
      containerClass: 'space-y-4',
      cardWidth: 'w-72',
      cardHeight: 'h-44',
      thumbnailHeight: 'h-20',
      iconSize: 'w-10 h-10',
      titleSize: 'text-base',
      showDescription: true,
      showStats: true,
      slidesPerView: 3,
      spaceBetween: 16,
      layout: 'swiper'
    },
    grid: {
      containerClass: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
      cardWidth: 'w-full',
      cardHeight: 'h-40',
      thumbnailHeight: 'h-16',
      iconSize: 'w-8 h-8',
      titleSize: 'text-sm',
      showDescription: false,
      showStats: true,
      slidesPerView: 4,
      spaceBetween: 16,
      layout: 'grid'
    },
    list: {
      containerClass: 'space-y-3',
      cardWidth: 'w-full',
      cardHeight: 'h-20',
      thumbnailHeight: 'h-16',
      iconSize: 'w-12 h-12',
      titleSize: 'text-base',
      showDescription: true,
      showStats: true,
      slidesPerView: 1,
      spaceBetween: 12,
      layout: 'list'
    },
    cards: {
      containerClass: 'space-y-4',
      cardWidth: 'w-64',
      cardHeight: 'h-80',
      thumbnailHeight: 'h-32',
      iconSize: 'w-12 h-12',
      titleSize: 'text-lg',
      showDescription: true,
      showStats: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      layout: 'cards'
    },
    gallery: {
      containerClass: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
      cardWidth: 'w-full',
      cardHeight: 'aspect-square',
      thumbnailHeight: 'h-full',
      iconSize: 'w-8 h-8',
      titleSize: 'text-sm',
      showDescription: false,
      showStats: false,
      slidesPerView: 4,
      spaceBetween: 12,
      layout: 'gallery'
    },
    timeline: {
      containerClass: 'space-y-6',
      cardWidth: 'w-full',
      cardHeight: 'h-24',
      thumbnailHeight: 'h-20',
      iconSize: 'w-10 h-10',
      titleSize: 'text-base',
      showDescription: true,
      showStats: true,
      slidesPerView: 1,
      spaceBetween: 16,
      layout: 'timeline'
    },
    magazine: {
      containerClass: 'space-y-6',
      cardWidth: 'w-full',
      cardHeight: 'h-64',
      thumbnailHeight: 'h-40',
      iconSize: 'w-12 h-12',
      titleSize: 'text-xl',
      showDescription: true,
      showStats: true,
      slidesPerView: 2,
      spaceBetween: 24,
      layout: 'magazine'
    }
  };

  // 현재 뷰 모드에 따른 설정 가져오기
  const currentConfig = viewConfig[viewMode];

  // 🎯 카테고리별 색상 매핑 (기존과 동일)
  const categoryColors = {
    productivity: 'from-blue-500 to-indigo-600',
    design: 'from-purple-500 to-pink-600',
    development: 'from-green-500 to-emerald-600',
    ai: 'from-orange-500 to-red-600',
    communication: 'from-teal-500 to-cyan-600',
    entertainment: 'from-pink-500 to-rose-600'
  };

  // 🔄 서비스 정렬 (기존과 동일)
  const sortedServices = React.useMemo(() => {
    let filtered = selectedCategory 
      ? services.filter(s => s.category === selectedCategory)
      : services;

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return (b.usageCount || 0) - (a.usageCount || 0);
        case 'recent':
          return new Date(b.lastUsed || 0).getTime() - new Date(a.lastUsed || 0).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  }, [services, selectedCategory, sortBy]);

  // 🎯 뷰 모드 선택 핸들러 개선
  const handleViewModeSelect = (selectedViewMode: ViewMode) => {
    setViewMode(selectedViewMode);
    // 핀이 되어있지 않으면 패널 닫기
    if (!isViewModePinned) {
      setShowViewModePanel(false);
    }
  };

  // 🎯 뷰 모드 패널 토글
  const toggleViewModePanel = () => {
    setShowViewModePanel(!showViewModePanel);
  };

  // 🎯 핀 토글
  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsViewModePinned(!isViewModePinned);
  };

  const handleServiceClick = (service: FavoriteService, e: React.MouseEvent) => {
    e.preventDefault();
    
    setServices(prev => prev.map(s => 
      s.id === service.id 
        ? { ...s, usageCount: (s.usageCount || 0) + 1, lastUsed: new Date() }
        : s
    ));

    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
      window.open(service.link, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  const handleAddExternalService = async (name: string, link: string) => {
    const tempId = `temp-${Date.now()}`;
    setLoadingServices(prev => new Set(prev).add(tempId));
    
    try {
      const ogData = await extractOpenGraphData(link);
      const domain = new URL(link).hostname;
      
      const newService: FavoriteService = {
        id: Date.now(),
        name: name || ogData.title || domain,
        link,
        description: ogData.description || `${domain}에서 제공하는 서비스`,
        iconUrl: ogData.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        thumbnailUrl: ogData.image,
        domain: domain,
        usageCount: 0,
        lastUsed: new Date(),
        addedAt: new Date(),
        category: 'other',
        rating: 0,
        ogData: ogData
      };
      
      setServices(prev => [...prev, newService]);
      
    } catch (error) {
      console.error('서비스 추가 실패:', error);
      
      const domain = new URL(link).hostname;
      const fallbackService: FavoriteService = {
        id: Date.now(),
        name: name || domain,
        link,
        description: `${domain}의 서비스`,
        iconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        domain: domain,
        usageCount: 0,
        lastUsed: new Date(),
        addedAt: new Date(),
        category: 'other',
        rating: 0
      };
      
      setServices(prev => [...prev, fallbackService]);
    } finally {
      setLoadingServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  const handleAddInternalServices = (serviceIds: string[]) => {
    const newInternalServices: FavoriteService[] = serviceIds.map((id, index) => ({
      id: Date.now() + index,
      name: `PeerTerra ${id.replace('service', '')}`,
      link: `/service/${id}`,
      description: `PeerTerra의 ${id} 서비스`,
      isInternal: true,
      domain: 'peerterra.com',
      iconUrl: '/favicon.ico',
      usageCount: 0,
      lastUsed: new Date(),
      addedAt: new Date(),
      category: 'internal',
      rating: 5.0
    }));
    setServices(prev => [...prev, ...newInternalServices]);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분`;
    if (diffHours < 24) return `${diffHours}시간`;
    if (diffDays < 7) return `${diffDays}일`;
    return date.toLocaleDateString();
  };

  // 🎨 서비스 카드 렌더링 함수들 (기존과 동일하므로 생략...)
  // renderServiceCard 함수는 기존과 동일

  // 🎨 향상된 서비스 추가 카드 - 플로팅 버튼 스타일로 변경
  const renderFloatingAddButton = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button
        onClick={() => setIsModalOpen(true)}
        size="lg"
        className={cn(
          "w-4 h-10 rounded-full shadow-2xl border-0 ",
          "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
          "hover:from-blue-600 hover:via-purple-600 hover:to-pink-600",
          "transform hover:scale-110 active:scale-95",
          "transition-all duration-300",
          "group relative overflow-hidden"
        )}
      >
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 아이콘 */}
        {loadingServices.size > 0 ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
        )}
        
        {/* 글로우 효과 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </Button>
      
      {/* 툴팁 */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          새 서비스 추가
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </motion.div>
  );

  // 🎨 인라인 서비스 추가 카드 (기존 방식 유지)
  const renderInlineAddServiceCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: sortedServices.length * 0.05 }}
      className="group cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <Card className={cn(
        currentConfig.cardWidth,
        currentConfig.cardHeight,
        "border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 bg-gray-50/50"
      )}>
        <CardContent className="h-full flex flex-col items-center justify-center space-y-3 p-4">
          <div className={cn(
            viewMode === 'compact' ? 'w-8 h-8' : viewMode === 'medium' ? 'w-10 h-10' : 'w-12 h-12',
            "rounded-xl flex items-center justify-center transition-all duration-300 bg-blue-100 group-hover:bg-blue-200 group-hover:scale-110"
          )}>
            {loadingServices.size > 0 ? (
              <Loader2 className={cn(
                viewMode === 'compact' ? 'w-4 h-4' : viewMode === 'medium' ? 'w-5 h-5' : 'w-6 h-6',
                "text-blue-600 animate-spin"
              )} />
            ) : (
              <Plus className={cn(
                viewMode === 'compact' ? 'w-4 h-4' : viewMode === 'medium' ? 'w-5 h-5' : 'w-6 h-6',
                "text-blue-600"
              )} />
            )}
          </div>
          
          <div className="text-center space-y-1">
            <h3 className={cn(
              currentConfig.titleSize,
              "font-medium text-gray-900 group-hover:text-blue-600 transition-colors"
            )}>
              {viewMode === 'compact' ? '추가' : '새 서비스 추가'}
            </h3>
            {viewMode !== 'compact' && (
              <p className="text-xs text-gray-600">
                URL 입력으로 자동 추가
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // 기존 renderServiceCard 함수는 그대로 유지하되, 갤러리, 리스트, 타임라인, 매거진 등의 구현도 동일하게 유지
  const renderServiceCard = (service: FavoriteService, index: number) => {
    const categoryGradient = categoryColors[service.category as keyof typeof categoryColors] || 'from-gray-500 to-gray-600';

    // 🎯 갤러리 뷰
    if (viewMode === 'gallery') {
      return (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="group cursor-pointer"
          onClick={(e) => handleServiceClick(service, e)}
        >
          <Card className={cn(
            currentConfig.cardWidth,
            currentConfig.cardHeight,
            "overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          )}>
            <div className="relative h-full">
              {service.ogData?.image || service.thumbnailUrl ? (
                <img 
                  src={service.ogData?.image || service.thumbnailUrl} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryGradient} flex items-center justify-center`}>
                  <Globe className="w-12 h-12 text-white/80" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-bold text-sm line-clamp-1 mb-1">{service.name}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-80">{service.usageCount} 사용</span>
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 상태 배지 */}
              <div className="absolute top-2 left-2 flex gap-1">
                {service.isPopular && (
                  <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                    <TrendingUp className="w-2.5 h-2.5 mr-1" />
                    인기
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    // 🎯 리스트 뷰
    if (viewMode === 'list') {
      return (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group cursor-pointer"
          onClick={(e) => handleServiceClick(service, e)}
        >
          <Card className={cn(
            currentConfig.cardWidth,
            currentConfig.cardHeight,
            "overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
          )}>
            <CardContent className="p-0 h-full">
              <div className="flex items-center h-full">
                {/* 아이콘 */}
                <div className="flex-shrink-0 w-16 h-16 m-2 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {service.ogData?.favicon || service.iconUrl ? (
                    <img 
                      src={service.ogData?.favicon || service.iconUrl} 
                      alt={service.name}
                      className="w-8 h-8 object-cover"
                    />
                  ) : (
                    <Globe className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0 px-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {service.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{service.rating}</span>
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {service.usageCount}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{service.domain}</span>
                    <span>{formatTimeAgo(service.lastUsed || new Date())}</span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex-shrink-0 p-2">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    // 🎯 타임라인 뷰
    if (viewMode === 'timeline') {
      return (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* 타임라인 라인 */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* 타임라인 포인트 */}
          <div className="absolute left-6 top-6 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
          
          <div className="ml-16 group cursor-pointer" onClick={(e) => handleServiceClick(service, e)}>
            <Card className={cn(
              currentConfig.cardWidth,
              currentConfig.cardHeight,
              "overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            )}>
              <CardContent className="p-0 h-full">
                <div className="flex items-center h-full">
                  <div className="flex-shrink-0 w-20 h-20 m-2 rounded-xl overflow-hidden">
                    {service.ogData?.image || service.thumbnailUrl ? (
                      <img 
                        src={service.ogData?.image || service.thumbnailUrl} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${categoryGradient} flex items-center justify-center`}>
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 px-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      <Badge className={`bg-gradient-to-r ${categoryGradient} text-white text-xs px-2 py-1`}>
                        {service.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(service.lastUsed || new Date())}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>{service.usageCount} 사용</span>
                        </div>
                      </div>
                      
                      {service.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{service.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      );
    }

    // 🎯 매거진 뷰
    if (viewMode === 'magazine') {
      const isMainArticle = index === 0;
      
      return (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "group cursor-pointer",
            isMainArticle ? "col-span-2 row-span-2" : ""
          )}
          onClick={(e) => handleServiceClick(service, e)}
        >
          <Card className={cn(
            currentConfig.cardWidth,
            isMainArticle ? "h-96" : currentConfig.cardHeight,
            "overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
          )}>
            <div className="relative h-full">
              {/* 배경 이미지 */}
              {service.ogData?.image || service.thumbnailUrl ? (
                <img 
                  src={service.ogData?.image || service.thumbnailUrl} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryGradient}`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              )}
              
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* 상태 배지들 */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {service.isPopular && (
                  <Badge className="bg-yellow-500/90 backdrop-blur-sm text-white text-xs px-2 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    추천
                  </Badge>
                )}
                {service.isTrending && (
                  <Badge className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    인기
                  </Badge>
                )}
              </div>

              {/* 카테고리 배지 */}
              <div className="absolute top-4 right-4">
                <Badge className={`bg-gradient-to-r ${categoryGradient}/90 backdrop-blur-sm text-white text-xs px-2 py-1`}>
                  {service.category}
                </Badge>
              </div>

              {/* 콘텐츠 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    {service.ogData?.favicon || service.iconUrl ? (
                      <img 
                        src={service.ogData?.favicon || service.iconUrl} 
                        alt={service.name}
                        className="w-6 h-6 object-cover rounded"
                      />
                    ) : (
                      <Globe className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-bold text-white mb-1 line-clamp-1",
                      isMainArticle ? "text-2xl" : "text-lg"
                    )}>
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                      <span>{service.domain}</span>
                      {service.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{service.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {currentConfig.showDescription && (
                  <p className={cn(
                    "text-white/90 line-clamp-2 mb-4",
                    isMainArticle ? "text-base" : "text-sm"
                  )}>
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>{service.usageCount} 사용</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(service.lastUsed || new Date())}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 w-8 h-8 p-0">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 w-8 h-8 p-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 w-8 h-8 p-0">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    // 🎯 기본 카드 뷰 (compact, medium, large, cards)
    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group cursor-pointer"
        onClick={(e) => handleServiceClick(service, e)}
      >
        <Card className={cn(
          currentConfig.cardWidth,
          currentConfig.cardHeight,
          "overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:scale-105 bg-white/80 backdrop-blur-sm",
          viewMode === 'cards' && "shadow-2xl hover:shadow-3xl"
        )}>
          <CardContent className="p-0 h-full">
            <div className="h-full flex flex-col">
              {/* 썸네일 영역 */}
              <div className="relative">
                <div className={cn(
                  currentConfig.thumbnailHeight,
                  "bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative"
                )}>
                  {service.ogData?.image || service.thumbnailUrl ? (
                    <img 
                      src={service.ogData?.image || service.thumbnailUrl} 
                      alt={service.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${categoryGradient} flex items-center justify-center`}>
                      <Globe className="w-8 h-8 text-white/80" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* 플로팅 아이콘 */}
                <div className={cn(
                  currentConfig.iconSize,
                  "absolute -bottom-3 left-3 rounded-lg bg-white shadow-lg border-2 border-white overflow-hidden flex items-center justify-center"
                )}>
                  {service.ogData?.favicon || service.iconUrl ? (
                    <img 
                      src={service.ogData?.favicon || service.iconUrl} 
                      alt={service.name}
                      className="w-5 h-5 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=32`;
                      }}
                    />
                  ) : (
                    <Globe className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* 상태 배지들 */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {service.isPopular && (
                    <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                      <Crown className="w-2.5 h-2.5" />
                    </Badge>
                  )}
                  {service.isTrending && (
                    <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />
                    </Badge>
                  )}
                </div>

                {/* 외부 링크 아이콘 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
                    <ExternalLink className="w-3 h-3 text-gray-600" />
                  </div>
                </div>

                {/* 사용 횟수 배지 */}
                {service.usageCount && service.usageCount > 0 && (
                  <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                      {service.usageCount > 99 ? '99+' : service.usageCount}
                    </Badge>
                  </div>
                )}
              </div>

              {/* 콘텐츠 영역 */}
              <div className="flex-1 pt-4 px-3 pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={cn(
                    currentConfig.titleSize,
                    "font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors flex-1 min-w-0"
                  )}>
                    {service.name}
                  </h3>
                  {service.rating && currentConfig.showStats && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{service.rating}</span>
                    </div>
                  )}
                </div>
                
                {currentConfig.showDescription && (
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                )}

                {currentConfig.showStats && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {service.domain}
                      </Badge>
                      <Badge className={`bg-gradient-to-r ${categoryGradient} text-white text-xs px-1.5 py-0.5`}>
                        {service.category}
                      </Badge>
                    </div>
                    
                    {service.lastUsed && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(service.lastUsed)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section className="space-y-6 relative">
      {/* 🎨 향상된 헤더 */}
      <div className="flex flex-col space-y-4">
        {/* 상단 통계 및 컨트롤 */}
        <div className="flex items-center justify-between">
          {/* 왼쪽: 통계 정보 */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{services.length}개</span> 서비스
            </div>
            {selectedCategory && (
              <Badge variant="outline" className="text-xs">
                {selectedCategory} 필터 적용
              </Badge>
            )}
          </div>

          {/* 오른쪽: 뷰 모드 선택 */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewModePanel}
              className={cn(
                "flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 transition-all duration-300",
                showViewModePanel && "bg-blue-50 border-blue-300 text-blue-700"
              )}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">뷰 모드</span>
              <Badge variant="secondary" className="text-xs">
                {viewModeOptions.find(v => v.value === viewMode)?.label}
              </Badge>
              {showViewModePanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* 카테고리 필터 */}
            <div className="flex items-center space-x-1">
              {['all', 'productivity', 'design', 'development', 'ai', 'communication'].map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === (category === 'all' ? null : category) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(category === 'all' ? null : category)}
                  className={cn(
                    "text-xs h-7 px-3 transition-all duration-300",
                    selectedCategory === (category === 'all' ? null : category) && 
                    `bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || 'from-gray-500 to-gray-600'} text-white hover:opacity-90`
                  )}
                >
                  {category === 'all' ? '전체' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">정렬:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="usage">사용량순</option>
              <option value="recent">최근순</option>
              <option value="name">이름순</option>
              <option value="rating">평점순</option>
            </select>
          </div>
        </div>

        {/* 🎯 개선된 뷰 모드 패널 */}
        <AnimatePresence>
          {showViewModePanel && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg relative overflow-hidden"
            >
              {/* 배경 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50" />
              
              {/* 헤더 */}
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">뷰 모드 선택</h3>
                    <p className="text-xs text-gray-600">원하는 레이아웃을 선택하세요</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* 핀 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePin}
                    className={cn(
                      "w-8 h-8 p-0 transition-all duration-300",
                      isViewModePinned 
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    )}
                    title={isViewModePinned ? "패널 고정 해제" : "패널 고정"}
                  >
                    {isViewModePinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                  </Button>
                  
                  {/* 닫기 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowViewModePanel(false)}
                    className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 뷰 모드 옵션들 */}
              <div className="relative grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {viewModeOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  const isActive = viewMode === option.value;
                  
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => handleViewModeSelect(option.value)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden",
                        "transform hover:scale-105 active:scale-95",
                        isActive
                          ? `bg-gradient-to-br ${option.gradient} text-white border-white/30 shadow-lg scale-105`
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {/* 활성 상태 글로우 효과 */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                      )}
                      
                      <div className="relative">
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-semibold mb-1">{option.label}</div>
                        <div className="text-xs opacity-80">{option.description}</div>
                        
                        {/* 선택된 옵션 체크마크 */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* 하단 정보 */}
              <div className="relative mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    <span>현재 뷰: <strong>{viewModeOptions.find(v => v.value === viewMode)?.label}</strong></span>
                  </div>
                  {isViewModePinned && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Pin className="w-3 h-3" />
                      <span>패널 고정됨</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🎨 메인 콘텐츠 렌더링 */}
      <div className="relative">
        {/* 스와이퍼 레이아웃 */}
        {['compact', 'medium', 'large', 'cards'].includes(viewMode) && (
          <div className="relative">
            <Swiper
              ref={swiperRef}
              modules={viewMode === 'cards' ? [Navigation, FreeMode, EffectCards] : [Navigation, FreeMode]}
              spaceBetween={currentConfig.spaceBetween}
              slidesPerView="auto"
              freeMode={true}
              effect={viewMode === 'cards' ? 'cards' : undefined}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              className="!overflow-visible"
            >
              {sortedServices.map((service, index) => (
                <SwiperSlide key={service.id} style={{ width: 'auto' }}>
                  {renderServiceCard(service, index)}
                </SwiperSlide>
              ))}
              
              {/* 인라인 추가 버튼 (스와이퍼용) */}
              <SwiperSlide style={{ width: 'auto' }}>
                {renderInlineAddServiceCard()}
              </SwiperSlide>
            </Swiper>

            {/* 네비게이션 버튼 */}
            {currentConfig.slidesPerView !== undefined && sortedServices.length > (currentConfig.slidesPerView as number) && (
              <>
                <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:bg-gray-50 group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:bg-gray-50 group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* 그리드 레이아웃 */}
        {viewMode === 'grid' && (
          <div className={currentConfig.containerClass}>
            {sortedServices.map((service, index) => renderServiceCard(service, index))}
            {renderInlineAddServiceCard()}
          </div>
        )}

        {/* 리스트 레이아웃 */}
        {viewMode === 'list' && (
          <div className={currentConfig.containerClass}>
            {sortedServices.map((service, index) => renderServiceCard(service, index))}
            {renderInlineAddServiceCard()}
          </div>
        )}

        {/* 갤러리 레이아웃 */}
        {viewMode === 'gallery' && (
          <div className={currentConfig.containerClass}>
            {sortedServices.map((service, index) => renderServiceCard(service, index))}
            {renderInlineAddServiceCard()}
          </div>
        )}

        {/* 타임라인 레이아웃 */}
        {viewMode === 'timeline' && (
          <div className="relative">
            <div className={currentConfig.containerClass}>
              {sortedServices.map((service, index) => renderServiceCard(service, index))}
            </div>
            
            {/* 타임라인용 별도 추가 버튼 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sortedServices.length * 0.1 }}
              className="relative mt-6"
            >
              {/* 타임라인 라인 연장 */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500 to-transparent"></div>
              
              {/* 타임라인 포인트 */}
              <div className="absolute left-6 top-6 w-4 h-4 bg-gradient-to-br from-pink-500 to-red-600 rounded-full border-4 border-white shadow-lg"></div>
              
              <div className="ml-16">
                {renderInlineAddServiceCard()}
              </div>
            </motion.div>
          </div>
        )}

        {/* 매거진 레이아웃 */}
        {viewMode === 'magazine' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedServices.map((service, index) => renderServiceCard(service, index))}
            </div>
            
            {/* 매거진용 특별 추가 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sortedServices.length * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Card className="w-full h-48 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 bg-gray-50/50">
                <CardContent className="h-full flex flex-col items-center justify-center space-y-4 p-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 group-hover:scale-110">
                    {loadingServices.size > 0 ? (
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    ) : (
                      <Plus className="w-8 h-8 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      새로운 서비스 발견하기
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md">
                      URL을 입력하면 자동으로 서비스 정보를 가져와 컬렉션에 추가합니다
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>빠른 추가</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <Globe className="w-3 h-3" />
                    <span>자동 인식</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>

      {/* 🎨 플로팅 추가 버튼 - 모든 뷰 모드에서 사용 가능 */}
      {renderFloatingAddButton()}

      {/* 🎨 향상된 서비스 추가 모달 */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExternalService={handleAddExternalService}
        onAddInternalServices={handleAddInternalServices}
      />

      {/* 🎨 빈 상태 처리 */}
      {sortedServices.length === 0 && selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedCategory} 카테고리에 서비스가 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            다른 카테고리를 선택하거나 새로운 서비스를 추가해보세요
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              전체 보기
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              서비스 추가
            </Button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default FavoriteServices;