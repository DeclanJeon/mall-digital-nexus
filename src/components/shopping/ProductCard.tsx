import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, MessageSquare, DollarSign, Share, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter
} from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  id: number | string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  peermallName: string;
  peermallId?: string;
  category: string;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  isCertified?: boolean;
  viewMode: 'grid' | 'list';
}

const ProductCard = ({
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
  isBestSeller,
  isNew,
  isRecommended,
  isCertified,
  viewMode
}: ProductCardProps) => {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Generate all badges but only show limited number in main view
  const allBadges = [
    isBestSeller && { type: "베스트셀러", color: "bg-yellow-500 text-white" },
    isNew && { type: "신규", color: "bg-green-500 text-white" },
    isRecommended && { type: "추천", color: "bg-blue-600 text-white flex items-center gap-1" },
    isCertified && { type: "인증", color: "bg-purple-600 text-white" },
    discountPrice && { type: `${Math.round(((price - discountPrice) / price) * 100)}% 할인`, color: "bg-red-500 text-white" },
  ].filter(Boolean);

  // Display badges - limit to 2 for main display
  const visibleBadges = allBadges.slice(0, 2);
  const hiddenBadges = allBadges.slice(2);

  // Format price with Korean currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${formatPrice(discountPrice || price)}`,
        url: window.location.origin + `/space/${peermallId}/product/${id}`
      }).catch(err => console.log('Error sharing', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/space/${peermallId}/product/${id}`)
        .then(() => toast({
          title: "링크가 복사되었습니다",
          description: "클립보드에 복사되었습니다."
        }))
        .catch(() => toast({
          variant: "destructive", 
          title: "링크 복사 실패",
          description: "링크 복사에 실패했습니다."
        }));
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "찜하기가 취소되었습니다" : "찜하기가 추가되었습니다",
      description: isWishlisted ? "관심 목록에서 제거되었습니다" : "관심 목록에 추가되었습니다"
    });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("문의 메시지 전송:", id, messageText);
      toast({
        title: "문의가 전송되었습니다",
        description: `${peermallName}에 문의가 전송되었습니다.`
      });
      setMessageText("");
      setMessageModalOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "메시지를 입력해주세요",
        description: "문의 내용을 입력하셔야 합니다."
      });
    }
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "구매 처리중",
      description: "구매 페이지로 이동합니다."
    });
    // 구매 로직 추가
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow border border-slate-100 ${
      viewMode === 'list' ? 'flex flex-row h-48' : 'h-full'
    }`}>
      <div className={`relative ${
        viewMode === 'list' ? 'w-48 h-full' : 'h-48'
      }`}>
        <Link to={`/space/${peermallId}/product/${id}`}>
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        </Link>
        
        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full w-8 h-8 hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
            handleWishlist(e);
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-accent-100'}`} />
        </Button>
        
        {/* Limited badges - max 2 */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
          {visibleBadges.map((badge, index) => (
            <Badge key={index} className={badge.color}>
              {badge.type === "추천" && <Star className="h-3 w-3 fill-current" />}
              {badge.type}
            </Badge>
          ))}
          
          {/* Show more badge indicator if more than 2 badges */}
          {hiddenBadges.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge className="bg-gray-500/80 text-white cursor-pointer hover:bg-gray-600 transition-colors">
                  +{hiddenBadges.length}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {hiddenBadges.map((badge, index) => (
                  <DropdownMenuItem key={index}>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${badge.color}`}>
                      {badge.type === "추천" && <Star className="h-3 w-3 fill-current mr-1" />}
                      {badge.type}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 p-4' : ''}`}>
        <CardContent className={`${viewMode === 'list' ? 'p-0' : 'p-4'} pt-4`}>
          <Link to={`/space/${peermallId}`} className="hover:text-accent-100">
            <div className="text-xs text-text-200 mb-1 hover:underline">{peermallName}</div>
          </Link>
          <Link to={`/space/${peermallId}/product/${id}`} className="hover:text-primary-300">
            <h3 className="font-bold text-primary-300 mb-1 line-clamp-1">{title}</h3>
          </Link>
          <p className="text-text-200 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center text-yellow-500 mr-2">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1 text-xs">{rating}</span>
            </div>
            <span className="text-text-200 text-xs">({reviewCount} 리뷰)</span>
          </div>
          
          <div className="flex items-center mb-3">
            <DollarSign className="h-4 w-4 text-accent-100" />
            <div className="flex items-baseline gap-2">
              {discountPrice ? (
                <>
                  <span className="font-bold">{formatPrice(discountPrice)}</span>
                  <span className="text-text-200 text-sm line-through">{formatPrice(price)}</span>
                </>
              ) : (
                <span className="font-bold">{formatPrice(price)}</span>
              )}
            </div>
          </div>
          
          {/* Tags */}
          {viewMode === 'list' && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className={`${viewMode === 'list' ? 'px-0 mt-auto' : 'px-4 pb-4 pt-0'}`}>
          <div className="flex w-full gap-2">
            <Button 
              className="flex-1 bg-accent-100 hover:bg-accent-200"
              onClick={(e) => {
                e.preventDefault();
                handleBuy(e);
              }}
            >
              구매하기
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  setMessageModalOpen(true);
                }}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  문의하기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  handleShare(e);
                }}>
                  <Share className="h-4 w-4 mr-2" />
                  공유하기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  handleWishlist(e);
                }}>
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                  {isWishlisted ? '찜하기 취소' : '찜하기'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </div>
      
      {/* Message Modal */}
      <Modal open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <ModalContent className="sm:max-w-[425px]">
          <ModalHeader>
            <ModalTitle>{peermallName}에 문의하기</ModalTitle>
          </ModalHeader>
          <div className="p-4">
            <Textarea 
              placeholder="문의 내용을 입력하세요..." 
              className="resize-none h-32"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setMessageModalOpen(false)}>취소</Button>
            <Button onClick={handleSendMessage}>보내기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default ProductCard;
