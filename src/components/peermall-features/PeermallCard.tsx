
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import {Button} from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PeermallCardProps {
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  feedDate?: string;
  recommended?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  onOpenMap?: (location: { lat: number; lng: number; address: string; title: string }) => void;
  id?: string; // Added ID for routing
  address?: string;
}

const PeermallCard = ({ 
  title, 
  description, 
  owner, 
  imageUrl, 
  category, 
  tags = [], 
  rating, 
  reviewCount, 
  featured,
  feedDate,
  recommended,
  location,
  onOpenMap,
  id,
  address
}: PeermallCardProps) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-accent-100' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform" 
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {featured && (
            <div className="bg-accent-100 text-white text-xs px-2 py-1 rounded-full">
              인기
            </div>
          )}
          {recommended && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              추천
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white text-xs font-semibold">{category}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold mb-1 text-primary-300">{title}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-2">{owner}</p>
        <p className="text-text-200 text-sm h-10 overflow-hidden">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.isArray(tags) ? tags.map((tag, index) => (
              <span key={index} className="inline-block text-xs bg-bg-200 text-text-200 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            )) : null}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">{reviewCount}개 리뷰</span>
          <div className="flex space-x-2">
            {location && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onOpenMap && onOpenMap({
                  ...location,
                  title
                })}
                className="p-1 text-primary-300 hover:text-primary-400"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}
            <Link
              to={`/space/${address}`}
              className="text-accent-200 hover:text-accent-100 p-0 text-sm"
            >
              방문하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeermallCard;
