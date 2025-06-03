import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, MessageSquare, Users, Search } from 'lucide-react';
import { followingPeermalls } from '../data/homeMockData';

const PeerSpaceFollowingSection: React.FC = () => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">팔로잉 피어몰</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {followingPeermalls.length > 0 ? (
            followingPeermalls.map(mall => (
              <Card key={mall.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img src={mall.profileImage} alt={mall.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{mall.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">{mall.owner}</span> · 팔로워 {mall.followers.toLocaleString()}명
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{mall.description}</p>
                      
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">
                          <User className="w-4 h-4 mr-1" />
                          방문하기
                        </Button>
                        <Button variant="secondary" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          메시지
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">아직 팔로우 중인 피어몰이 없습니다</h3>
              <p className="text-gray-500 mb-4">관심 있는 피어몰을 찾아 팔로우 해보세요.</p>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                피어몰 찾기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerSpaceFollowingSection;