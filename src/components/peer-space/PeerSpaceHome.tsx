
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from './types';
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
import { add } from '@/utils/indexedDBService';
import ProductRegistrationForm from './products/ProductRegistrationForm';
import EmptyState from './ui/EmptyState';
import ProductCard from '../shopping/ProductCard';
import BadgeSelector from './ui/BadgeSelector';
import EcosystemMap from '../EcosystemMap';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data generator utilities
const generateRandomDate = () => {
  const start = new Date(2025, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock data for products
const generateMockProducts = (count: number): Content[] => {
  const categories = ['전자제품', '패션', '생활용품', '도서', '음식', '취미'];
  const titles = [
    '최신 스마트폰', '무선 이어폰', '슬림핏 청바지', '편안한 운동화', '다용도 선반',
    '베스트셀러 소설', '프리미엄 노트북', '고급 손목시계', '친환경 수건 세트',
    '유기농 차 세트', '프리미엄 커피머신', '휴대용 블루투스 스피커', '실내 공기청정기'
  ];
  
  return Array(count).fill(null).map((_, idx) => {
    const now = generateRandomDate();
    return {
      id: `prod-${Date.now()}-${idx}`,
      peerSpaceAddress: 'mock-address',
      title: titles[idx % titles.length],
      description: `고품질 제품으로 여러분의 일상을 더욱 편리하게 만들어드립니다. 다양한 기능과 세련된 디자인으로 많은 사랑을 받고 있는 제품입니다.`,
      imageUrl: `https://source.unsplash.com/random/300x300/?product&sig=${idx}`,
      type: 'product',
      date: now,
      createdAt: now,
      updatedAt: now,
      price: generateRandomNumber(10000, 300000),
      likes: generateRandomNumber(0, 200),
      comments: generateRandomNumber(0, 50),
      views: generateRandomNumber(100, 5000),
      saves: generateRandomNumber(0, 100),
      category: categories[idx % categories.length],
      tags: ['신상품', '할인', '베스트'],
      badges: [],
      ecosystem: {},
      attributes: {},
      source: '',
      externalUrl: '',
      isExternal: false
    };
  });
};

// Mock data for posts
const generateMockPosts = (count: number): Content[] => {
  const categories = ['뉴스', '리뷰', '튜토리얼', '인터뷰', '에세이'];
  const titles = [
    '최신 트렌드 분석', '신제품 리뷰: 정말 기대 이상입니다', '초보자를 위한 가이드',
    '전문가와의 대화', '사용자 경험 이야기', '업데이트된 기능 소개',
    '비교 테스트: A제품 vs B제품', '알아두면 유용한 팁 10가지',
    '업계 전문가의 인사이트', '디자인 철학에 대한 고찰'
  ];
  
  return Array(count).fill(null).map((_, idx) => {
    const now = generateRandomDate();
    const isArticle = idx % 3 === 0;
    return {
      id: `post-${Date.now()}-${idx}`,
      peerSpaceAddress: 'mock-address',
      title: titles[idx % titles.length],
      description: `이 글에서는 중요한 정보와 인사이트를 공유합니다. 전문가의 의견과 사용자 리뷰를 바탕으로 작성되었으며, 다양한 관점에서 분석한 내용을 담았습니다.`,
      imageUrl: `https://source.unsplash.com/random/600x400/?blog&sig=${idx}`,
      type: isArticle ? 'article' : 'post',
      date: now,
      createdAt: now,
      updatedAt: now,
      price: 0,
      likes: generateRandomNumber(5, 300),
      comments: generateRandomNumber(0, 100),
      views: generateRandomNumber(100, 10000),
      saves: generateRandomNumber(5, 200),
      category: categories[idx % categories.length],
      tags: ['인기글', '추천', '신규'],
      badges: [],
      ecosystem: {},
      attributes: {},
      source: '',
      externalUrl: '',
      isExternal: false
    };
  });
};

// 방명록 데이터
const guestbookData = [
  { id: 1, author: '방문자1', message: '멋진 피어몰입니다! 제품 품질이 정말 좋네요. 다음에 새로 나오는 제품도 구경하러 올게요.', date: '2025-05-21', profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor1' },
  { id: 2, author: '방문자2', message: '제품 품질이 좋아요. 배송도 빠르게 받았습니다. 다른 친구들에게도 추천했어요.', date: '2025-05-20', profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor2' },
  { id: 3, author: '방문자3', message: '다음에 또 방문할게요. 이곳은 항상 유익한 정보가 많아서 좋아요!', date: '2025-05-19', profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor3' },
  { id: 4, author: '방문자4', message: '운영자님 항상 좋은 컨텐츠 감사합니다. 매일 방문하고 있어요.', date: '2025-05-18', profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor4' },
  { id: 5, author: '방문자5', message: '최근에 구매한 제품이 너무 맘에 들어요! 다음 신상품도 기대할게요.', date: '2025-05-17', profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor5' }
];

// 공지사항 데이터
const notificationsData = [
  { id: 1, title: '신규 기능 추가 안내', content: '피어몰에 새로운 기능이 추가되었습니다. 이제 더욱 편리하게 이용하실 수 있습니다.', date: '2025-05-20', important: true },
  { id: 2, title: '여름 할인 이벤트 오픈', content: '여름 맞이 특별 할인 이벤트를 진행합니다. 최대 50%까지 할인된 가격으로 제품을 만나보세요.', date: '2025-05-18', important: true },
  { id: 3, title: '커뮤니티 가이드라인 업데이트', content: '더 나은 소통 환경을 위해 커뮤니티 가이드라인이 업데이트되었습니다. 확인해주세요.', date: '2025-05-15', important: false },
  { id: 4, title: '신규 파트너십 체결 소식', content: '새로운 파트너십을 통해 더 다양한 서비스를 제공할 예정입니다.', date: '2025-05-10', important: false }
];

// 알림 데이터
const alertsData = [
  { id: 1, title: '새로운 팔로워', message: '사용자 홍길동님이 팔로우했습니다', time: '1시간 전', type: 'follow', read: false },
  { id: 2, title: '제품 리뷰', message: '제품 "무선 이어폰"에 새 리뷰가 달렸습니다', time: '3시간 전', type: 'review', read: false },
  { id: 3, title: '업데이트 완료', message: '시스템 업데이트가 완료되었습니다', time: '어제', type: 'system', read: true },
  { id: 4, title: '새 메시지', message: '김철수님으로부터 새 메시지가 도착했습니다', time: '2일 전', type: 'message', read: true },
  { id: 5, title: '이벤트 알림', message: '참여하신 이벤트가 곧 종료됩니다', time: '3일 전', type: 'event', read: true }
];

// 광고 데이터
const sponsorsData = [
  { 
    id: 1, 
    title: '여름 특별 프로모션', 
    description: '시원한 여름 맞이 특별 할인 행사', 
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400', 
    link: '#' 
  },
  { 
    id: 2, 
    title: '신제품 출시 기념 이벤트', 
    description: '혁신적인 신제품을 만나보세요', 
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=400', 
    link: '#' 
  }
];

// 히어로 섹션 슬라이더 데이터
const heroSlides = [
  {
    id: 1,
    title: '새로운 시즌 컬렉션',
    subtitle: '2025 여름 신상품 출시',
    description: '트렌디한 디자인과 혁신적인 기술을 담은 신제품들을 지금 만나보세요.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200',
    buttonText: '지금 쇼핑하기',
    buttonLink: '#'
  },
  {
    id: 2,
    title: '특별 프로모션',
    subtitle: '이달의 특가 상품',
    description: '한정된 시간 동안 최대 40% 할인된 가격으로 제공됩니다.',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200',
    buttonText: '할인 보러가기',
    buttonLink: '#'
  },
  {
    id: 3,
    title: '회원 전용 혜택',
    subtitle: '가입하고 특별한 혜택을 누리세요',
    description: '멤버십 가입 시 첫 구매 15% 할인 및 무료 배송 혜택을 드립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200',
    buttonText: '가입하기',
    buttonLink: '#'
  }
];

// 팔로잉 피어몰 데이터
const followingPeermalls = [
  { 
    id: 'peermall-1', 
    title: '디자인 스튜디오', 
    owner: '김디자이너', 
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=design', 
    followers: 1240, 
    description: '창의적인 디자인과 브랜딩 서비스를 제공합니다.'
  },
  { 
    id: 'peermall-2', 
    title: '테크 솔루션', 
    owner: '이개발자', 
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=tech', 
    followers: 980, 
    description: 'IT 솔루션과 개발 서비스를 전문으로 합니다.'
  },
  { 
    id: 'peermall-3', 
    title: '유기농 식품점', 
    owner: '박농부', 
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=organic', 
    followers: 560, 
    description: '건강한 유기농 식품을 직접 농장에서 배송합니다.'
  },
  { 
    id: 'peermall-4', 
    title: '공예품 공방', 
    owner: '정공예가', 
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=craft', 
    followers: 340, 
    description: '전통과 현대가 어우러진 수제 공예품을 제작합니다.'
  }
];

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
  activeSection: 'home' | 'content' | 'community' | 'following' | 'guestbook';
  onNavigateToSection: (section: 'home' | 'content' | 'community' | 'following' | 'guestbook') => void;
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
            
            // 더미 데이터 저장 (실제 앱에서는 필요 없을 수 있음)
            for (const content of loadedContents) {
              await add('contents', content);
            }
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
  
  const renderMapModal = () => (
    <Dialog open={showMapModal} onOpenChange={setShowMapModal} className="max-w-5xl">
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            피어맵
          </DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-hidden rounded-lg">
          <EcosystemMap />
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

  // 위젯 토글 함수
  const toggleWidgets = () => setShowWidgets(!showWidgets);

  if (!address) {
    return <div className="container mx-auto p-6"><EmptyState title="404 - 피어스페이스를 찾을 수 없습니다" description="올바른 피어스페이스 주소인지 확인해주세요." /></div>;
  }

  const renderHomeSection = () => (
    <>
      {/* 히어로 섹션 */}
      <section className="relative mb-8 rounded-xl overflow-hidden h-[400px] shadow-lg">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              currentHeroSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="container mx-auto h-full flex flex-col justify-center px-8">
              <div className="max-w-lg">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs uppercase">{slide.subtitle}</span>
                <h1 className="text-4xl font-bold text-white mt-4 mb-3">{slide.title}</h1>
                <p className="text-white/80 mb-6 text-lg">{slide.description}</p>
                <Button className="bg-white text-blue-700 hover:bg-blue-50">{slide.buttonText}</Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider controls */}
        <div className="absolute bottom-5 right-5 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`w-3 h-3 rounded-full ${
                currentHeroSlide === index ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentHeroSlide(index)}
            />
          ))}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 max-w-[200px]">
          {config.badges.map((badge, i) => (
            <Badge key={i} className="bg-white/90 text-blue-800 shadow-sm">{badge}</Badge>
          ))}
        </div>
      </section>

      {/* 제품/콘텐츠 섹션 */}
      <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
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
        </div>
        
        <div className="p-6">
          {filteredProducts.length > 0 ? (
            <div className={currentView === 'blog' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredProducts.slice(0, 8).map((product) => (
                <div key={product.id}>
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    price={Number(product.price || 0)}
                    discountPrice={null}
                    imageUrl={product.imageUrl}
                    rating={4.5}
                    reviewCount={10}
                    peermallName={config.title}
                    peermallId={address}
                    category={product.category || '기타'}
                    tags={product.tags || []}
                    viewMode={currentView === 'blog' ? 'grid' : 'list'}
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
          
          {filteredProducts.length > 8 && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => onNavigateToSection('content')}>
                더 보기 <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 게시글 섹션 - 첨부 이미지 스타일 참고하여 개선 */}
      <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">최신 게시글</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigateToSection('community')}>
            모든 게시글 보기
          </Button>
        </div>
        
        <div className="p-6">
          {filteredPosts.length > 0 ? (
            <>
              {/* 블로그형 주요 게시물 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {filteredPosts.slice(0, 4).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-40 relative overflow-hidden bg-gray-200">
                      {post.imageUrl ? (
                        <>
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <FileText className="w-12 h-12" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2">
                        {post.tags && post.tags.length > 0 && (
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm">{post.tags[0]}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-bold text-base line-clamp-2 mb-1">{post.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />{post.likes}</span>
                          <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" />{post.comments}</span>
                        </div>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* 리스트형 게시물 */}
              <div>
                <h3 className="font-bold text-lg mb-3 pl-2 border-l-4 border-blue-500">인기 게시글</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {filteredPosts.slice(4, 9).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 hover:bg-white rounded-lg transition-colors cursor-pointer mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                          {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{post.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />{post.likes}</span>
                              <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" />{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
              
              {filteredPosts.length > 9 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => onNavigateToSection('community')}>
                    더 보기 <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              )}
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
        </div>
      </section>
            
      {/* 방명록 섹션 */}
      <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">방명록</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigateToSection('guestbook')}>
            전체 방명록 보기
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {guestbookData.slice(0, 4).map(entry => (
              <Card key={entry.id} className="bg-gray-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium overflow-hidden">
                      <img src={entry.profileImg} alt={entry.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium">{entry.author}</h4>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{entry.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <textarea 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="방명록을 남겨보세요..."
              rows={3}
            ></textarea>
            <div className="mt-2 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                방명록 남기기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  
  const renderContentSection = () => (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">제품 & 콘텐츠</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 cursor-pointer">전체</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">전자제품</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">패션</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">생활용품</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">도서</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">음식</Badge>
          <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">취미</Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 border-b">
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
        </div>
        
        <div className="flex items-center gap-2">
          <select className="p-2 border rounded text-sm">
            <option>최신순</option>
            <option>인기순</option>
            <option>가격 낮은순</option>
            <option>가격 높은순</option>
          </select>
          
          {isOwner && (
            <Button variant="outline" size="sm" onClick={handleShowProductForm}>
              제품 추가
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className={currentView === 'blog' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price || 0)}
                  discountPrice={null}
                  imageUrl={product.imageUrl}
                  rating={4.5}
                  reviewCount={10}
                  peermallName={config.title}
                  peermallId={address}
                  category={product.category || '기타'}
                  tags={product.tags || []}
                  viewMode={currentView === 'blog' ? 'grid' : 'list'}
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
      </div>
    </div>
  );
  
  const renderCommunitySection = () => (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">커뮤니티</h2>
        <Button variant="outline" size="sm">글쓰기</Button>
      </div>
      
      <div className="p-6">
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex md:items-center p-4 flex-col md:flex-row gap-4">
                  <div className="md:w-1/3 w-full h-48 md:h-32 rounded-md overflow-hidden bg-gray-100">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      {post.tags && post.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100">{tag}</Badge>
                      ))}
                      <span className="text-xs text-gray-500">{post.category}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center"><Heart className="w-4 h-4 mr-1" />{post.likes}</span>
                        <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" />{post.comments}</span>
                        <span className="flex items-center"><User className="w-4 h-4 mr-1" />{config.owner}</span>
                      </div>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
      </div>
    </div>
  );
  
  const renderFollowingSection = () => (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">팔로잉 피어몰</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {followingPeermalls.length > 0 ? (
            followingPeermalls.map(mall => (
              <Card key={mall.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img src={mall.profileImage} alt={mall.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{mall.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">{mall.owner}</span> · 팔로워 {mall.followers.toLocaleString()}명
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{mall.description}</p>
                      
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">
                          <User className="w-4 h-4 mr-1" />
                          방문하기
                        </Button>
                        <Button variant="secondary" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          메시지
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">아직 팔로우 중인 피어몰이 없습니다</h3>
              <p className="text-gray-500 mb-4">관심 있는 피어몰을 찾아 팔로우 해보세요.</p>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                피어몰 찾기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderGuestbookSection = () => (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">방명록</h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">방명록 남기기</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <textarea 
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="방명록을 남겨보세요..."
              rows={4}
            ></textarea>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                로그인하지 않은 경우 이름이 '익명'으로 표시됩니다.
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                방명록 남기기
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">모든 방명록</h3>
          <div className="space-y-4">
            {guestbookData.map(entry => (
              <Card key={entry.id} className="bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={entry.profileImg} alt={entry.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{entry.author}</h4>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{entry.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
            {activeSection === 'home' && renderHomeSection()}
            {activeSection === 'content' && renderContentSection()}
            {activeSection === 'community' && renderCommunitySection()}
            {activeSection === 'following' && renderFollowingSection()}
            {activeSection === 'guestbook' && renderGuestbookSection()}
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
                    <EcosystemMap />
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
      {renderQRModal()}
      {renderProductFormModal()}
      {isOwner && renderSettingsModal()}
      {renderMapModal()}
    </div>
  );
};

export default PeerSpaceHome;
