import { LucideIcon } from 'lucide-react';

export type ContentType =
  | 'portfolio'
  | 'service'
  | 'product'
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
  | 'external'; // Added 'external' to match the type used in PeerSpaceHome.tsx

export interface PeerMallConfig {
  owner: string;
  title: string;
  description: string;
  followers: number;
  recommendations: number;
  badges: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  sections: SectionType[];
}

export interface PeerSpaceContent {
  id: string;
  peerSpaceAddress: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: ContentType;
  date: string;
  price?: number;
  likes: number;
  comments: number;
  views: number;
  saves: number;
  externalUrl?: string;
  tags?: string[];
  category?: string;
  badges?: string[];
  ecosystem?: {
    manufacturer?: string;
    supplier?: string;
    relatedExperts?: string[];
  };
  attributes?: {
    [key: string]: string | number | boolean;
  };
  createdAt: string;
  updatedAt: string;
  isExternal?: boolean;
  source?: string;
  sourceType?: string;
  rating?: number;
  completion?: number;
  participants?: number;
  maxParticipants?: number;
}

export type SectionType =
  | 'hero'
  | 'content'
  | 'community'
  | 'liveCollaboration'
  | 'livestream'
  | 'infoHub'
  | 'map'
  | 'introduction'
  | 'advertising'
  | 'reviews'
  | 'quests'
  | 'events'
  | 'guestbook'
  | 'trust'
  | 'qrCodeList'
  | 'support'
  | 'relatedMalls'
  | 'activityFeed'
  | 'liveCollaboration';

export interface Content {
  id: string;
  peerSpaceAddress: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: ContentType;
  date: string;
  price?: number;
  likes: number;
  comments: number;
  views: number;
  saves: number;
  externalUrl?: string;
  tags?: string[];
  category?: string;
  badges?: string[];
  ecosystem?: {
    manufacturer?: string;
    supplier?: string;
    relatedExperts?: string[];
  };
  attributes?: {
    [key: string]: string | number | boolean;
  };
  createdAt: string;
  updatedAt: string;
  isExternal?: boolean;
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
  progress: number;
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
  socialLinks?: { [key: string]: string };
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
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

export interface FeaturedContentSectionProps {
  content: Content[];
  isOwner: boolean;
  onAddContent?: () => void;
  onContentClick?: (content: Content) => void;
}

export interface Space {
  id: string;
  title: string;
  imageUrl: string;
  memberCount: number;
  peopleOnline: number;
  postCount: number;
  isAdult: boolean;
}

export interface PeerMallConfig {
  id: string;
  title: string;
  description: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  coverImage?: string;
  badges: string[];
  followers: number;
  recommendations: number;
  level: number;
  experience: number;
  nextLevelExperience: number;
  isVerified?: boolean;
  skin: string;
  sections: SectionType[];
  customizations: {
    primaryColor?: string;
    secondaryColor?: string;
    showChat?: boolean;
    allowComments?: boolean;
    showBadges?: boolean;
    contentDisplayCount?: { [sectionId: string]: number };
  };
  socialLinks?: { [key: string]: string };
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  familyGuilds?: { id: string; name: string; imageUrl: string }[];
  qrCodes?: QRCode[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  achievements?: number;
  completedChallenges?: number;
  activeQuests?: number;
}

export interface QRCode {
  id: string;
  title: string;
  type: 'peerspace' | 'content' | 'event' | 'quest' | 'peernumber';
  url: string;
  imageUrl?: string;
}
