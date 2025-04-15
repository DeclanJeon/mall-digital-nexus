
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/CategoryNav';
import Footer from '@/components/Footer';
import ForumList from '@/components/community/ForumList';
import GroupDiscussions from '@/components/community/GroupDiscussions';
import GroupChat from '@/components/community/GroupChat';

const Community = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">커뮤니티</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="chat">그룹 채팅</TabsTrigger>
            <TabsTrigger value="forum">포럼 게시판</TabsTrigger>
            <TabsTrigger value="groups">그룹 게시판</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <GroupChat />
          </TabsContent>

          <TabsContent value="forum">
            <ForumList />
          </TabsContent>
          
          <TabsContent value="groups">
            <GroupDiscussions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Community;
