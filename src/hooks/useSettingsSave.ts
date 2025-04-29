
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseSettingsSaveProps {
  sectionName: string;
}

export function useSettingsSave({ sectionName }: UseSettingsSaveProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(true);

  // 설정 변경 시 호출될 함수
  const handleSettingChange = () => {
    setSaved(false);
  };
  
  // 설정 저장 시 호출될 함수
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // 실제 백엔드 연동 시 여기에 API 호출 로직 구현
      // 예: await api.saveSettings(sectionName, formData);
      
      // 백엔드 연동 시뮬레이션 (지연 효과)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "설정이 저장되었습니다",
        description: `${sectionName} 설정이 성공적으로 저장되었습니다.`,
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
  
  return {
    saved,
    isSaving,
    handleSettingChange,
    handleSaveSettings,
  };
}
