
import { ReactNode } from 'react';

export interface Planet {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  owner: string;
  createdAt: string;
  members: string[];
  activities: Activity[];
  recentPosts: Post[];
  stage: PlanetStage;
  membersCount: number;
  health: number;
  topics: string[];
  isPrivate?: boolean;
  expiryDate?: string;
  imageUrl?: string;
  iconUrl?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  planetId: string;
  participants: string[];
  createdAt: string;
  lastMessage?: ChatMessage;
  isPublic: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
  reactions?: { [key: string]: string[] };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  date: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  channelId?: string;
  communityId?: string;
  isNotice?: boolean;
  authorAvatar?: string;
  imageUrl?: string;
  richContent?: string;
  processedContent?: string;
  htmlContent?: string;
  viewCount?: number;
  isEdited?: boolean;
  lastEditedAt?: string;
  country?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  timestamp: string;
  details: Record<string, any>;
}

export enum ActivityType {
  Join = 'join',
  Post = 'post',
  Comment = 'comment',
  React = 'react',
  Leave = 'leave',
  CreateRoom = 'create_room',
  ModifySetting = 'modify_setting',
  SendInvite = 'send_invite',
  AcceptInvite = 'accept_invite'
}

export enum PlanetStage {
  New = 'new',
  Growing = 'growing',
  Established = 'established',
  Thriving = 'thriving',
  Declining = 'declining',
  Abandoned = 'abandoned'
}

export interface ForumPostFormData {
  title: string;
  content: string;
  tags: string[];
  channelId?: string;
  htmlContent?: string;
  isNotice?: boolean;
}
