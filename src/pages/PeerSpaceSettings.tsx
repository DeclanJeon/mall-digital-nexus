import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/peer-space/settings/Sidebar';
import ContentSection from '@/components/peer-space/settings/ContentSection';

const PeerSpaceSettings = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [saved, setSaved] = useState(true);
  
  const handleSaveChanges = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "변경사항이 성공적으로 적용되었습니다.",
    });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-bg-100 flex">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
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
