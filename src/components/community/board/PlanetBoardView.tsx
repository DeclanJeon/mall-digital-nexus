
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
import { PlanetBoardViewProps } from '../types';
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
  onToggleLikePost, // props로 받음
}) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCommunityTab, setSelectedCommunityTab] = useState("posts");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleViewPostDetail = (post) => {
    setSelectedPost(post);
  };

  const handleBackFromDetail = () => {
    setSelectedPost(null);
  };

  const handleOpenQrModal = (url: string) => {
    setShareUrl(url);
    setQrModalOpen(true);
  };

  const filteredPosts = selectedCategoryId 
    ? posts.filter(post => post.tags?.includes(selectedCategoryId))
    : posts;

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 animate-fade-in">
      <BoardHeader
        selectedLocation={selectedLocation}
        onReturnToUniverse={onReturnToUniverse}
        onShowNewPostForm={selectedCommunityTab === "posts" ? onShowNewPostForm : undefined}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{activePlanet?.name} 커뮤니티</h1>
        <div className="flex space-x-2">
          {selectedCommunityTab === "chat" && (
            <Button 
              size="sm"
              variant="secondary"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white"
              onClick={() => handleOpenQrModal(`${window.location.origin}/community/chat/${activePlanet?.id}`)}
            >
              <QrCode className="w-4 h-4" />
              <span>QR 코드 생성</span>
            </Button>
          )}
        </div>
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
                posts={filteredPosts}
                username={username}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
                onViewPostDetail={handleViewPostDetail}
                activeTab={activeTab}
                onTabChange={onTabChange}
                selectedPost={selectedPost}
                onBackFromDetail={handleBackFromDetail}
                selectedCategoryId={selectedCategoryId}
                onToggleLike={onToggleLikePost} // PostSection으로 onToggleLikePost 전달
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10 p-1">
            <OpenChatRooms planetId={activePlanet?.id} />
          </div>
        </TabsContent>
      </Tabs>
      
      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={shareUrl}
        title={`${activePlanet?.name} 채팅방`}
      />
    </div>
  );
};

export default PlanetBoardView;
