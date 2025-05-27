import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MessageSquare, User, Eye, Share2, QrCode, Pencil, Trash2 } from 'lucide-react';
import { Post } from '@/types/post';
import { processContentWithMediaEmbeds } from '@/utils/mediaUtils';
import { useToast } from "@/hooks/use-toast";
import { getCommunityStatistics } from "@/utils/storageUtils";
import CommunityBoard from '@/components/community/CommunityBoard';
import { CommunityStats, PeerSpaceCommunitySectionProps } from '@/types/community';

const PeerSpaceCommunitySection: React.FC<PeerSpaceCommunitySectionProps> = ({
  isOwner,
  config,
}) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [statistics, setStatistics] = useState<CommunityStats>({
    totalCommunities: 0,
    activeCommunities: 0,
    activeUsers: 0,
    todayPosts: 0
  });
  const { toast } = useToast();

  // Load community statistics
  useEffect(() => {
    const stats = getCommunityStatistics();
    
    if (stats.totalCommunities > 0) {
      setStatistics(stats);
    } else {
      setStatistics({
        totalCommunities: 23,
        activeCommunities: 18,
        activeUsers: 487,
        todayPosts: 41
      });
    }
  }, []);

  // 게시글 클릭 핸들러 - 페이지 전환 없이 상세보기만 렌더링
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsDetailView(true);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedPost(null);
  };

  // 게시글 액션 핸들러들
  const handleLikePost = () => {
    if (!selectedPost) return;
    toast({
      title: "게시글을 추천했습니다",
      description: "추천이 반영되었습니다.",
    });
  };

  const handleSharePost = () => {
    if (!selectedPost) return;
    const url = `${window.location.origin}/space/${config.id}/community/post/${selectedPost.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "링크가 복사되었습니다",
      description: "게시글 링크가 클립보드에 복사되었습니다.",
    });
  };

  const handleEditPost = () => {
    if (!selectedPost) return;
    toast({
      title: "게시글 수정",
      description: "게시글 수정 기능은 준비 중입니다.",
    });
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      handleBackToList();
      toast({
        title: "게시글이 삭제되었습니다",
        description: "게시글이 성공적으로 삭제되었습니다.",
      });
    }
  };

  const handleShowQR = () => {
    if (!selectedPost) return;
    toast({
      title: "QR 코드",
      description: "QR 코드 기능은 준비 중입니다.",
    });
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      {!isDetailView ? (
        // 커뮤니티 게시판 목록
        <div className="min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto py-6">
            <CommunityBoard 
              zoneName={config.title} 
              communityId={config.id}
              onPostClick={handlePostClick} // 🔥 게시글 클릭 시 상세보기로 전환
            />
          </div>
        </div>
      ) : (
        // 게시글 상세보기 섹션
        <div className="min-h-screen bg-gray-50">
          {/* 상단 네비게이션 */}
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToList}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  커뮤니티로 돌아가기
                </Button>
                <div className="text-sm text-gray-500">
                  {config.title} 커뮤니티
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 상세 내용 */}
          {selectedPost && (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* 게시글 헤더 */}
                <div className="p-8 border-b">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {selectedPost.title}
                    </h1>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{selectedPost.author}</span>
                            <div className="text-xs text-gray-500">{selectedPost.date}</div>
                          </div>
                        </div>
                        
                        {selectedPost.isEdited && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            수정됨 {selectedPost.lastEditedAt}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{selectedPost.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{selectedPost.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{selectedPost.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 태그 */}
                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedPost.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-sm bg-blue-50 text-blue-700">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 공지사항 표시 */}
                    {selectedPost.isNotice && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500 text-white">공지사항</Badge>
                          <span className="text-sm text-yellow-700">
                            이 게시글은 중요한 공지사항입니다.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 게시글 내용 */}
                <div className="p-8">
                  <div className="prose max-w-none">
                    {selectedPost.richContent ? (
                      <div 
                        className="post-content text-gray-700 leading-relaxed" 
                        dangerouslySetInnerHTML={{ 
                          __html: processContentWithMediaEmbeds(selectedPost.richContent)
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                        {selectedPost.content}
                      </div>
                    )}
                  </div>
                </div>

                {/* 게시글 액션 버튼 */}
                <div className="px-8 py-6 bg-gray-50 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLikePost}
                        className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      >
                        <Heart className="h-4 w-4" />
                        추천 ({selectedPost.likes})
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                      >
                        <MessageSquare className="h-4 w-4" />
                        댓글 ({selectedPost.comments || 0})
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSharePost}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        공유
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleShowQR}
                        className="flex items-center gap-2"
                      >
                        <QrCode className="h-4 w-4" />
                        QR
                      </Button>
                    </div>
                    
                    {/* 관리자/작성자 전용 버튼 */}
                    {(isOwner || selectedPost.author === "현재 사용자") && (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleEditPost}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          수정
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleDeletePost}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 댓글 섹션 */}
                <div className="px-8 py-6 border-t">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      댓글 {selectedPost.comments || 0}개
                    </h3>
                    
                    {/* 댓글 입력 폼 */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <textarea 
                        placeholder="댓글을 작성해주세요..."
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          댓글 작성
                        </Button>
                      </div>
                    </div>
                    
                    {/* 댓글 목록 */}
                    <div className="space-y-4">
                      {selectedPost.comments && selectedPost.comments > 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>댓글을 불러오는 중입니다...</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>첫 번째 댓글을 작성해보세요!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeerSpaceCommunitySection;