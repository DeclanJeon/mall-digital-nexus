import React, { useState, useCallback, useEffect, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { peermallStorage, Peermall } from "@/services/storage/peermallStorage";
import { 
  Heart, 
  Star, 
  User, 
  BadgeCheck, 
  MessageSquare, 
  QrCode, 
  Award,
  Phone,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedMessageModal from "@/components/features/EnhancedMessageModal";
import CallModal from "@/components/features/CallModal";
import { useAuth } from "@/hooks/useAuth";

interface PeermallCardProps extends Peermall {
  isPopular?: boolean;
  isFamilyCertified?: boolean;
  isRecommended?: boolean;
  className?: string;
  onShowQrCode?: (id: string, title: string) => void;
  onOpenMap?: (location: { lat: number; lng: number; address: string; title: string }) => void;
}

// 🎨 프리미엄 디자인 토큰
const premiumTokens = {
  gradients: {
    primary: "from-blue-600 via-indigo-600 to-purple-700",
    secondary: "from-amber-500 to-pink-500",
    success: "from-green-500 to-emerald-600",
    danger: "from-rose-500 to-pink-600",
    premium: "from-amber-400 via-rose-500 to-fuchsia-600"
  },
  shadows: {
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.3)] dark:shadow-[0_0_30px_rgba(139,92,246,0.5)]",
    luxury: "shadow-xl shadow-blue-500/10 dark:shadow-purple-500/20",
    hover: "hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
  },
  animations: {
    float: "hover:-translate-y-1 transition-transform duration-300",
    pulse: "animate-pulse"
  }
};

const PeermallCard: React.FC<PeermallCardProps> = memo(({
  id,
  title,
  description,
  owner,
  ownerName,
  imageUrl,
  imageLocation,
  category,
  phone,
  peerMallKey,
  peerMallName = '',
  tags = [],
  rating = 0,
  reviewCount = 0,
  likes: initialLikes = 0,
  followers: initialFollowers = 0,
  featured = false,
  recommended = false,
  certified = false,
  isPopular = false,
  isFamilyCertified = false,
  isRecommended = false,
  className = "",
  onShowQrCode,
  onOpenMap,
  ...rest
}) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  const [currentFollowers, setCurrentFollowers] = useState(initialFollowers);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 이미지 에러 핸들링
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // 기본 이미지 URL 처리
  const displayImageUrl = imageLocation ? imageLocation : (imageUrl || "/placeholder-shop.jpg");

  // 좋아요 토글
  const toggleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    
    // 좋아요 수 업데이트
    setCurrentLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
    
    // TODO: 서버에 좋아요 상태 저장
  }, [isLiked]);

  // 팔로우 토글
  const toggleFollow = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    
    // 팔로워 수 업데이트
    setCurrentFollowers(prev => newIsFollowing ? prev + 1 : Math.max(0, prev - 1));
    
    toast({
      title: newIsFollowing ? "팔로우했습니다" : "팔로우를 취소했습니다",
      description: newIsFollowing 
        ? `${owner}님의 새로운 소식을 받아볼 수 있습니다.` 
        : `${owner}님의 소식을 더 이상 받아보지 않습니다.`,
    });
  }, [isFollowing, owner, toast]);

  // QR 코드 표시
  const showQrCode = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onShowQrCode) {
      onShowQrCode(id, title);
    } else {
      toast({
        title: "QR 코드",
        description: `${title}의 QR 코드를 표시할 수 없습니다.`,
        variant: "destructive",
      });
    }
  }, [id, onShowQrCode, title, toast]);

  // 지도에서 보기
  const showOnMap = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onOpenMap && rest.location) {
      onOpenMap({
        ...rest.location,
        title,
      });
    } else {
      toast({
        title: "지도",
        description: "이 상점의 위치 정보를 가져올 수 없습니다.",
        variant: "destructive",
      });
    }
  }, [onOpenMap, rest.location, title, toast]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: peerMallName,
      text: `✨ ${peerMallName} - ${owner}의 프리미엄 피어몰을 확인해보세요!`,
      url: `${window.location.origin}/space/${peerMallKey}`
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData).catch(err => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(shareData.url)
        .then(() => toast({
          title: "🔗 프리미엄 링크 복사 완료",
          description: "친구들과 공유해보세요!",
        }))
        .catch(() => toast({
          variant: "destructive",
          title: "복사 실패",
          description: "링크 복사에 실패했습니다."
        }));
    }
  }, [id, peerMallName, owner, toast]);

  // 통화하기
  const handleQuickCall = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCallModalOpen(true);

    const url = `https://peerterra.com/one/channel/${peerMallName}?mk=${peerMallKey}`;
    window.open(url, '_blank');
  }, [owner, peerMallKey, toast]);

  // 메시지 보내기
  const handleQuickMessage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMessageModalOpen(true);
  }, []);

  // 메시지 전송
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "메시지를 입력해주세요",
        description: "메시지 내용이 비어있습니다.",
      });
      return;
    }

    setIsSending(true);
    
    // TODO: 메시지 전송 API 호출
    setTimeout(() => {
      setIsSending(false);
      setIsMessageModalOpen(false);
      setMessage("");
      
      toast({
        title: "메시지 전송 성공",
        description: `${owner}님에게 메시지를 보냈습니다.`
      });
    }, 1000);
  }, [message, owner, toast]);

  useEffect(() => {
    if (initialLikes !== undefined) {
      setCurrentLikes(initialLikes);
    }
  }, [initialLikes]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("relative group", className)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link to={`/space/${peerMallName}?mk=${peerMallKey}`} className="block h-full">
          <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            {/* 이미지 영역 */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              <img
                src={displayImageUrl}
                alt={peerMallName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              
              {/* 배지들 */}
              <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                {isPopular && (
                  <Badge variant="secondary" className="bg-amber-500 text-white">
                    <Flame className="w-3 h-3 mr-1" /> 인기
                  </Badge>
                )}
                {isFamilyCertified && (
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    <BadgeCheck className="w-3 h-3 mr-1" /> 패밀리 인증
                  </Badge>
                )}
                {isRecommended && (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    <Award className="w-3 h-3 mr-1" /> 추천
                  </Badge>
                )}
              </div>
              
              {/* 호버 시 액션 버튼들 */}
              <div className={cn(
                "absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isHovered && "opacity-100"
              )}>

                {isAuthenticated && ( 
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/90 hover:bg-white"
                    onClick={handleQuickCall}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}

                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white"
                    onClick={handleQuickMessage}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}

                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/90 hover:bg-white"
                  onClick={showQrCode}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* 내용 영역 */}
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{peerMallName}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{ownerName}</span>
                </div>
                <div className="flex items-center">
                  <Heart className={cn(
                    "h-4 w-4 mr-1",
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                  )} />
                  <span>{currentLikes}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      
      {/* 하단 버튼 그룹 */}
      {/* <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
        {onShowQrCode && (
          <Button
            size="icon" 
            className="rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 text-gray-700 hover:text-blue-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowQrCode(id, title);
            }}
          >
            <QrCode className="h-5 w-5" />
          </Button>
        )}
        {isAuthenticated && (
          <Button
            size="icon"
            className="rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 text-gray-700 hover:text-green-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCallModalOpen(true);
            }}
          >
            <Phone className="h-5 w-5" />
          </Button>
        )}
        {isAuthenticated && (
          <Button
            size="icon"
            className="rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 text-gray-700 hover:text-purple-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMessageModalOpen(true);
            }}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
      </div> */}
      
      {/* 통화 모달 */}
      {/* <CallModal 
        open={isCallModalOpen} 
        onOpenChange={setIsCallModalOpen} 
        location={{
          title: title || '상점',
          owner: owner || '점주',
          phone: phone || '010-1234-5678',
          imageUrl: displayImageUrl,
          trustScore: 95,
          responseTime: "즉시 응답",
          isOnline: true
        }} 
      /> */}
      
      {/* 메시지 모달 */}
      <EnhancedMessageModal
        messageModalOpen={isMessageModalOpen}
        setMessageModalOpen={setIsMessageModalOpen}
        owner={owner}
        title={title}
        displayImageUrl={displayImageUrl}
        imageError={imageError}
      />
    </>
  );
});

export default PeermallCard;
