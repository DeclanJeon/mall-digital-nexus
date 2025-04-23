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
  saves?: number;
  comments?: number;
  views?: number;
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
  likes?: number;
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
  views?: number;
}

export interface Quest extends BaseContent {
  reward: string;
  progress: number;
  goal: number;
  participants?: number;
  deadline: string;
  type: 'individual' | 'community';
  imageUrl: string;
  likes?: number;
}

export interface Event extends Content {
  location: string;
  deadline?: string;
  type: 'event';
}

export interface BadgeData {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color?: string;
}

export function isContent(item: BaseContent): item is Content {
  return 'type' in item;
}

export function isQuest(item: BaseContent): item is Quest {
  return 'reward' in item && 'progress' in item;
}

export function isEvent(item: BaseContent): item is Event {
  return 'type' in item && item.type === 'event' && 'location' in item;
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
