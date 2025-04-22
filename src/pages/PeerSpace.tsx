// File: PeerSpace.tsx (Incorporating MyMall requirements)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast'; // Assuming use-toast is setup
import { Progress } from "@/components/ui/progress"; // Assuming Progress is setup
import {
    Phone, MessageSquare, QrCode, Star, ArrowRight, User, Clock, Calendar, GripVertical, Palette, EyeOff, Settings2, Bell, ScreenShare, Search, Menu,
    Share2, ExternalLink, Plus, MapPin, Settings, Smartphone, Mail, Edit, Link2, Rss, LayoutGrid, Rows, Image as ImageIcon, Paintbrush, MessageCircleQuestion,
    Heart, BookmarkPlus, ShoppingBag, FileText, Link, Flame, Users, Award, Puzzle, Compass, RadioTower, HandCoins, ShieldCheck, GitBranch,
    Gift, Target, Sparkles, Lightbulb, Zap, ThumbsUp, Eye, CheckCircle, Home, Info, Store, MessageCircle, Activity, GalleryHorizontal, HelpCircle, BarChart2, History, ListChecks, StarHalf
} from 'lucide-react'; // Ensure lucide-react is installed

// --- Type Definitions (Include or import these) ---

interface PeerData {
    id: string;
    title: string;
    description: string;
    owner: string;
    peerNumber: string;
    profileImage: string;
    coverImage?: string; // Optional Cover Image
    badges: string[];
    followers: number;
    recommendations: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
    isVerified?: boolean;
    socialLinks?: { [key: string]: string };
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
    familyGuilds?: { id: string; name: string; imageUrl: string }[];
}

interface MyMallConfig extends PeerData {
    skin: string; // Identifier for the chosen layout/style theme
    sections: string[]; // Array of section IDs defining the order and visibility
    customizations: { // Object for specific settings
        primaryColor?: string;
        showChat?: boolean;
        allowComments?: boolean;
        showBadges?: boolean;
        contentDisplayCount?: { [sectionId: string]: number }; // e.g., { latestContent: 4 }
        // Add more customization fields as needed
    };
}

interface Content {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    type: 'portfolio' | 'service' | 'event' | 'product' | 'post' | 'review' | 'quest' | 'unknown'; // Added unknown, adjust as needed
    date?: string;
    price?: string;
    likes?: number;
    comments?: number;
    saves?: number;
    views?: number;
    rating?: number; // For reviews
    isExternal?: boolean;
    externalUrl?: string; // URL for external content
    source?: string; // e.g., 'YouTube', 'Naver Blog'
    sourceType?: 'blog' | 'video' | 'store' | 'article' | 'other'; // More specific source type
    // Fields for Events/Quests
    participants?: number;
    maxParticipants?: number;
    goal?: number;
    progress?: number;
    reward?: string;
    deadline?: string;
}

interface Review {
    id: string;
    author: string;
    authorImage: string;
    content: string;
    rating: number;
    date: string;
    source: 'internal' | 'external';
    sourceSite?: string; // If external
    likes?: number;
    peerMall: {
        id: string;
        name: string;
        address: string;
    };
}

interface CommunityPost {
    id: string;
    title: string;
    author: string;
    date: string;
    comments: number;
    likes: number;
    views?: number;
}

interface Event extends Omit<Content, 'type'> { // Extends Content without 'type'
    location: string;
    participants: number;
    maxParticipants: number;
    deadline?: string;
    type: 'event'; // Explicitly set type
}

interface Quest extends Omit<Content, 'type'> { // Extends Content without 'type'
    deadline: string;
    reward: string;
    participants: number;
    goal: number;
    type: 'individual' | 'community';
    progress?: number;
    imageUrl: string; // Add missing property
}

interface MapLocation {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: 'studio' | 'workshop' | 'shop' | 'event' | 'peer'; // Added types
}

interface BadgeData {
    id: string;
    name: string;
    icon: React.ElementType; // Use Lucide icon component
    description: string;
    color?: string; // Tailwind color class (e.g., 'text-yellow-500')
}

// --- Mock Data (Refined for MyMall Context) ---

const myMallData: MyMallConfig = {
    id: 'mymall-creative-hub',
    title: '김피어의 크리에이티브 허브',
    description: '디자인, 영감, 커뮤니티가 만나는 곳. 함께 성장해요!',
    owner: '김피어',
    peerNumber: 'P-12345-6789',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=KimPeer',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1920',
    badges: ['인증완료', '골드회원', '디자인전문가', '커뮤니티 리더', '퀘스트 마스터'], // Raw badge names
    followers: 135,
    recommendations: 52,
    level: 6,
    xp: 250,
    xpToNextLevel: 1200,
    isVerified: true,
    skin: 'creator-hub-default', // Simulate chosen skin
    sections: ['hero', 'latestContent', 'communitySpotlight', 'eventsAndQuests', 'map', 'reviews'], // Simulate section order
    customizations: { // Simulate customization settings
        primaryColor: '#71c4ef', // Accent-100
        showChat: true,
        allowComments: true,
        showBadges: true,
        contentDisplayCount: { latestContent: 4, communitySpotlight: 3, reviews: 3 },
    },
    socialLinks: { /* ... */ },
    contactPhone: '02-123-4567',
    contactEmail: 'contact@peermall.com',
    address: '서울시 강남구 테헤란로 123',
    familyGuilds: [
       { id: 'guild1', name: '브랜딩 마스터즈', imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=branding' }
    ]
};

const contentItems: Content[] = [
    {
        id: 'content1', title: '디자인 포트폴리오: 모던 브랜딩', description: '최근 작업한 모던하고 세련된 브랜딩 디자인 결과물입니다.',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', // More relevant portfolio image
        type: 'portfolio', date: '2일 전', likes: 24, comments: 5, saves: 12, views: 150, isExternal: false
    },
    {
        id: 'ext-product1', title: '미니멀리스트 데스크 램프', description: '깔끔한 디자인의 LED 데스크 램프, 내 스마트스토어에서 판매 중!',
        imageUrl: 'https://images.unsplash.com/photo-1543508286-a104a6f469d7?auto=format&fit=crop&q=80&w=800', // Different product image
        type: 'product', price: '45,000원', likes: 35, comments: 7, saves: 20, views: 250,
        isExternal: true, externalUrl: 'https://smartstore.naver.com/kimp/products/123', source: '네이버 스마트스토어', sourceType: 'store'
    },
    {
        id: 'ext-blog1', title: '2025년 디자인 트렌드 분석', description: '올해 주목해야 할 비주얼 트렌드를 내 개인 블로그에 정리했어요.',
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', // Blog/trend related image
        type: 'post', date: '5일 전', likes: 50, comments: 15, saves: 30, views: 400,
        isExternal: true, externalUrl: 'https://kimp-design.blog/trends-2025', source: '개인 블로그', sourceType: 'blog'
    },
     {
        id: 'ext-review1', title: '최애 카페 방문 후기 (유튜브)', description: '분위기 좋은 카페 리뷰 영상을 유튜브에 올렸어요!',
        imageUrl: 'https://images.unsplash.com/photo-1511920183353-311a5ff489a5?auto=format&fit=crop&q=80&w=800', // Cafe review image
        type: 'review', date: '1주 전', likes: 105, comments: 25, saves: 40, views: 1200, rating: 5,
        isExternal: true, externalUrl: 'https://youtube.com/watch?v=abcdefg', source: 'YouTube', sourceType: 'video'
    },
    {
        id: 'content3', title: '디자인 워크샵: 브랜딩 기초', description: '함께 배우는 브랜드 디자인 워크샵! 기초부터 탄탄하게.',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', // Workshop/collaboration image
        type: 'event', date: '2025년 5월 15일', price: '50,000원', likes: 32, comments: 8, saves: 18, views: 210, isExternal: false, participants: 8, maxParticipants: 12
    },
];

const reviews: Review[] = [
  {
    id: 'review1', author: '이지은', authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jieun',
    content: '디자인 컨설팅을 받았는데 정말 만족스러웠어요. 멋진 로고 감사합니다!', rating: 5, date: '2025-04-10', source: 'internal', likes: 5,
    peerMall: { id: 'mall123', name: '이지은의 공방', address: '서울시 마포구' }
  },
  {
    id: 'review2', author: '박민석', authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Minseok',
    content: '워크샵 내용이 알찼습니다. 실전 팁 최고!', rating: 4, date: '2025-04-05', source: 'external', sourceSite: '디자인 커뮤니티', likes: 3,
    peerMall: { id: 'mall456', name: '박민석 스튜디오', address: '서울시 성동구' }
  },
];
const communityPosts: CommunityPost[] = [
   { id: 'post1', title: '봄맞이 디자인 트렌드 정보', author: '김피어', date: '2025-04-18', comments: 8, likes: 24, views: 180 },
   { id: 'post2', title: '로고 디자인 작업 과정 공유', author: '김피어', date: '2025-04-15', comments: 12, likes: 36, views: 220 },
];
const events: Event[] = [
  {
    id: 'event1', title: '디자인 워크샵: 브랜딩 기초', date: '2025년 5월 15일', location: '온라인 Zoom',
    description: '기초부터 배우는 브랜드 디자인 워크샵!', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', // Workshop/collaboration image
    participants: 8, maxParticipants: 12, price: '50,000원', likes: 45, comments: 12, saves: 22, views: 350,
    type: 'event'
  }
];
const quests: Quest[] = [
  {
    id: 'quest1', title: '브랜드 아이덴티티 챌린지', deadline: '2025년 5월 30일',
    description: '자신만의 브랜드 로고와 색상 팔레트를 개발하고 공유!', reward: '디자이너 칭호 + 500 XP', participants: 24, goal: 50, type: 'community', progress: 48,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800' // Challenge/community related image
  },
   {
    id: 'quest2', title: '포트폴리오 피드백 교환', deadline: '2025년 5월 20일',
    description: '다른 피어의 포트폴리오에 건설적인 피드백 3개 남기기', reward: '200 XP + 피드백 전문가 뱃지', participants: 15, goal: 3, type: 'individual', progress: 1,
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800' // Feedback/collaboration image
  }
];
const mapLocations: MapLocation[] = [
   { id: 'loc1', name: '김피어 디자인 스튜디오', address: '서울시 강남구 테헤란로 123', lat: 37.501, lng: 127.037, type: 'studio' },
   { id: 'loc2', name: '워크샵 장소 (대관)', address: '서울시 마포구 연남동 45', lat: 37.560, lng: 126.927, type: 'event' },
];
const badgesAndAchievementsData: BadgeData[] = [ // Changed name for clarity
  { id: 'badge1', name: '디자인 전문가', icon: Award, description: '전문성 인증', color: 'text-yellow-500' },
  { id: 'badge2', name: '친절한 피어', icon: Heart, description: '고객 만족 우수', color: 'text-red-500' },
  { id: 'badge3', name: '트렌드 세터', icon: Flame, description: '최신 트렌드 선도', color: 'text-orange-500' },
  { id: 'badge4', name: '커뮤니티 리더', icon: Users, description: '활발한 소통 기여', color: 'text-blue-500' },
  { id: 'badge5', name: '퀘스트 마스터', icon: Target, description: '다수 퀘스트 완료', color: 'text-green-500' },
];
const referenceLinks = [ /* ... Can be used within specific sections if needed ... */ ];

const contentTypes = [
  { id: 'type1', name: '상품', description: '판매할 제품 등록', icon: ShoppingBag },
  { id: 'type2', name: '포트폴리오', description: '작업물 전시', icon: Edit },
  { id: 'type3', name: '서비스', description: '제공할 서비스 등록', icon: HandCoins },
  { id: 'type4', name: '게시글', description: '커뮤니티에 글 작성', icon: MessageCircle },
  { id: 'type5', name: '외부 링크', description: '외부 콘텐츠/리뷰 연결', icon: Link2 },
  { id: 'type6', name: '이벤트', description: '이벤트 생성', icon: Calendar },
];

// --- Conceptual Header Component ---
// You can move this to a separate file: src/components/peer-space/MyMallHeader.tsx
const MyMallHeader = ({ mallData, isOwner, onAddContent, onCustomize }: {
    mallData: MyMallConfig;
    isOwner: boolean;
    onAddContent: () => void;
    onCustomize: () => void;
    // Add other props: notificationCount, userMenuItems, onSearch, etc.
}) => {
   const navigate = useNavigate(); // If needed for navigation within header

   // Basic Navigation Items based on Req 4.7
   const navItems = [
       { label: '홈', icon: Home, link: '#' }, // Link to MyMall home
       { label: '상품', icon: Store, link: '#products' }, // Link to product section or page
       { label: '커뮤니티', icon: MessageCircle, link: '#community' }, // Link to community section
       { label: '이벤트', icon: Activity, link: '#events' }, // Link to events/quests
       // Add more based on active sections/skin
   ];

   return (
     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
       <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
         {/* Left: Logo/Title & Nav */}
         <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate(`/mall/${mallData.id}`)}> {/* Link to mall home */}
                <AvatarImage src={mallData.profileImage} alt={mallData.owner}/>
                <AvatarFallback>{mallData.owner.substring(0,1)}</AvatarFallback>
            </Avatar>
            <span className="font-bold text-lg hidden md:inline">{mallData.title}</span>
            {/* Desktop Navigation */}
             <nav className="hidden lg:flex items-center space-x-4 text-sm ml-4">
                 {navItems.map(item => (
                     <a key={item.label} href={item.link} className="flex items-center gap-1 text-text-200 hover:text-accent-100 transition-colors">
                         <item.icon className="h-4 w-4"/> {item.label}
                     </a>
                 ))}
             </nav>
         </div>

         {/* Center: Search (Optional) */}
         <div className="flex-1 max-w-md hidden md:block mx-auto">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                 <Input placeholder="MyMall 내 콘텐츠 검색..." className="h-9 pl-10 rounded-full bg-bg-100 border-gray-200 focus:bg-white focus:border-accent-100"/>
             </div>
         </div>

         {/* Right: Actions & User Menu */}
         <div className="flex items-center gap-2 flex-shrink-0">
             {isOwner && (
                 <>
                    <Button size="sm" variant="outline" onClick={onCustomize} className="hidden sm:inline-flex items-center gap-1 border-gray-300 text-text-200 hover:border-accent-100 hover:text-accent-100">
                        <Palette className="h-4 w-4"/> 꾸미기
                    </Button>
                    <Button size="sm" onClick={onAddContent} className="bg-accent-100 hover:bg-accent-200 text-white items-center gap-1">
                        <Plus className="h-4 w-4"/> 추가
                    </Button>
                 </>
             )}
             <Button variant="ghost" size="icon" className="relative text-text-200 hover:text-accent-100 hover:bg-accent-100/10">
                 <Bell className="h-5 w-5"/>
                 {/* Add notification indicator dot if needed */}
                 {/* <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span> */}
             </Button>
             {/* Mobile Menu Trigger */}
             <Button variant="ghost" size="icon" className="lg:hidden text-text-200 hover:text-accent-100 hover:bg-accent-100/10">
                 <Menu className="h-5 w-5"/>
             </Button>
             {/* User Dropdown Menu (Conceptual) */}
              {/* Use Shadcn DropdownMenu component here */}
             <Button variant="ghost" size="icon" className="hidden lg:inline-flex text-text-200 hover:text-accent-100 hover:bg-accent-100/10">
                 <User className="h-5 w-5"/>
             </Button>
         </div>
       </div>
     </header>
   );
}


// --- Main Component (Now named PeerSpace) ---
const PeerSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume logged in
  const [isOwner, setIsOwner] = useState(true); // Assume owner for demo

  // States for Modals and Interactions
  const [showQRModal, setShowQRModal] = useState(false);
  const [showContentDetailModal, setShowContentDetailModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const [qrUrl, setQrUrl] = useState(`https://peermall.com/mall/${myMallData.id}`);
  const [selectedContent, setSelectedContent] = useState<Content | Event | Quest | null>(null);
  const [newContentType, setNewContentType] = useState('');
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const [externalPreview, setExternalPreview] = useState<Partial<Content> | null>(null);

  // Simulate owner's customizations (replace with fetched data)
  const [mallConfig, setMallConfig] = useState<MyMallConfig>(myMallData); // Use fetched data here

  // --- Event Handlers ---
  const showFeedbackToast = (title: string, description: string, icon?: React.ReactNode) => {
      toast({
          title: title,
          description: description,
      });
  };

const handleInteraction = async (type: 'like' | 'save', contentId: string) => {
    let feedbackTitle = '';
    let feedbackDesc = '';
    let feedbackIcon = null;

    switch (type) {
      case 'like':
        feedbackTitle = '좋아요!';
        feedbackDesc = '콘텐츠에 좋아요 (+5 XP)';
        feedbackIcon = <Heart className="h-5 w-5 text-red-500" />;
        break;
      case 'save':
        feedbackTitle = '저장!';
        feedbackDesc = '나중에 볼 콘텐츠로 저장 (+5 XP)';
        feedbackIcon = <BookmarkPlus className="h-5 w-5 text-blue-500" />;
        break;
      default:
        return;
    }

    // 임시 API 호출 모의
    const mockApiCall = async (type: string, contentId: string) => {
        try {
            // 실제 API 호출 시에는 여기에 API 호출 코드를 추가
            console.log(`API 호출: ${type} - ${contentId}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
            return { success: true };
        } catch (error) {
            console.error('API 호출 실패:', error);
            return { success: false };
        }
    };

    const result = await mockApiCall(type, contentId);
    if (result.success) {
        showFeedbackToast(feedbackTitle, feedbackDesc, feedbackIcon);
        // 상태 업데이트
        switch (type) {
            case 'like': {
                const contentIndex = contentItems.findIndex(content => content.id === contentId);
                if (contentIndex !== -1) {
                    contentItems[contentIndex].likes = (contentItems[contentIndex].likes || 0) + 1;
                }
                break;
            }
            case 'save': {
                const saveIndex = contentItems.findIndex(content => content.id === contentId);
                if (saveIndex !== -1) {
                    contentItems[saveIndex].saves = (contentItems[saveIndex].saves || 0) + 1;
                }
                break;
            }
        }
    } else {
        toast({ title: '오류', description: '서버와의 통신 중 오류가 발생했습니다.' });
    }
};
  const handleContentClick = (content: Content | Event | Quest) => {
     if ('isExternal' in content && content.isExternal && content.externalUrl) {
        window.open(content.externalUrl, '_blank', 'noopener,noreferrer');
        toast({ title: '외부 링크로 이동합니다...', description: content.source });
     } else {
        setSelectedContent(content);
        setShowContentDetailModal(true);
     }
  };

  const handleAddContent = () => {
    setNewContentType('');
    setExternalUrlInput('');
    setExternalPreview(null);
    setShowAddContentModal(true);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      showFeedbackToast('콘텐츠 추가 완료', `새 ${newContentType} 등록 (+50 XP)`, <CheckCircle className="h-5 w-5 text-green-500"/>);
      setShowAddContentModal(false);
      // TODO: API call and UI update
  };

  const handleFetchExternalPreview = async () => {
     if (!externalUrlInput) return;
     toast({ title: '외부 정보 가져오는 중...', description: externalUrlInput });
     // --- !!! Replace with ACTUAL backend API call !!! ---
     await new Promise(resolve => setTimeout(resolve, 1500));
     const isReviewLink = externalUrlInput.includes('review') || externalUrlInput.includes('youtube');
     const isProductLink = externalUrlInput.includes('store') || externalUrlInput.includes('product');
     setExternalPreview({
        title: '가져온 콘텐츠 제목 (자동)', description: '외부 페이지 설명...',
        imageUrl: 'https://via.placeholder.com/150/d4eaf7/3b3c3d?text=Preview',
        price: isProductLink ? '50,000원 (추정)' : undefined,
        type: isReviewLink ? 'review' : isProductLink ? 'product' : 'post',
        isExternal: true, externalUrl: externalUrlInput,
        source: new URL(externalUrlInput).hostname
     });
     toast({ title: '미리보기 로드 완료!' });
  };

  const handleAddExternalContent = (e: React.FormEvent) => {
     e.preventDefault();
     if (!externalPreview) return;
     showFeedbackToast('외부 링크 추가 완료', `${externalPreview.title} 링크 추가 (+20 XP)`, <Link2 className="h-5 w-5 text-blue-500"/>);
     setShowAddContentModal(false);
     // TODO: API call and add contentItems state update
  };

  // --- Render Functions ---

  const renderContentCard = (content: Content | Event | Quest) => {
      const isExternal = 'isExternal' in content && content.isExternal;
      const cardOnClick = () => handleContentClick(content);

      let typeBadge;
      const type = 'type' in content ? content.type : 'unknown';
      switch (type) {
          case 'portfolio': typeBadge = <Badge variant="secondary">포트폴리오</Badge>; break;
          case 'service': typeBadge = <Badge className="bg-green-500 text-white">서비스</Badge>; break;
          case 'product': typeBadge = <Badge className="bg-blue-500 text-white">상품</Badge>; break;
          case 'event': typeBadge = <Badge variant="destructive">이벤트</Badge>; break;
          case 'post': typeBadge = <Badge variant="outline">게시글</Badge>; break;
          case 'review': typeBadge = <Badge className="bg-yellow-500 text-white">리뷰</Badge>; break;
          case 'quest': typeBadge = <Badge className="bg-purple-500 text-white">퀘스트</Badge>; break;
          default: typeBadge = null;
      }

      return (
          <Card
              key={content.id}
              className={`overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col bg-white cursor-pointer group ${isExternal ? 'border-l-4 border-accent-100' : ''}`}
              onClick={cardOnClick}
          >
              <div className="aspect-[16/10] relative overflow-hidden"> {/* Adjusted aspect ratio */}
                  <img
                      src={content.imageUrl} alt={content.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex flex-col space-y-1"> {/* Stack badges */}
                      {typeBadge}
                      {isExternal && (
                           <Badge variant="outline" className="bg-black/60 text-white text-xs px-2 py-0.5 flex items-center"> {/* Smaller external badge */}
                               <ExternalLink className="h-2.5 w-2.5 mr-1" /> 외부
                           </Badge>
                       )}
                  </div>
              </div>
              <CardContent className="p-4 flex-grow">
                  <h3 className="font-semibold text-base mb-1 line-clamp-2 text-text-100 group-hover:text-accent-100 transition-colors">{content.title}</h3>
                  <p className="text-xs text-text-200 mb-2 line-clamp-2">{content.description}</p>
                  {'price' in content && content.price && <p className="font-bold text-blue-600 text-sm mb-1">{content.price}</p>}
                  {content.date && content.date !== '' && !('price' in content && content.price) && <p className="text-xs text-text-200 flex items-center mb-1"><Clock className="h-3 w-3 mr-1" /> {content.date}</p>}

                   {/* Progress indicators */}
                   {'participants' in content && 'maxParticipants' in content && content.maxParticipants && ( <div className="my-1"><Progress value={(content.participants / content.maxParticipants) * 100} className="h-1.5" /><p className="text-[10px] text-text-200 mt-0.5">{content.participants}/{content.maxParticipants} 참여</p></div> )}
                   {'progress' in content && 'goal' in content && content.goal && ( <div className="my-1"><Progress value={(content.progress / content.goal) * 100} className="h-1.5" /><p className="text-[10px] text-text-200 mt-0.5">{content.progress ?? 0}/{content.goal} 완료</p></div> )}

                  {isExternal && 'source' in content && <p className="text-[10px] text-gray-500 flex items-center mt-1"><Link className="h-2.5 w-2.5 mr-1" /> 출처: {content.source}</p>}
              </CardContent>
              <CardFooter className="p-3 border-t bg-bg-100/30 flex justify-between items-center">
                  <div className="flex space-x-2.5 text-xs text-text-200">
                      <button onClick={(e) => { e.stopPropagation(); handleInteraction('like', content.id); }} className="flex items-center hover:text-red-500 transition-colors"><Heart className="h-3.5 w-3.5 mr-0.5" /> {content.likes ?? 0}</button>
                      <button onClick={(e) => { e.stopPropagation(); handleInteraction('save', content.id); }} className="flex items-center hover:text-blue-500 transition-colors"><BookmarkPlus className="h-3.5 w-3.5 mr-0.5" /> {content.saves ?? 0}</button>
                      <span className="flex items-center"><MessageCircle className="h-3.5 w-3.5 mr-0.5" /> {content.comments ?? 0}</span>
                      {/* <span className="flex items-center"><Eye className="h-3.5 w-3.5 mr-0.5" /> {content.views ?? 0}</span> */}
                  </div>
                   {isExternal ? <ExternalLink className="h-4 w-4 text-accent-100" /> : <ArrowRight className="h-4 w-4 text-accent-100 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </CardFooter>
          </Card>
      );
  };

  const renderQuestCard = (quest: Quest) => (
    <Card key={quest.id} className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col bg-white cursor-pointer group" onClick={() => handleContentClick(quest)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold text-purple-700 group-hover:text-purple-900">{quest.title}</CardTitle>
          <Badge variant={quest.type === 'community' ? "default" : "secondary"} className={`ml-2 shrink-0 text-xs ${quest.type === 'community' ? 'bg-purple-100 text-purple-800' : ''}`}>
            {quest.type === 'community' ? `${quest.participants}명 참여` : '개인 목표'}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs text-text-200 pt-1">
          <Calendar className="h-3 w-3 mr-1" /> 마감: {quest.deadline}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3">
        <p className="text-xs text-text-200 mb-3 line-clamp-2">{quest.description}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-medium">
             <span>진행도:</span>
             <span>{quest.progress ?? 0} / {quest.goal}</span>
          </div>
          <Progress value={quest.progress ? (quest.progress / quest.goal) * 100 : 0} className="h-1.5 bg-purple-100 [&>div]:bg-purple-500" />
          <div className="text-center text-[10px] text-purple-600 font-semibold pt-1">
             보상: {quest.reward}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t bg-purple-50">
        <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs h-8">
          <Zap className="h-3.5 w-3.5 mr-1" /> 참여하기
        </Button>
      </CardFooter>
    </Card>
  );

  const renderReviewCard = (review: Review) => (
     <Card key={review.id} className="overflow-hidden flex flex-col bg-white">
       <CardContent className="p-4 flex-grow"> {/* Reduced padding */}
         <div className="flex items-center mb-3">
           <Avatar className="h-8 w-8 mr-2"> {/* Smaller Avatar */}
             <AvatarImage src={review.authorImage} alt={review.author} />
             <AvatarFallback>{review.author.substring(0, 1)}</AvatarFallback>
           </Avatar>
           <div className="flex-1">
             <p className="font-semibold text-sm text-text-100">{review.author}</p>
             <div className="flex items-center">
               {Array.from({ length: 5 }).map((_, i) => (
                 <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
               ))}
             </div>
           </div>
            {review.source === 'external' && <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0.5"><ExternalLink className="h-2.5 w-2.5 mr-0.5"/>{review.sourceSite}</Badge>}
         </div>
         <p className="text-xs text-text-200 mb-3 leading-relaxed line-clamp-3">{review.content}</p> {/* Reduced font size */}
         <p className="text-[10px] text-text-300">{new Date(review.date).toLocaleDateString()} 작성</p>
       </CardContent>
       <CardFooter className="p-3 border-t bg-bg-100/30 flex justify-between items-center">
          <div className="text-[10px] text-text-300 flex items-center cursor-pointer hover:text-accent-100" onClick={() => toast({title: `${review.peerMall.name} 방문`})}>
              <Compass className="h-3 w-3 mr-1" /> {review.peerMall.name}
          </div>
         <button onClick={(e) => { e.stopPropagation(); /* Like review logic */ }} className="flex items-center text-xs text-text-200 hover:text-red-500 transition-colors">
             <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {review.likes ?? 0}
         </button>
       </CardFooter>
     </Card>
   );

  const renderContentDetailModal = () => {
      if (!selectedContent) return null;
      // Reuse previous detail modal structure, potentially enhance with more interactive elements
      return (
          <Dialog open={showContentDetailModal} onOpenChange={setShowContentDetailModal}>
              <DialogContent className="max-w-3xl">
                  <DialogHeader><DialogTitle>{selectedContent.title}</DialogTitle></DialogHeader>
                  {/* ... Modal Content based on selectedContent type ... */}
                   <p>Detail view for: {selectedContent.title}</p>
                   <pre className="text-xs max-h-64 overflow-auto bg-gray-100 p-2 rounded">{JSON.stringify(selectedContent, null, 2)}</pre>
              </DialogContent>
          </Dialog>
      );
  };

  const renderAddContentModal = () => {
      // Use the implementation from the previous MyMall refactoring
      return (
          <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
              <DialogContent className="max-w-2xl">
                  <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center">
                          <Plus className="mr-2"/> MyMall에 콘텐츠 추가
                      </DialogTitle>
                  </DialogHeader>
                  {!newContentType ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                          {contentTypes.map(type => ( <Card key={type.id} className="cursor-pointer hover:border-accent-100 transition-colors group text-center p-4 border-2 border-transparent" onClick={() => setNewContentType(type.name)}> <type.icon className="h-10 w-10 mx-auto mb-2 text-gray-400 group-hover:text-accent-100 transition-colors" /> <h3 className="font-semibold mb-1">{type.name}</h3> <p className="text-xs text-text-200">{type.description}</p> </Card> ))}
                      </div>
                  ) : newContentType === '외부 링크' ? (
                      <form onSubmit={handleAddExternalContent} className="space-y-4 mt-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">외부 링크 URL</label>
                              <div className="flex gap-2"><Input placeholder="https://..." required value={externalUrlInput} onChange={(e) => setExternalUrlInput(e.target.value)}/><Button type="button" variant="outline" onClick={handleFetchExternalPreview} disabled={!externalUrlInput}>미리보기</Button></div>
                              <p className="text-xs text-text-200 mt-1">제품, 블로그 글, 리뷰, 유튜브 영상 등의 링크를 입력하세요.</p>
                          </div>
                          {externalPreview && ( <div className="border rounded-md p-4 bg-bg-100 space-y-3"> <h3 className="font-medium mb-2">미리보기</h3> <div className="flex items-center space-x-4"> {externalPreview.imageUrl && <img src={externalPreview.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />} <div className="flex-1"> <p className="font-semibold">{externalPreview.title}</p> <p className="text-sm text-text-200 line-clamp-2">{externalPreview.description}</p> {externalPreview.price && <p className="text-sm font-bold mt-1">{externalPreview.price}</p>} {externalPreview.source && <p className="text-xs text-gray-500 mt-1">출처: {externalPreview.source}</p>} </div> <Badge variant="outline">{externalPreview.type || '콘텐츠'}</Badge> </div> <Textarea placeholder="이 링크에 대한 메모 (선택사항)" rows={2}/> </div> )}
                          <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="ghost" onClick={() => setNewContentType('')}>뒤로</Button><Button type="submit" disabled={!externalPreview}>MyMall에 추가</Button></div>
                      </form>
                  ) : (
                      <form onSubmit={handleContentSubmit} className="space-y-4 mt-4">
                          <div><label>제목</label><Input placeholder={`${newContentType} 제목`} required /></div><div><label>설명</label><Textarea placeholder={`${newContentType} 설명`} required /></div><div><label>대표 이미지</label><div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center"><Plus className="h-8 w-8 text-text-200 mx-auto mb-2" /><p className="text-sm text-text-200">이미지 업로드</p></div></div>
                          {/* Add conditional fields (price, date) */}
                           <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="ghost" onClick={() => setNewContentType('')}>뒤로</Button><Button type="submit">{newContentType} 등록</Button></div>
                      </form>
                  )}
              </DialogContent>
          </Dialog>
      );
  };

  const renderCustomizeModal = () => {
      // Use the conceptual implementation from the previous MyMall refactoring
      return (
           <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
              <DialogContent className="max-w-3xl">
                  <DialogHeader><DialogTitle className="text-2xl font-bold flex items-center"><Palette className="mr-2"/> MyMall 꾸미기</DialogTitle></DialogHeader>
                   <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-4"><h3 className="font-semibold">스킨 선택</h3> <Card className="p-4 text-center cursor-pointer border-2 border-accent-100"><LayoutGrid className="h-8 w-8 mx-auto mb-2 text-accent-100"/><p>Creator Hub (현재)</p></Card> <Card className="p-4 text-center cursor-pointer hover:border-accent-100"><Store className="h-8 w-8 mx-auto mb-2 text-gray-400"/><p>미니멀 스토어</p></Card></div>
                       <div className="space-y-4 md:col-span-2"><h3 className="font-semibold">섹션 순서 & 표시</h3> <div className="space-y-2 border rounded p-4 bg-bg-100">{mallConfig.sections.map((sectionId) => ( <div key={sectionId} className="flex items-center justify-between p-2 bg-white rounded border group"><div className="flex items-center"><GripVertical className="h-5 w-5 mr-2 text-gray-400 cursor-grab group-hover:text-text-100"/><span>{sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span></div><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4"/></Button></div> ))} <Button variant="outline" size="sm" className="w-full mt-2"><Plus className="h-4 w-4 mr-1"/> 섹션 추가</Button></div></div>
                   </div>
                   <div className="flex justify-end mt-6 space-x-2"><Button variant="outline" onClick={() => setShowCustomizeModal(false)}>취소</Button><Button onClick={() => {setShowCustomizeModal(false); toast({title: '꾸미기 저장됨 (시뮬레이션)'})}}>저장하기</Button></div>
              </DialogContent>
           </Dialog>
       );
  };

  const renderQRModal = () => (
       <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
           <DialogContent className="max-w-md">
               <DialogHeader><DialogTitle>MyMall QR 코드</DialogTitle></DialogHeader>
               <div className="p-4 flex justify-center">
                   {/* Replace with actual QR Code Generator */}
                   <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">QR Code Area</div>
               </div>
               <Input readOnly value={qrUrl} className="text-center text-xs"/>
               <Button className="w-full mt-2">이미지 다운로드</Button>
           </DialogContent>
       </Dialog>
   );


  // --- Main Return ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-100 via-bg-200 to-bg-100 text-text-100 font-sans"> {/* Adjusted background */}
       <MyMallHeader
           mallData={mallConfig} // Use state for config
           isOwner={isOwner}
           onAddContent={handleAddContent}
           onCustomize={() => setShowCustomizeModal(true)}
       />

       {/* Cover Image / Hero Section (Rendered conditionally based on config) */}
       {mallConfig.sections.includes('hero') && (
           <section className="relative h-48 md:h-64 bg-gray-300 mb-[-4rem] md:mb-[-6rem] z-0 group">
               {mallConfig.coverImage ? (
                   <img src={mallConfig.coverImage} alt={`${mallConfig.title} Cover`} className="w-full h-full object-cover"/>
               ) : (
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-100 flex items-center justify-center">
                       <Sparkles className="h-12 w-12 text-white opacity-60"/>
                   </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> {/* Subtle gradient overlay */}
                {isOwner && ( /* Edit Cover Button for Owner */
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {/* Open cover image editor */}}>
                        <ImageIcon className="h-4 w-4 mr-1"/> 커버 변경
                    </Button>
                )}
           </section>
       )}

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 relative z-10">

          {/* Profile Header Section with Enhanced UI */}
           <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 mb-8 md:mb-12 bg-white shadow-xl rounded-xl p-6 md:p-8 relative -mt-16 md:-mt-24 border border-gray-100">
               <div className="relative">
                   <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white shadow-lg">
                       <AvatarImage src={mallConfig.profileImage} alt={mallConfig.owner} />
                       <AvatarFallback className="text-5xl">{mallConfig.owner.substring(0,1)}</AvatarFallback>
                   </Avatar>
                   {mallConfig.isVerified && (
                       <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                           <ShieldCheck className="h-5 w-5" />
                       </div>
                   )}
               </div>
               <div className="flex-grow text-center md:text-left mt-4 md:mt-0">
                   <h1 className="text-3xl md:text-4xl font-bold text-text-100 flex items-center justify-center md:justify-start gap-3">
                       {mallConfig.title}
                   </h1>
                   <p className="text-base text-text-200 mt-2 px-4 md:px-0">{mallConfig.description}</p>
                   <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-text-200 mt-4">
                       <span className="flex items-center"><Users className="h-4 w-4 mr-2"/> {mallConfig.followers} 팔로워</span>
                       <span className="flex items-center"><Star className="h-4 w-4 mr-2 text-yellow-400"/> {mallConfig.recommendations} 추천</span>
                       <span className="flex items-center"><Award className="h-4 w-4 mr-2 text-green-500"/> 레벨 {mallConfig.level}</span>
                       <span className="flex items-center"><GitBranch className="h-4 w-4 mr-2 text-purple-500"/> 길드: {mallConfig.familyGuilds?.[0]?.name ?? '없음'}</span>
                   </div>
                    {mallConfig.customizations.showBadges && badgesAndAchievementsData.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            {badgesAndAchievementsData.slice(0, 5).map(b => (
                                <Badge 
                                    key={b.id} 
                                    variant="outline" 
                                    className={`text-sm px-3 py-1.5 border-opacity-50 ${b.color?.replace('text-', 'border-')} ${b.color}`}
                                >
                                    <b.icon className="h-3 w-3 mr-2"/>{b.name}
                                </Badge>
                            ))}
                        </div>
                    )}
               </div>
               <div className="flex flex-col items-center md:items-end space-y-3 mt-4 md:mt-0 flex-shrink-0">
                   {!isOwner && (
                       <Button 
                           className="w-full md:w-auto bg-accent-100 hover:bg-accent-200 text-white h-10 text-base"
                       >
                           <Plus className="h-5 w-5 mr-2"/> 팔로우
                       </Button>
                   )}
                   <Button 
                       variant="outline" 
                       className="w-full md:w-auto h-10 border-gray-300 text-base"
                   >
                       <MessageSquare className="h-5 w-5 mr-2"/> 메시지
                   </Button>
                   <div className="flex space-x-2">
                       <Button 
                           variant="outline" 
                           size="icon" 
                           className="h-10 w-10 border-gray-300 hover:border-accent-100"
                           title="TIE 연결"
                       >
                           <RadioTower className="h-5 w-5"/>
                       </Button>
                       <Button 
                           variant="outline" 
                           size="icon" 
                           className="h-10 w-10 border-gray-300 hover:border-accent-100"
                           title="VI 시작"
                       >
                           <ScreenShare className="h-5 w-5"/>
                       </Button>
                       <Button 
                           variant="outline" 
                           size="icon" 
                           className="h-10 w-10 border-gray-300 hover:border-accent-100"
                           title="QR 코드" 
                           onClick={() => setShowQRModal(true)}
                       >
                           <QrCode className="h-5 w-5"/>
                       </Button>
                       <Button 
                           variant="outline" 
                           size="icon" 
                           className="h-10 w-10 border-gray-300 hover:border-accent-100"
                           title="공유"
                       >
                           <Share2 className="h-5 w-5"/>
                       </Button>
                   </div>
                   <Button 
                       variant="secondary" 
                       size="sm" 
                       className="w-full md:w-auto text-sm bg-pink-100 text-pink-700 hover:bg-pink-200 h-9"
                   >
                       <Gift className="h-4 w-4 mr-2"/> 응원하기
                   </Button>
               </div>
           </div>

          {/* Dynamically Rendered Sections */}
           <div className="space-y-12">
             {mallConfig.sections.map(sectionId => {
                 // Section Rendering Logic (Simplified for brevity)
                 switch (sectionId) {
                     case 'latestContent': return (
                         <section key={sectionId}>
                             <h2 className="text-xl font-semibold mb-4">최신 콘텐츠</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                 {contentItems.slice(0, mallConfig.customizations.contentDisplayCount?.latestContent ?? 4).map(renderContentCard)}
                             </div>
                             {/* Add "View More" button */}
                             <div className="text-center mt-6"><Button variant="outline" size="sm">모든 콘텐츠 보기</Button></div>
                             
                         </section>
                     );
                     case 'communitySpotlight': return (
                         <section key={sectionId}>
                             <h2 className="text-xl font-semibold mb-4">커뮤니티 소식</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card className="bg-white"><CardHeader><CardTitle className="text-base">최신 글</CardTitle></CardHeader><CardContent className="space-y-2">{communityPosts.slice(0, 3).map(post => (<div key={post.id} className="text-xs p-2 rounded hover:bg-bg-100/50 cursor-pointer"><p className="font-medium mb-0.5 text-sm">{post.title}</p><p className="text-text-200">{post.author} • {post.date}</p></div>))}</CardContent><CardFooter><Button variant="link" size="sm" className="text-xs">커뮤니티 더보기</Button></CardFooter></Card>
                                  {mallConfig.customizations.showChat && <Card className="bg-white"><CardHeader><CardTitle className="text-base">실시간 채팅</CardTitle></CardHeader><CardContent className="h-32 overflow-y-auto text-xs space-y-1 p-2 bg-bg-100 rounded"><p>방문자A: 질문 있어요!</p><p className="text-right">김피어: 네, 말씀하세요~</p></CardContent><CardFooter><Button variant="link" size="sm" className="text-xs">채팅 참여하기</Button></CardFooter></Card>}
                              </div>
                         </section>
                     );
                     case 'eventsAndQuests': return (
                          <section key={sectionId}> <h2 className="text-xl font-semibold mb-4">이벤트 & 퀘스트</h2> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {events.length > 0 && renderContentCard(events[0])} {quests.length > 0 && renderQuestCard(quests[0])} </div> </section>
                     );

                     case 'reviews': return (
                          <section key={sectionId}> <h2 className="text-xl font-semibold mb-4">방문자 리뷰</h2> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {reviews.slice(0, mallConfig.customizations.contentDisplayCount?.reviews ?? 3).map(renderReviewCard)} </div> <div className="text-center mt-6"><Button variant="outline" size="sm">모든 리뷰 보기</Button></div> </section>
                     );
                     
                 }
             })}
           </div>
      </main>

      {/* Modals */}
      {renderQRModal()}
      {selectedContent && renderContentDetailModal()}
      {showAddContentModal && renderAddContentModal()}
      {showCustomizeModal && renderCustomizeModal()}

      {/* Footer */}
      <footer className="bg-primary-300 text-white mt-16 py-8 text-sm">
         <div className="container mx-auto px-4">
             {/* Footer content (same as previous MyMall refactoring) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div><h4 className="font-semibold mb-2">{mallConfig.title}</h4><p className="text-xs opacity-80">{mallConfig.description}</p></div>
                 <div><h4 className="font-semibold mb-2">빠른 링크</h4><ul className="space-y-1 text-xs opacity-80"><li><a href="#" className="hover:underline">소개</a></li><li><a href="#" className="hover:underline">콘텐츠</a></li><li><a href="#" className="hover:underline">커뮤니티</a></li></ul></div>
                 <div><h4 className="font-semibold mb-2">피어몰 정보</h4><ul className="space-y-1 text-xs opacity-80"><li><a href="#" className="hover:underline">피어몰 소개</a></li><li><a href="#" className="hover:underline">이용약관</a></li><li><a href="#" className="hover:underline">개인정보처리방침</a></li></ul></div>
             </div>
             <div className="border-t border-white/20 pt-6 text-center text-xs opacity-70">
                 © {new Date().getFullYear()} Peermall. Peer #{mallConfig.peerNumber}.
             </div>
         </div>
      </footer>
    </div>
  );
};

export default PeerSpace; // Exporting as PeerSpace

// import React, { useState, useEffect } from 'react';
// import { Content } from '@/components/peer-space/types';
// import PeerSpaceTopBar from '@/components/peer-space/PeerSpaceTopBar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { toast } from '@/components/ui/use-toast';
// import { 
//   Phone, MessageSquare, QrCode, Star, ArrowRight, User, Clock, Calendar, 
//   Share2, ExternalLink, Plus, MapPin, Settings, Smartphone, Mail, Edit, 
//   Heart, BookmarkPlus, ShoppingBag, FileText, Link
// } from 'lucide-react';

// // Mock data for the Peer Space
// const peerSpaceData = {
//   id: 'myspace123',
//   title: '나의 피어 스페이스',
//   description: '나만의 특별한 공간에 오신 것을 환영합니다!',
//   owner: '김피어',
//   peerNumber: 'P-12345-6789',
//   profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser',
//   badges: ['인증완료', '골드회원', '디자인전문가'],
//   followers: 128,
//   recommendations: 45,
//   socialLinks: {
//     facebook: 'https://facebook.com',
//     twitter: 'https://twitter.com',
//     instagram: 'https://instagram.com'
//   },
//   contactPhone: '02-123-4567',
//   contactEmail: 'contact@peermall.com',
//   address: '서울시 강남구 테헤란로 123'
// };

// // Featured content for the Peer Space
// const featuredContent: Content[] = [
//   {
//     id: 'content1',
//     title: '디자인 포트폴리오',
//     description: '최근 작업한 브랜딩 디자인 모음입니다.',
//     imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80',
//     type: 'portfolio',
//     date: '2일 전',
//     likes: 24,
//     isExternal: false
//   },
//   {
//     id: 'content2',
//     title: '인테리어 컨설팅',
//     description: '공간의 변화를 위한 컨설팅 서비스를 제공합니다.',
//     imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
//     type: 'service',
//     price: '150,000원~',
//     date: '', // Adding date field to fix the type error
//     likes: 15,
//     isExternal: true,
//     source: 'interiorpro.kr'
//   },
//   {
//     id: 'content3',
//     title: '디자인 워크샵',
//     description: '함께 배우는 브랜드 디자인 워크샵을 진행합니다.',
//     imageUrl: 'https://images.unsplash.com/photo-1675466583534-1755fbb2797b?auto=format&fit=crop&q=80',
//     type: 'event',
//     date: '2025년 5월 15일',
//     price: '50,000원',
//     likes: 32,
//     isExternal: false
//   },
//   {
//     id: 'content4',
//     title: '로고 디자인 패키지',
//     description: '브랜드 아이덴티티를 완성할 로고 디자인 패키지입니다.',
//     imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcdce9def54?auto=format&fit=crop&q=80',
//     type: 'product',
//     price: '300,000원',
//     date: '', // Adding date field to fix the type error
//     likes: 18,
//     isExternal: true,
//     source: 'designmarket.com'
//   }
// ];

// // Reviews for the Peer Space
// const reviews = [
//   {
//     id: 'review1',
//     author: '이지은',
//     authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jieun',
//     content: '디자인 컨설팅을 받았는데 정말 만족스러웠어요. 제가 원하던 브랜드 이미지를 정확하게 이해하고 멋진 로고를 만들어주셨습니다!',
//     rating: 5,
//     date: '2025-04-10',
//     source: 'internal',
//     peerMall: {
//       id: 'mall123',
//       name: '이지은의 공방',
//       address: '서울시 마포구 홍대입구역 근처'
//     }
//   },
//   {
//     id: 'review2',
//     author: '박민석',
//     authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Minseok',
//     content: '워크샵에 참여했는데 생각보다 많은 것을 배울 수 있어서 좋았습니다. 기본적인 디자인 개념부터 실전 팁까지 알차게 구성되어 있어요.',
//     rating: 4,
//     date: '2025-04-05',
//     source: 'external',
//     sourceSite: '디자인 커뮤니티',
//     peerMall: {
//       id: 'mall456',
//       name: '박민석 스튜디오',
//       address: '서울시 성동구 서울숲 인근'
//     }
//   },
//   {
//     id: 'review3',
//     author: '최유진',
//     authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Yujin',
//     content: '로고 디자인을 의뢰했는데, 세 번의 수정 끝에 정말 마음에 드는 결과물을 받았습니다. 특히 피드백을 꼼꼼히 반영해주셔서 감사합니다.',
//     rating: 5,
//     date: '2025-03-28',
//     source: 'external',
//     sourceSite: '로고디자인리뷰',
//     peerMall: {
//       id: 'mall789',
//       name: '유진의 아트샵',
//       address: '서울시 서초구 강남대로 123'
//     }
//   }
// ];

// // Community posts for the Peer Space
// const communityPosts = [
//   {
//     id: 'post1',
//     title: '봄맞이 디자인 트렌드 정보',
//     author: '김피어',
//     date: '2025-04-18',
//     comments: 8,
//     likes: 24
//   },
//   {
//     id: 'post2',
//     title: '로고 디자인 작업 과정 공유',
//     author: '김피어',
//     date: '2025-04-15',
//     comments: 12,
//     likes: 36
//   },
//   {
//     id: 'post3',
//     title: '다음 워크샵 안내 및 사전 준비물',
//     author: '김피어',
//     date: '2025-04-10',
//     comments: 5,
//     likes: 18
//   }
// ];

// // Special services
// const specialServices = [
//   {
//     id: 'service1',
//     title: '포트폴리오',
//     icon: '📁',
//     description: '작업물 갤러리'
//   },
//   {
//     id: 'service2',
//     title: '예약하기',
//     icon: '📅',
//     description: '상담/워크샵 예약'
//   },
//   {
//     id: 'service3',
//     title: '문의하기',
//     icon: '💬',
//     description: '1:1 문의'
//   },
//   {
//     id: 'service4',
//     title: '이벤트',
//     icon: '🎉',
//     description: '진행중인 이벤트'
//   }
// ];

// // Map locations for ecosystem map
// const mapLocations = [
//   {
//     id: 'location1',
//     name: '디자인 스튜디오',
//     address: '서울시 강남구 역삼동 123',
//     lat: 37.501,
//     lng: 127.037,
//     type: 'studio'
//   },
//   {
//     id: 'location2',
//     name: '디자인 워크샵 공간',
//     address: '서울시 마포구 성산동 45',
//     lat: 37.556,
//     lng: 126.910,
//     type: 'workshop'
//   },
//   {
//     id: 'location3',
//     name: '디자인 용품점',
//     address: '서울시 종로구 익선동 12',
//     lat: 37.572,
//     lng: 126.992,
//     type: 'shop'
//   }
// ];

// // Badges and achievements
// const badgesAndAchievements = [
//   { id: 'badge1', name: '디자인 전문가', icon: '🎨', description: '디자인 전문 지식과 경험을 인정받음' },
//   { id: 'badge2', name: '친절한 피어', icon: '😊', description: '높은 고객 만족도를 유지함' },
//   { id: 'badge3', name: '트렌드 세터', icon: '🔥', description: '새로운 트렌드를 선도함' },
//   { id: 'badge4', name: '커뮤니티 활동가', icon: '👥', description: '활발한 커뮤니티 참여' }
// ];

// // Family and Guild data
// const familyGuildData = [
//   { id: 'family1', name: '디자인 패밀리', type: 'family', members: 12, imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=design' },
//   { id: 'guild1', name: '브랜딩 마스터즈', type: 'guild', members: 38, imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=branding' }
// ];

// // Reference links for content
// const referenceLinks = [
//   { id: 'ref1', title: '디자인 가이드라인', url: 'https://example.com/guidelines', type: 'document' },
//   { id: 'ref2', title: '브랜드 아이덴티티 기본 요소', url: 'https://example.com/identity', type: 'resource' },
//   { id: 'ref3', title: '컬러 팔레트 선택 방법', url: 'https://example.com/colors', type: 'article' },
//   { id: 'ref4', title: '타이포그래피 기초', url: 'https://example.com/typography', type: 'tutorial' }
// ];

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   location: string;
//   description: string;
//   imageUrl: string;
//   participants: number;
//   maxParticipants: number;
// }

// interface Quest {
//   id: string;
//   title: string;
//   deadline: string;
//   description: string;
//   reward: string;
//   participants: number;
// }

// // Event data
// const events: Event[] = [
//   { 
//     id: 'event1', 
//     title: '디자인 워크샵', 
//     date: '2025년 5월 15일',
//     location: '서울시 강남구 역삼동 디자인 스튜디오',
//     description: '기초부터 배우는 브랜드 디자인 워크샵',
//     imageUrl: 'https://images.unsplash.com/photo-1675466583534-1755fbb2797b?auto=format&fit=crop&q=80',
//     participants: 8,
//     maxParticipants: 12
//   }
// ];

// // Quest data
// const quests: Quest[] = [
//   { 
//     id: 'quest1', 
//     title: '브랜드 아이덴티티 챌린지', 
//     deadline: '2025년 5월 30일',
//     description: '자신만의 브랜드 로고와 색상 팔레트를 개발하는 챌린지',
//     reward: '디자이너 칭호 + 500포인트',
//     participants: 24
//   }
// ];

// // Content types for adding new content
// const contentTypes = [
//   { id: 'type1', name: '상품', description: '판매할 제품 등록' },
//   { id: 'type2', name: '포트폴리오', description: '작업물 전시' },
//   { id: 'type3', name: '서비스', description: '제공할 서비스 등록' },
//   { id: 'type4', name: '게시글', description: '커뮤니티에 글 작성' },
//   { id: 'type5', name: '외부 링크', description: '외부 콘텐츠 연결' }
// ];

// const PeerSpace = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isOwner, setIsOwner] = useState(false);
//   const [activeTab, setActiveTab] = useState('featured');

//   // For QR code feature
//   const [showQRModal, setShowQRModal] = useState(false);
//   const [qrUrl, setQrUrl] = useState(`https://peermall.com/peer-space/${peerSpaceData.id}`);
  
//   // For content detail modal
//   const [selectedContent, setSelectedContent] = useState<Content | null>(null);
//   const [showContentDetailModal, setShowContentDetailModal] = useState(false);
  
//   // For adding new content
//   const [showAddContentModal, setShowAddContentModal] = useState(false);
//   const [newContentType, setNewContentType] = useState('');
  
//   // For following feature
//   const [isFollowing, setIsFollowing] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in using localStorage
//     const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
//     setIsLoggedIn(userLoggedIn);
    
//     // For demo purposes, if logged in, user is the owner
//     setIsOwner(userLoggedIn);
    
//     // Redirect to login if not logged in
//     if (!userLoggedIn) {
//       navigate('/login', { state: { from: location.pathname } });
//     }
//   }, [navigate, location]);

//   if (!isLoggedIn) {
//     return null; // Will redirect in useEffect
//   }

//   const handleContactClick = (type: string, reviewId?: string) => {
//     if (type === 'call') {
//       toast({
//         title: '전화 연결 중',
//         description: '피어에게 전화를 연결하고 있습니다...',
//       });
//     } else if (type === 'message') {
//       toast({
//         title: '메시지 작성',
//         description: '새 메시지 작성 화면으로 이동합니다.',
//       });
//     } else if (type === 'visit' && reviewId) {
//       const review = reviews.find(r => r.id === reviewId);
//       if (review) {
//         toast({
//           title: '방문하기',
//           description: `${review.peerMall.name}의 피어몰로 이동합니다.`,
//         });
//       }
//     }
//   };

//   const handleQRGenerate = () => {
//     setShowQRModal(true);
//   };

//   const handleFollow = () => {
//     setIsFollowing(!isFollowing);
//     toast({
//       title: isFollowing ? '팔로우 취소' : '팔로우 완료',
//       description: isFollowing ? 
//         '더 이상 이 피어를 팔로우하지 않습니다.' : 
//         '이제 이 피어의 새로운 소식을 받아보실 수 있습니다.',
//     });
//   };

//   const handleContentClick = (content: Content) => {
//     setSelectedContent(content);
//     setShowContentDetailModal(true);
//   };

//   const handleAddContent = () => {
//     setShowAddContentModal(true);
//   };

//   const handleContentSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: '콘텐츠 추가 완료',
//       description: '새로운 콘텐츠가 추가되었습니다.',
//     });
//     setShowAddContentModal(false);
//   };

//   const handleExternalLinkSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: '외부 링크 추가 완료',
//       description: '외부 링크가 성공적으로 가져와졌습니다.',
//     });
//     setShowAddContentModal(false);
//   };

//   const renderContentDetailModal = () => {
//     if (!selectedContent) return null;
    
//     return (
//       <Dialog open={showContentDetailModal} onOpenChange={setShowContentDetailModal}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">{selectedContent.title}</DialogTitle>
//           </DialogHeader>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//             <div className="md:col-span-2">
//               <div className="aspect-video rounded-lg overflow-hidden mb-4">
//                 <img 
//                   src={selectedContent.imageUrl} 
//                   alt={selectedContent.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">설명</h3>
//                   <p className="text-text-200">{selectedContent.description}</p>
//                 </div>
                
//                 {selectedContent.price && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2">가격</h3>
//                     <p className="text-xl font-bold text-primary-300">{selectedContent.price}</p>
//                   </div>
//                 )}
                
//                 {selectedContent.date && selectedContent.date !== '' && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2">날짜</h3>
//                     <p className="flex items-center">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       {selectedContent.date}
//                     </p>
//                   </div>
//                 )}
                
//                 <div className="flex space-x-4 pt-4">
//                   <Button variant="outline" className="flex items-center">
//                     <Heart className="h-4 w-4 mr-2" />
//                     좋아요 {selectedContent.likes}
//                   </Button>
//                   <Button variant="outline" className="flex items-center">
//                     <BookmarkPlus className="h-4 w-4 mr-2" />
//                     저장하기
//                   </Button>
//                   {selectedContent.type === 'product' && (
//                     <Button className="bg-primary-300 flex items-center">
//                       <ShoppingBag className="h-4 w-4 mr-2" />
//                       구매하기
//                     </Button>
//                   )}
//                   {selectedContent.type === 'service' && (
//                     <Button className="bg-primary-300 flex items-center">
//                       <MessageSquare className="h-4 w-4 mr-2" />
//                       문의하기
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-base">콘텐츠 정보</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-text-200">작성자</span>
//                     <span className="font-medium">{peerSpaceData.owner}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-text-200">유형</span>
//                     <Badge>{selectedContent.type}</Badge>
//                   </div>
//                   {selectedContent.isExternal && (
//                     <div className="flex justify-between">
//                       <span className="text-text-200">출처</span>
//                       <a 
//                         href={`https://${selectedContent.source}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-accent-100 hover:underline flex items-center"
//                       >
//                         {selectedContent.source}
//                         <ExternalLink className="h-3 w-3 ml-1" />
//                       </a>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-base">연관 링크</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   {referenceLinks.slice(0, 3).map(link => (
//                     <div key={link.id} className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <FileText className="h-4 w-4 mr-2 text-text-200" />
//                         <span>{link.title}</span>
//                       </div>
//                       <a 
//                         href={link.url}
//                         target="_blank"
//                         rel="noreferrer" 
//                         className="text-accent-100 hover:underline"
//                       >
//                         <ExternalLink className="h-4 w-4" />
//                       </a>
//                     </div>
//                   ))}
//                 </CardContent>
//                 <CardFooter className="border-t pt-3">
//                   <Button variant="ghost" size="sm" className="w-full text-accent-100">
//                     모든 관련 링크 보기
//                   </Button>
//                 </CardFooter>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-base">리뷰</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   {reviews.slice(0, 2).map(review => (
//                     <div key={review.id} className="pb-3 border-b last:border-0 last:pb-0">
//                       <div className="flex items-center">
//                         <Avatar className="h-6 w-6 mr-2">
//                           <AvatarImage src={review.authorImage} />
//                           <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
//                         </Avatar>
//                         <span className="font-medium text-sm">{review.author}</span>
//                         <div className="flex ml-auto">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star 
//                               key={i} 
//                               className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
//                               fill={i < review.rating ? 'currentColor' : 'none'}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                       <p className="text-xs mt-1 text-text-200 line-clamp-2">{review.content}</p>
//                     </div>
//                   ))}
//                 </CardContent>
//                 <CardFooter className="border-t pt-3">
//                   <Button variant="ghost" size="sm" className="w-full text-accent-100">
//                     모든 리뷰 보기 ({reviews.length})
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   const renderAddContentModal = () => {
//     return (
//       <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">새 콘텐츠 추가</DialogTitle>
//           </DialogHeader>
          
//           {!newContentType ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//               {contentTypes.map(type => (
//                 <Card 
//                   key={type.id} 
//                   className="cursor-pointer hover:border-primary-300 transition-colors"
//                   onClick={() => setNewContentType(type.name)}
//                 >
//                   <CardContent className="p-6 text-center">
//                     <h3 className="font-bold mb-2">{type.name}</h3>
//                     <p className="text-sm text-text-200">{type.description}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : newContentType === '외부 링크' ? (
//             <form onSubmit={handleExternalLinkSubmit} className="space-y-4 mt-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">외부 링크 URL</label>
//                 <Input placeholder="https://example.com/your-content" required />
//                 <p className="text-xs text-text-200 mt-1">
//                   외부 콘텐츠(상품, 글, 이미지 등)의 URL을 입력하세요. 
//                   피어몰이 자동으로 정보를 가져옵니다.
//                 </p>
//               </div>
              
//               <div className="border rounded-md p-4 bg-bg-100">
//                 <h3 className="font-medium mb-2">미리보기</h3>
//                 <div className="flex items-center space-x-3">
//                   <div className="h-16 w-16 bg-bg-200 rounded flex items-center justify-center text-text-300">
//                     이미지
//                   </div>
//                   <div>
//                     <p className="font-medium">가져온 콘텐츠 제목</p>
//                     <p className="text-sm text-text-200">가져온 설명 내용의 일부...</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">메모 (선택사항)</label>
//                 <Textarea placeholder="이 콘텐츠에 대한 메모를 남겨보세요." />
//               </div>
              
//               <div className="flex justify-end space-x-2 pt-2">
//                 <Button type="button" variant="outline" onClick={() => setNewContentType('')}>
//                   뒤로
//                 </Button>
//                 <Button type="submit">외부 링크 가져오기</Button>
//               </div>
//             </form>
//           ) : (
//             <form onSubmit={handleContentSubmit} className="space-y-4 mt-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">제목</label>
//                 <Input placeholder={`${newContentType} 제목`} required />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">설명</label>
//                 <Textarea placeholder={`${newContentType}에 대한 설명을 입력하세요.`} required />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">대표 이미지</label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
//                   <div className="flex flex-col items-center">
//                     <Plus className="h-8 w-8 text-text-200 mb-2" />
//                     <p className="text-sm text-text-200">클릭하여 이미지 업로드</p>
//                     <p className="text-xs text-text-300 mt-1">또는 파일을 여기에 끌어다 놓으세요</p>
//                   </div>
//                 </div>
//               </div>
              
//               {(newContentType === '상품' || newContentType === '서비스') && (
//                 <div>
//                   <label className="block text-sm font-medium mb-1">가격</label>
//                   <div className="relative">
//                     <Input placeholder="가격을 입력하세요" required />
//                     <span className="absolute right-3 top-2 text-text-200">원</span>
//                   </div>
//                 </div>
//               )}
              
//               {newContentType === '이벤트' && (
//                 <div>
//                   <label className="block text-sm font-medium mb-1">날짜 및 시간</label>
//                   <Input type="datetime-local" required />
//                 </div>
//               )}
              
//               <div className="flex justify-end space-x-2 pt-2">
//                 <Button type="button" variant="outline" onClick={() => setNewContentType('')}>
//                   뒤로
//                 </Button>
//                 <Button type="submit">{newContentType} 등록하기</Button>
//               </div>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-bg-100">
//       <PeerSpaceTopBar
//         data={peerSpaceData}
//         isOwner={isOwner}
//         isFollowing={isFollowing}
//         onFollow={handleFollow}
//         onMessage={() => handleContactClick('message')}
//         onQRGenerate={handleQRGenerate}
//         onSettings={() => navigate('/peer-space/settings')}
//       />
      
//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Tabs Navigation */}
//         <Tabs defaultValue="featured" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="w-full justify-start overflow-x-auto">
//             <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
//             <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
//             <TabsTrigger value="services">서비스</TabsTrigger>
//             <TabsTrigger value="community">커뮤니티</TabsTrigger>
//             <TabsTrigger value="reviews">리뷰</TabsTrigger>
//             <TabsTrigger value="map">지도</TabsTrigger>
//             <TabsTrigger value="events">이벤트</TabsTrigger>
//             {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
//           </TabsList>
          
//           {/* Featured Content Tab */}
//           <TabsContent value="featured" className="space-y-10">
//             {/* Featured Content Section */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">추천 콘텐츠</h2>
//                 {isOwner && (
//                   <Button variant="outline" size="sm" className="flex items-center" onClick={handleAddContent}>
//                     <Plus className="mr-1 h-4 w-4" /> 콘텐츠 추가
//                   </Button>
//                 )}
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {featuredContent.map((content) => (
//                   <Card 
//                     key={content.id} 
//                     className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
//                     onClick={() => handleContentClick(content)}
//                   >
//                     <div className="aspect-video relative overflow-hidden">
//                       <img 
//                         src={content.imageUrl} 
//                         alt={content.title}
//                         className="w-full h-full object-cover transition-transform hover:scale-105"
//                       />
//                       {content.type === 'event' && (
//                         <Badge className="absolute top-2 right-2 bg-accent-100">이벤트</Badge>
//                       )}
//                       {content.type === 'product' && (
//                         <Badge className="absolute top-2 right-2 bg-primary-200">상품</Badge>
//                       )}
//                       {content.type === 'service' && (
//                         <Badge className="absolute top-2 right-2 bg-secondary">서비스</Badge>
//                       )}
//                       {content.isExternal && (
//                         <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
//                           <ExternalLink className="h-3 w-3 mr-1" />
//                           외부 콘텐츠
//                         </div>
//                       )}
//                     </div>
//                     <CardContent className="p-4">
//                       <h3 className="font-bold mb-1">{content.title}</h3>
//                       <p className="text-sm text-text-200 mb-3">{content.description}</p>
//                       <div className="flex justify-between items-center">
//                         <div>
//                           {content.price && (
//                             <p className="font-semibold text-primary-300">{content.price}</p>
//                           )}
//                           {content.date && content.date !== '' && !content.price && (
//                             <p className="text-sm text-text-200">{content.date}</p>
//                           )}
//                           {content.isExternal && (
//                             <p className="text-xs text-gray-500">출처: {content.source}</p>
//                           )}
//                         </div>
//                         <div className="text-sm text-text-200 flex items-center">
//                           <Star className="h-3 w-3 text-yellow-400 mr-1" />
//                           {content.likes}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//               {featuredContent.length > 4 && (
//                 <div className="flex justify-center mt-8">
//                   <Button variant="outline" className="flex items-center">
//                     더보기 <ArrowRight className="ml-1 h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </section>
            
//             {/* Community Posts Section */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">커뮤니티 게시글</h2>
//                 <Button variant="ghost" size="sm" className="flex items-center text-accent-200" onClick={() => setActiveTab('community')}>
//                   더보기 <ArrowRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </div>
              
//               <div className="bg-white rounded-lg shadow overflow-hidden">
//                 {communityPosts.map((post, index) => (
//                   <div key={post.id} className={`p-4 flex justify-between items-center ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
//                     <div>
//                       <h3 className="font-medium mb-1">{post.title}</h3>
//                       <div className="text-xs text-text-200 flex items-center">
//                         <span>{post.author}</span>
//                         <span className="mx-2">•</span>
//                         <span>{post.date}</span>
//                         <span className="mx-2">•</span>
//                         <span>댓글 {post.comments}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center text-sm">
//                       <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                       {post.likes}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {isOwner && (
//                 <div className="flex justify-end mt-4">
//                   <Button variant="outline" size="sm" className="flex items-center">
//                     <Plus className="mr-1 h-4 w-4" /> 새 게시글 작성
//                   </Button>
//                 </div>
//               )}
//             </section>
            
//             {/* Reviews Section */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">최신 리뷰</h2>
//                 <Button variant="ghost" size="sm" className="flex items-center text-accent-200" onClick={() => setActiveTab('reviews')}>
//                   더보기 <ArrowRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {reviews.slice(0, 3).map((review) => (
//                   <Card key={review.id} className="overflow-hidden">
//                     <CardContent className="p-6">
//                       <div className="flex items-center mb-4">
//                         <Avatar className="h-10 w-10 mr-3">
//                           <AvatarImage src={review.authorImage} alt={review.author} />
//                           <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{review.author}</p>
//                           <div className="flex items-center">
//                             {Array.from({ length: 5 }).map((_, i) => (
//                               <Star 
//                                 key={i} 
//                                 className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
//                                 fill={i < review.rating ? 'currentColor' : 'none'}
//                               />
//                             ))}
//                             <span className="text-xs text-text-200 ml-1">
//                               {new Date(review.date).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                         {review.source === 'external' && (
//                           <Badge className="ml-auto bg-accent-100/20 text-accent-100 text-xs">
//                             {review.sourceSite}
//                           </Badge>
//                         )}
//                       </div>
                      
//                       <p className="text-sm text-text-200 mb-4">{review.content}</p>
                      
//                       <div className="flex justify-between items-center">
//                         <div className="text-xs text-text-300">
//                           from {review.peerMall.name}
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button 
//                             variant="outline" 
//                             size="sm" 
//                             className="h-8 px-2 rounded-full"
//                             onClick={() => handleContactClick('call', review.id)}
//                           >
//                             <Phone className="h-3 w-3" />
//                           </Button>
//                           <Button 
//                             variant="outline" 
//                             size="sm" 
//                             className="h-8 px-2 rounded-full"
//                             onClick={() => handleContactClick('message', review.id)}
//                           >
//                             <MessageSquare className="h-3 w-3" />
//                           </Button>
//                           <Button 
//                             variant="outline" 
//                             size="sm" 
//                             className="h-8 px-3 rounded-full"
//                             onClick={() => handleContactClick('visit', review.id)}
//                           >
//                             방문하기
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>
            
//             {/* Special Services Section */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">특별 서비스</h2>
//               </div>
              
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 {specialServices.map((service) => (
//                   <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer">
//                     <CardContent className="p-6 flex flex-col items-center text-center">
//                       <div className="text-4xl mb-3">{service.icon}</div>
//                       <h3 className="font-bold mb-1">{service.title}</h3>
//                       <p className="text-sm text-text-200">{service.description}</p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>
            
//             {/* Badges & Achievements */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">나의 칭호 & 뱃지</h2>
//               </div>
              
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 {badgesAndAchievements.map((badge) => (
//                   <Card key={badge.id} className="hover:shadow-md transition-shadow cursor-pointer">
//                     <CardContent className="p-6 flex flex-col items-center text-center">
//                       <div className="text-4xl mb-3">{badge.icon}</div>
//                       <h3 className="font-bold mb-1">{badge.name}</h3>
//                       <p className="text-sm text-text-200">{badge.description}</p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>
            
//             {/* Family/Guild Section */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">패밀리 & 길드</h2>
//               </div>
              
//               <div className="flex flex-wrap gap-4">
//                 {familyGuildData.map((group) => (
//                   <Card key={group.id} className="flex items-center p-4 max-w-xs hover:shadow-md transition-shadow cursor-pointer">
//                     <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-white overflow-hidden">
//                       <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
//                     </div>
//                     <div className="ml-4">
//                       <h3 className="font-bold">{group.name}</h3>
//                       <p className="text-sm text-text-200">{group.members}명의 멤버</p>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </section>
            
//             {/* Reference Links Section */}
//             <section>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-300">참고 자료 & 링크</h2>
//                 {isOwner && (
//                   <Button variant="outline" size="sm" className="flex items-center">
//                     <Plus className="mr-1 h-4 w-4" /> 링크 추가
//                   </Button>
//                 )}
//               </div>
              
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {referenceLinks.map(link => (
//                       <div key={link.id} className="flex items-center justify-between border-b pb-3">
//                         <div className="flex items-center">
//                           <FileText className="h-5 w-5 mr-3 text-text-200" />
//                           <div>
//                             <p className="font-medium">{link.title}</p>
//                             <Badge variant="outline" className="mt-1">{link.type}</Badge>
//                           </div>
//                         </div>
//                         <a 
//                           href={link.url}
//                           target="_blank"
//                           rel="noreferrer" 
//                           className="text-accent-100 hover:underline flex items-center"
//                         >
//                           <Link className="h-4 w-4 mr-1" />
//                           링크
//                         </a>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </section>
//           </TabsContent>
          
//           {/* Portfolio Tab */}
//           <TabsContent value="portfolio" className="space-y-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-primary-300">포트폴리오</h2>
//               {isOwner && (
//                 <Button className="bg-accent-200 hover:bg-accent-100" onClick={handleAddContent}>
//                   <Plus className="mr-1 h-4 w-4" /> 새 포트폴리오 추가
//                 </Button>
//               )}
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {featuredContent
//                 .filter(item => item.type === 'portfolio')
//                 .concat([
//                   {
//                     id: 'portfolio1',
//                     title: '브랜드 아이덴티티 디자인',
//                     description: '스타트업 크라우드의 브랜드 디자인 작업입니다.',
//                     imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80',
//                     type: 'portfolio',
//                     date: '1개월 전',
//                     likes: 42,
//                     isExternal: false
//                   },
//                   {
//                     id: 'portfolio2',
//                     title: '웹사이트 UI/UX 디자인',
//                     description: '건강식품 브랜드의 온라인 쇼핑몰 디자인 리뉴얼 작업입니다.',
//                     imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80',
//                     type: 'portfolio',
//                     date: '2개월 전',
//                     likes: 38,
//                     isExternal: false
//                   },
//                   {
//                     id: 'portfolio3',
//                     title: '패키지 디자인 프로젝트',
//                     description: '유기농 차 브랜드의 패키지 디자인 시리즈입니다.',
//                     imageUrl: 'https://images.unsplash.com/photo-1531256456869-ce942a665e80?auto=format&fit=crop&q=80',
//                     type: 'portfolio',
//                     date: '3개월 전',
//                     likes: 29,
//                     isExternal: false
//                   }
//                 ])
//                 .map((content) => (
//                   <Card 
//                     key={content.id} 
//                     className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//                     onClick={() => handleContentClick(content)}
//                   >
//                     <div className="aspect-video relative overflow-hidden">
//                       <img 
//                         src={content.imageUrl} 
//                         alt={content.title}
//                         className="w-full h-full object-cover transition-transform hover:scale-105"
//                       />
//                       {content.isExternal && (
//                         <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
//                           <ExternalLink className="h-3 w-3 mr-1" />
//                           외부 콘텐츠
//                         </div>
//                       )}
//                     </div>
//                     <CardContent className="p-4">
//                       <h3 className="font-bold mb-1">{content.title}</h3>
//                       <p className="text-sm text-text-200 mb-3">{content.description}</p>
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center text-text-200 text-sm">
//                           <Clock className="h-3 w-3 mr-1" />
//                           {content.date}
//                         </div>
//                         <div className="text-sm text-text-200 flex items-center">
//                           <Star className="h-3 w-3 text-yellow-400 mr-1" />
//                           {content.likes}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//             </div>
//           </TabsContent>
          
//           {/* Services Tab */}
//           <TabsContent value="services" className="space-y-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-primary-300">서비스</h2>
//               {isOwner && (
//                 <Button className="bg-accent-200 hover:bg-accent-100" onClick={handleAddContent}>
//                   <Plus className="mr-1 h-4 w-4" /> 새 서비스 추가
//                 </Button>
//               )}
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {featuredContent
//                 .filter(item => item.type === 'service')
//                 .concat([
//                   {
//                     id: 'service1',
//                     title: '브랜드 아이덴티티 디자인',
//                     description: '브랜드의 핵심 가치와 비전을 시각적으로 표현하는 디자인 서비스를 제공합니다.',
//                     imageUrl: 'https://images.unsplash.com/photo-1583320775717-4e0a55a89fd2?auto=format&fit=crop&q=80',
//                     type: 'service',
//                     price: '500,000원~',
//                     date: '', // Adding empty date to fix the type error
//                     likes: 15,
//                     isExternal: false
//                   },
//                   {
//                     id: 'service2',
//                     title: 'UI/UX 컨설팅',
//                     description: '사용자 경험을 향상시키는 웹사이트 및 앱 디자인 컨설팅을 제공합니다.',
//                     imageUrl: 'https://images.unsplash.com/photo-1569017388730-020b5f80a004?auto=format&fit=crop&q=80',
//                     type: 'service',
//                     price: '300,000원~',
//                     date: '', // Adding empty date to fix the type error
//                     likes: 24,
//                     isExternal: false
//                   },
//                   {
//                     id: 'service3',
//                     title: '마케팅 디자인 패키지',
//                     description: '소셜 미디어, 웹 배너, 이메일 마케팅을 위한 디자인 패키지입니다.',
//                     imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80',
//                     type: 'service',
//                     price: '250,000원~',
//                     date: '', // Adding empty date to fix the type error
//                     likes: 19,
//                     isExternal: false
//                   }
//                 ])
//                 .map((content) => (
//                   <Card 
//                     key={content.id} 
//                     className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//                     onClick={() => handleContentClick(content)}
//                   >
//                     <div className="aspect-video relative overflow-hidden">
//                       <img 
//                         src={content.imageUrl} 
//                         alt={content.title}
//                         className="w-full h-full object-cover transition-transform hover:scale-105"
//                       />
//                       <Badge className="absolute top-2 right-2 bg-secondary">서비스</Badge>
//                       {content.isExternal && (
//                         <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
//                           <ExternalLink className="h-3 w-3 mr-1" />
//                           외부 콘텐츠
//                         </div>
//                       )}
//                     </div>
//                     <CardContent className="p-4">
//                       <h3 className="font-bold mb-1">{content.title}</h3>
//                       <p className="text-sm text-text-200 mb-3">{content.description}</p>
//                       <div className="flex justify-between items-center">
//                         <p className="font-semibold text-primary-300">{content.price}</p>
//                         <Button variant="outline" size="sm">문의하기</Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//             </div>
//           </TabsContent>
          
//           {/* Community Tab */}
//           <TabsContent value="community" className="space-y-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-primary-300">커뮤니티</h2>
//               {isOwner && (
//                 <Button className="bg-accent-200 hover:bg-accent-100">
//                   <Plus className="mr-1 h-4 w-4" /> 새 게시글 작성
//                 </Button>
//               )}
//             </div>
            
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               {communityPosts.concat([
//                 {
//                   id: 'post4',
//                   title: '디자인 초보를 위한 색상 이론 가이드',
//                   author: '김피어',
//                   date: '2025-04-05',
//                   comments: 15,
//                   likes: 42
//                 },
//                 {
//                   id: 'post5',
//                   title: '로고 디자인 공모전 참가자 모집',
//                   author: '김피어',
//                   date: '2025-03-30',
//                   comments: 7,
//                   likes: 28
//                 }
//               ]).map((post, index) => (
//                 <div key={post.id} className={`p-4 flex justify-between items-center ${index !== 0 ? 'border-t border-gray-100' : ''} hover:bg-bg-100 cursor-pointer`}>
//                   <div>
//                     <h3 className="font-medium mb-1">{post.title}</h3>
//                     <div className="text-xs text-text-200 flex items-center">
//                       <span>{post.author}</span>
//                       <span className="mx-2">•</span>
//                       <span>{post.date}</span>
//                       <span className="mx-2">•</span>
//                       <span>댓글 {post.comments}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center text-sm">
//                     <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                     {post.likes}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Live Chat Section */}
//             <section className="mt-10">
//               <h3 className="text-xl font-bold text-primary-300 mb-4">실시간 채팅</h3>
//               <div className="bg-white rounded-lg shadow p-4 max-h-80 overflow-y-auto">
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <Avatar className="h-8 w-8 mr-2">
//                       <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=Visitor1" />
//                       <AvatarFallback>V1</AvatarFallback>
//                     </Avatar>
//                     <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
//                       <p className="text-sm font-medium">방문자1</p>
//                       <p className="text-sm">안녕하세요! 디자인 워크샵 참여 가능한가요?</p>
//                       <p className="text-xs text-gray-500 mt-1">10:23</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start justify-end">
//                     <div className="bg-primary-100 rounded-lg p-3 max-w-[80%]">
//                       <p className="text-sm font-medium">김피어</p>
//                       <p className="text-sm">네! 5월 워크샵에 아직 자리 있어요. 문의주세요!</p>
//                       <p className="text-xs text-gray-500 mt-1">10:25</p>
//                     </div>
//                     <Avatar className="h-8 w-8 ml-2">
//                       <AvatarImage src={peerSpaceData.profileImage} />
//                       <AvatarFallback>KP</AvatarFallback>
//                     </Avatar>
//                   </div>
//                   <div className="flex items-start">
//                     <Avatar className="h-8 w-8 mr-2">
//                       <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=Visitor2" />
//                       <AvatarFallback>V2</AvatarFallback>
//                     </Avatar>
//                     <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
//                       <p className="text-sm font-medium">방문자2</p>
//                       <p className="text-sm">로고 디자인 견적 문의드립니다.</p>
//                       <p className="text-xs text-gray-500 mt-1">11:05</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 flex">
//                 <Input 
//                   type="text" 
//                   className="flex-1 rounded-r-none"
//                   placeholder="메시지 입력..." 
//                 />
//                 <Button className="rounded-l-none">전송</Button>
//               </div>
//             </section>
//           </TabsContent>
          
//           {/* Reviews Tab */}
//           <TabsContent value="reviews" className="space-y-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-primary-300">리뷰</h2>
//               {isOwner && (
//                 <Button variant="outline">
//                   <Plus className="mr-1 h-4 w-4" /> 외부 리뷰 가져오기
//                 </Button>
//               )}
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {reviews.concat([
//                 {
//                   id: 'review4',
//                   author: '김민준',
//                   authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Minjun',
//                   content: '명함 디자인을 의뢰했는데 만족스러운 결과물을 받았습니다. 특히 여러 가지 옵션을 제공해주셔서 선택의 폭이 넓었어요.',
//                   rating: 5,
//                   date: '2025-03-15',
//                   source: 'internal',
//                   peerMall: {
//                     id: 'mall123',
//                     name: '민준 회사',
//                     address: '서울시 마포구'
//                   }
//                 },
//                 {
//                   id: 'review5',
//                   author: '정소연',
//                   authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Soyeon',
//                   content: '브랜드 디자인 패키지를 구매했습니다. 처음부터 끝까지 소통이 원활했고 결과물도 만족스러워요. 다른 프로젝트에서도 꼭 함께 작업하고 싶습니다.',
//                   rating: 4,
//                   date: '2025-03-10',
//                   source: 'external',
//                   sourceSite: '디자인플랫폼',
//                   peerMall: {
//                     id: 'mall456',
//                     name: '소연 카페',
//                     address: '서울시 종로구'
//                   }
//                 }
//               ]).map((review) => (
//                 <Card key={review.id} className="overflow-hidden">
//                   <CardContent className="p-6">
//                     <div className="flex items-center mb-4">
//                       <Avatar className="h-10 w-10 mr-3">
//                         <AvatarImage src={review.authorImage} alt={review.author} />
//                         <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium">{review.author}</p>
//                         <div className="flex items-center">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star 
//                               key={i} 
//                               className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
//                               fill={i < review.rating ? 'currentColor' : 'none'}
//                             />
//                           ))}
//                           <span className="text-xs text-text-200 ml-1">
//                             {new Date(review.date).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                       {review.source === 'external' && (
//                         <Badge className="ml-auto bg-accent-100/20 text-accent-100 text-xs">
//                           {review.sourceSite}
//                         </Badge>
//                       )}
//                     </div>
                    
//                     <p className="text-sm text-text-200 mb-4">{review.content}</p>
                    
//                     <div className="flex justify-between items-center">
//                       <div className="text-xs text-text-300">
//                         from {review.peerMall.name}
//                       </div>
//                       <div className="flex space-x-2">
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="h-8 px-2 rounded-full"
//                           onClick={() => handleContactClick('call', review.id)}
//                         >
//                           <Phone className="h-3 w-3" />
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="h-8 px-2 rounded-full"
//                           onClick={() => handleContactClick('message', review.id)}
//                         >
//                           <MessageSquare className="h-3 w-3" />
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="h-8 px-3 rounded-full"
//                           onClick={() => handleContactClick('visit', review.id)}
//                         >
//                           방문하기
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
          
//           {/* Map Tab */}
//           <TabsContent value="map" className="space-y-8">
//             <h2 className="text-2xl font-bold text-primary-300 mb-6">생태계 지도</h2>
            
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="aspect-[16/9] bg-gray-200 relative">
//                 {/* This would be replaced with an actual map component */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <p className="text-text-200">지도 컴포넌트가 여기에 표시됩니다</p>
//                 </div>
                
//                 {/* Mock map markers */}
//                 <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-accent-200 rounded-full flex items-center justify-center text-white text-xs cursor-pointer" title="디자인 스튜디오">S</div>
//                 <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center text-white text-xs cursor-pointer" title="디자인 워크샵 공간">W</div>
//                 <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs cursor-pointer" title="디자인 용품점">D</div>
//               </div>
              
//               <div className="p-4">
//                 <h3 className="font-bold mb-4">위치 정보</h3>
//                 <div className="space-y-4">
//                   {mapLocations.map(location => (
//                     <Card key={location.id} className="hover:bg-bg-50 transition-colors cursor-pointer">
//                       <CardContent className="p-4">
//                         <div className="flex items-center">
//                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3
//                             ${location.type === 'studio' ? 'bg-accent-200' : 
//                               location.type === 'workshop' ? 'bg-primary-200' : 'bg-secondary'}`}>
//                             {location.type === 'studio' ? 'S' : 
//                               location.type === 'workshop' ? 'W' : 'D'}
//                           </div>
//                           <div className="flex-1">
//                             <p className="font-medium">{location.name}</p>
//                             <p className="text-sm text-text-200 flex items-center">
//                               <MapPin className="h-3 w-3 mr-1" />
//                               {location.address}
//                             </p>
//                           </div>
//                           <Button variant="ghost" size="sm">
//                             자세히
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             {isOwner && (
//               <div className="flex justify-end mt-4">
//                 <Button variant="outline">
//                   <Plus className="mr-1 h-4 w-4" /> 위치 추가
//                 </Button>
//               </div>
//             )}
//           </TabsContent>
          
//           {/* Events Tab */}
//           <TabsContent value="events" className="space-y-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-primary-300">이벤트 & 퀘스트</h2>
//               {isOwner && (
//                 <Button className="bg-accent-200 hover:bg-accent-100">
//                   <Plus className="mr-1 h-4 w-4" /> 새 이벤트 등록
//                 </Button>
//               )}
//             </div>
            
//             <div className="space-y-6">
//               <h3 className="text-xl font-semibold text-primary-300">진행중인 이벤트</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {events.map((event) => (
//                   <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
//                     <div className="flex flex-col md:flex-row h-full">
//                       <div className="md:w-1/3 h-40 md:h-auto relative">
//                         <img 
//                           src={event.imageUrl} 
//                           alt={event.title}
//                           className="w-full h-full object-cover"
//                         />
//                         <Badge className="absolute top-2 right-2 bg-accent-100">이벤트</Badge>
//                       </div>
//                       <div className="md:w-2/3 p-4">
//                         <h4 className="font-bold text-lg mb-1">{event.title}</h4>
//                         <p className="text-sm text-text-200 mb-3">{event.description}</p>
//                         <div className="space-y-1 text-sm">
//                           <div className="flex items-center">
//                             <Calendar className="h-4 w-4 mr-2 text-text-200" />
//                             <span>{event.date}</span>
//                           </div>
//                           <div className="flex items-center">
//                             <MapPin className="h-4 w-4 mr-2 text-text-200" />
//                             <span>{event.location}</span>
//                           </div>
//                         </div>
//                         <div className="mt-3 flex justify-between items-center">
//                           <span className="text-sm text-text-200">
//                             {event.participants}/{event.maxParticipants} 참여중
//                           </span>
//                           <Button variant="outline" size="sm">참여신청</Button>
//                         </div>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
              
//               <h3 className="text-xl font-semibold text-primary-300 mt-10">진행중인 퀘스트</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {quests.map((quest) => (
//                   <Card key={quest.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
//                     <CardContent className="p-6">
//                       <div className="flex justify-between items-start mb-3">
//                         <h4 className="font-bold text-lg">{quest.title}</h4>
//                         <Badge variant="outline" className="ml-2">{quest.participants}명 참여중</Badge>
//                       </div>
//                       <p className="text-sm text-text-200 mb-4">{quest.description}</p>
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center text-sm">
//                           <Calendar className="h-4 w-4 mr-2 text-text-200" />
//                           <span className="text-text-200">마감: {quest.deadline}</span>
//                         </div>
//                         <Badge className="bg-primary-300">{quest.reward}</Badge>
//                       </div>
//                     </CardContent>
//                     <CardFooter className="border-t px-6 py-3 flex justify-between">
//                       <div className="relative w-full h-2 bg-gray-200 rounded-full">
//                         <div className="absolute left-0 top-0 h-2 bg-accent-100 rounded-full" style={{ width: '45%' }}></div>
//                       </div>
//                       <span className="text-xs text-text-200 ml-3">45% 완료</span>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </TabsContent>
          
//           {/* Analytics Tab (Owner Only) */}
//           {isOwner && (
//             <TabsContent value="analytics" className="space-y-8">
//               <h2 className="text-2xl font-bold text-primary-300 mb-6">분석</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="text-lg font-bold mb-2">방문자</h3>
//                     <div className="text-3xl font-bold text-primary-300">1,234</div>
//                     <p className="text-sm text-text-200">지난주 대비 12% 증가</p>
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="text-lg font-bold mb-2">페이지 뷰</h3>
//                     <div className="text-3xl font-bold text-primary-300">5,678</div>
//                     <p className="text-sm text-text-200">지난주 대비 8% 증가</p>
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="text-lg font-bold mb-2">팔로워</h3>
//                     <div className="text-3xl font-bold text-primary-300">128</div>
//                     <p className="text-sm text-text-200">지난주 대비 5명 증가</p>
//                   </CardContent>
//                 </Card>
//               </div>
              
//               <Card className="mb-8">
//                 <CardContent className="p-6">
//                   <h3 className="text-lg font-bold mb-4">트래픽 통계</h3>
//                   <div className="aspect-[2/1] bg-gray-100 rounded-md flex items-center justify-center">
//                     <p className="text-text-200">트래픽 차트가 여기에 표시됩니다</p>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="text-lg font-bold mb-4">인기 콘텐츠</h3>
//                     <div className="space-y-4">
//                       {featuredContent.slice(0, 3).map((content, index) => (
//                         <div key={content.id} className="flex items-center">
//                           <div className="bg-primary-100 text-primary-300 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3">
//                             {index + 1}
//                           </div>
//                           <div className="flex-1">
//                             <p className="font-medium">{content.title}</p>
//                             <p className="text-sm text-text-200">조회수 {content.likes * 42}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="text-lg font-bold mb-4">유입 경로</h3>
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <p>검색</p>
//                         <div className="w-1/2 bg-gray-200 rounded-full h-2">
//                           <div className="bg-primary-300 h-2 rounded-full" style={{width: '65%'}}></div>
//                         </div>
//                         <p className="text-sm">65%</p>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <p>소셜 미디어</p>
//                         <div className="w-1/2 bg-gray-200 rounded-full h-2">
//                           <div className="bg-primary-300 h-2 rounded-full" style={{width: '20%'}}></div>
//                         </div>
//                         <p className="text-sm">20%</p>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <p>직접 접속</p>
//                         <div className="w-1/2 bg-gray-200 rounded-full h-2">
//                           <div className="bg-primary-300 h-2 rounded-full" style={{width: '15%'}}></div>
//                         </div>
//                         <p className="text-sm">15%</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           )}
//         </Tabs>
//       </main>
      
//      {/* Map Modal - Commented out until proper implementation */}
      {/* {isMapOpen && (
        <PeermallMap 
          isOpen={isMapOpen}
          onClose={handleCloseMap}
          selectedLocation={selectedLocation}
          allLocations={mapLocations}
        />
      )} */}

      {/* QR Code Feature */}
//       {showQRModal && (
//         <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-bold">QR 코드</DialogTitle>
//             </DialogHeader>
//             <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
//               {/* This would be a real QR code component */}
//               <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
//                 QR 코드 이미지
//               </div>
//             </div>
//             <div className="mb-4">
//               <Input 
//                 type="text" 
//                 value={qrUrl}
//                 onChange={(e) => setQrUrl(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setShowQRModal(false)}>
//                 닫기
//               </Button>
//               <Button>
//                 다운로드
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
      
//       {/* Content Detail Modal */}
//       {renderContentDetailModal()}
      
//       {/* Add Content Modal */}
//       {renderAddContentModal()}
      
//       {/* Footer Bar with Peer Number and Actions */}
//       <div className="bg-white border-t py-4">
//         <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
//           <div className="flex items-center mb-4 sm:mb-0">
//             <span className="text-sm text-text-200">Peer #{peerSpaceData.peerNumber}</span>
//             <Button variant="ghost" size="sm" className="ml-2" onClick={handleQRGenerate}>
//               <QrCode className="h-4 w-4" />
//             </Button>
//           </div>
          
//           <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//             <div className="flex items-center">
//               <Mail className="h-4 w-4 text-text-200 mr-1" />
//               <span className="text-sm text-text-200">{peerSpaceData.contactEmail}</span>
//             </div>
//             <div className="flex items-center">
//               <Smartphone className="h-4 w-4 text-text-200 mr-1" />
//               <span className="text-sm text-text-200">{peerSpaceData.contactPhone}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PeerSpace;
