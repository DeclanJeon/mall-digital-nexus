
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar, MapPin, Users, Target, Clock, Check, ArrowRight, Plus
} from 'lucide-react';

import { PeerMallConfig, Event, Quest } from './types';

interface PeerSpaceEventsSectionProps {
  config: PeerMallConfig;
  events: Event[];
  quests: Quest[];
  isOwner: boolean;
}

const PeerSpaceEventsSection: React.FC<PeerSpaceEventsSectionProps> = ({
  config,
  events,
  quests,
  isOwner
}) => {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">이벤트 & 퀘스트</h2>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> 퀘스트 생성
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> 이벤트 생성
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">다가오는 이벤트</h3>
          
          {events && events.length > 0 ? (
            events.slice(0, 2).map(event => (
              <Card key={event.id} className="overflow-hidden cursor-pointer hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 aspect-video sm:aspect-square">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardContent className="flex-1 p-4">
                    <Badge className="mb-2 bg-blue-500 text-white border-none">
                      {event.type}
                    </Badge>
                    
                    <h4 className="font-medium text-lg mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" /> 
                        <span>{event.date}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" /> 
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-2" /> 
                        <span>{event.participants.length}/{event.maxParticipants} 명 참여</span>
                      </div>
                    </div>
                    
                    {event.price && (
                      <div className="mt-3">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          {event.price}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">등록된 이벤트가 없습니다</p>
            </div>
          )}
          
          {events && events.length > 2 && (
            <Button variant="outline" size="sm" className="w-full">
              모든 이벤트 보기 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Active Quests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">진행중인 퀘스트</h3>
          
          {quests && quests.length > 0 ? (
            quests.slice(0, 2).map(quest => (
              <Card key={quest.id} className="overflow-hidden cursor-pointer hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 aspect-video sm:aspect-square">
                    <img 
                      src={quest.imageUrl} 
                      alt={quest.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardContent className="flex-1 p-4">
                    <Badge className={`mb-2 ${
                      quest.type === 'community' 
                        ? 'bg-purple-500' 
                        : 'bg-green-500'
                    } text-white border-none`}>
                      {quest.type === 'community' ? '커뮤니티' : '개인'}
                    </Badge>
                    
                    <h4 className="font-medium text-lg mb-1">{quest.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {quest.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-2" /> 
                          <span>마감: {quest.deadline}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <Target className="h-4 w-4 mr-1" /> 
                          <span>목표: {quest.goal}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">진행도</span>
                          <span className="font-medium">{Math.round((quest.progress / quest.goal) * 100)}%</span>
                        </div>
                        <Progress value={(quest.progress / quest.goal) * 100} className="h-2" />
                      </div>
                      
                      <div className="flex items-center text-sm text-emerald-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>보상: {quest.reward}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">활성화된 퀘스트가 없습니다</p>
            </div>
          )}
          
          {quests && quests.length > 2 && (
            <Button variant="outline" size="sm" className="w-full">
              모든 퀘스트 보기 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PeerSpaceEventsSection;
