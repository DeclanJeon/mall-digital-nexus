
import React from "react";
import { Heart, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface PeermallCardProps {
  id: string;
  title: string;
  owner: string;
  description: string;
  imageUrl: string;
  likes: number;
  rating: number;
  followers: number;
  tags: string[];
  isPopular?: boolean;
  className?: string;
}

const NewPeermallCard: React.FC<PeermallCardProps> = ({
  id,
  title,
  owner,
  description,
  imageUrl,
  likes = 0,
  rating = 0,
  followers = 0,
  tags = [],
  isPopular = false,
  className,
}) => {
  return (
    <Link to={`/space/${id}`} className="block">
      <div 
        className={cn(
          "group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 h-full",
          isPopular && "ring-2 ring-accent-100 ring-offset-2",
          className
        )}
      >
        {/* Card image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isPopular && (
            <div className="absolute top-2 left-2 bg-accent-100 text-white text-xs font-medium px-2 py-1 rounded">
              인기 피어몰
            </div>
          )}
          <button 
            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault(); // 링크 이동 방지
              // 좋아요 기능 구현을 위한 자리
            }}
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Card content */}
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-primary-100 line-clamp-1">{title}</h3>
          </div>
          
          <p className="text-xs text-text-200 mb-2 line-clamp-2">{description}</p>
          
          <div className="flex items-center mb-2">
            <User className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-text-200">{owner}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-0.5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-0.5 text-gray-400" />
                <span className="text-xs text-gray-500">{likes}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-end gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-bg-200 text-text-200 rounded text-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewPeermallCard;
