
// src/components/community/Community.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Planet, ChatMessage, Post } from '@/components/community/types'; // ForumPostFormData 등은 훅 내부에서 사용

import { useUserData } from '@/hooks/useUserData';
import { useSpaceData } from '@/hooks/useSpaceData';
import { usePlanetCreation } from '@/hooks/usePlanetCreation';
import { useForumManagement } from '@/hooks/useForumManagement';

import AppHeader from '@/components/community/AppHeader';
import UniverseView from '@/components/community/UniverseView';
import PlanetBoardView from '@/components/community/board/PlanetBoardView'; // 경로 수정
import IntegratedPlanetCreationWizard from '@/components/community/IntegratedPlanetCreationWizard';
import { Button } from '@/components/ui/button'; // 에러 발생 시 사용

const Community = () => {
  const { username } = useUserData();
  const {
    planets, addPlanet,
    posts, addPost, updatePost, deletePostById,
    messages, addMessage,
    filter, setFilter,
    filteredPlanets,
  } = useSpaceData();
  
  const { toast, dismiss } = useToast(); // dismiss는 행성 생성 시 토스트 닫기에 사용

  // --- UI 상태 ---
  const [activePlanet, setActivePlanetUi] = useState<Planet | null>(null); // 마우스오버/선택된 행성 (UI용)
  const [showBoardView, setShowBoardView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('우주');
  const [activeTab, setActiveTab] = useState('posts');
  const [newMessageText, setNewMessageText] = useState(''); // 채팅 입력 텍스트 (훅과 분리)
  const [darkMode, setDarkMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const universeMapRefGlobal = useRef<HTMLDivElement>(null); // UniverseView와 usePlanetCreation이 공유할 ref

  const {
    isSelectingPlanetPosition,
    isPlanetWizardOpen,
    setIsPlanetWizardOpen,
    cursorPositionHint,
    handleMapClickForPosition,
    handleMouseMoveOnMap,
    handleMouseLeaveMap,
    startPlanetCreationProcess,
    cancelPlanetCreationProcess,
    handleWizardCreatePlanet,
  } = usePlanetCreation({
    username,
    zoomLevel,
    universeMapRef: universeMapRefGlobal, // 생성된 ref 전달
    onCreatePlanetCallback: addPlanet, // useSpaceData의 addPlanet 사용
  });
  
  const {
    showNewPostForm,
    editingPost,
    forumForm,
    handleShowNewPostForm,
    handleHideNewPostForm,
    onForumSubmit,
    handleEditPost,
    handleDeletePost,
    handleViewPostDetail,
  } = useForumManagement({
    username,
    activePlanet: activePlanet, // 현재 UI에서 활성화된 행성 전달
    addPostCallback: addPost,
    updatePostCallback: updatePost,
    deletePostByIdCallback: deletePostById,
  });


  // --- 핸들러 함수 (UI 및 네비게이션 관련) ---
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleDarkModeToggle = () => setDarkMode(prev => !prev);

  const handlePlanetMouseEnterUniverse = (planet: Planet) => {
    if (!isSelectingPlanetPosition) {
      setActivePlanetUi(planet);
    }
  };
  const handlePlanetMouseLeaveUniverse = () => {
    if (!isSelectingPlanetPosition) {
      setActivePlanetUi(null);
    }
  };
  const handlePlanetClickUniverse = (planet: Planet) => {
    setActivePlanetUi(planet);
    setSelectedLocation(`${planet.name} 행성`);
    setShowBoardView(true);
    // isSelectingPlanetPosition 등은 usePlanetCreation 훅 내부에서 관리
    if (dismiss) dismiss();
  };

  const handleReturnToUniverse = () => {
    setShowBoardView(false);
    setActivePlanetUi(null);
    setSelectedLocation('우주');
    setActiveTab('posts');
  };

  // Fixed: Changed to handle React.ChangeEvent<HTMLInputElement> properly
  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessageText(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessageText.trim() === '' || !username) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: username,
      authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
      content: newMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // country: 'KR', // 예시
      // planetId: activePlanetUi?.id, // 행성별 채팅 시
    };
    addMessage(msg);
    setNewMessageText('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e] text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      <AppHeader
        filter={filter}
        onFilterChange={setFilter} // useSpaceData의 setFilter 사용
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        username={username}
        showBoardView={showBoardView}
      />

      <IntegratedPlanetCreationWizard
        isOpen={isPlanetWizardOpen}
        onClose={() => setIsPlanetWizardOpen(false)}
        onCreatePlanet={handleWizardCreatePlanet}
      />
      
      <main className="container mx-auto px-4 py-6">
        {!showBoardView ? (
          <UniverseView
            planets={filteredPlanets} // useSpaceData의 filteredPlanets 사용
            activePlanet={activePlanet}
            onPlanetClick={handlePlanetClickUniverse}
            onPlanetMouseEnter={handlePlanetMouseEnterUniverse}
            onPlanetMouseLeave={handlePlanetMouseLeaveUniverse}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            isSelectingPosition={isSelectingPlanetPosition}
            onMapClickForPosition={handleMapClickForPosition}
            onMouseMoveOnMap={handleMouseMoveOnMap}
            onMouseLeaveMap={handleMouseLeaveMap}
            cursorPositionHint={cursorPositionHint}
            onStartPlanetCreation={startPlanetCreationProcess}
            onCancelPlanetCreation={cancelPlanetCreationProcess}
            universeMapRef={universeMapRefGlobal}
          />
        ) : activePlanet ? (
          <PlanetBoardView
            activePlanet={activePlanet}
            selectedLocation={selectedLocation}
            posts={posts.filter(p => p.planetId === activePlanet.id)} // 게시물 필터링
            editingPost={editingPost}
            showNewPostForm={showNewPostForm}
            onShowNewPostForm={handleShowNewPostForm}
            onHideNewPostForm={handleHideNewPostForm}
            forumForm={forumForm}
            onForumSubmit={onForumSubmit}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            messages={messages}
            newMessage={newMessageText}
            onNewMessageChange={handleNewMessageChange}
            onSendMessage={handleSendMessage}
            username={username}
            onReturnToUniverse={handleReturnToUniverse}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onViewPostDetail={handleViewPostDetail}
          />
        ) : (
          <div className="text-center p-8">
            <p>오류: 행성 정보를 불러올 수 없습니다.</p>
            <Button onClick={handleReturnToUniverse} variant="link">우주로 돌아가기</Button>
          </div>
        )}
      </main>
      
      <style>{`
        body { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
        *::-webkit-scrollbar { width: 8px; height: 8px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        *::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.4); }
        
        /* REMOVE or COMMENT OUT: .stars-small, .stars-medium, .stars-large, .particles, .nebula-bg, .shooting-star */
        
        .planet-pulse { animation: pulse 3s ease-in-out infinite alternate; }
        @keyframes pulse { 0% { box-shadow: 0 0 var(--planet-dom-size, 15px) calc(var(--planet-dom-size, 40px) / 8) var(--planet-color-shadow, rgba(100,100,255,0.5)); } 100% { box-shadow: 0 0 calc(var(--planet-dom-size, 25px) * 1.5) calc(var(--planet-dom-size, 40px) / 4) var(--planet-color-shadow-strong, rgba(100,100,255,0.8)); } }
        
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out forwards; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        
        .cursor-crosshair { cursor: crosshair; }
        .cursor-grab { cursor: grab; }
        .cursor-grabbing { cursor: grabbing; }

        .prose-sm { font-size: 0.875rem; line-height: 1.5; }
        .prose-invert { color: #d1d5db; }
        .prose-invert a { color: #93c5fd; }
        .prose-invert strong { color: #f9fafb; }
      `}</style>
    </div>
  );
};

export default Community;
