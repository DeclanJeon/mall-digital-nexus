
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MoreVertical, 
  Trash, 
  Edit, 
  Share2, 
  ArrowRightLeft,
  Settings,
  Eye,
  Users,
  Star,
  Store,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface PeerMall {
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
  createdMalls = [],
  followedMalls = [],
  onCreatePeermall,
  onManageMall,
  onDeleteMall,
  onTransferMall
}) => {
  const [activeTab, setActiveTab] = useState('created');
  const [mallToDelete, setMallToDelete] = useState<number | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const confirmDelete = (id: number) => {
    setMallToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (mallToDelete !== null) {
      onDeleteMall(mallToDelete);
      setIsDeleteAlertOpen(false);
      setMallToDelete(null);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-3.5 w-3.5 text-green-500" />;
      case 'partial':
        return <Users className="h-3.5 w-3.5 text-amber-500" />;
      case 'private':
        return <Eye className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Globe className="h-3.5 w-3.5 text-gray-400" />;
    }
  };
  
  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'public': return '공개';
      case 'partial': return '일부 공개';
      case 'private': return '비공개';
      default: return '알 수 없음';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="text-lg font-medium">피어몰 관리</CardTitle>
          <Button onClick={onCreatePeermall} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            피어몰 생성
          </Button>
        </div>
        <TabsList className="mt-2">
          <TabsTrigger 
            value="created" 
            onClick={() => setActiveTab('created')}
            className={activeTab === 'created' ? 'bg-white' : ''}
          >
            생성한 피어몰 ({createdMalls.length})
          </TabsTrigger>
          <TabsTrigger 
            value="followed" 
            onClick={() => setActiveTab('followed')}
            className={activeTab === 'followed' ? 'bg-white' : ''}
          >
            팔로우 피어몰 ({followedMalls.length})
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="created" className="mt-0">
            {createdMalls.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {createdMalls.map((mall) => (
                  <div 
                    key={mall.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          {mall.image ? (
                            <img src={mall.image} alt={mall.name} className="h-full w-full object-cover" />
                          ) : (
                            <Store className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">{mall.name}</h3>
                            {mall.isCertified && (
                              <Badge variant="secondary" className="ml-2 px-1.5 py-0 h-5 bg-blue-50 text-blue-500 text-[10px]">인증됨</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 space-x-2 mt-0.5">
                            <span>{mall.type}</span>
                            <span>•</span>
                            <span>생성: {mall.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4 space-x-3">
                          <div className="flex items-center text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            <span>{mall.stats?.visitors || 0}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            <span>{mall.stats?.followers || 0}</span>
                          </div>
                          {mall.stats?.reviews !== undefined && (
                            <div className="flex items-center text-xs">
                              <Star className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              <span>{mall.stats.reviews}</span>
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>피어몰 관리</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onManageMall(mall.id)}>
                              <Settings className="h-4 w-4 mr-2" />
                              <span>관리</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              <span>정보 수정</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              <span>공유하기</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onTransferMall(mall.id)}>
                              <ArrowRightLeft className="h-4 w-4 mr-2" />
                              <span>소유권 이전</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-red-500 focus:text-red-500"
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    confirmDelete(mall.id);
                                  }}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  <span>삭제</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>피어몰 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말 '{mall.name}' 피어몰을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={handleDeleteConfirm}
                                  >
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="outline" 
                          className={`
                            flex items-center px-2 py-0.5 
                            ${mall.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 
                              mall.status === 'inactive' ? 'bg-gray-100 text-gray-600 border-gray-200' : 
                              'bg-amber-50 text-amber-600 border-amber-200'}
                          `}
                        >
                          {mall.status === 'active' ? '활성화' : 
                           mall.status === 'inactive' ? '비활성화' : '검토중'}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          {getVisibilityIcon(mall.visibility)}
                          <span className="ml-1">{getVisibilityLabel(mall.visibility)}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => onManageMall(mall.id)}
                      >
                        관리하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                <Store className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">피어몰이 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">
                  첫 피어몰을 만들어 당신만의 공간을 만들어보세요.
                </p>
                <div className="mt-6">
                  <Button onClick={onCreatePeermall}>
                    <Plus className="h-4 w-4 mr-2" />
                    피어몰 생성하기
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="followed" className="mt-0">
            {followedMalls.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {followedMalls.map((mall) => (
                  <div 
                    key={mall.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          {mall.image ? (
                            <img src={mall.image} alt={mall.name} className="h-full w-full object-cover" />
                          ) : (
                            <Store className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">{mall.name}</h3>
                            {mall.isCertified && (
                              <Badge variant="secondary" className="ml-2 px-1.5 py-0 h-5 bg-blue-50 text-blue-500 text-[10px]">인증됨</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 space-x-2 mt-0.5">
                            <span>{mall.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4 space-x-3">
                          <div className="flex items-center text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            <span>{mall.stats?.visitors || 0}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            <span>{mall.stats?.followers || 0}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              <span>방문하기</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              <span>공유하기</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              <Trash className="h-4 w-4 mr-2" />
                              <span>언팔로우</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                <Store className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">팔로우한 피어몰이 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">
                  관심 있는 피어몰을 팔로우하여 최신 활동을 확인하세요.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PeermallManagementSection;
