
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/peer-space/settings/Sidebar';
import ContentSection from '@/components/peer-space/settings/ContentSection';

const PeerSpaceSettings = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [saved, setSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // 섹션 변경 시 저장 상태를 true로 설정 (변경사항 없음 상태)
    setSaved(true);
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // 실제 백엔드 연동 시 여기에 API 호출 로직 구현
      // 예: await api.saveSettings(activeSection, settingsData);
      
      // 백엔드 연동 시뮬레이션 (지연 효과)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "설정이 저장되었습니다",
        description: "변경사항이 성공적으로 적용되었습니다.",
      });
      setSaved(true);
    } catch (error) {
      toast({
        title: "설정 저장 실패",
        description: "설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
      console.error("설정 저장 오류:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-100 flex">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
      />
      <ContentSection 
        activeSection={activeSection}
        saved={saved}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default PeerSpaceSettings;
