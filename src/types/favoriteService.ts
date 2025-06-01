export interface FavoriteService {
  id: number;
  name: string;
  link: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  domain?: string;
  isInternal?: boolean;
  usageCount?: number;
  lastUsed?: Date;
  addedAt?: Date;
  ogData?: OpenGraphData;
  category?: string; // Add this
  rating?: number; // Add this
  isPopular?: boolean; // Add this
  isTrending?: boolean; // Add this
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
  url?: string;
  favicon?: string;
  themeColor?: string;
}
