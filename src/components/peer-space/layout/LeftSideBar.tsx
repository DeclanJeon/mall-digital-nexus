import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Home, Package, MessageSquare, Users, Mail, Settings, Sparkles, Star, Calendar, 
  Menu, X, Map, ShoppingBag, Globe, Navigation, Compass, MapPin, Heart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SectionType } from '@/types/space';
import { PeerSpaceHomeProps } from '@/types/space';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// SectionType에서 사용할 값들
const SECTIONS = {
  SPACE: 'space',
  PRODUCTS: 'products',
  COMMUNITY: 'community',
  MAP : 'peermap'
} as const;

type SectionKey = keyof typeof SECTIONS;
type SectionValue = typeof SECTIONS[SectionKey];

interface MenuItem {
  id: SectionValue;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  onClick: () => void;
  isActive?: boolean;
  gradient: string;
  description: string;
  emoji: string;
}

interface LeftSideBarProps {
  className?: string;
  customMenuItems?: MenuItem[];
  showDefaultMenus?: boolean;
  showSettingsMenu?: boolean;
  showHomeButton?: boolean;
  isOwner: boolean;
  onNavigateToSection?: (section: SectionType) => void;
}

const LeftSideBar: React.FC<LeftSideBarProps> = ({
  className,
  customMenuItems = [],
  showDefaultMenus = true,
  showSettingsMenu = true,
  showHomeButton = true,
  isOwner = false,
  onNavigateToSection
}) => {
  const navigate = useNavigate();
  const { address } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const peerMallKey = searchParams.get('mk') || '';
  const [config, setConfig] = useState(null);
  const [activeSection, setActiveSection] = useState('space');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 🎯 화면 높이 계산을 위한 상태
  const [headerHeight, setHeaderHeight] = useState(64); // 기본 헤더 높이
  const [mobileNavHeight, setMobileNavHeight] = useState(80); // 기본 모바일 네비 높이
  const [viewportHeight, setViewportHeight] = useState(0);

  // 🎯 뷰포트 높이 및 헤더 높이 계산
  useEffect(() => {
    const calculateHeights = () => {
      // 뷰포트 높이 계산 (모바일 주소창 고려)
      const vh = window.innerHeight;
      setViewportHeight(vh);
      
      // 헤더 높이 동적 계산
      const header = document.querySelector('header') || document.querySelector('[data-header]');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
      
      // 모바일 네비게이션 높이 계산
      const mobileNav = document.querySelector('[data-mobile-nav]');
      if (mobileNav) {
        setMobileNavHeight(mobileNav.getBoundingClientRect().height);
      }
    };

    // 초기 계산
    calculateHeights();
    
    // 리사이즈 시 재계산
    const handleResize = () => {
      calculateHeights();
    };
    
    // 오리엔테이션 변경 시 재계산 (모바일)
    const handleOrientationChange = () => {
      setTimeout(calculateHeights, 100); // 오리엔테이션 변경 후 약간의 지연
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // DOM 로드 후 재계산
    const timer = setTimeout(calculateHeights, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(timer);
    };
  }, []);

  // 🎯 계산된 높이 값들
  const sidebarHeight = `calc(100vh - ${headerHeight}px)`;
  const mobileContentHeight = `calc(100vh - ${headerHeight}px - ${mobileNavHeight}px)`;
  const mobileModalMaxHeight = `calc(100vh - 120px)`; // 상하 여백 고려

  // 🎯 URL에서 현재 섹션 파악
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentSection = (pathSegments[pathSegments.length - 1] || SECTIONS.SPACE) as SectionValue;
    setActiveSection(currentSection);
  }, [location.pathname]);

  // 🎯 피어몰 설정 정보 로드
  useEffect(() => {
    const loadPeerMallConfig = async () => {
      if (!address) return;
      
      try {
        const savedConfig = localStorage.getItem(`peer_mall_config_${address}`);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
        } else {
          setConfig({
            peerMallName: address,
            peerNumber: address?.slice(0, 8) + '...',
            profileImage: null
          });
        }
      } catch (error) {
        console.error('피어몰 설정 로드 실패:', error);
        setConfig({
          peerMallName: address,
          peerNumber: '알 수 없음',
          profileImage: null
        });
      }
    };

    loadPeerMallConfig();
  }, [address]);

  // 🎨 아이콘 통일된 기본 메뉴 아이템들
  const defaultMenuItems: MenuItem[] = [
    {
      id: SECTIONS.PRODUCTS,
      label: '상품',
      icon: ShoppingBag,
      path: `/space/${address}/products?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.PRODUCTS),
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      description: '멋진 상품들을 만나보세요',
      emoji: '🛍️'
    },
    {
      id: SECTIONS.COMMUNITY,
      label: '커뮤니티',
      icon: MessageSquare,
      path: `/space/${address}/community?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.COMMUNITY),
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      description: '소통과 나눔의 공간',
      emoji: '💬'
    },
    {
      id: SECTIONS.MAP,
      label: '피어맵',
      icon: Globe,
      path: `/space/${address}/peermap?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.MAP),
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      description: '전 세계 피어몰 탐험',
      emoji: '🗺️'
    }
  ];

  // 🎯 네비게이션 처리
  const handleNavigation = (section: SectionValue) => {
    console.log('🚀 네비게이션:', section);
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    
    if (onNavigateToSection) {
      onNavigateToSection(section as SectionType);
    }
    
    window.dispatchEvent(new CustomEvent('peerSpaceNavigation', {
      detail: { section, address, peerMallKey }
    }));

    if (section === 'space') {
      navigate(`/space/${address}${peerMallKey ? `?mk=${peerMallKey}` : ''}`);
    } else {
      navigate(`/space/${address}/${section}${peerMallKey ? `?mk=${peerMallKey}` : ''}`);
    }
  };

  // 🎯 퀵 액션 처리
  const handleQuickAction = (action: string) => {
    setIsMobileMenuOpen(false);
    toast({
      title: `${action} 기능 🚀`,
      description: '곧 출시될 예정이에요!',
    });
  };

  // 🎯 메시지 보내기
  const handleMessage = () => {
    setIsMobileMenuOpen(false);
    if (!address) {
      toast({
        title: '오류 발생 😅',
        description: '피어몰 주소를 찾을 수 없어요.',
        variant: 'destructive'
      });
      return;
    }

    window.dispatchEvent(new CustomEvent('openMessageModal', {
      detail: { recipientAddress: address, peerMallName: config?.peerMallName }
    }));

    toast({
      title: '메시지 창 열기 💬',
      description: `${config?.peerMallName || '피어몰'}에 메시지를 보내세요!`
    });
  };

  // 🎯 설정 페이지로 이동
  const handleSettings = () => {
    setIsMobileMenuOpen(false);
    if (!isOwner) {
      toast({
        title: '권한 없음 🚫',
        description: '피어몰 소유자만 설정을 변경할 수 있어요.',
        variant: 'destructive'
      });
      return;
    }
    navigate(`/space/${address}/settings?mk=${peerMallKey}`);
  };

  // 🎯 홈으로 가기
  const handleGoHome = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // 🎯 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 로딩 스켈레톤
  if (!config) {
    return (
      <>
        {/* 🖥️ 데스크톱 스켈레톤 - 정확한 높이 계산 */}
        <aside 
          className="hidden lg:block w-72 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-r border-gray-200/60 sticky top-0 overflow-y-auto"
          style={{ height: sidebarHeight }}
        >
          <div className="p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </aside>
        
        {/* 📱 모바일 스켈레톤 - 정확한 높이 계산 */}
        <div 
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 z-50"
          data-mobile-nav
          style={{ height: `${mobileNavHeight}px` }}
        >
          <div className="flex justify-around py-3 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 🖥️ 데스크톱 사이드바 - 정확한 높이 계산 */}
      <aside 
        className={cn(
          "hidden lg:flex lg:flex-col w-72 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-r border-gray-200/60 sticky top-0 backdrop-blur-xl h-full overflow-hidden",
          className
        )}
        style={{ height: sidebarHeight }}
      >
        {/* 🎯 메인 네비게이션 - 정확한 스크롤 영역 계산 */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          <nav className="space-y-3">
            {showDefaultMenus && defaultMenuItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={item.onClick}
                  className={cn(
                    "w-full group relative overflow-hidden rounded-2xl transition-all duration-300",
                    isActive 
                      ? "bg-white shadow-lg shadow-gray-200/60 border border-gray-200/60" 
                      : "hover:bg-white/60 hover:shadow-md hover:shadow-gray-200/40"
                  )}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* 배경 그라데이션 */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r transition-opacity duration-300",
                    item.gradient,
                    isActive ? "opacity-5" : "opacity-0 group-hover:opacity-5"
                  )} />
                  
                  <div className="relative flex items-center space-x-4 p-4">
                    <motion.div 
                      className={cn(
                        "p-3 rounded-xl shadow-sm transition-all duration-300",
                        isActive 
                          ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                          : `bg-gradient-to-r ${item.gradient} opacity-80 group-hover:opacity-100 group-hover:shadow-md`
                      )}
                      whileHover={{ rotate: 5 }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {item.label}
                        </span>
                        <span className="text-lg">{item.emoji}</span>
                      </div>
                      <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors font-medium">
                        {item.description}
                      </p>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}

            {/* 커스텀 메뉴들 */}
            {customMenuItems.map((item, index) => (
              <motion.button
                key={`custom-${index}`}
                onClick={item.onClick}
                className={cn(
                  "w-full group relative overflow-hidden rounded-2xl transition-all duration-300",
                  item.isActive 
                    ? "bg-white shadow-lg shadow-gray-200/60 border border-gray-200/60" 
                    : "hover:bg-white/60 hover:shadow-md hover:shadow-gray-200/40"
                )}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative flex items-center space-x-4 p-4">
                  <motion.div 
                    className={cn("p-3 rounded-xl shadow-sm", item.gradient)}
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </div>
              </motion.button>
            ))}
          </nav>

          {/* 설정/메시지 영역 */}
          {showSettingsMenu && (
            <div className="mt-8 pt-6 border-t border-gray-200/60">
              {isOwner ? (
                <motion.button 
                  onClick={handleSettings}
                  className="w-full group relative overflow-hidden rounded-2xl hover:bg-white/60 hover:shadow-md hover:shadow-gray-200/40 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative flex items-center space-x-4 p-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-r from-gray-500 to-slate-600 shadow-sm"
                      whileHover={{ rotate: 5 }}
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">피어몰 관리</span>
                        <span className="text-lg">⚙️</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">설정과 관리 도구</p>
                    </div>
                  </div>
                </motion.button>
              ) : (
                <motion.button 
                  onClick={handleMessage}
                  className="w-full group relative overflow-hidden rounded-2xl hover:bg-white/60 hover:shadow-md hover:shadow-gray-200/40 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative flex items-center space-x-4 p-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-sm"
                      whileHover={{ rotate: 5 }}
                    >
                      <Mail className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">메시지 보내기</span>
                        <span className="text-lg">💌</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">소통해보세요</p>
                    </div>
                  </div>
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* 🎯 하단 고정 홈 버튼 영역 - 정확한 높이 계산 */}
        {showHomeButton && (
          <div className="border-t border-gray-200/60 p-4 bg-gradient-to-r from-slate-50/80 to-gray-50/80 flex-shrink-0">
            <motion.button 
              onClick={handleGoHome}
              className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative flex items-center justify-center space-x-3">
                <motion.div 
                  className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Home className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-left">
                  <span className="text-lg font-bold text-white block">메인으로</span>
                  <span className="text-xs text-white/80 font-medium">홈페이지로 돌아가기 🏠</span>
                </div>
              </div>
              
              {/* 반짝이는 효과 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />
            </motion.button>
          </div>
        )}
      </aside>

      {/* 📱 모바일 하단 네비게이션 바 - 정확한 높이 계산 */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 z-50 safe-area-pb"
        data-mobile-nav
      >
        <div className="flex justify-around items-center py-3 px-2">
          {/* 메인 네비게이션 아이템들 (최대 3개만 표시) */}
          {showDefaultMenus && defaultMenuItems.slice(0, 3).map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 min-w-[70px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 shadow-sm",
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-110` 
                      : "bg-gray-100"
                  )}
                  whileHover={{ rotate: 5 }}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isActive ? "text-white" : "text-gray-600"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-xs font-semibold mt-1 transition-colors duration-300",
                  isActive ? "text-gray-900" : "text-gray-500"
                )}>
                  {item.label.length > 4 ? item.label.slice(0, 4) : item.label}
                </span>
                <span className="text-xs">{item.emoji}</span>
              </motion.button>
            );
          })}

          {/* 더보기 메뉴 버튼 */}
          <motion.button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 min-w-[70px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 shadow-sm"
              whileHover={{ rotate: 180 }}
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xs font-semibold mt-1 text-gray-500">더보기</span>
            <span className="text-xs">📋</span>
          </motion.button>
        </div>
      </div>

      {/* 📱 모바일 전체 메뉴 오버레이 - 정확한 높이 계산 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" 
            onClick={toggleMobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              paddingTop: `${headerHeight}px`,
              paddingBottom: `${mobileNavHeight}px`
            }}
          >
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ maxHeight: mobileModalMaxHeight }}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/60 flex-shrink-0 bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-pink-50/80">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">메뉴</h3>
                    <p className="text-sm text-gray-600">원하는 섹션을 선택하세요</p>
                  </div>
                </div>
                <motion.button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>

              {/* 메뉴 콘텐츠 - 정확한 스크롤 영역 */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-6 space-y-4">
                  {/* 모든 네비게이션 아이템들 */}
                  {showDefaultMenus && defaultMenuItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={item.onClick}
                        className={cn(
                          "w-full group relative overflow-hidden rounded-2xl transition-all duration-300",
                          isActive 
                            ? "bg-gradient-to-r from-white to-blue-50/30 border-2 border-blue-200/60 shadow-lg" 
                            : "bg-gray-50/80 hover:bg-white hover:shadow-md"
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative flex items-center space-x-4 p-4">
                          <motion.div 
                            className={cn(
                              "p-3 rounded-xl shadow-sm",
                              `bg-gradient-to-r ${item.gradient}`
                            )}
                            whileHover={{ rotate: 5 }}
                          >
                            <item.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-lg text-gray-900">{item.label}</span>
                              <span className="text-xl">{item.emoji}</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{item.description}</p>
                          </div>
                          
                          {isActive && (
                            <motion.div
                              className="w-3 h-12 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"
                              layoutId="mobileActiveIndicator"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* 구분선 */}
                  <div className="border-t border-gray-200/60 my-6"></div>

                  {/* 설정/메시지 */}
                  {showSettingsMenu && (
                    <div className="space-y-4">
                      {isOwner ? (
                        <motion.button 
                          onClick={handleSettings}
                          className="w-full group relative overflow-hidden rounded-2xl bg-gray-50/80 hover:bg-white hover:shadow-md transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative flex items-center space-x-4 p-4">
                            <motion.div 
                              className="p-3 rounded-xl bg-gradient-to-r from-gray-500 to-slate-600 shadow-sm"
                              whileHover={{ rotate: 5 }}
                            >
                              <Settings className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg text-gray-900">피어몰 관리</span>
                                <span className="text-xl">⚙️</span>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">설정과 관리 도구</p>
                            </div>
                          </div>
                        </motion.button>
                      ) : (
                        <motion.button 
                          onClick={handleMessage}
                          className="w-full group relative overflow-hidden rounded-2xl bg-gray-50/80 hover:bg-white hover:shadow-md transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative flex items-center space-x-4 p-4">
                            <motion.div 
                              className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-sm"
                              whileHover={{ rotate: 5 }}
                            >
                              <Mail className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg text-gray-900">메시지 보내기</span>
                                <span className="text-xl">💌</span>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">소통해보세요</p>
                            </div>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 고정 홈 버튼 영역 (모바일) - 정확한 높이 계산 */}
              {showHomeButton && (
                <div className="border-t border-gray-200/60 p-4 bg-gradient-to-r from-slate-50/80 to-gray-50/80 flex-shrink-0">
                  <motion.button 
                    onClick={handleGoHome}
                    className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative flex items-center justify-center space-x-4">
                      <motion.div 
                        className="p-3 rounded-xl bg-white/20 backdrop-blur-sm"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Home className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="text-left">
                        <span className="font-bold text-xl text-white block">메인으로</span>
                        <span className="text-sm text-white/80 font-medium">홈페이지로 돌아가기 🏠</span>
                      </div>
                    </div>
                    
                    {/* 반짝이는 효과 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeftSideBar;