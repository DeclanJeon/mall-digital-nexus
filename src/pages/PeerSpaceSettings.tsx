
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/peer-space/settings/Sidebar';
import ContentSection from '@/components/peer-space/settings/ContentSection';
import { getPeermallByAddress } from '@/api';
import { PeerMallConfig } from '@/types/space';

const PeerSpaceSettings = () => {
  const { address } = useParams();
  const [activeSection, setActiveSection] = useState('basic-info');
  const [saved, setSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // peermall 데이터 가져오기
  const { data: peermall, isLoading, error } = useQuery({
    queryKey: ['peermall', address],
    queryFn: () => getPeermallByAddress(address || '').then(data => data || null),
    enabled: !!address,
  });

  // 기본 설정값
  const defaultConfig: PeerMallConfig = {
    id: 'default',
    name: '기본 이름',
    title: '기본 타이틀',
    description: '기본 설명',
    owner: 'system',
    createdAt: new Date().toISOString(),
    type: 'personal',
    peerNumber: '000-0000-0000',
    followers: 0,
    recommendations: 0,
    badges: [],
    externalUrl: window.location.origin,
    sections: [
      'about',
      'services',
      'reviews',
      'contact',
      'products',
      'events',
      'guestbook',
      'community',
      'featured',
      'achievements'
    ],
    peerMallKey: '',
    peerMallName: '',
    peerMallAddress: '',
    ownerName: ''
  };

  useEffect(() => {
    if (error) {
      toast({
        title: '오류 발생',
        description: '피어몰 정보를 불러오는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  }, [error]);
  
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSaved(true);
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
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

  if (!address) {
    return <div>Invalid address</div>;
  }

  return (
    <div className="min-h-screen bg-bg-100 flex">
      <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
      <ContentSection 
        activeSection={activeSection} 
        saved={saved} 
        onSave={handleSaveChanges}
        address={address || ''}
        config={defaultConfig}
        peermall={peermall}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PeerSpaceSettings;
