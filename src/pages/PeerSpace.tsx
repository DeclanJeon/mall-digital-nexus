
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { PeerMallConfig } from '@/components/peer-space/types';
import type { Peermall } from '@/pages/Index';
import PeerSpaceHome from '@/components/peer-space/PeerSpaceHome';

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
const getPeermallDetailsFromLocalStorage = (address: string): Peermall | null => {
  try {
    const storedPeermalls = localStorage.getItem('peermalls');
    if (storedPeermalls) {
      const peermalls: Peermall[] = JSON.parse(storedPeermalls);
      // address는 Peermall의 id와 일치한다고 가정
      return peermalls.find(mall => mall.id === address) || null;
    }
    return null;
  } catch (error) {
    console.error("Error loading peermall details from localStorage:", error);
    return null;
  }
};

// Function to save PeerSpace configuration to localStorage
const savePeerSpaceConfig = (address: string, config: PeerMallConfig): void => {
  try {
    const key = `peer_space_${address}_config`;
    localStorage.setItem(key, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving peer space config:", error);
  }
};

const PeerSpace = () => {
  const location = useLocation();
  const { address } = useParams<{ address: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(true); // In reality, this would be based on authentication
  const [config, setConfig] = useState<PeerMallConfig | null>(null);

  useEffect(() => {
    // Simulate data loading and fetch configuration
    const timer = setTimeout(async () => {
      if (address) {
        const storedConfig = getPeerSpaceConfig(address);
        
        if (storedConfig) {
          setConfig(storedConfig);
        } else {
          // If config doesn't exist in localStorage, try to load peermall details from localStorage
          const peermallDetails = getPeermallDetailsFromLocalStorage(address); 

          console.log("Loaded Peermall Details from localStorage:", peermallDetails);
          if (peermallDetails) {
            // Create a default config from peermall details
            const defaultConfig: PeerMallConfig = {
              id: address,
              address: address,
              name: peermallDetails.title || '내 피어스페이스',
              title: peermallDetails.title || '내 피어스페이스',
              description: peermallDetails.description || '나만의 공간을 구성해보세요',
              owner: peermallDetails.owner || '나',
              category: peermallDetails.category || '기타',
              themeColor: '#71c4ef',
              status: 'active',
              createdAt: new Date().toISOString(),
              type: 'personal',
              peerNumber: `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
              profileImage: peermallDetails.imageUrl || 'https://api.dicebear.com/7.x/personas/svg?seed=' + address,
              badges: [],
              followers: 0,
              recommendations: 0,
              isVerified: false,
              skin: 'default',
              sections: ['hero', 'content', 'community', 'events', 'reviews', 'infoHub', 'map', 'trust', 'relatedMalls', 'activityFeed', 'liveCollaboration'],
              customizations: {
                primaryColor: '#71c4ef',
                showChat: true,
                allowComments: true,
                showBadges: true,
              },
              location: peermallDetails.location ? {
                lat: peermallDetails.location.lat,
                lng: peermallDetails.location.lng,
                address: peermallDetails.location.address
              } : {
                lat: 37.5665,
                lng: 126.9780,
                address: 'Seoul, South Korea'
              }
            };
            
            setConfig(defaultConfig);
            savePeerSpaceConfig(address, defaultConfig);
          } 
        }
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [address]);

  // Handle recommendations and badges updates
  const handleUpdateConfig = (updatedConfig: PeerMallConfig) => {
    if (address) {
      setConfig(updatedConfig);
      savePeerSpaceConfig(address, updatedConfig);
      toast({
        title: "피어스페이스가 업데이트되었습니다",
        description: "변경사항이 성공적으로 저장되었습니다.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-300"></div>
          <div className="h-4 w-32 bg-blue-300 rounded"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!address || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-4xl mb-4">🏪</div>
        <h1 className="text-2xl font-bold mb-2">피어스페이스를 찾을 수 없습니다</h1>
        <p className="text-gray-600">요청하신 주소에 해당하는 피어스페이스가 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <PeerSpaceHome 
        isOwner={isOwner} 
        address={address} 
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />
    </div>
  );
};

export default PeerSpace;
