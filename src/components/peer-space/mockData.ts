import { Content, Review, CommunityPost, PeerSpaceData } from './types';

export const peerSpaceData: PeerSpaceData = {
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
    instagram: 'https://instagram.com',
  },
  contactPhone: '02-123-4567',
  contactEmail: 'contact@peermall.com',
  address: '서울시 강남구 테헤란로 123',
};

export const featuredContent: Content[] = [
  {
    id: 'content1',
    title: '디자인 포트폴리오',
    description: '최근 작업한 브랜딩 디자인 모음입니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80',
    type: 'portfolio',
    date: '2일 전',
    likes: 24,
    isExternal: false,
  },
  {
    id: 'content2',
    title: '인테리어 컨설팅',
    description: '공간의 변화를 위한 컨설팅 서비스를 제공합니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80',
    type: 'service',
    price: '150,000원~',
    date: '',
    likes: 15,
    isExternal: true,
    source: 'interiorpro.kr',
  },
  {
    id: 'content3',
    title: '디자인 워크샵',
    description: '함께 배우는 브랜드 디자인 워크샵을 진행합니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1675466583534-1755fbb2797b?auto=format&fit=crop&q=80',
    type: 'event',
    date: '2025년 5월 15일',
    price: '50,000원',
    likes: 32,
    isExternal: false,
  },
  {
    id: 'content4',
    title: '로고 디자인 패키지',
    description: '브랜드 아이덴티티를 완성할 로고 디자인 패키지입니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1626785774625-ddcdce9def54?auto=format&fit=crop&q=80',
    type: 'product',
    price: '300,000원',
    date: '',
    likes: 18,
    isExternal: true,
    source: 'designmarket.com',
  },
];

export const reviews: Review[] = [
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
      address: '서울시 마포구 홍대입구역 근처',
    },
  },
  // ... (나머지 reviews 데이터)
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post1',
    title: '봄맞이 디자인 트렌드 정보',
    author: '김피어',
    date: '2025-04-18',
    comments: 8,
    likes: 24,
  },
  // ... (나머지 communityPosts 데이터)
];
