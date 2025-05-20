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

export interface Location {
  lat: number;
  lng: number;
  title: string;
  address: string;
  reviews?: StoreReview[];
  phone?: string;
}
