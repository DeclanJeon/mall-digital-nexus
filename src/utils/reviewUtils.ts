
import { Review } from '@/components/peer-space/types';

/**
 * Calculate the average rating from an array of reviews
 */
export const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};
