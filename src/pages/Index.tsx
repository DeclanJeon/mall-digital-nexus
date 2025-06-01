import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { BookmarkItem } from '@/components/navigation/SearchAndFilterBar';
import EcosystemMap from '@/components/map/EcosystemMap';
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
  Bell, BellOff, Lock, Unlock, Sun, Moon, Wifi, WifiOff, Battery, Bluetooth
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
import FavoriteServicesSection from '@/components/peer-space/sections/FavoriteServicesSection';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

// 🎨 Z세대 감성의 뷰어 모드 타입 - 더 다양하고 트렌디하게
type ViewMode = 'grid' | 'list' | 'gallery' | 'blog' | 'magazine' | 'timeline' | 'news' | 'cards' | 'mosaic' | 'story';

// 🎯 섹션별 뷰어 상태 타입
interface SectionViewModes {
  newMalls: ViewMode;
  allMalls: ViewMode;
  products: ViewMode;
}

// 🌈 Z세대 감성 디자인 토큰 - 완전히 새로운 차원


// 🎨 확장된 뷰 모드 옵션 - Z세대 감성 업그레이드
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
  { 
    value: 'cards' as ViewMode, 
    label: '카드', 
    icon: Layers, 
    description: '인스타그램 스타일',
    gradient: 'from-pink-500 to-rose-500',
    bestFor: '시각적 임팩트',
    emoji: '💳'
  },
  { 
    value: 'mosaic' as ViewMode, 
    label: '모자이크', 
    icon: LayoutGrid, 
    description: '핀터레스트 느낌',
    gradient: 'from-purple-500 to-indigo-500',
    bestFor: '창의적 탐색',
    emoji: '🎨'
  },
  { 
    value: 'story' as ViewMode, 
    label: '스토리', 
    icon: Play, 
    description: '스토리 형태',
    gradient: 'from-orange-500 to-red-500',
    bestFor: '몰입감',
    emoji: '📚'
  },
  { 
    value: 'list' as ViewMode, 
    label: '리스트', 
    icon: List, 
    description: '상세 정보 중심',
    gradient: 'from-green-500 to-emerald-500',
    bestFor: '정보 중심',
    emoji: '📋'
  },
  { 
    value: 'gallery' as ViewMode, 
    label: '갤러리', 
    icon: Image, 
    description: '이미지 중심',
    gradient: 'from-purple-500 to-pink-500',
    bestFor: '시각적 탐색',
    emoji: '🖼️'
  },
  { 
    value: 'news' as ViewMode, 
    label: '뉴스', 
    icon: Newspaper, 
    description: '뉴스피드 스타일',
    gradient: 'from-red-500 to-orange-500',
    bestFor: '실시간 업데이트',
    emoji: '📰'
  },
  { 
    value: 'timeline' as ViewMode, 
    label: '타임라인', 
    icon: Calendar, 
    description: '시간순 정렬',
    gradient: 'from-teal-500 to-blue-500',
    bestFor: '시간 기반',
    emoji: '⏰'
  }
];

// 🎯 미래지향적 뷰어 모드 선택 컴포넌트
const FuturisticViewModeSelector = ({ 
  currentMode, 
  onModeChange, 
  sectionTitle,
  itemCount,
  compact = false 
}: {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  sectionTitle: string;
  itemCount: number;
  compact?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const currentOption = viewModeOptions.find(opt => opt.value === currentMode);

  return (
    <div className="relative">
      {compact ? (
        // 🚀 컴팩트 모드 - 네온 사이버펑크 스타일
        <div className="flex items-center space-x-2">
          {/* 현재 모드 표시 */}
          <motion.div 
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className={`p-1 rounded-lg bg-gradient-to-r ${currentOption?.gradient}`}>
              {currentOption && <currentOption.icon className="w-4 h-4 text-white" />}
            </div>
            <span className="text-xs font-medium text-gray-300 hidden sm:inline">
              {currentOption?.emoji} {currentOption?.label}
            </span>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs px-2 py-0.5">
              {itemCount}
            </Badge>
          </motion.div>

          {/* 뷰 모드 선택 버튼들 */}
          <div className="flex items-center space-x-1">
            {viewModeOptions.slice(0, 4).map((option, index) => {
              const IconComponent = option.icon;
              const isActive = currentMode === option.value;
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => onModeChange(option.value)}
                  onHoverStart={() => setHoveredMode(option.value)}
                  onHoverEnd={() => setHoveredMode(null)}
                  className={cn(
                    "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden",
                    isActive 
                      ? `bg-gradient-to-r ${option.gradient} shadow-lg shadow-${option.gradient.split('-')[1]}-500/25` 
                      : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IconComponent className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    isActive ? "text-white" : "text-gray-400"
                  )} />
                  
                  {/* 네온 글로우 효과 */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-30 blur-xl`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* 호버 툴팁 */}
                  <AnimatePresence>
                    {hoveredMode === option.value && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg text-xs text-white whitespace-nowrap z-50 shadow-xl"
                      >
                        <div className="text-center">
                          <div className="font-medium">{option.emoji} {option.label}</div>
                          <div className="text-gray-400 text-xs">{option.bestFor}</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}

            {/* 더 많은 옵션 버튼 */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>

          {/* 확장 메뉴 */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full right-0 mt-3 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-4 min-w-[280px]"
              >
                <div className="grid grid-cols-2 gap-3">
                  {viewModeOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    const isActive = currentMode === option.value;
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          onModeChange(option.value);
                          setIsExpanded(false);
                        }}
                        className={cn(
                          "p-3 rounded-xl transition-all duration-300 text-left group relative overflow-hidden",
                          isActive 
                            ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg` 
                            : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/30 hover:border-gray-600/50"
                        )}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "p-2 rounded-lg transition-all duration-300",
                            isActive 
                              ? "bg-white/20" 
                              : "bg-gray-700/50 group-hover:bg-gray-600/50"
                          )}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center space-x-1">
                              <span>{option.emoji}</span>
                              <span>{option.label}</span>
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        
                        {/* 배경 그라디언트 효과 */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // 풀 사이즈 뷰어 (기존 유지하되 업그레이드)
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>보기 방식</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {sectionTitle} · {itemCount}개 · <span className="font-medium">{currentOption?.emoji} {currentOption?.label}</span>
              </p>
            </div>
            
            <motion.button
              onClick={() => onModeChange('grid')}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200"
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              title="그리드 뷰로 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {viewModeOptions.map((option, index) => {
              const IconComponent = option.icon;
              const isActive = currentMode === option.value;
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => onModeChange(option.value)}
                  className={cn(
                    "p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isActive 
                      ? `bg-gradient-to-r ${option.gradient} text-white shadow-xl` 
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
                  )}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-center space-y-2">
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all duration-300",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                    )}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-sm flex items-center justify-center space-x-1">
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </div>
                      <div className={cn(
                        "text-xs mt-1 transition-colors duration-300",
                        isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                      )}>
                        {option.bestFor}
                      </div>
                    </div>
                  </div>
                  
                  {/* 활성 상태 효과 */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 차세대 뷰어 렌더러 - 완전히 새로운 차원
const NextGenViewRenderer = ({ 
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // 🎯 기본 아이템 렌더러
  const renderBaseItem = (item: Peermall | Product, className?: string, variant: 'default' | 'card' | 'minimal' | 'featured' = 'default') => {
    const isProduct = type === 'product';
    const title = isProduct ? (item as Product).name : (item as Peermall).peerMallName;
    const description = isProduct ? (item as Product).description : (item as Peermall).description;
    const imageUrl = isProduct 
      ? (item as Product).imageUrl 
      : (item as Peermall).profileImage || (item as Peermall).bannerImage;
    const itemId = isProduct ? (item as Product).productKey : (item as Peermall).peerMallKey || (item as Peermall).id;
    const price = isProduct ? (item as Product).price : null;
    const rating = !isProduct ? (item as Peermall).rating || 0 : null;
    const likes = !isProduct ? (item as Peermall).likes || 0 : null;

    const handleClick = () => {
      if (isProduct) {
        onDetailView?.((item as Product).productKey);
      } else {
        navigate(`/space/${(item as Peermall).peerMallName}?mk=${(item as Peermall).peerMallKey}`);
      }
    };

    // 🎨 카드 스타일 렌더링
    if (variant === 'card') {
      return (
        <motion.div
          className={cn(
            "group relative bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl overflow-hidden cursor-pointer",
            zGenDesignTokens.effects.floating,
            className
          )}
          onClick={handleClick}
          onHoverStart={() => setHoveredItem(itemId)}
          onHoverEnd={() => setHoveredItem(null)}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          layout
        >
          {/* 🖼️ 이미지 영역 */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {imageUrl ? (
              <motion.img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                whileHover={{ scale: 1.1 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 flex items-center justify-center">
                <div className="text-center">
                  {isProduct ? (
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  ) : (
                    <Store className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  )}
                  <span className="text-sm text-gray-500 font-medium">
                    {isProduct ? '상품 이미지' : '피어몰'}
                  </span>
                </div>
              </div>
            )}
            
            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 상단 배지 */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                {!isProduct && (item as Peermall).featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-3 py-1 shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    인기
                  </Badge>
                )}
                {isProduct && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 text-xs px-3 py-1 shadow-lg">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    상품
                  </Badge>
                )}
              </div>
              
              {/* 액션 버튼들 */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // 좋아요 기능
                  }}
                >
                  <Heart className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // 공유 기능
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* 하단 정보 */}
            <div className="absolute bottom-4 left-4 right-4">
              {rating !== null && (
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
                  </div>
                  {likes !== null && likes > 0 && (
                    <div className="flex items-center space-x-1 bg-red-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                      <Heart className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-medium">{likes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 📝 콘텐츠 영역 */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                {title}
              </h3>
              {description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {/* 가격 및 메타 정보 */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              {price !== null ? (
                <div className="text-right">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₩{price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 1000)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 100)}</span>
                  </div>
                </div>
              )}
              
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <span className="flex items-center space-x-1">
                  <span>{isProduct ? '구매하기' : '둘러보기'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            </div>
          </div>

          {/* 호버 시 네온 효과 */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none"
            animate={hoveredItem === itemId ? { opacity: [0, 1, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      );
    }

    // 🎨 미니멀 스타일 렌더링
    if (variant === 'minimal') {
      return (
        <motion.div
          className={cn(
            "group relative p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 cursor-pointer transition-all duration-300",
            className
          )}
          onClick={handleClick}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                isProduct ? <ShoppingBag className="w-8 h-8 text-gray-400" /> : <Store className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                {description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>방금 전</span>
                </div>
                {price !== null && (
                  <span className="text-lg font-bold text-blue-600">
                    ₩{price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </motion.div>
      );
    }

    // 기본 렌더링 (기존 방식 유지하되 스타일 업그레이드)
    return (
      <motion.div
        className={cn(
          "group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer",
          zGenDesignTokens.effects.floating,
          className
        )}
        onClick={handleClick}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 기존 PeermallCard 또는 ProductCard 렌더링 로직 */}
        {isProduct ? (
          <div className="p-6">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">₩{price?.toLocaleString()}</span>
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

  // 🎯 뷰 모드별 렌더링
  switch (viewMode) {
    case 'cards':
      return (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={zGenDesignTokens.animations.staggerChildren}
          initial="initial"
          animate="animate"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              variants={zGenDesignTokens.animations.fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              {renderBaseItem(item, "", 'card')}
            </motion.div>
          ))}
        </motion.div>
      );

    case 'mosaic':
      return (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {renderBaseItem(item, cn(
                "mb-6",
                index % 3 === 0 && "h-80",
                index % 3 === 1 && "h-96", 
                index % 3 === 2 && "h-72"
              ), 'card')}
            </motion.div>
          ))}
        </div>
      );

    case 'story':
      return (
        <div className="space-y-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              className="relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className={cn(
                "flex items-center space-x-8",
                index % 2 === 1 && "flex-row-reverse space-x-reverse"
              )}>
                <div className="flex-1">
                  {renderBaseItem(item, "max-w-2xl", 'featured')}
                </div>
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {renderBaseItem(item, "", 'minimal')}
            </motion.div>
          ))}
        </div>
      );

    case 'gallery':
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id || (item as Product).productKey}
              className="aspect-square"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              {renderBaseItem(item, "h-full", 'card')}
            </motion.div>
          ))}
        </div>
      );

    case 'timeline':
      return (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500" />
          <div className="space-y-12">
            {items.map((item, index) => (
              <motion.div
                key={item.id || (item as Product).productKey}
                className="relative flex items-start space-x-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-xl z-10"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <div className="flex-1 min-w-0 -mt-2">
                  {renderBaseItem(item, "", 'card')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'news':
      if (items.length === 0) return null;
      
      const mainItem = items[0];
      const subItems = items.slice(1, 4);
      const listItems = items.slice(4);

      return (
        <div className="space-y-8">
          {/* 헤드라인 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              {...zGenDesignTokens.animations.fadeInUp}
            >
              {renderBaseItem(mainItem, "h-full min-h-[400px]", 'featured')}
            </motion.div>
            
            <div className="space-y-6">
              {subItems.map((item, index) => (
                <motion.div
                  key={item.id || (item as Product).productKey}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {renderBaseItem(item, "", 'minimal')}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 추가 항목들 */}
          {listItems.length > 0 && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Newspaper className="w-5 h-5" />
                  <span>더 많은 {type === 'peermall' ? '피어몰' : '상품'}</span>
                </h3>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listItems.map((item, index) => (
                  <motion.div
                    key={item.id || (item as Product).productKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.8 }}
                  >
                    {renderBaseItem(item, "", 'minimal')}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      );

    default: // grid
      return (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
              {renderBaseItem(item)}
            </motion.div>
          ))}
        </motion.div>
      );
  }
};

// 🚀 메인 컴포넌트 - 완전히 새로운 차원의 UX
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
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

  // 🎨 섹션별 뷰어 모드 상태 관리
  const [sectionViewModes, setSectionViewModes] = useState<SectionViewModes>({
    newMalls: 'cards',
    allMalls: 'grid',
    products: 'cards'
  });

  // 🌊 스크롤 기반 애니메이션
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // 🎯 섹션별 뷰어 모드 변경 핸들러
  const handleSectionViewModeChange = useCallback((section: keyof SectionViewModes, mode: ViewMode) => {
    setSectionViewModes(prev => ({
      ...prev,
      [section]: mode
    }));
    
    localStorage.setItem(`viewMode_${section}`, mode);
    
    // 🎉 모드 변경 토스트
    toast({
      title: "🎨 뷰 모드 변경됨",
      description: `${section === 'newMalls' ? '신규 피어몰' : section === 'allMalls' ? '전체 피어몰' : '상품'} 뷰가 ${viewModeOptions.find(opt => opt.value === mode)?.emoji} ${viewModeOptions.find(opt => opt.value === mode)?.label} 모드로 변경되었습니다.`,
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
    setFilteredMalls(searchedPeerMalls);
  }, [peermalls, originPeerMalls, filteredMalls]);

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

  const handleCloseMap = useCallback(() => setIsMapOpen(false), []);

  const handleOpenMySpaces = useCallback(() => setIsMySpacesOpen(true), []);
  const handleCloseMySpaces = useCallback(() => setIsMySpacesOpen(false), []);

  const handleSelectSpace = useCallback((id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  }, [navigate, handleCloseMySpaces]);

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
    .slice(0, 8), [peermalls]);

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
  }, [peermalls, navigate]);

  // 🌙 다크모드 토글
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newDarkMode ? "🌙 다크모드 활성화" : "☀️ 라이트모드 활성화",
      description: `${newDarkMode ? '어두운' : '밝은'} 테마로 변경되었습니다.`,
      duration: 2000,
    });
  };

  // 로딩 상태 렌더링 - 사이버펑크 스타일
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <motion.div
          className="text-center"
          {...zGenDesignTokens.animations.scaleIn}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse mx-auto" />
          </div>
          <h2 className={zGenDesignTokens.typography.title}>피어몰 로딩 중...</h2>
          <p className={zGenDesignTokens.typography.caption}>잠시만 기다려주세요 ✨</p>
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
      {/* 🌟 히어로 섹션 - 완전히 새로운 차원 */}
      {/* <MainHeroSection /> */}

      {/* 🎯 메인 콘텐츠 */}
      <main className="relative z-10 px-4 py-16" id="explore-section">
        
        {/* 🌟 즐겨찾기 서비스 섹션 */}
        {isLoggedIn && (
          <FavoriteServicesSection />
        )}

        {/* 🔍 검색 및 필터 바 - 향상된 디자인 */}
        <motion.section 
          className="mb-16 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={cn(
            "relative overflow-hidden rounded-3xl p-6",
            zGenDesignTokens.effects.glass,
            "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    스마트 검색 & 필터 🔍
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    원하는 피어몰과 상품을 빠르게 찾아보세요
                  </p>
                </div>
              </div>
              
              {/* 다크모드 토글 */}
              <motion.button
                onClick={toggleDarkMode}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  isDarkMode 
                    ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/25" 
                    : "bg-gray-800 text-white shadow-lg shadow-gray-800/25"
                )}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
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
          </div>
        </motion.section>

        {/* 📊 메인 콘텐츠 그리드 */}
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* 🎯 상단 섹션: 신규 피어몰 + 피어맵 */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* ✨ 신규 피어몰 섹션 */}
            <motion.div 
              className="xl:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={cn(
                "relative overflow-hidden rounded-3xl p-8 h-full min-h-[600px]",
                zGenDesignTokens.effects.glass,
                "bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20"
              )}>
                <div className="relative z-10 h-full flex flex-col">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          ✨ 신규 피어몰
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          따끈따끈한 새로운 피어몰들을 만나보세요
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 px-3 py-1">
                        {newestMalls.length}개
                      </Badge>
                      <FuturisticViewModeSelector
                        currentMode={sectionViewModes.newMalls}
                        onModeChange={(mode) => handleSectionViewModeChange('newMalls', mode)}
                        sectionTitle="신규 피어몰"
                        itemCount={newestMalls.length}
                        compact={true}
                      />
                    </div>
                  </div>
                  
                  {/* 콘텐츠 */}
                  <div className="flex-1 overflow-hidden">
                    {newestMalls.length > 0 ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={sectionViewModes.newMalls}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="h-full overflow-y-auto pr-2 -mr-2"
                        >
                          <NextGenViewRenderer
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
                        <div className="text-center">
                          <motion.div 
                            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-12 h-12 text-green-500" />
                          </motion.div>
                          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            새로운 피어몰을 기다리고 있어요
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            지금 바로 피어몰을 만들어 첫 번째 신규 피어몰이 되어보세요! ✨
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
              </div>
            </motion.div>

            {/* 🗺️ 피어맵 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={cn(
                "relative overflow-hidden rounded-3xl h-full min-h-[600px]",
                zGenDesignTokens.effects.glass,
                "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20"
              )}>
                <div className="relative z-10 h-full flex flex-col">
                  {/* 헤더 */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                           <Map className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            🗺️ 피어맵
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            피어몰 위치 탐색
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs px-2 py-1">
                        {allLocations.length}개 위치
                      </Badge>
                    </div>
                  </div>
                  
                  {/* 지도 영역 */}
                  <div className="flex-1 overflow-hidden rounded-b-3xl">
                    <EcosystemMap onLocationSelect={handleLocationSelect} />
                  </div>
                </div>
                
                {/* 배경 장식 */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </section>

          {/* 🎯 중간 섹션: 전체 피어몰 + 커뮤니티 피드 */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* 🏢 전체 피어몰 섹션 */}
            <motion.div 
              className="xl:col-span-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={cn(
                "relative overflow-hidden rounded-3xl h-full min-h-[800px]",
                zGenDesignTokens.effects.glass,
                "bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80"
              )}>
                <div className="relative z-10 h-full flex flex-col">
                  {/* 헤더 */}
                  <div className="p-8 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-gray-600 rounded-2xl flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            🏢 전체 피어몰
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            모든 피어몰을 다양한 방식으로 탐색해보세요
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-3 py-1">
                          총 {peermalls.length}개
                        </Badge>
                        
                        <motion.button
                          onClick={handleRefresh}
                          disabled={refreshing}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 disabled:opacity-50"
                          whileHover={{ scale: 1.05, rotate: 180 }}
                          whileTap={{ scale: 0.95 }}
                          title="새로고침"
                        >
                          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                        </motion.button>
                        
                        <FuturisticViewModeSelector
                          currentMode={sectionViewModes.allMalls}
                          onModeChange={(mode) => handleSectionViewModeChange('allMalls', mode)}
                          sectionTitle="전체 피어몰"
                          itemCount={peermalls.length}
                          compact={true}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 콘텐츠 */}
                  <div className="flex-1 px-8 pb-8 overflow-hidden">
                    {peermalls.length > 0 ? (
                      <div className="h-full flex flex-col space-y-6">
                        {/* 검색 결과 정보 */}
                        {searchQuery && (
                          <motion.div 
                            className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 bg-blue-50/80 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <Search className="w-4 h-4" />
                            <span>
                              '<strong className="text-blue-600 dark:text-blue-400">{searchQuery}</strong>' 검색 결과: {peermalls.length}개
                            </span>
                          </motion.div>
                        )}
                        
                        {/* 활성 필터 표시 */}
                        {(selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) && (
                          <motion.div 
                            className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/30"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <Filter className="w-4 h-4" />
                            <span>활성 필터:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedHashtags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs bg-white dark:bg-gray-800">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        
                        {/* 피어몰 뷰 렌더러 */}
                        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={sectionViewModes.allMalls}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.5 }}
                            >
                              <NextGenViewRenderer
                                items={peermalls}
                                viewMode={sectionViewModes.allMalls}
                                type="peermall"
                                onOpenMap={handleOpenMap}
                                onShowQrCode={handleShowPeermallQrCode}
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <motion.div 
                            className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Store className="w-12 h-12 text-slate-400" />
                          </motion.div>
                          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            {searchQuery ? '검색 결과가 없습니다' : '아직 피어몰이 없어요'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                            {searchQuery 
                              ? `'${searchQuery}'에 대한 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해보세요.`
                              : '첫 번째 피어몰을 만들어 커뮤니티를 시작해보세요! 당신의 아이디어가 새로운 연결을 만들어낼 거예요.'
                            }
                          </p>
                          <motion.button
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {searchQuery ? '검색 초기화' : '피어몰 만들기'}
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-400/5 to-gray-400/5 rounded-full blur-3xl" />
              </div>
            </motion.div>

            {/* 🌟 커뮤니티 피드 */}
            
          </section>

          {/* 🛍️ 전체 상품 보기 섹션 */}
          <motion.section 
            className="grid grid-cols-1 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={cn(
              "relative overflow-hidden rounded-3xl p-8",
              zGenDesignTokens.effects.glass,
              "bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20"
            )}>
              <div className="relative z-10">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        🛍️ 전체 상품 보기
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        피어몰에 등록된 모든 상품들을 만나보세요
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 px-3 py-1">
                      {products.length}개 상품
                    </Badge>
                    <FuturisticViewModeSelector
                      currentMode={sectionViewModes.products}
                      onModeChange={(mode) => handleSectionViewModeChange('products', mode)}
                      sectionTitle="전체 상품"
                      itemCount={products.length}
                      compact={true}
                    />
                  </div>
                </div>
                
                {/* 콘텐츠 */}
                {products.length > 0 ? (
                  <div className="space-y-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={sectionViewModes.products}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <NextGenViewRenderer
                          items={products}
                          viewMode={sectionViewModes.products}
                          type="product"
                          onDetailView={handleProductDetailView}
                        />
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                      <motion.div 
                        className="flex justify-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </motion.button>
                          
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
                            
                            const isActive = currentPage === pageNum;
                            
                            return (
                              <motion.button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-200",
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
                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <motion.div 
                      className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <ShoppingBag className="w-12 h-12 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      등록된 상품이 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      첫 번째 상품을 등록해보세요! 🛍️
                    </p>
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      상품 등록하기
                    </motion.button>
                  </div>
                )}
              </div>
              
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
            </div>
          </motion.section>
        </div>
      </main>

      {/* 🚀 플로팅 액션 버튼 */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Rocket className="w-8 h-8" />
        </motion.button>
      </motion.div>

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