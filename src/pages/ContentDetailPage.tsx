
import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ContentDetailView from '@/components/peer-space/ContentDetailView';
import PeerSpaceHeader from '@/components/peer-space/PeerSpaceHeader';
import PeerSpaceFooter from '@/components/peer-space/PeerSpaceFooter';
import { PeerMallConfig } from '@/components/peer-space/types';

// Function to get PeerSpace configuration from localStorage
const getPeerSpaceConfig = (address: string): PeerMallConfig | null => {
  try {
    const key = `peer_space_${address}_config`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as PeerMallConfig;
    }
    return null;
  } catch (error) {
    console.error("Error loading peer space config:", error);
    return null;
  }
};

const ContentDetailPage = () => {
  const { address, contentId } = useParams<{ address: string; contentId: string }>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [config, setConfig] = React.useState<PeerMallConfig | null>(null);
  const [isOwner, setIsOwner] = React.useState(true); // In reality, this would be based on authentication

  React.useEffect(() => {
    if (address) {
      // Load the peer space configuration
      const storedConfig = getPeerSpaceConfig(address);
      
      if (storedConfig) {
        setConfig(storedConfig);
      } else {
        toast({
          variant: "destructive",
          title: "설정을 찾을 수 없습니다",
          description: "피어스페이스 설정을 불러올 수 없습니다.",
        });
      }
      
      setIsLoading(false);
    }
  }, [address]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!address || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        피어스페이스를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <>
      <PeerSpaceHeader 
        config={config}
        isOwner={isOwner}
        onAddContent={() => {}} // 임시 함수
      />
      <ContentDetailView 
        address={address} 
        config={config}
        isOwner={isOwner} 
      />
      <PeerSpaceFooter config={config} />
    </>
  );
};

export default ContentDetailPage;
