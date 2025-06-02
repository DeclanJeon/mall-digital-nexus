import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Home, Package, MessageSquare, Users, Mail, Settings, Sparkles, Star, Calendar, Menu, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SectionType } from '@/types/space';
import { PeerSpaceHomeProps } from '@/types/space';
import { cn } from '@/lib/utils';

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
  color: string;
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

  // 🎯 기본 메뉴 아이템들
  const defaultMenuItems: MenuItem[] = [
    // {
    //   id: SECTIONS.SPACE,
    //   label: '피어 홈',
    //   icon: Home,
    //   path: `/space/${address}?mk=${peerMallKey}`,
    //   onClick: () => handleNavigation(SECTIONS.SPACE),
    //   color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    // },
    {
      id: SECTIONS.PRODUCTS,
      label: '제품 갤러리',
      icon: Package,
      path: `/space/${address}/product?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.PRODUCTS),
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      id: SECTIONS.COMMUNITY,
      label: '커뮤니티',
      icon: MessageSquare,
      path: `/space/${address}/community?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.COMMUNITY),
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      id: SECTIONS.MAP,
      label: '피어맵',
      icon: MessageSquare,
      path: `/space/${address}/peermap?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.MAP),
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    }
  ];

  // 🎯 퀵 액션들
  const quickActions = [
    { icon: Star, label: '즐겨찾기', count: 5, action: () => handleQuickAction('favorites') },
    { icon: Calendar, label: '이벤트', count: 2, action: () => handleQuickAction('events') },
    { icon: Users, label: '팔로워', count: 12, action: () => handleQuickAction('followers') },
  ];

  // 🎯 네비게이션 처리
  const handleNavigation = (section: SectionValue) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // 모바일에서 메뉴 선택 시 닫기
    
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
        {/* 데스크톱 스켈레톤 */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto">
          <div className="p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </aside>
        
        {/* 모바일 스켈레톤 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around py-2 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 🖥️ 데스크톱 사이드바 */}
      <aside className={cn("hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto", className)}>
        <div className="p-6">
          {/* 메인 네비게이션 */}
          <nav className="space-y-2 mb-8">
            {showDefaultMenus && defaultMenuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02]",
                    isActive && "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                  )}
                >
                  <div className={cn("p-2 rounded-lg shadow-sm", item.color)}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* 커스텀 메뉴들 */}
            {customMenuItems.map((item, index) => (
              <button
                key={`custom-${index}`}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02]",
                  item.isActive && "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                )}
              >
                <div className={cn("p-2 rounded-lg shadow-sm", item.color)}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* 설정/메시지 영역 */}
          {showSettingsMenu && (
            <div className="border-t pt-4">
              {isOwner ? (
                <button 
                  onClick={handleSettings}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 shadow-sm">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">피어몰 관리</span>
                </button>
              ) : (
                <button 
                  onClick={handleMessage}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">메시지 보내기</span>
                </button>
              )}
            </div>
          )}

          {/* 홈 버튼 */}
          {showHomeButton && (
            <div className="border-t pt-4 mt-4">
              <button 
                onClick={handleGoHome}
                className="w-full flex items-center justify-center space-x-2 px-3 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">메인으로</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 📱 모바일 하단 네비게이션 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex justify-around items-center py-2 px-2">
          {/* 메인 네비게이션 아이템들 (최대 4개만 표시) */}
          {showDefaultMenus && defaultMenuItems.slice(0, 3).map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px]",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? `${item.color} shadow-lg scale-110` 
                    : "bg-gray-100"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-white" : "text-gray-600"
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}>
                  {item.label.length > 4 ? item.label.slice(0, 4) : item.label}
                </span>
              </button>
            );
          })}

          {/* 더보기 메뉴 버튼 */}
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] text-gray-500"
          >
            <div className="p-2 rounded-lg bg-gray-100 transition-all duration-200">
              <Menu className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-xs font-medium mt-1">더보기</span>
          </button>
        </div>
      </div>

      {/* 📱 모바일 전체 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={toggleMobileMenu}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">메뉴</h3>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* 메뉴 콘텐츠 */}
            <div className="p-6 space-y-4">
              {/* 모든 네비게이션 아이템들 */}
              {showDefaultMenus && defaultMenuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={cn(
                      "w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-blue-50 text-blue-600 border border-blue-200" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("p-3 rounded-xl shadow-sm", item.color)}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-lg">{item.label}</span>
                  </button>
                );
              })}

              {/* 구분선 */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* 설정/메시지 */}
              {showSettingsMenu && (
                <div className="space-y-3">
                  {isOwner ? (
                    <button 
                      onClick={handleSettings}
                      className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 shadow-sm">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-lg">피어몰 관리</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleMessage}
                      className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-lg">메시지 보내기</span>
                    </button>
                  )}
                </div>
              )}

              {/* 홈 버튼 */}
              {showHomeButton && (
                <button 
                  onClick={handleGoHome}
                  className="w-full flex items-center justify-center space-x-3 p-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium text-lg">메인으로</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSideBar;