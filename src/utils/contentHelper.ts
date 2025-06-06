import { Review } from '@/components/peer-space/types';

interface ReviewHelperOptions {
  includeImages?: boolean;
  includeAuthorInfo?: boolean;
  formatDate?: boolean;
}

// Generate a dummy review for testing
export const generateDummyReview = (overrides?: Partial<Review>): Review => {
  const id = `review-${Math.floor(Math.random() * 10000)}`;
  
  return {
    id,
    title: overrides?.title || "Great experience with this product!",
    content: overrides?.content || "I really enjoyed using this product. It exceeded my expectations in many ways...",
    author: overrides?.author || "Jane Doe",
    authorId: overrides?.authorId || `user-${Math.floor(Math.random() * 10000)}`,
    date: overrides?.date || new Date().toISOString(),
    rating: overrides?.rating || 4.5,
    likes: overrides?.likes || Math.floor(Math.random() * 50),
    replies: overrides?.replies || Math.floor(Math.random() * 10),
    verified: overrides?.verified !== undefined ? overrides.verified : true,
    helpful: overrides?.helpful || Math.floor(Math.random() * 30),
    images: overrides?.images || [],
    // Add the userName and text properties to match what's used in the components
    userName: overrides?.userName || overrides?.author || "Jane Doe",
    text: overrides?.text || overrides?.content || "I really enjoyed using this product. It exceeded my expectations in many ways...",
    ...overrides
  };
};

/**
 * Generates random reviews for a content item
 * This is used for demonstration purposes only
 */
export const generateRandomReviews = (contentId: string, count: number = 5): Review[] => {
  const names = [
    '김지민', '이현우', '박서연', '정민준', '최예은',
    '강도현', '윤서현', '조하은', '손지호', '나은채'
  ];
  
  const reviewContents = [
    '정말 마음에 들어요! 추천합니다.',
    '기대했던 것보다 훨씬 좋네요. 만족스럽습니다.',
    '가격 대비 성능이 좋습니다. 다른 분들께도 추천하고 싶어요.',
    '배송도 빠르고 품질도 좋습니다. 잘 사용하고 있어요.',
    '디자인이 정말 마음에 들어요. 기능도 편리합니다.',
    '처음에는 고민했지만 구매하길 잘했어요. 만족합니다!',
    '사용해보니 생각보다 더 유용하네요. 좋은 제품입니다.',
    '품질이 생각보다 좋아서 놀랐어요. 추천합니다.',
    '이 가격에 이 정도 품질이면 정말 가성비 좋은 것 같아요.',
    '오래 고민하다 구매했는데, 정말 잘한 선택이었습니다.'
  ];
  
  const reviews: Review[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomNameIndex = Math.floor(Math.random() * names.length);
    const randomContentIndex = Math.floor(Math.random() * reviewContents.length);
    const randomRating = Math.floor(Math.random() * 3) + 3; // 3-5 rating
    const randomDaysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
    
    const date = new Date();
    date.setDate(date.getDate() - randomDaysAgo);
    
    const reviewContent = reviewContents[randomContentIndex];
    const reviewAuthor = names[randomNameIndex];
    
    reviews.push({
      id: `review-${contentId}-${i}`,
      title: `Review by ${reviewAuthor}`,
      contentId: contentId,
      userId: `user-${i}`,
      userName: reviewAuthor,
      author: reviewAuthor,
      authorId: `user-${i}`,
      authorImage: `https://api.dicebear.com/7.x/personas/svg?seed=${reviewAuthor}`,
      text: reviewContent,
      content: reviewContent,
      rating: randomRating,
      date: date.toISOString(),
      source: 'internal',
      likes: Math.floor(Math.random() * 10),
      replies: Math.floor(Math.random() * 5),
      verified: true,
      helpful: Math.floor(Math.random() * 8),
      peerMall: {
        id: 'demo-mall',
        name: '데모 피어몰',
        address: 'demo-address'
      }
    });
  }
  
  return reviews;
};
