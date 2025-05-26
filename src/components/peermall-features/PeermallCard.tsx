
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
  Sparkles,
  Phone,
  Crown,
  Shield,
  Zap,
  TrendingUp,
  Calendar,
  Clock,
  Gift,
  ExternalLink,
  ChevronRight,
  Verified,
  Diamond,
  Flame
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
import { motion, AnimatePresence } from "framer-motion";

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
    gold: "from-yellow-400 via-yellow-500 to-amber-600",
    platinum: "from-slate-400 via-slate-500 to-slate-600",
    diamond: "from-cyan-400 via-blue-500 to-indigo-600",
    fire: "from-orange-500 via-red-500 to-pink-600",
    emerald: "from-emerald-400 via-green-500 to-teal-600",
    royal: "from-purple-500 via-violet-600 to-indigo-700"
  },
  shadows: {
    luxury: "shadow-2xl shadow-black/10 hover:shadow-3xl hover:shadow-black/20",
    glow: "shadow-lg shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40",
    premium: "shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30",
    floating: "shadow-lg hover:shadow-2xl transition-all duration-500 ease-out"
  },
  animations: {
    float: "hover:translate-y-[-8px] transition-all duration-500 ease-out",
    scale: "hover:scale-[1.03] transition-all duration-300 ease-out",
    glow: "hover:ring-4 hover:ring-blue-500/20 transition-all duration-300"
  },
  glass: {
    backdrop: "backdrop-blur-xl bg-white/80 border border-white/20",
    dark: "backdrop-blur-xl bg-black/20 border border-white/10"
  }
};

const PeerMallCard: React.FC<PeermallCardProps> = ({
  id,
  title = '이름 없음',
  owner = '미정',
  description = '설명이 없습니다.',
  imageUrl = '',
  likes = 0,
  rating = 0,
  followers = 0,
  tags = [],
  category = '기타',
  featured = false,
  certified = false,
  recommended = false,
  location,
  isPopular = false,
  isFamilyCertified = false,
  isRecommended = false,
  className,
  onShowQrCode,
  onOpenMap,
  ...otherProps
}) => {
  const { toast } = useToast();
  
  // 상태 관리 - 실제 스토리지 데이터와 동기화
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentFollowers, setCurrentFollowers] = useState(followers);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 컴포넌트 마운트 시 스토리지에서 최신 데이터 동기화
  useEffect(() => {
    if (id) {
      const storedPeermall = peermallStorage.getById(id);
      if (storedPeermall) {
        setCurrentLikes(storedPeermall.likes || likes);
        setCurrentFollowers(storedPeermall.followers || followers);
      }
    }
  }, [id, likes, followers]);

  // 🏆 프리미엄 뱃지 시스템
  const premiumBadges = [
    (isPopular || featured) && { 
      type: "HOT", 
      gradient: premiumTokens.gradients.fire,
      icon: <Flame className="h-3 w-3 fill-current" />,
      priority: 1,
      glow: true
    },
    (isRecommended || recommended) && { 
      type: "PREMIUM", 
      gradient: premiumTokens.gradients.gold,
      icon: <Crown className="h-3 w-3" />,
      priority: 2,
      glow: true
    },
    (isFamilyCertified || certified) && { 
      type: "VERIFIED", 
      gradient: premiumTokens.gradients.emerald,
      icon: <Verified className="h-3 w-3" />,
      priority: 3,
      glow: false
    },
    rating >= 4.5 && { 
      type: "EXCELLENCE", 
      gradient: premiumTokens.gradients.diamond,
      icon: <Diamond className="h-3 w-3" />,
      priority: 4,
      glow: false
    }
  ].filter(Boolean).sort((a, b) => a.priority - b.priority);

  // 📊 고급 통계 시스템
  const premiumStats = {
    totalLikes: currentLikes,
    totalFollowers: currentFollowers,
    displayRating: Number(rating).toFixed(1),
    hasHighRating: rating >= 4.0,
    isPopularItem: currentLikes >= 100,
    trustScore: Math.min(98, Math.floor(rating * 20 + (currentFollowers / 10))),
    activityLevel: Math.floor(Math.random() * 50) + 20
  };

  // 🎯 향상된 이벤트 핸들러들
  const handleQuickCall = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "📞 통화 연결 중...",
      description: `${owner}님과 연결하고 있습니다.`,
    });
  }, [owner, toast]);

  const handleQuickMessage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMessageModalOpen(true);
  }, []);

  // 💖 좋아요 기능 - 실제 스토리지 업데이트
  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "피어몰 정보를 찾을 수 없습니다."
      });
      return;
    }

    try {
      const newLikeState = !isLiked;
      const newLikeCount = newLikeState ? currentLikes + 1 : Math.max(0, currentLikes - 1);
      
      // 로컬 상태 즉시 업데이트 (UX 개선)
      setIsLiked(newLikeState);
      setCurrentLikes(newLikeCount);
      
      // 스토리지의 피어몰 데이터 업데이트
      const existingPeermall = peermallStorage.getById(id);
      if (existingPeermall) {
        const updatedPeermall = {
          ...existingPeermall,
          likes: newLikeCount
        };
        peermallStorage.save(updatedPeermall);
      }
      
      // 프리미엄 피드백
      toast({
        title: newLikeState ? "💎 프리미엄 찜하기!" : "찜하기 취소",
        description: newLikeState 
          ? "VIP 관심 목록에 추가되었습니다" 
          : "관심 목록에서 제거되었습니다"
      });
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      toast({
        variant: "destructive",
        title: "오류",
        description: "좋아요 처리 중 오류가 발생했습니다."
      });
    }
  }, [id, isLiked, currentLikes, toast]);

  // 👥 팔로우 기능 - 실제 스토리지 업데이트
  const handleFollow = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) return;

    try {
      const newFollowState = !isFollowing;
      const newFollowerCount = newFollowState ? currentFollowers + 1 : Math.max(0, currentFollowers - 1);
      
      // 로컬 상태 업데이트
      setIsFollowing(newFollowState);
      setCurrentFollowers(newFollowerCount);
      
      // 스토리지 업데이트
      const existingPeermall = peermallStorage.getById(id);
      if (existingPeermall) {
        const updatedPeermall = {
          ...existingPeermall,
          followers: newFollowerCount
        };
        peermallStorage.save(updatedPeermall);
      }
      
      toast({
        title: newFollowState ? "🎉 팔로우 완료!" : "팔로우 취소",
        description: newFollowState 
          ? `${owner}님을 팔로우하기 시작했습니다` 
          : `${owner}님 팔로우를 취소했습니다`
      });
    } catch (error) {
      console.error('팔로우 처리 오류:', error);
    }
  }, [id, isFollowing, currentFollowers, owner, toast]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: title,
      text: `✨ ${title} - ${owner}의 프리미엄 피어몰을 확인해보세요!`,
      url: `${window.location.origin}/peerspace/${id}`
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
  }, [id, title, owner, toast]);

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim()) {
      toast({
        variant: "destructive",
        title: "메시지를 입력해주세요",
        description: "메시지 내용을 입력하셔야 합니다."
      });
      return;
    }

    toast({
      title: "📨 프리미엄 메시지 전송 완료",
      description: `${owner}님에게 메시지를 보냈습니다.`
    });
    
    setMessageText("");
    setMessageModalOpen(false);
  }, [messageText, owner, toast]);

  // 🖼️ 이미지 에러 핸들링
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // 기본 이미지 URL 처리
  const displayImageUrl = imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link to={`/peerspace/${id}`} className="block h-full group">
          <Card className={cn(
            "h-full overflow-hidden border-0 bg-white relative",
            premiumTokens.shadows.luxury,
            premiumTokens.animations.float,
            (isPopular || featured) && premiumTokens.shadows.glow,
            "ring-1 ring-gray-200/50 hover:ring-blue-500/30",
            className
          )}>
            
            {/* 🌟 프리미엄 글로우 효과 */}
            <div className={cn(
              "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
            )} />

            {/* 🖼️ 프리미엄 이미지 영역 */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
              
              {/* 로딩 애니메이션 */}
              <AnimatePresence>
                {!imageLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">로딩 중...</span>
                    </div >
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 메인 이미지 */}
              {!imageError ? (
                <motion.img
                  src={displayImageUrl}
                  alt={title}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
                    !imageLoaded && "opacity-0"
                  )}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-3 opacity-50">🏪</div>
                    <p className="text-sm font-medium">프리미엄 이미지</p>
                    <p className="text-xs opacity-75">준비 중...</p>
                  </div>
                </div>
              )}

              {/* 프리미엄 오버레이 그라디언트 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* 🏆 프리미엄 뱃지 영역 */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                <AnimatePresence>
                  {premiumBadges.slice(0, 2).map((badge, index) => (
                    <motion.div
                      key={badge.type}
                      initial={{ opacity: 0, x: -30, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Badge className={cn(
                        `bg-gradient-to-r ${badge.gradient} text-white border-0`,
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-lg",
                        badge.glow && "shadow-2xl animate-pulse"
                      )}>
                        {badge.icon}
                        {badge.type}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 카테고리 뱃지 */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-white/90 text-gray-700 border-0 px-2 py-1 text-xs font-medium shadow-md">
                    {category}
                  </Badge>
                </motion.div>
              </div>

              {/* 💎 프리미엄 액션 버튼 영역 */}
              <div className="absolute top-3 right-3 z-20">
                <motion.div
                  className={cn(
                    "flex items-center gap-1.5 p-1.5 rounded-2xl",
                    premiumTokens.glass.backdrop,
                    "shadow-lg backdrop-blur-sm"
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* 즉시 통화 버튼 */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <Button 
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "w-8 h-8 rounded-xl p-0",
                        "bg-gradient-to-r from-green-500 to-emerald-600",
                        "hover:from-green-600 hover:to-emerald-700",
                        "text-white transition-all duration-200"
                      )}
                      onClick={handleQuickCall}
                      title="즉시 통화하기"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                      통화하기
                    </span>
                  </motion.div>
                  
                  {/* 즉시 메시지 버튼 */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <Button 
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "w-8 h-8 rounded-xl p-0",
                        "bg-gradient-to-r from-blue-500 to-indigo-600",
                        "hover:from-blue-600 hover:to-indigo-700",
                        "text-white transition-all duration-200"
                      )}
                      onClick={handleQuickMessage}
                      title="즉시 메시지 보내기"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                      메시지
                    </span>
                  </motion.div>

                  {/* 공유 버튼 */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <Button 
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "w-8 h-8 rounded-xl p-0",
                        "bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600",
                        "transition-all duration-200"
                      )}
                      onClick={handleShare}
                      title="공유하기"
                    >
                      <Share className="h-3.5 w-3.5" />
                    </Button>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                      공유하기
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* 🔥 실시간 활동 지표 */}
              

              {/* 💖 프리미엄 찜하기 버튼 */}
              <motion.div
                className="absolute bottom-4 right-4 z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  className={cn(
                    "w-12 h-12 rounded-full p-0 shadow-2xl transition-all duration-300",
                    isLiked 
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white" 
                      : "bg-white/90 text-gray-700 hover:text-red-500 hover:bg-white"
                  )}
                  onClick={handleLike}
                  title={isLiked ? "찜하기 취소" : "찜하기"}
                >
                  <Heart className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isLiked && "fill-current"
                  )} />
                </Button>
              </motion.div>
            </div>

            {/* 📝 프리미엄 콘텐츠 영역 */}
            <CardContent className="p-6 space-y-5 relative z-10">
              
              {/* 제목과 평점 */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight">
                    {title}
                  </h3>
                  {premiumStats.hasHighRating && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-bold">{premiumStats.displayRating}</span>
                    </div>
                  )}
                </div>
                
                {/* 소유자 정보 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {owner.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{owner}</span>
                      {(isFamilyCertified || certified) && (
                        <div className="flex items-center gap-1">
                          <Verified className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">인증된 셀러</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 설명 */}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {description}
              </p>
            </CardContent>

            {/* 🌟 호버 시 프리미엄 효과 */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl pointer-events-none"
                />
              )}
            </AnimatePresence>
          </Card>
        </Link>
      </motion.div>
      
      {/* 📨 프리미엄 메시지 모달 */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center space-x-3 text-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-bold">
                  {owner}님에게 메시지
                </span>
                <p className="text-sm text-gray-500 font-normal">빠른 응답을 받으실 수 있습니다</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* 피어몰 정보 카드 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                    {!imageError ? (
                      <img
                        src={displayImageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl">
                        🏪
                      </div>
                    )}
                  </div>
                  {/* 온라인 상태 표시 */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900">{title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">운영자: {owner}</span>
                    {(isFamilyCertified || certified) && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        <Verified className="w-3 h-3 mr-1" />
                        인증됨
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>평균 응답: 5분</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{premiumStats.displayRating} 평점</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>{premiumStats.trustScore}% 신뢰도</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 메시지 입력 영역 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  메시지 내용
                </label>
                <Textarea 
                  placeholder="안녕하세요! 귀하의 피어몰에 관심이 있어서 연락드립니다.&#10;&#10;• 궁금한 점이나 문의사항을 자세히 적어주세요&#10;&#10;• 구체적인 질문일수록 빠른 답변을 받으실 수 있습니다&#10;• 예: 제품 문의, 가격 정보, 배송 관련 등"
                  className="resize-none h-40 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-sm leading-relaxed"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span>빠른 응답 보장</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>안전한 메시지</span>
                    </div>
                  </div>
                  <span className={cn(
                    "font-medium",
                    messageText.length > 800 ? "text-orange-500" : "text-gray-500"
                  )}>
                    {messageText.length}/1000
                  </span>
                </div>
              </div>

              {/* 빠른 메시지 템플릿 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">빠른 메시지 선택</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "안녕하세요! 제품에 대해 문의드리고 싶습니다.",
                    "가격 정보와 배송 방법을 알고 싶습니다.",
                    "매장 방문 가능한 시간을 알려주세요.",
                    "맞춤 제작이나 주문 제작 가능한지 궁금합니다."
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs"
                      onClick={() => setMessageText(template)}
                    >
                      <MessageSquare className="w-3 h-3 mr-2 text-blue-500" />
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 추가 연락 옵션 */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h5 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                다른 연락 방법
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 border-green-200 hover:bg-green-50 hover:border-green-300"
                  onClick={handleQuickCall}
                >
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-green-800 text-xs">즉시 통화</div>
                    <div className="text-green-600 text-xs">바로 연결</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-blue-800 text-xs">예약 상담</div>
                    <div className="text-blue-600 text-xs">시간 예약</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="space-x-3 pt-6 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setMessageModalOpen(false)}
              className="border-gray-200 hover:bg-gray-50 px-6"
            >
              취소
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className={cn(
                "bg-gradient-to-r from-blue-600 to-indigo-700",
                "hover:from-blue-700 hover:to-indigo-800",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "text-white shadow-lg hover:shadow-xl",
                "px-8 py-2 font-semibold",
                "transition-all duration-300"
              )}
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