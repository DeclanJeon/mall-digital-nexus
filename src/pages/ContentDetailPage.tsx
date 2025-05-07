
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { PeerMallConfig } from '@/components/peer-space/types';
import { ContentFormValues } from '@/components/peer-space/forms/AddContentForm';
import PeerSpaceFooter from '../components/peer-space/layout/PeerSpaceFooter';
import PeerSpaceHeader from '../components/peer-space/layout/PeerSpaceHeader';
import ContentDetailView from '../components/peer-space/content/ContentDetailView';

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

// Function to get peermall details from localStorage
const getPeermallDetails = (address: string) => {
  try {
    const peermalls = localStorage.getItem('peermalls');
    if (peermalls) {
      const parsedPeermalls = JSON.parse(peermalls);
      return parsedPeermalls.find((peermall: any) => peermall.id === address);
    }
    return null;
  } catch (error) {
    console.error("Error loading peermall details:", error);
    return null;
  }
};

const ContentDetailPage = () => {
  const { address, contentId } = useParams<{ address: string; contentId: string }>();
  const navigate = useNavigate();
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
        // If config doesn't exist, try to get peermall details
        const peermallDetails = getPeermallDetails(address);
        
        if (peermallDetails) {
          // Create a default config based on peermall details
          const defaultConfig: PeerMallConfig = {
            id: address,
            address: address,
            name: peermallDetails.title || 'Default Mall',
            category: 'general',
            tags: ['default'],
            title: peermallDetails.title,
            description: peermallDetails.description || '',
            owner: peermallDetails.owner || '나',
            peerNumber: `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            profileImage: peermallDetails.imageUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${address}`,
            badges: [],
            followers: 0,
            recommendations: 0,
            level: 1,
            experience: 0,
            nextLevelExperience: 100,
            isVerified: false,
            skin: 'default',
            themeColor: '#71c4ef',
            status: 'active',
            sections: ['hero', 'content', 'community', 'events', 'reviews'],
            customizations: {
              primaryColor: '#71c4ef',
              secondaryColor: '#3B82F6',
              showChat: true,
              allowComments: true,
              showBadges: true,
            },
            location: {
              lat: 37.5665,
              lng: 126.9780,
              address: 'Seoul, South Korea'
            }
          };
          
          setConfig(defaultConfig);
          
          // Save this config for future use
          localStorage.setItem(`peer_space_${address}_config`, JSON.stringify(defaultConfig));
        } else {
          toast({
            variant: "destructive",
            title: "설정을 찾을 수 없습니다",
            description: "피어스페이스 설정을 불러올 수 없습니다.",
          });
        }
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

  const handleAddContent = (content: ContentFormValues) => {
    // Handle adding content logic here
    toast({
      title: "콘텐츠 추가",
      description: "콘텐츠 추가 기능은 아직 개발 중입니다.",
    });
    navigate(`/space/${address}`);
  };

  return (
    <>
      <PeerSpaceHeader 
        config={config}
        isOwner={isOwner}
        onAddContent={handleAddContent}
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
