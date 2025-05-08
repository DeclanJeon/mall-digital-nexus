// src/components/community/hooks/useForumManagement.ts
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Post, ForumPostFormData, Planet } from '@/components/community/types';

interface UseForumManagementParams {
  username: string;
  activePlanet: Planet | null;
  addPostCallback: (newPost: Post) => void;
  updatePostCallback: (updatedPost: Post) => void;
  deletePostByIdCallback: (postId: string) => void;
}

export const useForumManagement = ({
  username,
  activePlanet,
  addPostCallback,
  updatePostCallback,
  deletePostByIdCallback,
}: UseForumManagementParams) => {
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();

  const forumForm = useForm<ForumPostFormData>({
    defaultValues: { title: '', content: '', tags: '' },
  });

  const handleShowNewPostForm = useCallback(() => {
    setEditingPost(null);
    forumForm.reset({ title: '', content: '', tags: '' });
    setShowNewPostForm(true);
  }, [forumForm]);

  const handleHideNewPostForm = useCallback(() => {
    setShowNewPostForm(false);
    setEditingPost(null);
  }, []);

  const onForumSubmit = useCallback(
    (data: ForumPostFormData) => {
      if (!activePlanet) {
        toast({
          title: '오류',
          description: '게시글을 작성할 행성이 선택되지 않았습니다.',
          variant: 'destructive',
        });
        return;
      }

      const postData: Omit<
        Post,
        'id' | 'authorAvatar' | 'date' | 'likes' | 'comments' | 'country'
      > = {
        // country 추가
        planetId: activePlanet.id,
        author: username,
        title: data.title,
        content: data.content,
        htmlContent: data.content.replace(/\n/g, '<br/>'),
        tags: data.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ''),
      };

      if (editingPost) {
        const updatedPost: Post = {
          ...editingPost,
          ...postData,
        };
        updatePostCallback(updatedPost);
        toast({
          title: '게시글 수정 완료',
          description: `"${updatedPost.title}" 게시글이 수정되었습니다.`,
        });
      } else {
        const newPost: Post = {
          id: `post-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 5)}`,
          ...postData,
          authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
          date: new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          likes: 0,
          comments: 0,
          // country: 'KR', // 예시: 사용자 국가 정보가 있다면 추가
        };
        addPostCallback(newPost);
        toast({
          title: '게시글 작성 완료',
          description: `"${newPost.title}" 게시글이 등록되었습니다.`,
        });
      }
      handleHideNewPostForm();
    },
    [
      username,
      activePlanet,
      editingPost,
      toast,
      addPostCallback,
      updatePostCallback,
      handleHideNewPostForm,
    ]
  );

  const handleEditPost = useCallback(
    (post: Post) => {
      setEditingPost(post);
      forumForm.reset({
        title: post.title,
        content: post.content,
        tags: post.tags.join(', '),
      });
      setShowNewPostForm(true);
    },
    [forumForm]
  );

  const handleDeletePost = useCallback(
    (postId: string) => {
      deletePostByIdCallback(postId);
      toast({
        title: '게시글 삭제됨',
        description: '게시글이 삭제되었습니다.',
        variant: 'destructive',
      });
    },
    [deletePostByIdCallback, toast]
  );

  const handleViewPostDetail = useCallback(
    (post: Post) => {
      toast({
        title: '상세보기 요청',
        description: `"${post.title}" (구현 예정)`,
      });
    },
    [toast]
  );

  return {
    showNewPostForm,
    editingPost,
    forumForm,
    handleShowNewPostForm,
    handleHideNewPostForm,
    onForumSubmit,
    handleEditPost,
    handleDeletePost,
    handleViewPostDetail,
  };
};
