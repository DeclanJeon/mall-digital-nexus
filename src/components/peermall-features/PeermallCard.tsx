import React, { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { peermallStorage, Peermall } from "@/services/storage/peermallStorage";
import { 
  Heart, 
  Star, 
  User, 
  BadgeCheck, 
  ThumbsUp, 
  MessageSquare, 
  Share, 
  MoreHorizontal, 
  QrCode, 
  MapPin,
  Eye,
  Users,
  Award,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PeermallCardProps extends Omit<Peermall, 'id'> {
  id?: string;
  isPopular?: boolean;
  isFamilyCertified?: boolean;
  isRecommended?: boolean;
  className?: string;
  onShowQrCode?: (id: string, title: string) => void;
  onOpenMap?: (location: { lat: number; lng: number; address: string; title: string }) => void;
}
import { motion, AnimatePresence } from "framer-motion";

// 🎨 디자인 토큰 - 인지 과학 기반
const designTokens = {
  colors: {
    primary: "from-blue-500 to-indigo-600",
    success: "from-green-500 to-emerald-600", 
    warning: "from-yellow-500 to-orange-600",
    popular: "from-purple-500 to-pink-600",
    neutral: "from-gray-500 to-slate-600"
  },
  shadows: {
    card: "shadow-sm hover:shadow-xl transition-all duration-300",
    elevated: "shadow-lg hover:shadow-2xl transition-all duration-300",
    glow: "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
  },
  animations: {
    hover: "hover:scale-[1.02] transition-all duration-300 ease-out",
    press: "active:scale-[0.98] transition-all duration-150",
    fade: "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  }
};

const PeerMallCard: React.FC<PeermallCardProps> = ({
  id = '',
  title = '이름 없음',
  owner = '미정',
  description = '설명이 없습니다.',
  imageUrl = '',
  likes = 0,
  rating = 0,
  followers = 0,
  tags = [],
  isPopular = false,
  isFamilyCertified = false,
  isRecommended = false,
  className,
  onShowQrCode,
  onOpenMap,
}) => {
  const { toast } = useToast();
  
  // 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // 좋아요 토글 처리
  const toggleLike = useCallback(async () => {
    try {
      if (id) {
        const peermall = peermallStorage.getById(id);
        if (peermall) {
          const newLikeState = !isLiked;
          const newLikeCount = newLikeState ? currentLikes + 1 : currentLikes - 1;
          
          const updatedPeermall = {
            ...peermall,
            likes: newLikeCount,
            updatedAt: new Date().toISOString()
          };
          
          await peermallStorage.save(updatedPeermall);
          setIsLiked(newLikeState);
          setCurrentLikes(newLikeCount);
          
          // 성공 토스트 메시지
          toast({
            title: newLikeState ? '좋아요!' : '좋아요 취소',
            description: newLikeState 
              ? '이 피어몰을 좋아합니다.' 
              : '좋아요를 취소했습니다.',
          });
        }
      } else {
        // ID가 없는 경우 로컬 상태만 업데이트
        const newLikeState = !isLiked;
        const newLikeCount = newLikeState ? currentLikes + 1 : currentLikes - 1;
        
        setIsLiked(newLikeState);
        setCurrentLikes(newLikeCount);
        
        // 로컬 스토리지에 저장 (임시 데이터용)
        const tempLikes = JSON.parse(localStorage.getItem('temp_peermall_likes') || '{}');
        tempLikes[id || 'temp'] = newLikeCount;
        localStorage.setItem('temp_peermall_likes', JSON.stringify(tempLikes));
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      toast({
        title: '오류',
        description: '좋아요 처리 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  }, [id, isLiked, currentLikes, toast]);
  
  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (id) {
      const peermall = peermallStorage.getById(id);
      if (peermall) {
        setCurrentLikes(peermall.likes || 0);
      }
    }
  }, [id]);

  // 🏷️ 뱃지 시스템 - 시각적 팝아웃 효과
  const badges = [
    isPopular && { 
      type: "인기", 
      gradient: designTokens.colors.popular,
      icon: <Star className="h-3 w-3 fill-current" />,
      priority: 1
    },
    isRecommended && { 
      type: "추천", 
      gradient: designTokens.colors.primary,
      icon: <ThumbsUp className="h-3 w-3" />,
      priority: 2
    },
    isFamilyCertified && { 
      type: "인증", 
      gradient: designTokens.colors.success,
      icon: <BadgeCheck className="h-3 w-3" />,
      priority: 3
    },
  ].filter(Boolean).sort((a, b) => a.priority - b.priority);

  // 📊 통계 데이터 계산
  const stats = {
    totalLikes: likes + (isLiked ? 1 : 0),
    displayRating: Number(rating).toFixed(1),
    hasStats: rating > 0 || likes > 0
  };

  // 🎯 이벤트 핸들러들
  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: title,
      text: `${title} - ${owner}의 피어몰을 확인해보세요!`,
      url: `${window.location.origin}/space/${id}`
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData).catch(err => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(shareData.url)
        .then(() => toast({
          title: "🔗 링크가 복사되었습니다",
          description: "클립보드에 저장되었습니다.",
        }))
        .catch(() => toast({
          variant: "destructive",
          title: "복사 실패",
          description: "링크 복사에 실패했습니다."
        }));
    }
  }, [id, title, owner, toast]);
  
  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLiked(prev => {
      const newState = !prev;
      toast({
        title: newState ? "💖 찜하기 추가!" : "찜하기 취소",
        description: newState 
          ? "관심 목록에 추가되었습니다" 
          : "관심 목록에서 제거되었습니다"
      });
      return newState;
    });
  }, [toast]);

  const handleQrCodeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShowQrCode?.(id, title);
  }, [id, title, onShowQrCode]);

  const handleMapClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenMap?.({
      lat: 0, // 실제 데이터로 교체 필요
      lng: 0,
      address: '',
      title
    });
  }, [title, onOpenMap]);

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim()) {
      toast({
        variant: "destructive",
        title: "메시지를 입력해주세요",
        description: "메시지 내용을 입력하셔야 합니다."
      });
      return;
    }

    // TODO: 실제 메시지 전송 로직
    console.log("메시지 전송:", { id, messageText });
    
    toast({
      title: "📨 메시지가 전송되었습니다",
      description: `${owner}님에게 메시지를 보냈습니다.`
    });
    
    setMessageText("");
    setMessageModalOpen(false);
  }, [messageText, id, owner, toast]);

  // 🖼️ 이미지 에러 핸들링
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Link to={`/space/${id}`} className="block h-full group">
          <Card className={cn(
            "h-full overflow-hidden border-0 bg-white",
            designTokens.shadows.card,
            designTokens.animations.hover,
            isPopular && designTokens.shadows.glow,
            className
          )}>
            {/* 🖼️ 이미지 영역 - 개선된 로딩과 에러 처리 */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <AnimatePresence>
                {!imageLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                      <span className="text-xs text-gray-500">로딩 중...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!imageError ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
                    !imageLoaded && "opacity-0"
                  )}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">🏪</div>
                    <p className="text-xs">이미지 없음</p>
                  </div>
                </div>
              )}

              {/* 🏷️ 뱃지 영역 - 개선된 시각적 계층 */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                <AnimatePresence>
                  {badges.slice(0, 2).map((badge, index) => (
                    <motion.div
                      key={badge.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge className={cn(
                        `bg-gradient-to-r ${badge.gradient} text-white border-0 shadow-lg`,
                        "flex items-center gap-1 px-2 py-1 text-xs font-semibold"
                      )}>
                        {badge.icon}
                        {badge.type}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {badges.length > 2 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Badge className="bg-gradient-to-r from-gray-500 to-slate-600 text-white border-0 shadow-lg cursor-pointer hover:from-gray-600 hover:to-slate-700 transition-all">
                          <Sparkles className="h-3 w-3 mr-1" />
                          +{badges.length - 2}
                        </Badge>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {badges.slice(2).map((badge) => (
                        <DropdownMenuItem key={badge.type} className="p-2">
                          <Badge className={cn(
                            `bg-gradient-to-r ${badge.gradient} text-white border-0`,
                            "flex items-center gap-1 px-2 py-1 text-xs"
                          )}>
                            {badge.icon}
                            {badge.type}
                          </Badge>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* 🎯 액션 버튼 영역 - 개선된 접근성 */}
              <div className={cn(
                "absolute top-3 right-3 flex items-center space-x-1",
                "bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg",
                designTokens.animations.fade
              )}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors" 
                  onClick={handleShare}
                  title="공유하기"
                >
                  <Share className="h-4 w-4" />
                </Button>
                
                {onShowQrCode && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors" 
                    onClick={handleQrCodeClick}
                    title="QR 코드 보기"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                )}
                
                {onOpenMap && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors" 
                    onClick={handleMapClick}
                    title="지도에서 보기"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-gray-50 transition-colors"
                      title="더 많은 옵션"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" side="bottom" align="end">
                    <DropdownMenuItem 
                      onClick={handleLike}
                      className="cursor-pointer"
                    >
                      <Heart className={cn(
                        "mr-2 h-4 w-4 transition-colors",
                        isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'
                      )} />
                      {isLiked ? '찜하기 취소' : '찜하기'}
                    </DropdownMenuItem>
                
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMessageModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      메시지 보내기
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                      <Share className="mr-2 h-4 w-4" />
                      공유하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 💖 찜하기 플로팅 버튼 - 모바일 최적화 */}
              <motion.button
                className={cn(
                  "absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200",
                  isLiked 
                    ? "bg-red-500 text-white" 
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500"
                )}
                onClick={handleLike}
                whileTap={{ scale: 0.9 }}
                title={isLiked ? "찜하기 취소" : "찜하기"}
              >
                <Heart className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isLiked && "fill-current"
                )} />
              </motion.button>
            </div>

            {/* 📝 콘텐츠 영역 - 개선된 정보 계층 구조 */}
            <CardContent className="p-5 space-y-4">
              {/* 제목과 소유자 */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{owner}</span>
                  </div>
                  {isFamilyCertified && (
                    <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      인증됨
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* 설명 */}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {description}
              </p>
              
              {/* 통계 및 태그 */}
              <div className="flex items-center justify-between">
                {/* 통계 */}
                {stats.hasStats && (
                  <div className="flex items-center space-x-4">
                    {rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {stats.displayRating}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Heart className={cn(
                        "h-4 w-4 transition-colors",
                        isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
                      )} />
                      <span className="text-sm text-gray-600">
                        {stats.totalLikes}
                      </span>
                    </div>

                    {followers > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {followers}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 태그 */}
                <div className="flex flex-wrap justify-end gap-1">
                  {tags.slice(0, 2).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {tags.length > 2 && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600"
                    >
                      +{tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      
      {/* 📨 메시지 모달 - 개선된 UX */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>{owner}님에게 메시지 보내기</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {owner.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600">운영자: {owner}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                메시지 내용
              </label>
              <Textarea 
                placeholder="안녕하세요! 피어몰에 대해 궁금한 점이 있어서 연락드립니다..." 
                className="resize-none h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>정중하고 명확한 메시지를 작성해주세요</span>
                <span>{messageText.length}/500</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setMessageModalOpen(false)}
              className="border-gray-200 hover:bg-gray-50"
            >
              취소
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              메시지 보내기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeerMallCard;