export type ContentType =
  | 'portfolio'
  | 'service'
  | 'product'
  | 'event'
  | 'course'
  | 'workshop'
  | 'challenge'
  | 'tool';

export interface BaseContent {
  id: string;
  title: string;
  description: string;
}

export interface Content extends BaseContent {
  imageUrl: string;
  type: ContentType;
  isExternal?: boolean;
  source?: string;
  price?: string;
  date?: string;
  likes: number;
  completion?: number;
  participants?: number;
  maxParticipants?: number;
}

export interface Review {
  id: string;
  author: string;
  authorImage: string;
  content: string;
  rating: number;
  date: string;
  source: 'internal' | 'external';
  sourceSite?: string;
  peerMall: {
    id: string;
    name: string;
    address: string;
  };
}

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  date: string;
  comments: number;
  likes: number;
}

export interface Quest extends BaseContent {
  reward: string;
  progress: number;
  deadline: string;
  likes?: number;
}

export function isContent(item: BaseContent): item is Content {
  return 'type' in item;
}

export function isQuest(item: BaseContent): item is Quest {
  return 'reward' in item;
}

export interface PeerSpaceData {
  id: string;
  title: string;
  description: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  badges: string[];
  followers: number;
  recommendations: number;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  contactPhone: string;
  contactEmail: string;
  address: string;
  level: number;
  experience: number;
  achievements: number;
  completedChallenges: number;
  activeQuests: number;
}

export interface FeaturedContentSectionProps {
  content: Content[];
  isOwner: boolean;
  onAddContent?: () => void;
  onContentClick?: (content: Content) => void;
}

export interface ContentCardProps {
  content: Content;
  onClick?: () => void;
}

export interface ContentDetailModalProps {
  content: Content;
  peerSpaceData: PeerSpaceData;
  onClose: () => void;
}

export interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: Omit<Content, 'id'>) => void;
}
