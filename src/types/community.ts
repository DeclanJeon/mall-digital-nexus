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
