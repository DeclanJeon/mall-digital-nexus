
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

import { Content, Review, Event, Quest, PeerMallConfig } from '@/components/peer-space/types';
import PeerSpaceHome from '@/components/peer-space/PeerSpaceHome';

const PeerSpace = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(true);
  
  // Mock data for our demo
  const [mallConfig, setMallConfig] = useState<PeerMallConfig>({
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
    experience: 250,
    nextLevelExperience: 1200,
    isVerified: true,
    skin: 'creator-hub-default',
    // Add 'qrCodeList' and 'support' to the sections array
    sections: ['hero', 'content', 'community', 'events', 'infoHub', 'map', 'reviews', 'trust', 'support', 'qrCodeList', 'relatedMalls', 'activityFeed', 'liveCollaboration'],
    customizations: {
      primaryColor: '#71c4ef',
      secondaryColor: '#3B82F6',
      showChat: true,
      allowComments: true,
      showBadges: true,
      contentDisplayCount: { content: 4, reviews: 6 },
    },
    socialLinks: {
      instagram: 'https://instagram.com/kimpeer',
      facebook: 'https://facebook.com/kimpeer',
      twitter: 'https://twitter.com/kimpeer'
    },
    contactPhone: '02-123-4567',
    contactEmail: 'contact@peermall.com',
    address: '서울시 강남구 테헤란로 123',
    familyGuilds: [
      { id: 'guild1', name: '브랜딩 마스터즈', imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=branding' }
    ],
    location: {
      lat: 37.5665,
      lng: 126.9780,
      address: '서울시 강남구 테헤란로 123'
    }
  });

  // Mock content data
  const [contentItems, setContentItems] = useState<Content[]>([
    {
      id: 'content1', 
      title: '디자인 포트폴리오: 모던 브랜딩', 
      description: '최근 작업한 모던하고 세련된 브랜딩 디자인 결과물입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
      type: 'portfolio', 
      date: '2일 전', 
      likes: 24, 
      comments: 5, 
      saves: 12, 
      views: 150
    },
    {
      id: 'ext-product1', 
      title: '미니멀리스트 데스크 램프', 
      description: '깔끔한 디자인의 LED 데스크 램프, 내 스마트스토어에서 판매 중!',
      imageUrl: 'https://images.unsplash.com/photo-1543508286-a104a6f469d7?auto=format&fit=crop&q=80&w=800',
      type: 'product', 
      price: '45,000원', 
      likes: 35, 
      comments: 7, 
      saves: 20, 
      views: 250,
      isExternal: true, 
      externalUrl: 'https://smartstore.naver.com/kimp/products/123', 
      source: '네이버', 
      sourceType: 'store'
    },
    {
      id: 'ext-blog1', 
      title: '2025년 디자인 트렌드 분석', 
      description: '올해 주목해야 할 비주얼 트렌드를 내 개인 블로그에 정리했어요.',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
      type: 'post', 
      date: '5일 전', 
      likes: 50, 
      comments: 15, 
      saves: 30, 
      views: 400,
      isExternal: true, 
      externalUrl: 'https://kimp-design.blog/trends-2025', 
      source: '블로그', 
      sourceType: 'blog'
    },
    {
      id: 'ext-review1', 
      title: '최애 카페 방문 후기', 
      description: '분위기 좋은 카페 리뷰 영상을 유튜브에 올렸어요!',
      imageUrl: 'https://images.unsplash.com/photo-1511920183353-311a5ff489a5?auto=format&fit=crop&q=80&w=800',
      type: 'review', 
      date: '1주 전', 
      likes: 105, 
      comments: 25, 
      saves: 40, 
      views: 1200, 
      rating: 5,
      isExternal: true, 
      externalUrl: 'https://youtube.com/watch?v=abcdefg', 
      source: '유튜브', 
      sourceType: 'video'
    },
    {
      id: 'service1', 
      title: '브랜딩 컨설팅 서비스', 
      description: '당신의 브랜드를 세련되고 차별화된 모습으로 바꿔드립니다.',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
      type: 'service', 
      price: '100,000원/시간', 
      likes: 18, 
      comments: 4, 
      saves: 15, 
      views: 230
    },
  ]);

  // Mock reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'review1', 
      author: '이지은', 
      authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jieun',
      content: '디자인 컨설팅을 받았는데 정말 만족스러웠어요. 브랜드 이미지가 완전히 달라졌고, 고객 반응도 매우 좋아졌습니다. 추천합니다!', 
      rating: 5, 
      date: '2025-04-10', 
      source: 'internal', 
      likes: 5,
      peerMall: { id: 'mall123', name: '이지은의 공방', address: '서울시 마포구' }
    },
    {
      id: 'review2', 
      author: '박민석', 
      authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Minseok',
      content: '워크샵 내용이 알찼습니다. 실전 팁들이 많아서 바로 적용해볼 수 있었어요. 다음 워크샵도 참여하고 싶습니다.', 
      rating: 4, 
      date: '2025-04-05', 
      source: 'external', 
      sourceSite: '디자인 커뮤니티', 
      likes: 3,
      peerMall: { id: 'mall456', name: '박민석 스튜디오', address: '서울시 성동구' }
    },
    {
      id: 'review3', 
      author: '최영희', 
      authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Younghee',
      content: '포트폴리오 상담을 받았는데, 정확한 피드백과 방향성을 제시해주셔서 많은 도움이 되었어요. 덕분에 원하는 회사에 취업할 수 있었습니다!', 
      rating: 5, 
      date: '2025-03-22', 
      source: 'internal', 
      likes: 8,
      peerMall: { id: 'mall789', name: '영희디자인', address: '서울시 용산구' }
    },
  ]);

  // Mock events
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'event1', 
      title: '디자인 워크샵: 브랜딩 기초', 
      date: '2025년 5월 15일', 
      location: '온라인 Zoom',
      description: '기초부터 배우는 브랜드 디자인 워크샵! 로고 디자인부터 컬러 팔레트, 타이포그래피까지 브랜딩의 핵심 요소를 배워보세요.', 
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      participants: 8, 
      maxParticipants: 12, 
      price: '50,000원', 
      likes: 45, 
      comments: 12, 
      saves: 22, 
      views: 350,
      type: 'event'
    },
    {
      id: 'event2', 
      title: '포트폴리오 리뷰 데이', 
      date: '2025년 6월 5일', 
      location: '강남 코워킹 스페이스',
      description: '취업과 프리랜서 활동을 위한 포트폴리오 리뷰 세션입니다. 실무자에게 직접 피드백을 받고 개선점을 찾아보세요.', 
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
      participants: 5, 
      maxParticipants: 10, 
      price: '무료', 
      likes: 32, 
      comments: 8, 
      saves: 19, 
      views: 210,
      type: 'event'
    }
  ]);

  // Mock quests
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'quest1', 
      title: '브랜드 아이덴티티 챌린지', 
      deadline: '2025년 5월 30일',
      description: '자신만의 브랜드 로고와 색상 팔레트를 개발하고 공유하세요! 창의적인 컨셉으로 참여해주세요.', 
      reward: '디자이너 칭호 + 500 XP', 
      participants: 24, 
      goal: 50, 
      type: 'community', 
      progress: 48,
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'quest2', 
      title: '포트폴리오 피드백 교환', 
      deadline: '2025년 5월 20일',
      description: '다른 피어의 포트폴리오에 건설적인 피드백 3개를 남겨주세요. 서로의 성장을 돕는 활동입니다.', 
      reward: '200 XP + 피드백 전문가 뱃지', 
      participants: 15, 
      goal: 3, 
      type: 'individual', 
      progress: 1,
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800'
    }
  ]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <PeerSpaceHome
      config={mallConfig}
      isOwner={isOwner}
      contents={contentItems}
      reviews={reviews}
      events={events}
      quests={quests}
    />
  );
};

export default PeerSpace;
