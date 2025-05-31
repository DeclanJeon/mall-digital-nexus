import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Star, Heart, Share2, ShoppingCart, Plus, Minus, 
  MessageCircle, Loader2, Send, Phone, Video, ThumbsUp, 
  ThumbsDown, Flag, User, Clock, CheckCircle, AlertCircle,
  Camera, Mic, Smile, Paperclip, MoreHorizontal
} from 'lucide-react'; 
import { getProductById, getProducts } from '@/services/storage/productStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import productService from '@/services/productService';
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

const loadInquiries = (productId: string | number): Inquiry[] => {
  try {
    // const storedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    // if (storedInquiries) {
    //   const allInquiries: Inquiry[] = JSON.parse(storedInquiries);
    //   return allInquiries.filter(inquiry => inquiry.productId === productId);
    // }
  } catch (error) {
    console.error("Failed to load inquiries from local storage", error);
  }
  return [];
};

const saveInquiries = (allInquiries: Inquiry[]) => {
  try {
    //localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(allInquiries));
  } catch (error) {
    console.error("Failed to save inquiries to local storage", error);
  }
};

const ProductDetailPage: React.FC = () => { 
  const { address } = useParams<{ address: string }>();
  const [ searchParams ] = useSearchParams();
  const peerMallKey = searchParams.get('mk');
  const productKey = searchParams.get('pk');
  const navigate = useNavigate();

  // 상태들 - Product | undefined로 타입 수정
  const [product, setProduct] = useState<Product | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  // 상품 데이터 로드
  useEffect(() => {
    if (!productKey || !peerMallKey) {
      setError('상품 정보를 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        // 상품 서비스를 통해 상품 데이터를 가져옵니다.
        const productData = await productService.getProductByPeerMallKey(peerMallKey, productKey);
        if (productData) {
          setProduct(productData);
          setIsLoading(false);
        } else {
          setError('상품을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('상품 정보를 로드하는 중 오류가 발생했습니다.');
        console.error('상품 로드 오류:', err);
      }
    };

    loadProduct();
  }, [productKey, peerMallKey]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // 소셜 기능 상태들
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, content: '', images: [] as string[] });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isOnline, setIsOnline] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const loadProductInfo = async () => {
    try {
      const result = await productService.getProductInfo(address, peerMallKey, productKey);
      const productData = result['productInfo'];
      
      // 데이터베이스 스키마에 맞게 데이터 변환
      const formattedProduct: Product = {
        productId: productData.product_id,
        productKey: productData.product_key,
        id: productData.product_id, // 호환성 유지용
        name: productData.name,
        title: productData.name, // 호환성 유지용
        owner: productData.user_uid,
        description: productData.description,
        price: productData.price,
        currency: 'KRW', // 기본 화폐 단위
        imageUrl: productData.image_url || '',
        rating: 0, // 리뷰 기능 구현 시 업데이트
        reviewCount: 0, // 리뷰 기능 구현 시 업데이트
        peerMallName: '', // 마이몰 이름 구현 시 업데이트
        peerMallKey: '', // 마이몰 키 구현 시 업데이트
        category: '', // 카테고리 구현 시 업데이트
        tags: productData.tags?.split(',') || [],
        saleUrl: productData.sale_url,
        distributor: productData.distributor,
        manufacturer: productData.manufacturer,
        create_date: productData.create_date,
        update_date: productData.update_date,
        type: 'Product',
        peerSpaceAddress: '', // Content 인터페이스 호환성
        date: productData.create_date,
        likes: 0,
        comments: 0,
        views: 0,
        saves: 0
      };
      
      setProduct(formattedProduct);
    } catch (error) {
      setError('상품 정보를 불러오는데 실패했습니다.');
    }
  }

  // 상품 데이터 로드
  useEffect(() => {
    setIsLoading(true);

    loadProductInfo();
  
    setIsLoading(false);
  }, [productKey]);

  // 문의 데이터 로드
  // useEffect(() => {
  //   if (productId) {
  //     const loadedInquiries = loadInquiries(productId);
  //     setInquiries(loadedInquiries);
  //   }
  // }, [productId]);

  // 문의 데이터 저장
  // useEffect(() => {
  //   if (productId && inquiries.length > 0) {
  //     const allInquiries = JSON.parse(localStorage.getItem(INQUIRIES_STORAGE_KEY) || '[]');
  //     const otherProductInquiries = allInquiries.filter((inq: Inquiry) => inq.productId !== productId);
  //     saveInquiries([...otherProductInquiries, ...inquiries]);
  //   }
  // }, [inquiries, productId]);

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

  // 가격 포맷팅 함수
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return '0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('ko-KR').format(numPrice);
  };

  // 상품 이미지 배열 생성
  const getProductImages = () => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
    ];

    if (product?.imageUrl) {
      return [product.imageUrl, ...defaultImages.slice(1)];
    }
    return defaultImages;
  };

  // 핸들러 함수들
  const handleAddToCart = () => {
    toast({
      title: "장바구니 담기 완료! 🛒 (기능 준비중)",
      description: `${product?.title}이(가) 장바구니에 담겼습니다.`
    });
  };

  const handleBuyNow = () => {
    if (product?.saleUrl) {
      window.open(product.saleUrl, '_blank', 'noopener,noreferrer');
      toast({
        title: "상품 페이지로 이동합니다 🚀",
        description: `"${product.title}" 외부 페이지가 새 탭에서 열립니다.`,
      });
    } else {
      toast({
        title: "구매 링크 없음 ⚠️",
        description: "이 상품에 대한 구매 링크가 제공되지 않았습니다.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "찜 해제 💔" : "찜하기 완료! 💖",
      description: isFavorite ? "찜 목록에서 제거되었습니다." : "찜 목록에 추가되었습니다."
    });
  };

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
      productId: productKey,
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

  // 로딩 상태
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

  // 에러 상태
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">앗! 상품을 찾을 수 없어요 😅</h2>
          <p className="text-gray-600 mb-6">
            {error || '요청하신 상품 정보를 불러올 수 없습니다.'}
          </p>
          <Button onClick={handleBack} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <ArrowLeft className="h-5 w-5" />
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  const productImages = getProductImages();
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
                  alt={product.name || "상품 이미지"}
                  className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log('Image failed to load:', productImages[selectedImage]);
                    e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
                  }}
                />
              </div>

              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {/* {productImages.slice(0, 4).map((image, index) => (
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
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
                        }}
                      />
                    </button>
                  ))} */}
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
                    {product.title || '상품명 없음'}
                  </h1>

                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    {formatPrice(product.price)}원
                  </div>

                  {/* 할인가 표시 */}
                  {product.discountPrice && product.discountPrice > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.discountPrice)}원
                      </span>
                      <Badge variant="destructive" className="bg-red-500">
                        할인
                      </Badge>
                    </div>
                  )}

                  {/* 추가 상품 정보 표시 */}
                  {product.currency && product.currency !== 'KRW' && (
                    <p className="text-sm text-gray-500">화폐: {product.currency}</p>
                  )}
                  
                  {product.category && (
                    <Badge variant="secondary" className="mt-2">
                      {product.category}
                    </Badge>
                  )}

                  {/* 평점 정보 */}
                  <div className="flex items-center gap-2 mt-3">
                    {/* <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div> */}
                    {/* <span className="text-sm text-gray-600">
                      {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0}개 리뷰)
                    </span> */}
                  </div>

                  {/* 피어몰 정보 */}
                  {product.peerMallName && (
                    <p className="text-sm text-gray-600 mt-2">
                      판매: {product.peerMallName}
                    </p>
                  )}

                  {/* 상품 특징 배지들 */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {product.isBestSeller && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                        베스트셀러
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        신상품
                      </Badge>
                    )}
                    {product.isRecommended && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        추천
                      </Badge>
                    )}
                    {product.isCertified && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                        인증상품
                      </Badge>
                    )}
                  </div>
                </div>

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
                  
                  {/* <Button 
                    variant="outline"
                    className="w-full py-4 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold rounded-xl transition-all duration-200" 
                    onClick={handleAddToCart}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    장바구니 담기
                  </Button> */}
                </div>

                <Separator className="my-6" />

                {/* 상담 및 소통 기능 */}
                <div className="space-y-3">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-gray-800">상담하기</h3>
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-xs text-gray-500">온라인</span>
    </div>
  </div>
  <Button
    variant="outline"
    size="lg"
    className="w-full flex items-center gap-2 py-3 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold rounded-xl transition-all duration-200 justify-center"
    onClick={() => {
      if (product?.productKey) {
        window.open(`https://peerterra.com/one/channel/${address}/${product.name}?mk=${peerMallKey}&pk=${product.productKey}`, '_blank', 'noopener,noreferrer');
      } else {
        alert('피어몰 ID가 없습니다.');
      }
    }}
  >
    <span className="text-base">상담하기</span>
  </Button>
</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단: 상세 정보 탭 */}
        <div className="mt-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">상품 상세</TabsTrigger>
                  {/* <TabsTrigger value="reviews">리뷰 ({reviews.length})</TabsTrigger> */}
                  <TabsTrigger value="inquiries">문의 ({inquiries.length})</TabsTrigger>
                </TabsList>

                {/* 상품 상세 탭 */} 
                <TabsContent value="details" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800">상품 설명</h3>
                      <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {product.description ? (
                          <p className="whitespace-pre-line">{product.description}</p>
                        ) : (
                          <p className="text-gray-500 italic">등록된 상품 설명이 없습니다.</p>
                        )}
                      </div>
                    </div>

                    {/* 추가 상품 정보 */}
                    {(product.tags && product.tags.length > 0) && (
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">태그</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.saleUrl && (
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">구매 링크</h4>
                        <a 
                          href={product.saleUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {product.saleUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 리뷰 탭 */}
                

                {/* 문의 탭 */} 
                <TabsContent value="inquiries" className="mt-6">
                  <div>
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
                        <Button 
                          onClick={() => handleSubmitInquiry(newMessage)} 
                          disabled={newMessage.trim().length < 1}
                        >
                          문의 제출
                        </Button>
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
                                    <Clock className="h-3 w-3" />
                                    <span>{inquiry.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-800 mb-3 leading-relaxed">{inquiry.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-10">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>아직 등록된 문의가 없습니다.</p>
                          <p className="text-sm">첫 번째 문의를 남겨보세요!</p>
                        </div>
                      )}
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

        {/* 리뷰 작성 모달 */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>리뷰 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">평점</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
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
                <label className="block text-sm font-medium mb-2">리뷰 내용</label>
                <Textarea
                  placeholder="상품에 대한 솔직한 후기를 남겨주세요..."
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSubmitReview}>
                  리뷰 등록
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 채팅 모달 */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="max-w-md max-h-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                판매자와 채팅
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] p-4 border rounded-lg">
              <div className="space-y-4">
                {chatMessages.length > 0 ? (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
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
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>아직 메시지가 없습니다.</p>
                    <p className="text-sm">판매자에게 첫 메시지를 보내보세요!</p>
                  </div>
                )}
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductDetailPage;