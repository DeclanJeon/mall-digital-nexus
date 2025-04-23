import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Globe, Bell, Link, Download, Upload, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';
import { IntegrationSettings } from './IntegrationSettings';
import { DataManagement } from './DataManagement';

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('ko');
  const [timezone, setTimezone] = useState('Asia/Seoul');

  const handleSaveSetting = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "변경사항이 성공적으로 적용되었습니다.",
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Settings className="mr-2 h-6 w-6" />
        설정
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            일반 설정
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link className="h-4 w-4 mr-2" />
            외부 서비스 연동
          </TabsTrigger>
          <TabsTrigger value="data">
            <Download className="h-4 w-4 mr-2" />
            데이터 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings 
            onSave={handleSaveSetting}
            language={language}
            timezone={timezone}
            onLanguageChange={setLanguage}
            onTimezoneChange={setTimezone}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings onSave={handleSaveSetting} />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationSettings onSave={handleSaveSetting} />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <DataManagement onSave={handleSaveSetting} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SettingsSection;
