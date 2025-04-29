
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
      // Default follow functionality if none provided
      // Update in localStorage
      try {
        const key = `peer_space_${config.id}_config`;
        const updatedConfig = {
          ...config,
          followers: config.followers + 1
        };
        localStorage.setItem(key, JSON.stringify(updatedConfig));
        
        toast({
          title: "팔로우 완료",
          description: `${config.owner}님을 팔로우합니다.`,
        });
        
        // Refresh the page to show updated counts
        window.location.reload();
      } catch (error) {
        console.error('Error updating followers:', error);
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "팔로우 처리 중 오류가 발생했습니다.",
        });
      }
    }
  };
  
  const handleRecommendClick = () => {
    if (onAddRecommendation) {
      onAddRecommendation();
    } else {
      // Default recommendation functionality if none provided
      // Update in localStorage
      try {
        const key = `peer_space_${config.id}_config`;
        const updatedConfig = {
          ...config,
          recommendations: config.recommendations + 1
        };
        localStorage.setItem(key, JSON.stringify(updatedConfig));
        
        toast({
          title: "추천 완료",
          description: "해당 피어스페이스를 추천하였습니다.",
        });
        
        // Refresh the page to show updated counts
        window.location.reload();
      } catch (error) {
        console.error('Error updating recommendations:', error);
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "추천 처리 중 오류가 발생했습니다.",
        });
      }
    }
  };

  // Handle badge addition
  const handleAddBadgeClick = (badge: string) => {
    if (onAddBadge) {
      onAddBadge(badge);
    } else {
      // Default badge functionality if none provided
      if (!config.badges.includes(badge)) {
        try {
          const key = `peer_space_${config.id}_config`;
          const updatedConfig = {
            ...config,
            badges: [...config.badges, badge]
          };
          localStorage.setItem(key, JSON.stringify(updatedConfig));
          
          toast({
            title: "뱃지 추가 완료",
            description: "뱃지가 성공적으로 추가되었습니다.",
          });
          
          // Refresh the page to show updated badges
          window.location.reload();
        } catch (error) {
          console.error('Error adding badge:', error);
          toast({
            variant: "destructive",
            title: "오류 발생",
            description: "뱃지 추가 중 오류가 발생했습니다.",
          });
        }
      } else {
        toast({
          title: "이미 추가된 뱃지",
          description: "이미 추가한 뱃지입니다.",
          variant: "destructive",
        });
      }
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

  // Available badges to add
  const availableBadges = ['trusted', 'recommended', 'favorite', 'topRated', 'premium'];
  
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
          
          <div className="flex flex-wrap gap-3 mb-4">
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
          
          {/* Badge Selection for Visitors */}
          {!isOwner && (
            <div className="mt-4">
              <p className="text-sm text-white/70 mb-2">뱃지 주기:</p>
              <div className="flex flex-wrap gap-2">
                {availableBadges.filter(badge => !config.badges.includes(badge)).map((badge) => (
                  <Badge 
                    key={badge}
                    className={`cursor-pointer border-none hover:bg-white/30 flex items-center ${getBadgeColor(badge)}`}
                    onClick={() => handleAddBadgeClick(badge)}
                  >
                    {getBadgeIcon(badge)}
                    + {getBadgeLabel(badge)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
