export type ContentType = 'portfolio' | 'service' | 'product' | 'event';

export interface Content {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: ContentType;
  isExternal?: boolean;
  source?: string;
  price?: string;
  date?: string;
  likes: number;
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
}

export interface PeerSpaceData {
  id: string;
  title: string;
  description: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  badges: string[];
  followers: number;
  recommendations: number;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  contactPhone: string;
  contactEmail: string;
  address: string;
}

export interface FeaturedContentSectionProps {
  content: Content[];
  isOwner: boolean;
  onAddContent?: () => void;
  onContentClick?: (content: Content) => void;
}

export interface ContentCardProps {
  content: Content;
  onClick?: () => void;
}

export interface ContentDetailModalProps {
  content: Content;
  peerSpaceData: PeerSpaceData;
  onClose: () => void;
}

export interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: Omit<Content, 'id'>) => void;
}
