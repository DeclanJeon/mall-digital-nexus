
import { ContentType } from '../types';

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
  price?: number | string;
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
  participants?: string[] | number;
  htmlContent?: string;
  rating?: number;
  attributes?: Record<string, unknown>;
  badges?: string[];
  isFeatured?: boolean; // 추천 콘텐츠 여부
  content?: string; // Add this for compatibility with Post type
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

export interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
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
  color?: string;
  icon?: string | React.ReactNode;
}

export { ContentType } from '../types';
export type { Quest } from '../types';
