
import { ReactNode } from 'react';

export type PlanetType = 'public' | 'private' | 'timeLimited';
export type PlanetStage = 'asteroid' | 'planet' | 'gasGiant' | 'star';

export interface Planet {
  id: string;
  name: string;
  description: string;
  type: PlanetType;
  stage: PlanetStage;
  color: string;
  position: [number, number, number];
  size: number;
  members: number;
  activities: number;
  topics: string[];
  owner: {
    name: string;
    avatar: string;
  };
  health: number; // 0-100
  constellation?: string;
  createdAt: string;
  lastActivity: string;
  isPrivate: boolean;
  texture?: string;
}

export interface Constellation {
  id: string;
  name: string;
  description: string;
  type: 'natural' | 'custom' | 'temporary';
  planets: string[];
  color: string;
  createdAt: string;
  createdBy?: string;
  expireAt?: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  country: string;
  planetId?: string;
  constellationId?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  htmlContent?: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  planetId: string;
}

export interface GrowthRequirement {
  activityCount: number;
  memberCount: number;
  durationDays: number;
  title: string;
  description: string;
}

export interface TrendingTopic {
  name: string;
  count: number;
  growth: number; // percentage growth in last 24h
}
