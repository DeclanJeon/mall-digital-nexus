import { Content, Review, CommunityPost, PeerSpaceData, Quest } from './types';

export const learningHubData: PeerSpaceData = {
  id: 'myspace123',
  title: '게이미피케이션 학습 공간',
  description: '지속적인 도전과 피드백을 통한 효과적인 학습 환경',
  owner: '김피어',
  peerNumber: 'P-12345-6789',
  profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser',
  badges: ['교육전문가', '상위 10% 활동가', '게이미피케이션 마스터'],
  followers: 328,
  recommendations: 145,
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
  },
  contactPhone: '02-123-4567',
  contactEmail: 'contact@peermall.com',
  address: '서울시 강남구 테헤란로 123',
  level: 10,
  experience: 50,
  achievements: 5,
  completedChallenges: 8,
  activeQuests: 2,
};

export const peerSpaceData: PeerSpaceData = {
  id: 'myspace123',
  title: '게이미피케이션 학습 공간',
  description: '지속적인 도전과 피드백을 통한 효과적인 학습 환경',
  owner: '김피어',
  peerNumber: 'P-12345-6789',
  profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser',
  badges: ['교육전문가', '상위 10% 활동가', '게이미피케이션 마스터'],
  followers: 328,
  recommendations: 145,
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
  },
  contactPhone: '02-123-4567',
  contactEmail: 'contact@peermall.com',
  address: '서울시 강남구 테헤란로 123',
  level: 18,
  experience: 75,
  achievements: 28,
  completedChallenges: 42,
  activeQuests: 3,
};

export const featuredContent: Content[] = [
  {
    id: 'content1',
    title: '효과적인 학습 방법론',
    description: '게임 메커니즘을 활용한 지속적 학습 동기 부여 기법',
    imageUrl:
      'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80',
    type: 'post',  // Changed from 'course' to 'post'
    date: '2일 전',
    likes: 124,
    isExternal: false,
    completion: 68,
  },
  {
    id: 'content2',
    title: '인터랙티브 학습 워크샵',
    description: '실시간 피드백을 통한 체험형 교육 방식 학습하기',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80',
    type: 'event',  // Changed from 'workshop' to 'event'
    price: '150,000원~',
    date: '2025년 5월 15일',
    likes: 85,
    isExternal: false,
    participants: 24,
    maxParticipants: 30,
  },
  {
    id: 'content3',
    title: '학습 몰입도 향상 챌린지',
    description: '21일 동안 진행되는 학습 습관 형성 프로그램',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
    type: 'quest',  // Changed from 'challenge' to 'quest'
    date: '진행중 (12일 남음)',
    price: '무료',
    likes: 212,
    isExternal: false,
    participants: 156,
  },
  {
    id: 'content4',
    title: '교육용 게임 디자인 도구',
    description: '게임 요소를 활용한 맞춤형 교육 콘텐츠 제작 솔루션',
    imageUrl:
      'https://images.unsplash.com/photo-1559336197-ded8aaa244bc?auto=format&fit=crop&q=80',
    type: 'product',  // Changed from 'tool' to 'product'
    price: '300,000원',
    date: '',
    likes: 78,
    isExternal: true,
    source: 'edutools.com',
  },
];

export const activeQuests: Quest[] = [
  {
    id: 'quest1',
    title: '첫 학습 커뮤니티 만들기',
    description: '최소 5명 이상의 멤버와 함께하는 학습 그룹 생성하기',
    reward: '경험치 200 + 협력 뱃지',
    progress: 60,
    deadline: '4일 남음',
    goal: 100,
    type: 'community',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    participants: 12
  },
  {
    id: 'quest2',
    title: '교육 콘텐츠 3개 제작',
    description: '다른 사용자들과 공유할 수 있는 교육 자료 만들기',
    reward: '경험치 350 + 콘텐츠 크리에이터 칭호',
    progress: 33,
    deadline: '7일 남음',
    goal: 3,
    type: 'individual',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
    participants: 1
  },
  {
    id: 'quest3',
    title: '피드백 마스터',
    description: '10개 이상의 학습 콘텐츠에 건설적인 피드백 남기기',
    reward: '경험치 150 + 멘토 포인트 50',
    progress: 90,
    deadline: '오늘까지',
    goal: 10,
    type: 'individual',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    participants: 8
  },
];

// Keep the rest of the mockData.ts file unchanged
export const achievements = [
  {
    id: 'ach1',
    name: '지식 공유왕',
    icon: '🏆',
    description: '50개 이상의 콘텐츠 제작',
    unlocked: true,
  },
  {
    id: 'ach2',
    name: '꾸준한 학습자',
    icon: '⏱️',
    description: '30일 연속 접속',
    unlocked: true,
  },
  {
    id: 'ach3',
    name: '토론의 달인',
    icon: '💬',
    description: '100개 이상의 토론 참여',
    unlocked: true,
  },
  {
    id: 'ach4',
    name: '협업 전문가',
    icon: '🤝',
    description: '10개 이상의 그룹 프로젝트 완료',
    unlocked: false,
  },
];

export const learningPaths = [
  {
    id: 'path1',
    title: '게이미피케이션 전문가 과정',
    progress: 68,
    steps: 12,
    completedSteps: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80',
  },
  {
    id: 'path2',
    title: '교육 콘텐츠 제작 마스터',
    progress: 35,
    steps: 10,
    completedSteps: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&q=80',
  },
  {
    id: 'path3',
    title: '학습 커뮤니티 리더십',
    progress: 10,
    steps: 8,
    completedSteps: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80',
  },
];

export const communityActivities = [
  {
    id: 'activity1',
    user: '이지원',
    userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jiwon',
    action: '새로운 챌린지를 완료했습니다',
    target: '21일 학습 습관 형성하기',
    time: '1시간 전',
    icon: 'trophy',
  },
  {
    id: 'activity2',
    user: '박준호',
    userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Junho',
    action: '질문을 남겼습니다',
    target: '게이미피케이션 요소를 어떻게 잘 적용할 수 있을까요?',
    time: '3시간 전',
    icon: 'message',
  },
  {
    id: 'activity3',
    user: '김미나',
    userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Mina',
    action: '새로운 학습 콘텐츠를 공유했습니다',
    target: '효과적인 피드백 기법 워크숍',
    time: '어제',
    icon: 'share',
  },
];
