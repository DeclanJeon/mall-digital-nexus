import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductDetailComponentProps {
  product: Product;
  peerMallName: string;
  peerMallKey: string;
  onBack: () => void;
  isOwner?: boolean;
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
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  
  // 가격 계산 로직
  const originalPrice = Number(product.price || 0);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const finalPrice = discountPrice || originalPrice;
  const discountPercent = discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  // 이미지 배열 처리 (실제 콘텐츠 우선 사용)
  const productImages = product.imageUrl ? [product.imageUrl] : ['/placeholder-product.jpg'];

  // 리뷰 데이터 (실제 서비스에서는 API로 가져올 것)
  const mockReviews = [
    {
      id: 1,
      user: "김민수",
      rating: 5,
      comment: "정말 만족스러운 제품이에요! 배송도 빠르고 품질도 좋네요 👍",
      date: "2025-05-28",
      helpful: 12
    },
    {
      id: 2,
      user: "박지영",
      rating: 4,
      comment: "가격 대비 훌륭해요. 다만 포장이 조금 아쉬웠어요.",
      date: "2025-05-25",
      helpful: 8
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"
    >
      {/* **네비게이션 헤더:** */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">목록으로 돌아가기</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsWishlisted(!isWishlisted)}>
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* **이미지 섹션:** */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative group">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.jpg';
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setIsImageZoomed(true)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            {productImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  disabled={selectedImageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                  disabled={selectedImageIndex === productImages.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* **제품 정보 섹션:** */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* 제품명 및 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category || '일반'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-3 w-3" />
                <span>조회 {Math.floor(Math.random() * 1000) + 100}</span>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 4.5)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating || 4.5} ({product.reviewCount || 0}개 리뷰)
                </span>
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="space-y-2">
            {discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-sm font-bold">
                  {discountPercent}% 할인
                </Badge>
                <span className="text-lg text-gray-500 line-through">
                  ₩{originalPrice.toLocaleString()}
                </span>
              </div>
            )}
            <div className="text-3xl font-bold text-gray-900">
              ₩{finalPrice.toLocaleString()}
            </div>
          </div>

          {/* 태그 */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 구매 옵션 */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">수량</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>총 금액</span>
                <span className="text-blue-600">
                  ₩{(finalPrice * quantity).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 구매 버튼 */}
          <div className="space-y-3">
            {product.saleUrl ? (
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 text-lg"
                onClick={() => window.open(product.saleUrl, '_blank')}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                외부 사이트에서 구매하기
              </Button>
            ) : (
              <>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  장바구니에 담기
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 text-lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  바로 구매하기
                </Button>
              </>
            )}
          </div>

          {/* 배송/보장 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4 text-green-600" />
              <span>무료배송</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>품질보장</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Gift className="h-4 w-4 text-purple-600" />
              <span>선물포장</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* **상세 정보 탭:** */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'description', label: '상품상세', icon: Info },
            { key: 'reviews', label: '리뷰', icon: MessageCircle },
            { key: 'shipping', label: '배송정보', icon: Truck }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => setActiveTab(tab.key as any)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.key === 'reviews' && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {mockReviews.length}
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
            className="min-h-[200px]"
          >
            {activeTab === 'description' && (
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {product.description || "아직 상세 설명이 등록되지 않았습니다."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <ThumbsUp className="h-3 w-3" />
                          도움됨 {review.helpful}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full">
                  리뷰 더 보기
                </Button>
              </div>
            )}

            {activeTab === 'shipping' && (
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">배송 정보</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 배송비: 무료배송</li>
                        <li>• 배송기간: 1-2일 (영업일 기준)</li>
                        <li>• 배송지역: 전국 (일부 도서산간 제외)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">교환/반품</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 교환/반품 기간: 수령 후 7일 이내</li>
                        <li>• 교환/반품 비용: 무료 (단순변심 시 고객부담)</li>
                        <li>• 교환/반품 불가: 개봉 후 사용한 상품</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* **판매자 정보:** */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {peerMallName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{peerMallName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>P2P 마켓플레이스</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                스토어 방문하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailComponent;