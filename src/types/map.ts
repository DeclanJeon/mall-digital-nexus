export interface StoreReview {
  author: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
  date: string;
  stats: {
    satisfaction: number;
    quality: number;
    service: number;
    valueForMoney: number;
  };
}

// export interface Location {
//   title: string;
//   address: string;
//   reviews?: StoreReview[];
//   phone?: string;
//   isOnline: boolean;
//   email?: string;
//   description?: string;
//   tags?: string[];
//   imageUrl?: string;
//   lat: number;
//   lng: number;
//   peerMallName: string;
//   peerMallKey: string;
// }


export interface MapLocation {
  isFamilyCertified: unknown;
  certified: unknown;
  premiumStats: unknown;
  lat: number;
  lng: number;
  title: string;
  address: string;
  phone: string;
  reviews?: any[];
  id?: string;
  email?: string;
  imageUrl?: string;
  rating?: number;
  followers?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  description?: string;
  tags?: string[];
  trustScore?: number;
  responseTime?: string;
  isOnline?: boolean;
  owner?: string;
  peerMallName?: string;
  peerMallKey?: string;
}