
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Flame, MessageSquare, Star, TrendingUp, Users, Clock, Heart } from 'lucide-react';

import { Planet, Post } from '../types'; // Import Planet and Post type

interface CommunityCategoriesProps {
  activePlanet: Planet | null; // Use Planet type, allow null
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  posts: Post[]; // Changed from postCount to posts
}

const CommunityCategories: React.FC<CommunityCategoriesProps> = ({
  activePlanet,
  selectedCategoryId,
  onSelectCategory,
  posts // Changed from postCount to posts
}) => {
  const getCategoryCount = (filterFn: (post: Post) => boolean) => {
    return posts.filter(filterFn).length;
  };

  // Define categories with their respective filters
  const categories = [
    { id: null, name: "전체 게시글", icon: <MessageSquare className="w-4 h-4" />, filter: () => true },
    { id: "인기", name: "인기 게시글", icon: <Flame className="w-4 h-4 text-orange-500" />, filter: (post: Post) => post.likes > 10 }, // Example: likes > 10
    { id: "공지", name: "공지사항", icon: <Star className="w-4 h-4 text-yellow-500" />, filter: (post: Post) => post.tags?.includes('공지') || post.tags?.includes('notice') },
    { id: "최근", name: "최근 게시글", icon: <Clock className="w-4 h-4 text-blue-400" />, filter: (post: Post) => {
        const postDate = new Date(post.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return postDate > sevenDaysAgo; // Example: posts from the last 7 days
      }
    },
    { id: "좋아요", name: "추천 게시글", icon: <Heart className="w-4 h-4 text-pink-500" />, filter: (post: Post) => post.tags?.includes('추천') || post.likes > 20 }, // Example: specific tag or likes > 20
    ...(activePlanet?.topics?.map(topic => ({
      id: topic,
      name: topic,
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      filter: (post: Post) => post.tags?.includes(topic)
    })) || [])
  ].map(category => ({ ...category, count: getCategoryCount(category.filter) }));

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center text-gray-100">
          <Users className="mr-2 h-5 w-5 text-gray-300" />
          <span>커뮤니티 카테고리</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(80vh-200px)] pr-4">
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id || 'all'}
                onClick={() => onSelectCategory(category.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-md text-sm
                  ${selectedCategoryId === category.id ?
                    'bg-sky-600 text-white' : // 활성 상태: 배경색 변경, 텍스트 흰색 유지
                    'hover:bg-white/10 text-gray-300' // 비활성 상태: 텍스트 밝게
                  }
                  transition-colors
                `}
              >
                <div className={`flex items-center ${selectedCategoryId === category.id ? 'text-white' : 'text-gray-300'}`}> {/* 아이콘 색상도 상태 따라 변경 */}
                  {React.cloneElement(category.icon, { className: `w-4 h-4 ${selectedCategoryId === category.id ? 'text-white' : category.icon.props.className?.includes('text-') ? category.icon.props.className : 'text-gray-300'}` })} {/* 기존 색상 유지 또는 기본값 적용 */}
                  <span className="ml-2">{category.name}</span>
                </div>
                <Badge variant="secondary" className={`${selectedCategoryId === category.id ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'}`}> {/* 텍스트 색상 추가 */}
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommunityCategories;
