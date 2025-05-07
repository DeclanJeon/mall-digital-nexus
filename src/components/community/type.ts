import { ReactNode } from 'react';

export type PlanetType = 'public' | 'private' | 'timeLimited';
export type PlanetStage = 'asteroid' | 'planet' | 'gasGiant' | 'star';

export interface PlanetWizardData {
  name: string;
  description: string;
  type: PlanetType;
  topics: string[];
  color: string;
  isPrivate: boolean;
  expiryDate: string;
  topicInput: string;
}

export interface PlanetCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlanet: (wizardData: {
    name: string;
    description: string;
    type: PlanetType;
    topics: string[];
    color: string;
    isPrivate: boolean;
    expiryDate?: string;
    size: number;
    lastActivity: string;
  }) => void;
}

export interface Planet {
  id: string;
  name: string;
  activeUsers: number;
  description: string;
  type: PlanetType;
  stage: PlanetStage;
  color: string;
  position: [number, number, number];
  recentPosts: number;
  membersCount: number;
  expiryDate: string;
  size: number;
  members: number;
  activities: number;
  topics: string[];
  owner: {
    name: string;
    avatar: string;
  };
  health: number; // 0-100
  constellation?: string;
  createdAt: string;
  lastActivity: string;
  isPrivate: boolean;
  texture?: string;
}

export interface Constellation {
  id: string;
  name: string;
  description: string;
  type: 'natural' | 'custom' | 'temporary';
  planets: string[];
  color: string;
  createdAt: string;
  createdBy?: string;
  expireAt?: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  country: string;
  planetId?: string;
  constellationId?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'video';
  description: string;
  creator: string;
  participantsCount: number;
  isPrivate: boolean;
  password?: string;
  features: string[];
  timestamp: Date;
  members?: string[]; // 멤버 목록 추가
}

// Post, ChatMessage, ForumPostFormData interfaces remain the same
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  country: string;
  htmlContent?: string;
}
export interface ForumPostFormData {
  title: string;
  content: string;
  tags: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  htmlContent?: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  planetId: string;
}

export interface GrowthRequirement {
  activityCount: number;
  memberCount: number;
  durationDays: number;
  title: string;
  description: string;
}

export interface TrendingTopic {
  name: string;
  count: number;
  growth: number; // percentage growth in last 24h
}

// 댓글 인터페이스 추가
export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  parentId?: string | null; // 대댓글인 경우 부모 댓글 ID
  replies?: Comment[]; // 대댓글 목록 (클라이언트에서 처리 시)
  likes: number;
}

// 채팅방 생성 시 필요한 데이터
export interface ChatRoomCreationData {
  name: string;
  description?: string;
  type: 'open' | 'group'; // 채팅방 유형 (오픈/그룹)
  privacy: 'public' | 'private'; // 공개/비공개 (오픈 채팅방에만 해당될 수 있음)
  chatMethod: 'text' | 'voice' | 'video'; // 주된 채팅 방식 (방 생성 시 선택)
  planetId?: string; // 특정 행성에 속한 방일 경우
}
