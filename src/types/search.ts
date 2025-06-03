import { Product } from "./product";

export interface ShoppingFilters {
  categories: string[];
  priceRange: number[];
  rating: number | null;
  status: string[];
  searchQuery: string;
}

export interface SearchFilters {
  categories: string[];
  priceRange: number[];
  rating: number | null;
  status: string[];
  searchQuery: string;
}

