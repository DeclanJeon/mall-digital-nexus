
// src/components/community/board/PostSection.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, TrendingUp, Users, Clock } from 'lucide-react';
import { PostSectionProps } from '../types';
import PostList from './PostList';
import PostDetail from './PostDetail';

interface ExtendedPostSectionProps extends PostSectionProps {
  selectedCategoryId?: string | null;
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
          <h3 className="text-xl font-semibold flex items-center">
            {selectedCategoryId === "인기" && <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />}
            {selectedCategoryId === "최근" && <Clock className="mr-2 h-5 w-5 text-blue-400" />}
            {categoryTitle} <span className="ml-2 text-gray-400 text-sm font-normal">총 {posts.length}개</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <div className="bg-white/5 rounded-md p-1 flex">
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-md ${viewMode === 'list' ? 'bg-white/10' : ''}`}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-md ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="p-4">
          <TabsList className="mb-4 bg-white/5 border border-white/10">
            <TabsTrigger value="posts" className="text-gray-200 data-[state=active]:bg-blue-600/20">게시글</TabsTrigger>
            <TabsTrigger value="trending" className="text-gray-200 data-[state=active]:bg-blue-600/20">인기글</TabsTrigger>
            <TabsTrigger value="following" className="text-gray-200 data-[state=active]:bg-blue-600/20">팔로우</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostList
              posts={posts}
              username={username}
              onEditPost={onEditPost}
              onDeletePost={onDeletePost}
              onViewPostDetail={onViewPostDetail}
              viewMode={viewMode}
            />
          </TabsContent>
          <TabsContent value="trending">
            <div className="p-8 text-center text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700">인기글이 표시됩니다. (구현 예정)</div>
          </TabsContent>
          <TabsContent value="following">
            <div className="p-8 text-center text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700">팔로우 중인 사용자의 게시글이 표시됩니다. (구현 예정)</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PostSection;
