import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Phone, 
  MessageSquare, 
  Star, 
  Navigation,
  MapPin,
  Heart,
  Share2,
  ExternalLink,
  Clock,
  Users,
  Verified,
  Sparkles,
  Gift,
  Eye,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  ChevronRight,
  Shield,
  Crown,
  Bookmark,
  Camera,
  Globe,
  Mail,
  X,
  ArrowUpRight,
  CheckCircle,
  ThumbsUp,
  MessageCircle,
  Store,
  Package,
  Truck,
  CreditCard,
  Lock,
  Timer
} from "lucide-react"
import { Peermall } from "@/types/peermall"
import { useState, useEffect } from "react"

interface PeermallDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedPeermall: Peermall | null
}

export function PeermallDetailDialog({ 
  isOpen, 
  onOpenChange, 
  selectedPeermall 
}: PeermallDetailDialogProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(selectedPeermall?.likes || 1247)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [trustScore] = useState(98) // 신뢰도 점수

  // 더미 이미지 갤러리 (실제로는 selectedPeermall에서 가져올 것)
  const imageGallery = [
    selectedPeermall?.imageUrl || 'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4'
  ]

  // 자동 이미지 슬라이드 (시각/주의 최적화)
  useEffect(() => {
    if (imageGallery.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % imageGallery.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [imageGallery.length])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // 마이크로 피드백 제공
  }

  if (!selectedPeermall) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-white border-0 shadow-2xl">
        <div className="relative flex flex-col lg:flex-row h-full">
          
          {/* 왼쪽: 시각적 갤러리 섹션 (시각/주의 최적화) */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* 닫기 버튼 - 명확한 어포던스 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-20 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20 rounded-full w-10 h-10"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* 이미지 갤러리 */}
            <div className="relative h-80 lg:h-full overflow-hidden">
              <img 
                src={imageGallery[currentImageIndex]} 
                alt={selectedPeermall.title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
              
              {/* 프리미엄 오버레이 그라디언트 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
              
              {/* 이미지 인디케이터 */}
              {imageGallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {imageGallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* 상단 배지들 - 시각적 팝아웃 효과 */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {selectedPeermall.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold border-0 shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    FEATURED
                  </Badge>
                )}
                {selectedPeermall.certified && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <Verified className="w-3 h-3 mr-1" />
                    VERIFIED
                  </Badge>
                )}
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                  <Shield className="w-3 h-3 mr-1" />
                  {trustScore}% 신뢰도
                </Badge>
              </div>

              {/* 하단 기본 정보 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold tracking-tight">{selectedPeermall.title}</h1>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedPeermall.rating || 4.8) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        ))}
                        <span className="text-sm ml-1 opacity-90">
                          {selectedPeermall.rating?.toFixed(1) || '4.8'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm opacity-90 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedPeermall.location?.address || '서울시 강남구'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-green-300">지금 영업 중</span>
                      </div>
                    </div>

                    {/* 실시간 활동 지표 */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>실시간 방문자 {Math.floor(Math.random() * 50) + 20}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>오늘 조회 2.1k</span>
                      </div>
                    </div>
                  </div>

                  {/* 빠른 액션 버튼들 */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all ${
                        isBookmarked ? 'bg-blue-500/80' : 'bg-white/10'
                      }`}
                      onClick={handleBookmark}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all ${
                        isLiked ? 'bg-red-500/80' : 'bg-white/10'
                      }`}
                      onClick={handleLike}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 정보 및 액션 섹션 (인지 부하 최적화) */}
          <div className="lg:w-1/2 flex flex-col bg-gray-50">
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 핵심 통계 카드 - 즉각적인 신뢰 구축 */}
              <div className="grid grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
                  <CardContent className="p-3 text-center">
                    <Heart className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-800">{likeCount.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">좋아요</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
                  <CardContent className="p-3 text-center">
                    <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-800">{(selectedPeermall.followers || 1847).toLocaleString()}</p>
                    <p className="text-xs text-green-600">팔로워</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
                  <CardContent className="p-3 text-center">
                    <MessageCircle className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-purple-800">{selectedPeermall.reviewCount || 456}</p>
                    <p className="text-xs text-purple-600">리뷰</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
                  <CardContent className="p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-orange-800">98%</p>
                    <p className="text-xs text-orange-600">만족도</p>
                  </CardContent>
                </Card>
              </div>

              {/* 피어몰 소개 - 감정적 연결 구축 */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-800">피어몰 스토리</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {selectedPeermall.description || 
                    "혁신적인 제품과 서비스로 고객의 삶을 더욱 풍요롭게 만드는 것이 저희의 사명입니다. 매일 새로운 가치를 창조하며, 고객과 함께 성장하는 브랜드가 되겠습니다. ✨"}
                  </p>
                </CardContent>
              </Card>

              {/* 서비스 특징 - 가치 제안 명확화 */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-lg text-gray-800">서비스 특징</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">당일배송</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">안전결제</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <Lock className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">정품보장</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <Timer className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">빠른응답</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 태그 섹션 - 발견 가능성 향상 */}
              {selectedPeermall.tags && selectedPeermall.tags.length > 0 && (
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-lg text-gray-800">카테고리</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPeermall.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 운영 정보 - 신뢰도 강화 */}
              <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-lg text-gray-800">운영 정보</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700">현재 영업 중</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">평균 응답 3분</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">신규 상품 업데이트</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">전국 배송 가능</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 특별 혜택 - 행동 유도 */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
                <CardContent className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      지금 방문하면 특별 혜택! 🎁
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">
                    첫 방문 고객 15% 할인 + 무료 배송 + 적립금 5,000원
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Timer className="w-3 h-3" />
                    <span>한정시간: 24시간 {Math.floor(Math.random() * 12) + 1}분 남음</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 하단 고정 액션 영역 - 명확한 CTA */}
            <div className="border-t bg-white p-6 space-y-4">
              {/* 팔로우 버튼 */}
              <Button
                onClick={handleFollow}
                className={`w-full h-12 font-semibold transition-all duration-300 ${
                  isFollowing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                {isFollowing ? '팔로잉 중' : '팔로우 하기'}
              </Button>

              {/* 주요 액션 버튼들 */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-12 text-white shadow-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">전화하기</div>
                    <div className="text-xs opacity-90">즉시 연결</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => setShowContactForm(!showContactForm)}
                >
                  <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-purple-800">메시지</div>
                    <div className="text-xs text-purple-600">채팅하기</div>
                  </div>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Store className="w-5 h-5 mr-2 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-blue-800">피어몰 방문</div>
                    <div className="text-xs text-blue-600">둘러보기</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto text-blue-600" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                >
                  <Package className="w-5 h-5 mr-2 text-orange-600" />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-orange-800">제품 보기</div>
                    <div className="text-xs text-orange-600">쇼핑하기</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto text-orange-600" />
                </Button>
              </div>

              {/* 빠른 연락처 정보 */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>📞 평균 응답시간: 3분</span>
                  <span>🚚 당일배송 가능</span>
                  <span>💯 {trustScore}% 신뢰도</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}