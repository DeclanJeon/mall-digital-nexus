import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from './types';
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
import { createContent } from '@/services/contentService';
import { getPeerSpaceContents } from '@/utils/peerSpaceStorage';
import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
// import { add } from '@/utils/indexedDBService';
import EmptyState from './ui/EmptyState';
import ProductCard from '../shopping/ProductCard';
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

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  peermall: Peermall | null;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
  activeSection: 'home' | 'content' | 'community' | 'following' | 'guestbook' | 'settings';
  onNavigateToSection: (section: 'home' | 'content' | 'community' | 'following' | 'guestbook' | 'settings') => void;
}

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ 
  isOwner, 
  address,
  config,
  peermall,
  onUpdateConfig,
  activeSection,
  onNavigateToSection
}) => {
  const location = useLocation();
  const [showQRModal, setShowQRModal] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [products, setProducts] = useState<Content[]>([]);
  const [posts, setPosts] = useState<Content[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentView, setCurrentView] = useState<'blog' | 'list'>('blog');
  const [sections, setSections] = useState<SectionType[]>(
    getSectionOrder(address, config.sections)
  );
  const [hiddenSections, setHiddenSections] = useState<SectionType[]>(
    JSON.parse(localStorage.getItem(`peer_space_${address}_hidden_sections`) || '[]')
  );
  const { activeTab, handleTabChange } = usePeerSpaceTabs('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showWidgets, setShowWidgets] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const loadContents = async () => {
      if (address) {
        try {
          // 실제 데이터 로딩
          let loadedContents = await getPeerSpaceContents(address);
          
          // 데이터가 없으면 더미 데이터로 대체
          if (!loadedContents || loadedContents.length === 0) {
            const mockProducts = generateMockProducts(8);
            const mockPosts = generateMockPosts(12);
            loadedContents = [...mockProducts, ...mockPosts];
            
            // 더미 데이터 저장 (IndexedDB 사용 중지로 주석 처리)
            // for (const content of loadedContents) {
            //   await add('contents', content);
            // }
          }
          
          setContents(loadedContents);
          
          // 제품과 게시물 분류
          const productsData = loadedContents.filter(item => item.type === 'product');
          const postsData = loadedContents.filter(item => item.type === 'post' || item.type === 'article');
          
          setProducts(productsData);
          setPosts(postsData);
          
          const storedSections = getSectionOrder(address, config.sections);
          setSections(storedSections);
          
          const storedHiddenSections = localStorage.getItem(`peer_space_${address}_hidden_sections`);
          if (storedHiddenSections) {
            setHiddenSections(JSON.parse(storedHiddenSections));
          }
        } catch (error) {
          console.error("Error loading contents:", error);
          
          // 오류 시 더미 데이터 사용
          const mockProducts = generateMockProducts(8);
          const mockPosts = generateMockPosts(12);
          const dummyContents = [...mockProducts, ...mockPosts];
          
          setContents(dummyContents);
          setProducts(mockProducts);
          setPosts(mockPosts);
        }
      }
    };
    loadContents();
    
    // 히어로 슬라이드 자동 전환
    const slideInterval = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [address, config.sections]);

  useEffect(() => {
    if (address) {
      localStorage.setItem(`peer_space_${address}_hidden_sections`, JSON.stringify(hiddenSections));
    }
  }, [hiddenSections, address]);

  const handleAddContent = async (formValues: ContentFormValues) => {
    if (!address) return;
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
        setProducts([...products, newFullContent]);
      } else if (newFullContent.type === 'post' || newFullContent.type === 'article') {
        setPosts([...posts, newFullContent]);
      }
      
      toast({
        title: "콘텐츠 추가 완료",
        description: "새로운 콘텐츠가 성공적으로 등록되었습니다.",
      });
    } catch (error) {
      console.error("콘텐츠 생성 오류:", error);
      toast({
        title: "콘텐츠 추가 실패",
        description: "콘텐츠 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleToggleSectionVisibility = (section: SectionType) => {
    if (hiddenSections.includes(section)) {
      setHiddenSections(hiddenSections.filter(s => s !== section));
      toast({ title: "섹션 표시", description: `${getSectionDisplayName(section)} 섹션이 표시됩니다.` });
    } else {
      setHiddenSections([...hiddenSections, section]);
      toast({ title: "섹션 숨김", description: `${getSectionDisplayName(section)} 섹션이 숨겨졌습니다.` });
    }
  };

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "공유하기", description: "링크가 클립보드에 복사되었습니다." });
  };

  const handleFollow = () => {
    const updatedConfig = { ...config, followers: (config.followers || 0) + 1 };
    onUpdateConfig(updatedConfig);
    toast({ title: "팔로우 완료", description: `${config.owner}님을 팔로우합니다.` });
  };

  const handleAddRecommendation = () => {
    const updatedConfig = { ...config, recommendations: (config.recommendations || 0) + 1 };
    onUpdateConfig(updatedConfig);
    toast({ title: "추천 완료", description: "해당 피어스페이스를 추천하였습니다." });
  };

  const handleAddBadge = (badge: string) => {
    if (config.badges.includes(badge)) {
      toast({ title: "이미 추가된 뱃지", description: "이미 추가한 뱃지입니다.", variant: "destructive" });
      return;
    }
    const updatedConfig = { ...config, badges: [...config.badges, badge] };
    onUpdateConfig(updatedConfig);
    toast({ title: "뱃지 추가 완료", description: "뱃지가 성공적으로 추가되었습니다." });
  };

  const handleMessage = () => {
    toast({ title: "메시지 보내기", description: "메시지 창이 열렸습니다." });
  };

  const handleAddToFavorites = () => {
    toast({ title: "찜하기 완료", description: "관심 목록에 추가되었습니다." });
  };

  const handleCall = () => {
    toast({ title: "통화 연결", description: "통화 연결을 시도합니다." });
  };

  const handleAddFriend = () => {
    toast({ title: "친구 추가", description: "친구 요청을 보냈습니다." });
  };
  
  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  const handleQRGenerate = () => setShowQRModal(true);
  const handleShowProductForm = () => setShowProductForm(true);
  const handleShowSettings = () => setShowSettingsModal(true);
  
  const handleContentClick = (contentItem: Content) => {
    console.log('Content clicked:', contentItem);
    // 상세 페이지로 이동 로직 (나중에 구현)
  };

  // 새 UI를 위한 필터된 콘텐츠
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 위젯 토글 함수
  const toggleWidgets = () => setShowWidgets(!showWidgets);

  if (!address) {
    return <div className="container mx-auto p-6"><EmptyState title="404 - 피어스페이스를 찾을 수 없습니다" description="올바른 피어스페이스 주소인지 확인해주세요." /></div>;
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
                  <span className="font-bold text-blue-500">{config.title.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm truncate max-w-[180px]">{config.title}</h3>
                <span className="text-xs text-gray-500">{config.peerNumber}</span>
              </div>
            </Link>
          </div>

          {/* 메뉴 영역 */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateToSection('home')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'home' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>홈</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('content')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'content' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span>제품/콘텐츠</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('community')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'community' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>커뮤니티</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('following')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'following' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>팔로잉 피어몰</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('guestbook')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'guestbook' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <span>방명록</span>
                </button>
              </li>
              
              <li className="pt-4 mt-4 border-t">
                {isOwner ? (
                  <Link to={`/space/${address}/settings`} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5 mr-3" />
                    <span>스페이스 관리</span>
                  </Link>
                ) : (
                  <button onClick={handleMessage} className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
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
              <button className="text-gray-500 hover:text-gray-700">
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
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleQRGenerate}>
              <QrCode className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            {isOwner && (
              <Button variant="ghost" size="sm" onClick={handleShowSettings}>
                <Settings className="w-5 h-5" />
              </Button>
            )}
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
            {activeSection === 'content' && (
              <PeerSpaceContentSection
                isOwner={isOwner}
                address={address}
                config={config}
                products={products}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleShowProductForm={handleShowProductForm}
                filteredProducts={filteredProducts}
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
            {/* 공지사항 섹션 */}
            <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="font-bold text-lg">공지사항</h3>
              </div>
              <div className="p-4">
                {notificationsData.slice(0, 3).map(notice => (
                  <div 
                    key={notice.id} 
                    className={`p-3 mb-2 last:mb-0 rounded-lg cursor-pointer ${
                      notice.important ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h4 className="font-medium text-sm">{notice.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                  </div>
                ))}
                
                <Button variant="link" className="w-full mt-2 text-blue-600">
                  모든 공지 보기
                </Button>
              </div>
            </div>
            
            {/* 알림 섹션 */}
            <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">최근 알림</h3>
                <Badge variant="outline">{alertsData.filter(a => !a.read).length}</Badge>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {alertsData.slice(0, 3).map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-3 bg-gray-50 rounded-lg border-l-4 ${
                        alert.read ? 'border-gray-300' : 'border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 광고 섹션 */}
            <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-bold text-lg">스폰서</h3>
              </div>
              <div className="p-4">
                {sponsorsData.map(sponsor => (
                  <div key={sponsor.id} className="mb-4 last:mb-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-32 overflow-hidden">
                      <img src={sponsor.imageUrl} alt={sponsor.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm">{sponsor.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{sponsor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 피어맵 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">위치</h3>
                <Button variant="link" size="sm" className="text-blue-600" onClick={handleOpenMap}>
                  큰 지도 보기
                </Button>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48 relative mb-3">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Button onClick={handleOpenMap} className="bg-white text-blue-600">
                      <Map className="w-4 h-4 mr-2" />
                      지도 보기
                    </Button>
                  </div>
                  <div className="absolute inset-0 opacity-60" onClick={handleOpenMap}>
                    {/* EcosystemMap 컴포넌트가 PeerSpaceHome.tsx에서 직접 사용되지 않으므로 제거 */}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{config.location && typeof config.location !== 'string' ? config.location.address : '위치 정보 없음'}</p>
                      {config.location && typeof config.location !== 'string' && (
                        <p className="text-xs text-gray-500 mt-1">좌표: {config.location.lat}, {config.location.lng}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 위젯 버튼 */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative">
          <Button 
            onClick={toggleWidgets} 
            className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center justify-center p-0"
          >
            {showWidgets ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
          </Button>
          
          {showWidgets && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-3 space-y-3 animate-fade-in">
              <Button 
                onClick={handleCall}
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center p-0"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handleMessage}
                className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center p-0"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handleAddFriend}
                className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center p-0"
              >
                <UserPlus className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handleAddToFavorites}
                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center p-0"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* 맨 위로 스크롤 버튼 */}
      <div className="fixed bottom-6 left-6 z-30">
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="rounded-full w-10 h-10 bg-white text-blue-600 shadow-md hover:bg-blue-50 flex items-center justify-center p-0"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
      
      {/* 모달 렌더링 */}
      <PeerSpaceQRModal showQRModal={showQRModal} setShowQRModal={setShowQRModal} address={address} />
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
      <PeerSpaceMapModal showMapModal={showMapModal} setShowMapModal={setShowMapModal} />
    </div>
  );
};

export default PeerSpaceHome;
