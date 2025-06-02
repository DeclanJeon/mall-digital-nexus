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
  email,
  imageUrl,
  imageLocation,
  category,
  phone,
  peerMallKey,
  peerMallName,
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

  // QR 코드 표시
  const showQrCode = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (peerMallName) {
      onShowQrCode?.(peerMallKey, peerMallName);
    } else {
      toast({
        title: "QR 코드",
        description: `${peerMallName}의 QR 코드를 표시할 수 없습니다.`,
        variant: "destructive",
      });
    }
  }, [peerMallKey, onShowQrCode, peerMallName, toast]);

  // 🎯 통화하기 - 모달만 열기로 수정
  const handleQuickCall = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 바로 모달만 열기
    setIsCallModalOpen(true);
    
    toast({
      title: "📞 통화 준비",
      description: `${peerMallName}과의 통화를 준비합니다.`,
      duration: 2000,
    });
  }, [peerMallName, toast]);

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
            <Link to={`/space/${peerMallName}?mk=${peerMallKey}`} target="_blank" className="block h-full">
              <img
                src={displayImageUrl}
                alt={peerMallName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </Link>
            
            {/* 배지들 - 좌측 상단 */}
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
          </div>
          
          {/* 내용 영역 */}
          <Link to={`/space/${peerMallName}?mk=${peerMallKey}`} target="_blank" className="block">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{peerMallName}</h3>
                {/* 🎯 액션 버튼들을 여기로 이동 - 우측 상단 타이틀 옆 */}
                <div className="flex items-center gap-1 ml-2">
                  {/* QR 코드 버튼 */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-6 h-6 p-0 hover:bg-gray-100 rounded-full"
                    onClick={showQrCode}
                    title="QR 코드 보기"
                  >
                    <QrCode className="h-3 w-3 text-gray-600" />
                  </Button>

                  {/* 통화 버튼 */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-6 h-6 p-0 hover:bg-green-100 rounded-full"
                    onClick={handleQuickCall}
                    title="통화하기"
                  >
                    <Phone className="h-3 w-3 text-green-600" />
                  </Button>

                  {/* 메시지 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 hover:bg-blue-100 rounded-full"
                    onClick={handleQuickMessage}
                    title="메시지 보내기"
                  >
                    <MessageSquare className="h-3 w-3 text-blue-600" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
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
              </div>
            </CardContent>
          </Link>
        </Card>
      </motion.div>

      {/* 🎯 CallModal - location 데이터 더 풍부하게 전달 */}
      <CallModal 
        open={isCallModalOpen}
        owner={ownerName}
        peerMallKey={peerMallKey}
        onOpenChange={setIsCallModalOpen}
        location={{
          title: peerMallName,
          owner: ownerName,
          email: email,
          phone: email,
          imageUrl: displayImageUrl,
          trustScore: rating || 4.8, // 실제 rating 사용
          responseTime: '즉시',
          isOnline: true
        }} 
      />
      {/* 메시지 모달 */}
      <EnhancedMessageModal
        messageModalOpen={isMessageModalOpen}
        setMessageModalOpen={setIsMessageModalOpen}
        owner={owner}
        email={email}
        title={title}
        displayImageUrl={displayImageUrl}
        imageError={imageError}
      />
    </>
  );
});

export default PeermallCard;