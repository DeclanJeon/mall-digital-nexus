
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunitySection from './CommunitySection';
import ChatSection from './ChatSection';

const MapSection = () => {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6">커뮤니티 & 지도</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="map">지도</TabsTrigger>
          <TabsTrigger value="community">게시판</TabsTrigger>
          <TabsTrigger value="chat">오픈 채팅</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="w-full">
          <div className="bg-gray-100 rounded-lg p-6 min-h-[600px] flex items-center justify-center">
            <p className="text-text-200">지도 섹션 내용이 여기에 표시됩니다.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="w-full">
          <CommunitySection />
        </TabsContent>
        
        <TabsContent value="chat" className="w-full">
          <ChatSection />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MapSection;
