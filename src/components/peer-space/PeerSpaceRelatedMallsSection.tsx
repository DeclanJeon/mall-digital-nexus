import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Star, Heart } from 'lucide-react';
// TODO: Import PeerMallConfig if needed later
// import { PeerMallConfig } from './types';

const PeerSpaceRelatedMallsSection: React.FC = () => {
  // Placeholder data - replace with actual data from config or API
  const relatedMalls = [
    {
      id: 'mall1',
      name: '디자인 크리에이터 스튜디오',
      description: '다양한 디자인 리소스를 공유하는 공간',
      imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
      followers: 89,
      recommendations: 32
    },
    {
      id: 'mall2',
      name: '프리랜서 네트워크',
      description: '프리랜서들을 위한 협업 공간',
      imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=freelance',
      followers: 124,
      recommendations: 45
    },
    {
      id: 'mall3', 
      name: '브랜딩 전문가 그룹',
      description: '브랜드 아이덴티티 전문가들의 모임',
      imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=branding',
      followers: 67,
      recommendations: 28
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <Users className="mr-2 h-5 w-5 text-primary-300" />
          연관 피어몰
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedMalls.map((mall) => (
            <div key={mall.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mall.imageUrl} alt={mall.name} />
                  <AvatarFallback className="bg-accent-200 text-white">
                    {mall.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{mall.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{mall.description}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" /> {mall.followers}명
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" /> {mall.recommendations}개
                </span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/peermall/${mall.id}`}>방문하기</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeerSpaceRelatedMallsSection;
