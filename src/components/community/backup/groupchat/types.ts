
// Type definitions for Group Chat components

export interface ChatGroup {
  id: number;
  name: string;
  members: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
  type: 'text' | 'voice' | 'video';
  isActive: boolean;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  avatar: string;
  isMe: boolean;
}

export interface ActiveMember {
  id: number;
  name: string;
  status: string;
  avatar: string;
  isSpeaking: boolean;
  isHost: boolean;
  isMuted: boolean;
}

export interface ScreenShareData {
  id: number;
  userId: number;
  name: string;
  type: string;
}
