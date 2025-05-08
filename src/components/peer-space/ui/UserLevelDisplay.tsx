
import React from 'react';
import { PeerSpaceData } from "../types";

interface UserLevelDisplayProps {
  userData: PeerSpaceData;
  size?: 'sm' | 'md' | 'lg';
  showExperience?: boolean;
}

const UserLevelDisplay: React.FC<UserLevelDisplayProps> = ({ 
  userData, 
  size = 'md', 
  showExperience = true 
}) => {
  const { level = 1, experience = 0, nextLevelExperience = 100 } = userData;
  
  // Calculate progress percentage
  const progress = Math.min(100, Math.floor((experience / nextLevelExperience) * 100));
  
  return (
    <div className="flex items-center gap-2">
      <div className={`
        rounded-full bg-primary-300 text-white font-bold
        ${size === 'sm' ? 'w-6 h-6 text-xs' : 
          size === 'lg' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm'}
        flex items-center justify-center
      `}>
        {level}
      </div>
      
      {showExperience && (
        <div className="flex-1">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-300 rounded-full h-2" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {experience} / {nextLevelExperience} XP
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLevelDisplay;
