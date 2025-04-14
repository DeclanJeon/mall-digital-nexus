
import React from 'react';
import { User, MessageSquare, Heart, Star } from 'lucide-react';

interface PeermallCardProps {
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

const PeermallCard = ({
  title,
  description,
  owner,
  imageUrl,
  category,
  rating,
  reviewCount,
  featured = false
}: PeermallCardProps) => {
  return (
    <div className={`peermall-card group cursor-pointer animate-enter ${
      featured ? 'border-l-4 border-accent-100' : ''
    }`}>
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-bg-100 px-2 py-1 rounded text-xs font-medium text-text-200">
            {category}
          </span>
        </div>
        <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-accent-100 hover:text-white transition-colors">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold line-clamp-1 group-hover:text-accent-200 transition-colors">{title}</h3>
        <p className="text-sm text-text-200 mt-1 line-clamp-2">{description}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-1" />
            <span className="text-text-200">{owner}</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-text-200">{rating}</span>
            <span className="text-text-200 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <button className="btn-outline text-xs py-1 px-3 flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            메시지
          </button>
          <button className="btn-primary text-xs py-1 px-3">
            방문하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeermallCard;
