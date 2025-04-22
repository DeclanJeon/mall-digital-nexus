import React from 'react';
import { Button } from '@/components/ui/button';
import { PeerSpaceData } from './types';

interface LearningHubTopBarProps {
  peerSpaceData: PeerSpaceData;
  isOwner: boolean;
  isFollowing: boolean;
  isNotificationOn: boolean;
  toggleNotification: () => void;
  onFollow: () => void;
  onMessage: () => void;
  onQRGenerate: () => void;
  onSettings: () => void;
}

const LearningHubTopBar: React.FC<LearningHubTopBarProps> = ({
  peerSpaceData,
  isOwner,
  isFollowing,
  isNotificationOn,
  toggleNotification,
  onFollow,
  onMessage,
  onQRGenerate,
  onSettings
}) => {
  return (
    <div className="bg-white border-b py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{peerSpaceData.title}</h1>
        </div>
        <div className="flex space-x-2">
          {!isOwner && (
            <Button 
              variant={isFollowing ? 'outline' : 'default'}
              onClick={onFollow}
            >
              {isFollowing ? '팔로우 취소' : '팔로우'}
            </Button>
          )}
          <Button variant="ghost" onClick={onSettings}>
            설정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LearningHubTopBar;
