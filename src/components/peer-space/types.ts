
import { ReactNode } from 'react';

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
  Challenge = 'challenge'
}

// This is for backward compatibility with existing code
export const CONTENT_TYPES = ContentType;

export interface PeerMallConfig {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  type: 'personal' | 'business' | 'community' | 'educational' | 'nonprofit' | 'other';
  imageUrl?: string;
  bannerUrl?: string;
  
  // Add missing properties used in components
  title: string;
  address?: string;
  profileImage?: string;
  peerNumber: string;
  followers: number;
  recommendations: number;
  badges: string[];
  sections: SectionType[];
  coverImage?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: Record<string, string>;
  customizations?: {
    primaryColor: string;
    showChat: boolean;
    allowComments: boolean;
    showBadges: boolean;
  };
  
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
  settings?: Record<string, any>;
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
  media?: any[];
  ecosystem?: any;
  completion?: number;
  maxParticipants?: number;
  participants?: string[] | number;
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
  author: string;
  authorId: string;
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
  // Add missing properties used in components
  userId?: string;
  authorImage?: string;
  source?: string;
  sourceSite?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  type: 'daily' | 'weekly' | 'achievement' | 'challenge' | 'tutorial' | 'community';
  steps: {
    id: string;
    description: string;
    completed: boolean;
  }[];
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
  // Additional properties found in mockData.ts
  deadline?: string;
  goal?: number;
  participants?: string[] | any[];
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

// Define PeerSpaceData interface for LearningHubTopBar
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
  achievements?: number;
  completedChallenges?: number;
  activeQuests?: number;
}

// Define CommunityPost interface
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

// Define SectionType for PeerSpaceHome
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
  | 'livestream';

