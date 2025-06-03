import React from 'react';
import { Bell, X, MessageSquare, ShoppingBag, Heart, Star, Activity } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const ActivityNotification = () => {
  const [showActivities, setShowActivities] = React.useState(false);
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
    <Popover open={showActivities} onOpenChange={setShowActivities}>
      <PopoverTrigger className="relative">
        <Bell className="h-5 w-5 text-accent-100 cursor-pointer" />
        {activities.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {activities.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold">활동 알림</h3>
            <button onClick={() => setShowActivities(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start p-3 border-b hover:bg-bg-100">
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
      </PopoverContent>
    </Popover>
  );
};
