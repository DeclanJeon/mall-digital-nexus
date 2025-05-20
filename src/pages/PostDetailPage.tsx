
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, MessageSquare, ArrowLeft, Share, QrCode, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/community/RichTextEditor";
import { Editor } from '@toast-ui/react-editor';
import { loadPostsFromLocalStorage, savePostToLocalStorage, deletePostFromLocalStorage } from "@/utils/storageUtils";
import { Post } from "@/types/post";
import { CommunityZone } from "@/types/community";
import { processContentWithMediaEmbeds, processEditorContentForSave } from "@/utils/mediaUtils";

const PostDetailPage = () => {
  const { communityId, postId, slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [community, setCommunity] = useState<CommunityZone | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const editorRef = React.useRef<any>(null);
  const { toast } = useToast();
  const currentUrl = window.location.href;

  // Load post data
  useEffect(() => {
    const loadedPosts = loadPostsFromLocalStorage();
    let foundPost;
    
    if (slug) {
      // Find post by slug
      foundPost = loadedPosts.find(p => p.slug === slug);
    } else if (postId) {
      // Fall back to finding by ID if no slug
      foundPost = loadedPosts.find(p => p.id === postId);
    }
    
    if (foundPost) {
      setPost(foundPost);
      
      // Increment view count
      if (foundPost.viewCount === undefined) {
        foundPost.viewCount = 1;
      } else {
        foundPost.viewCount += 1;
      }
      savePostToLocalStorage(foundPost);
      
      // Set edit form initial values
      setEditedTitle(foundPost.title);
      setEditedContent(foundPost.richContent || foundPost.content);
    } else {
      toast({
        title: "게시글을 찾을 수 없습니다",
        variant: "destructive",
      });
      navigate(-1);
    }
  }, [postId, slug, navigate, toast]);

  // Handle like button click
  const handleLike = () => {
    if (!post) return;
    
    const updatedPost = {
      ...post,
      likes: (post.likes || 0) + 1
    };
    
    savePostToLocalStorage(updatedPost);
    setPost(updatedPost);
    
    toast({
      title: "추천했습니다",
      description: "이 게시글을 추천했습니다.",
    });
  };

  // Handle share button click
  const handleShare = () => {
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: "링크가 복사되었습니다",
      description: "게시글 링크가 클립보드에 복사되었습니다.",
    });
  };

  // Handle edit submit
  const handleEditSubmit = () => {
    if (!post) return;
    
    if (!editedTitle.trim()) {
      toast({
        title: "제목을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const richContent = editorInstance.getHTML();
      const plainContent = editorInstance.getMarkdown();
      
      if (!plainContent.trim()) {
        toast({
          title: "내용을 입력해주세요",
          variant: "destructive",
        });
        return;
      }
      
      // Process content to embed media
      const processedContent = processEditorContentForSave(richContent);
      
      const updatedPost = {
        ...post,
        title: editedTitle,
        content: plainContent.substring(0, 150) + (plainContent.length > 150 ? "..." : ""),
        richContent: processedContent, // Use processed content with media embeds
      };
      
      savePostToLocalStorage(updatedPost);
      setPost(updatedPost);
      setIsEditing(false);
      
      toast({
        title: "게시글이 수정되었습니다",
      });
    }
  };

  // Handle delete post
  const handleDeletePost = () => {
    if (!post) return;
    
    deletePostFromLocalStorage(post.id);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "게시글이 삭제되었습니다",
    });
    
    // Navigate back to community page
    if (communityId) {
      navigate(`/community/${communityId}`);
    } else {
      navigate("/community");
    }
  };

  // Navigate back
  const handleBack = () => {
    navigate(-1);
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        게시글을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
      </Button>
      
      {!isEditing ? (
        <Card className="w-full">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.isNotice && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      공지
                    </Badge>
                  )}
                  {post.tags && post.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs py-0 h-5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setIsQRDialogOpen(true)}>
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-4">
                <span>작성자: {post.author}</span>
                <span>작성일: {post.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {post.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> {post.comments || 0}
                </span>
                <span>조회수: {post.viewCount || 1}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-6">
            {post.richContent ? (
              <div dangerouslySetInnerHTML={{ 
                __html: processContentWithMediaEmbeds(post.richContent)
              }} className="post-content" />
            ) : (
              <div dangerouslySetInnerHTML={{ 
                __html: processContentWithMediaEmbeds(post.content) 
              }} className="whitespace-pre-wrap post-content" />
            )}
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline" onClick={handleLike} className="flex gap-2">
              <ThumbsUp className="h-4 w-4" /> 추천하기
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> 수정하기
              </Button>
              <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> 삭제하기
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>게시글 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">내용</label>
              <div className="border rounded-md">
                <RichTextEditor 
                  ref={editorRef}
                  initialValue={editedContent}
                  height="400px"
                  initialEditType="wysiwyg"
                  previewStyle="vertical"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button onClick={handleEditSubmit}>
              수정 완료
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 QR 코드</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <QRCodeSVG value={currentUrl} size={200} />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsQRDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetailPage;
