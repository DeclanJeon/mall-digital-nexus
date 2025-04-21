import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  Phone, MessageSquare, QrCode, Star, ArrowRight, User, Clock, Calendar, 
  Share2, ExternalLink, Plus, MapPin, Settings, Smartphone, Mail, Edit, 
  Heart, BookmarkPlus, ShoppingBag, FileText, Link
} from 'lucide-react';

import FeaturedContentSection from '@/components/peer-space/FeaturedContentSection';
import PortfolioSection from '@/components/peer-space/PortfolioSection';
import ServicesSection from '@/components/peer-space/ServicesSection';
import CommunitySection from '@/components/peer-space/CommunitySection';
import ReviewsSection from '@/components/peer-space/ReviewsSection';
import MapSection from '@/components/peer-space/MapSection';
import EventsSection from '@/components/peer-space/EventsSection';
import AnalyticsSection from '@/components/peer-space/AnalyticsSection';

import ContentDetailModal from '@/components/peer-space/modals/ContentDetailModal';
import AddContentModal from '@/components/peer-space/modals/AddContentModal';
import QRCodeModal from '@/components/peer-space/modals/QRCodeModal';

// Mock data for the Peer Space
const peerSpaceData = {
  id: 'myspace123',
  title: '나의 피어 스페이스',
  description: '나만의 특별한 공간에 오신 것을 환영합니다!',
  owner: '김피어',
  peerNumber: 'P-12345-6789',
  profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser',
  badges: ['인증완료', '골드회원', '디자인전문가'],
  followers: 128,
  recommendations: 45,
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com'
  },
  contactPhone: '02-123-4567',
  contactEmail: 'contact@peermall.com',
  address: '서울시 강남구 테헤란로 123'
};

// Featured content for the Peer Space
const featuredContent = [
  {
    id: 'content1',
    title: '디자인 포트폴리오',
    description: '최근 작업한 브랜딩 디자인 모음입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80',
    type: 'portfolio',
    date: '2일 전',
    likes: 24,
    isExternal: false
  },
  {
    id: 'content2',
    title: '인테리어 컨설팅',
    description: '공간의 변화를 위한 컨설팅 서비스를 제공합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
    type: 'service',
    price: '150,000원~',
    date: '', // Adding date field to fix the type error
    likes: 15,
    isExternal: true,
    source: 'interiorpro.kr'
  },
  {
    id: 'content3',
    title: '디자인 워크샵',
    description: '함께 배우는 브랜드 디자인 워크샵을 진행합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1675466583534-1755fbb2797b?auto=format&fit=crop&q=80',
    type: 'event',
    date: '2025년 5월 15일',
    price: '50,000원',
    likes: 32,
    isExternal: false
  },
  {
    id: 'content4',
    title: '로고 디자인 패키지',
    description: '브랜드 아이덴티티를 완성할 로고 디자인 패키지입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcdce9def54?auto=format&fit=crop&q=80',
    type: 'product',
    price: '300,000원',
    date: '', // Adding date field to fix the type error
    likes: 18,
    isExternal: true,
    source: 'designmarket.com'
  }
];

// Reviews for the Peer Space
const reviews = [
  {
    id: 'review1',
    author: '이지은',
    authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jieun',
    content: '디자인 컨설팅을 받았는데 정말 만족스러웠어요. 제가 원하던 브랜드 이미지를 정확하게 이해하고 멋진 로고를 만들어주셨습니다!',
    rating: 5,
    date: '2025-04-10',
    source: 'internal',
    peerMall: {
      id: 'mall123',
      name: '이지은의 공방',
      address: '서울시 마포구 홍대입구역 근처'
    }
  },
  {
    id: 'review2',
    author: '박민석',
    authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Minseok',
    content: '워크샵에 참여했는데 생각보다 많은 것을 배울 수 있어서 좋았습니다. 기본적인 디자인 개념부터 실전 팁까지 알차게 구성되어 있어요.',
    rating: 4,
    date: '2025-04-05',
    source: 'external',
    sourceSite: '디자인 커뮤니티',
    peerMall: {
      id: 'mall456',
      name: '박민석 스튜디오',
      address: '서울시 성동구 서울숲 인근'
    }
  },
  {
    id: 'review3',
    author: '최유진',
    authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Yujin',
    content: '로고 디자인을 의뢰했는데, 세 번의 수정 끝에 정말 마음에 드는 결과물을 받았습니다. 특히 피드백을 꼼꼼히 반영해주셔서 감사합니다.',
    rating: 5,
    date: '2025-03-28',
    source: 'external',
    sourceSite: '로고디자인리뷰',
    peerMall: {
      id: 'mall789',
      name: '유진의 아트샵',
      address: '서울시 서초구 강남대로 123'
    }
  }
];

// Community posts for the Peer Space
const communityPosts = [
  {
    id: 'post1',
    title: '봄맞이 디자인 트렌드 정보',
    author: '김피어',
    date: '2025-04-18',
    comments: 8,
    likes: 24
  },
  {
    id: 'post2',
    title: '로고 디자인 작업 과정 공유',
    author: '김피어',
    date: '2025-04-15',
    comments: 12,
    likes: 36
  },
  {
    id: 'post3',
    title: '다음 워크샵 안내 및 사전 준비물',
    author: '김피어',
    date: '2025-04-10',
    comments: 5,
    likes: 18
  }
];

// Special services
const specialServices = [
  {
    id: 'service1',
    title: '포트폴리오',
    icon: '📁',
    description: '작업물 갤러리'
  },
  {
    id: 'service2',
    title: '예약하기',
    icon: '📅',
    description: '상담/워크샵 예약'
  },
  {
    id: 'service3',
    title: '문의하기',
    icon: '💬',
    description: '1:1 문의'
  },
  {
    id: 'service4',
    title: '이벤트',
    icon: '🎉',
    description: '진행중인 이벤트'
  }
];

// Map locations for ecosystem map
const mapLocations = [
  {
    id: 'location1',
    name: '디자인 스튜디오',
    address: '서울시 강남구 역삼동 123',
    lat: 37.501,
    lng: 127.037,
    type: 'studio'
  },
  {
    id: 'location2',
    name: '디자인 워크샵 공간',
    address: '서울시 마포구 성산동 45',
    lat: 37.556,
    lng: 126.910,
    type: 'workshop'
  },
  {
    id: 'location3',
    name: '디자인 용품점',
    address: '서울시 종로구 익선동 12',
    lat: 37.572,
    lng: 126.992,
    type: 'shop'
  }
];

// Badges and achievements
const badgesAndAchievements = [
  { id: 'badge1', name: '디자인 전문가', icon: '🎨', description: '디자인 전문 지식과 경험을 인정받음' },
  { id: 'badge2', name: '친절한 피어', icon: '😊', description: '높은 고객 만족도를 유지함' },
  { id: 'badge3', name: '트렌드 세터', icon: '🔥', description: '새로운 트렌드를 선도함' },
  { id: 'badge4', name: '커뮤니티 활동가', icon: '👥', description: '활발한 커뮤니티 참여' }
];

// Family and Guild data
const familyGuildData = [
  { id: 'family1', name: '디자인 패밀리', type: 'family', members: 12, imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=design' },
  { id: 'guild1', name: '브랜딩 마스터즈', type: 'guild', members: 38, imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=branding' }
];

// Reference links for content
const referenceLinks = [
  { id: 'ref1', title: '디자인 가이드라인', url: 'https://example.com/guidelines', type: 'document' },
  { id: 'ref2', title: '브랜드 아이덴티티 기본 요소', url: 'https://example.com/identity', type: 'resource' },
  { id: 'ref3', title: '컬러 팔레트 선택 방법', url: 'https://example.com/colors', type: 'article' },
  { id: 'ref4', title: '타이포그래피 기초', url: 'https://example.com/typography', type: 'tutorial' }
];

// Event and quest data
const eventsAndQuests = [
  { 
    id: 'event1', 
    title: '디자인 워크샵', 
    date: '2025년 5월 15일',
    location: '서울시 강남구 역삼동 디자인 스튜디오',
    description: '기초부터 배우는 브랜드 디자인 워크샵',
    imageUrl: 'https://images.unsplash.com/photo-1675466583534-1755fbb2797b?auto=format&fit=crop&q=80',
    participants: 8,
    maxParticipants: 12
  },
  { 
    id: 'quest1', 
    title: '브랜드 아이덴티티 챌린지', 
    deadline: '2025년 5월 30일',
    description: '자신만의 브랜드 로고와 색상 팔레트를 개발하는 챌린지',
    reward: '디자이너 칭호 + 500포인트',
    participants: 24
  }
];

// Content types for adding new content
const contentTypes = [
  { id: 'type1', name: '상품', description: '판매할 제품 등록' },
  { id: 'type2', name: '포트폴리오', description: '작업물 전시' },
  { id: 'type3', name: '서비스', description: '제공할 서비스 등록' },
  { id: 'type4', name: '게시글', description: '커뮤니티에 글 작성' },
  { id: 'type5', name: '외부 링크', description: '외부 콘텐츠 연결' }
];

const PeerSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');

  // For QR code feature
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState(`https://peermall.com/peer-space/${peerSpaceData.id}`);
  
  // For content detail modal
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showContentDetailModal, setShowContentDetailModal] = useState(false);
  
  // For adding new content
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContentType, setNewContentType] = useState('');
  
  // For following feature
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    // For demo purposes, if logged in, user is the owner
    setIsOwner(userLoggedIn);
    
    // Redirect to login if not logged in
    if (!userLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [navigate, location]);

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  const handleContactClick = (type: string, reviewId?: string) => {
    if (type === 'call') {
      toast({
        title: '전화 연결 중',
        description: '피어에게 전화를 연결하고 있습니다...',
      });
    } else if (type === 'message') {
      toast({
        title: '메시지 작성',
        description: '새 메시지 작성 화면으로 이동합니다.',
      });
    } else if (type === 'visit' && reviewId) {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        toast({
          title: '방문하기',
          description: `${review.peerMall.name}의 피어몰로 이동합니다.`,
        });
      }
    }
  };

  const handleQRGenerate = () => {
    setShowQRModal(true);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? '팔로우 취소' : '팔로우 완료',
      description: isFollowing ? 
        '더 이상 이 피어를 팔로우하지 않습니다.' : 
        '이제 이 피어의 새로운 소식을 받아보실 수 있습니다.',
    });
  };

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
    setShowContentDetailModal(true);
  };

  const handleAddContent = () => {
    setShowAddContentModal(true);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '콘텐츠 추가 완료',
      description: '새로운 콘텐츠가 추가되었습니다.',
    });
    setShowAddContentModal(false);
  };

  const handleExternalLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '외부 링크 추가 완료',
      description: '외부 링크가 성공적으로 가져와졌습니다.',
    });
    setShowAddContentModal(false);
  };

  const renderContentDetailModal = () => {
    if (!selectedContent) return null;
    
    return (
      <Dialog open={showContentDetailModal} onOpenChange={setShowContentDetailModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedContent.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-2">
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedContent.imageUrl} 
                  alt={selectedContent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">설명</h3>
                  <p className="text-text-200">{selectedContent.description}</p>
                </div>
                
                {selectedContent.price && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">가격</h3>
                    <p className="text-xl font-bold text-primary-300">{selectedContent.price}</p>
                  </div>
                )}
                
                {selectedContent.date && selectedContent.date !== '' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">날짜</h3>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedContent.date}
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <Button variant="outline" className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    좋아요 {selectedContent.likes}
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    저장하기
                  </Button>
                  {selectedContent.type === 'product' && (
                    <Button className="bg-primary-300 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      구매하기
                    </Button>
                  )}
                  {selectedContent.type === 'service' && (
                    <Button className="bg-primary-300 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      문의하기
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">콘텐츠 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-200">작성자</span>
                    <span className="font-medium">{peerSpaceData.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-200">유형</span>
                    <Badge>{selectedContent.type}</Badge>
                  </div>
                  {selectedContent.isExternal && (
                    <div className="flex justify-between">
                      <span className="text-text-200">출처</span>
                      <a 
                        href={`https://${selectedContent.source}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-100 hover:underline flex items-center"
                      >
                        {selectedContent.source}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">연관 링크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {referenceLinks.slice(0, 3).map(link => (
                    <div key={link.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-text-200" />
                        <span>{link.title}</span>
                      </div>
                      <a 
                        href={link.url}
                        target="_blank"
                        rel="noreferrer" 
                        className="text-accent-100 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button variant="ghost" size="sm" className="w-full text-accent-100">
                    모든 관련 링크 보기
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">리뷰</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reviews.slice(0, 2).map(review => (
                    <div key={review.id} className="pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={review.authorImage} />
                          <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{review.author}</span>
                        <div className="flex ml-auto">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill={i < review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs mt-1 text-text-200 line-clamp-2">{review.content}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button variant="ghost" size="sm" className="w-full text-accent-100">
                    모든 리뷰 보기 ({reviews.length})
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderAddContentModal = () => {
    return (
      <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">새 콘텐츠 추가</DialogTitle>
          </DialogHeader>
          
          {!newContentType ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {contentTypes.map(type => (
                <Card 
                  key={type.id} 
                  className="cursor-pointer hover:border-primary-300 transition-colors"
                  onClick={() => setNewContentType(type.name)}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold mb-2">{type.name}</h3>
                    <p className="text-sm text-text-200">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : newContentType === '외부 링크' ? (
            <form onSubmit={handleExternalLinkSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">외부 링크 URL</label>
                <Input placeholder="https://example.com/your-content" required />
                <p className="text-xs text-text-200 mt-1">
                  외부 콘텐츠(상품, 글, 이미지 등)의 URL을 입력하세요. 
                  피어몰이 자동으로 정보를 가져옵니다.
                </p>
              </div>
              
              <div className="border rounded-md p-4 bg-bg-100">
                <h3 className="font-medium mb-2">미리보기</h3>
                <div className="flex items-center space-x-3">
                  <div className="h-16 w-16 bg-bg-200 rounded flex items-center justify-center text-text-300">
                    이미지
                  </div>
                  <div>
                    <p className="font-medium">가져온 콘텐츠 제목</p>
                    <p className="text-sm text-text-200">가져온 설명 내용의 일부...</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">메모 (선택사항)</label>
                <Textarea placeholder="이 콘텐츠에 대한 메모를 남겨보세요." />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setNewContentType('')}>
                  뒤로
                </Button>
                <Button type="submit">외부 링크 가져오기</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleContentSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <Input placeholder={`${newContentType} 제목`} required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <Textarea placeholder={`${newContentType}에 대한 설명을 입력하세요.`} required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">대표 이미지</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Plus className="h-8 w-8 text-text-200 mb-2" />
                    <p className="text-sm text-text-200">클릭하여 이미지 업로드</p>
                    <p className="text-xs text-text-300 mt-1">또는 파일을 여기에 끌어다 놓으세요</p>
                  </div>
                </div>
              </div>
              
              {(newContentType === '상품' || newContentType === '서비스') && (
                <div>
                  <label className="block text-sm font-medium mb-1">가격</label>
                  <div className="relative">
                    <Input placeholder="가격을 입력하세요" required />
                    <span className="absolute right-3 top-2 text-text-200">원</span>
                  </div>
                </div>
              )}
              
              {newContentType === '이벤트' && (
                <div>
                  <label className="block text-sm font-medium mb-1">날짜 및 시간</label>
                  <Input type="datetime-local" required />
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setNewContentType('')}>
                  뒤로
                </Button>
                <Button type="submit">{newContentType} 등록하기</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-bg-100">
      {/* Top Bar with Peer Space Info and Actions */}
      <div className="bg-gradient-to-r from-primary-200 to-primary-300 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                <AvatarImage src={peerSpaceData.profileImage} alt={peerSpaceData.owner} />
                <AvatarFallback>{peerSpaceData.owner.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{peerSpaceData.title}</h1>
                <div className="flex items-center text-sm">
                  <span>{peerSpaceData.owner}</span>
                  <div className="mx-2">•</div>
                  <span>Peer #{peerSpaceData.peerNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isOwner && (
                <>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className={`rounded-full ${isFollowing ? 'bg-white text-primary-300' : ''}`}
                    onClick={handleFollow}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {isFollowing ? '팔로우됨' : '팔로우'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleContactClick('message')}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    메시지
                  </Button>
                </>
              )}
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="rounded-full"
                onClick={handleQRGenerate}
              >
                <QrCode className="h-4 w-4 mr-1" />
                QR 코드
              </Button>
              
              {isOwner && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toast({
                    title: '설정',
                    description: '피어 스페이스 설정 화면으로 이동합니다.',
                  })}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  설정
                </Button>
              )}
            </div>
          </div>
          
          {/* Badges Row */}
          <div className="flex flex-wrap items-center mt-2 gap-2">
            {peerSpaceData.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                {badge}
              </Badge>
            ))}
            <div className="flex items-center ml-2">
              <Star className="h-4 w-4 text-yellow-300 mr-1" />
              <span className="text-sm">{peerSpaceData.recommendations} 추천</span>
            </div>
            <div className="flex items-center ml-2">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">{peerSpaceData.followers} 팔로워</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs defaultValue="featured" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
            <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
            <TabsTrigger value="services">서비스</TabsTrigger>
            <TabsTrigger value="community">커뮤니티</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
            <TabsTrigger value="map">지도</TabsTrigger>
            <TabsTrigger value="events">이벤트</TabsTrigger>
            {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
          </TabsList>
          
          {/* Featured Content Tab */}
          <TabsContent value="featured" className="space-y-10">
            <FeaturedContentSection
              content={featuredContent}
              isOwner={isOwner}
              onAddContent={handleAddContent}
              onContentClick={handleContentClick}
            />
            
            {/* Community Posts Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <
