// 친구 요청 상태 타입
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | 'received' | 'none';

// 친구 타입
export interface Friend {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
  requestStatus?: FriendRequestStatus;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ReceivedFriendRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    image?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// 패밀리 멤버 타입
export interface FamilyMember {
  id: string;
  name: string;
  image: string;
  peerId?: string; // 피어 ID
  authorizedMalls?: Array<{
    id: number;
    name: string;
    url: string;
    certified: boolean;
  }>;
  operatedMalls?: Array<{
    id: number;
    name: string;
    url: string;
  }>;
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

// 추천인 요청 타입
export interface RecommenderRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

// 검색 결과 타입
export interface SearchResult {
  id: string;
  peerId: string;
  name: string;
  image?: string;
  isAlreadyRecommender: boolean;
  isAlreadyBackup: boolean;
  hasPendingRequest: boolean;
}

// NetworkSection Props
export interface NetworkSectionProps {
  friends: Friend[];
  followers: Array<{ id: string; name: string; image: string }>;
  following: Array<{ id: string; name: string; image: string }>;
  recommenders: Recommender[];
  recommendees: Recommender[];
  family: FamilyMember[];
  backupRecommenders: Recommender[];
  recommenderRequests?: RecommenderRequest[];
}

export interface RecommenderRequestDetails {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'on_hold';
  createdAt: string;
  updatedAt: string;
  message?: string; // 요청 메시지
  requestReason?: string; // 요청 이유
  user: {
    id: string;
    name: string;
    image?: string;
    peerId?: string;
    trustScore?: number; // 신뢰도 점수
    currentRecommenders?: number; // 현재 추천인 수
    networkHealth?: 'high' | 'medium' | 'low'; // 네트워크 건강성
    commonConnections?: number; // 공통 연결 수
    connectionLevel?: number; // 연결 단계
    recentActivity?: string; // 최근 활동
    warningFlags?: string[]; // 경고 플래그들
  };
  reviewData?: {
    requestCount24h?: number; // 24시간 내 요청 수
    duplicateNetworkWarning?: boolean; // 네트워크 중복 경고
    trustScoreDetails?: {
      average: number;
      range: string;
    };
  };
}

export interface RecommenderRequestAction {
  type: 'accept' | 'reject' | 'hold' | 'conditional_accept';
  conditions?: {
    roleScope?: string[]; // 추천인 역할 범위
    supportTypes?: string[]; // 지원 가능한 유형들
    contactHours?: string; // 연락 가능 시간
    duration?: string; // 추천인 역할 기간
    emergencyContact?: boolean; // 긴급 연락 지원 여부
    passwordRecovery?: boolean; // 비밀번호 복구 지원 여부
  };
  reason?: string; // 거부/보류 사유
  message?: string; // 추가 메시지
  reviewPeriod?: number; // 검토 기간 (일)
}