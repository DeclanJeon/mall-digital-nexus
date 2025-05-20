
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// 활동 항목 타입 정의
interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  time: string;
}

const CommunityActivity: React.FC = () => {
  // 샘플 활동 데이터 (실제로는 API에서 가져옵니다)
  const activities: ActivityItem[] = [
    {
      id: "1",
      user: {
        name: "김디자이너",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=KimDesigner"
      },
      action: "게시글을 작성했습니다",
      target: "디자인 시스템 구축 경험 공유",
      time: "10분 전"
    },
    {
      id: "2",
      user: {
        name: "박개발자",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ParkDeveloper"
      },
      action: "댓글을 남겼습니다",
      target: "리액트 성능 최적화 방법",
      time: "30분 전"
    },
    {
      id: "3",
      user: {
        name: "이매니저",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=LeeManager"
      },
      action: "토픽에 가입했습니다",
      target: "UX/UI 디자인",
      time: "1시간 전"
    },
    {
      id: "4",
      user: {
        name: "최마케터",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ChoiMarketer"
      },
      action: "게시글을 좋아합니다",
      target: "효과적인 디지털 마케팅 전략",
      time: "2시간 전"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex gap-3 items-start pb-3 border-b last:border-b-0 last:pb-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-gray-500"> {activity.action}</span>
              </p>
              <p className="text-xs font-medium text-primary-600 mt-0.5">
                {activity.target}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full text-primary">
          모든 활동 보기
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityActivity;
