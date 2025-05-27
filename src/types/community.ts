export type ZoneType = 'city' | 'village' | 'zone' | 'personal';
export type ZoneStatus = 'normal' | 'growing' | 'crisis' | 'abandoned';
export type ZonePrivacy = 'public' | 'partial' | 'private' | 'timed';
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
export type ImageType = 'image' | 'gif' | 'video' | 'url';

export interface WeatherData {
  temperature: number;
  weatherType: WeatherType;
  humidity?: number;
  windSpeed?: number; // Make windSpeed optional to match service interface
  cloudCover?: number;
  isDay?: boolean;
  precipitation?: number;
  snowfall?: number;
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  district?: string;
  displayName?: string;
}

// Interface for Community Zone data
export interface CommunityZone {
  id: string;
  name: string;
  type: ZoneType;
  status: ZoneStatus;
  privacy: ZonePrivacy;
  owner: string;
  memberCount: number;
  postCount: number;
  vitalityIndex: number;
  position: { x: number; y: number };
  lastActive: string;
  weather: WeatherType;
  hasEvent: boolean;
  hasSosSignal: boolean;
  weatherData?: WeatherData;
  locationInfo?: LocationInfo;
  description?: string;
  imageUrl?: string;
  imageType?: ImageType;
  emoji?: string;
  isMember?: boolean; // Flag to indicate if the current user is a member of this community
}

// Interface for Community Event data
export interface CommunityMapEvent {
  id: string;
  communityId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  location?: string;
  attendeeCount?: number;
  isHighlighted?: boolean;
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  owner: string;
  createdAt: string;
  members: string[];
  activities: Activity[];
  recentPosts: import('./post').Post[];
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

export type ActivityDetails = {
  [ActivityType.Join]: { planetId: string };
  [ActivityType.Post]: { postId: string; contentPreview: string };
  [ActivityType.Comment]: {
    commentId: string;
    postId: string;
    contentPreview: string;
  };
  [ActivityType.React]: { targetId: string; reactionType: string };
  [ActivityType.Leave]: { planetId: string; reason?: string };
  [ActivityType.CreateRoom]: { roomId: string; roomName: string };
  [ActivityType.ModifySetting]: {
    settingType: string;
    oldValue: string;
    newValue: string;
  };
  [ActivityType.SendInvite]: { inviteeId: string; planetId: string };
  [ActivityType.AcceptInvite]: { inviterId: string; planetId: string };
};

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  timestamp: string;
  details: ActivityDetails[ActivityType];
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
  AcceptInvite = 'accept_invite',
}

export enum PlanetStage {
  New = 'new',
  Growing = 'growing',
  Established = 'established',
  Thriving = 'thriving',
  Declining = 'declining',
  Abandoned = 'abandoned',
}

export interface ForumPostFormData {
  title: string;
  content: string;
  tags: string[];
  channelId?: string;
  htmlContent?: string;
  isNotice?: boolean;
}