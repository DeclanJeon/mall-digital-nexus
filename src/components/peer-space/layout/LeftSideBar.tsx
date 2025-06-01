// components/LeftSideBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Home, FileText, MessageSquare, Users, Mail, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SectionType } from '@/types/space';
import { PeerSpaceHomeProps } from '@/types/space';

// SectionType에서 사용할 값들
const SECTIONS = {
  SPACE: 'space',
  PRODUCTS: 'products',
  COMMUNITY: 'community'
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
        // localStorage에서 설정 정보 가져오기
        const savedConfig = localStorage.getItem(`peer_mall_config_${address}`);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
        } else {
          // 기본 설정
          setConfig({
            peerMallName: '피어몰',
            peerNumber: address?.slice(0, 8) + '...',
            profileImage: null
          });
        }
      } catch (error) {
        console.error('피어몰 설정 로드 실패:', error);
        setConfig({
          peerMallName: '피어몰',
          peerNumber: '알 수 없음',
          profileImage: null
        });
      }
    };

    loadPeerMallConfig();
  }, [address]);

  // 🎯 기본 메뉴 아이템들
  const defaultMenuItems: MenuItem[] = [
    {
      id: SECTIONS.SPACE,
      label: '홈',
      icon: Home,
      path: `/space/${address}?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.SPACE)
    },
    {
      id: SECTIONS.PRODUCTS,
      label: '제품',
      icon: FileText,
      path: `/space/${address}/product?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.PRODUCTS)
    },
    {
      id: SECTIONS.COMMUNITY,
      label: '커뮤니티',
      icon: MessageSquare,
      path: `/space/${address}/community?mk=${peerMallKey}`,
      onClick: () => handleNavigation(SECTIONS.COMMUNITY)
    }
  ];

  // 🎯 네비게이션 처리
  const handleNavigation = (section: SectionValue) => {
    setActiveSection(section);
    
    // 커스텀 이벤트 발생 (외부에서 필요시 리스닝 가능)
    window.dispatchEvent(new CustomEvent('peerSpaceNavigation', {
      detail: { section, address, peerMallKey }
    }));

    // URL 업데이트
    if (section === 'space') {
      navigate(`/space/${address}${peerMallKey ? `?mk=${peerMallKey}` : ''}`);
    } else {
      navigate(`/space/${address}/${section}${peerMallKey ? `?mk=${peerMallKey}` : ''}`);
    }
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

    // 메시지 모달 열기 이벤트
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
    navigate(`/space/${address}/settings`);
  };

  // 소유자 메뉴 토글 함수
  const toggleOwnerMenu = () => {
    // isOwner is now controlled by parent component
    // You can call onNavigateToSection if needed
    if (onNavigateToSection) {
      onNavigateToSection(isOwner ? 'space' : 'settings');
    }
  };

  // 🎯 홈으로 가기
  const handleGoHome = () => {
    navigate('/');
  };

  // 로딩 중이거나 설정이 없으면 스켈레톤 표시
  if (!config) {
    return (
      <div className={`w-64 bg-white shadow-md fixed left-0 top-0 h-full z-20 ${className}`}>
        <div className="flex flex-col h-full animate-pulse">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-3 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-64 bg-white shadow-md fixed left-0 top-0 h-full z-20 ${className}`}>
      <div className="flex flex-col h-full">
        {/* 로고 영역 */}
        <div className="p-4 border-b">
          <Link to={`/space/${address}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {config.profileImage ? (
                <img 
                  src={config.profileImage} 
                  alt="Space logo" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="font-bold text-blue-500">
                  {config.peerMallName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm truncate max-w-[180px]">
                {config.peerMallName}
              </h3>
              <span className="text-xs text-gray-500">{config.peerNumber}</span>
            </div>
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {/* 기본 메뉴들 */}
            {showDefaultMenus && defaultMenuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={item.onClick}
                  className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 ${
                    activeSection === item.id 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}

            {/* 커스텀 메뉴들 */}
            {customMenuItems.map((item, index) => (
              <li key={`custom-${index}`}>
                <button 
                  onClick={item.onClick}
                  className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 ${
                    item.isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
            
            {/* 설정/메시지 영역 */}
            {showSettingsMenu && (
              <li className="pt-4 mt-4 border-t">
                {isOwner ? (
                  <button 
                    onClick={handleSettings}
                    className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    <span>내 피어몰 관리</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleMessage} 
                    className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <span>메시지 보내기</span>
                  </button>
                )}
              </li>
            )}
          </ul>
        </nav>

        {/* 하단 홈 버튼 */}
        {showHomeButton && (
          <div className="border-t p-4">
            <div className="flex items-center justify-center"> 
              <button 
                onClick={handleGoHome}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span>홈으로 가기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
