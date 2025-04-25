
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  current: number;
  max: number;
  type: 'participants' | 'progress';
  className?: string;
}

export const ProgressIndicator = ({ current, max, type, className = '' }: ProgressIndicatorProps) => {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  
  return (
    <div className={`my-1 ${className}`}>
      <Progress 
        value={percentage} 
        className="h-1.5" 
      />
      <p className="text-[10px] text-text-200 mt-0.5">
        {type === 'participants' ? (
          `${current}/${max} 참여`
        ) : (
          `${current}/${max} 완료`
        )}
      </p>
    </div>
  );
};

export default ProgressIndicator;
