import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  discountPrice,
  imageUrl,
  rating,
  reviewCount,
  viewMode
}) => {
  return (
    <Card className={viewMode === 'grid' ? 'h-full' : 'w-full'}>
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">
            {discountPrice ? (
              <>
                <span className="text-red-500">₩{discountPrice.toLocaleString()}</span>
                <span className="text-gray-400 line-through ml-2 text-sm">₩{price.toLocaleString()}</span>
              </>
            ) : (
              `₩${price.toLocaleString()}`
            )}
          </span>
          {discountPrice && (
            <Badge variant="destructive" className="text-xs">
              {Math.round(((price - discountPrice) / price) * 100)}%
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>
      </CardContent>
      {viewMode === 'grid' && (
        <CardFooter className="p-4 pt-0">
          <Button className="w-full">상세 보기</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
