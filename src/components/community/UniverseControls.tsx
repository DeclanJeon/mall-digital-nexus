// src/components/community/UniverseControls.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Plus, Circle as CircleIcon } from 'lucide-react'; // Circle 아이콘 이름 충돌 방지
import { UniverseControlsProps } from './types';

const UniverseControls: React.FC<UniverseControlsProps> = ({
  onZoomIn,
  onZoomOut,
  isSelectingPosition,
  onStartPlanetCreation,
  onCancelPlanetCreation,
}) => {
  return (
    <div className="absolute bottom-8 right-8 flex flex-col space-y-2 z-20">
      <Button onClick={onZoomIn} size="icon" variant="outline" className="bg-black/50 border-white/20 hover:bg-black/70" aria-label="확대">
        <ZoomIn className="h-5 w-5" />
      </Button>
      <Button onClick={onZoomOut} size="icon" variant="outline" className="bg-black/50 border-white/20 hover:bg-black/70" aria-label="축소">
        <ZoomOut className="h-5 w-5" />
      </Button>
      <Button
        onClick={isSelectingPosition ? onCancelPlanetCreation : onStartPlanetCreation}
        size="icon"
        variant="outline"
        className={`bg-black/50 border-white/20 hover:bg-black/70 ${isSelectingPosition ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
        aria-label={isSelectingPosition ? "행성 생성 취소" : "새 행성 생성"}
      >
        {isSelectingPosition ? <CircleIcon className="h-5 w-5 text-blue-400 animate-pulse" /> : <Plus className="h-5 w-5" />}
      </Button>
      {isSelectingPosition && (
        <Button onClick={onCancelPlanetCreation} size="sm" variant="destructive" className="text-xs">
          취소
        </Button>
      )}
    </div>
  );
};

export default UniverseControls;