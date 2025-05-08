// src/components/community/PostSection.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostSectionProps } from '../types';
import PostList from './PostList';

const PostSection: React.FC<PostSectionProps> = ({
  posts,
  username,
  onEditPost,
  onDeletePost,
  onViewPostDetail,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4 bg-white/5 border border-white/10">
        <TabsTrigger value="posts">게시글</TabsTrigger>
        <TabsTrigger value="trending">인기글</TabsTrigger>
        <TabsTrigger value="following">팔로우</TabsTrigger>
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
        <div className="p-8 text-center text-gray-400">인기글이 표시됩니다. (구현 예정)</div>
      </TabsContent>
      <TabsContent value="following">
        <div className="p-8 text-center text-gray-400">팔로우 중인 사용자의 게시글이 표시됩니다. (구현 예정)</div>
      </TabsContent>
    </Tabs>
  );
};

export default PostSection;