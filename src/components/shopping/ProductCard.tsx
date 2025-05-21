
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

  // Format price with Korean currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${formatPrice(discountPrice || price)}`,
        url: window.location.origin + `/product/${id}`
      }).catch(err => console.log('Error sharing', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/product/${id}`)
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
        <Link to={`/product/${id}`}>
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
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
          {isBestSeller && (
            <Badge className="bg-yellow-500 text-white">베스트셀러</Badge>
          )}
          {isNew && (
            <Badge className="bg-green-500 text-white">신규</Badge>
          )}
          {isRecommended && (
            <Badge className="bg-blue-600 text-white flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              추천
            </Badge>
          )}
          {isCertified && (
            <Badge className="bg-purple-600 text-white">인증</Badge>
          )}
          {discountPrice && (
            <Badge className="bg-red-500 text-white">{discountPercentage}% 할인</Badge>
          )}
        </div>
      </div>
      
      <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 p-4' : ''}`}>
        <CardContent className={`${viewMode === 'list' ? 'p-0' : 'p-4'} pt-4`}>
          <Link to={`/peermall/${peermallId || '#'}`} className="hover:text-accent-100">
            <div className="text-xs text-text-200 mb-1 hover:underline">{peermallName}</div>
          </Link>
          <Link to={`/product/${id}`} className="hover:text-primary-300">
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" side="top">
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex justify-start"
                    onClick={(e) => {
                      e.preventDefault();
                      setMessageModalOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-600" />
                    문의하기
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex justify-start"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShare(e);
                    }}
                  >
                    <Share className="h-4 w-4 mr-2 text-gray-600" />
                    공유하기
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex justify-start"
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlist(e);
                    }}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                    {isWishlisted ? '찜하기 취소' : '찜하기'}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
