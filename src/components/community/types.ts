import { UseFormReturn } from 'react-hook-form';
import {
  ReactNode,
  RefObject,
  MouseEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';

// Planet types
export type PlanetType = 'public' | 'private' | 'timeLimited';

export interface Planet {
  id: string;
  name: string;
  description: string;
  color: string;
  position: [number, number, number]; // [x, y, z]
  size: number;
  activeUsers: number;
  recentPosts: number;
  type: PlanetType;
  topics: string[];
  isPrivate: boolean;
  stage: 'asteroid' | 'planet' | 'star'; // Lifecycle stage of the planet
  owner: {
    name: string;
    avatar: string | null;
  };
  membersCount: number;
  lastActivity: string; // ISO date string
  members: number;
  activities: number;
  health: number;
  createdAt: string; // ISO date string
  expiryDate?: string; // Optional expiry date for time-limited planets
}

// Post types
export interface Post {
  id: string;
  planetId: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  htmlContent?: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  isLikedByCurrentUser?: boolean; // 현재 사용자가 좋아요를 눌렀는지 여부
}

export interface ForumPostFormData {
  title: string;
  content: string;
  tags: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  planetId?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participants: number;
  lastActive?: string;
  isGlobal?: boolean;
  planetId?: string;
  // Additional properties for OpenChatRooms.tsx
  type: 'text' | 'voice' | 'video';
  creator: string;
  timestamp?: Date;
  isPrivate: boolean;
  features: string[];
  participantsCount?: number;
  members?: string[];
  password?: string;
  channelAddress?: string; // 고유 채널 주소 필드 추가
}

// Wizard types
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

// Props interfaces
export interface AppHeaderProps {
  filter: string;
  onFilterChange: (value: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  username: string;
  showBoardView: boolean;
}

export interface PlanetCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlanet: (
    data: Omit<
      Planet,
      | 'id'
      | 'position'
      | 'activeUsers'
      | 'recentPosts'
      | 'stage'
      | 'owner'
      | 'membersCount'
      | 'members'
      | 'activities'
      | 'health'
      | 'createdAt'
    > & { size: number }
  ) => void;
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

export interface UniverseMapProps {
  planets: Planet[];
  activePlanetId?: string | null;
  onPlanetClick: (planet: Planet) => void;
  onPlanetMouseEnter: (planet: Planet) => void;
  onPlanetMouseLeave: () => void;
  isSelectingPosition: boolean;
  onMapInteractionForPosition: (event: MouseEvent<HTMLDivElement>) => void;
  zoomLevel: number;
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
  onMapClickForPosition: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseMoveOnMap: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeaveMap: () => void;
  cursorPositionHint: { x: number; y: number } | null;
  onStartPlanetCreation: () => void;
  onCancelPlanetCreation: () => void;
  universeMapRef: RefObject<HTMLDivElement>;
}

export interface PostFormProps {
  form: UseFormReturn<ForumPostFormData>;
  onSubmit: (data: ForumPostFormData) => void;
  onCancel: () => void;
  editingPost?: Post | null;
}

export interface PostSectionProps {
  posts: Post[];
  username: string;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: Post) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedPost?: Post | null;
  onBackFromDetail?: () => void;
  // ExtendedPostSectionProps에서 onToggleLike를 옵셔널로 처리하므로 여기서는 유지하거나,
  // PostSectionProps 자체에 onToggleLike?: (postId: string) => void; 를 추가할 수 있습니다.
  // 현재 구조상 ExtendedPostSectionProps에서 처리하는 것이 맞습니다.
}

export interface PostListProps {
  posts: Post[];
  username: string;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: Post) => void;
  onToggleLike?: (postId: string) => void; // PostListProps의 onToggleLike를 옵셔널로 변경
  viewMode?: 'list' | 'grid';
}

export interface PostItemProps {
  post: Post;
  isAuthor: boolean;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: Post) => void;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  newMessage: string;
  onNewMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  username: string;
}

export interface BoardHeaderProps {
  selectedLocation: Planet | null;
  onReturnToUniverse: () => void;
  onShowNewPostForm?: () => void;
}

export interface PlanetBoardViewProps {
  activePlanet: Planet | null;
  selectedLocation: Planet | null;
  posts: Post[];
  editingPost: Post | null;
  showNewPostForm: boolean;
  onShowNewPostForm: () => void;
  onHideNewPostForm: () => void;
  forumForm: UseFormReturn<ForumPostFormData>;
  onForumSubmit: (data: ForumPostFormData) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string | number) => void;
  messages: ChatMessage[];
  newMessage: string;
  onNewMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  username: string;
  onReturnToUniverse: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  onViewPostDetail: (post: Post) => void;
  selectedPost?: Post | null;
  onBackFromDetail?: () => void;
  onToggleLikePost?: (postId: string) => void; // 좋아요 토글 콜백 함수를 옵셔널로 변경
}

export interface PostDetailProps {
  post: Post;
  onBack?: () => void;
  onEdit?: (post: Post) => void;
  onDelete?: (id: string | number) => void;
  isAuthor: boolean;
}
