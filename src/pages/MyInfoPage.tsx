import React, { useState, useEffect } from 'react';
import ProfileSection from '@/components/my-info/ProfileSection';
import SecuritySection from '@/components/my-info/SecuritySection';
import NetworkSection from '@/components/my-info/NetworkSection';
import ActivitySection from '@/components/my-info/ActivitySection';
import PeermallManagementSection from '@/components/my-info/PeermallManagementSection';
import ContentSection from '@/components/my-info/ContentSection';
import CommunicationSection from '@/components/my-info/CommunicationSection';
import QRCodeSection from '@/components/my-info/QRCodeSection';
import SettingsSection from '@/components/my-info/SettingsSection';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { openDB } from 'idb';

import { TransactionItem } from '@/components/my-info/ActivitySection';
import NetworkSectionProps from '@/components/my-info/Network';
import userService from '@/services/userService';

// Make sure to match the interface from PeermallManagementSection
interface PeerMall {
  id: number;
  name: string;
  type: string;
  image?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  visibility: 'public' | 'partial' | 'private';
  isCertified?: boolean;
  stats?: {
    visitors: number;
    followers: number;
    reviews?: number;
  };
}

const MyInfoPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [createdMalls, setCreatedMalls] = useState<PeerMall[]>([]);

  const loadPeermalls = async () => {
    try {
      const result = await userService.getUserInfo();
      setUserProfile(result['userInfo']);
    } catch (error) {
      console.error("피어몰 로딩 실패:", error);
    }
  };
  
  useEffect(() => {
    loadPeermalls();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">내 정보 관리</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            {/* <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              placeholder="검색..."
              className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            /> */}
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <Tabs orientation="vertical" defaultValue="profile" className="w-full lg:flex lg:flex-row">
          <div className="w-full lg:w-64 mb-6 lg:mb-0">
            <TabsList className="flex lg:flex-col justify-start lg:justify-start gap-2 lg:gap-4">
              <TabsTrigger value="profile" className="w-full justify-start">내 정보</TabsTrigger>
              {/* <TabsTrigger value="content" className="w-full justify-start">콘텐츠</TabsTrigger> */}
              {/* <TabsTrigger value="network" className="w-full justify-start">네트워크</TabsTrigger> */}
              {/* <TabsTrigger value="peermall" className="w-full justify-start">피어몰 관리</TabsTrigger> */}
            </TabsList>
          </div>
          <div className="flex-1">
            <TabsContent value="profile">
              <div className="space-y-6">
                <ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} />
                {/* <SecuritySection
                  authMethods={authMethods}
                  loginRecords={loginRecords}
                  privacySettings={privacySettings}
                /> */}
                {/* <SettingsSection
                  darkMode={false}
                  language="ko"
                  dataExportOptions={dataExportOptions}
                  analyticsData={analyticsData}
                /> */}
              </div>
            </TabsContent>
            <TabsContent value="content">
              <div className="space-y-6">
                {/* <ContentSection
                  contents={contents}
                  savedItems={savedItems}
                  reviews={reviews}
                /> */}
                {/* <ActivitySection
                  activities={activities}
                  transactions={transactions}
                  level={14}
                  maxLevel={50}
                  experience={7500}
                  nextLevelExperience={10000}
                  badges={badges}
                  quests={quests}
                  points={points}
                /> */}
              </div>
            </TabsContent>
            <TabsContent value="network">
              <div className="space-y-6">
                {/* <NetworkSection {...networkData} /> */}
                {/* <CommunicationSection
                  messages={messages}
                  notificationSettings={notificationSettings}
                /> */}
                {/* <QRCodeSection qrCodes={qrCodes} /> */}
              </div>
            </TabsContent>
            {/* <TabsContent value="peermall">
              <div className="space-y-6">
                <PeermallManagementSection
                  createdMalls={createdMalls}
                  followedMalls={followedMalls}
                  onCreatePeermall={handleCreatePeermall}
                  onManageMall={(id) => console.log('Managing mall:', id)}
                  onDeleteMall={(id) => console.log('Deleting mall:', id)}
                  onTransferMall={(id) => console.log('Transferring mall:', id)}
                />
              </div>
            </TabsContent> */}
          </div>
        </Tabs>
      </div>
      
      {/* <CreatePeermallModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (peermallData) => {
          try {
            const db = await initDB();
            await db.add('peermalls', {
              name: peermallData.name,
              type: peermallData.type || '기타',
              createdAt: new Date().toISOString().slice(0, 10),
              visibility: 'public',
              status: 'active',
              stats: {
                visitors: 0,
                followers: 0,
                reviews: 0
              }
            });
            loadPeermalls();
          } catch (error) {
            console.error("피어몰 생성 실패:", error);
          }
        }}
      /> */}
    </div>
  );
};

export default MyInfoPage;
