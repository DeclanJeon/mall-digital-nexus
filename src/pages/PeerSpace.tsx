import React, { useState, useEffect } from 'react';
import { Content } from '@/components/peer-space/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  Phone, MessageSquare, QrCode, Star, ArrowRight, User, Clock, Calendar, 
  Share2, ExternalLink, Plus, MapPin, Settings, Smartphone, Mail, Edit, 
  Heart, BookmarkPlus, ShoppingBag, FileText, Link
} from 'lucide-react';

import FeaturedContentSection from '@/components/peer-space/FeaturedContentSection';

const PeerSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState(`https://peermall.com/peer-space/myspace123`);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showContentDetailModal, setShowContentDetailModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContentType, setNewContentType] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    setIsOwner(userLoggedIn);
    if (!userLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [navigate, location]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? '팔로우 취소' : '팔로우 완료',
      description: isFollowing ? 
        '더 이상 이 피어를 팔로우하지 않습니다.' : 
        '이제 이 피어의 새로운 소식을 받아보실 수 있습니다.',
    });
  };

  const handleContactClick = (type: string) => {
    if (type === 'message') {
      toast({
        title: '메시지 작성',
        description: '새 메시지 작성 화면으로 이동합니다.',
      });
    }
  };

  const handleQRGenerate = () => {
    setShowQRModal(true);
  };

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setShowContentDetailModal(true);
  };

  const handleAddContent = () => {
    setShowAddContentModal(true);
  };

  const renderAddContentModal = () => {
    return (
      <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">새 콘텐츠 추가</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>콘텐츠 추가 기능 구현</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Mock data moved inside component
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

  const featuredContent: Content[] = [
    {
      id: 'content1',
      title: '디자인 포트폴리오',
      description: '최근 작업한 브랜딩 디자인 모음입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80',
      type: 'service',
      date: '2일 전',
      likes: 24,
      isExternal: false
    },
    // ... (나머지 featuredContent 항목들 유지)
  ];

  const reviews = [
    {
      id: 'review1',
      author: '이지은',
      authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jieun',
      content: '디자인 컨설팅을 받았는데 정말 만족스러웠어요...',
      rating: 5,
      date: '2025-04-10',
      source: 'internal',
      peerMall: {
        id: 'mall123',
        name: '이지은의 공방',
        address: '서울시 마포구 홍대입구역 근처'
      }
    },
    // ... (나머지 reviews 항목들 유지)
  ];

  const communityPosts = [
    {
      id: 'post1',
      title: '봄맞이 디자인 트렌드 정보',
      author: '김피어',
      date: '2025-04-18',
      comments: 8,
      likes: 24
    },
    // ... (나머지 communityPosts 항목들 유지)
  ];

  const referenceLinks = [
    { id: 'ref1', title: '디자인 가이드라인', url: 'https://example.com/guidelines', type: 'document' },
    // ... (나머지 referenceLinks 항목들 유지)
  ];

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

  // ... (기존 renderAddContentModal 및 return 부분은 동일하게 유지)

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
          <Tabs defaultValue="featured" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured" className="space-y-10">
              <FeaturedContentSection
                content={featuredContent}
                isOwner={isOwner}
                onAddContent={handleAddContent}
                onContentClick={handleContentClick}
              />
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Modals */}
        {renderContentDetailModal()}
        {renderAddContentModal()}
      </div>
    );
};

export default PeerSpace;
