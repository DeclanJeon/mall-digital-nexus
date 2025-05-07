
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelatedQuestsProps {
  contentId: string;
  contentType: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'community' | 'individual';
  progress: number;
  goal: number;
  participants: number;
  deadline: string;
  reward: string;
  imageUrl: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  imageUrl: string;
}

const RelatedQuests: React.FC<RelatedQuestsProps> = ({ contentId, contentType }) => {
  // Generate quests based on content type and id
  const getQuests = (): Quest[] => {
    const quests: Quest[] = [
      {
        id: `quest-${contentId}-1`,
        title: '관련 콘텐츠 5개 살펴보기',
        description: '추천 콘텐츠를 통해 더 많은 정보를 얻어보세요',
        type: 'individual',
        progress: 2,
        goal: 5,
        participants: 24,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reward: '경험치 50점',
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=quest1'
      }
    ];

    // Add content-type specific quests
    if (contentType === 'product') {
      quests.push({
        id: `quest-${contentId}-2`,
        title: '구매 후기 남기기',
        description: '이 제품을 구매하고 사용한 경험을 공유해보세요',
        type: 'community',
        progress: 15,
        goal: 30,
        participants: 15,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        reward: '경험치 100점 + 특별 뱃지',
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=quest2'
      });
    } else if (contentType === 'event' || contentType === 'quest') {
      quests.push({
        id: `quest-${contentId}-3`,
        title: '친구와 함께 참여하기',
        description: '친구를 초대해 함께 참여하면 보상을 받을 수 있습니다',
        type: 'community',
        progress: 8,
        goal: 20,
        participants: 8,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        reward: '경험치 150점 + 스페셜 아이템',
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=quest3'
      });
    }

    return quests;
  };

  // Generate events based on content type and id
  const getEvents = (): Event[] => {
    const events: Event[] = [];
    
    if (['product', 'service'].includes(contentType)) {
      events.push({
        id: `event-${contentId}-1`,
        title: '온라인 제품 설명회',
        description: '제품 담당자와 함께하는 온라인 설명회에 참여해보세요',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: '온라인 (Zoom)',
        participants: 18,
        maxParticipants: 50,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=event1'
      });
    }
    
    if (contentType === 'service') {
      events.push({
        id: `event-${contentId}-2`,
        title: '사용자 피드백 세션',
        description: '서비스를 개선하기 위한 사용자 피드백 세션에 참여하세요',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        location: '온라인 (Google Meet)',
        participants: 5,
        maxParticipants: 15,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=event2'
      });
    }

    return events;
  };

  const quests = getQuests();
  const events = getEvents();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateDaysLeft = (dateString: string): number => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Quests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            관련 퀘스트
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {quests.map(quest => (
                <div 
                  key={quest.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={quest.imageUrl} 
                        alt={quest.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{quest.title}</h4>
                        <Badge 
                          variant={quest.type === 'community' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {quest.type === 'community' ? '커뮤니티' : '개인'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{quest.progress}/{quest.goal} 완료</span>
                          <span>
                            <Users className="inline h-3 w-3 mr-1" />
                            {quest.participants} 참여
                          </span>
                        </div>
                        <Progress value={(quest.progress / quest.goal) * 100} className="h-1.5" />
                      </div>
                      
                      <div className="mt-3 flex flex-wrap justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>마감 {calculateDaysLeft(quest.deadline)}일 남음 ({formatDate(quest.deadline)})</span>
                        </div>
                        <Button size="sm" variant="outline" className="mt-1 sm:mt-0">
                          도전하기 <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">관련된 퀘스트가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            관련 이벤트
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {events.map(event => (
                <div 
                  key={event.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{event.participants}/{event.maxParticipants} 참여</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {event.location}
                        </Badge>
                        <Button size="sm" variant="outline" className="mt-1 sm:mt-0">
                          참가하기 <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">관련된 이벤트가 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatedQuests;
