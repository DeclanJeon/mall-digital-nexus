
// src/components/community/board/PlanetBoardView.tsx
import React, { useState } from 'react';
import BoardHeader from './BoardHeader';
import PostSection from './PostSection';
import PostForm from './PostForm';
import ChatPanel from '../chat/ChatPanel';
import { PlanetBoardViewProps } from '../types';

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
}) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleViewPostDetail = (post) => {
    setSelectedPost(post);
  };

  const handleBackFromDetail = () => {
    setSelectedPost(null);
  };

  return (
    <div 
      className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 animate-fade-in"
    >
      <BoardHeader
        selectedLocation={selectedLocation}
        onReturnToUniverse={onReturnToUniverse}
        onShowNewPostForm={onShowNewPostForm}
      />

      {showNewPostForm && (
        <PostForm
          form={forumForm}
          onSubmit={onForumSubmit}
          onCancel={onHideNewPostForm}
          editingPost={editingPost}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <PostSection
            posts={posts}
            username={username}
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            onViewPostDetail={handleViewPostDetail}
            activeTab={activeTab}
            onTabChange={onTabChange}
            selectedPost={selectedPost}
            onBackFromDetail={handleBackFromDetail}
          />
        </div>
        <div className="lg:col-span-1">
          <ChatPanel
            messages={messages}
            newMessage={newMessage}
            onNewMessageChange={onNewMessageChange}
            onSendMessage={onSendMessage}
            username={username}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanetBoardView;
