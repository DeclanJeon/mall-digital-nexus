export type ContentType = 'event' | 'product' | 'service';

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

export interface FeaturedContentSectionProps {
  content: Content[];
  isOwner: boolean;
  onAddContent?: () => void;
  onContentClick?: (content: Content) => void;
}
