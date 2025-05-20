import React from 'react';
import { Progress } from '@/components/ui/progress';
import { PeerSpaceData } from '../types';

interface UserLevelDisplayProps {
  userData: Partial<PeerSpaceData>;
  size?: 'sm' | 'md' | 'lg';
}

const UserLevelDisplay: React.FC<UserLevelDisplayProps> = ({ userData, size = 'md' }) => {
  const level = userData.level || 1;
  const experience = userData.experience || 0;
  const nextLevelExperience = userData.nextLevelExperience || 100;
  
  const progressPercentage = Math.min(100, (experience / nextLevelExperience) * 100);

  let fontSize = 'text-sm';
  let progressHeight = 'h-2';
  
  if (size === 'md') {
    fontSize = 'text-base';
    progressHeight = 'h-3';
  } else if (size === 'lg') {
    fontSize = 'text-lg';
    progressHeight = 'h-4';
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`font-semibold ${fontSize}`}>레벨 {level}</span>
        <span className="text-muted-foreground text-xs">{experience} / {nextLevelExperience} XP</span>
      </div>
      <Progress value={progressPercentage} className={progressHeight} />
    </div>
  );
};

export default UserLevelDisplay;
