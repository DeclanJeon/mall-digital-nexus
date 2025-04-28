
export interface Quest {
  id: string;
  title: string;
  description: string;
  deadline: string;
  reward: string;
  goal: number;
  progress: number;
  participants?: number;
  type: 'community' | 'individual';
  imageUrl: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  date?: string;
  price?: string;
  likes?: number;
  comments?: number;
  saves?: number;
  views?: number;
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  sourceType?: string;
  rating?: number;
  completion?: number;
  participants?: number;
  maxParticipants?: number;
}

export interface Space {
  id: string;
  title: string;
  imageUrl: string;
  memberCount: number;
  postCount: number;
  isAdult: boolean;
  peopleOnline?: number;
}
