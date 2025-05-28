// 개선된 ProductDetailPage 컴포넌트
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
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

interface Inquiry {
  id: string;
  productId: string | number;
  author: string;
  content: string;
  timestamp: string;
}

const INQUIRIES_STORAGE_KEY = 'product_inquiries';

const loadInquiries = (productId: string | number): Inquiry[] => {
  try {
    const storedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (storedInquiries) {
      const allInquiries: Inquiry[] = JSON.parse(storedInquiries);
      return allInquiries.filter(inquiry => inquiry.productId === productId);
    }
  } catch (error) {
    console.error("Failed to load inquiries from local storage", error);
  }
  return [];
};

const saveInquiries = (allInquiries: Inquiry[]) => {
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(allInquiries));
  } catch (error) {
    console.error("Failed to save inquiries to local storage", error);
  }
};

const ProductDetailPage: React.FC = () => { 
  const { address, productId } = useParams<{ address: string; productId: string }>();
  const navigate = useNavigate();

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
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      const fetchedProduct = getProductById(productId); 
      setProduct(fetchedProduct || null);
      
      // 가짜 리뷰 데이터 로드
      loadMockReviews();
      
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const loadedInquiries = loadInquiries(productId);
    setInquiries(loadedInquiries);
  }, [productId]);

  useEffect(() => {
    if (inquiries.length > 0 || loadInquiries(productId).length > 0) {
      const allInquiries = JSON.parse(localStorage.getItem(INQUIRIES_STORAGE_KEY) || '[]');
      const otherProductInquiries = allInquiries.filter((inq: Inquiry) => inq.productId !== productId);
      saveInquiries([...otherProductInquiries, ...inquiries]);
    }
  }, [inquiries, productId]);

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

  const handleSubmitInquiry = (content: string) => {
    if (!content.trim()) return;

    const inquiry: Inquiry = {
      id: Date.now().toString(),
      productId: productId,
      author: '나',
      content,
      timestamp: new Date().toLocaleString()
    };

    setInquiries(prev => [...prev, inquiry]);
    setNewMessage('');
  };

  const handleBack = () => {
    navigate(-1);
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
          <Button onClick={handleBack} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
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
            onClick={handleBack}
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

                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    {formatPrice(Number(product.price) || 0)}원
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
                </div>

                <Separator className="my-6" />

                {/* 상담 및 소통 기능 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">상담하기</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-green-50 border-green-200"
                      onClick={handleVoiceCall}
                    >
                      <Phone className="h-4 w-4 text-green-500" />
                      <span className="text-xm">음성</span>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">상품 상세</TabsTrigger>
                  <TabsTrigger value="reviews">후기 ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="inquiries">문의 ({inquiries.length})</TabsTrigger>
                </TabsList>

                {/* 상품 상세 탭 */} 
                <TabsContent value="details" className="mt-6">
                  <Card className="shadow-none border-0">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">상품 설명</h3>
                      <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {product?.description ? (
                          <p>{product.description}</p>
                        ) : (
                          <p className="text-gray-500">등록된 상품 설명이 없습니다.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 후기 탭 */} 
                <TabsContent value="reviews" className="mt-6">
                  <Card className="shadow-none border-0">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">상품 후기</h3>
                      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold mb-2">리뷰 작성</h4>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${newReview.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                            />
                          ))}
                        </div>
                        <Textarea
                          placeholder="상품에 대한 솔직한 후기를 남겨주세요... (최소 10자)"
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                          className="mb-3 min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button onClick={handleSubmitReview} disabled={newReview.content.length < 10}>리뷰 제출</Button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={review.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.userName}`} />
                                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-gray-900">{review.userName}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                      ))}
                                      <span>{review.date}</span>
                                    </div>
                                  </div>
                                </div>
                                {review.verified && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    <CheckCircle className="h-3 w-3 mr-1" /> 구매확정
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-800 mb-3 leading-relaxed">{review.content}</p>
                              {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-3">
                                  {review.images.map((img, idx) => (
                                    <img key={idx} src={img} alt="Review Image" className="w-20 h-20 object-cover rounded-md" />
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                  <ThumbsUp className="h-4 w-4 mr-1" /> 도움돼요 ({review.helpful})
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                  <Flag className="h-4 w-4 mr-1" /> 신고
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-10">아직 등록된 후기가 없습니다. 첫 후기를 남겨주세요!</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 문의 탭 */} 
                <TabsContent value="inquiries" className="mt-6">
                  <Card className="shadow-none border-0">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">상품 문의</h3>
                      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold mb-2">문의 작성</h4>
                        <Textarea
                          placeholder="상품에 대해 궁금한 점을 문의해주세요..."
                          className="mb-3 min-h-[80px]"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button onClick={() => handleSubmitInquiry(newMessage)} disabled={newMessage.length < 1}>문의 제출</Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {inquiries.length > 0 ? (
                          inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${inquiry.author}`} />
                                    <AvatarFallback>{inquiry.author.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-gray-900">{inquiry.author}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <span>{inquiry.timestamp}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-800 mb-3 leading-relaxed">{inquiry.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-10">아직 등록된 문의가 없습니다.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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