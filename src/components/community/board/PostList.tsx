
// src/components/community/board/PostList.tsx
import React from 'react';
import { PostListProps } from '../types';
import PostItem from './PostItem';

const PostList: React.FC<PostListProps> = ({
  posts,
  username,
  onEditPost,
  onDeletePost,
  onViewPostDetail,
}) => {
  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
        게시글이 없습니다. 새 글을 작성해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostItem
          key={post.id}
          post={post}
          isAuthor={post.author === username}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onViewPostDetail={onViewPostDetail}
        />
      ))}
    </div>
  );
};

export default PostList;
