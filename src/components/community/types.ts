// src/components/community/types.ts
import React, { ReactNode } from 'react'; // ReactNode 추가

// --- 기본 엔티티 타입 ---
export type PlanetType = 'public' | 'private' | 'timeLimited';
export type PlanetStage = 'asteroid' | 'planet' | 'gasGiant' | 'star';

export interface User {
  // User 인터페이스가 명시적으로 없어 추가 (Planet의 owner 등에서 사용)
  name: string;
  avatar: string | null; // avatar URL 또는 null
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  color: string;
  position: [number, number, number];
  size: number;
  activeUsers: number;
  recentPosts: number;
  type: PlanetType;
  stage: PlanetStage;
  topics: string[];
  isPrivate: boolean; // type 'private'와 중복될 수 있으나, 명시적으로 유지
  owner: User; // User 타입 사용
  membersCount: number;
  lastActivity: string; // ISO Date string
  expiryDate?: string; // ISO Date string, for timeLimited planets
  createdAt: string; // ISO Date string
  health: number; // 0-100
  constellation?: string; // 별자리 ID
  texture?: string; // 행성 텍스처 이미지 URL 등
  // 아래 필드들은 initialPlanetsData에 있었으나, 실제 사용처가 명확하지 않으면 제거 고려
  members: number; // membersCount와 기능적으로 유사할 수 있음
  activities: number;
}

export interface Constellation {
  id: string;
  name: string;
  description: string;
  type: 'natural' | 'custom' | 'temporary';
  planets: string[]; // 행성 ID 목록
  color: string; // 별자리 대표 색상
  createdAt: string; // ISO Date string
  createdBy?: string; // 생성자 User ID 또는 이름
  expireAt?: string; // ISO Date string, 임시 별자리의 경우
}

export interface Post {
  // 기존 Post와 ForumPost 통합
  id: string;
  planetId: string; // 어느 행성의 게시물인지 식별
  title: string;
  content: string; // Markdown or plain text
  htmlContent?: string; // Rendered HTML
  author: string; // User name
  authorAvatar: string; // User avatar URL
  date: string; // 단순 날짜 문자열 또는 ISO Date string
  likes: number;
  comments: number; // 댓글 수 (실제 Comment 배열 길이나 서버 카운트)
  tags: string[];
  country?: string; // 작성자 국가 (선택적)
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  parentId?: string | null;
  replies?: Comment[];
  likes: number;
}

export interface ChatMessage {
  id: string;
  author: string; // User name
  authorAvatar: string; // User avatar URL
  content: string;
  timestamp: string; // HH:MM 형식 등
  country?: string; // 작성자 국가 (선택적)
  planetId?: string; // 메시지가 속한 행성 ID
  constellationId?: string; // 메시지가 속한 별자리 ID
  roomId?: string; // 특정 채팅방 ID
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'video'; // 주된 통신 방식
  description: string;
  creator: string; // User name 또는 ID
  participantsCount: number;
  isPrivate: boolean;
  password?: string; // 비공개 방의 경우
  features: string[]; // 예: "screen_sharing", "file_transfer"
  timestamp: Date; // 생성 시간 (Date 객체)
  members?: string[]; // 참여 중인 User name 또는 ID 목록
  planetId?: string; // 행성 소속 채팅방일 경우
}

// --- 폼 데이터 타입 ---
export interface ForumPostFormData {
  title: string;
  content: string;
  tags: string; // 쉼표로 구분된 문자열
}

export interface PlanetWizardData {
  // 행성 생성 마법사 내부 상태용
  name: string;
  description: string;
  type: PlanetType;
  topics: string[];
  color: string;
  isPrivate: boolean;
  expiryDate: string; // 마법사 내에서는 string으로 관리, 생성 시 date 객체로 변환하거나 ISO string으로
  topicInput: string;
}

export interface ChatRoomCreationData {
  name: string;
  description?: string;
  type: 'open' | 'group'; // 채팅방 유형 (오픈/그룹)
  privacy: 'public' | 'private'; // 공개/비공개 (오픈 채팅방에만 해당될 수 있음)
  chatMethod: 'text' | 'voice' | 'video'; // 주된 채팅 방식 (방 생성 시 선택)
  planetId?: string; // 특정 행성에 속한 방일 경우
  password?: string; // 비공개 방의 경우
}

// --- 기타 커뮤니티 관련 타입 ---
export interface GrowthRequirement {
  activityCount: number;
  memberCount: number;
  durationDays: number; // 행성 유지 기간 등
  title: string; // 성장 목표 제목
  description: string; // 성장 목표 설명
}

export interface TrendingTopic {
  name: string; // 토픽 이름
  count: number; // 언급 횟수 또는 관련 게시물 수
  growth: number; // 최근 24시간 성장률 (%)
}

// --- 컴포넌트 Props 타입 ---
// (이전 리팩토링에서 정의한 Props들은 여기에 유지 및 필요시 업데이트)

export interface PlanetCreationWizardProps {
  // 마법사 컴포넌트용 Props
  isOpen: boolean;
  onClose: () => void;
  onCreatePlanet: (data: {
    // 마법사에서 최종적으로 생성할 행성 데이터 구조
    name: string;
    description: string;
    type: PlanetType;
    topics: string[];
    color: string;
    isPrivate: boolean;
    expiryDate?: string; // ISO string
    size: number; // 행성 크기 (마법사 외부에서 결정될 수도 있음)
    lastActivity: string; // 생성 시점
  }) => void;
}

export interface AppHeaderProps {
  filter: string;
  onFilterChange: (value: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  username: string;
  showBoardView: boolean;
}

export interface UniverseMapProps {
  planets: Planet[];
  activePlanetId: string | null;
  onPlanetClick: (planet: Planet) => void;
  onPlanetMouseEnter: (planet: Planet) => void;
  onPlanetMouseLeave: () => void;
  isSelectingPosition: boolean;
  onMapInteractionForPosition: (
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
  zoomLevel: number;
}

export interface PlanetInfoPanelProps {
  planet: Planet | null;
}

export interface UniverseControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  isSelectingPosition: boolean;
  onStartPlanetCreation: () => void;
  onCancelPlanetCreation: () => void;
}

export interface UniverseViewProps {
  planets: Planet[];
  activePlanet: Planet | null;
  onPlanetClick: (planet: Planet) => void;
  onPlanetMouseEnter: (planet: Planet) => void;
  onPlanetMouseLeave: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isSelectingPosition: boolean;
  onMapClickForPosition: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMoveOnMap: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeaveMap: () => void;
  cursorPositionHint: { x: number; y: number } | null;
  onStartPlanetCreation: () => void;
  onCancelPlanetCreation: () => void;
  universeMapRef: React.RefObject<HTMLDivElement>;
}

export interface BoardHeaderProps {
  selectedLocation: string;
  onReturnToUniverse: () => void;
  onShowNewPostForm: () => void;
}

export interface PostListProps {
  posts: Post[]; // 업데이트된 Post 타입 사용
  username: string;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onViewPostDetail: (post: Post) => void;
}

export interface PostItemProps {
  post: Post; // 업데이트된 Post 타입 사용
  isAuthor: boolean;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onViewPostDetail: (post: Post) => void;
}

export interface PostSectionProps {
  posts: Post[]; // 업데이트된 Post 타입 사용
  username: string;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onViewPostDetail: (post: Post) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

import { UseFormReturn } from 'react-hook-form';

export interface PostFormProps {
  form: UseFormReturn<ForumPostFormData>;
  onSubmit: (data: ForumPostFormData) => void;
  onCancel: () => void;
  editingPost: Post | null;
}

export interface ChatPanelProps {
  messages: ChatMessage[]; // 업데이트된 ChatMessage 타입 사용
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  username: string;
  currentPlanetId?: string; // 현재 보고 있는 행성 ID (행성 채팅용)
  currentConstellationId?: string; // 현재 보고 있는 별자리 ID (별자리 채팅용)
}

export interface PlanetBoardViewProps {
  activePlanet: Planet; // null이 아님을 보장
  selectedLocation: string;
  posts: Post[]; // 업데이트된 Post 타입 사용
  editingPost: Post | null; // 업데이트된 Post 타입 사용
  showNewPostForm: boolean;
  onShowNewPostForm: () => void;
  onHideNewPostForm: () => void;
  forumForm: UseFormReturn<ForumPostFormData>;
  onForumSubmit: (data: ForumPostFormData) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  messages: ChatMessage[]; // 업데이트된 ChatMessage 타입 사용
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  username: string;
  onReturnToUniverse: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onViewPostDetail: (post: Post) => void;
}
