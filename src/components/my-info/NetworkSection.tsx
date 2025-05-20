
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Define the friend type
interface Friend {
  id: string;
  name: string;
  image: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

// Define the props interface for NetworkSection
export interface NetworkSectionProps {
  friends: Friend[];
  followers: {
    id: string;
    name: string;
    image: string;
  }[];
  following: {
    id: string;
    name: string;
    image: string;
  }[];
  recommenders: {
    id: string;
    name: string;
    image: string;
  }[];
  recommendees: {
    id: string;
    name: string;
    image: string;
  }[];
  family: {
    id: string;
    name: string;
    image: string;
  }[];
}

const NetworkSection: React.FC<NetworkSectionProps> = ({
  friends,
  followers,
  following,
  recommenders,
  recommendees,
  family
}) => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Get status indicator class based on status
  const getStatusIndicatorClass = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  // Filter function for search
  const filterBySearch = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="text-lg font-medium">내 네트워크</CardTitle>
          <div className="relative mt-2 sm:mt-0">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="이름으로 검색" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-full sm:w-[180px]"
            />
          </div>
        </div>
        <TabsList className="mt-2">
          <TabsTrigger 
            value="friends" 
            onClick={() => setActiveTab('friends')}
            className={activeTab === 'friends' ? 'bg-white' : ''}
          >
            친구 ({friends.length})
          </TabsTrigger>
          <TabsTrigger 
            value="followers" 
            onClick={() => setActiveTab('followers')}
            className={activeTab === 'followers' ? 'bg-white' : ''}
          >
            팔로워 ({followers.length})
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            onClick={() => setActiveTab('following')}
            className={activeTab === 'following' ? 'bg-white' : ''}
          >
            팔로잉 ({following.length})
          </TabsTrigger>
          <TabsTrigger 
            value="more" 
            onClick={() => setActiveTab('more')}
            className={['recommenders', 'recommendees', 'family'].includes(activeTab) ? 'bg-white' : ''}
          >
            더보기
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="friends" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(friends).map((friend) => (
                <div key={friend.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage src={friend.image} alt={friend.name} />
                      <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-1 ring-white ${getStatusIndicatorClass(friend.status)}`} 
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium leading-none">{friend.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {friend.status === 'online' ? '온라인' : 
                       friend.status === 'away' ? '자리비움' : 
                       `마지막 접속: ${friend.lastActive || '알 수 없음'}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">메시지 보내기</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="followers" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(followers).map((follower) => (
                <div key={follower.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={follower.image} alt={follower.name} />
                    <AvatarFallback>{follower.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{follower.name}</p>
                    <Badge variant="outline" className="text-xs mt-1 px-1.5 py-0 h-5">팔로워</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    팔로우
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(following).map((user) => (
                <div key={user.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 mt-1 px-1.5 py-0 h-5">
                      팔로잉
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    언팔로우
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommenders" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(recommenders).map((user) => (
                <div key={user.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <Badge variant="secondary" className="text-xs mt-1 px-1.5 py-0 h-5">나를 추천한 사용자</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    프로필
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendees" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(recommendees).map((user) => (
                <div key={user.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <Badge variant="secondary" className="text-xs mt-1 px-1.5 py-0 h-5">내가 추천한 사용자</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    프로필
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="family" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(family).map((member) => (
                <div key={member.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    <Badge variant="outline" className="text-xs text-rose-500 border-rose-200 bg-rose-50 mt-1 px-1.5 py-0 h-5">
                      가족
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    메시지
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="more" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-3 flex flex-col items-center justify-center"
                onClick={() => setActiveTab('recommenders')}
              >
                <span className="font-medium">추천인</span>
                <span className="text-xs text-gray-500 mt-1">나를 추천한 사용자</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 flex flex-col items-center justify-center"
                onClick={() => setActiveTab('recommendees')}
              >
                <span className="font-medium">피추천인</span>
                <span className="text-xs text-gray-500 mt-1">내가 추천한 사용자</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 flex flex-col items-center justify-center"
                onClick={() => setActiveTab('family')}
              >
                <span className="font-medium">가족</span>
                <span className="text-xs text-gray-500 mt-1">가족 구성원</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NetworkSection;
