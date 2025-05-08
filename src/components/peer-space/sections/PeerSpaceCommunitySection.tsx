
import React from 'react';
import { PeerMallConfig } from '../types';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Avatar, AvatarImage, AvatarFallback 
} from '@/components/ui/avatar';
import { 
  Users, ThumbsUp, MessageSquare, ArrowRight, Edit, Clock 
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PeerSpaceCommunityProps {
  config: PeerMallConfig;
  isOwner: boolean;
}

const PeerSpaceCommunitySection: React.FC<PeerSpaceCommunityProps> = ({ config, isOwner }) => {
  // Example community posts
  const recentPosts = [
    {
      id: '1',
      title: '새로운 디자인 트렌드에 대한 생각을 나눠요',
      author: '김디자인',
      authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Jieun',
      date: '2025-04-23',
      likes: 24,
      comments: 8,
      views: 132
    },
    {
      id: '2',
      title: '다음 워크샵에서 다루었으면 하는 주제는?',
      author: config.owner,
      authorImage: config.profileImage,
      date: '2025-04-20',
      likes: 35,
      comments: 12,
      views: 189
    },
    {
      id: '3',
      title: '포트폴리오 피드백 부탁드립니다',
      author: '박창작',
      authorImage: 'https://api.dicebear.com/7.x/personas/svg?seed=Park',
      date: '2025-04-18',
      likes: 18,
      comments: 14,
      views: 98
    }
  ];
  
  // Example active chats
  const activeChats = [
    {
      id: 'chat1',
      name: '디자인 토론방',
      members: 28,
      activeMembers: 8,
      lastMessage: '요즘 많이 사용되는 컬러 팔레트에 대해 논의 중입니다',
      lastMessageTime: '2분 전'
    },
    {
      id: 'chat2',
      name: '초보자 질문방',
      members: 42,
      activeMembers: 5,
      lastMessage: '도구 사용법에 대한 질문이 있습니다',
      lastMessageTime: '15분 전'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">커뮤니티</h2>
        
        {isOwner && (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> 커뮤니티 관리
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent posts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">최근 게시글</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {recentPosts.map(post => (
              <div 
                key={post.id} 
                className="p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={post.authorImage} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{post.author}</span>
                      <span className="mx-1.5">•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <ThumbsUp className="h-3 w-3 mr-1" /> {post.likes}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <MessageSquare className="h-3 w-3 mr-1" /> {post.comments}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" /> {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="text-xs w-full">
              모든 게시글 보기 <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>

        {/* Active live chats */}
        {config.customizations.showChat && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">실시간 채팅</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3 mb-4">
                {activeChats.map(chat => (
                  <div 
                    key={chat.id}
                    className="border rounded-lg p-3 hover:border-blue-300 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{chat.name}</h3>
                      <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{chat.activeMembers} 활동 중</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-1 mb-1.5">
                      {chat.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{chat.members} 멤버</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{chat.lastMessageTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">새 메시지 작성:</p>
                <div className="flex gap-2">
                  <Input placeholder="채팅방에 메시지 보내기..." className="text-sm" />
                  <Button size="sm" className="shrink-0">보내기</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PeerSpaceCommunitySection;
