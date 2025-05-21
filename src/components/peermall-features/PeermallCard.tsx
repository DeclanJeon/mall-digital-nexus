
import React from "react";
import { Heart, Star, User, BadgeCheck, ThumbsUp, MessageSquare, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  isPopular?: boolean;          // 인기 피어몰
  isFamilyCertified?: boolean;  // 패밀리 멤버 인증
  isRecommended?: boolean;      // 추천 피어몰
  className?: string;
}

const PeerMallCard: React.FC<PeermallCardProps> = ({
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
  isFamilyCertified = false,
  isRecommended = false,
  className,
}) => {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${owner}의 피어몰`,
        url: `${window.location.origin}/space/${id}`
      }).catch(err => console.log('Error sharing', err));
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(`${window.location.origin}/space/${id}`)
        .then(() => alert('링크가 클립보드에 복사되었습니다!'))
        .catch(() => alert('링크 복사에 실패했습니다.'));
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    // 좋아요 기능 구현
    console.log("좋아요:", id);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    // 메시지 보내기 기능 구현
    console.log("메시지 보내기:", id);
  };

  return (
    <Link to={`/space/${id}`} className="block h-full">
      <div 
        className={cn(
          "group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 h-full",
          isPopular && "ring-2 ring-accent-dark ring-offset-2",
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
          
          {/* === 뱃지 영역 === */}
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            {isPopular && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                인기
              </span>
            )}
            {isRecommended && (
              <span className="bg-blue-600/90 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                <ThumbsUp className="h-3.5 w-3.5" />
                추천
              </span>
            )}
            {isFamilyCertified && (
              <span className="bg-green-500/90 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                <BadgeCheck className="h-3.5 w-3.5" />
                인증
              </span>
            )}
          </div>
          {/* === 뱃지 영역 끝 === */}

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button 
              variant="ghost"
              size="icon"
              className="bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
            </Button>
            
            <Button 
              variant="ghost"
              size="icon"
              className="bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
              onClick={handleShare}
            >
              <Share className="h-4 w-4 text-gray-600 hover:text-blue-500" />
            </Button>
          </div>
        </div>

        {/* Card content */}
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-peermall-text line-clamp-1">{title}</h3>
          </div>
          
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
          
          <div className="flex items-center mb-2">
            <User className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-500">{owner}</span>
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
              <div className="flex items-center cursor-pointer" onClick={handleMessage}>
                <MessageSquare className="h-3 w-3 mr-0.5 text-gray-400" />
                <span className="text-xs text-gray-500">메시지</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-end gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
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

export default PeerMallCard;
