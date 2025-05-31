
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  userImage: string;
}

const PeerSpaceActivityFeed: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  useEffect(() => {
    // Get username from local storage or generate a random animal name
    const storedUsername = localStorage.getItem('peerspace_username');
    const generatedUsername = storedUsername || getRandomAnimalName();
    
    if (!storedUsername) {
      localStorage.setItem('peerspace_username', generatedUsername);
    }
    
    setUsername(generatedUsername);
    
    // Generate mock activity data
    const initialActivities: ActivityItem[] = [
      {
        id: '1',
        user: '김디자이너',
        action: '좋아요',
        target: '포트폴리오: 모던 브랜딩',
        time: '5분 전',
        userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=KimDesigner'
      },
      {
        id: '2',
        user: '이클라이언트',
        action: '댓글',
        target: '서비스: 브랜딩 컨설팅',
        time: '30분 전',
        userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=LeeClient'
      },
      {
        id: '3',
        user: '박동료',
        action: '공유',
        target: '이벤트: 디자인 워크샵',
        time: '2시간 전',
        userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=ParkColleague'
      },
      {
        id: '4',
        user: '최팔로워',
        action: '저장',
        target: '제품: 미니멀 램프',
        time: '1일 전',
        userImage: 'https://api.dicebear.com/7.x/personas/svg?seed=ChoiFollower'
      }
    ];
    
    setActivities(initialActivities);
    
    // Add user's own activity
    const userActivity: ActivityItem = {
      id: `user-${Date.now()}`,
      user: generatedUsername,
      action: '방문',
      target: '이 피어몰',
      time: '방금 전',
      userImage: `https://api.dicebear.com/7.x/personas/svg?seed=${generatedUsername}`
    };
    
    setTimeout(() => {
      setActivities(prev => [userActivity, ...prev]);
    }, 2000);
  }, []);
  
  function getRandomAnimalName(): string {
    const animals = ['토끼', '사자', '호랑이', '기린', '코끼리', '팬더', '곰', '여우', '늑대', '사슴'];
    const randomIndex = Math.floor(Math.random() * animals.length);
    return `익명 ${animals[randomIndex]}`;
  }
  
  const getActionIcon = (action: string) => {
    switch(action) {
      case '좋아요': return <Heart className="h-4 w-4 text-red-500" />;
      case '댓글': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case '공유': return <Share2 className="h-4 w-4 text-green-500" />;
      case '저장': return <Bookmark className="h-4 w-4 text-yellow-500" />;
      case '방문': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return null;
    }
  };
  
  const addUserActivity = (action: string, target: string) => {
    const newActivity: ActivityItem = {
      id: `user-${Date.now()}`,
      user: username,
      action,
      target,
      time: '방금 전',
      userImage: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`
    };
    
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium tracking-normal">실시간 활동 피드</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.userImage} alt={activity.user} />
                <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user}</span>
                  <span>님이</span>
                  <div className="flex items-center gap-1">
                    {getActionIcon(activity.action)}
                    <span>{activity.action}를 남겼습니다</span>
                  </div>
                </div>
                <p className="text-sm text-primary-500">{activity.target}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={() => addUserActivity('좋아요', '이 피어몰')}>
          모든 활동 보기
        </Button>
      </CardContent>
    </Card>
  );
};

export default PeerSpaceActivityFeed;
