import { ReactNode } from 'react';
import { Peermall } from './peermall';

export enum ContentType {
  Article = 'article',
  Course = 'course',
  Event = 'event',
  Product = 'product',
  Resource = 'resource',
  Service = 'service',
  Quest = 'quest',
  Review = 'review',
  Other = 'other',
  Portfolio = 'portfolio',
  Post = 'post',
  Advertisement = 'advertisement',
  Guestbook = 'guestbook',
  Workshop = 'workshop',
  Tool = 'tool',
  Livestream = 'livestream',
  External = 'external',
  Stream = 'stream',
  Challenge = 'challenge',
}

export const CONTENT_TYPES = Object.values(ContentType);

export interface PeerMallConfig {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  type:
    | 'personal'
    | 'business'
    | 'community'
    | 'educational'
    | 'nonprofit'
    | 'other';
  imageUrl?: string;
  bannerUrl?: string;
  visibility?: 'public' | 'partial' | 'private';
  familyMember?: string;
  title: string;
  slogan?: string;
  address?: string;
  profileImage?: string;
  peerNumber: string;
  followers: number;
  recommendations: number;
  badges: string[];
  sections: SectionType[];
  coverImage?: string;
  location?: string | { lat: number; lng: number; address: string };
  contactEmail?: string;
  contactPhone?: string; // phoneNumber를 contactPhone으로 변경
  socialLinks?: Record<string, string>;
  externalUrl?: string; // externalUrl 추가
  categories?: string[]; // categories 추가
  customizations?: {
    primaryColor: string;
    showChat: boolean;
    allowComments: boolean;
    showBadges: boolean;
  };
  themeColor?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    darkMode: boolean;
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  features?: {
    ecommerce: boolean;
    community: boolean;
    learning: boolean;
    events: boolean;
    badges: boolean;
    quests: boolean;
    guestbook: boolean;
    liveStream: boolean;
  };
  stats?: {
    visitors: number;
    followers: number;
    revenue?: number;
    engagement?: number;
    rating?: number;
  };
  settings?: Record<string, unknown>;
  isVerified?: boolean;
  trustScore?: number;
  accountLevel?: string;
  familyGuilds?: Array<{ id: string; name: string; imageUrl: string }>;
  level?: number;
  experience?: number;
  nextLevelExperience?: number;
  completedChallenges?: number;
  activeQuests?: number;
  category?: string;
  status?: string;
  skin?: string;
  tags?: string[];
}

export interface Content {
  id: string;
  peerSpaceAddress: string;
  title: string;
  description: string;
  type: ContentType | string;
  date: string;
  author?: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  status?: string;
  likes: number;
  comments: number;
  views: number;
  saves: number;
  category?: string;
  content?: string;
  price?: number | string;
  tags?: string[];
  location?: string;
  relatedBadges?: string[];
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  media?: unknown[];
  ecosystem?: Record<string, unknown>;
  completion?: number;
  maxParticipants?: number;
  participants?: string[];
  htmlContent?: string;
  rating?: number;
  attributes?: Record<string, unknown>;
  badges?: string[];
  isFeatured?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  imageUrl?: string;
  organizer: string;
  organizerId: string;
  attendees?: string[];
  maxAttendees?: number;
  price?: number | string;
  isOnline: boolean;
  meetingUrl?: string;
  category?: string;
  tags?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  title: string;
  content: string;
  author?: string;
  authorId?: string;
  date: string;
  rating: number;
  likes: number;
  replies: number;
  productId?: string;
  contentId?: string;
  serviceId?: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  tags?: string[];
  userId?: string;
  authorImage?: string;
  source?: string;
  sourceSite?: string;
  userName?: string;
  text?: string;
  peerMall?: { id: string; name: string; address: string };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  type:
    | 'daily'
    | 'weekly'
    | 'achievement'
    | 'challenge'
    | 'tutorial'
    | 'community'
    | 'individual';
  steps: { id: string; description: string; completed: boolean }[];
  progress: number;
  startDate: string;
  endDate?: string;
  completedDate?: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
  xpReward?: number;
  itemReward?: string[];
  badgeReward?: string[];
  status: 'available' | 'in-progress' | 'completed' | 'expired' | 'active';
  prerequisiteQuests?: string[];
  deadline?: string;
  goal?: number;
  participants?: string[];
  maxParticipants?: number;
  completion?: number;
  creator?: string;
  creatorId?: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator' | 'contributor';
  joined: string;
  lastActive?: string;
  level?: number;
  xp?: number;
  badges?: string[];
  followers?: number;
  following?: number;
  socialLinks?: Record<string, string>;
  settings?: {
    notifications: boolean;
    privacy: 'public' | 'private' | 'friends';
    theme: 'light' | 'dark' | 'system';
  };
}

export interface PeerSpaceData {
  id: string;
  address: string;
  name: string;
  title: string;
  description: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  badges: string[];
  followers: number;
  recommendations: number;
  socialLinks?: Record<string, string>;
  contactPhone?: string;
  contactEmail?: string;
  level?: number;
  experience?: number;
  nextLevelExperience?: number;
  achievements?: number;
  completedChallenges?: number;
  activeQuests?: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author?: string;
  authorId?: string;
  authorAvatar?: string;
  date: string;
  likes: number;
  comments: number;
  tags?: string[];
  images?: string[];
  category?: string;
}

export interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  peermall: Peermall | null;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
  activeSection: 'home' | 'content' | 'community' | 'following' | 'guestbook' | 'settings';
  onNavigateToSection: (section: 'home' | 'content' | 'community' | 'following' | 'guestbook' | 'settings') => void;
}

export type SectionType =
  | 'hero'
  | 'content'
  | 'community'
  | 'about'
  | 'products'
  | 'services'
  | 'events'
  | 'reviews'
  | 'contact'
  | 'map'
  | 'guestbook'
  | 'trust'
  | 'featured'
  | 'achievements'
  | 'learning'
  | 'quests'
  | 'infoHub'
  | 'activityFeed'
  | 'relatedMalls'
  | 'liveCollaboration'
  | 'livestream'
  | 'home'
  | 'following'
  | 'settings';
