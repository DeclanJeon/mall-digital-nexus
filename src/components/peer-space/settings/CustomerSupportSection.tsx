import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ClipboardList, Bell } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SupportChannelSettings } from './SupportChannelSettings';
import { FAQManagement } from './FAQManagement';
import { LiveChatSettings } from './LiveChatSettings';

const CustomerSupportSection = () => {
  const [activeTab, setActiveTab] = useState('ticketing');

  const handleSave = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "고객 지원 설정이 성공적으로 적용되었습니다.",
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <MessageSquare className="mr-2 h-6 w-6" />
        고객 지원 관리
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="ticketing">
            <ClipboardList className="h-4 w-4 mr-2" />
            문의 접수 관리
          </TabsTrigger>
          <TabsTrigger value="faq">
            <Bell className="h-4 w-4 mr-2" />
            FAQ 관리
          </TabsTrigger>
          <TabsTrigger value="live-chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            실시간 상담 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ticketing" className="space-y-4">
          <SupportChannelSettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <FAQManagement onSave={handleSave} />
        </TabsContent>

        <TabsContent value="live-chat" className="space-y-4">
          <LiveChatSettings onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default CustomerSupportSection;
