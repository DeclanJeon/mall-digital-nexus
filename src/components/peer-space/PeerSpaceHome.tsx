import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from '@/types/space';
import { Product, isProduct } from '@/types/product';
import { Peermall } from '@/types/peermall';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  QrCode, 
  Settings, 
  Home, 
  FileText, 
  Users, 
  LogOut,
  User,
  Mail,
  Clock,
  Bell,
  MapPin,
  Search,
  ChevronRight,
  Bookmark,
  Grid2X2,
  List,
  Star,
  CalendarDays,
  Image,
  Phone,
  UserPlus,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  ArrowUp,
  Map
} from 'lucide-react';
import { createContent, getPeerSpaceContents } from '@/services/contentService';
import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
import EmptyState from './ui/EmptyState';
import ProductCard from '@/components/shopping/products/ProductCard';
import BadgeSelector from './ui/BadgeSelector';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BasicInfoSection from './sections/BasicInfoSection';
import PeerSpaceQRModal from './modals/PeerSpaceQRModal';
import PeerSpaceProductFormModal from './modals/PeerSpaceProductFormModal';
import PeerSpaceSettingsModal from './modals/PeerSpaceSettingsModal';
import PeerSpaceMapModal from './modals/PeerSpaceMapModal';
import PeerSpaceHomeSection from './sections/PeerSpaceHomeSection';
import PeerSpaceContentSection from './sections/PeerSpaceContentSection';
import PeerSpaceCommunitySection from './sections/PeerSpaceCommunitySection';
import PeerSpaceFollowingSection from './sections/PeerSpaceFollowingSection';
import PeerSpaceGuestbookSection from './sections/PeerSpaceGuestbookSection';
import { 
  generateMockProducts, 
  generateMockPosts, 
  guestbookData, 
  notificationsData, 
  alertsData, 
  sponsorsData, 
  heroSlides, 
  followingPeermalls 
} from './data/homeMockData';
import { saveSectionOrder, getSectionOrder, getSectionDisplayName } from './utils/peerSpaceUtils';
import { peermallStorage } from '@/services/storage/peermallStorage';
import productService from '@/services/productService';

// 🎯 타입 정의 강화
interface LocationInfo {
  address: string;
  lat: number;
  lng: number;
}

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  peermall: Peermall | null;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
  activeSection: SectionType;
  onNavigateToSection: (section: SectionType) => void;
  onDetailView?: (productId: string | number) => void;
}

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ 
  isOwner, 
  address,
  config,
  peermall,
  onUpdateConfig,
  activeSection,
  onNavigateToSection,
  onDetailView
}) => {
  const location = useLocation();
  const [showQRModal, setShowQRModal] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Content[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry'>('list');
  const [sections, setSections] = useState<SectionType[]>([]);
  const [hiddenSections, setHiddenSections] = useState<SectionType[]>([]);
  const { activeTab, handleTabChange } = usePeerSpaceTabs('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showWidgets, setShowWidgets] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchParams] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  // 🛡️ 안전한 localStorage 접근
  useEffect(() => {
    if (typeof window !== 'undefined' && address) {
      try {
        const storedHiddenSections = localStorage.getItem(`peer_space_${address}_hidden_sections`);
        if (storedHiddenSections) {
          setHiddenSections(JSON.parse(storedHiddenSections));
        }
        
        const storedSections = getSectionOrder(address, config.sections);
        setSections(storedSections);
      } catch (error) {
        console.error('🚨 localStorage 접근 에러:', error);
      }
    }
  }, [address, config.sections]);

  // 🔄 향상된 콘텐츠 로딩
  useEffect(() => {
    const loadContents = async () => {
      if (!address) {
        console.warn('⚠️ 주소가 제공되지 않았습니다');
        return;
      }

      try {
        // 피어몰 데이터와 설정 동기화
        if (peermall && config) {
          const configNeedsUpdate = 
            config.peerMallName !== peermall.peerMallName || 
            config.ownerName !== peermall.ownerName ||
            config.profileImage !== peermall.imageUrl;
            
          if (configNeedsUpdate) {
            const updatedConfig: PeerMallConfig = {
              ...config,
              peerMallName: peermall.peerMallName,
              ownerName: peermall.ownerName,
              profileImage: peermall.imageUrl,
              followers: peermall.followers ?? config.followers,
              recommendations: peermall.likes ?? config.recommendations
            };
            
            onUpdateConfig(updatedConfig);
            console.log('🔄 피어스페이스 설정이 피어몰 데이터와 동기화되었습니다');
          }
        }

        // 실제 데이터 로딩
        let loadedContents = await getPeerSpaceContents(address);
        
        // 데이터가 없으면 더미 데이터로 대체
        if (!loadedContents?.length) {
          const mockProducts = generateMockProducts(8);
          const mockPosts = generateMockPosts(12);
          loadedContents = [...mockProducts, ...mockPosts];
        }
        
        setContents(loadedContents);
        
        // 제품과 게시물 분류 (타입 안전성 확보)
        const productsData = loadedContents.filter((item): item is Product => item.type === 'product');
        const postsData = loadedContents.filter(item => item.type === 'post' || item.type === 'article');
        
        setProducts(productsData);
        setPosts(postsData);
        
      } catch (error) {
        console.error("💥 콘텐츠 로딩 실패:", error);
        toast({
          title: "로딩 에러",
          description: "콘텐츠를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    };

    loadContents();
    
    // 히어로 슬라이드 자동 전환
    const slideInterval = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % Math.max(heroSlides.length, 1));
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [address, config, peermall, onUpdateConfig]);

  // 🔄 hiddenSections 저장
  useEffect(() => {
    if (typeof window !== 'undefined' && address) {
      try {
        localStorage.setItem(`peer_space_${address}_hidden_sections`, JSON.stringify(hiddenSections));
      } catch (error) {
        console.error('🚨 localStorage 저장 에러:', error);
      }
    }
  }, [hiddenSections, address]);

  // 📝 안전한 콘텐츠 추가 핸들러
  const handleAddContent = async (formValues: ContentFormValues) => {
    if (!address) {
      toast({
        title: "에러",
        description: "유효하지 않은 주소입니다.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const newContentData: Omit<Content, 'id' | 'createdAt' | 'updatedAt'> = {
      peerSpaceAddress: address,
      title: formValues.title,
      description: formValues.description,
      imageUrl: formValues.imageUrl || '',
      type: formValues.type as ContentType,
      date: now,
      price: formValues.price ? Number(formValues.price) : 0,
      likes: 0,
      comments: 0,
      views: 0,
      saves: 0,
      externalUrl: formValues.externalUrl || '',
      tags: formValues.tags ? formValues.tags.split(',').map(tag => tag.trim()) : [],
      category: formValues.category || '',
      badges: [],
      ecosystem: {},
      attributes: {},
      name: ''
    };

    try {
      const contentId = await createContent(newContentData);
      const newFullContent: Content = {
        ...newContentData,
        id: contentId,
        createdAt: now,
        updatedAt: now,
      };
      
      // 컨텐츠 업데이트
      const updatedContents = [...contents, newFullContent];
      setContents(updatedContents);
      
      // 타입에 따라 제품 또는 게시물 업데이트
      if (newFullContent.type === 'product') {
        setProducts(prev => [...prev, newFullContent as Product]);
      } else if (newFullContent.type === 'post' || newFullContent.type === 'article') {
        setPosts(prev => [...prev, newFullContent]);
      }
      
      toast({
        title: "콘텐츠 추가 완료 🎉",
        description: "새로운 콘텐츠가 성공적으로 등록되었습니다.",
      });
    } catch (error) {
      console.error("콘텐츠 생성 오류:", error);
      toast({
        title: "콘텐츠 추가 실패 😢",
        description: "콘텐츠 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 🎛️ 섹션 가시성 토글
  const handleToggleSectionVisibility = (section: SectionType) => {
    if (hiddenSections.includes(section)) {
      setHiddenSections(prev => prev.filter(s => s !== section));
      toast({ 
        title: "섹션 표시 ✅", 
        description: `${getSectionDisplayName(section)} 섹션이 표시됩니다.` 
      });
    } else {
      setHiddenSections(prev => [...prev, section]);
      toast({ 
        title: "섹션 숨김 🙈", 
        description: `${getSectionDisplayName(section)} 섹션이 숨겨졌습니다.` 
      });
    }
  };

  // 🔄 섹션 순서 변경
  const handleMoveSectionUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };
  
  const handleMoveSectionDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };

  // 🔗 공유 핸들러
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "공유하기 📤", description: "링크가 클립보드에 복사되었습니다." });
    }
  };

  // 💬 메시지 핸들러
  const handleMessage = () => {
    toast({ title: "메시지 보내기 💌", description: "메시지 창이 열렸습니다." });
  };

  // 📞 통화 핸들러
  const handleCall = () => {
    toast({ title: "통화 연결 📱", description: "통화 연결을 시도합니다." });
  };
  
  // 🗺️ 지도 열기
  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  // 🎯 QR 코드 생성
  const handleQRGenerate = () => setShowQRModal(true);
  
  // 📦 제품 폼 표시
  const handleShowProductForm = () => setShowProductForm(true);
  
  // ⚙️ 설정 표시
  const handleShowSettings = () => setShowSettingsModal(true);
  
  // 👆 콘텐츠 클릭 핸들러
  const handleContentClick = (contentItem: Content) => {
    console.log('Content clicked:', contentItem);
  };

  // 🔍 안전한 제품 상세보기 핸들러
  const handleDetailView = (productId: string | number) => {
    onDetailView?.(productId);
  };

  // 🏠 위치 정보 표시 함수
  const getLocationDisplay = (): string => {
    if (!config.location) return '위치 정보 없음';
    if (typeof config.location === 'string') return config.location;
    return (config.location as LocationInfo).address;
  };

  const getLocationCoordinates = (): string | null => {
    if (!config.location || typeof config.location === 'string') return null;
    const location = config.location as LocationInfo;
    return `좌표: ${location.lat}, ${location.lng}`;
  };

  // 🔍 필터된 콘텐츠
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🎛️ 위젯 토글 함수
  const toggleWidgets = () => setShowWidgets(!showWidgets);

  // 🚪 로그아웃 핸들러
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    window.location.href = "/";
  };

  // 🚫 주소가 없으면 404 표시
  if (!address) {
    return (
      <div className="container mx-auto p-6">
        <EmptyState 
          title="404 - 피어스페이스를 찾을 수 없습니다 😢" 
          description="올바른 피어스페이스 주소인지 확인해주세요." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-0 h-full z-20">
        <div className="flex flex-col h-full">
          {/* 로고 영역 */}
          <div className="p-4 border-b">
            <Link to={`/space/${address}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {config.profileImage ? (
                  <img src={config.profileImage} alt="Space logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-blue-500">{config.peerMallName?.charAt(0) || 'P'}</span>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm truncate max-w-[180px]">{config.peerMallName || '피어스페이스'}</h3>
                <span className="text-xs text-gray-500">{config.peerNumber || ''}</span>
              </div>
            </Link>
          </div>

          {/* 메뉴 영역 */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateToSection('home')}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                    activeSection === 'home' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>홈</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('products')}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                    activeSection === 'products' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span>제품</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('community')}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                    activeSection === 'community' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>커뮤니티</span>
                </button>
              </li>
              
              <li className="pt-4 mt-4 border-t">
                {isOwner ? (
                  <Link to={`/space/${address}/settings`} className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5 mr-3" />
                    <span>스페이스 관리</span>
                  </Link>
                ) : (
                  <button onClick={handleMessage} className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <span>메시지 보내기</span>
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {/* 하단 프로필 */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200">
                  <img src="https://api.dicebear.com/7.x/personas/svg?seed=current-user" alt="User" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">{isOwner ? '내 계정' : '게스트'}</p>
                  <p className="text-xs text-gray-500">{isOwner ? '관리자' : '방문자'}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 transition-colors">
                {isOwner ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="ml-64 flex-1">
        {/* 상단 검색 영역 */}
        <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            <input 
              type="text" 
              placeholder="제품, 콘텐츠, 게시물 검색..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleQRGenerate}>
              <QrCode className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex p-6">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 pr-6">
            {activeSection === 'home' && (
              <PeerSpaceHomeSection
                isOwner={isOwner}
                address={address}
                config={config}
                onNavigateToSection={onNavigateToSection}
                products={products}
                posts={posts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleShowProductForm={handleShowProductForm}
                activeSection={activeSection}
              />
            )}
            {activeSection === 'products' && (
              <PeerSpaceContentSection
                isOwner={isOwner}
                address={address}
                config={config}
                products={products}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleShowProductForm={handleShowProductForm}
                filteredProducts={filteredProducts}
                onDetailView={handleDetailView}
              />
            )}
            {activeSection === 'community' && (
              <PeerSpaceCommunitySection
                isOwner={isOwner}
                config={config}
                posts={posts}
                filteredPosts={filteredPosts}
              />
            )}
            {activeSection === 'following' && (
              <PeerSpaceFollowingSection />
            )}
            {activeSection === 'guestbook' && (
              <PeerSpaceGuestbookSection />
            )}
            {activeSection === 'settings' && (
              <BasicInfoSection 
                config={config} 
                peermall={peermall}
              />
            )}
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="w-80 flex-shrink-0">
            {/* 피어맵 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">위치 📍</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48 relative mb-3">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Button onClick={handleOpenMap} className="bg-white text-blue-600 hover:bg-gray-50 transition-colors">
                      <Map className="w-4 h-4 mr-2" />
                      지도 보기
                    </Button>
                  </div>
                  <div className="absolute inset-0 opacity-60 cursor-pointer" onClick={handleOpenMap}>
                    {/* 지도 미리보기 영역 */}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{getLocationDisplay()}</p>
                      {getLocationCoordinates() && (
                        <p className="text-xs text-gray-500 mt-1">{getLocationCoordinates()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 모달 렌더링 */}
      <PeerSpaceQRModal 
        showQRModal={showQRModal} 
        setShowQRModal={setShowQRModal} 
        address={address} 
      />
      <PeerSpaceProductFormModal 
        showProductForm={showProductForm} 
        setShowProductForm={setShowProductForm} 
        address={address} 
        setProducts={setProducts} 
        setContents={setContents} 
        products={products} 
        contents={contents}
      />
      {isOwner && (
        <PeerSpaceSettingsModal 
          showSettingsModal={showSettingsModal} 
          setShowSettingsModal={setShowSettingsModal} 
          address={address} 
          sections={sections} 
          setSections={setSections} 
          hiddenSections={hiddenSections} 
          setHiddenSections={setHiddenSections} 
        />
      )}
      <PeerSpaceMapModal 
        showMapModal={showMapModal} 
        setShowMapModal={setShowMapModal} 
      />
    </div>
  );
};

export default PeerSpaceHome;
