
import { ReactNode } from 'react';
import { PeerMallConfig, Content, Quest, Event, Review } from '../types';

// Re-export types that sections need
export type { 
  PeerMallConfig, 
  Content, 
  Quest, 
  Event, 
  Review
};

// Export BadgeData from here to avoid circular dependencies
export interface BadgeData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements?: string[];
  earnedAt?: string;
  issuer?: string;
  issuerId?: string;
  color?: string;
  icon?: string | React.ReactNode;
}

// Add missing types from the error messages
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  date: string;
  likes: number;
  comments: number;
  tags?: string[];
  images?: string[];
  category?: string;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  message: string;
  date: string;
  isPublic: boolean;
}

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnailUrl: string;
  startTime: string;
  endTime?: string;
  creator: string;
  creatorId: string;
  isLive: boolean;
  viewers: number;
  likes: number;
  category?: string;
  tags?: string[];
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  startDate: string;
  endDate: string;
  advertiser: string;
  advertiserId: string;
  views: number;
  clicks: number;
  placement: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface FeaturedContentSectionProps {
  title?: string;
  content: Content[];
  viewAll?: string;
  maxItems?: number;
  layout?: 'grid' | 'carousel' | 'list';
  isOwner?: boolean;
  onAddContent?: () => void;
  onContentClick?: (content: Content) => void;
}

export interface PeerSpaceReviewSectionProps {
  config: PeerMallConfig;
  isOwner: boolean;
}

export interface PeerSpaceTrustSectionProps {
  config: PeerMallConfig;
}

export interface PeerSpaceCommunityProps {
  config: PeerMallConfig;
}

export interface PeerSpaceEventsProps {
  events: Event[];
}

export interface PeerSpaceContentProps {
  contents: Content[];
  isOwner: boolean;
}

export interface DynamicSectionProps {
  title?: string;
  emptyStateMessage?: string;
  emptyStateDescription?: string;
  icon?: ReactNode;
  children?: ReactNode;
}
