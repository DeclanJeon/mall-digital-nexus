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
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductDetailComponentProps } from '@/types/product';
import { cn } from '@/lib/utils';

// 피어몰 디자인 토큰
const peerMallTokens = {
  colors: {
    primary: 'from-purple-600 via-violet-600 to-indigo-600',
    secondary: 'from-pink-500 via-rose-500 to-red-500',
    accent: 'from-cyan-400 via-blue-500 to-indigo-600',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500'
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

  // 상담 메시지 전송
  const handleConsultationSend = () => {
    if (consultationMessage.trim()) {
      // 실제로는 API 호출
      console.log('상담 메시지 전송:', consultationMessage);
      setConsultationMessage('');
      // 성공 피드백 표시
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
              {/* <div className="flex items-center gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                >
                  {product.category || '일반'}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-3 w-3" />
                  <span>조회 {Math.floor(Math.random() * 1000) + 100}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>인기 상품</span>
                </div>
              </div> */}
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                {product.name}
              </h1>
              
              {/* <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 transition-all duration-200 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {product.rating || 4.5} ({product.reviewCount || 0}개 리뷰)
                  </span>
                </div>
              </div> */}
            </div>

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

            {/* 구매 옵션 */}
            <Card className={cn(
              "p-6 border-0",
              peerMallTokens.effects.glass
            )}>
              <CardContent className="p-0 space-y-6">
                <Separator className="bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700" />
                
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>총 금액</span>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: "'Inter', sans-serif" }}>
                    ₩{(finalPrice * quantity).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 구매 버튼 */}
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
              // { key: 'consultation', label: '상담하기', icon: Phone },
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
                  <CardContent className="p-0">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {product.description || "아직 상세 설명이 등록되지 않았습니다."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'consultation' && (
                <Card className={cn(
                  "p-8 border-0",
                  peerMallTokens.effects.glass
                )}>
                  <CardContent className="p-0 space-y-6">
                    <div className="text-center space-y-4">
                      <div className={cn(
                        "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r",
                        peerMallTokens.colors.primary,
                        "flex items-center justify-center"
                      )}>
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          실시간 상담하기
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                          제품에 대해 궁금한 점이 있으시면 언제든 상담해주세요
                        </p>
                      </div>
                    </div>

                    {/* 판매자 정보 */}
                    <div className={cn(
                      "p-4 rounded-xl",
                      peerMallTokens.effects.glass
                    )}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-r",
                          peerMallTokens.colors.primary,
                          "flex items-center justify-center text-white font-bold"
                        )}>
                          {peerMallName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {peerMallName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>온라인 • 평균 응답시간 {trustMetrics.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 상담 메시지 입력 */}
                    <div className="space-y-4">
                      <Textarea
                        placeholder="상담하고 싶은 내용을 입력해주세요..."
                        value={consultationMessage}
                        onChange={(e) => setConsultationMessage(e.target.value)}
                        className="min-h-[120px] resize-none border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {consultationMessage.length}/500
                        </span>
                        <Button
                          onClick={handleConsultationSend}
                          disabled={!consultationMessage.trim()}
                          className={cn(
                            "bg-gradient-to-r",
                            peerMallTokens.colors.primary,
                            "text-white font-semibold px-6 py-2 rounded-xl"
                          )}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          상담 요청하기
                        </Button>
                      </div>
                    </div>

                    {/* 상담 안내 */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {[
                        { icon: Clock, title: "빠른 응답", desc: "평균 2시간 내 답변" },
                        { icon: Shield, title: "안전한 상담", desc: "P2P 암호화 통신" },
                        { icon: MessageCircle, title: "전문 상담", desc: "제품 전문가와 직접 상담" }
                      ].map((item, index) => (
                        <div key={index} className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                          <item.icon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <h5 className="font-semibold text-gray-900 dark:text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {item.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
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
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <div className="flex flex-col gap-3">
            <Button
              size="icon"
              className={cn(
                "w-14 h-14 rounded-full bg-gradient-to-r",
                peerMallTokens.colors.primary,
                "hover:shadow-2xl hover:shadow-purple-500/25 text-white transition-all duration-300 transform hover:scale-110"
              )}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowLeft className="h-6 w-6 rotate-90" />
            </Button>
            <Button
              size="icon"
              className={cn(
                "w-14 h-14 rounded-full",
                peerMallTokens.effects.glass,
                "hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              )}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`h-6 w-6 transition-all duration-300 ${
                isWishlisted 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-500'
              }`} />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetailComponent;