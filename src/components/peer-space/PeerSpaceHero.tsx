
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PeerMallConfig } from '@/types/space';
import { toast } from '@/hooks/use-toast';
import { Award, Heart, ThumbsUp, Shield, Star, Gift, Users, Hash, CheckCircle } from 'lucide-react'; // Users, Hash, CheckCircle 아이콘 추가

interface PeerSpaceHeroProps {
  config: PeerMallConfig;
  isOwner: boolean;
  onAddBadge?: (badge: string) => void;
  onAddRecommendation?: () => void;
  onFollow?: () => void;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void; // 커버 이미지 변경을 위해 추가
}

const PeerSpaceHero: React.FC<PeerSpaceHeroProps> = ({
  config,
  isOwner,
  onAddBadge,
  onAddRecommendation,
  onFollow,
  onUpdateConfig // 추가된 prop
}) => {

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCoverImage = reader.result as string;
        const updatedConfig = { ...config, coverImage: newCoverImage };
        onUpdateConfig(updatedConfig); // 상위 컴포넌트로 변경된 config 전달
        toast({
          title: "커버 이미지 변경됨",
          description: "새로운 커버 이미지가 적용되었습니다. (임시 저장)",
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
          description: "해당 피어몰을 추천하였습니다.",
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
  
  const heroStyle: React.CSSProperties = {
    backgroundImage: config.coverImage
      ? `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%), url(${config.coverImage})`
      : 'linear-gradient(to bottom, #1a202c 0%, #2d3748 100%)', // 기본 배경 (커버 이미지 없을 시)
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section
      className="relative rounded-b-3xl shadow-2xl overflow-hidden text-white min-h-[35vh] md:min-h-[45vh] flex flex-col justify-between mb-12" // 높이 수정: 70vh -> 35vh, 80vh -> 45vh (md에서 약간 더 여유)
      style={heroStyle}
    >
      {/* 상단 콘텐츠 영역 */}
      <div className="container mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10 flex-grow flex flex-col justify-center items-start">
        <div className="max-w-3xl animate-fadeInUp"> {/* 애니메이션 추가 */}
          {config.badges && config.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {config.badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`border-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm px-3 py-1 ${getBadgeColor(badge)}`}
                >
                  {getBadgeIcon(badge)}
                  {getBadgeLabel(badge)}
                </Badge>
              ))}
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            {config.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200/90 mb-8 leading-relaxed" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
            {config.description}
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-lg font-semibold px-10 py-4 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-sky-300"
            >
              자세히 둘러보기
            </Button>
            
            {isOwner && (
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm px-8 py-3 text-base rounded-lg shadow-md transition-colors"
              >
                <label htmlFor="coverImageInput" className="cursor-pointer flex items-center">
                  <Gift className="mr-2 h-5 w-5" /> 커버 변경
                </label>
                <input
                  type="file"
                  id="coverImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />
              </Button>
            )}
            {!isOwner && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm px-8 py-3 text-base rounded-lg shadow-md transition-colors"
                  onClick={handleFollowClick}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  팔로우 ({config.followers.toLocaleString()})
                </Button>
                {/* 추천 버튼은 통계 영역으로 이동 또는 다른 형태로 변경 고려 */}
              </>
            )}
          </div>
          
          {/* 방문자 뱃지 주기 - 디자인 개선 필요 시 */}
          {!isOwner && availableBadges.filter(b => !config.badges.includes(b)).length > 0 && (
            <div className="mt-10">
              <p className="text-md text-gray-300/80 mb-3">이 피어몰에 뱃지 선물하기:</p>
              <div className="flex flex-wrap gap-3">
                {availableBadges.filter(badge => !config.badges.includes(badge)).map((badge) => (
                  <Badge
                    key={badge}
                    variant="default"
                    className={`cursor-pointer backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm px-4 py-2 shadow-md ${getBadgeColor(badge)}`}
                    onClick={() => handleAddBadgeClick(badge)}
                  >
                    {getBadgeIcon(badge)}
                    {getBadgeLabel(badge)} 추가
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 하단 통계 및 정보 영역 */}
      <div className="container mx-auto px-6 md:px-10 pb-8 pt-6 bg-black/30 backdrop-blur-lg rounded-t-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {/* 소유자 정보 */}
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <Users className="h-7 w-7 text-sky-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-sky-300/80 uppercase tracking-wider">소유자</p>
              <p className="text-md font-semibold text-white truncate" title={config.owner}>
                {config.owner}
              </p>
            </div>
          </div>

          {/* 피어 번호 */}
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <Hash className="h-7 w-7 text-sky-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-sky-300/80 uppercase tracking-wider">피어 ID</p>
              <p className="text-md font-semibold text-white">{config.peerNumber}</p>
            </div>
          </div>

          {/* 팔로워 수 (버튼에서 여기로 이동) */}
           {!isOwner && (
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <Heart className="h-7 w-7 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-pink-300/80 uppercase tracking-wider">팔로워</p>
                <p className="text-md font-semibold text-white">{config.followers.toLocaleString()}</p>
              </div>
            </div>
           )}


          {/* 추천 수 */}
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <CheckCircle className="h-7 w-7 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-green-300/80 uppercase tracking-wider">추천</p>
              <p className="text-md font-semibold text-white">{config.recommendations.toLocaleString()}</p>
            </div>
          </div>
           {!isOwner && (
             <Button
                variant="ghost"
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 w-full justify-start p-3"
                onClick={handleRecommendClick}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                추천하기
              </Button>
           )}
        </div>
      </div>
    </section>
  );
};

export default PeerSpaceHero;
