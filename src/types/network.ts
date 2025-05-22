// 친구 타입
export interface Friend {
  id: string;
  name: string;
  image: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

// 패밀리 멤버 타입
export interface FamilyMember {
  id: string;
  name: string;
  image: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  certified?: boolean;
  description?: string;
}

// 추천인/피추천인 타입
export interface Recommender {
  id: string;
  name: string;
  image: string;
  trustLevel?: number;
  certified?: boolean;
  lastAction?: string;
}

// NetworkSection Props
export interface NetworkSectionProps {
  friends: Friend[];
  followers: { id: string; name: string; image: string }[];
  following: { id: string; name: string; image: string }[];
  recommenders: Recommender[];
  recommendees: Recommender[];
  family: FamilyMember[];
  backupRecommenders: Recommender[];
}
