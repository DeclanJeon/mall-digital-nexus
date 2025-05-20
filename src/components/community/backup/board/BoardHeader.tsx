
// src/components/community/board/BoardHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { BoardHeaderProps } from '../types';

const BoardHeader: React.FC<BoardHeaderProps> = ({
  selectedLocation,
  onReturnToUniverse,
  onShowNewPostForm
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Button
          onClick={onReturnToUniverse}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-sky-300" />
          <span className="text-white font-medium">
            {selectedLocation?.name}
          </span>
        </div>
      </div>

      {onShowNewPostForm && (
        <Button onClick={onShowNewPostForm} className="bg-sky-600 hover:bg-sky-700 text-white">
          <Plus className="mr-1 h-4 w-4" />
          새 글 작성
        </Button>
      )}
    </div>
  );
};

export default BoardHeader;
