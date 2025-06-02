import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  MapPin,
  Calendar,
  Eye,
  Bookmark,
  Gift,
  CreditCard,
  Info,
  Users,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Package,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Copy,
  QrCode,
  Phone,
  MessageSquare,
  HelpCircle,
  Send,
  User,
  Mail,
  FileText,
  ArrowRight,
  Factory,
  Building2,
  Tag,
  Globe,
  DollarSign,
  PhoneCall,
  Video,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductDetailComponentProps } from '@/types/product';
import { cn } from '@/lib/utils';
import CallModal from '@/components/features/CallModal'; // 통화 모달 import
import { toast } from '@/hooks/use-toast';

// 피어몰 디자인 토큰
const peerMallTokens = {
  colors: {
    primary: 'from-purple-600 via-violet-600 to-indigo-600',
    secondary: 'from-pink-500 via-rose-500 to-red-500',
    accent: 'from-cyan-400 via-blue-500 to-indigo-600',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    call: 'from-green-500 via-emerald-500 to-teal-500'
  },
  effects: {
    glass: 'backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 border border-white/20 dark:border-gray-700/30',
    glow: 'shadow-2xl shadow-purple-500/25 dark:shadow-purple-400/20',
    shine: 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000'
  }
};

// Q&A 데이터 타입
interface QAItem {
  id: number;
  question: string;
  answer?: string;
  user: string;
  date: string;
  isAnswered: boolean;
}

const ProductDetailComponent: React.FC<ProductDetailComponentProps> = ({
  product,
  peerMallName,
  peerMallKey,
  onBack,
  isOwner = false
}) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'consultation' | 'qna' | 'inquiry'>('description');
  const [showQRCode, setShowQRCode] = useState(false);
  
  // 🎯 통화 모달 상태 추가
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  // 상담/문의 관련 상태
  const [consultationMessage, setConsultationMessage] = useState('');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [newQuestion, setNewQuestion] = useState('');
  
  // 가격 계산 로직
  const originalPrice = Number(product.price || 0);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const finalPrice = discountPrice || originalPrice;
  const discountPercent = discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  // 이미지 배열 처리
  const productImages = product.imageUrl ? [product.imageUrl] : ['/placeholder-product.jpg'];

  // Q&A 데이터
  const [qaList, setQaList] = useState<QAItem[]>([
    {
      id: 1,
      question: "이 제품의 배송은 언제쯤 가능한가요?",
      answer: "주문 후 1-2일 내 발송 예정입니다. 영업일 기준으로 계산되며, 주말과 공휴일은 제외됩니다.",
      user: "김구매자",
      date: "2025-05-28",
      isAnswered: true
    },
    {
      id: 2,
      question: "A/S는 어떻게 받을 수 있나요?",
      answer: "구매 후 1년간 무료 A/S를 제공합니다. 피어몰 고객센터로 연락주시면 안내해드리겠습니다.",
      user: "이고객",
      date: "2025-05-25",
      isAnswered: true
    },
    {
      id: 3,
      question: "색상 옵션이 더 있나요?",
      user: "박문의",
      date: "2025-05-29",
      isAnswered: false
    }
  ]);

  // 신뢰 지표 데이터
  const trustMetrics = {
    peerRating: 4.8,
    totalSales: 1247,
    responseTime: "2시간",
    trustLevel: 7
  };

  // 🎯 통화 모달 데이터
  const callModalData = {
    title: peerMallName,
    owner: product.owner || '피어몰 운영자',
    phone: '+82-10-1234-5678', // 실제로는 피어몰 데이터에서 가져와야 함
    imageUrl: product.imageUrl,
    trustScore: 4.8,
    responseTime: '평균 2시간',
    isOnline: true
  };

  // 상담 메시지 전송
  const handleConsultationSend = () => {
    if (consultationMessage.trim()) {
      // 실제로는 API 호출
      console.log('상담 메시지 전송:', consultationMessage);
      setConsultationMessage('');
      // 성공 피드백 표시
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {

      const shareData = {
        title: product.name,
        text: `${product.name} - ₩${finalPrice.toLocaleString()}`,
        url: window.location.href
      };

      console.log(shareData)

      // 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);

        console.log('링크가 복사되었습니다! 📋');
        
        // 토스트 알림 표시 (toast가 있다면)
        toast({
          title: "링크가 복사되었습니다! 📋",
          description: "클립보드에 상품 링크가 복사되었습니다.",
        });
      
      alert("링크가 복사되었습니다! 📋")
    } catch (error) {
      console.error('공유 실패:', error);
      
      // 폴백: 수동 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "링크가 복사되었습니다! 📋",
          description: "클립보드에 상품 링크가 복사되었습니다.",
        });
      } catch (clipboardError) {
        // 최종 폴백: 텍스트 선택
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('링크가 클립보드에 복사되었습니다!');
      }
    }
  };

  // 문의 폼 제출
  const handleInquirySubmit = () => {
    if (inquiryForm.name && inquiryForm.email && inquiryForm.message) {
      // 실제로는 API 호출
      console.log('문의 제출:', inquiryForm);
      setInquiryForm({ name: '', email: '', subject: '', message: '' });
      // 성공 피드백 표시
    }
  };

  // Q&A 질문 추가
  const handleQuestionSubmit = () => {
    if (newQuestion.trim()) {
      const newQA: QAItem = {
        id: Date.now(),
        question: newQuestion,
        user: "익명사용자",
        date: new Date().toISOString().split('T')[0],
        isAnswered: false
      };
      setQaList(prev => [newQA, ...prev]);
      setNewQuestion('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"
      >
        {/* 네비게이션 헤더 */}
        <motion.div 
          className={cn(
            "flex items-center justify-between mb-8 p-4 rounded-2xl",
            peerMallTokens.effects.glass
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">피어몰로 돌아가기</span>
          </Button>
          
          <div className="flex items-center gap-2">
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
            >
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                isWishlisted 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-gray-500 hover:text-red-400'
              }`} />
            </Button> */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowQRCode(!showQRCode)}
              className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
            >
              <QrCode className="h-5 w-5 text-gray-500 hover:text-blue-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCopyLink}
              className="hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
            >
              <Share2 className="h-5 w-5 text-gray-500 hover:text-purple-400" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 이미지 섹션 */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={cn(
              "overflow-hidden border-0 shadow-2xl",
              peerMallTokens.effects.glass
            )}>
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    <img
                      src={productImages[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                    
                    {/* 이미지 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* 줌 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={() => setIsImageZoomed(true)}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>

                    {/* 할인 뱃지 */}
                    {discountPercent > 0 && (
                      <div className="absolute top-4 left-4">
                        <Badge className={cn(
                          "bg-gradient-to-r",
                          peerMallTokens.colors.secondary,
                          "text-white font-bold px-3 py-1 text-sm shadow-lg"
                        )}>
                          -{discountPercent}% 🔥
                        </Badge>
                      </div>
                    )}

                    {/* 🎯 새로운 상품 상태 뱃지들 */}
                    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-2 py-1 text-xs shadow-lg">
                          NEW ✨
                        </Badge>
                      )}
                      {product.isBestSeller && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-2 py-1 text-xs shadow-lg">
                          BEST 👑
                        </Badge>
                      )}
                      {product.isRecommended && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-2 py-1 text-xs shadow-lg">
                          추천 ⭐
                        </Badge>
                      )}
                      {product.isCertified && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-2 py-1 text-xs shadow-lg">
                          인증 🛡️
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* 이미지 네비게이션 */}
                  {productImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                        disabled={selectedImageIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                        disabled={selectedImageIndex === productImages.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* 썸네일 이미지 */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300",
                      selectedImageIndex === index 
                        ? "border-purple-500 shadow-lg shadow-purple-500/25" 
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    )}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* QR 코드 카드 */}
            <AnimatePresence>
              {showQRCode && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className={cn(
                    "p-6 rounded-2xl text-center space-y-4",
                    peerMallTokens.effects.glass
                  )}
                >
                  <div className="w-32 h-32 mx-auto bg-white rounded-xl p-4 shadow-lg">
                    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      QR로 공유하기
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      모바일에서 스캔하여 제품을 확인하세요
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 제품 정보 섹션 */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* 제품명 및 기본 정보 */}
            <div className="space-y-6">
              {/* 🎯 카테고리 및 메타 정보 */}
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && (
                  <Badge 
                    variant="outline" 
                    className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                  >
                    {product.category}
                  </Badge>
                )}
                {/* <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-3 w-3" />
                  <span>조회 {product.views || Math.floor(Math.random() * 1000) + 100}</span>
                </div> */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(product.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                {product.name}
              </h1>
              
              {/* 🎯 평점 정보 (있는 경우) */}
              {/* {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 transition-all duration-200 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {product.rating} ({product.reviewCount || 0}개 리뷰)
                    </span>
                  </div>
                </div>
              )} */}
            </div>

            {/* 🎯 제조사/유통사 정보 */}
            {(product.manufacturer || product.distributor) && (
              <Card className={cn(
                "p-4 border-0",
                peerMallTokens.effects.glass
              )}>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.manufacturer && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Factory className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">제조사</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{product.manufacturer}</p>
                        </div>
                      </div>
                    )}
                    {product.distributor && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">유통사</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{product.distributor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 태그 */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 🎯 가격 정보 카드 */}
            <Card className={cn(
              "p-6 border-0",
              peerMallTokens.effects.glass
            )}>
              <CardContent className="p-0 space-y-4">
                {/* 가격 표시 */}
                <div className="space-y-2">
                  {discountPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        ₩{originalPrice.toLocaleString()}
                      </span>
                      <Badge className={cn(
                        "bg-gradient-to-r",
                        peerMallTokens.colors.secondary,
                        "text-white font-bold"
                      )}>
                        -{discountPercent}% 할인
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ₩{finalPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-500">{product.currency || 'KRW'}</span>
                    </div>
                  </div>
                </div>

                {/* 🎯 재고 정보 */}
                {/* {product.stock && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">재고: {product.stock}개</span>
                  </div>
                )} */}

                <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700" />
                
                {/* 🎯 수량 선택 */}
                {/* <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">수량</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div> */}
                
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>총 금액</span>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: "'Inter', sans-serif" }}>
                    ₩{(finalPrice * quantity).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 🎯 구매 및 상담 버튼 */}
            <div className="space-y-4">
              {product.saleUrl ? (
                <Button 
                  className={cn(
                    "w-full bg-gradient-to-r",
                    peerMallTokens.colors.primary,
                    "hover:shadow-2xl hover:shadow-purple-500/25 text-white font-bold py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                  )}
                  onClick={() => window.open(product.saleUrl, '_blank')}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  외부 사이트에서 구매하기
                </Button>
              ) : (
                <>
                  <Button className={cn(
                    "w-full bg-gradient-to-r",
                    peerMallTokens.colors.primary,
                    "hover:shadow-2xl hover:shadow-purple-500/25 text-white font-bold py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                  )}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    장바구니에 담기
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-bold py-4 text-lg rounded-2xl transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    바로 구매하기
                  </Button>
                </>
              )}
            </div>

            {/* 🎯 피어몰 정보 카드 */}
            <Card className={cn(
              "p-6 border-0",
              peerMallTokens.effects.glass
            )}>
              <CardContent className="p-0">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-r",
                    peerMallTokens.colors.primary,
                    "flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  )}>
                    {peerMallName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {peerMallName}
                    </h3>
                    
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCallModalOpen(true)}
                    className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="hidden sm:inline">상담</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 상세 정보 탭 */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            {[
              { key: 'description', label: '상품상세', icon: Info },
              { key: 'qna', label: 'Q&A', icon: HelpCircle },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.key 
                    ? cn("bg-gradient-to-r", peerMallTokens.colors.primary, "text-white shadow-lg")
                    : "hover:bg-white/20 dark:hover:bg-gray-800/20"
                )}
                onClick={() => setActiveTab(tab.key as any)}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.key === 'qna' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {qaList.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {activeTab === 'description' && (
                <Card className={cn(
                  "p-8 border-0",
                  peerMallTokens.effects.glass
                )}>
                  <CardContent className="p-0 space-y-6">
                    {/* 🎯 상품 설명 */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <Info className="h-5 w-5 text-purple-600" />
                        상품 설명
                      </h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {product.description || "아직 상세 설명이 등록되지 않았습니다."}
                        </p>
                      </div>
                    </div>

                    {/* 🎯 상품 옵션 (등록 폼에서 추가한 옵션들) */}
                    {product.options && product.options.length > 0 && (
                      <div>
                        <Separator className="my-6" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <Package className="h-5 w-5 text-blue-600" />
                          상품 옵션
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {product.options.map((option, index) => (
                            <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{option.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                {option.values.map((value, valueIndex) => (
                                  <Badge key={valueIndex} variant="outline" className="bg-white dark:bg-gray-700">
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 🎯 배송 및 교환/반품 정보 */}
                    {/* <div>
                      <Separator className="my-6" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <Truck className="h-5 w-5 text-green-600" />
                        배송 및 교환/반품 안내
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-800 dark:text-green-300">무료배송</span>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            30,000원 이상 구매시<br />전국 무료배송
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-800 dark:text-blue-300">교환/반품</span>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            구매 후 7일 이내<br />무료 교환/반품
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-purple-600" />
                            <span className="font-semibold text-purple-800 dark:text-purple-300">품질보증</span>
                          </div>
                          <p className="text-sm text-purple-700 dark:text-purple-400">
                            정품 보장 및<br />A/S 지원
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'qna' && (
                <div className="space-y-6">
                  {/* Q&A 질문 작성 */}
                  <Card className={cn(
                    "p-6 border-0",
                    peerMallTokens.effects.glass
                  )}>
                    <CardContent className="p-0 space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <HelpCircle className="h-5 w-5 text-purple-600" />
                        새 질문하기
                      </h3>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="제품에 대해 궁금한 점을 질문해주세요..."
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="min-h-[100px] resize-none border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleQuestionSubmit}
                            disabled={!newQuestion.trim()}
                            className={cn(
                              "bg-gradient-to-r",
                              peerMallTokens.colors.primary,
                              "text-white font-semibold px-6 py-2 rounded-xl"
                            )}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            질문하기
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Q&A 리스트 */}
                  <div className="space-y-4">
                    {qaList.map((qa) => (
                      <Card key={qa.id} className={cn(
                        "p-6 border-0",
                        peerMallTokens.effects.glass,
                        "hover:shadow-lg transition-all duration-300"
                      )}>
                        <CardContent className="p-0 space-y-4">
                          {/* 질문 */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">Q</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900 dark:text-white font-medium leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  {qa.question}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                  <User className="h-3 w-3" />
                                  <span>{qa.user}</span>
                                  <span>•</span>
                                  <span>{qa.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 답변 */}
                          {qa.isAnswered ? (
                            <div className="pl-11 space-y-2">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                  <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">A</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {qa.answer}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <Crown className="h-3 w-3 text-purple-600" />
                                    <span>{peerMallName} (판매자)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pl-11">
                              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  답변 대기 중입니다. 판매자가 곧 답변드릴 예정입니다.
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 추천 상품 섹션 */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              <Sparkles className="h-6 w-6 text-purple-600" />
              이런 상품은 어떠세요?
            </h2>
            <Button 
              variant="ghost" 
              className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              더 보기 <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={cn(
                  "overflow-hidden border-0 cursor-pointer",
                  peerMallTokens.effects.glass,
                  "hover:shadow-xl transition-all duration-300"
                )}>
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl">🎁</div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        추천 상품 {item}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          ₩{(Math.random() * 100000 + 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500">4.{Math.floor(Math.random() * 9)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 플로팅 액션 버튼 */}
        
      </motion.div>

      {/* 🎯 통화 모달 */}
      <CallModal
        open={isCallModalOpen}
        onOpenChange={setIsCallModalOpen}
        owner={product.owner || 'unknown'}
        peerMallKey={peerMallKey}
        location={callModalData}
      />
    </div>
  );
};

export default ProductDetailComponent;