
import { Quest } from './types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface ActiveQuestsSectionProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
}

export const ActiveQuestsSection = ({ quests, onQuestClick }: ActiveQuestsSectionProps) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center text-primary-300">
        <Award className="mr-2 h-5 w-5" />
        진행 중인 퀘스트
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quests.slice(0, 3).map(quest => (
          <Card 
            key={quest.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onQuestClick(quest)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{quest.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-text-200 mb-3 line-clamp-2">{quest.description}</p>
              <div className="space-y-1">
                <Progress value={quest.progress} className="h-2" />
                <div className="flex justify-between text-xs text-text-200">
                  <span>{quest.progress}% 완료</span>
                  <span>{quest.deadline}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="text-sm font-medium flex items-center">
                <Award className="h-4 w-4 text-yellow-500 mr-1" />
                {quest.reward}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ActiveQuestsSection;
