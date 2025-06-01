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
