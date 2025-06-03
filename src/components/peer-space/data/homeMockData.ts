import { Content, ContentType } from '../../../types/space';
import { Product } from '../../../types/product';

// Mock data generator utilities
export const generateRandomDate = () => {
  const start = new Date(2025, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock data for products
export const generateMockProducts = (count: number): Product[] => {
  const categories = ['전자제품', '패션', '생활용품', '도서', '음식', '취미'];
  const titles = [
    '최신 스마트폰',
    '무선 이어폰',
    '슬림핏 청바지',
    '편안한 운동화',
    '다용도 선반',
    '베스트셀러 소설',
    '프리미엄 노트북',
    '고급 손목시계',
    '친환경 수건 세트',
    '유기농 차 세트',
    '프리미엄 커피머신',
    '휴대용 블루투스 스피커',
    '실내 공기청정기',
  ];

  return Array(count)
    .fill(null)
    .map((_, idx) => {
      const now = generateRandomDate();
      return {
        id: `prod-${Date.now()}-${idx}`,
        peerSpaceAddress: 'mock-address',
        title: titles[idx % titles.length],
        description: `고품질 제품으로 여러분의 일상을 더욱 편리하게 만들어드립니다. 다양한 기능과 세련된 디자인으로 많은 사랑을 받고 있는 제품입니다.`,
        imageUrl: `https://source.unsplash.com/random/300x300/?product&sig=${idx}`,
        type: ContentType.Product,
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
        isExternal: false,
        rating: generateRandomNumber(1, 5),
        reviewCount: generateRandomNumber(0, 500),
        peermallName: 'Mock Peermall',
      };
    });
};

// Mock data for posts
export const generateMockPosts = (count: number): Content[] => {
  const categories = ['뉴스', '리뷰', '튜토리얼', '인터뷰', '에세이'];
  const titles = [
    '최신 트렌드 분석',
    '신제품 리뷰: 정말 기대 이상입니다',
    '초보자를 위한 가이드',
    '전문가와의 대화',
    '사용자 경험 이야기',
    '업데이트된 기능 소개',
    '비교 테스트: A제품 vs B제품',
    '알아두면 유용한 팁 10가지',
    '업계 전문가의 인사이트',
    '디자인 철학에 대한 고찰',
  ];

  return Array(count)
    .fill(null)
    .map((_, idx) => {
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
        isExternal: false,
      };
    });
};

// 방명록 데이터
export const guestbookData = [
  {
    id: 1,
    author: '방문자1',
    message:
      '멋진 피어몰입니다! 제품 품질이 정말 좋네요. 다음에 새로 나오는 제품도 구경하러 올게요.',
    date: '2025-05-21',
    profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor1',
  },
  {
    id: 2,
    author: '방문자2',
    message:
      '제품 품질이 좋아요. 배송도 빠르게 받았습니다. 다른 친구들에게도 추천했어요.',
    date: '2025-05-20',
    profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor2',
  },
  {
    id: 3,
    author: '방문자3',
    message: '다음에 또 방문할게요. 이곳은 항상 유익한 정보가 많아서 좋아요!',
    date: '2025-05-19',
    profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor3',
  },
  {
    id: 4,
    author: '방문자4',
    message: '운영자님 항상 좋은 컨텐츠 감사합니다. 매일 방문하고 있어요.',
    date: '2025-05-18',
    profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor4',
  },
  {
    id: 5,
    author: '방문자5',
    message: '최근에 구매한 제품이 너무 맘에 들어요! 다음 신상품도 기대할게요.',
    date: '2025-05-17',
    profileImg: 'https://api.dicebear.com/7.x/personas/svg?seed=visitor5',
  },
];

// 공지사항 데이터
export const notificationsData = [
  {
    id: 1,
    title: '신규 기능 추가 안내',
    content:
      '피어몰에 새로운 기능이 추가되었습니다. 이제 더욱 편리하게 이용하실 수 있습니다.',
    date: '2025-05-20',
    important: true,
  },
  {
    id: 2,
    title: '여름 할인 이벤트 오픈',
    content:
      '여름 맞이 특별 할인 이벤트를 진행합니다. 최대 50%까지 할인된 가격으로 제품을 만나보세요.',
    date: '2025-05-18',
    important: true,
  },
  {
    id: 3,
    title: '커뮤니티 가이드라인 업데이트',
    content:
      '더 나은 소통 환경을 위해 커뮤니티 가이드라인이 업데이트되었습니다. 확인해주세요.',
    date: '2025-05-15',
    important: false,
  },
  {
    id: 4,
    title: '신규 파트너십 체결 소식',
    content: '새로운 파트너십을 통해 더 다양한 서비스를 제공할 예정입니다.',
    date: '2025-05-10',
    important: false,
  },
];

// 알림 데이터
export const alertsData = [
  {
    id: 1,
    title: '새로운 팔로워',
    message: '사용자 홍길동님이 팔로우했습니다',
    time: '1시간 전',
    type: 'follow',
    read: false,
  },
  {
    id: 2,
    title: '제품 리뷰',
    message: '제품 "무선 이어폰"에 새 리뷰가 달렸습니다',
    time: '3시간 전',
    type: 'review',
    read: false,
  },
  {
    id: 3,
    title: '업데이트 완료',
    message: '시스템 업데이트가 완료되었습니다',
    time: '어제',
    type: 'system',
    read: true,
  },
  {
    id: 4,
    title: '새 메시지',
    message: '김철수님으로부터 새 메시지가 도착했습니다',
    time: '2일 전',
    type: 'message',
    read: true,
  },
  {
    id: 5,
    title: '이벤트 알림',
    message: '참여하신 이벤트가 곧 종료됩니다',
    time: '3일 전',
    type: 'event',
    read: true,
  },
];

// 광고 데이터
export const sponsorsData = [
  {
    id: 1,
    title: '여름 특별 프로모션',
    description: '시원한 여름 맞이 특별 할인 행사',
    imageUrl:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400',
    link: '#',
  },
  {
    id: 2,
    title: '신제품 출시 기념 이벤트',
    description: '혁신적인 신제품을 만나보세요',
    imageUrl:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=400',
    link: '#',
  },
];

// 히어로 섹션 슬라이더 데이터
export const heroSlides = [
  {
    id: 1,
    title: '새로운 시즌 컬렉션',
    subtitle: '2025 여름 신상품 출시',
    description:
      '트렌디한 디자인과 혁신적인 기술을 담은 신제품들을 지금 만나보세요.',
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200',
    buttonText: '지금 쇼핑하기',
    buttonLink: '#',
  },
  {
    id: 2,
    title: '특별 프로모션',
    subtitle: '이달의 특가 상품',
    description: '한정된 시간 동안 최대 40% 할인된 가격으로 제공됩니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200',
    buttonText: '할인 보러가기',
    buttonLink: '#',
  },
  {
    id: 3,
    title: '회원 전용 혜택',
    subtitle: '가입하고 특별한 혜택을 누리세요',
    description:
      '멤버십 가입 시 첫 구매 15% 할인 및 무료 배송 혜택을 드립니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200',
    buttonText: '가입하기',
    buttonLink: '#',
  },
];

// 팔로잉 피어몰 데이터
export const followingPeermalls = [
  {
    id: 'peermall-1',
    title: '디자인 스튜디오',
    owner: '김디자이너',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=design',
    followers: 1240,
    description: '창의적인 디자인과 브랜딩 서비스를 제공합니다.',
  },
  {
    id: 'peermall-2',
    title: '테크 솔루션',
    owner: '이개발자',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=tech',
    followers: 980,
    description: 'IT 솔루션과 개발 서비스를 전문으로 합니다.',
  },
  {
    id: 'peermall-3',
    title: '유기농 식품점',
    owner: '박농부',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=organic',
    followers: 560,
    description: '건강한 유기농 식품을 직접 농장에서 배송합니다.',
  },
  {
    id: 'peermall-4',
    title: '공예품 공방',
    owner: '정공예가',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=craft',
    followers: 340,
    description: '전통과 현대가 어우러진 수제 공예품을 제작합니다.',
  },
];
