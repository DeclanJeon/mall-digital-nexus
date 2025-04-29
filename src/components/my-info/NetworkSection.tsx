
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, GitPullRequest } from 'lucide-react';

interface NetworkUser {
  id: string;
  name: string;
  image?: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface NetworkSectionProps {
  friends: NetworkUser[];
  followers: NetworkUser[];
  following: NetworkUser[];
  recommenders: NetworkUser[];
  recommendees: NetworkUser[];
  family: NetworkUser[];
}

const NetworkSection: React.FC<NetworkSectionProps> = ({
  friends,
  followers,
  following,
  recommenders,
  recommendees,
  family
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          내 네트워크
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="friends">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="friends">친구</TabsTrigger>
            <TabsTrigger value="follow">팔로우</TabsTrigger>
            <TabsTrigger value="trust">신뢰 그룹</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">친구 목록 ({friends.length})</h3>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                친구 추가
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {friends.slice(0, 4).map((friend) => (
                <div key={friend.id} className="flex items-center p-2 bg-muted rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.image} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.status === 'online' ? '온라인' : 
                       friend.status === 'away' ? '자리비움' : 
                       `마지막 접속: ${friend.lastActive}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {friends.length > 4 && (
              <Button variant="link" className="w-full">더 보기 ({friends.length - 4})</Button>
            )}
          </TabsContent>
          
          <TabsContent value="follow" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">팔로워 ({followers.length})</h3>
                <div className="space-y-2">
                  {followers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center p-2 bg-muted rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm">{user.name}</span>
                    </div>
                  ))}
                  
                  {followers.length > 3 && (
                    <Button variant="link" className="text-xs p-0">
                      더 보기 ({followers.length - 3})
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">팔로잉 ({following.length})</h3>
                <div className="space-y-2">
                  {following.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center p-2 bg-muted rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm">{user.name}</span>
                    </div>
                  ))}
                  
                  {following.length > 3 && (
                    <Button variant="link" className="text-xs p-0">
                      더 보기 ({following.length - 3})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trust" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">신뢰 그룹</h3>
              <Button variant="outline" size="sm" className="flex items-center">
                <GitPullRequest className="h-4 w-4 mr-2" />
                그룹 시각화
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">추천인 ({recommenders.length})</h4>
                <div className="space-y-2">
                  {recommenders.slice(0, 2).map((user) => (
                    <div key={user.id} className="flex items-center p-2 bg-muted rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">피추천인 ({recommendees.length})</h4>
                <div className="space-y-2">
                  {recommendees.slice(0, 2).map((user) => (
                    <div key={user.id} className="flex items-center p-2 bg-muted rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">패밀리 멤버 ({family.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {family.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center p-2 bg-muted rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.image} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NetworkSection;
