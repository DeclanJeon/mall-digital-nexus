import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface FollowingPeermall {
  id: string;
  title: string;
  imageUrl: string;
}

interface FollowingSectionProps {
  following: FollowingPeermall[];
}

const FollowingSection: React.FC<FollowingSectionProps> = ({ following }) => {
  return (
    <section className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">팔로잉 피어몰</h2>
      </div>
      
      <div className="p-6">
        {following.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {following.map((peermall) => (
              <Card key={peermall.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3">
                    <img 
                      src={peermall.imageUrl} 
                      alt={peermall.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-center line-clamp-2">{peermall.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">아직 팔로우 중인 피어몰이 없습니다</h3>
            <p className="text-gray-500 mb-4">관심 있는 피어몰을 찾아 팔로우 해보세요.</p>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              피어몰 찾기
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FollowingSection;
