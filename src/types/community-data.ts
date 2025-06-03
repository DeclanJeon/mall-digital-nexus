export interface Category {
  label: string;
  value: string;
}

export interface FeaturedPost {
  id: number;
  title: string;
  thumb: string;
  summary: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
}

export interface Post {
  id: number;
  title: string;
  thumb: string;
  summary: string;
  author: string;
  category: string;
  likes: number;
  comments: number;
  date: string;
}

export interface RecommendedPost {
  id: number;
  title: string;
  author: string;
  likes: number;
  comments: number;
  thumb: string;
  label: string;
}

export interface SubRisingPost {
  id: number;
  title: string;
  thumb: string;
}

export interface SubsRising {
  name: string;
  desc: string;
  subs: number;
  rising: number;
  posts: SubRisingPost[];
  page: number;
  total: number;
}
