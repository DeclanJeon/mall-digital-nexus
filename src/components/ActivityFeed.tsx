
import React from 'react';
import { Bell, MessageSquare, ShoppingBag, Heart, Star, Activity } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      type: 'message',
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      text: '박성민님이 새로운 메시지를 보냈습니다.',
      time: '5분 전'
    },
    {
      type: 'purchase',
      icon: <ShoppingBag className="h-4 w-4 text-blue-500" />,
      text: '홍길동님이 디지털 아트워크를 구매했습니다.',
      time: '25분 전'
    },
    {
      type: 'like',
      icon: <Heart className="h-4 w-4 text-red-500" />,
      text: '김영희님이 당신의 피어몰을 좋아합니다.',
      time: '1시간 전'
    },
    {
      type: 'review',
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      text: '최우진님이 상품에 5점 리뷰를 남겼습니다.',
      time: '3시간 전'
    },
    {
      type: 'trending',
      icon: <Activity className="h-4 w-4 text-purple-500" />,
      text: '당신의 피어몰이 디자인 카테고리에서 인기 상승 중입니다.',
      time: '5시간 전'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Bell className="h-5 w-5 mr-2 text-accent-100" />
          실시간 활동
        </h3>
        <a href="#" className="text-sm text-accent-200 hover:text-accent-100 transition-colors">
          모두 보기
        </a>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start py-2 border-b border-bg-200 last:border-0">
            <div className="bg-bg-100 p-2 rounded-full mr-3">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm">{activity.text}</p>
              <span className="text-xs text-text-200">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
