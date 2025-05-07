
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Gift, Trophy, Award, Plus, Target, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  startDate: string;
  endDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  isCompleted: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  registrations: number;
  maxRegistrations?: number;
  isRegistered: boolean;
  imageUrl?: string;
}

interface QuestEventSectionProps {
  peerAddress: string;
  isOwner: boolean;
}

const QuestEventSection: React.FC<QuestEventSectionProps> = ({ peerAddress, isOwner }) => {
  const [activeTab, setActiveTab] = useState('quests');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Dialog states
  const [showQuestDialog, setShowQuestDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showQuestDetailsDialog, setShowQuestDetailsDialog] = useState(false);
  const [showEventDetailsDialog, setShowEventDetailsDialog] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Form states
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    reward: '',
    startDate: '',
    endDate: '',
    difficulty: 'medium'
  });
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    maxRegistrations: ''
  });

  useEffect(() => {
    // Load quests from localStorage
    const storedQuests = localStorage.getItem(`peerspace_quests_${peerAddress}`);
    if (storedQuests) {
      setQuests(JSON.parse(storedQuests));
    } else {
      // Initialize with some sample quests
      const sampleQuests: Quest[] = [
        {
          id: 'q1',
          title: '콘텐츠 5개 댓글 달기',
          description: '이 피어스페이스의 콘텐츠에 의미 있는 댓글을 5개 이상 남겨보세요.',
          reward: '포인트 500점',
          progress: 60,
          startDate: '2025-04-20',
          endDate: '2025-05-10',
          difficulty: 'easy',
          participants: 24,
          isCompleted: false
        },
        {
          id: 'q2',
          title: '친구 3명 초대하기',
          description: '이 피어스페이스에 친구 3명을 초대하고 함께 활동해보세요.',
          reward: '특별 배지',
          progress: 33,
          startDate: '2025-04-25',
          endDate: '2025-05-15',
          difficulty: 'medium',
          participants: 12,
          isCompleted: false
        }
      ];
      setQuests(sampleQuests);
      localStorage.setItem(`peerspace_quests_${peerAddress}`, JSON.stringify(sampleQuests));
    }
    
    // Load events from localStorage
    const storedEvents = localStorage.getItem(`peerspace_events_${peerAddress}`);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Initialize with some sample events
      const sampleEvents: Event[] = [
        {
          id: 'e1',
          title: '지속가능한 패션 워크숍',
          description: '친환경 소재와 지속 가능한 패션에 대한 워크숍입니다. 함께 의류 업사이클링 방법을 배워보세요.',
          location: '서울 강남구 테헤란로 123',
          date: '2025-05-15',
          time: '14:00',
          registrations: 18,
          maxRegistrations: 30,
          isRegistered: false,
          imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d29ya3Nob3B8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
        },
        {
          id: 'e2',
          title: '디지털 아트 전시회',
          description: '새로운 미디어 아티스트들의 작품을 감상하고 디지털 아트의 미래에 대해 이야기해보세요.',
          location: '서울 종로구 삼청로 45',
          date: '2025-05-20',
          time: '18:30',
          registrations: 32,
          maxRegistrations: 50,
          isRegistered: false,
          imageUrl: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem(`peerspace_events_${peerAddress}`, JSON.stringify(sampleEvents));
    }
  }, [peerAddress]);
  
  const handleQuestSubmit = () => {
    if (!newQuest.title || !newQuest.description || !newQuest.reward || !newQuest.startDate || !newQuest.endDate) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    const quest: Quest = {
      id: `quest-${Date.now()}`,
      ...newQuest,
      difficulty: newQuest.difficulty as 'easy' | 'medium' | 'hard',
      progress: 0,
      participants: 0,
      isCompleted: false
    };
    
    const updatedQuests = [quest, ...quests];
    setQuests(updatedQuests);
    localStorage.setItem(`peerspace_quests_${peerAddress}`, JSON.stringify(updatedQuests));
    
    setNewQuest({
      title: '',
      description: '',
      reward: '',
      startDate: '',
      endDate: '',
      difficulty: 'medium'
    });
    
    setShowQuestDialog(false);
    
    toast({
      title: "퀘스트 생성 완료",
      description: "새로운 퀘스트가 성공적으로 생성되었습니다.",
    });
  };
  
  const handleEventSubmit = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.location || !newEvent.date || !newEvent.time) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    const event: Event = {
      id: `event-${Date.now()}`,
      ...newEvent,
      registrations: 0,
      maxRegistrations: newEvent.maxRegistrations ? parseInt(newEvent.maxRegistrations) : undefined,
      isRegistered: false,
      imageUrl: `https://source.unsplash.com/random/800x450?event,${newEvent.title.replace(/\s/g, '')}`
    };
    
    const updatedEvents = [event, ...events];
    setEvents(updatedEvents);
    localStorage.setItem(`peerspace_events_${peerAddress}`, JSON.stringify(updatedEvents));
    
    setNewEvent({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      maxRegistrations: ''
    });
    
    setShowEventDialog(false);
    
    toast({
      title: "이벤트 생성 완료",
      description: "새로운 이벤트가 성공적으로 생성되었습니다.",
    });
  };

  const joinQuest = (questId: string) => {
    const updatedQuests = quests.map(q => 
      q.id === questId 
        ? { ...q, participants: q.participants + 1 } 
        : q
    );
    
    setQuests(updatedQuests);
    localStorage.setItem(`peerspace_quests_${peerAddress}`, JSON.stringify(updatedQuests));
    
    toast({
      title: "퀘스트 참여 완료",
      description: "퀘스트에 참여했습니다. 보상을 획득하세요!",
    });
    
    setShowQuestDetailsDialog(false);
  };
  
  const registerForEvent = (eventId: string) => {
    const updatedEvents = events.map(e => 
      e.id === eventId 
        ? { ...e, registrations: e.registrations + 1, isRegistered: true } 
        : e
    );
    
    setEvents(updatedEvents);
    localStorage.setItem(`peerspace_events_${peerAddress}`, JSON.stringify(updatedEvents));
    
    toast({
      title: "이벤트 등록 완료",
      description: "이벤트에 성공적으로 등록되었습니다.",
    });
    
    setShowEventDetailsDialog(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return '';
    }
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">퀘스트 & 이벤트</h2>
        {isOwner && (
          <div className="flex gap-2">
            <Button onClick={() => setShowQuestDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> 퀘스트 생성
            </Button>
            <Button variant="outline" onClick={() => setShowEventDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> 이벤트 생성
            </Button>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="quests" className="flex items-center">
            <Target className="h-4 w-4 mr-2" /> 퀘스트
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" /> 이벤트
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quests">
          {quests.length === 0 ? (
            <Card className="text-center p-8">
              <p>등록된 퀘스트가 없습니다.</p>
              {isOwner && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowQuestDialog(true)}
                >
                  첫 퀘스트 생성하기
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quests.map(quest => (
                <Card 
                  key={quest.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedQuest(quest);
                    setShowQuestDetailsDialog(true);
                  }}
                >
                  <CardHeader>
                    <Badge className={`w-fit ${getDifficultyColor(quest.difficulty)} mb-2`}>
                      {getDifficultyText(quest.difficulty)}
                    </Badge>
                    <CardTitle>{quest.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{quest.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {quest.startDate} ~ {quest.endDate}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>진행률</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <Progress value={quest.progress} className="h-2" />
                    </div>
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm font-medium">{quest.reward}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <div className="text-sm text-gray-500">
                      {quest.participants}명 참여 중
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="events">
          {events.length === 0 ? (
            <Card className="text-center p-8">
              <p>등록된 이벤트가 없습니다.</p>
              {isOwner && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowEventDialog(true)}
                >
                  첫 이벤트 생성하기
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => (
                <Card 
                  key={event.id}
                  className="cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetailsDialog(true);
                  }}
                >
                  <div 
                    className="h-48 bg-gray-200 bg-center bg-cover"
                    style={{ 
                      backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : undefined
                    }}
                  />
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {event.date} {event.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        위치: {event.location}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="text-sm text-gray-500">
                      {event.registrations}{event.maxRegistrations ? `/${event.maxRegistrations}` : ''} 등록
                    </div>
                    {event.isRegistered && (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        등록됨
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Quest Creation Dialog */}
      <Dialog open={showQuestDialog} onOpenChange={setShowQuestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 퀘스트 생성</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="quest-title">제목</Label>
              <Input
                id="quest-title"
                value={newQuest.title}
                onChange={(e) => setNewQuest({...newQuest, title: e.target.value})}
                placeholder="퀘스트 제목"
              />
            </div>
            
            <div>
              <Label htmlFor="quest-description">설명</Label>
              <Textarea
                id="quest-description"
                value={newQuest.description}
                onChange={(e) => setNewQuest({...newQuest, description: e.target.value})}
                placeholder="퀘스트 설명과 달성 방법"
              />
            </div>
            
            <div>
              <Label htmlFor="quest-reward">보상</Label>
              <Input
                id="quest-reward"
                value={newQuest.reward}
                onChange={(e) => setNewQuest({...newQuest, reward: e.target.value})}
                placeholder="예: 포인트 500점, 특별 배지, 할인 쿠폰 등"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quest-start-date">시작일</Label>
                <Input
                  id="quest-start-date"
                  type="date"
                  value={newQuest.startDate}
                  onChange={(e) => setNewQuest({...newQuest, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="quest-end-date">종료일</Label>
                <Input
                  id="quest-end-date"
                  type="date"
                  value={newQuest.endDate}
                  onChange={(e) => setNewQuest({...newQuest, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label>난이도</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={newQuest.difficulty === 'easy' ? 'default' : 'outline'}
                  className={newQuest.difficulty === 'easy' ? 'bg-green-500 hover:bg-green-600' : ''}
                  onClick={() => setNewQuest({...newQuest, difficulty: 'easy'})}
                >
                  쉬움
                </Button>
                <Button
                  type="button"
                  variant={newQuest.difficulty === 'medium' ? 'default' : 'outline'}
                  className={newQuest.difficulty === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                  onClick={() => setNewQuest({...newQuest, difficulty: 'medium'})}
                >
                  보통
                </Button>
                <Button
                  type="button"
                  variant={newQuest.difficulty === 'hard' ? 'default' : 'outline'}
                  className={newQuest.difficulty === 'hard' ? 'bg-red-500 hover:bg-red-600' : ''}
                  onClick={() => setNewQuest({...newQuest, difficulty: 'hard'})}
                >
                  어려움
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuestDialog(false)}>취소</Button>
            <Button onClick={handleQuestSubmit}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Event Creation Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 이벤트 생성</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">제목</Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="이벤트 제목"
              />
            </div>
            
            <div>
              <Label htmlFor="event-description">설명</Label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="이벤트 상세 정보"
              />
            </div>
            
            <div>
              <Label htmlFor="event-location">위치</Label>
              <Input
                id="event-location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="예: 서울 강남구 테헤란로 123, 온라인 등"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date">날짜</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="event-time">시간</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="event-max-registrations">최대 참가 인원 (선택사항)</Label>
              <Input
                id="event-max-registrations"
                type="number"
                value={newEvent.maxRegistrations}
                onChange={(e) => setNewEvent({...newEvent, maxRegistrations: e.target.value})}
                placeholder="비워두면 제한 없음"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>취소</Button>
            <Button onClick={handleEventSubmit}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Quest Details Dialog */}
      <Dialog open={showQuestDetailsDialog} onOpenChange={setShowQuestDetailsDialog}>
        {selectedQuest && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedQuest.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Badge className={`${getDifficultyColor(selectedQuest.difficulty)}`}>
                  {getDifficultyText(selectedQuest.difficulty)}
                </Badge>
              </div>
              
              <p>{selectedQuest.description}</p>
              
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {selectedQuest.startDate} ~ {selectedQuest.endDate}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>진행률</span>
                    <span>{selectedQuest.progress}%</span>
                  </div>
                  <Progress value={selectedQuest.progress} className="h-2" />
                </div>
                
                <div className="flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="font-medium">{selectedQuest.reward}</span>
                </div>
                
                <div className="mt-4 p-3 bg-gray-100 rounded-md flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  <div>
                    <div className="text-sm font-medium">참여자</div>
                    <div className="text-xs text-gray-500">{selectedQuest.participants}명이 도전 중입니다</div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowQuestDetailsDialog(false)}
              >
                닫기
              </Button>
              <Button onClick={() => joinQuest(selectedQuest.id)}>
                퀘스트 참여하기
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Event Details Dialog */}
      <Dialog open={showEventDetailsDialog} onOpenChange={setShowEventDetailsDialog}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            
            {selectedEvent.imageUrl && (
              <div 
                className="h-48 bg-gray-200 bg-center bg-cover rounded-md"
                style={{ backgroundImage: `url(${selectedEvent.imageUrl})` }}
              />
            )}
            
            <div className="space-y-4">
              <p>{selectedEvent.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    {selectedEvent.date} {selectedEvent.time}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    위치: {selectedEvent.location}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    참가자: {selectedEvent.registrations}
                    {selectedEvent.maxRegistrations ? `/${selectedEvent.maxRegistrations}명` : '명'}
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowEventDetailsDialog(false)}
              >
                닫기
              </Button>
              <Button 
                onClick={() => registerForEvent(selectedEvent.id)}
                disabled={selectedEvent.isRegistered}
              >
                {selectedEvent.isRegistered ? '등록됨' : '이벤트 등록하기'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default QuestEventSection;
