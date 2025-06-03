// 🌟 커뮤니티 활동 데이터
export interface CommunityActivity {
  id: string;
  type: 'post' | 'review' | 'like' | 'follow' | 'share';
  user: {
    id: string;
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  target?: string; // 피어몰명 또는 상품명
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  trending?: boolean;
}

export interface CommunityStats {
  totalUsers: number;
  activeToday: number;
  totalPosts: number;
  totalReviews: number;
  growthRate: number;
}

// 🔥 더미 데이터
export const communityActivities: CommunityActivity[] = [
  {
    id: '1',
    type: 'post',
    user: {
      id: 'user1',
      name: '민지킴',
      avatar: '/api/placeholder/40/40',
      badge: '🌟 파워유저'
    },
    content: '새로운 카페 피어몰 오픈했어요! 직접 로스팅한 원두로 만든 커피 맛보러 오세요 ☕',
    target: '민지의 커피하우스',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
    engagement: { likes: 24, comments: 8, shares: 3 },
    trending: true
  },
  {
    id: '2',
    type: 'review',
    user: {
      id: 'user2',
      name: '테크러버',
      avatar: '/api/placeholder/40/40',
      badge: '💎 VIP'
    },
    content: '아이폰 케이스 퀄리티 진짜 좋네요! 배송도 빠르고 포장도 완벽했어요 👍',
    target: 'TechGear Store',
    timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32분 전
    engagement: { likes: 18, comments: 5, shares: 2 }
  },
  {
    id: '3',
    type: 'like',
    user: {
      id: 'user3',
      name: '쇼핑러버',
      avatar: '/api/placeholder/40/40'
    },
    content: '핸드메이드 액세서리 피어몰을 좋아합니다',
    target: 'Artisan Jewelry',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45분 전
    engagement: { likes: 12, comments: 2, shares: 1 }
  },
  {
    id: '4',
    type: 'follow',
    user: {
      id: 'user4',
      name: '푸디맨',
      avatar: '/api/placeholder/40/40',
      badge: '🍔 푸드마니아'
    },
    content: '맛집 피어몰들을 팔로우하기 시작했어요!',
    target: '로컬 맛집 투어',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
    engagement: { likes: 8, comments: 1, shares: 0 }
  },
  {
    id: '5',
    type: 'share',
    user: {
      id: 'user5',
      name: '아트갤러리',
      avatar: '/api/placeholder/40/40',
      badge: '🎨 크리에이터'
    },
    content: '독립 작가들의 작품을 소개하는 피어몰을 공유했어요',
    target: 'Indie Artist Hub',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5시간 전
    engagement: { likes: 31, comments: 12, shares: 7 },
    trending: true
  }
];

export const communityStats: CommunityStats = {
  totalUsers: 12847,
  activeToday: 1523,
  totalPosts: 8934,
  totalReviews: 15672,
  growthRate: 23.5
};

// 🎯 트렌딩 해시태그
export const trendingHashtags = [
  { tag: '#신상품', count: 234 },
  { tag: '#할인이벤트', count: 189 },
  { tag: '#핸드메이드', count: 156 },
  { tag: '#로컬맛집', count: 142 },
  { tag: '#친환경', count: 98 }
];
