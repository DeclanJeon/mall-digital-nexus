// src/components/community/PlanetInfoPanel.tsx
import React from 'react';
import { Users, MessageSquare } from 'lucide-react';
import { PlanetInfoPanelProps } from './types';

const PlanetInfoPanel: React.FC<PlanetInfoPanelProps> = ({ planet }) => {
  if (!planet) return null;

  return (
    <div className="absolute top-4 left-4 z-10 p-4 rounded-lg bg-black/60 backdrop-blur-md max-w-md animate-fade-in">
      <h2 className="text-xl font-bold mb-2">{planet.name}</h2>
      <p className="text-blue-300 mb-3 text-sm">{planet.description}</p>
      <div className="flex space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-green-400" />
          <span>{planet.activeUsers.toLocaleString()} 활동 사용자</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageSquare className="h-4 w-4 text-yellow-400" />
          <span>{planet.recentPosts.toLocaleString()} 최근 게시물</span>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfoPanel;