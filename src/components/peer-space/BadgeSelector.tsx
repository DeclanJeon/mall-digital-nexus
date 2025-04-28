
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { BadgeCheck, Award, Star, Heart, ThumbsUp } from 'lucide-react';

// Define available badges
const AVAILABLE_BADGES = [
  '신뢰할 수 있는 판매자',
  '친절한 서비스',
  '빠른 배송',
  '좋은 품질',
  '가성비 좋음',
  '전문적인 지식',
  '독창적인 제품',
  '정확한 정보',
];

interface BadgeSelectorProps {
  onBadgeAdd: (badge: string) => void;
  currentBadges: string[];
}

const BadgeSelector: React.FC<BadgeSelectorProps> = ({ onBadgeAdd, currentBadges }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const handleSelectBadge = (badge: string) => {
    setSelectedBadge(badge);
  };

  const handleAddBadge = () => {
    if (selectedBadge) {
      onBadgeAdd(selectedBadge);
      setSelectedBadge(null);
      setIsDialogOpen(false);
    }
  };

  const isBadgeAlreadyAdded = (badge: string): boolean => {
    return currentBadges.includes(badge);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          size="sm"
        >
          <BadgeCheck className="h-4 w-4" />
          뱃지 달기
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>피어스페이스에 뱃지 달기</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {AVAILABLE_BADGES.map((badge) => {
            const isAdded = isBadgeAlreadyAdded(badge);
            
            return (
              <div
                key={badge}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  isAdded 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : selectedBadge === badge 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => !isAdded && handleSelectBadge(badge)}
              >
                <div className="flex items-center gap-2">
                  {badge === '신뢰할 수 있는 판매자' && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                  {badge === '친절한 서비스' && <Heart className="h-4 w-4 text-red-500" />}
                  {badge === '빠른 배송' && <ThumbsUp className="h-4 w-4 text-green-500" />}
                  {badge === '좋은 품질' && <Star className="h-4 w-4 text-yellow-500" />}
                  {badge === '가성비 좋음' && <ThumbsUp className="h-4 w-4 text-purple-500" />}
                  {badge === '전문적인 지식' && <Award className="h-4 w-4 text-emerald-500" />}
                  {badge === '독창적인 제품' && <Star className="h-4 w-4 text-indigo-500" />}
                  {badge === '정확한 정보' && <BadgeCheck className="h-4 w-4 text-cyan-500" />}
                  <span>{badge}</span>
                </div>
                {isAdded && <span className="text-xs text-gray-500 italic">이미 추가됨</span>}
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button 
            variant="ghost"
            onClick={() => setIsDialogOpen(false)}
          >
            취소
          </Button>
          <Button 
            onClick={handleAddBadge}
            disabled={!selectedBadge}
          >
            뱃지 추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeSelector;
