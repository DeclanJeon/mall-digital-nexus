
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, MessageSquare } from "lucide-react";

// 토픽 타입 정의
interface Topic {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  posts: number;
  color: string;
  tags: string[];
  lastActivity: string;
}

const CommunityTopicList: React.FC = () => {
  // 샘플 토픽 데이터 (실제로는 API에서 가져옵니다)
  const topics: Topic[] = [
    {
      id: "1",
      name: "UX/UI 디자인",
      description: "사용자 경험과 인터페이스 디자인에 대한 토론 및 자료 공유 공간입니다.",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
      members: 1245,
      posts: 342,
      color: "blue",
      tags: ["디자인", "UX", "프로토타이핑"],
      lastActivity: "2시간 전"
    },
    {
      id: "2",
      name: "웹 개발",
      description: "웹 프로그래밍과 관련된 기술, 트렌드, 질문을 나누는 공간입니다.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      members: 987,
      posts: 263,
      color: "green",
      tags: ["JavaScript", "React", "Node.js"],
      lastActivity: "1일 전"
    },
    {
      id: "3",
      name: "프리랜서 네트워킹",
      description: "프리랜서들이 서로의 경험과 노하우를 공유하고 협업 기회를 찾는 공간입니다.",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80",
      members: 756,
      posts: 187,
      color: "purple",
      tags: ["프리랜서", "네트워킹", "비즈니스"],
      lastActivity: "3일 전"
    },
    {
      id: "4",
      name: "디지털 마케팅",
      description: "디지털 마케팅 전략, 사례, 도구에 대해 논의하는 공간입니다.",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
      members: 623,
      posts: 142,
      color: "orange",
      tags: ["마케팅", "SEO", "소셜미디어"],
      lastActivity: "5일 전"
    },
  ];

  // 색상 클래스 맵핑
  const colorClassMap: Record<string, string> = {
    blue: "bg-blue-100 border-blue-200 hover:bg-blue-200",
    green: "bg-green-100 border-green-200 hover:bg-green-200",
    purple: "bg-purple-100 border-purple-200 hover:bg-purple-200",
    orange: "bg-orange-100 border-orange-200 hover:bg-orange-200",
    red: "bg-red-100 border-red-200 hover:bg-red-200",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {topics.map(topic => (
        <Card key={topic.id} className={`border-l-4 ${colorClassMap[topic.color] || 'border-gray-200'} hover:shadow-md transition-shadow`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{topic.name}</CardTitle>
              <Button variant="outline" size="sm">가입하기</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-md overflow-hidden mb-3">
              <img 
                src={topic.image} 
                alt={topic.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {topic.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {topic.tags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-white">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{topic.members.toLocaleString()} 멤버</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{topic.posts.toLocaleString()} 게시글</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-gray-500">
            마지막 활동: {topic.lastActivity}
          </CardFooter>
        </Card>
      ))}
      
      {/* 새 토픽 생성 카드 */}
      <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="rounded-full bg-gray-100 p-4 mb-3">
          <Users className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-1">새로운 토픽 만들기</h3>
        <p className="text-gray-500 text-sm text-center mb-4">
          관심있는 주제로 새로운 커뮤니티를 시작해보세요
        </p>
        <Button>토픽 만들기</Button>
      </Card>
    </div>
  );
};

export default CommunityTopicList;
