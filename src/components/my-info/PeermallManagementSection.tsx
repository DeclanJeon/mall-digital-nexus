
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Plus, Settings, Trash2, Share2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PeerMall {
  id: number;
  name: string;
  type: string; // 예: '마이몰', '스페이스', '커뮤니티몰'
  image?: string;
  createdAt: string;
  status: 'active' | 'pending' | 'inactive';
  visibility: 'public' | 'partial' | 'private'; // 정책상 공개/부분공개/비공개
  isCertified?: boolean; // 정책상 인증 여부
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
  onManageMall: (mallId: number) => void;
  onDeleteMall: (mallId: number) => void;
  onTransferMall: (mallId: number) => void;
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
          
          {/* 내가 만든 피어몰 관리 */}
          <TabsContent value="created" className="space-y-4">
            {createdMalls.length > 0 ? (
              <div className="space-y-3">
                {createdMalls.map((mall) => (
                  <div key={mall.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                          {mall.image ? (
                            <img src={mall.image} alt={mall.name} className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <Store className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center">
                            {mall.name}
                            {mall.isCertified && (
                              <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 text-green-600 ml-2" aria-label="인증 피어몰" />
                              </div>
                            )}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <span>{mall.type}</span>
                            <span className="mx-1.5">•</span>
                            <span>생성일: {mall.createdAt}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Badge variant={
                              mall.status === 'active' ? 'default' :
                              mall.status === 'pending' ? 'outline' : 'secondary'
                            } className="mr-1">
                              {mall.status === 'active' ? '활성' :
                               mall.status === 'pending' ? '대기중' : '비활성'}
                            </Badge>
                            <Badge variant={
                              mall.visibility === 'public' ? 'default' :
                              mall.visibility === 'partial' ? 'outline' : 'secondary'
                            }>
                              {mall.visibility === 'public' ? '공개' :
                               mall.visibility === 'partial' ? '부분공개' : '비공개'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {/* 정책상 주요 관리 기능: 인증, 삭제, 양도 등 */}
                      <div className="flex flex-col gap-1 items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onManageMall(mall.id)}
                          className="mb-1"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          관리
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTransferMall(mall.id)}
                          className="mb-1"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          양도
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm('정말로 이 피어몰을 삭제하시겠습니까? 삭제 후 복구가 불가합니다.')
                            ) {
                              onDeleteMall(mall.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                          삭제
                        </Button>
                      </div>
                    </div>
                    
                    {/* 주요 통계 */}
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
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => window.open(`/peermall/${mall.id}`, '_blank')}>
                        방문하기
                      </Button>
                      {/* 관리 버튼은 위에 배치됨 */}
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
          
          {/* 팔로우/가입한 피어몰 */}
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
                          <h3 className="font-medium text-sm flex items-center">
                            {mall.name}
                            {mall.isCertified && (
                              <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 text-green-600 ml-1" aria-label="인증 피어몰" />
                              </div>
                            )}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{mall.type}</span>
                            <span className="mx-1.5">•</span>
                            <span>{mall.visibility === 'public' ? '공개' : mall.visibility === 'partial' ? '부분공개' : '비공개'}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => window.open(`/peermall/${mall.id}`, '_blank')}>
                        방문하기
                      </Button>
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
        {/* 정책 요약 안내문 */}
        <div className="mt-6 text-xs text-muted-foreground border-t pt-4">
          <ul className="list-disc list-inside">
            <li>피어몰은 <b>공개/비공개/부분공개</b> 설정이 가능하며, <b>인증 피어몰</b>은 신뢰도와 검색 노출에 우대됩니다.</li>
            <li>피어몰 삭제, 양도, 관리 등 주요 기능은 정책에 의거 <b>소유자(거버너)</b>만 수행할 수 있습니다.</li>
            <li>통계(방문자/팔로워/리뷰)는 피어몰 품질 및 신뢰도, 추천 등에 활용됩니다.</li>
            <li>정책 위반, 오남용 등은 서비스 약관 및 커뮤니티 가이드라인에 따라 제한될 수 있습니다.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeermallManagementSection;
