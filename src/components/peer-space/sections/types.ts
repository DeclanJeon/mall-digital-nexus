
import { ReactNode } from 'react';
import { PeerMallConfig, Content, BadgeData, Quest, Event, Review } from '../types';

// Re-export types that sections need
export type { 
  PeerMallConfig, 
  Content, 
  BadgeData,
  Quest, 
  Event, 
  Review
};

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
