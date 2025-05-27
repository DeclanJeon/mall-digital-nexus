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

interface ProductCardProps {
  id: string | number;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peermallName?: string;
  peermallId?: string;
  category?: string;
  tags?: string[];
  viewMode: 'grid' | 'list';
  cardSize?: 'small' | 'medium' | 'large';
  seller?: {
    id: string;
    name: string;
    image?: string;
  };
  onAddFriend?: (sellerId: string, sellerName: string, sellerImage?: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  discountPrice,
  imageUrl,
  rating,
  reviewCount,
  peermallName,
  peermallId,
  category,
  tags,
  viewMode,
  cardSize = 'medium',
  seller,
  onAddFriend
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistHover, setWishlistHover] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const [isHovered, setIsHovered] = useState(false);

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
    console.log('Purchase product:', id);
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
        <CardHeader className="p-0 relative">
          <div className={cn("overflow-hidden relative", getImageClasses(), viewMode === 'list' ? 'rounded-l-lg' : 'rounded-t-lg')}>
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            
            {/* 호버 오버레이 */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex gap-2"
                  >
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* 찜하기 버튼 */}
            <motion.button 
              className={cn(
                'absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full',
                'shadow-lg hover:shadow-xl transition-all duration-200',
                isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-400'
              )}
              onClick={toggleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={cn('w-4 h-4', isWishlisted && 'fill-red-500')} 
              />
            </motion.button>

            {/* 할인 뱃지 */}
            {discountPrice && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold">
                  {Math.round(((price - discountPrice) / price) * 100)}% OFF
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className={cn("flex-1", viewMode === 'list' ? 'p-4 flex flex-col justify-between' : 'p-4')}>
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn(
              "font-bold line-clamp-2",
              cardSize === 'small' ? 'text-sm' : cardSize === 'large' ? 'text-lg' : 'text-base'
            )}>
              {title}
            </h3>
            
            {viewMode !== 'list' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {seller && onAddFriend && (
                    <DropdownMenuItem onClick={handleAddFriend} disabled={isFriend}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>{isFriend ? '친구 추가됨' : '친구 추가'}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>메시지</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

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

          {cardSize !== 'small' && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
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
              <Button variant="outline" className="flex-1" size="sm">
                상세보기
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500" size="sm">
                구매하기
              </Button>
            </div>
          ) : cardSize === 'small' ? (
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
              size="sm"
              onClick={handlePurchase}
            >
              구매
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" size="sm">
                상세보기
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                size="sm"
                onClick={handlePurchase}
              >
                구매하기
              </Button>
            </div>
          )}
        </CardFooter>

        {/* 찜 목록 팝업 */}
        <AnimatePresence>
          {showWishlist && (
            <motion.div 
              className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col p-5 z-20 shadow-2xl border border-purple-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  찜 목록에 추가됨! 💜
                </h4>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowWishlist(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-4xl mb-3"
                >
                  💖
                </motion.div>
                <p className="text-sm text-gray-600 mb-4">
                  {title}이(가) 찜 목록에 추가되었어요!
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  onClick={() => setShowWishlist(false)}
                >
                  계속 쇼핑하기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
