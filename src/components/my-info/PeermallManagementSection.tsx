
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Plus, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PeerMall {
  id: number;
  name: string;
  type: string;
  image?: string;
  createdAt: string;
  status: 'active' | 'pending' | 'inactive';
  stats?: {
    visitors: number;
    followers: number;
    reviews?: number;
  };
}

interface PeermallManagementSectionProps {
  createdMalls: PeerMall[];
  followedMalls: PeerMall[];
  onCreatePeermall: () => void;
}

const PeermallManagementSection: React.FC<PeermallManagementSectionProps> = ({
  createdMalls,
  followedMalls,
  onCreatePeermall
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Store className="h-5 w-5 mr-2 text-primary" />
          내 피어몰 관리
        </CardTitle>
        <Button onClick={onCreatePeermall} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          새 피어몰 만들기
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="created">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="created">내가 만든 피어몰</TabsTrigger>
            <TabsTrigger value="followed">가입/팔로우한 피어몰</TabsTrigger>
          </TabsList>
          
          <TabsContent value="created" className="space-y-4">
            {createdMalls.length > 0 ? (
              <div className="space-y-3">
                {createdMalls.map((mall) => (
                  <div key={mall.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                          {mall.image ? (
                            <img src={mall.image} alt={mall.name} className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <Store className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{mall.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{mall.type}</span>
                            <span className="mx-1.5">•</span>
                            <span>생성일: {mall.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          mall.status === 'active' ? 'default' :
                          mall.status === 'pending' ? 'outline' : 'secondary'
                        }
                      >
                        {mall.status === 'active' ? '활성' :
                         mall.status === 'pending' ? '대기중' : '비활성'}
                      </Badge>
                    </div>
                    
                    {mall.stats && (
                      <div className="flex mt-3 space-x-4 text-sm">
                        <div>
                          <span className="font-medium">{mall.stats.visitors.toLocaleString()}</span>
                          <span className="text-muted-foreground ml-1">방문자</span>
                        </div>
                        <div>
                          <span className="font-medium">{mall.stats.followers.toLocaleString()}</span>
                          <span className="text-muted-foreground ml-1">팔로워</span>
                        </div>
                        {mall.stats.reviews !== undefined && (
                          <div>
                            <span className="font-medium">{mall.stats.reviews.toLocaleString()}</span>
                            <span className="text-muted-foreground ml-1">리뷰</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm" className="mr-2">
                        방문하기
                      </Button>
                      <Button size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        관리
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                <h3 className="text-lg font-medium">아직 생성한 피어몰이 없습니다</h3>
                <p className="text-muted-foreground mb-4">나만의 피어몰을 만들어보세요</p>
                <Button onClick={onCreatePeermall}>
                  <Plus className="h-4 w-4 mr-2" />
                  피어몰 만들기
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="followed" className="space-y-4">
            {followedMalls.length > 0 ? (
              <div className="space-y-3">
                {followedMalls.map((mall) => (
                  <div key={mall.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                          {mall.image ? (
                            <img src={mall.image} alt={mall.name} className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <Store className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{mall.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{mall.type}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">방문하기</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                <h3 className="text-lg font-medium">팔로우한 피어몰이 없습니다</h3>
                <p className="text-muted-foreground">다양한 피어몰을 탐색해보세요</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PeermallManagementSection;
