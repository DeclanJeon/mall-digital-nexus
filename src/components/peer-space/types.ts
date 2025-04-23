
import { LucideIcon } from 'lucide-react';

export type ContentType = 'portfolio' | 'service' | 'product' | 'event' | 'post' | 'review' | 'quest';

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
  progress?: number;
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
  badges: string[];
  recommendations: number;
  followers: number;
}
