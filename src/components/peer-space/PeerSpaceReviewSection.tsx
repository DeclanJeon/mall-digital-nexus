
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, ThumbsUp, ArrowRight } from 'lucide-react';

import { PeerMallConfig, Review } from './types';

interface PeerSpaceReviewSectionProps {
  config: PeerMallConfig;
  reviews: Review[];
  isOwner: boolean;
}

const PeerSpaceReviewSection: React.FC<PeerSpaceReviewSectionProps> = ({
  config,
  reviews,
  isOwner
}) => {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">리뷰 & 평가</h2>
        
        {!isOwner && (
          <Button>
            리뷰 작성하기
          </Button>
        )}
      </div>
      
      {/* Overall rating */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">4.8</div>
            <div className="flex justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{reviews.length} 개의 리뷰</p>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => Math.round(r.rating) === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center text-sm">
                  <div className="w-16 flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{rating}</span>
                  </div>
                  <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-9 text-right text-gray-500">{count}</div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center md:text-left md:pl-6 md:border-l border-blue-200">
            <p className="text-sm text-gray-600 mb-2">리뷰를 남겨주시면 다른 사용자들에게 큰 도움이 됩니다.</p>
            {!isOwner && (
              <Button size="sm">
                리뷰 작성하기
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map(review => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={review.authorImage} alt={review.author} />
                  <AvatarFallback>{review.author?.substring(0, 1) || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{review.author}</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {review.source === 'external' && review.sourceSite && (
                  <Badge variant="outline" className="ml-auto text-xs px-1.5 py-0.5 flex items-center gap-1">
                    <ExternalLink className="h-2.5 w-2.5" />
                    {review.sourceSite}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {review.content || review.text}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>
                  {review.peerMall?.name || config.name || '피어몰'}
                </div>
                <button 
                  className="flex items-center gap-1 hover:text-blue-600 transition"
                  onClick={() => {/* handle like */}}
                >
                  <ThumbsUp className="h-3 w-3" /> {review.likes || 0}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {reviews.length > 6 && (
        <div className="mt-6 text-center">
          <Button variant="outline">
            모든 리뷰 보기 <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default PeerSpaceReviewSection;
