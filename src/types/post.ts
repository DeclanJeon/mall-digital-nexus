export interface Post {
  id: string;
  name: string;
  title: string;
  author: string;
  date: string;
  type: string;
  content: string; // Markdown 요약본 또는 일반 텍스트 내용 (렌더링 시 주의)
  description: string;
  likes: number;
  comments: number;
  tags: string[];
  channelId?: string;
  channelType?: string;
  communityId?: string;
  isNotice?: boolean;
  isPinned?: boolean;
  imageUrl?: string;
  postRichContent?: string; // HTML 전체 내용 (상세 보기용)
  processedContent?: string; // For content with embedded media
  slug?: string; // URL-friendly identifier for the post
  viewCount?: number; // Track number of views
  isEdited?: boolean; // Whether the post has been edited
  lastEditedAt?: string; // When the post was last edited
  peerMallName: string;
  peerMallKey: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  communityId: string;
  color?: string;
}

export interface Comment {
  id: string;
  name: string;
  postId: string;
  author: string; // 닉네임 또는 이메일 아이디
  content: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  isAnonymous: boolean; // 익명 여부
}

export interface Member {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
  communityId: string;
}
