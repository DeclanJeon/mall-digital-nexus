
// src/components/community/Community.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // useParams, useNavigate, useLocation 추가
import { useToast } from '@/hooks/use-toast';
import { Planet, ChatMessage, Post } from '@/components/community/types';

import { useUserData } from '@/hooks/useUserData';
import { useSpaceData } from '@/hooks/useSpaceData';
import { usePlanetCreation } from '@/hooks/usePlanetCreation';
import { useForumManagement } from '@/hooks/useForumManagement';

import AppHeader from '@/components/community/AppHeader';
import UniverseView from '@/components/community/UniverseView';
import PlanetBoardView from '@/components/community/board/PlanetBoardView'; // 경로 수정
import IntegratedPlanetCreationWizard from '@/components/community/IntegratedPlanetCreationWizard';
import { Button } from '@/components/ui/button'; // 에러 발생 시 사용

interface CommunityProps {
  peerSpaceAddress?: string; // 특정 피어스페이스 주소 (옵셔널)
}

const Community: React.FC<CommunityProps> = ({ peerSpaceAddress }) => {
  const { username } = useUserData();
  const {
    planets: allPlanets, // 전체 행성 목록
    addPlanet,
    posts, addPost, updatePost, deletePostById,
    messages, addMessage,
    filter, setFilter,
    // filteredPlanets, // 이 부분은 peerSpaceAddress에 따라 직접 필터링하므로 제거 또는 수정
  } = useSpaceData();
  
  const { toast, dismiss } = useToast(); // dismiss는 행성 생성 시 토스트 닫기에 사용

  // --- UI 상태 ---
  const [activePlanet, setActivePlanetUi] = useState<Planet | null>(null);
  const [showBoardView, setShowBoardView] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // 선택된 게시글 상태 추가
  const [selectedLocation, setSelectedLocation] = useState('우주');
  const [activeTab, setActiveTab] = useState('posts');
  const [newMessageText, setNewMessageText] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const universeMapRefGlobal = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation(); // useLocation 훅 사용
  const params = useParams<{ planetId: string; postId?: string; address?: string }>(); // useParams에서 address도 받을 수 있도록 준비 (라우트 설정에 따라)
  const currentPlanetId = params.planetId;
  const currentPostId = params.postId;
  // peerSpaceAddress prop이 있으면 그것을 사용하고, 없으면 URL 파라미터에서 address를 사용 (라우트 설계에 따라 달라질 수 있음)
  const currentPeerSpaceAddress = peerSpaceAddress || params.address;


  // 표시할 행성 목록 결정
  const [displayPlanets, setDisplayPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    let planetsToDisplay = allPlanets;
    if (currentPeerSpaceAddress) {
      planetsToDisplay = allPlanets.filter(p => p.peerSpaceAddress === currentPeerSpaceAddress);
    }
    // 검색어 필터 적용
    if (filter && filter.trim() !== '') {
      const lowerCaseFilter = filter.toLowerCase();
      planetsToDisplay = planetsToDisplay.filter(
        (planet) =>
          planet.name.toLowerCase().includes(lowerCaseFilter) ||
          planet.description.toLowerCase().includes(lowerCaseFilter) ||
          planet.topics.some(topic => topic.toLowerCase().includes(lowerCaseFilter)) ||
          planet.owner.name.toLowerCase().includes(lowerCaseFilter)
      );
    }
    setDisplayPlanets(planetsToDisplay);
  }, [allPlanets, currentPeerSpaceAddress, filter]);


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
    peerSpaceAddress: currentPeerSpaceAddress, // 행성 생성 시 피어스페이스 주소 전달
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


  // URL 파라미터 변경 감지 및 상태 업데이트
  useEffect(() => {
    // 데이터 로딩 중에는 아무 작업도 하지 않도록 displayPlanets와 posts 배열 확인
    if (currentPlanetId && displayPlanets.length === 0 && allPlanets.length > 0) { // allPlanets가 로드되었지만 displayPlanets가 비어있을 수 있음
      // console.log("Waiting for displayPlanets to filter or planet data to load for this context...");
      // 이 경우, currentPeerSpaceAddress에 해당하는 행성이 없거나, 필터링 중일 수 있습니다.
      // 또는, 아직 allPlanets가 로드되지 않았을 수 있습니다.
      // 좀 더 정확한 로딩 상태 관리가 필요할 수 있습니다.
      const foundPlanetInAll = allPlanets.find(p => p.id === currentPlanetId);
      if (!foundPlanetInAll || (currentPeerSpaceAddress && foundPlanetInAll.peerSpaceAddress !== currentPeerSpaceAddress)) {
        // 요청된 행성이 없거나 현재 컨텍스트에 속하지 않음
        navigate(currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community` : '/community');
        return;
      }
      // displayPlanets가 곧 업데이트될 것이므로 일단 대기하거나, 직접 찾아서 설정
    }

    if (currentPlanetId && currentPostId && posts.length === 0) {
      // console.log("Waiting for posts data to load...");
      return; // posts 데이터가 로드될 때까지 대기
    }

    if (currentPlanetId) {
      // displayPlanets (현재 컨텍스트에 맞는 필터링된 행성 목록)에서 찾아야 함
      const foundPlanet = displayPlanets.find(p => p.id === currentPlanetId);
      if (foundPlanet) {
        setActivePlanetUi(foundPlanet);
        setSelectedLocation(`${foundPlanet.name} 행성`);
        setShowBoardView(true);

        if (currentPostId) {
          const foundPost = posts.find(p => p.id === currentPostId && p.planetId === currentPlanetId);
          if (foundPost) {
            setSelectedPost(foundPost);
          } else {
            setSelectedPost(null);
            // navigate(currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community/planet/${currentPlanetId}` : `/community/planet/${currentPlanetId}`);
          }
        } else {
          setSelectedPost(null);
        }
      } else {
        // 현재 컨텍스트의 행성 목록에 없는 planetId인 경우
        // console.warn(`Planet with id ${currentPlanetId} not found in current context. Navigating to context root.`);
        navigate(currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community` : '/community');
        setShowBoardView(false);
        setActivePlanetUi(null);
        setSelectedLocation('우주');
        setSelectedPost(null);
      }
    } else {
      // planetId가 없는 경우 (예: /community 또는 /space/:address/community)
      setShowBoardView(false);
      setActivePlanetUi(null);
      setSelectedLocation('우주'); // 또는 피어스페이스 이름
      setSelectedPost(null);
    }
  }, [currentPlanetId, currentPostId, displayPlanets, posts, navigate, currentPeerSpaceAddress, allPlanets]);


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
    // setActivePlanetUi(planet); // useEffect에서 처리하므로 중복 호출 방지
    // setSelectedLocation(`${planet.name} 행성`);
    // setShowBoardView(true);
    // 피어스페이스 커뮤니티 내부의 행성 클릭 시 해당 피어스페이스의 URL 유지
    const basePath = currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community` : '/community';
    navigate(`${basePath}/planet/${planet.id}`);
    if (dismiss) dismiss();
  };

  const handleReturnToUniverse = () => {
    // setShowBoardView(false); // useEffect에서 처리
    // setActivePlanetUi(null);
    // setSelectedLocation('우주');
    // setActiveTab('posts');
    // setSelectedPost(null);
    const basePath = currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community` : '/community';
    navigate(basePath); // 현재 컨텍스트의 커뮤니티 루트로 이동
  };

  // 게시글 상세 보기 핸들러 (useForumManagement에서 호출될 때 URL 변경)
  const handleViewPostDetailWithNavigation = (post: Post) => {
    if (activePlanet) {
      // setSelectedPost(post); // useEffect에서 처리
      const basePath = currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community` : '/community';
      navigate(`${basePath}/planet/${activePlanet.id}/post/${post.id}`);
    }
  };
  
  // useForumManagement의 handleViewPostDetail을 새로운 함수로 대체
  // 이 부분은 useForumManagement 훅 내부에서 navigate를 사용하도록 수정하거나,
  // 아래처럼 Community 컴포넌트에서 래핑하여 전달해야 합니다.
  // 현재 useForumManagement는 handleViewPostDetail을 직접 실행하지 않고,
  // PlanetBoardView에 콜백으로 전달하므로, PlanetBoardView에서 navigate를 사용하도록 수정하는 것이 더 적절할 수 있습니다.
  // 여기서는 일단 Community.tsx에서 navigate를 호출하는 방식으로 수정합니다.
  const forumManagement = useForumManagement({
    username,
    activePlanet: activePlanet,
    addPostCallback: addPost,
    updatePostCallback: updatePost,
    deletePostByIdCallback: deletePostById,
    // handleViewPostDetail 콜백을 여기서 직접 navigate 하도록 수정
    // 또는 PlanetBoardView에서 post 클릭 시 navigate 하도록 수정
  });


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
            planets={displayPlanets} // 수정: filteredPlanets -> displayPlanets
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
            selectedLocation={activePlanet} // activePlanet을 직접 전달
            posts={posts.filter(p => p.planetId === activePlanet.id)}
            editingPost={forumManagement.editingPost} // useForumManagement에서 가져옴
            showNewPostForm={forumManagement.showNewPostForm} // useForumManagement에서 가져옴
            onShowNewPostForm={forumManagement.handleShowNewPostForm} // useForumManagement에서 가져옴
            onHideNewPostForm={forumManagement.handleHideNewPostForm} // useForumManagement에서 가져옴
            forumForm={forumManagement.forumForm} // useForumManagement에서 가져옴
            onForumSubmit={forumManagement.onForumSubmit} // useForumManagement에서 가져옴
            onEditPost={forumManagement.handleEditPost} // useForumManagement에서 가져옴
            onDeletePost={forumManagement.handleDeletePost} // useForumManagement에서 가져옴
            messages={messages}
            newMessage={newMessageText}
            onNewMessageChange={handleNewMessageChange}
            onSendMessage={handleSendMessage}
            username={username}
            onReturnToUniverse={handleReturnToUniverse}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onViewPostDetail={handleViewPostDetailWithNavigation} // 수정된 핸들러 사용
            selectedPost={selectedPost} // 선택된 게시글 전달
            onBackFromDetail={() => { // 게시글 상세에서 목록으로 돌아갈 때
              const basePath = currentPeerSpaceAddress ? `/space/${currentPeerSpaceAddress}/community` : '/community';
              if(activePlanet) navigate(`${basePath}/planet/${activePlanet.id}`);
              else navigate(basePath);
              setSelectedPost(null);
            }}
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
