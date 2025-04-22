// 기존 QuestDetailsModal.tsx 내용을 복사
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award, Trophy } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  deadline: string;
}

interface LearningHubQuestDetailsModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LearningHubQuestDetailsModal = ({ quest, isOpen, onOpenChange }: LearningHubQuestDetailsModalProps) => {
  if (!quest) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Trophy className="mr-2 text-yellow-500 h-6 w-6" />
            {quest.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">퀘스트 설명</h3>
            <p className="text-text-200">{quest.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">진행 상황</h3>
            <div className="space-y-2">
              <Progress value={quest.progress} className="h-2" />
              <div className="flex justify-between text-sm text-text-200">
                <span>{quest.progress}% 완료</span>
                <span>{quest.deadline}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">보상</h3>
            <div className="flex items-center p-3 bg-primary-100 rounded-md">
              <Award className="h-5 w-5 text-primary-300 mr-2" />
              <span>{quest.reward}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button className="w-full">퀘스트 진행하기</Button>
            <Button variant="outline" className="w-1/3">도움말</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearningHubQuestDetailsModal;
