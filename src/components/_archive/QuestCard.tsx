
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Quest } from './types';

interface QuestCardProps {
  quest: Quest;
  onClick: () => void;
}

export const QuestCard = ({ quest, onClick }: QuestCardProps) => {
  // Calculate progress percentage
  const progressPercentage = quest.goal ? (quest.progress / quest.goal) * 100 : 0;
  
  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col bg-white cursor-pointer group" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold text-purple-700 group-hover:text-purple-900">
            {quest.title}
          </CardTitle>
          <Badge 
            variant={quest.type === 'community' ? "default" : "secondary"} 
            className={`ml-2 shrink-0 text-xs ${quest.type === 'community' ? 'bg-purple-100 text-purple-800' : ''}`}
          >
            {quest.type === 'community' ? `${quest.participants}명 참여` : '개인 목표'}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs text-text-200 pt-1">
          <Calendar className="h-3 w-3 mr-1" /> 마감: {quest.deadline}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pt-0 pb-3">
        <p className="text-xs text-text-200 mb-3 line-clamp-2">{quest.description}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-medium">
            <span>진행도:</span>
            <span>{quest.progress ?? 0} / {quest.goal}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-1.5 bg-purple-100 [&>div]:bg-purple-500" 
          />
          <div className="text-center text-[10px] text-purple-600 font-semibold pt-1">
            보상: {quest.reward}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t bg-purple-50">
        <Button 
          size="sm" 
          className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs h-8"
        >
          <Zap className="h-3.5 w-3.5 mr-1" /> 참여하기
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestCard;
