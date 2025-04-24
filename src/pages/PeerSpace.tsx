
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import {
  Plus, Search, Menu, Share2, Link2, Rss, LayoutGrid, ImageIcon, Paintbrush,
  Award, Heart, Flame, Users, Target, ShoppingBag, Edit, HandCoins, MessageCircle, 
  Calendar, ExternalLink, Star, ThumbsUp, Compass, Eye, GripVertical, Palette, Bell, User
} from 'lucide-react';

import { Content, Review, CommunityPost, Event, Quest, BadgeData } from '@/components/peer-space/types';
import EnhancedProfileHeader from '@/components/peer-space/EnhancedProfileHeader';
import DynamicSection from '@/components/peer-space/DynamicSection';
import EnhancedContentCard from '@/components/peer-space/EnhancedContentCard';
import QuestCard from '@/components/peer-space/QuestCard';
import { useContentInteraction } from '@/hooks/useContentInteraction';
import AddExternalContentForm from '@/components/peer-space/AddExternalContentForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


interface MyMallConfig {
  id: string;
  title: string;
  description: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  coverImage?: string;
  badges: string[];
  followers: number;
  recommendations: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  isVerified?: boolean;
  skin: string;
  sections: string[];
  customizations: {
    primaryColor?: string;
    showChat?: boolean;
    allowComments?: boolean;
    showBadges?: boolean;
    contentDisplayCount?: { [sectionId: string]: number };
  };
  socialLinks?: { [key: string]: string };
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  familyGuilds?: { id: string; name: string; imageUrl: string }[];
}

const PeerSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOwner, setIsOwner] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [showContentDetailModal, setShowContentDetailModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  
  const [qrUrl, setQrUrl] = useState('');
  const [selectedContent, setSelectedContent] = useState<Content | Event | Quest | null>(null);
  const [newContentType, setNewContentType] = useState('');
  
  const [mallConfig, setMallConfig] = useState<MyMallConfig>({
    id: 'mymall-creative-hub',
    title: '김피어의 크리에이티브 허브',
    description: '디자인, 영감, 커뮤니티가 만나는 곳. 함께 성장해요!',
    owner: '김피어',
    peerNumber: 'P-12345-6789',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=KimPeer',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1920',
    badges: ['인증완료', '골드회원', '디자인전문가', '커뮤니티 리더', '퀘스트 마스터'],
    followers: 135,
    recommendations: 52,
    level: 6,
    xp: 250,
    xpToNextLevel: 1200,
    isVerified: true,
    skin: 'creator-hub-default',
    sections: ['hero', 'latestContent', 'communitySpotlight', 'eventsAndQuests', 'map', 'reviews'],
    customizations: {
      primaryColor: '#71c4ef',
      showChat: true,
      allowComments: true,
      showBadges: true,
      contentDisplayCount: { latestContent: 4, communitySpotlight: 3, reviews: 3 },
    },
    socialLinks: {},
    contactPhone: '02-123-4567',
    contactEmail: 'contact@peermall.com',
    address: '서울시 강남구 테헤란로 123',
    familyGuilds: [
      { id: 'guild1', name: '브랜딩 마스터즈', imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=branding' }
    ]
  });

  const contentItems: (Content | Event)[] = [
    {
      id: 'content1', title: '디자인 포트폴리오: 모던 브랜딩', description: '최근 작업한 모던하고 세련된 브랜딩 디자인 결과물입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
      type: 'portfolio', date: '2일 전', likes: 24, comments: 5, saves: 12, views: 150, isExternal: false
    },
    {
      id: 'ext-product1', title: '미니멀리스트 데스크 램프', description: '깔끔한 디자인의 LED 데스크 램프, 내 스마트스토어에서 판매 중!',
      imageUrl: 'https://images.unsplash.com/photo-1543508286-a104a6f469d7?auto=format&fit=crop&q=80&w=800',
      type: 'product', price: '45,000원', likes: 35, comments: 7, saves: 20, views: 250,
      isExternal: true, externalUrl: 'https://smartstore.naver.com/kimp/products/123', source: '네이버 스마트스토어', sourceType: 'store'
    },
    {
      id: 'ext-blog1', title: '2025년 디자인 트렌드 분석', description: '올해 주목해야 할 비주얼 트렌드를 내 개인 블로그에 정리했어요.',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
      type: 'post', date: '5일 전', likes: 50, comments: 15, saves: 30, views: 400,
      isExternal: true, externalUrl: 'https://kimp-design.blog/trends-2025', source: '개인 블로그', sourceType: 'blog'
    },
    {
      id: 'ext-review1', title: '최애 카페 방문 후기 (유튜브)', description: '분위기 좋은 카페 리뷰 영상을 유튜브에 올렸어요!',
      imageUrl: 'https://images.unsplash.com/photo-1511920183353-311a5ff489a5?auto=format&fit=crop&q=80&w=800',
      type: 'review', date: '1주 전', likes: 105, comments: 25, saves: 40, views: 1200, rating: 5,
      isExternal: true, externalUrl: 'https://youtube.com/watch?v=abcdefg', source: 'YouTube', sourceType: 'video'
    },
    {
      id: 'content3', title: '디자인 워크샵: 브랜딩 기초', description: '함께 배우는 브랜드 디자인 워크샵! 기초부터 탄탄하게.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
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
      description: '기초부터 배우는 브랜드 디자인 워크샵!', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      participants: 8, maxParticipants: 12, price: '50,000원', likes: 45, comments: 12, saves: 22, views: 350,
      type: 'event'
    }
  ];

  const quests: Quest[] = [
    {
      id: 'quest1', title: '브랜드 아이덴티티 챌린지', deadline: '2025년 5월 30일',
      description: '자신만의 브랜드 로고와 색상 팔레트를 개발하고 공유!', reward: '디자이너 칭호 + 500 XP', participants: 24, goal: 50, type: 'community', progress: 48,
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'quest2', title: '포트폴리오 피드백 교환', deadline: '2025년 5월 20일',
      description: '다른 피어의 포트폴리오에 건설적인 피드백 3개 남기기', reward: '200 XP + 피드백 전문가 뱃지', participants: 15, goal: 3, type: 'individual', progress: 1,
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const badgesAndAchievementsData: BadgeData[] = [
    { id: 'badge1', name: '디자인 전문가', icon: Award, description: '전문성 인증', color: 'text-yellow-500' },
    { id: 'badge2', name: '친절한 피어', icon: Heart, description: '고객 만족 우수', color: 'text-red-500' },
    { id: 'badge3', name: '트렌드 세터', icon: Flame, description: '최신 트렌드 선도', color: 'text-orange-500' },
    { id: 'badge4', name: '커뮤니티 리더', icon: Users, description: '활발한 소통 기여', color: 'text-blue-500' },
    { id: 'badge5', name: '퀘스트 마스터', icon: Target, description: '다수 퀘스트 완료', color: 'text-green-500' },
  ];

  const contentTypes = [
    { id: 'type1', name: '상품', description: '판매할 제품 등록', icon: ShoppingBag },
    { id: 'type2', name: '포트폴리오', description: '작업물 전시', icon: Edit },
    { id: 'type3', name: '서비스', description: '제공할 서비스 등록', icon: HandCoins },
    { id: 'type4', name: '게시글', description: '커뮤니티에 글 작성', icon: MessageCircle },
    { id: 'type5', name: '외부 링크', description: '외부 콘텐츠/리뷰 연결', icon: Link2 },
    { id: 'type6', name: '이벤트', description: '이벤트 생성', icon: Calendar },
  ];

  const { handleInteraction: handleContentInteraction } = useContentInteraction({
    onInteractionComplete: (type, contentId) => {
      console.log(`Content interaction: ${type} - ${contentId}`);
    }
  });

  const handleFollow = () => {
    setIsFollowing(prev => !prev);
    toast({
      title: isFollowing ? '언팔로우 완료' : '팔로우 완료',
      description: isFollowing ? '피어를 언팔로우했습니다.' : '피어를 팔로우했습니다.'
    });
  };

  const handleMessage = () => {
    toast({
      title: '메시지 작성',
      description: '메시지 창이 열렸습니다.'
    });
  };

  const handleQRGenerate = () => {
    setQrUrl(`https://peermall.com/mall/${mallConfig.id}`);
    setShowQRModal(true);
  };

  const handleShare = () => {
    toast({
      title: '공유하기',
      description: '공유 옵션이 표시됩니다.'
    });
  };

  const handleChangeCover = () => {
    toast({
      title: '커버 이미지 변경',
      description: '이미지 업로드 창이 열립니다.'
    });
  };

  const handleContentClick = (content: Content | Event | Quest) => {
    if ('isExternal' in content && content.isExternal && content.externalUrl) {
      window.open(content.externalUrl, '_blank', 'noopener,noreferrer');
      toast({ 
        title: '외부 링크로 이동합니다...', 
        description: content.source 
      });
    } else {
      setSelectedContent(content);
      setShowContentDetailModal(true);
    }
  };

  const handleAddContent = () => {
    setNewContentType('');
    setShowAddContentModal(true);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '콘텐츠 추가 완료',
      description: `새 ${newContentType} 등록 (+50 XP)`
    });
    setShowAddContentModal(false);
  };

  const handleExternalContentSubmit = (contentData: Partial<Content>) => {
    toast({
      title: '외부 링크 추가 완료',
      description: `${contentData.title} 링크 추가 (+20 XP)`
    });
    setShowAddContentModal(false);
  };

  const handleCustomize = () => {
    setShowCustomizeModal(true);
  };

  const handleSaveCustomization = () => {
    setShowCustomizeModal(false);
    toast({
      title: '꾸미기 저장됨',
      description: '변경 사항이 저장되었습니다.'
    });
  };

  const renderReviewCard = (review: Review) => {
    return (
      <Card key={review.id} className="overflow-hidden flex flex-col bg-white">
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center mb-3">
            <Avatar className="h-8 w-8 mr-2">
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
          <p className="text-xs text-text-200 mb-3 leading-relaxed line-clamp-3">{review.content}</p>
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
  };

  const renderContentDetailModal = () => {
    if (!selectedContent) return null;
    
    return (
      <Dialog open={showContentDetailModal} onOpenChange={setShowContentDetailModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedContent.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={selectedContent.imageUrl} 
              alt={selectedContent.title} 
              className="w-full h-64 object-cover rounded-md"
            />
            <p>{selectedContent.description}</p>
            {'participants' in selectedContent && 'maxParticipants' in selectedContent && (
              <p>참가자: {selectedContent.participants}/{selectedContent.maxParticipants}</p>
            )}
            <pre className="text-xs max-h-64 overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(selectedContent, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderAddContentModal = () => {
    return (
      <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Plus className="mr-2"/> Space 내 콘텐츠 추가
            </DialogTitle>
          </DialogHeader>
          
          {!newContentType ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {contentTypes.map(type => (
                <div 
                  key={type.id} 
                  className="cursor-pointer hover:border-accent-100 transition-colors group text-center p-4 border-2 border-transparent rounded-lg"
                  onClick={() => setNewContentType(type.name)}
                >
                  <type.icon className="h-10 w-10 mx-auto mb-2 text-gray-400 group-hover:text-accent-100 transition-colors" />
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-xs text-text-200">{type.description}</p>
                </div>
              ))}
            </div>
          ) : newContentType === '외부 링크' ? (
            <AddExternalContentForm
              onBack={() => setNewContentType('')}
              onSubmit={handleExternalContentSubmit}
            />
          ) : (
            <form onSubmit={handleContentSubmit} className="space-y-4 mt-4">
              <div className="space-y-4">
                <div><label>제목</label><Input placeholder={`${newContentType} 제목`} required /></div>
                <div><label>설명</label><Textarea placeholder={`${newContentType} 설명`} required /></div>
                <div><label>대표 이미지</label><div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center"><Plus className="h-8 w-8 text-text-200 mx-auto mb-2" /><p className="text-sm text-text-200">이미지 업로드</p></div></div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setNewContentType('')}>
                    뒤로
                  </Button>
                  <Button type="submit">
                    {newContentType} 등록
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  const renderCustomizeModal = () => {
    return (
      <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Paintbrush className="mr-2"/> 내 Space 꾸미기
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">스킨 선택</h3>
              <div className="p-4 text-center cursor-pointer border-2 border-accent-100 rounded-lg">
                <LayoutGrid className="h-8 w-8 mx-auto mb-2 text-accent-100"/>
                <p>Creator Hub (현재)</p>
              </div>
              <div className="p-4 text-center cursor-pointer hover:border-accent-100 border-2 border-transparent rounded-lg">
                <Rss className="h-8 w-8 mx-auto mb-2 text-gray-400"/>
                <p>미니멀 스토어</p>
              </div>
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold">섹션 순서 & 표시</h3>
              <div className="space-y-2 border rounded p-4 bg-bg-100">
                {mallConfig.sections.map((sectionId, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 bg-white rounded border group"
                  >
                    <div className="flex items-center">
                      <GripVertical className="h-5 w-5 mr-2 text-gray-400 cursor-grab group-hover:text-text-100"/>
                      <span>{sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4"/></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-1"/> 섹션 추가
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={() => setShowCustomizeModal(false)}>
              취소
            </Button>
            <Button onClick={handleSaveCustomization}>
              저장하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderQRModal = () => {
    return (
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>내 스페이스 QR 코드</DialogTitle>
          </DialogHeader>
          <div className="p-4 flex justify-center">
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              QR Code Area
            </div>
          </div>
          <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">
            {qrUrl}
          </div>
          <Button className="w-full mt-2">이미지 다운로드</Button>
        </DialogContent>
      </Dialog>
    );
  };

  const MyMallHeader = ({ mallData, isOwner, onAddContent, onCustomize }: {
    mallData: MyMallConfig;
    isOwner: boolean;
    onAddContent: () => void;
    onCustomize: () => void;
  }) => {
    const navItems = [
      { label: '홈', icon: () => <span>Home</span>, link: '#' },
      { label: '상품', icon: () => <span>Store</span>, link: '#products' },
      { label: '커뮤니티', icon: () => <span>MessageCircle</span>, link: '#community' },
      { label: '이벤트', icon: () => <span>Activity</span>, link: '#events' },
    ];

    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate(`/mall/${mallData.id}`)}>
              <AvatarImage src={mallData.profileImage} alt={mallData.owner}/>
              <AvatarFallback>{mallData.owner.substring(0,1)}</AvatarFallback>
            </Avatar>
            <span className="font-bold text-lg hidden md:inline">{mallData.title}</span>
            <nav className="hidden lg:flex items-center space-x-4 text-sm ml-4">
              {navItems.map(item => (
                <a key={item.label} href={item.link} className="flex items-center gap-1 text-text-200 hover:text-accent-100 transition-colors">
                  {item.icon()} {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex-1 max-w-md hidden md:block mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input placeholder="내 Space 내 콘텐츠 검색..." className="h-9 pl-10 rounded-full bg-bg-100 border-gray-200 focus:bg-white focus:border-accent-100"/>
            </div>
          </div>
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
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden text-text-200 hover:text-accent-100 hover:bg-accent-100/10">
              <Menu className="h-5 w-5"/>
            </Button>
            <RouterLink to="/peer-space/settings">
              <Button variant="ghost" size="icon" className="hidden lg:inline-flex text-text-200 hover:text-accent-100 hover:bg-accent-100/10">
                <User className="h-5 w-5"/>
              </Button>
            </RouterLink>
          </div>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-100 via-bg-200 to-bg-100 text-text-100 font-sans">
      <MyMallHeader
        mallData={mallConfig}
        isOwner={isOwner}
        onAddContent={handleAddContent}
        onCustomize={handleCustomize}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <EnhancedProfileHeader
          profileData={mallConfig}
          badgesData={badgesAndAchievementsData}
          isOwner={isOwner}
          onFollow={handleFollow}
          onMessage={handleMessage}
          onShowQR={handleQRGenerate}
          onShare={handleShare}
          onChangeCover={handleChangeCover}
        />

        <div className="space-y-12">
          {mallConfig.sections.map(sectionId => {
            switch(sectionId) {
              case 'latestContent':
                return (
                  <DynamicSection
                    key={sectionId}
                    sectionId={sectionId}
                    sectionTitle="최신 콘텐츠"
                    itemsToShow={mallConfig.customizations.contentDisplayCount?.latestContent ?? 4}
                    contentItems={contentItems}
                    renderContentCard={(content) => 
                      <EnhancedContentCard 
                        key={content.id} 
                        content={content} 
                        onClick={() => handleContentClick(content)}
                        onInteraction={(type, id) => handleContentInteraction(type, id)}
                      />
                    }
                    viewAllLinkText="모든 콘텐츠 보기"
                    onViewAll={() => setActiveTab('portfolio')}
                  />
                );
                
              case 'communitySpotlight':
                return (
                  <div key={sectionId}>
                    <h2 className="text-xl font-semibold mb-4">커뮤니티 소식</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-white"><CardHeader><CardTitle className="text-base">최신 글</CardTitle></CardHeader><CardContent className="space-y-2">{communityPosts.slice(0, 3).map(post => (<div key={post.id} className="text-xs p-2 rounded hover:bg-bg-100/50 cursor-pointer"><p className="font-medium mb-0.5 text-sm">{post.title}</p><p className="text-text-200">{post.author} • {post.date}</p></div>))}</CardContent><CardFooter><Button variant="link" size="sm" className="text-xs">커뮤니티 더보기</Button></CardFooter></Card>
                      {mallConfig.customizations.showChat && <Card className="bg-white"><CardHeader><CardTitle className="text-base">실시간 채팅</CardTitle></CardHeader><CardContent className="h-32 overflow-y-auto text-xs space-y-1 p-2 bg-bg-100 rounded"><p>방문자A: 질문 있어요!</p><p className="text-right">김피어: 네, 말씀하세요~</p></CardContent><CardFooter><Button variant="link" size="sm" className="text-xs">채팅 참여하기</Button></CardFooter></Card>}
                    </div>
                  </div>
                );
                
              case 'eventsAndQuests':
                return (
                  <div key={sectionId}>
                    <h2 className="text-xl font-semibold mb-4">이벤트 & 퀘스트</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {events.length > 0 && (
                        <EnhancedContentCard 
                          content={events[0]}
                          onClick={() => handleContentClick(events[0])}
                          onInteraction={(type, id) => handleContentInteraction(type, id)}
                        />
                      )}
                      {quests.length > 0 && (
                        <QuestCard 
                          quest={quests[0]}
                          onClick={() => handleContentClick(quests[0])}
                        />
                      )}
                    </div>
                  </div>
                );
                
              case 'reviews':
                return (
                  <DynamicSection
                    key={sectionId}
                    sectionId={sectionId}
                    sectionTitle="방문자 리뷰"
                    itemsToShow={mallConfig.customizations.contentDisplayCount?.reviews ?? 3}
                    reviewItems={reviews}
                    renderReviewCard={renderReviewCard}
                    viewAllLinkText="모든 리뷰 보기"
                    onViewAll={() => setActiveTab('reviews')}
                  />
                );
                
              default:
                return null;
            }
          })}
        </div>
      </main>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>내 스페이스 QR 코드</DialogTitle>
          </DialogHeader>
          <div className="p-4 flex justify-center">
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              QR Code Area
            </div>
          </div>
          <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">
            {qrUrl}
          </div>
          <Button className="w-full mt-2">이미지 다운로드</Button>
        </DialogContent>
      </Dialog>

      {selectedContent && renderContentDetailModal()}
      {showAddContentModal && renderAddContentModal()}
      {showCustomizeModal && renderCustomizeModal()}

      <footer className="bg-primary-300 text-white mt-16 py-8 text-sm">
        <div className="container mx-auto px-4">
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

export default PeerSpace;
