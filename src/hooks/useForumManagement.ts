
import { useState, useCallback } from 'react';
import { useSpaceData } from './useSpaceData';
import { Post, ForumPostFormData } from '@/types/community';

export const useForumManagement = (planetId: string) => {
  const { posts, addPost, updatePost, deletePostById } = useSpaceData();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const planetPosts = posts.filter((post) => post.communityId === planetId);

  const submitPost = useCallback(
    async (formData: ForumPostFormData, userId: string, userName: string) => {
      setLoading(true);
      setError(null);

      try {
        // Create post with required fields
        const newPost: Omit<Post, 'id' | 'date' | 'authorAvatar' | 'likes' | 'comments' | 'country'> = {
          title: formData.title,
          content: formData.content,
          author: userName,
          authorId: userId,
          tags: formData.tags || [],
          channelId: formData.channelId || 'general',
          communityId: planetId,
          isNotice: formData.isNotice || false,
          createdAt: new Date().toISOString(),
          htmlContent: formData.htmlContent || '',
        };

        // Generate unique ID
        const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Create full post object
        const completePost: Post = {
          ...newPost as any,
          id: postId,
          date: new Date().toISOString(),
          likes: 0,
          comments: 0,
          country: 'kr',
          authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`
        };

        // Add to posts
        addPost(completePost);
        setLoading(false);
        return completePost;
      } catch (err) {
        setError('Failed to submit post. Please try again.');
        setLoading(false);
        throw err;
      }
    },
    [addPost, planetId]
  );

  const editPost = useCallback(
    async (postId: string, formData: Partial<ForumPostFormData>) => {
      setLoading(true);
      setError(null);

      try {
        const postToUpdate = posts.find((post) => post.id === postId);
        
        if (!postToUpdate) {
          throw new Error('Post not found');
        }

        const updatedPost: Post = {
          ...postToUpdate,
          title: formData.title || postToUpdate.title,
          content: formData.content || postToUpdate.content,
          tags: formData.tags || postToUpdate.tags,
          isNotice: formData.isNotice !== undefined ? formData.isNotice : postToUpdate.isNotice,
          htmlContent: formData.htmlContent || postToUpdate.htmlContent || '',
          isEdited: true,
          lastEditedAt: new Date().toISOString()
        };

        updatePost(updatedPost);
        setLoading(false);
        return updatedPost;
      } catch (err) {
        setError('Failed to update post. Please try again.');
        setLoading(false);
        throw err;
      }
    },
    [posts, updatePost]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      setLoading(true);
      setError(null);

      try {
        deletePostById(postId);
        setLoading(false);
        return true;
      } catch (err) {
        setError('Failed to delete post. Please try again.');
        setLoading(false);
        throw err;
      }
    },
    [deletePostById]
  );

  return {
    posts: planetPosts,
    allPosts: posts,
    submitPost,
    editPost,
    deletePost,
    loading,
    error
  };
};
