// 개선된 ProductDetailPage 컴포넌트
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Star, Heart, Share2, ShoppingCart, Plus, Minus, 
  MessageCircle, Loader2, Send, Phone, Video, ThumbsUp, 
  ThumbsDown, Flag, User, Clock, CheckCircle, AlertCircle,
  Camera, Mic, Smile, Paperclip, MoreHorizontal
} from 'lucide-react'; 
import { getProductById } from '@/services/storage/productStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  images?: string[];
  date: string;
  helpful: number;
  verified: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice';
  isRead: boolean;
}

interface ProductDetailPageProps {
  productId: string | number;
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onBack }) => { 
  // 기존 상태들
  const [product, setProduct] = useState<Product | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // 새로운 상태들 - 소셜 기능을 위한
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, content: '', images: [] as string[] });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isOnline, setIsOnline] = useState(true); // 판매자 온라인 상태

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      const fetchedProduct = getProductById(productId.toString()); 
      setProduct(fetchedProduct || null);
      
      // 가짜 리뷰 데이터 로드
      loadMockReviews();
      
      setIsLoading(false);
    }
  }, [productId]);

  const loadMockReviews = () => {
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: 'user1',
        userName: '김민준',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        rating: 5,
        content: '정말 만족스러운 제품이에요! 품질도 좋고 배송도 빨라서 추천합니다. 특히 색상이 사진과 동일해서 좋았어요.',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'],
        date: '2025-05-25',
        helpful: 12,
        verified: true
      },
      {
        id: '2',
        userId: 'user2',
        userName: '박서연',
        rating: 4,
        content: '전체적으로 만족하지만 배송이 조금 늦었어요. 그래도 제품 자체는 설명과 같아서 좋습니다.',
        date: '2025-05-23',
        helpful: 8,
        verified: true
      },
      {
        id: '3',
        userId: 'user3',
        userName: '이도현',
        rating: 5,
        content: '두 번째 구매인데 역시 품질이 좋네요! 친구들에게도 추천했습니다.',
        date: '2025-05-20',
        helpful: 15,
        verified: false
      }
    ];
    setReviews(mockReviews);
  };

  // 기존 함수들은 그대로 유지...
  const handleAddToCart = () => {
    toast({
      title: "장바구니 담기 완료! 🛒 (기능 준비중)",
      description: `${product?.title}이(가) 장바구니에 담겼습니다.`
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "바로구매 진행중! 💳",
      description: "주문 페이지로 이동합니다."
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "찜 해제 💔" : "찜하기 완료! 💖",
      description: isFavorite ? "찜 목록에서 제거되었습니다." : "찜 목록에 추가되었습니다."
    });
  };

  // 새로운 함수들 - 소셜 기능
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: '나',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // 자동 응답 시뮬레이션
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'seller',
        senderName: '판매자',
        content: '안녕하세요! 문의해주셔서 감사합니다. 곧 답변드리겠습니다 😊',
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false
      };
      setChatMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleSubmitReview = () => {
    if (!newReview.content.trim()) {
      toast({
        title: "리뷰 내용을 입력해주세요",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: '나',
      rating: newReview.rating,
      content: newReview.content,
      images: newReview.images,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: true
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 5, content: '', images: [] });
    setIsReviewModalOpen(false);

    toast({
      title: "리뷰 작성 완료! ⭐",
      description: "소중한 후기 감사합니다."
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "화상 상담 요청 📹",
      description: "판매자에게 화상 상담 요청을 보냈습니다."
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: "음성 상담 요청 📞",
      description: "판매자에게 음성 상담 요청을 보냈습니다."
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">앗! 상품을 찾을 수 없어요 😅</h2>
          <p className="text-gray-600 mb-6">요청하신 상품 정보를 불러올 수 없습니다. 링크를 다시 확인해주세요.</p>
          <Button onClick={onBack} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <ArrowLeft className="h-5 w-5" />
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  const productImages = [
    product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
  ];

  const sizes = ['250', '260', '270', '280', '290'];
  const colors = [
    { name: 'Grey', value: '#9CA3AF', selected: true },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto py-4 px-4 lg:px-8">
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-purple-100 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 상품 이미지 */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-white border-b overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt="Product"
                  className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-purple-500 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 오른쪽: 상품 정보 및 구매 옵션 */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(averageRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {averageRating.toFixed(1)} ({reviews.length}개 후기)
                    </span>
                  </div>

                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    {formatPrice(Number(product.price) || 0)}원
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      무료배송
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      모레(금) 5/30 도착
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* 옵션 선택 */}
                {/* <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">사이즈</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">사이즈 선택</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">색상</label>
                    <div className="flex gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          className={`w-10 h-10 rounded-full border-3 transition-all duration-200 hover:scale-110 ${
                            selectedColor === color.name 
                              ? 'border-purple-500 shadow-lg' 
                              : 'border-gray-300 hover:border-purple-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setSelectedColor(color.name)}
                        >
                          {color.value === '#FFFFFF' && (
                            <div className="w-full h-full border border-gray-200 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">수량</label>
                    <div className="flex items-center border border-gray-300 rounded-xl w-36 overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="hover:bg-purple-50"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 border-x border-gray-300 flex-1 text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="hover:bg-purple-50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div> */}

                <Separator className="my-6" />

                {/* 구매 버튼들 */}
                <div className="space-y-3">
                  <Button 
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
                    onClick={handleBuyNow}
                    size="lg"
                  >
                    바로구매 💳
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-4 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 font-bold rounded-xl transition-all duration-200" 
                    onClick={handleAddToCart}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" /> 
                    장바구니 담기
                  </Button>
                </div>

                <Separator className="my-6" />

                {/* 상담 및 소통 기능 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">판매자와 소통하기</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-600">
                        {isOnline ? '온라인' : '오프라인'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-50 border-blue-200">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-xs">채팅</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            판매자와 채팅
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <ScrollArea className="h-64 border rounded-lg p-3">
                            <div className="space-y-3">
                              {chatMessages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-xs px-3 py-2 rounded-lg ${
                                      message.senderId === 'current-user'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {new Date(message.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="메시지를 입력하세요..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="flex-1"
                            />
                            <Button onClick={handleSendMessage} size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-green-50 border-green-200"
                      onClick={handleVoiceCall}
                    >
                      <Phone className="h-4 w-4 text-green-500" />
                      <span className="text-xs">음성</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-red-50 border-red-200"
                      onClick={handleVideoCall}
                    >
                      <Video className="h-4 w-4 text-red-500" />
                      <span className="text-xs">영상</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단: 상세 정보 탭 */}
        <div className="mt-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 bg-gray-50 rounded-none">
                  <TabsTrigger value="details" className="data-[state=active]:bg-white">
                    상품 상세
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-white">
                    후기 ({reviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="qna" className="data-[state=active]:bg-white">
                    문의사항
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">상품 설명</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {product.description || "상품에 대한 자세한 설명이 준비 중입니다."}
                    </p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">배송 정보</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 무료배송 (제주도 및 도서산간 지역 제외)</li>
                          <li>• 평일 오후 2시 이전 주문 시 당일 발송</li>
                          <li>• 일반적으로 1-2일 내 배송</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">교환/반품 정보</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 수령 후 7일 이내 교환/반품 가능</li>
                          <li>• 단순 변심 시 왕복 배송비 고객 부담</li>
                          <li>• 상품 하자 시 무료 교환/반품</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">상품 후기</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(averageRating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {averageRating.toFixed(1)} / 5.0 ({reviews.length}개 후기)
                          </span>
                        </div>
                      </div>
                      
                      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                            <Star className="h-4 w-4 mr-2" />
                            후기 작성
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>상품 후기 작성</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">평점</label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <Star
                                      className={`w-8 h-8 ${
                                        rating <= newReview.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">후기 내용</label>
                              <Textarea
                                placeholder="상품에 대한 솔직한 후기를 남겨주세요..."
                                value={newReview.content}
                                onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                                className="min-h-32 resize-none"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">사진 첨부 (선택)</label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
                                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">사진을 드래그하거나 클릭해서 업로드</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsReviewModalOpen(false)}
                                className="flex-1"
                              >
                                취소
                              </Button>
                              <Button 
                                onClick={handleSubmitReview}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                              >
                                후기 등록
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <Card key={review.id} className="border border-gray-100 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={review.userAvatar} />
                                  <AvatarFallback>
                                    {review.userName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{review.userName}</span>
                                    {review.verified && (
                                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        구매확정
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating 
                                              ? 'text-yellow-400 fill-current' 
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                  </div>
                                  
                                  <p className="text-gray-700 mb-3 leading-relaxed">{review.content}</p>
                                  
                                  {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mb-3">
                                      {review.images.map((image, index) => (
                                        <img
                                          key={index}
                                          src={image}
                                          alt={`Review image ${index + 1}`}
                                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                      ))}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-4 text-sm">
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
                                      <ThumbsUp className="h-4 w-4" />
                                      도움돼요 ({review.helpful})
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                                      <MessageCircle className="h-4 w-4" />
                                      댓글
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                                      <Flag className="h-4 w-4" />
                                      신고
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">아직 작성된 후기가 없어요</p>
                          <p className="text-sm">첫 번째 후기를 작성해보세요! 🌟</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="qna" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">상품 문의</h3>
                      <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        문의하기
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Card className="border border-gray-100">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                Q
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">김**</span>
                                <span className="text-sm text-gray-500">2025-05-27</span>
                                <Badge variant="outline" className="text-xs">답변완료</Badge>
                              </div>
                              <p className="text-gray-700 mb-3">사이즈 280이 품절인데 언제쯤 재입고 예정인가요?</p>
                              
                              <div className="bg-gray-50 rounded-lg p-3 ml-4 border-l-4 border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                      A
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">판매자</span>
                                  <span className="text-xs text-gray-500">2025-05-27</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                  안녕하세요! 280 사이즈는 다음 주 화요일(6/3) 재입고 예정입니다. 
                                  재입고 알림 설정해두시면 입고 즉시 알려드릴게요! 😊
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-100">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                Q
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">이**</span>
                                <span className="text-sm text-gray-500">2025-05-26</span>
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600">답변대기</Badge>
                              </div>
                              <p className="text-gray-700">실제 색상이 사진과 많이 다른가요? 그레이 색상 구매 고민 중입니다.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="text-center py-8">
                        <MessageCircle className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-4">궁금한 점이 있으시면 언제든 문의해주세요!</p>
                        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                          문의 작성하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 플로팅 액션 버튼 - 모바일에서 빠른 액세스 */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <div className="flex flex-col gap-3">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setIsChatOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleVoiceCall}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;