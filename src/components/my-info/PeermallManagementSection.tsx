import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface PeerMall {
  id: number;
  name: string;
  type: string;
  image?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  visibility: 'public' | 'partial' | 'private';
  isCertified?: boolean;
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
  onManageMall: (id: number) => void;
  onDeleteMall: (id: number) => void;
  onTransferMall: (id: number) => void;
}

const PeermallManagementSection: React.FC<PeermallManagementSectionProps> = ({
  createdMalls,
  followedMalls,
  onCreatePeermall,
  onManageMall,
  onDeleteMall,
  onTransferMall,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">피어몰 관리</CardTitle>
          <Button size="sm" onClick={onCreatePeermall}>
            <Plus className="h-4 w-4 mr-2" />
            새 피어몰 생성
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-3">내가 생성한 피어몰</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdMalls.map((mall) => (
              <div
                key={mall.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  {mall.image && (
                    <img
                      src={mall.image}
                      alt={mall.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{mall.name}</h4>
                    <p className="text-xs text-gray-500">{mall.type}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>생성일: {mall.createdAt}</span>
                  <Badge variant="outline" className="text-xs">
                    {mall.visibility === 'public' ? '공개' : 
                     mall.visibility === 'partial' ? '부분 공개' : '비공개'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageMall(mall.id)}
                  >
                    관리
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTransferMall(mall.id)}
                  >
                    양도
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteMall(mall.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">팔로우 중인 피어몰</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedMalls.map((mall) => (
              <div
                key={mall.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {mall.image && (
                    <img
                      src={mall.image}
                      alt={mall.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{mall.name}</h4>
                    <p className="text-xs text-gray-500">{mall.type}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span>생성일: {mall.createdAt}</span>
                  <Badge variant="outline" className="text-xs">
                    {mall.visibility === 'public' ? '공개' : 
                     mall.visibility === 'partial' ? '부분 공개' : '비공개'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeermallManagementSection;
