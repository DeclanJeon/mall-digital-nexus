
import React from 'react';
import { PeerSpaceData } from './types';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserLevelDisplayProps {
  peerSpaceData: PeerSpaceData;
}

export const UserLevelDisplay = ({ peerSpaceData }: UserLevelDisplayProps) => {
  return (
    <section className="bg-gradient-to-r from-primary-300 to-primary-400 text-white py-6 px-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <div className="text-center md:text-left md:mr-8">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 text-yellow-300 mr-2" />
              <h2 className="text-2xl font-bold">레벨 {peerSpaceData.level}</h2>
            </div>
            <p className="text-primary-100">학습 피어</p>
          </div>
          <div className="w-full md:w-64 mt-4 md:mt-0">
            <div className="flex justify-between mb-1 text-xs">
              <span>경험치</span>
              <span>{peerSpaceData.experience}%</span>
            </div>
            <Progress 
              value={peerSpaceData.experience} 
              className="h-2 bg-primary-200"
              indicatorColor="#FACC15" // yellow-300 equivalent
            />
            <div className="flex justify-between mt-1 text-xs text-primary-100">
              <Badge variant="outline" className="text-xs bg-primary-200/50 text-white border-primary-200">
                현재: {peerSpaceData.level}
              </Badge>
              <Badge variant="outline" className="text-xs bg-primary-200/50 text-white border-primary-200">
                다음 레벨까지: {100 - peerSpaceData.experience}%
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div className="flex flex-col items-center">
            <Award className="h-5 w-5 text-yellow-300 mb-1" />
            <p className="text-2xl font-bold">{peerSpaceData.achievements}</p>
            <p className="text-xs text-primary-100">획득한 업적</p>
          </div>
          <div className="flex flex-col items-center">
            <Target className="h-5 w-5 text-green-300 mb-1" />
            <p className="text-2xl font-bold">{peerSpaceData.completedChallenges || 0}</p>
            <p className="text-xs text-primary-100">완료한 챌린지</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="h-5 w-5 text-blue-300 mb-1" />
            <p className="text-2xl font-bold">{peerSpaceData.activeQuests || 0}</p>
            <p className="text-xs text-primary-100">진행 중인 퀘스트</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserLevelDisplay;
