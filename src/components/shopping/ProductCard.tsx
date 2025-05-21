
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, MessageSquare, DollarSign, Share } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number | string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peermallName: string;
  peermallId?: string;
  category: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  isCertified?: boolean;
  viewMode: 'grid' | 'list';
}

const ProductCard = ({
  id,
  title,
  description,
  price,
  discountPrice,
  imageUrl,
  rating,
  reviewCount,
  peermallName,
  peermallId,
  category,
  tags,
  isBestSeller,
  isNew,
  isRecommended,
  isCertified,
  viewMode
}: ProductCardProps) => {
  // Format price with Korean currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${formatPrice(discountPrice || price)}`,
        url: window.location.origin + `/product/${id}`
      }).catch(err => console.log('Error sharing', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/product/${id}`)
        .then(() => alert('링크가 클립보드에 복사되었습니다!'))
        .catch(() => alert('링크 복사에 실패했습니다.'));
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow border border-slate-100 ${
      viewMode === 'list' ? 'flex flex-row h-48' : 'h-full'
    }`}>
      <div className={`relative ${
        viewMode === 'list' ? 'w-48 h-full' : 'h-48'
      }`}>
        <Link to={`/product/${id}`}>
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        </Link>
        
        {/* Like Button */}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full w-8 h-8 hover:bg-white">
          <Heart className="h-4 w-4 text-accent-100" />
        </Button>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isBestSeller && (
            <Badge className="bg-yellow-500 text-white">베스트셀러</Badge>
          )}
          {isNew && (
            <Badge className="bg-green-500 text-white">신규</Badge>
          )}
          {isRecommended && (
            <Badge className="bg-blue-600 text-white flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              추천
            </Badge>
          )}
          {isCertified && (
            <Badge className="bg-purple-600 text-white">인증</Badge>
          )}
          {discountPrice && (
            <Badge className="bg-red-500 text-white">{discountPercentage}% 할인</Badge>
          )}
        </div>
      </div>
      
      <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 p-4' : ''}`}>
        <CardContent className={`${viewMode === 'list' ? 'p-0' : 'p-4'}`}>
          <Link to={`/peermall/${peermallId || '#'}`} className="hover:text-accent-100">
            <div className="text-xs text-text-200 mb-1 hover:underline">{peermallName}</div>
          </Link>
          <Link to={`/product/${id}`} className="hover:text-primary-300">
            <h3 className="font-bold text-primary-300 mb-1 line-clamp-1">{title}</h3>
          </Link>
          <p className="text-text-200 text-sm mb-2 line-clamp-2">{description}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-500 mr-2">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1 text-xs">{rating}</span>
            </div>
            <span className="text-text-200 text-xs">({reviewCount} 리뷰)</span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-accent-100" />
            {discountPrice ? (
              <>
                <span className="font-bold">{formatPrice(discountPrice)}</span>
                <span className="text-text-200 text-sm line-through">{formatPrice(price)}</span>
              </>
            ) : (
              <span className="font-bold">{formatPrice(price)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-accent-100" />
            <span className="text-sm">문의하기</span>
          </div>
          
          {/* Tags */}
          {viewMode === 'list' && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className={`${viewMode === 'list' ? 'px-0 mt-auto' : 'px-4 pb-4 pt-0'}`}>
          <div className="flex w-full gap-2">
            <Button className="flex-1 bg-accent-100 hover:bg-accent-200">
              구매하기
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
