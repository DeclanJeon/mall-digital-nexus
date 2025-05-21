
import React, { useState } from "react";
import { Heart, Star, User, BadgeCheck, ThumbsUp, MessageSquare, Share, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

interface PeermallCardProps {
  id: string;
  title: string;
  owner: string;
  description: string;
  imageUrl: string;
  likes: number;
  rating: number;
  followers: number;
  tags: string[];
  isPopular?: boolean;          // 인기 피어몰
  isFamilyCertified?: boolean;  // 패밀리 멤버 인증
  isRecommended?: boolean;      // 추천 피어몰
  className?: string;
}

const PeerMallCard: React.FC<PeermallCardProps> = ({
  id,
  title,
  owner,
  description,
  imageUrl,
  likes = 0,
  rating = 0,
  followers = 0,
  tags = [],
  isPopular = false,
  isFamilyCertified = false,
  isRecommended = false,
  className,
}) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${owner}의 피어몰`,
        url: `${window.location.origin}/space/${id}`
      }).catch(err => console.log('Error sharing', err));
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(`${window.location.origin}/space/${id}`)
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
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "찜하기가 취소되었습니다" : "찜하기가 추가되었습니다",
      description: isLiked ? "관심 목록에서 제거되었습니다" : "관심 목록에 추가되었습니다"
    });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("메시지 전송:", id, messageText);
      toast({
        title: "메시지가 전송되었습니다",
        description: `${owner}님에게 메시지를 보냈습니다.`
      });
      setMessageText("");
      setMessageModalOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "메시지를 입력해주세요",
        description: "메시지 내용을 입력하셔야 합니다."
      });
    }
  };

  return (
    <Link to={`/space/${id}`} className="block h-full">
      <div 
        className={cn(
          "group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 h-full",
          isPopular && "ring-2 ring-accent-dark ring-offset-2",
          className
        )}
      >
        {/* Card image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* === 뱃지 영역 === */}
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            {isPopular && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                인기
              </span>
            )}
            {isRecommended && (
              <span className="bg-blue-600/90 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                <ThumbsUp className="h-3.5 w-3.5" />
                추천
              </span>
            )}
            {isFamilyCertified && (
              <span className="bg-green-500/90 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                <BadgeCheck className="h-3.5 w-3.5" />
                인증
              </span>
            )}
          </div>
          {/* === 뱃지 영역 끝 === */}

          {/* Action buttons - Now in a popover menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" side="bottom" align="end">
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLike(e);
                  }}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                  {isLiked ? '찜하기 취소' : '찜하기'}
                </Button>
                
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
                  메시지 보내기
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
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Card content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-peermall-text line-clamp-1">{title}</h3>
          </div>
          
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center mb-3">
            <User className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-500">{owner}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Heart className={`h-3.5 w-3.5 mr-1 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                <span className="text-xs text-gray-500">{likes + (isLiked ? 1 : 0)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-end gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Message Modal */}
      <Modal open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <ModalContent className="sm:max-w-[425px]">
          <ModalHeader>
            <ModalTitle>{owner}님에게 메시지 보내기</ModalTitle>
          </ModalHeader>
          <div className="p-4">
            <Textarea 
              placeholder="메시지를 입력하세요..." 
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
    </Link>
  );
};

export default PeerMallCard;
