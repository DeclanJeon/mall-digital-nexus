import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Post } from '@/types/post';

import useCommunityBoardLogic from './board/hooks/useCommunityBoardLogic';
import PostWriteDialog from './board/dialogs/PostWriteDialog';
import QRCodeDialog from './board/dialogs/QRCodeDialog';
import ChannelManagementDialog from './board/dialogs/ChannelManagementDialog';
import CommunityBoardHeader from './board/components/CommunityBoardHeader';
import CommunityBoardFooter from './board/components/CommunityBoardFooter';
import PostDisplay from './board/components/PostDisplay';
import CommunityBoardHelpTips from './board/components/CommunityBoardHelpTips';

interface CommunityBoardProps {
  zoneName: string;
  posts?: Post[];
  communityId?: string;
  onPostClick?: (post: Post) => void; // 🔥 PeerSpace에서 전달받는 핸들러
}

const CommunityBoard: React.FC<CommunityBoardProps> = ({
  zoneName,
  posts: propPosts,
  communityId = 'global',
  onPostClick // 🔥 외부에서 전달받은 onPostClick
}) => {
  const {
    searchQuery,
    activeTab,
    isWriteDialogOpen,
    currentQRPost,
    isQRDialogOpen,
    isChannelDialogOpen,
    posts,
    channels,
    viewMode,
    isLoading,
    sortOption,
    showHelpTips,
    hasNotifications,
    activeFilters,
    breadcrumbs,
    processedPosts,
    setSearchQuery,
    setActiveTab,
    setIsWriteDialogOpen,
    setIsQRDialogOpen,
    setIsChannelDialogOpen,
    setViewMode,
    setSortOption,
    setActiveFilters,
    handlePostClick, // 🔥 훅에서 반환되는 handlePostClick (onPostClick이 적용된)
    handleSubmitNewPost,
    handleShowQRCode,
    getPostUrl,
    handleChannelCreate,
    handleChannelUpdate,
    handleChannelDelete,
    toggleFilter,
    dismissHelpTips,
  } = useCommunityBoardLogic({ 
    communityId, 
    initialPosts: propPosts, 
    zoneName, 
    onPostClick // 🔥 훅에 onPostClick 전달
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-xl"
      >
        <CommunityBoardHeader
          zoneName={zoneName}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onChannelManageClick={() => setIsChannelDialogOpen(true)}
          hasNotifications={hasNotifications}
          showHelpTips={showHelpTips}
          dismissHelpTips={dismissHelpTips}
          breadcrumbs={breadcrumbs}
        />

        <CommunityBoardHelpTips
          showHelpTips={showHelpTips}
          dismissHelpTips={dismissHelpTips}
        />

        <div className="border-b flex flex-col md:flex-row justify-between items-center px-6 py-2 bg-gray-50">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-1 md:space-y-0 w-full md:w-auto"
          >
            <TabsList className="h-9 bg-gray-100 w-full md:w-auto overflow-x-auto flex-nowrap justify-start md:justify-center">
              <TabsTrigger value="all" className="text-sm h-7">
                <span className="mr-1">🔍</span>
                전체글
              </TabsTrigger>
              
              {channels.map((channel) => (
                <TabsTrigger 
                  key={channel.id} 
                  value={channel.id} 
                  className="text-sm h-7 whitespace-nowrap"
                  style={{ 
                    borderBottom: activeTab === channel.id ? `2px solid ${channel.color}` : undefined,
                    color: activeTab === channel.id ? channel.color : undefined 
                  }}
                >
                  <span className="mr-1">{channel.icon}</span>
                  {channel.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0 overflow-x-auto md:flex-shrink-0 py-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 ${viewMode === 'list' ? 'bg-gray-200 text-gray-900' : 'bg-transparent'}`}
                    onClick={() => setViewMode("list")}
                    aria-label="목록 보기"
                  >
                    <Layout className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">목록</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>목록으로 보기</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 ${viewMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'bg-transparent'}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="그리드 보기"
                  >
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">그리드</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>그리드로 보기</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 ${viewMode === 'compact' ? 'bg-gray-200 text-gray-900' : 'bg-transparent'}`}
                    onClick={() => setViewMode("compact")}
                    aria-label="간단히 보기"
                  >
                    <Layout className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">간단히</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>간단히 보기</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
                
        <PostDisplay
          posts={processedPosts}
          viewMode={viewMode}
          isLoading={isLoading}
          searchQuery={searchQuery}
          channels={channels}
          onPostClick={handlePostClick} // 🔥 훅에서 반환된 handlePostClick 사용
          handleShowQRCode={handleShowQRCode}
          getPostUrl={getPostUrl}
          setSearchQuery={setSearchQuery}
        />
        
        <CommunityBoardFooter
          processedPostsLength={processedPosts.length}
          sortOption={sortOption}
          setSortOption={setSortOption}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          setActiveFilters={setActiveFilters}
          onNewPostClick={() => setIsWriteDialogOpen(true)}
        />
      </motion.div>

      <PostWriteDialog
        isOpen={isWriteDialogOpen}
        onOpenChange={setIsWriteDialogOpen}
        channels={channels}
        selectedChannel={activeTab !== "all" && activeTab !== "notice" ? activeTab : (channels[1]?.id || "channel-2")}
        onChannelSelect={setActiveTab}
        onSubmit={handleSubmitNewPost}
      />

      <QRCodeDialog
        isOpen={isQRDialogOpen}
        onOpenChange={setIsQRDialogOpen}
        post={currentQRPost}
        getPostUrl={getPostUrl}
      />

      <ChannelManagementDialog
        isOpen={isChannelDialogOpen}
        onOpenChange={setIsChannelDialogOpen}
        channels={channels}
        posts={posts}
        communityId={communityId}
        onChannelCreate={handleChannelCreate}
        onChannelUpdate={handleChannelUpdate}
        onChannelDelete={handleChannelDelete}
      />
    </div>
  );
};

export default CommunityBoard;
