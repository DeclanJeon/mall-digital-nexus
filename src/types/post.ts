export interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  channelId?: string;
  communityId?: string;
  isNotice?: boolean;
  imageUrl?: string;
  richContent?: string; // For Toast UI Editor content
  processedContent?: string; // For content with embedded media
  slug?: string; // URL-friendly identifier for the post
  viewCount?: number; // Track number of views
  isEdited?: boolean; // Whether the post has been edited
  lastEditedAt?: string; // When the post was last edited
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  communityId: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
  communityId: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  communityId: string;
  createdBy: string;
  imageUrl?: string;
  location?: string;
  attendeeCount?: number;
  isHighlighted?: boolean;
}
