
// components/peer-space/types.ts
export type ContentType = 
  | 'product'
  | 'portfolio' 
  | 'service' 
  | 'event' 
  | 'post' 
  | 'review'
  | 'quest'
  | 'advertisement'
  | 'stream'
  | 'guestbook'
  | 'course'
  | 'workshop'
  | 'challenge'
  | 'tool'
  | 'external';  // Ensuring 'external' is included in ContentType

export interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export interface ContentMedia {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
}

export interface ContentEcosystem {
  relatedContents?: string[];
  sourceContents?: string[];
  derivedContents?: string[];
  collaborators?: ContentAuthor[];
  partners?: string[];
}

export interface Content {
  id: string;
  peerSpaceAddress: string;
  title: string;
  description: string;
  type: ContentType;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  authorId?: string;
  imageUrl?: string;
  status?: string;
  likes: number;
  comments: number;
  views: number;
  saves: number;
  category?: string;
  price?: number;
  tags?: string[];
  location?: string;
  relatedBadges?: string[];
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  media?: ContentMedia[];
  ecosystem?: ContentEcosystem;
  completion?: number;
  maxParticipants?: number;
  participants?: string[];
  htmlContent?: string; // HTML 콘텐츠 (Toast UI Editor 용)
  rating?: number; // Added for components referencing this property
}

// Additional type definitions needed by other components
export interface PeerMallConfig {
  id: string;
  address: string;
  name: string;
  description: string;
  logo?: string;
  bannerImage?: string;
  owner: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  category: string;
  tags: string[];
  themeColor: string;
  sections: SectionType[];
  socialLinks?: { [key: string]: string };
  establishedDate?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface PeerSpaceData {
  id: string;
  address: string;
  name: string;
  description: string;
  owner: string;
  level?: number;
  experience?: number;
  achievements?: number;
  memberCount?: number;
}

export interface Review {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  images?: string[];
  verified: boolean;
}

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

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  reward: string;
  rewardAmount?: number;
  participants: string[];
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming' | 'canceled';
  completion: number;
  creator: string;
  creatorId: string;
  imageUrl?: string;
  requirements?: string[];
  steps?: { title: string; description: string; completed: boolean }[];
  category?: string;
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  organizer: string;
  organizerId: string;
  maxParticipants?: number;
  participants: string[];
  price?: number;
  category?: string;
  tags?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
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
}

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'products' 
  | 'services' 
  | 'events' 
  | 'community' 
  | 'reviews' 
  | 'contact'
  | 'map'
  | 'guestbook'
  | 'trust'
  | 'featured'
  | 'achievements'
  | 'learning'
  | 'quests';

export interface FeaturedContentSectionProps {
  title: string;
  content: Content[];
  viewAll?: string;
  maxItems?: number;
  layout?: 'grid' | 'carousel' | 'list';
}
