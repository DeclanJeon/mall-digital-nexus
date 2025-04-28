
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Award, ThumbsUp, Heart, Star, Gift, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BadgeSelectorProps {
  onBadgeAdd: (badge: string) => void;
  currentBadges: string[];
}

const BadgeSelector: React.FC<BadgeSelectorProps> = ({ onBadgeAdd, currentBadges }) => {
  const [isOpen, setIsOpen] = useState(false);

  const badges = [
    { id: 'trusted', name: '신뢰할 수 있는', icon: <Shield className="mr-2 h-4 w-4" /> },
    { id: 'recommended', name: '추천 피어', icon: <ThumbsUp className="mr-2 h-4 w-4" /> },
    { id: 'favorite', name: '즐겨찾는', icon: <Heart className="mr-2 h-4 w-4" /> },
    { id: 'topRated', name: '최고 등급', icon: <Star className="mr-2 h-4 w-4" /> },
    { id: 'premium', name: '프리미엄', icon: <Gift className="mr-2 h-4 w-4" /> }
  ];
  
  const handleAddBadge = (badgeId: string) => {
    if (currentBadges.includes(badgeId)) {
      toast({
        title: "이미 추가된 뱃지",
        description: "이미 추가한 뱃지입니다.",
        variant: "destructive",
      });
      return;
    }
    
    onBadgeAdd(badgeId);
    
    toast({
      title: "뱃지 추가됨",
      description: "뱃지가 성공적으로 추가되었습니다.",
    });
    
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Award className="mr-1 h-4 w-4" /> 뱃지 주기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {badges.map(badge => (
          <DropdownMenuItem
            key={badge.id}
            disabled={currentBadges.includes(badge.id)}
            onClick={() => handleAddBadge(badge.id)}
          >
            {badge.icon}
            {badge.name}
            {currentBadges.includes(badge.id) && " (추가됨)"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BadgeSelector;
