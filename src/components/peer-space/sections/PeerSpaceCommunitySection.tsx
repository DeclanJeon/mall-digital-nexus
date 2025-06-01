import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MessageSquare, User, Eye, Share2, QrCode, Pencil, Trash2, Send } from 'lucide-react'; 
import { Post, Comment } from '@/types/post'; 
import { processContentWithMediaEmbeds } from '@/utils/mediaUtils';
import { useToast } from "@/hooks/use-toast";
import { getCommunityStatistics, loadCommentsFromLocalStorage, saveCommentToLocalStorage, generateCommentId, deleteCommentFromLocalStorage } from "@/utils/storageUtils"; 
import CommunityBoard from '@/components/community/CommunityBoard';
import { CommunityStats, PeerSpaceCommunitySectionProps } from '@/types/community';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { getCommentList, registerComment } from '@/services/communityService';

// 임시 사용자 정보 (실제 앱에서는 인증 컨텍스트 등을 사용)
const TEMP_IS_LOGGED_IN = true; // 예시: 사용자가 로그인했다고 가정
const TEMP_CURRENT_USER_EMAIL = "user@example.com"; // 예시: 로그인한 사용자 이메일

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

  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editableNickname, setEditableNickname] = useState(""); // 닉네임 입력 상태

  // 임시 로그인 상태 및 사용자 정보
  const [isLoggedIn, setIsLoggedIn] = useState(TEMP_IS_LOGGED_IN);
  const [currentUserEmail, setCurrentUserEmail] = useState(TEMP_CURRENT_USER_EMAIL);

  // 로그인 상태 또는 사용자 이메일 변경 시 editableNickname 초기화
  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      setEditableNickname(currentUserEmail.split('@')[0]);
    } else {
      setEditableNickname("");
    }
  }, [isLoggedIn, currentUserEmail]);

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

  

  // 게시글 선택 시 댓글 로드
  useEffect(() => {
    if (selectedPost && selectedPost.id) {
      const loadCommentList = async () => {
        const loadedComments = await getCommentList(selectedPost.id);
        setComments(loadedComments);
      }

      loadCommentList();
    } else {
      setComments([]); 
    }
  }, [selectedPost]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedPost(null);
  };

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

  const handleAddComment = async () => {
    if (!selectedPost || !newComment.trim()) {
      toast({
        title: "댓글 작성 실패",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    let authorName = editableNickname.trim();
    const currentIsAnonymous = !isLoggedIn;

    if (!authorName) { // 사용자가 닉네임을 비웠거나, 비로그인 시 초기 상태
      if (isLoggedIn && currentUserEmail) {
        authorName = currentUserEmail.split('@')[0]; // 로그인 사용자는 기본값(이메일 아이디) 사용
      } else {
        toast({
          title: "닉네임 필요",
          description: "댓글을 작성하려면 닉네임을 입력해야 합니다.",
          variant: "destructive",
        });
        return;
      }
    }

    const commentToAdd: Comment = {
      id: generateCommentId(),
      postId: selectedPost.id,
      name: authorName,
      author: authorName,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      isAnonymous: currentIsAnonymous, // 로그인 여부에 따라 익명성 결정
    };

    await registerComment(commentToAdd);
    setComments(prevComments => [...prevComments, commentToAdd].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    setNewComment("");

    // 닉네임 필드는 현재 값 유지 (로그인 사용자는 기본값으로, 비로그인 사용자는 입력값으로)
    // 비로그인 후 댓글 작성 시 닉네임 필드를 비우고 싶다면 아래 주석 해제
    // if (!isLoggedIn) {
    //   setEditableNickname(""); 
    // }

    toast({
      title: "댓글이 작성되었습니다.",
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      deleteCommentFromLocalStorage(commentId);
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      toast({
        title: "댓글이 삭제되었습니다.",
      });
    }
  };


  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      {!isDetailView ? (
        <div className="min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto py-6">
            <CommunityBoard 
              zoneName={config.title} 
              communityId={config.id}
              onPostClick={handlePostClick} 
            />
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
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

          {selectedPost && (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                    
                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedPost.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-sm bg-blue-50 text-blue-700">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

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
                        댓글 ({comments.length})
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

                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">댓글 ({comments.length})</h2>
                  
                  <div className="space-y-6 mb-8">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                            {comment.name.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-800">
                                {comment.name}
                                {comment.isAnonymous && <span className="text-xs text-gray-500 ml-2">(익명)</span>}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                              </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 mt-2 p-0 h-auto"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">댓글 작성하기</h3>
                    <div className="mb-4">
                      {/* <label htmlFor="editableNickname" className="block text-sm font-medium text-gray-700 mb-1">
                        닉네임 {isLoggedIn ? `(기본: ${currentUserEmail?.split('@')[0]}, 수정 가능)` : "(익명으로 작성됩니다)"}
                      </label>
                      <Input 
                        type="text" 
                        id="editableNickname" 
                        value={editableNickname} 
                        onChange={(e) => setEditableNickname(e.target.value)} 
                        placeholder={isLoggedIn ? "닉네임 수정 가능" : "닉네임을 입력하세요"}
                        className="w-full md:w-1/2"
                      /> */}
                    </div>
                    <Textarea 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)} 
                      placeholder="따뜻한 댓글을 남겨주세요."
                      rows={4}
                      className="mb-4"
                    />
                    <Button onClick={handleAddComment} className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      댓글 등록
                    </Button>
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