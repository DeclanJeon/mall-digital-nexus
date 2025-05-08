
// src/components/community/board/PostSection.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostSectionProps } from '../types';
import PostList from './PostList';
import PostDetail from './PostDetail';

const PostSection: React.FC<PostSectionProps> = ({
  posts,
  username,
  onEditPost,
  onDeletePost,
  onViewPostDetail,
  activeTab,
  onTabChange,
  selectedPost,
  onBackFromDetail,
}) => {
  // 선택된 게시물이 있는 경우 상세 보기 표시
  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={onBackFromDetail}
        onEdit={onEditPost}
        onDelete={onDeletePost}
        isAuthor={selectedPost.author === username}
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4 bg-white/5 border border-white/10">
        <TabsTrigger value="posts" className="text-gray-200">게시글</TabsTrigger>
        <TabsTrigger value="trending" className="text-gray-200">인기글</TabsTrigger>
        <TabsTrigger value="following" className="text-gray-200">팔로우</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostList
          posts={posts}
          username={username}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onViewPostDetail={onViewPostDetail}
        />
      </TabsContent>
      <TabsContent value="trending">
        <div className="p-8 text-center text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700">인기글이 표시됩니다. (구현 예정)</div>
      </TabsContent>
      <TabsContent value="following">
        <div className="p-8 text-center text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700">팔로우 중인 사용자의 게시글이 표시됩니다. (구현 예정)</div>
      </TabsContent>
    </Tabs>
  );
};

export default PostSection;
