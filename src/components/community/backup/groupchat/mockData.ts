
import { ChatGroup, Message, ActiveMember, ScreenShareData } from './types';

// Mock chat groups data
export const MOCK_CHAT_GROUPS: ChatGroup[] = [
  {
    id: 1,
    name: "일반 채팅",
    members: ["사용자1", "사용자2", "사용자3"],
    lastMessage: "안녕하세요!",
    lastMessageTime: "1시간 전",
    unreadCount: 2,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group1",
    type: "text",
    isActive: true
  },
  {
    id: 2,
    name: "음성 채널",
    members: ["사용자4", "사용자5"],
    lastMessage: "음성 채팅 채널입니다",
    lastMessageTime: "30분 전",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group2",
    type: "voice",
    isActive: true
  },
  {
    id: 3,
    name: "비디오 회의",
    members: ["사용자6", "사용자7", "사용자8"],
    lastMessage: "곧 회의가 시작됩니다",
    lastMessageTime: "방금",
    unreadCount: 1,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group3",
    type: "video",
    isActive: false
  }
];

// Mock messages data
export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "김민수",
    content: "안녕하세요! 새로운 프로젝트에 관해 이야기해봐요.",
    time: "10:30",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 2,
    sender: "이지은",
    content: "좋은 생각이네요! 어떤 프로젝트를 생각하고 계신가요?",
    time: "10:32",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
    isMe: false
  },
  {
    id: 3,
    sender: "익명 사용자",
    content: "저는 새로운 커뮤니티 기능을 생각하고 있어요.",
    time: "10:35",
    avatar: "",
    isMe: true
  }
];

// Mock active members data
export const ACTIVE_MEMBERS: ActiveMember[] = [
  {
    id: 1,
    name: "김호스트",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=host",
    isSpeaking: true,
    isHost: true,
    isMuted: false
  },
  {
    id: 2,
    name: "박참여자",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=member1",
    isSpeaking: false,
    isHost: false,
    isMuted: true
  },
  {
    id: 3,
    name: "최참여자",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=member2",
    isSpeaking: false,
    isHost: false,
    isMuted: false
  }
];

// Mock screen share data
export const SCREEN_SHARES: ScreenShareData[] = [
  {
    id: 1,
    userId: 1,
    name: "김호스트의 화면 공유",
    type: "screen"
  }
];
