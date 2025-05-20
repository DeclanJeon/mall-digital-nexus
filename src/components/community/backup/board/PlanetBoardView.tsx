
// src/components/community/board/PlanetBoardView.tsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Users, MessageSquare, Menu, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import BoardHeader from './BoardHeader';
import PostSection from './PostSection';
import PostForm from './PostForm';
import OpenChatRooms from '../OpenChatRooms';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import { PlanetBoardViewProps, Post } from '../types'; // Post 타입 추가
import CommunityCategories from './CommunityCategories';

const PlanetBoardView: React.FC<PlanetBoardViewProps> = ({
  activePlanet,
  selectedLocation,
  posts,
  editingPost,
  showNewPostForm,
  onShowNewPostForm,
  onHideNewPostForm,
  forumForm,
  onForumSubmit,
  onEditPost,
  onDeletePost,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  username,
  onReturnToUniverse,
  activeTab,
  onTabChange,
  onViewPostDetail,
  onToggleLikePost,
  selectedPost, // props로 받음
  onBackFromDetail, // props로 받음
}) => {
  const [selectedCommunityTab, setSelectedCommunityTab] = useState("posts");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const POSTS_PER_PAGE = 10; // 한 번에 보여줄 게시물 수
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);

  // 게시글 클릭 시 Community.tsx의 네비게이션 함수 호출
  const handlePostItemClick = (post: Post) => {
    if (onViewPostDetail) {
      onViewPostDetail(post);
    }
  };

  // handleBackFromDetail 함수는 props로 전달받은 onBackFromDetail을 사용하므로 제거합니다.
  // const handleBackFromDetail = () => {
  // };

  const handleOpenQrModal = (url: string) => {
    setShareUrl(url);
    setQrModalOpen(true);
  };

  const filteredPosts = selectedCategoryId 
    ? posts.filter(post => post.tags?.includes(selectedCategoryId))
    : posts;

  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_PAGE);
  };

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 animate-fade-in">
      <BoardHeader
        selectedLocation={selectedLocation}
        onReturnToUniverse={onReturnToUniverse}
        onShowNewPostForm={selectedCommunityTab === "posts" ? onShowNewPostForm : undefined}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{activePlanet?.name} 커뮤니티</h1>
        {/* 행성 단위 채팅방 QR 생성 버튼 제거 - OpenChatRooms 내부 개별 채팅방 공유 기능 사용 */}
      </div>

      <Tabs
        value={selectedCommunityTab}
        onValueChange={setSelectedCommunityTab}
        className="mb-6"
      >
        <div className="border-b border-white/10 mb-4">
          <TabsList className="bg-transparent border-b-0 mb-0">
            <TabsTrigger 
              value="posts"
              className="data-[state=active]:text-sky-300 data-[state=active]:border-b-2 data-[state=active]:border-sky-300 rounded-none border-b-2 border-transparent text-gray-300 hover:text-sky-200"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              커뮤니티 게시판
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:text-sky-300 data-[state=active]:border-b-2 data-[state=active]:border-sky-300 rounded-none border-b-2 border-transparent text-gray-300 hover:text-sky-200"
            >
              <Users className="h-4 w-4 mr-2" />
              오픈 채팅방
              <Badge variant="secondary" className="ml-2 bg-sky-700/50 text-sky-200">New</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="mt-0">
          {showNewPostForm && (
            <PostForm
              form={forumForm}
              onSubmit={onForumSubmit}
              onCancel={onHideNewPostForm}
              editingPost={editingPost}
            />
          )}

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <CommunityCategories 
                activePlanet={activePlanet}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                posts={posts}
              />
            </div>
            
            <div className="col-span-12 lg:col-span-9">
              <PostSection
                posts={displayedPosts}
                username={username}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
                onViewPostDetail={handlePostItemClick} // 내부 핸들러 사용
                activeTab={activeTab}
                onTabChange={onTabChange}
                selectedPost={selectedPost} // props로 받은 selectedPost 전달
                onBackFromDetail={onBackFromDetail} // props로 받은 onBackFromDetail 전달
                selectedCategoryId={selectedCategoryId}
                onToggleLike={onToggleLikePost}
              />
              {filteredPosts.length > visiblePostsCount && (
                <div className="mt-6 text-center">
                  <Button onClick={handleLoadMore} variant="outline" className="text-white border-sky-500 hover:bg-sky-500/20">
                    더보기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10 p-1">
            <OpenChatRooms planetId={activePlanet?.id} />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* QRCodeModal은 OpenChatRooms 컴포넌트 내부에서 관리되므로 여기서 제거 가능,
          만약 PlanetBoardView 레벨에서 다른 공유 기능을 위해 필요하다면 유지 */}
      {/* 현재 피드백은 채팅방 공유이므로 OpenChatRooms 내부의 QRModal을 사용하는 것이 적절 */}
      {/* <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={shareUrl}
        title={`${activePlanet?.name} 채팅방 목록`} // 또는 다른 적절한 타이틀
      /> */}
    </div>
  );
};

export default PlanetBoardView;
