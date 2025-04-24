
import { LucideIcon } from 'lucide-react';

export type ContentType = 'portfolio' | 'service' | 'product' | 'event' | 'post' | 'review' | 'quest' | 'advertisement' | 'stream' | 'guestbook' | 'course' | 'workshop' | 'challenge' | 'tool';

export interface Content {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: ContentType;
  date?: string;
  price?: string;
  likes?: number;
  comments?: number;
  saves?: number;
  views?: number;
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  sourceType?: string;
  rating?: number;
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
  views: number;
}

export interface Event extends Content {
  location?: string;
  participants: number;
  maxParticipants: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  deadline: string;
  reward: string;
  goal: number;
  progress: number;  // Changed from optional to required
  participants?: number;
  type: 'community' | 'individual';
  imageUrl: string;
}

export interface BadgeData {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color?: string;
}

export interface PeerSpaceData {
  id: string;
  title: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  description: string;
  badges: string[];
  recommendations: number;
  followers: number;
  level: number;
  experience: number;
  achievements: number;
  completedChallenges: number;
  activeQuests: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  category?: string[];
  familyMembership?: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  socialLinks?: { [key: string]: string }; // Added missing property
}

export interface GuestbookEntry {
  id: string;
  author: string;
  content: string;
  date: string;
  authorImage?: string;
}

export interface LiveStream {
  id: string;
  streamer: string;
  title: string;
  viewers: number;
  thumbnailUrl: string;
  isLive: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'banner' | 'card' | 'popup';
  link: string;
  startDate: string;
  endDate: string;
}

// Add missing FeaturedContentSectionProps interface
export interface FeaturedContentSectionProps {
  content: Content[];
  isOwner: boolean;
  onAddContent?: () => void;
  onContentClick?: (content: Content) => void;
}
