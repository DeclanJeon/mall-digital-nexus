
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Calendar } from "lucide-react";

// 피드 게시글 타입 정의
interface FeedPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  date: string;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
  tags: string[];
}

const CommunityFeedList: React.FC = () => {
  // 샘플 피드 데이터 (실제로는 API에서 가져옵니다)
  const feedPosts: FeedPost[] = [
    {
      id: "1",
      title: "디자인 시스템 구축 경험 공유",
      content: "최근에 회사에서 디자인 시스템을 구축하면서 경험한 내용을 공유합니다. 처음에는 어려웠지만 결국 팀 전체의 생산성이 크게 향상되었습니다. 디자인 시스템은 일관된 사용자 경험을 제공하고, 개발 속도를 높이는 데 큰 도움이 됩니다...",
      author: {
        name: "김디자이너",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=KimDesigner",
        badge: "디자인 전문가"
      },
      date: "2025-05-19",
      likes: 42,
      comments: 8,
      shares: 5,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80",
      tags: ["디자인", "UI/UX", "협업"]
    },
    {
      id: "2",
      title: "리액트 성능 최적화 방법",
      content: "리액트 애플리케이션의 성능을 최적화하는 다양한 방법에 대해 알아보겠습니다. React.memo, useMemo, useCallback 등을 적절히 사용하면 렌더링 성능을 크게 향상시킬 수 있습니다...",
      author: {
        name: "박개발자",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ParkDeveloper",
        badge: "프론트엔드 개발"
      },
      date: "2025-05-18",
      likes: 37,
      comments: 11,
      shares: 9,
      tags: ["리액트", "성능최적화", "프론트엔드"]
    },
    {
      id: "3",
      title: "효과적인 커뮤니케이션 스킬 향상법",
      content: "원격 근무 환경에서 효과적으로 커뮤니케이션하는 방법에 대해 공유합니다. 명확한 메시지 전달과 적극적인 경청이 핵심입니다. 또한 비동기 커뮤니케이션 도구를 효과적으로 활용하면 시간대가 다른 팀원들과의 소통도 원활히 할 수 있습니다...",
      author: {
        name: "이매니저",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=LeeManager",
      },
      date: "2025-05-17",
      likes: 29,
      comments: 6,
      shares: 3,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80",
      tags: ["커뮤니케이션", "원격근무", "팀워크"]
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {feedPosts.map(post => (
        <Card key={post.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{post.author.name}</p>
                  {post.author.badge && (
                    <Badge variant="outline" className="text-xs bg-blue-50">
                      {post.author.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 text-sm">{formatDate(post.date)}</p>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
            
            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between text-gray-500">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                  <Heart className="h-4 w-4" /> 
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                  <MessageSquare className="h-4 w-4" /> 
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                  <Share className="h-4 w-4" /> 
                  <span>{post.shares}</span>
                </Button>
              </div>
              <span className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" /> 
                {formatDate(post.date)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunityFeedList;
