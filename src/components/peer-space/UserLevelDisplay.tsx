
import { PeerSpaceData } from './types';
import { Progress } from '@/components/ui/progress';

interface UserLevelDisplayProps {
  peerSpaceData: PeerSpaceData;
}

export const UserLevelDisplay = ({ peerSpaceData }: UserLevelDisplayProps) => {
  return (
    <section className="bg-primary-300 text-white py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <div className="text-center md:text-left md:mr-8">
            <h2 className="text-2xl font-bold">레벨 {peerSpaceData.level}</h2>
            <p className="text-primary-100">학습 피어</p>
          </div>
          <div className="w-full md:w-64 mt-4 md:mt-0">
            <Progress value={peerSpaceData.experience} className="h-2 bg-primary-200" />
            <div className="flex justify-between mt-1 text-xs text-primary-100">
              <span>경험치: {peerSpaceData.experience}%</span>
              <span>다음 레벨까지</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{peerSpaceData.achievements}</p>
            <p className="text-xs text-primary-100">획득한 업적</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{peerSpaceData.completedChallenges}</p>
            <p className="text-xs text-primary-100">완료한 챌린지</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{peerSpaceData.activeQuests}</p>
            <p className="text-xs text-primary-100">진행 중인 퀘스트</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserLevelDisplay;
