import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from './types';
import { Heart, 
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
  Image
} from 'lucide-react';
import { createContent } from '@/services/contentService';
import { getPeerSpaceContents } from '@/utils/peerSpaceStorage';
import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
import { add } from '@/utils/indexedDBService';
import ProductRegistrationForm from './products/ProductRegistrationForm';
import EmptyState from './ui/EmptyState';
import ProductCard from '../shopping/ProductCard';
import BadgeSelector from './ui/BadgeSelector';

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
}

// Save section order to localStorage
const saveSectionOrder = (address: string, sections: SectionType[]) => {
  try {
    localStorage.setItem(`peer_space_${address}_sections`, JSON.stringify(sections));
  } catch (error) {
    console.error("Error saving section order:", error);
  }
};

// Get section order from localStorage
const getSectionOrder = (address: string, defaultSections: SectionType[]): SectionType[] => {
  try {
    const stored = localStorage.getItem(`peer_space_${address}_sections`);
    return stored ? JSON.parse(stored) : defaultSections;
  } catch (error) {
    console.error("Error loading section order:", error);
    return defaultSections;
  }
};

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ 
  isOwner, 
  address,
  config,
  onUpdateConfig 
}) => {
  const navigate = useNavigate();
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

  // 가상의 공지사항 데이터
  const notifications = [
    { id: 1, title: '신규 기능 추가 안내', date: '2025-05-20' },
    { id: 2, title: '여름 할인 이벤트 오픈', date: '2025-05-18' },
    { id: 3, title: '커뮤니티 가이드라인 업데이트', date: '2025-05-15' }
  ];
  
  // 가상의 방명록 데이터
  const guestbookEntries = [
    { id: 1, author: '방문자1', message: '멋진 피어몰입니다!', date: '2025-05-21' },
    { id: 2, author: '방문자2', message: '제품 품질이 좋아요', date: '2025-05-20' },
    { id: 3, author: '방문자3', message: '다음에 또 방문할게요', date: '2025-05-19' }
  ];
  
  // 가상의 알림 데이터
  const alerts = [
    { id: 1, title: '새로운 팔로워', message: '사용자 홍길동님이 팔로우했습니다', time: '1시간 전' },
    { id: 2, title: '제품 리뷰', message: '제품 "무선 이어폰"에 새 리뷰가 달렸습니다', time: '3시간 전' },
    { id: 3, title: '업데이트 완료', message: '시스템 업데이트가 완료되었습니다', time: '어제' }
  ];

  useEffect(() => {
    const loadContents = async () => {
      if (address) {
        try {
          const loadedContents = await getPeerSpaceContents(address);
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
        }
      }
    };
    loadContents();
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

  const getSectionDisplayName = (sectionType: SectionType): string => {
    const sectionNames: Record<SectionType, string> = {
      'hero': '히어로', 'content': '콘텐츠/상품', 'community': '커뮤니티', 'about': '소개',
      'products': '제품', 'services': '서비스', 'events': '이벤트', 'reviews': '리뷰',
      'contact': '연락처', 'map': '지도', 'guestbook': '방명록', 'trust': '신뢰도',
      'featured': '추천', 'achievements': '성과', 'learning': '학습', 'quests': '퀘스트',
      'infoHub': '정보 허브', 'activityFeed': '활동 피드', 'relatedMalls': '관련 피어몰',
      'liveCollaboration': '실시간 연결', 'livestream': '라이브 스트림'
    };
    return sectionNames[sectionType] || sectionType;
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

  const handleQRGenerate = () => setShowQRModal(true);
  const handleShowProductForm = () => setShowProductForm(true);
  const handleShowSettings = () => setShowSettingsModal(true);
  
  const handleContentClick = (contentItem: Content) => {
    console.log('Content clicked:', contentItem);
    // 상세 페이지로 이동 로직 (나중에 구현)
  };

  const renderQRModal = () => (
    <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-xl font-bold">내 스페이스 QR 코드</DialogTitle></DialogHeader>
        <div className="p-4 flex justify-center">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">QR 코드 영역</div>
        </div>
        <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">{`https://peermall.com/space/${address}`}</div>
        <Button className="w-full mt-2">이미지 다운로드</Button>
      </DialogContent>
    </Dialog>
  );

  const renderProductFormModal = () => (
    <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader><DialogTitle className="text-xl font-bold">제품 등록</DialogTitle></DialogHeader>
        <ProductRegistrationForm 
          onSubmit={async (productData) => {
            const now = new Date().toISOString();
            const newProduct: Content = {
              ...productData,
              id: `prod-${Date.now()}`,
              peerSpaceAddress: address,
              title: productData.title || '',
              description: productData.description || '',
              type: 'product',
              date: now,
              createdAt: now,
              updatedAt: now,
              likes: productData.likes || 0,
              comments: productData.comments || 0,
              views: productData.views || 0,
              saves: productData.saves || 0,
              imageUrl: productData.imageUrl || '',
              price: productData.price || 0,
              isExternal: false,
              externalUrl: '',
              source: '',
              tags: [],
              category: '',
              badges: [],
              ecosystem: {},
              attributes: {}
            };
            await add('products', newProduct);
            setProducts([...products, newProduct]);
            setContents([...contents, newProduct]);
            setShowProductForm(false);
            toast({ title: "제품 등록 완료", description: `${newProduct.title} 제품이 등록되었습니다.` });
          }}
          address={address}
          onClose={() => setShowProductForm(false)}
        />
      </DialogContent>
    </Dialog>
  );

  const renderSettingsModal = () => (
    <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-xl font-bold">섹션 관리</DialogTitle></DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">섹션의 순서를 변경하거나 표시 여부를 설정하세요.</p>
          <ul className="space-y-3">
            {sections.map((section, index) => (
              <li key={section} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{getSectionDisplayName(section)}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={index === 0} onClick={() => handleMoveSectionUp(index)}>↑</Button>
                  <Button variant="outline" size="sm" disabled={index === sections.length - 1} onClick={() => handleMoveSectionDown(index)}>↓</Button>
                  <Button variant={hiddenSections.includes(section) ? "default" : "outline"} size="sm" onClick={() => handleToggleSectionVisibility(section)}>
                    {hiddenSections.includes(section) ? "표시" : "숨김"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );

  // 새 UI를 위한 필터된 콘텐츠
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <Link to={`/space/${address}`} className={`flex items-center p-2 rounded-lg ${location.pathname === `/space/${address}` ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                  <Home className="w-5 h-5 mr-3" />
                  <span>홈</span>
                </Link>
              </li>
              <li>
                <Link to={`/space/${address}/content`} className={`flex items-center p-2 rounded-lg ${location.pathname.includes('/content') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                  <FileText className="w-5 h-5 mr-3" />
                  <span>제품/콘텐츠</span>
                </Link>
              </li>
              <li>
                <Link to={`/space/${address}/community`} className={`flex items-center p-2 rounded-lg ${location.pathname.includes('/community') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>커뮤니티</span>
                </Link>
              </li>
              <li>
                <Link to={`/space/${address}/following`} className={`flex items-center p-2 rounded-lg ${location.pathname.includes('/following') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                  <Users className="w-5 h-5 mr-3" />
                  <span>팔로잉 피어몰</span>
                </Link>
              </li>
              <li>
                <Link to={`/space/${address}/guestbook`} className={`flex items-center p-2 rounded-lg ${location.pathname.includes('/guestbook') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                  <Mail className="w-5 h-5 mr-3" />
                  <span>방명록</span>
                </Link>
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
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
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
        {/* 히어로 섹션 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 relative">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <div className="lg:w-2/3 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="text-3xl font-bold">{config.title}</h1>
                  {config.isVerified && (
                    <Badge className="bg-white text-blue-600 hover:bg-blue-50">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      인증됨
                    </Badge>
                  )}
                  {config.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary">{badge}</Badge>
                  ))}
                </div>
                <p className="mb-4 text-lg opacity-90">{config.description}</p>
                <div className="flex items-center gap-3 mb-6 text-sm">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {config.owner}
                  </span>
                  <span className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {new Date(config.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    팔로워 {config.followers}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {!isOwner && (
                    <>
                      <Button onClick={handleFollow} variant="secondary" size="sm">
                        <Heart className="mr-1 h-4 w-4" />
                        팔로우
                      </Button>
                      <Button onClick={handleMessage} variant="secondary" size="sm">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        메시지
                      </Button>
                    </>
                  )}
                  {isOwner && (
                    <Button onClick={handleShowProductForm} variant="secondary" size="sm">
                      <FileText className="mr-1 h-4 w-4" />
                      제품 등록
                    </Button>
                  )}
                  <Button onClick={handleShare} variant="outline" size="sm" className="bg-white/10 border-white/20">
                    <Share2 className="mr-1 h-4 w-4" />
                    공유
                  </Button>
                  <Button onClick={handleQRGenerate} variant="outline" size="sm" className="bg-white/10 border-white/20">
                    <QrCode className="mr-1 h-4 w-4" />
                    QR코드
                  </Button>
                  {!isOwner && (
                    <BadgeSelector onBadgeAdd={handleAddBadge} currentBadges={config.badges} />
                  )}
                </div>
              </div>
              
              <div className="lg:w-1/3 relative">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black/20 backdrop-blur">
                  {config.coverImage ? (
                    <img src={config.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                </div>
                {isOwner && (
                  <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 opacity-80 hover:opacity-100">
                    <Image className="mr-1 h-4 w-4" />
                    커버 변경
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* 반투명 패턴 오버레이 */}
          <div className="absolute inset-0 bg-blue-500 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}></div>
        </section>

        <div className="flex">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 p-6">
            {/* 검색 바 */}
            <div className="mb-6 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="제품, 콘텐츠, 게시물 검색..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* 제품/콘텐츠 섹션 */}
            <section className="mb-8 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">제품/콘텐츠</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={currentView === 'blog' ? 'bg-gray-100' : ''}
                    onClick={() => setCurrentView('blog')}
                  >
                    <Grid2X2 className="w-4 h-4 mr-1" />
                    블로그형
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={currentView === 'list' ? 'bg-gray-100' : ''}
                    onClick={() => setCurrentView('list')}
                  >
                    <List className="w-4 h-4 mr-1" />
                    리스트형
                  </Button>
                  {isOwner && (
                    <Button variant="outline" size="sm" onClick={handleShowProductForm}>
                      제품 추가
                    </Button>
                  )}
                </div>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className={currentView === 'blog' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {filteredProducts.slice(0, 6).map((product) => (
                    <div key={product.id}>
                      <ProductCard
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        price={product.price || 0} {/* Ensure price is a number */}
                        discountPrice={null}
                        imageUrl={product.imageUrl}
                        rating={4.5} // 임시값
                        reviewCount={10} // 임시값
                        peermallName={config.title}
                        peermallId={address}
                        category={product.category || '기타'}
                        tags={product.tags || []}
                        viewMode={currentView === 'blog' ? 'grid' : 'list'} {/* Convert 'blog' to 'grid' for compatibility */}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">등록된 제품이 없습니다.</p>
                  {isOwner && (
                    <Button onClick={handleShowProductForm} className="mt-2">
                      첫 제품 등록하기
                    </Button>
                  )}
                </div>
              )}
              
              {filteredProducts.length > 6 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">더 보기 <ChevronRight className="ml-1 w-4 h-4" /></Button>
                </div>
              )}
            </section>

            {/* 게시글 섹션 */}
            <section className="mb-8 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">게시글</h2>
                <Button variant="outline" size="sm">
                  모든 게시글 보기
                </Button>
              </div>
              
              {/* 블로그형 게시물 (상위에 노출) */}
              {filteredPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    {filteredPosts.slice(0, 4).map((post) => (
                      <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                        <div className="h-32 bg-gray-200 relative">
                          {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <FileText className="w-8 h-8" />
                            </div>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <Badge className="absolute top-2 left-2">{post.tags[0]}</Badge>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm line-clamp-1">{post.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" />{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                
                  {/* 리스트형 게시물 (하단에 노출) */}
                  <div className="space-y-2">
                    {filteredPosts.slice(4, 9).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            {post.imageUrl ? (
                              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover rounded" />
                            ) : (
                              <FileText className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{post.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                              <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" />{post.comments}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">등록된 게시물이 없습니다.</p>
                  {isOwner && (
                    <Button className="mt-2">
                      첫 게시물 작성하기
                    </Button>
                  )}
                </div>
              )}
              
              {filteredPosts.length > 9 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">더 보기 <ChevronRight className="ml-1 w-4 h-4" /></Button>
                </div>
              )}
            </section>
            
            {/* 방명록 섹션 */}
            <section className="mb-8 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">방명록</h2>
                <Button variant="outline" size="sm">
                  전체 방명록 보기
                </Button>
              </div>
              
              <div className="space-y-4">
                {guestbookEntries.map(entry => (
                  <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                        {entry.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{entry.author}</h4>
                        <span className="text-xs text-gray-500">{entry.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{entry.message}</p>
                  </div>
                ))}
                
                <div className="mt-4">
                  <textarea 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="방명록을 남겨보세요..."
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <Button>남기기</Button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="w-80 p-6 border-l border-gray-200 bg-white">
            {/* 공지사항 섹션 */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">공지사항</h3>
              <div className="space-y-3">
                {notifications.map(notice => (
                  <div key={notice.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <h4 className="font-medium text-sm">{notice.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 알림 섹션 */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">최근 알림</h3>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 광고 섹션 */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">스폰서</h3>
              <div className="bg-gray-100 rounded-lg p-2 text-center h-40 flex items-center justify-center">
                <p className="text-gray-400">광고 영역</p>
              </div>
            </div>
            
            {/* 피어맵 섹션 */}
            <div>
              <h3 className="font-bold text-lg mb-3">위치</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-48 relative">
                {/* 지도 플레이스홀더 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                {/* 실제로는 여기에 지도 컴포넌트가 들어감 */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded p-2 text-sm">
                  <p className="font-medium">{config.location && typeof config.location !== 'string' ? config.location.address : '위치 정보 없음'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 모달 렌더링 */}
      {renderQRModal()}
      {renderProductFormModal()}
      {isOwner && renderSettingsModal()}
    </div>
  );
};

export default PeerSpaceHome;
