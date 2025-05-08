
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Flame, MessageSquare, Star, TrendingUp, Users, Clock, Heart } from 'lucide-react';

interface CommunityCategoriesProps {
  activePlanet: any;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  postCount: number;
}

const CommunityCategories: React.FC<CommunityCategoriesProps> = ({
  activePlanet,
  selectedCategoryId,
  onSelectCategory,
  postCount
}) => {
  // Generate categories based on planet topics and add some default ones
  const categories = [
    { id: null, name: "전체 게시글", icon: <MessageSquare className="w-4 h-4" />, count: postCount },
    { id: "인기", name: "인기 게시글", icon: <Flame className="w-4 h-4 text-orange-500" />, count: Math.floor(postCount * 0.3) },
    { id: "공지", name: "공지사항", icon: <Star className="w-4 h-4 text-yellow-500" />, count: Math.floor(Math.random() * 5) },
    { id: "최근", name: "최근 게시글", icon: <Clock className="w-4 h-4 text-blue-400" />, count: Math.floor(postCount * 0.5) },
    { id: "좋아요", name: "추천 게시글", icon: <Heart className="w-4 h-4 text-pink-500" />, count: Math.floor(postCount * 0.2) },
    ...(activePlanet?.topics?.map(topic => ({
      id: topic,
      name: topic,
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      count: Math.floor(Math.random() * postCount * 0.7)
    })) || [])
  ];

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Users className="mr-2 h-5 w-5" />
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
                    'bg-blue-600 text-white' : 
                    'hover:bg-white/10 text-gray-200'
                  }
                  transition-colors
                `}
              >
                <div className="flex items-center">
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </div>
                <Badge variant="secondary" className={`${selectedCategoryId === category.id ? 'bg-white/20' : 'bg-white/10'}`}>
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
