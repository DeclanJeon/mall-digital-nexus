
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  organizer: string;
  attendees: number;
  maxAttendees: number | null;
  tags: string[];
};

const initialEvents: Event[] = [
  {
    id: 'event-1',
    title: '커뮤니티 오프라인 밋업',
    description: '다양한 주제로 이야기를 나누는 오프라인 밋업 이벤트입니다. 많은 참여 부탁드립니다.',
    date: '2025-05-20',
    time: '19:00',
    location: '서울 강남구 테헤란로 123',
    isOnline: false,
    organizer: '관리자',
    attendees: 15,
    maxAttendees: 30,
    tags: ['밋업', '네트워킹', '오프라인']
  },
  {
    id: 'event-2',
    title: '온라인 개발자 컨퍼런스',
    description: '최신 개발 트렌드와 기술을 공유하는 온라인 컨퍼런스입니다.',
    date: '2025-06-05',
    time: '14:00',
    location: '온라인 (Zoom)',
    isOnline: true,
    organizer: '개발팀',
    attendees: 75,
    maxAttendees: null,
    tags: ['개발', '컨퍼런스', '온라인']
  }
];

const EventsSection = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('community_events', initialEvents);
  const [attendingEvents, setAttendingEvents] = useLocalStorage<string[]>('attending_events', []);
  
  const handleAttendEvent = (eventId: string) => {
    // Toggle attendance
    if (attendingEvents.includes(eventId)) {
      setAttendingEvents(attendingEvents.filter(id => id !== eventId));
      
      // Decrease attendee count
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: Math.max(event.attendees - 1, 0)
          };
        }
        return event;
      }));
    } else {
      setAttendingEvents([...attendingEvents, eventId]);
      
      // Increase attendee count
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees + 1
          };
        }
        return event;
      }));
    }
  };
  
  const isEventFull = (event: Event) => {
    return event.maxAttendees !== null && event.attendees >= event.maxAttendees;
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6">이벤트</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="mt-1">주최: {event.organizer}</CardDescription>
                </div>
                <Badge variant={event.isOnline ? 'secondary' : 'default'}>
                  {event.isOnline ? '온라인' : '오프라인'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {event.attendees} 명 참여 
                    {event.maxAttendees && ` (최대 ${event.maxAttendees}명)`}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map(tag => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant={attendingEvents.includes(event.id) ? 'default' : 'outline'}
                  disabled={!attendingEvents.includes(event.id) && isEventFull(event)}
                  onClick={() => handleAttendEvent(event.id)}
                >
                  {attendingEvents.includes(event.id) 
                    ? '참여 취소' 
                    : isEventFull(event) 
                      ? '정원 마감' 
                      : '참여하기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {events.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          예정된 이벤트가 없습니다.
        </div>
      )}
    </section>
  );
};

export default EventsSection;
