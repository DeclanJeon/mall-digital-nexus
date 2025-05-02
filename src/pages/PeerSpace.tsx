import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PeerSpaceHome from '@/components/peer-space/PeerSpaceHome';
import { toast } from '@/hooks/use-toast';
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
    const timer = setTimeout(() => {
      if (address) {
        const storedConfig = getPeerSpaceConfig(address);
        
        if (storedConfig) {
          setConfig(storedConfig);
        } else {
          // If config doesn't exist, try to load from peermall details
          const peermallDetails = getPeermallDetails(address);
          
          if (peermallDetails) {
            // Create a default config from peermall details
            const defaultConfig: PeerMallConfig = {
              id: address,
              title: peermallDetails.title || '내 피어스페이스',
              description: peermallDetails.description || '나만의 공간을 구성해보세요',
              owner: peermallDetails.owner || '나',
              peerNumber: `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
              profileImage: peermallDetails.imageUrl || 'https://api.dicebear.com/7.x/personas/svg?seed=' + address,
              badges: [],
              followers: 0,
              recommendations: 0,
              level: 1,
              experience: 0,
              nextLevelExperience: 100,
              isVerified: false,
              sections: ['hero', 'content', 'community', 'events', 'reviews', 'infoHub', 'map', 'trust', 'relatedMalls', 'activityFeed', 'liveCollaboration'],
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
            savePeerSpaceConfig(address, defaultConfig);
          } else {
            // If no details found, create a completely new default config
            const defaultConfig: PeerMallConfig = {
              id: address,
              title: '내 피어스페이스',
              description: '나만의 공간을 구성해보세요',
              owner: '나',
              peerNumber: `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
              profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=' + address,
              badges: [],
              followers: 0,
              recommendations: 0,
              level: 1,
              experience: 0,
              nextLevelExperience: 100,
              isVerified: false,
              sections: ['hero', 'content', 'community', 'events', 'reviews', 'infoHub', 'map', 'trust', 'relatedMalls', 'activityFeed', 'liveCollaboration'],
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!address || !config) {
    return <div className="min-h-screen flex items-center justify-center">피어스페이스를 찾을 수 없습니다.</div>;
  }

  return (
    <PeerSpaceHome 
      isOwner={isOwner} 
      address={address} 
      config={config}
      onUpdateConfig={handleUpdateConfig}
    />
  );
};

export default PeerSpace;
