
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CreditCard, Award, Zap } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  details?: string;
  image?: string;
}

interface TransactionItem {
  id: string;
  type: 'purchase' | 'reward' | 'refund' | 'other';
  title: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UserBadge {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  acquiredDate: string;
  description: string;
}

interface Quest {
  id: string;
  title: string;
  progress: number;
  deadline?: string;
  reward: string;
}

interface ActivitySectionProps {
  activities: ActivityItem[];
  transactions: TransactionItem[];
  level: number;
  maxLevel: number;
  experience: number;
  nextLevelExperience: number;
  badges: UserBadge[];
  quests: Quest[];
  points: {
    total: number;
    history: {
      period: string;
      amount: number;
    }[];
  };
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  activities,
  transactions,
  level,
  maxLevel,
  experience,
  nextLevelExperience,
  badges,
  quests,
  points
}) => {
  const expPercentage = (experience / nextLevelExperience) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          활동/거래 관리
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Badge className="mr-2 bg-yellow-500">Lv. {level}</Badge>
              <span className="text-sm">{experience}/{nextLevelExperience} XP</span>
            </div>
            <span className="text-xs text-muted-foreground">최대 레벨: {maxLevel}</span>
          </div>
          <Progress value={expPercentage} className="h-2" />
        </div>
        
        <Tabs defaultValue="activity">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="activity">활동 내역</TabsTrigger>
            <TabsTrigger value="transactions">거래 기록</TabsTrigger>
            <TabsTrigger value="rewards">뱃지/리워드</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start p-3 bg-muted rounded-md">
                <div className="flex-shrink-0">
                  {activity.image ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.image} />
                      <AvatarFallback>{activity.type.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">{activity.type.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  {activity.details && (
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  )}
                  <Badge variant="outline" className="mt-1 text-xs">{activity.type}</Badge>
                </div>
              </div>
            ))}
            <Button variant="link" className="w-full">활동 타임라인 전체보기</Button>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">거래 내역</h4>
              </div>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                전체 내역
              </Button>
            </div>
            
            {transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}원
                  </p>
                  <Badge 
                    variant={
                      transaction.status === 'completed' ? 'default' : 
                      transaction.status === 'pending' ? 'outline' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {transaction.status === 'completed' ? '완료' : 
                     transaction.status === 'pending' ? '진행중' : '실패'}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    획득한 뱃지
                  </h4>
                  <span className="text-sm">{badges.length}개</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {badges.slice(0, 5).map((badge) => (
                    <div key={badge.id} className="relative group">
                      <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarImage src={badge.image} alt={badge.name} />
                        <AvatarFallback>{badge.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {badge.name}
                      </div>
                    </div>
                  ))}
                  {badges.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">
                      +{badges.length - 5}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    포인트
                  </h4>
                  <span className="text-xl font-bold">{points.total.toLocaleString()}</span>
                </div>
                <div className="space-y-1 text-xs">
                  {points.history.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.period}</span>
                      <span className={item.amount >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">진행중인 퀘스트 ({quests.length})</h4>
              <div className="space-y-3">
                {quests.slice(0, 2).map((quest) => (
                  <div key={quest.id} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{quest.title}</p>
                      <span className="text-xs">{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-1 mb-2" />
                    <div className="flex justify-between text-xs">
                      <span>보상: {quest.reward}</span>
                      {quest.deadline && (
                        <span className="text-amber-500">마감: {quest.deadline}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {quests.length > 2 && (
                <Button variant="link" className="w-full mt-2">
                  더 많은 퀘스트 보기 ({quests.length - 2})
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
