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

  // QR 코드 표시
  const showQrCode = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (peerMallName) {
      onShowQrCode(peerMallKey, peerMallName);
    } else {
      toast({
        title: "QR 코드",
        description: `${peerMallName}의 QR 코드를 표시할 수 없습니다.`,
        variant: "destructive",
      });
    }
  }, [peerMallKey, onShowQrCode, peerMallName, toast]);

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
      >
        <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
          {/* 이미지 영역 */}
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <Link to={`/space/${peerMallName}?mk=${peerMallKey}`} className="block h-full">
              <img
                src={displayImageUrl}
                alt={peerMallName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </Link>
            
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
            
            {/* 🎯 항상 보이는 액션 버튼들 - 우측 상단 */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              {/* QR 코드 버튼 */}
              <Button 
                variant="outline" 
                size="icon" 
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-sm border-white/50"
                onClick={showQrCode}
                title="QR 코드 보기"
              >
                <QrCode className="h-4 w-4 text-gray-700" />
              </Button>

              {/* 통화 버튼 - 로그인한 사용자만 */}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-sm border-white/50"
                  onClick={handleQuickCall}
                  title="통화하기"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                </Button>
              

              {/* 메시지 버튼 - 로그인한 사용자만 */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-sm border-white/50"
                  onClick={handleQuickMessage}
                  title="메시지 보내기"
                >
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </Button>
              
            </div>
          </div>
          
          {/* 내용 영역 */}
          <Link to={`/space/${id}`} className="block">
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
              
              {/* 🎯 하단 정보 및 좋아요 버튼 */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{ownerName}</span>
                </div>
                
                {/* 좋아요 버튼 */}
                <button
                  onClick={toggleLike}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  title={isLiked ? "좋아요 취소" : "좋아요"}
                >
                  <Heart className={cn(
                    "h-4 w-4 transition-colors",
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                  )} />
                  <span className={isLiked ? "text-red-500" : ""}>{currentLikes}</span>
                </button>
              </div>
            </CardContent>
          </Link>
        </Card>
      </motion.div>
      
      {/* 통화 모달 */}

      {/* <CallModal 
        open={isCallModalOpen}
        owner={owner}
        peerMallKey={peerMallKey}
        onOpenChange={setIsCallModalOpen}
        location={{
          title,
          owner,
          phone,
          imageUrl: displayImageUrl,
          trustScore: 4.8, 
          responseTime: '즉시',
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