
export interface Planet {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Channel {
  id: string;
  planetId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Forum {
  id: string;
  planetId: string;
  channelId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  postCount: number;
  lastPostAt?: string;
}

export interface ForumPost {
  id: string;
  forumId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  commentCount: number;
  isPinned: boolean;
  tags: string[];
}

export interface ForumComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
}
