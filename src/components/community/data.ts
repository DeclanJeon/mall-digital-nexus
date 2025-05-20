
import { Planet, Post, ChatRoom, ActivityType, PlanetStage } from './types';

// Initial data for planets
export const initialPlanetsData: Planet[] = [
  {
    id: 'planet-1',
    name: '디자인 허브',
    description: '디자인과 UX에 관심있는 사람들의 모임',
    position: { x: 10, y: 20, z: 0 },
    owner: 'admin',
    createdAt: new Date().toISOString(),
    members: ['admin', 'user1', 'user2'],
    activities: [
      {
        id: 'act-1',
        type: ActivityType.Join,
        userId: 'user1',
        userName: '김디자인',
        timestamp: new Date().toISOString(),
        details: { message: '커뮤니티에 참여했습니다.' }
      }
    ],
    recentPosts: [],
    stage: PlanetStage.Growing,
    membersCount: 3,
    health: 85,
    topics: ['디자인', 'UX', 'UI', '그래픽디자인'],
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=design'
  },
  {
    id: 'planet-2',
    name: '개발자 연합',
    description: '코딩과 개발에 관심있는 모든 개발자들의 공간',
    position: { x: -20, y: 10, z: 0 },
    owner: 'admin',
    createdAt: new Date().toISOString(),
    members: ['admin', 'user3', 'user4'],
    activities: [
      {
        id: 'act-2',
        type: ActivityType.Post,
        userId: 'user3',
        userName: '이개발',
        timestamp: new Date().toISOString(),
        details: { postId: 'post-1', title: '자바스크립트 팁 공유' }
      }
    ],
    recentPosts: [],
    stage: PlanetStage.Established,
    membersCount: 3,
    health: 95,
    topics: ['웹개발', '앱개발', '프로그래밍', '코딩'],
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=dev'
  },
  {
    id: 'planet-3',
    name: '푸드 커뮤니티',
    description: '요리와 음식에 관한 모든 이야기',
    position: { x: 15, y: -15, z: 0 },
    owner: 'user5',
    createdAt: new Date().toISOString(),
    members: ['user5', 'user6'],
    activities: [],
    recentPosts: [],
    stage: PlanetStage.New,
    membersCount: 2,
    health: 70,
    topics: ['요리', '레시피', '음식', '맛집'],
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=food'
  }
];

// Initial posts
export const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: '자바스크립트 팁 공유',
    content: '오늘은 자바스크립트에서 유용하게 사용할 수 있는 팁들을 공유합니다.',
    author: '이개발',
    authorId: 'user3',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    likes: 5,
    comments: 2,
    tags: ['javascript', '웹개발', '팁'],
    channelId: 'channel-dev',
    communityId: 'planet-2',
    isNotice: false,
    authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dev',
    country: 'kr'
  },
  {
    id: 'post-2',
    title: 'UI 디자인 트렌드 2025',
    content: '2025년에 주목해야 할 UI 디자인 트렌드를 알아봅시다.',
    author: '김디자인',
    authorId: 'user1',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    likes: 10,
    comments: 3,
    tags: ['디자인', 'UI', '트렌드'],
    channelId: 'channel-design',
    communityId: 'planet-1',
    isNotice: true,
    authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=design',
    country: 'kr'
  }
];

// Initial chat rooms
export const initialChatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    name: '디자인 일반 채팅',
    planetId: 'planet-1',
    participants: ['admin', 'user1', 'user2'],
    createdAt: new Date().toISOString(),
    isPublic: true
  },
  {
    id: 'room-2',
    name: '개발자 일반 채팅',
    planetId: 'planet-2',
    participants: ['admin', 'user3', 'user4'],
    createdAt: new Date().toISOString(),
    isPublic: true
  }
];
