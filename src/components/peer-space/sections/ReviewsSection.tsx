
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { StarIcon } from 'lucide-react';

type Review = {
  id: string;
  author: string;
  authorAvatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
};

const initialReviews: Review[] = [
  {
    id: 'review-1',
    author: '사용자1',
    authorAvatar: '',
    rating: 5,
    content: '정말 좋은 커뮤니티입니다. 많은 정보를 얻을 수 있어 좋아요!',
    date: '2025-05-01',
    likes: 12
  },
  {
    id: 'review-2',
    author: '사용자2',
    authorAvatar: '',
    rating: 4,
    content: '대체로 만족스럽습니다. 다만 일부 기능이 개선되면 좋겠어요.',
    date: '2025-04-28',
    likes: 8
  }
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useLocalStorage<Review[]>('community_reviews', initialReviews);
  const [newReview, setNewReview] = useState({ content: '', rating: 0 });
  const [username] = useLocalStorage<string>('chat_username', `게스트_${Math.floor(Math.random() * 1000)}`);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const handleAddReview = () => {
    if (!newReview.content.trim() || newReview.rating === 0) return;
    
    const review: Review = {
      id: `review-${Date.now()}`,
      author: username,
      authorAvatar: '',
      rating: newReview.rating,
      content: newReview.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ content: '', rating: 0 });
    setShowReviewForm(false);
  };
  
  const handleLikeReview = (id: string) => {
    setReviews(reviews.map(review => {
      if (review.id === id) {
        return {
          ...review,
          likes: review.likes + 1
        };
      }
      return review;
    }));
  };
  
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-300">리뷰</h2>
        
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          {showReviewForm ? '취소' : '리뷰 작성'}
        </Button>
      </div>
      
      {showReviewForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>리뷰 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <StarIcon 
                      className={`h-6 w-6 ${star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {newReview.rating > 0 ? `${newReview.rating}점` : '평점 선택'}
                </span>
              </div>
              
              <Textarea
                placeholder="리뷰 내용을 작성해주세요..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                className="min-h-[150px]"
              />
              
              <div className="flex justify-end">
                <Button onClick={handleAddReview} disabled={!newReview.content.trim() || newReview.rating === 0}>
                  리뷰 게시하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar>
                  <AvatarImage src={review.authorAvatar} alt={review.author} />
                  <AvatarFallback>{review.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.author}</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.content}</p>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLikeReview(review.id)}
                  className="text-xs flex items-center space-x-1"
                >
                  <span>❤️</span>
                  <span>도움됨</span>
                  <span className="ml-1">{review.likes}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reviews.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
