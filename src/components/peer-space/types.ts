
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
}
