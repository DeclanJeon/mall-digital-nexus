import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageCircle, Phone, Check, ChevronLeft, MoreVertical, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductCardProps {
  id: string | number; // number도 허용
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  viewMode: 'grid' | 'list';
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
  viewMode,
  seller,
  onAddFriend
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistHover, setWishlistHover] = useState(false);
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'idle' | 'adding' | 'added'>('idle');

  const handlePurchase = () => {
    // TODO: Implement purchase logic
    console.log('Purchase product:', id);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWishlistStatus = !isWishlisted;
    setIsWishlisted(newWishlistStatus);
    
    // Visual feedback
    if (newWishlistStatus) {
      setWishlistPulse(true);
      setShowWishlist(true);
    }
    
    // TODO: Sync with backend
    console.log('Wishlist status:', newWishlistStatus, 'for product:', id);
    
    // Reset pulse animation after it completes
    setTimeout(() => setWishlistPulse(false), 1000);
  };

  const handleMessage = () => {
    // TODO: Implement messaging logic
    console.log('Message seller about product:', id);
  };

  const handleCall = () => {
    // TODO: Implement call logic
    console.log('Call about product:', id);
  };

  const handleAddFriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!seller || !onAddFriend) return;
    
    setFriendStatus('adding');
    
    // Simulate API call
    setTimeout(() => {
      onAddFriend(seller.id, seller.name, seller.image);
      setIsFriend(true);
      setFriendStatus('added');
      
      // Reset status after showing success
      setTimeout(() => setFriendStatus('idle'), 2000);
    }, 1000);
  };

  const toggleWishlistView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWishlist(!showWishlist);
    // TODO: Fetch wishlist items when opening the view
    if (!showWishlist) {
      console.log('Fetching wishlist items...');
    }
  };
  return (
    <Card className={viewMode === 'grid' ? 'h-full flex flex-col' : 'w-full'}>
      <CardHeader className="p-0 relative">
        <div className="aspect-square overflow-hidden rounded-t-lg relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <motion.button 
            className={cn(
              'absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full',
              'shadow-md hover:shadow-lg transition-all duration-200',
              'flex flex-col items-center justify-center',
              'group/wishlist',
              isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-400',
              wishlistPulse && 'animate-pulse'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={toggleWishlist}
            onMouseEnter={() => setWishlistHover(true)}
            onMouseLeave={() => setWishlistHover(false)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div 
              className="relative"
              animate={wishlistHover ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Heart 
                className={cn(
                  'w-5 h-5 transition-colors',
                  isWishlisted ? 'fill-red-500' : 'group-hover/wishlist:fill-red-100',
                  wishlistPulse && 'scale-125'
                )} 
                strokeWidth={2}
              />
              {isWishlisted && (
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                />
              )}
            </motion.div>
            <motion.span 
              className={cn(
                'text-[10px] font-medium mt-0.5',
                isWishlisted ? 'text-red-500' : 'text-gray-600 group-hover/wishlist:text-red-400',
                'transition-colors'
              )}
            >
              {isWishlisted ? '찜함' : '찜하기'}
            </motion.span>
          </motion.button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg flex-1 pr-2">{title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {seller && onAddFriend && (
                <DropdownMenuItem 
                  onClick={handleAddFriend} 
                  disabled={isFriend || friendStatus === 'adding'}
                  className={isFriend ? 'bg-green-50' : ''}
                >
                  {friendStatus === 'adding' ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      <span>추가 중...</span>
                    </>
                  ) : isFriend ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-green-600">친구 추가됨</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>친구 추가하기</span>
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleMessage}>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>메시지 보내기</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCall}>
                <Phone className="mr-2 h-4 w-4" />
                <span>통화하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">
            {discountPrice ? (
              <>
                <span className="text-red-500">₩{discountPrice.toLocaleString()}</span>
                <span className="text-gray-400 line-through ml-2 text-sm">₩{price.toLocaleString()}</span>
              </>
            ) : (
              `₩${price.toLocaleString()}`
            )}
          </span>
          {discountPrice && (
            <Badge variant="destructive" className="text-xs">
              {Math.round(((price - discountPrice) / price) * 100)}%
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => console.log('View details:', id)}
            >
              상세 보기
            </Button>
            <Button 
              className="w-full"
              onClick={handlePurchase}
            >
              구매하기
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => console.log('View details:', id)}
            >
              상세 보기
            </Button>
            <Button 
              className="flex-1"
              onClick={handlePurchase}
            >
              구매하기
            </Button>
          </div>
        )}
      </CardFooter>
      
      {/* Wishlist Popup */}
      <AnimatePresence>
        {showWishlist && (
          <motion.div 
            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col p-5 z-20 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 -ml-2 mr-1"
                  onClick={() => setShowWishlist(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h4 className="text-lg font-semibold text-gray-800">찜 목록</h4>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWishlist(false);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              {/* Empty state */}
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-red-400" fill="currentColor" />
                </div>
                <h5 className="text-lg font-medium text-gray-800 mb-1">찜한 상품이 없어요</h5>
                <p className="text-sm text-gray-500 max-w-xs">상품을 찜하면 여기에 표시됩니다</p>
              </div>
              
              {/* Wishlist items would be mapped here */}
              {/* {wishlistItems.map(item => (
                <WishlistItem key={item.id} {...item} />
              ))} */}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                className="w-full py-6 text-base font-medium bg-red-500 hover:bg-red-600 transition-colors"
                onClick={() => {
                  // Handle wishlist action
                  setShowWishlist(false);
                }}
              >
                <Check className="h-5 w-5 mr-2" />
                <span>찜 목록 확인하기</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full mt-3 py-6 text-base font-medium hover:bg-gray-50"
                onClick={() => setShowWishlist(false)}
              >
                계속 쇼핑하기
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ProductCard;
