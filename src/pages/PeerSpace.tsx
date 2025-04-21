import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, QrCode, Star, ArrowRight } from 'lucide-react';
import QRFeature from '@/components/QRFeature';
import PeermallHeader from '@/components/peermall/PeermallHeader';
import PeermallFooter from '@/components/peermall/PeermallFooter';

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
    likes: 24
  },
  {
    id: 'content2',
    title: '인테리어 컨설팅',
    description: '공간의 변화를 위한 컨설팅 서비스를 제공합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
    type: 'service',
    price: '150,000원~',
    likes: 15
  },
  {
    id: 'content3',
    title: '디자인 워크샵',
    description: '함께 배우는 브랜드 디자인 워크샵을 진행합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1675466583534-1755fbb2797b?auto=format&fit=crop&q=80',
    type: 'event',
    date: '2025년 5월 15일',
    price: '50,000원',
    likes: 32
  },
  {
    id: 'content4',
    title: '로고 디자인 패키지',
    description: '브랜드 아이덴티티를 완성할 로고 디자인 패키지입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcdce9def54?auto=format&fit=crop&q=80',
    type: 'product',
    price: '300,000원',
    likes: 18
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
    source: 'internal',
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

const PeerSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');

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
      console.log('Calling peer...');
      // Implementation would connect to the call service
    } else if (type === 'message') {
      console.log('Opening message dialog...');
      // Implementation would open a message dialog
    } else if (type === 'visit' && reviewId) {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        console.log(`Navigating to ${review.peerMall.name}'s PeerMall`);
        // Implementation would navigate to the respective PeerMall
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-100">
      {/* Custom header for the Peer Space */}
      <PeermallHeader peermall={peerSpaceData} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-100 to-primary-200 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {peerSpaceData.title}
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {peerSpaceData.description}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                {peerSpaceData.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                    {badge}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-white/90">{peerSpaceData.recommendations} 추천</span>
                </div>
                <div className="text-white/90">{peerSpaceData.followers} 팔로워</div>
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col items-center">
              <Avatar className="h-36 w-36 border-4 border-white">
                <AvatarImage src={peerSpaceData.profileImage} alt={peerSpaceData.owner} />
                <AvatarFallback>{peerSpaceData.owner.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold text-white mt-4">{peerSpaceData.owner}</h3>
              <p className="text-white/80 mt-2">Peer 번호: {peerSpaceData.peerNumber}</p>
              
              {!isOwner && (
                <div className="flex space-x-3 mt-6">
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={() => handleContactClick('call')}>
                    <Phone className="h-4 w-4 mr-1" />
                    통화하기
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={() => handleContactClick('message')}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    메시지
                  </Button>
                </div>
              )}
              
              {isOwner && (
                <Button variant="secondary" size="sm" className="rounded-full mt-6">
                  <QrCode className="h-4 w-4 mr-1" />
                  QR 코드 생성
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Tabs Navigation */}
        <Tabs defaultValue="featured" className="mb-12" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
            <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
            <TabsTrigger value="services">서비스</TabsTrigger>
            <TabsTrigger value="community">커뮤니티</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
            {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
          </TabsList>
          
          {/* Featured Content Tab */}
          <TabsContent value="featured" className="space-y-12">
            {/* Featured Content Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-300">추천 콘텐츠</h2>
                <Button variant="ghost" size="sm" className="flex items-center text-accent-200">
                  더보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={content.imageUrl} 
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      {content.type === 'event' && (
                        <Badge className="absolute top-2 right-2 bg-accent-100">이벤트</Badge>
                      )}
                      {content.type === 'product' && (
                        <Badge className="absolute top-2 right-2 bg-primary-200">상품</Badge>
                      )}
                      {content.type === 'service' && (
                        <Badge className="absolute top-2 right-2 bg-secondary">서비스</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-1">{content.title}</h3>
                      <p className="text-sm text-text-200 mb-3">{content.description}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          {content.price && (
                            <p className="font-semibold text-primary-300">{content.price}</p>
                          )}
                          {content.date && !content.price && (
                            <p className="text-sm text-text-200">{content.date}</p>
                          )}
                        </div>
                        <div className="text-sm text-text-200 flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          {content.likes}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            {/* Reviews Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-300">최신 리뷰</h2>
                <Button variant="ghost" size="sm" className="flex items-center text-accent-200" onClick={() => setActiveTab('reviews')}>
                  더보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.slice(0, 3).map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={review.authorImage} alt={review.author} />
                          <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                            <span className="text-xs text-text-200 ml-1">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {review.source === 'external' && (
                          <Badge className="ml-auto bg-accent-100/20 text-accent-100 text-xs">
                            {review.sourceSite}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-text-200 mb-4">{review.content}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-text-300">
                          from {review.peerMall.name}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 rounded-full"
                            onClick={() => handleContactClick('call', review.id)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 rounded-full"
                            onClick={() => handleContactClick('message', review.id)}
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 rounded-full"
                            onClick={() => handleContactClick('visit', review.id)}
                          >
                            방문하기
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            {/* Community Posts Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-300">커뮤니티 게시글</h2>
                <Button variant="ghost" size="sm" className="flex items-center text-accent-200" onClick={() => setActiveTab('community')}>
                  더보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {communityPosts.map((post, index) => (
                  <div key={post.id} className={`p-4 flex justify-between items-center ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                    <div>
                      <h3 className="font-medium mb-1">{post.title}</h3>
                      <div className="text-xs text-text-200 flex items-center">
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>댓글 {post.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {post.likes}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Special Services Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-300">특별 서비스</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {specialServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="text-4xl mb-3">{service.icon}</div>
                      <h3 className="font-bold mb-1">{service.title}</h3>
                      <p className="text-sm text-text-200">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
          
          {/* Other tabs would be implemented similarly */}
          <TabsContent value="portfolio">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">포트폴리오</h2>
            <p className="text-text-200">포트폴리오 내용이 여기에 표시됩니다.</p>
          </TabsContent>
          
          <TabsContent value="services">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">서비스</h2>
            <p className="text-text-200">서비스 내용이 여기에 표시됩니다.</p>
          </TabsContent>
          
          <TabsContent value="community">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">커뮤니티</h2>
            <p className="text-text-200">커뮤니티 게시글이 여기에 표시됩니다.</p>
          </TabsContent>
          
          <TabsContent value="reviews">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">리뷰</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.authorImage} alt={review.author} />
                        <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.author}</p>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill={i < review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                          <span className="text-xs text-text-200 ml-1">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {review.source === 'external' && (
                        <Badge className="ml-auto bg-accent-100/20 text-accent-100 text-xs">
                          {review.sourceSite}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-text-200 mb-4">{review.content}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-text-300">
                        from {review.peerMall.name}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 rounded-full"
                          onClick={() => handleContactClick('call', review.id)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 rounded-full"
                          onClick={() => handleContactClick('message', review.id)}
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 rounded-full"
                          onClick={() => handleContactClick('visit', review.id)}
                        >
                          방문하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {isOwner && (
            <TabsContent value="analytics">
              <h2 className="text-2xl font-bold text-primary-300 mb-6">분석</h2>
              <p className="text-text-200">방문자 통계 및 분석 정보가 여기에 표시됩니다. (주인에게만 표시)</p>
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      {/* QR Feature Section */}
      <QRFeature />
      
      {/* Footer */}
      <PeermallFooter peermall={peerSpaceData} />
    </div>
  );
};

export default PeerSpace;
