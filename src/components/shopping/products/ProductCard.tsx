import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageCircle, Phone, Check, ChevronLeft, MoreVertical, UserPlus, Star, Eye, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductCardProps } from "@/types/product";
import { useNavigate, useParams } from 'react-router-dom';

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  id,
  name,
  title,
  description,
  price,
  discountPrice,
  imageUrl,
  rating,
  reviewCount,
  peerSpaceAddress,
  peerMallKey,
  category,
  tags,
  viewMode,
  cardSize = 'medium',
  seller,
  saleUrl,
  onAddFriend,
  onDetailView,
  productKey,
  create_date = new Date().toISOString(),
}) => {
  const effectiveProductId = productId || id?.toString();
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistHover, setWishlistHover] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const { address } = useParams();

  // 텍스트에서 코드 블록이나 특수 문자 제거하는 함수
  const sanitizeText = (text: string) => {
    if (!text) return '';
    
    // 코드 블록, 특수 문자, HTML 태그 등을 제거
    return text
      .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
      .replace(/`[^`]*`/g, '') // 인라인 코드 제거
      .replace(/<[^>]*>/g, '') // HTML 태그 제거
      .replace(/[{}[\]]/g, '') // 중괄호, 대괄호 제거
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .trim();
  };

  // 피어몰 이름 길이 제한 함수
  const truncatePeerMallName = (name: string, maxLength: number = 12) => {
    if (!name) return '';
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const getCardClasses = () => {
    if (viewMode === 'list') {
      return 'flex flex-row h-48 w-full';
    }
    
    switch (cardSize) {
      case 'small':
        return 'h-full flex flex-col';
      case 'large':
        return 'h-full flex flex-col min-h-[400px]';
      default:
        return 'h-full flex flex-col min-h-[350px]';
    }
  };

  const getImageClasses = () => {
    if (viewMode === 'list') {
      return 'w-48 h-full';
    }
    
    switch (cardSize) {
      case 'small':
        return 'aspect-square h-32';
      case 'large':
        return 'aspect-square h-64';
      default:
        return 'aspect-square h-48';
    }
  };

  const handlePurchase = () => {
    console.log('🛒 구매하기 클릭 - saleUrl:', saleUrl);

    if (saleUrl && saleUrl.trim() !== '') {
      const targetUrl = saleUrl.startsWith('http') ? saleUrl : `https://${saleUrl}`;
      console.log('🔗 이동할 URL:', targetUrl);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('⚠️ 판매 URL이 없습니다.');
      alert('판매 링크가 설정되지 않았습니다.');
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWishlistStatus = !isWishlisted;
    setIsWishlisted(newWishlistStatus);
    
    if (newWishlistStatus) {
      setShowWishlist(true);
    }
    
    console.log('Wishlist status:', newWishlistStatus, 'for product:', id);
  };

  const handleAddFriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!seller || !onAddFriend) return;
    
    setFriendStatus('adding');
    
    setTimeout(() => {
      onAddFriend(seller.id, seller.name, seller.image);
      setIsFriend(true);
      setFriendStatus('added');
      
      setTimeout(() => setFriendStatus('idle'), 2000);
    }, 1000);
  };

  const handleDetailView = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onDetailView?.(productKey); // ✅ 한 번만 호출
  };

  // 정제된 설명 텍스트
  const cleanDescription = sanitizeText(description);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cn(
        getCardClasses(),
        "overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300",
        "bg-gradient-to-br from-white to-gray-50/30",
        isHovered && "ring-2 ring-purple-200"
      )}>
        <CardHeader className={`p-0 relative ${effectiveProductId}`}>
          <div className={cn("overflow-hidden relative", getImageClasses(), viewMode === 'list' ? 'rounded-l-lg' : 'rounded-t-lg')}>
            <img  
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        </CardHeader>

        <CardContent className={cn("flex-1", viewMode === 'list' ? 'p-4 flex flex-col justify-between' : 'p-4')}>
          <div className="flex justify-between items-start mb-1">
            <h3 className={cn(
              "font-bold line-clamp-2",
              cardSize === 'small' ? 'text-sm' : cardSize === 'large' ? 'text-lg' : 'text-base'
            )}>
              {name}
            </h3>
            
            {viewMode !== 'list' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDetailView}>
                    <Eye className="mr-2 h-4 w-4" />
                    상세 보기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePurchase}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    구매하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* 피어몰 이름 뱃지 - 길이 제한 적용 */}
          {peerSpaceAddress && (
            <Badge 
              variant="outline" 
              className="mb-2 text-xs text-gray-600 border-gray-300 max-w-fit"
              title={peerSpaceAddress} // 전체 이름을 툴팁으로 표시
            >
              {truncatePeerMallName(peerSpaceAddress)}
            </Badge>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "font-bold",
              cardSize === 'small' ? 'text-sm' : 'text-lg'
            )}>
              {discountPrice ? (
                <>
                  <span className="text-red-500">₩{discountPrice.toLocaleString()}</span>
                  <span className="text-gray-400 line-through ml-2 text-sm">₩{price.toLocaleString()}</span>
                </>
              ) : (
                `₩${price.toLocaleString()}`
              )}
            </span>
          </div>

          {/* 상품 설명 - 코드 제거 및 2줄 제한 */}
          {cardSize !== 'small' && cleanDescription && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {cleanDescription}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* 평점 관련 코드는 주석 처리된 상태 유지 */}
            </div>
            
            {cardSize === 'large' && (
              <Badge variant="secondary" className="text-xs">
                무료배송
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className={cn("pt-0", viewMode === 'list' ? 'p-4' : 'p-4')}>
          {viewMode === 'list' ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleDetailView}
              >
                상세보기
              </Button>
              <Button 
                size="sm" 
                className={cn(
                  "w-full text-sm font-semibold py-2 rounded-lg transition-all duration-300",
                  !saleUrl && "opacity-50 cursor-not-allowed"
                )}
                onClick={handlePurchase}
                disabled={!saleUrl || saleUrl.trim() === ''}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> 
                {saleUrl ? '구매하기' : '링크 없음'}
              </Button>
            </div>
          ) : cardSize === 'small' ? (
            <Button 
              size="sm" 
              className={cn(
                "w-full text-sm font-semibold py-2 rounded-lg transition-all duration-300",
                !saleUrl && "opacity-50 cursor-not-allowed"
              )}
              onClick={handlePurchase}
              disabled={!saleUrl || saleUrl.trim() === ''}
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> 
              {saleUrl ? '구매' : '링크 없음'}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleDetailView}
              >
                상세보기
              </Button>
              <Button 
                size="sm" 
                className={cn(
                  "w-full text-sm font-semibold py-2 rounded-lg transition-all duration-300",
                  !saleUrl && "opacity-50 cursor-not-allowed"
                )}
                onClick={handlePurchase}
                disabled={!saleUrl || saleUrl.trim() === ''}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> 
                {saleUrl ? '구매하기' : '링크 없음'}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;