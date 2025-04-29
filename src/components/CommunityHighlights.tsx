
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Star, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CommunityHighlights = () => {
  const discussions = [
    {
      id: 1,
      title: '친환경 포장재의 미래는?',
      replies: 24,
      author: '에코러버',
      authorImg: 'https://i.pravatar.cc/150?img=1',
      timeAgo: '3시간 전'
    },
    {
      id: 2,
      title: '소비자 주도형 브랜딩이란?',
      replies: 18,
      author: '마케팅구루',
      authorImg: 'https://i.pravatar.cc/150?img=2', 
      timeAgo: '5시간 전'
    }
  ];
  
  const reviews = [
    {
      id: 1,
      product: '유기농 티셔츠',
      rating: 4.9,
      author: '패션맘',
      content: '환경을 생각하는 브랜드의 진정성이 느껴지는 제품입니다.'
    },
    {
      id: 2,
      product: '디지털 아트북',
      rating: 5.0,
      author: '아트홀릭',
      content: '인쇄 퀄리티가 놀랍고, 작가의 해설이 인상적입니다.'
    }
  ];

  const events = [
    {
      id: 1,
      title: '지속가능한 패션 워크숍',
      date: '2025년 5월 1일',
      location: '온라인',
    },
    {
      id: 2,
      title: '메타버스 크리에이터 컨퍼런스',
      date: '2025년 5월 15일',
      location: '서울 코엑스',
    }
  ];

  return (
    <section className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-primary-300">커뮤니티 하이라이트</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6">
        {/* Active Discussions */}
        <div className="p-4">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-5 w-5 mr-2 text-accent-200" />
            <h3 className="font-bold text-primary-300">활발한 토론</h3>
          </div>
          
          <div className="space-y-3">
            {discussions.map(discussion => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <h4 className="font-medium text-primary-300 mb-2">{discussion.title}</h4>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={discussion.authorImg} />
                        <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{discussion.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{discussion.timeAgo}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-600">{discussion.replies} 답변</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">참여하기</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Popular Reviews */}
        <div className="p-4 border-t md:border-t-0 md:border-l border-gray-100">
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 mr-2 text-accent-200" />
            <h3 className="font-bold text-primary-300">인기 리뷰</h3>
          </div>
          
          <div className="space-y-3">
            {reviews.map(review => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-primary-300">{review.product}</h4>
                    <div className="flex items-center bg-green-100 px-2 py-0.5 rounded text-green-700">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span className="text-xs font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">"{review.content}"</p>
                  <div className="text-xs text-gray-500">by {review.author}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Events & Challenges */}
        <div className="p-4 border-t md:border-t-0 md:border-l border-gray-100">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2 text-accent-200" />
            <h3 className="font-bold text-primary-300">이벤트 & 챌린지</h3>
          </div>
          
          <div className="space-y-3">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <h4 className="font-medium text-primary-300 mb-2">{event.title}</h4>
                  <div className="flex items-center mb-1">
                    <Calendar className="h-3 w-3 mr-2 text-gray-500" />
                    <span className="text-xs text-gray-600">{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-2 text-gray-500" />
                    <span className="text-xs text-gray-600">{event.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                    일정 등록
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Button variant="link" className="w-full text-accent-200 text-xs">
              모든 이벤트 보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHighlights;
