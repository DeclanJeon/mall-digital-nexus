// components/LeftSideBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Home, Package, MessageSquare, Users, Mail, Settings, Sparkles, Star, Calendar } from 'lucide-react';
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

  // 🎯 기본 메뉴 아이템들 (원본 Sidebar 스타일 적용)
  const defaultMenuItems: MenuItem[] = [
    {
      id: SECTIONS.SPACE,
      label: '피어 홈',
      icon: Home,
      path: `/space/${address}?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.SPACE),
      color: 'bg-blue-500'
    },
    {
      id: SECTIONS.PRODUCTS,
      label: '제품 갤러리',
      icon: Package,
      path: `/space/${address}/product?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.PRODUCTS),
      color: 'bg-green-500'
    },
    {
      id: SECTIONS.COMMUNITY,
      label: '커뮤니티',
      icon: MessageSquare,
      path: `/space/${address}/community?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.COMMUNITY),
      color: 'bg-purple-500'
    },
    {
      id: SECTIONS.MAP,
      label: '피어맵',
      icon: MessageSquare,
      path: `/space/${address}/peermap?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.MAP),
      color: 'bg-yellow-500'
    }
  ];

  // 🎯 퀵 액션들 (원본 Sidebar의 Quick Actions 스타일)
  const quickActions = [
    { icon: Star, label: '즐겨찾기', count: 5, action: () => handleQuickAction('favorites') },
    { icon: Calendar, label: '이벤트', count: 2, action: () => handleQuickAction('events') },
    { icon: Users, label: '팔로워', count: 12, action: () => handleQuickAction('followers') },
  ];

  // 🎯 네비게이션 처리
  const handleNavigation = (section: SectionValue) => {
    setActiveSection(section);
    
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
    toast({
      title: `${action} 기능 🚀`,
      description: '곧 출시될 예정이에요!',
    });
  };

  // 🎯 메시지 보내기
  const handleMessage = () => {
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
    navigate('/');
  };

  // 로딩 스켈레톤
  if (!config) {
    return (
      <aside className={cn("w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto", className)}>
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
    );
  }

  return (
    <aside className={cn("w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto", className)}>
      <div className="p-6">
        {/* 피어몰 프로필 영역 */}
        {/* <div className="mb-8">
          <Link 
            to={`/space/${address}?mk=${peerMallKey}`} 
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center overflow-hidden">
                {config.profileImage ? (
                  <img 
                    src={config.profileImage} 
                    alt="Space logo" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <Sparkles className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                {config.peerMallName}
              </h3>
              <span className="text-xs text-gray-500">{config.peerNumber}</span>
            </div>
          </Link>
        </div> */}

        {/* 메인 네비게이션 */}
        <nav className="space-y-2 mb-8">
          {showDefaultMenus && defaultMenuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all hover:bg-gray-50",
                  isActive && "bg-blue-50 text-blue-600 border border-blue-200"
                )}
              >
                <div className={cn("p-2 rounded-lg", item.color)}>
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
                "w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all hover:bg-gray-50",
                item.isActive && "bg-blue-50 text-blue-600 border border-blue-200"
              )}
            >
              <div className={cn("p-2 rounded-lg", item.color)}>
                <item.icon className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* 퀵 액션 영역 */}
        {/* <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <action.icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {action.count}
                </span>
              </button>
            ))}
          </div>
        </div> */}

        {/* 설정/메시지 영역 */}
        {showSettingsMenu && (
          <div className="border-t pt-4">
            {isOwner ? (
              <button 
                onClick={handleSettings}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-gray-500">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">피어몰 관리</span>
              </button>
            ) : (
              <button 
                onClick={handleMessage}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-orange-500">
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
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">메인으로</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftSideBar;