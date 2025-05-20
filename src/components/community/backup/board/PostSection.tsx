
// src/components/community/board/PostSection.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, TrendingUp, Users, Clock } from 'lucide-react';
import { PostSectionProps } from '../types';
import PostList from './PostList';
import PostDetail from './PostDetail';

import { Post } from '../types'; // Post 타입을 가져옵니다.

interface ExtendedPostSectionProps extends PostSectionProps {
  selectedCategoryId?: string | null;
  onToggleLike?: (postId: string) => void; // onToggleLike prop을 옵셔널로 변경
}

const PostSection: React.FC<ExtendedPostSectionProps> = ({
  posts,
  username,
  onEditPost,
  onDeletePost,
  onViewPostDetail,
  activeTab,
  onTabChange,
  selectedPost,
  onBackFromDetail,
  selectedCategoryId,
  onToggleLike, // props로 받음
}) => {
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

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

  const categoryTitle = selectedCategoryId 
    ? selectedCategoryId === "인기" ? "인기 게시글" 
      : selectedCategoryId === "공지" ? "공지사항"
      : selectedCategoryId === "최근" ? "최근 게시글"
      : selectedCategoryId === "좋아요" ? "추천 게시글"
      : `#${selectedCategoryId} 관련 게시글`
    : "전체 게시글";

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-0">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center text-gray-100">
            {selectedCategoryId === "인기" && <TrendingUp className="mr-2 h-5 w-5 text-orange-400" />}
            {selectedCategoryId === "최근" && <Clock className="mr-2 h-5 w-5 text-sky-400" />}
            {categoryTitle} <span className="ml-2 text-gray-400 text-sm font-normal">총 {posts.length}개</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <div className="bg-black/20 rounded-md p-0.5 flex">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-sm p-1.5 ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-sm p-1.5 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="p-4">
          <TabsList className="mb-4 bg-black/20 border border-white/10 rounded-md">
            <TabsTrigger value="posts" className="text-gray-300 hover:text-sky-200 data-[state=active]:bg-sky-700/50 data-[state=active]:text-sky-200 rounded-sm">게시글</TabsTrigger>
            <TabsTrigger value="trending" className="text-gray-300 hover:text-sky-200 data-[state=active]:bg-sky-700/50 data-[state=active]:text-sky-200 rounded-sm">인기글</TabsTrigger>
            <TabsTrigger value="following" className="text-gray-300 hover:text-sky-200 data-[state=active]:bg-sky-700/50 data-[state=active]:text-sky-200 rounded-sm">팔로우</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostList
              posts={posts}
              username={username}
              onEditPost={onEditPost}
              onDeletePost={onDeletePost}
              onViewPostDetail={onViewPostDetail}
              onToggleLike={onToggleLike} // PostList로 onToggleLike 전달
              viewMode={viewMode}
            />
          </TabsContent>
          <TabsContent value="trending">
            <div className="p-8 text-center text-gray-300 bg-black/20 rounded-lg border border-white/10">인기글이 표시됩니다. (구현 예정)</div>
          </TabsContent>
          <TabsContent value="following">
            <div className="p-8 text-center text-gray-300 bg-black/20 rounded-lg border border-white/10">팔로우 중인 사용자의 게시글이 표시됩니다. (구현 예정)</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PostSection;
