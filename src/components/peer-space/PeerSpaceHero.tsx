
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PeerMallConfig } from './types';
import { toast } from '@/hooks/use-toast';
import { Award, Heart, ThumbsUp, Shield, Star, Gift } from 'lucide-react';

interface PeerSpaceHeroProps {
  config: PeerMallConfig;
  isOwner: boolean;
  onAddBadge?: (badge: string) => void;
  onAddRecommendation?: () => void;
  onFollow?: () => void;
}

const PeerSpaceHero: React.FC<PeerSpaceHeroProps> = ({ 
  config, 
  isOwner,
  onAddBadge,
  onAddRecommendation,
  onFollow
}) => {
  const handleFollowClick = () => {
    if (onFollow) {
      onFollow();
    } else {
      toast({
        title: "팔로우 완료",
        description: `${config.owner}님을 팔로우합니다.`,
      });
    }
  };
  
  const handleRecommendClick = () => {
    if (onAddRecommendation) {
      onAddRecommendation();
    } else {
      toast({
        title: "추천 완료",
        description: "해당 피어스페이스를 추천하였습니다.",
      });
    }
  };
  
  const getBadgeIcon = (badge: string) => {
    switch(badge) {
      case 'trusted': return <Shield className="h-3 w-3 mr-1" />;
      case 'recommended': return <ThumbsUp className="h-3 w-3 mr-1" />;
      case 'favorite': return <Heart className="h-3 w-3 mr-1" />;
      case 'topRated': return <Star className="h-3 w-3 mr-1" />;
      case 'premium': return <Gift className="h-3 w-3 mr-1" />;
      default: return <Award className="h-3 w-3 mr-1" />;
    }
  };
  
  const getBadgeLabel = (badge: string) => {
    switch(badge) {
      case 'trusted': return '신뢰할 수 있는';
      case 'recommended': return '추천 피어';
      case 'favorite': return '즐겨찾는';
      case 'topRated': return '최고 등급';
      case 'premium': return '프리미엄';
      default: return badge;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'trusted': return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      case 'recommended': return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case 'favorite': return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case 'topRated': return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
      case 'premium': return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30";
      default: return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };
  
  return (
    <section 
      className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-700 to-purple-700 mb-8"
      style={{
        backgroundImage: config.coverImage 
          ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${config.coverImage})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-16 md:py-20 text-white">
        <div className="max-w-2xl">
          {config.badges && config.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {config.badges.map((badge, index) => (
                <Badge 
                  key={index}
                  className={`border-none hover:bg-white/30 flex items-center ${getBadgeColor(badge)}`}
                >
                  {getBadgeIcon(badge)}
                  {getBadgeLabel(badge)}
                </Badge>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{config.title}</h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-6">
            {config.description}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button className="bg-white text-blue-700 hover:bg-white/90">
              둘러보기
            </Button>
            
            {isOwner ? (
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                커버 이미지 변경
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={handleFollowClick}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  팔로우
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={handleRecommendClick}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  추천하기
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent h-16"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center relative z-10 -mb-4 pb-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <span className="text-white/80 text-sm">소유자: </span>
              <span className="text-white font-medium ml-1">{config.owner}</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hidden sm:flex items-center">
              <span className="text-white/80 text-sm">피어 번호: </span>
              <span className="text-white font-medium ml-1">{config.peerNumber}</span>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <span className="text-white/80 text-sm mr-1">팔로워 </span>
              <span className="text-white font-medium">{config.followers.toLocaleString()}</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hidden md:flex items-center">
              <span className="text-white/80 text-sm mr-1">추천 </span>
              <span className="text-white font-medium">{config.recommendations.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeerSpaceHero;
