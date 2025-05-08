// src/components/community/types.ts
import { UseFormReturn } from 'react-hook-form';

export interface PostFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingPost?: any;
}

export interface PostSectionProps {
  posts: any[];
  username: string;
  onEditPost: (post: any) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: any) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedPost?: any;
  onBackFromDetail?: () => void;
}

export interface PostListProps {
  posts: any[];
  username: string;
  onEditPost: (post: any) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: any) => void;
}

export interface PostItemProps {
  post: any;
  isAuthor: boolean;
  onEditPost: (post: any) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: any) => void;
}

export interface ChatPanelProps {
  messages: any[];
  newMessage: string;
  onNewMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  username: string;
}

export interface BoardHeaderProps {
  selectedLocation: any;
  onReturnToUniverse: () => void;
  onShowNewPostForm: () => void;
}

export interface PlanetBoardViewProps {
  activePlanet: any;
  selectedLocation: any;
  posts: any[];
  editingPost: any;
  showNewPostForm: boolean;
  onShowNewPostForm: () => void;
  onHideNewPostForm: () => void;
  forumForm: any;
  onForumSubmit: (data: any) => void;
  onEditPost: (post: any) => void;
  onDeletePost: (id: string | number) => void;
  messages: any[];
  newMessage: string;
  onNewMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  username: string;
  onReturnToUniverse: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  onViewPostDetail: (post: any) => void;
  selectedPost?: any;
  onBackFromDetail?: () => void;
}
