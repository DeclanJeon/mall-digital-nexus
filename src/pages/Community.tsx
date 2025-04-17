
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForumList from '@/components/community/ForumList';
import GroupChat from '@/components/community/GroupChat';
import OpenChatRooms from '@/components/community/OpenChatRooms';
import OpenChatRoom from '@/components/community/OpenChatRoom';

const Community = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "chat");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-6">커뮤니티</h1>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="chat">그룹 채팅</TabsTrigger>
                  <TabsTrigger value="forum">포럼 게시판</TabsTrigger>
                  <TabsTrigger value="openchat">오픈 채팅</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat">
                  <GroupChat />
                </TabsContent>

                <TabsContent value="forum">
                  <ForumList />
                </TabsContent>

                <TabsContent value="openchat">
                  <OpenChatRooms />
                </TabsContent>
              </Tabs>
            </>
          } />
          
          <Route path="/chat/:id" element={<OpenChatRoom />} />
        </Routes>
      </main>
    </div>
  );
};

export default Community;
