import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { PeerMallConfig } from '@/components/peer-space/types';
import { Peermall } from '@/types/peermall';
import PeerSpaceHome from '@/components/peer-space/PeerSpaceHome';
import { Loader2 } from 'lucide-react';
import { peermallStorage } from '@/services/storage/peermallStorage';
import { storage } from '@/utils/storage/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

// Peermall 타입을 다시 export하여 컴포넌트 전체에서 일관되게 사용
export type { Peermall } from '@/types/peermall';

// Function to get PeerSpace configuration from storage
const getPeerSpaceConfig = (address: string): PeerMallConfig | null => {
  try {
    const key = `peer_space_${address}_config`;
    return storage.get<PeerMallConfig>(key as any) || null;
  } catch (error) {
    console.error("Error loading peer space config:", error);
    return null;
  }
};

// Function to get peermall details from storage
const getPeermallDetails = (address: string): Peermall | null => {
  try {

    console.log(peermallStorage.getById(address))

    return peermallStorage.getById(address) || null;
  } catch (error) {
    console.error("Error loading peermall details:", error);
    return null;
  }
};

// Function to save PeerSpace configuration to storage
const savePeerSpaceConfig = (address: string, config: PeerMallConfig): void => {
  try {
    const key = `peer_space_${address}_config`;
    storage.set<PeerMallConfig>(key as any, config);
  } catch (error) {
    console.error("Error saving peer space config:", error);
    throw error; // 에러를 상위로 전파하여 호출한 쪽에서 처리할 수 있도록 함
  }
};

const PeerSpace = () => {
  const params = useParams<{ address: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const address = params.address || '';

  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(true); // In reality, this would be based on authentication
  const [config, setConfig] = useState<PeerMallConfig | null>(null);
  const [peermall, setPeermall] = useState<Peermall | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'content' | 'community' | 'following' | 'guestbook'>('home');

  useEffect(() => {
    const loadPeermallData = async () => {
      if (!address) return;

      setIsLoading(true);
      try {
        // 1. Load basic peermall details using peermallStorage
        const peermallData = getPeermallDetails(address);

        if (!peermallData) {
          toast({
            title: '피어몰을 찾을 수 없습니다',
            description: '요청하신 피어몰이 존재하지 않거나 삭제되었습니다.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        setPeermall(peermallData);

        // 2. Load peer space configuration using storage utility
        const config = getPeerSpaceConfig(address);
        if (config) {
          setConfig(config);
        }

        // 3. Listen for peermall updates
        const handlePeermallUpdate = (peermalls: Peermall[]) => {
          const updatedPeermall = peermalls.find(p => p.id === address);

          if (updatedPeermall) {
            setPeermall(updatedPeermall);
          }
        };
        
        // Subscribe to storage updates
        const unsubscribe = peermallStorage.addEventListener(handlePeermallUpdate);

        // Initial load in case there are updates since we first loaded
        const currentPeermalls = peermallStorage.getAll();
        handlePeermallUpdate(currentPeermalls);

        return () => {
          // Unsubscribe when component unmounts
          unsubscribe();
        };
      } catch (error) {
        console.error('Error loading peermall data:', error);
        toast({
          title: '오류 발생',
          description: '피어몰 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPeermallData();
  }, [address, navigate]);

  useEffect(() => {
    // Determine active section from URL
    const path = location.pathname;
    if (path.includes('/content')) {
      setActiveSection('content');
    } else if (path.includes('/community')) {
      setActiveSection('community');
    } else if (path.includes('/following')) {
      setActiveSection('following');
    } else if (path.includes('/guestbook')) {
      setActiveSection('guestbook');
    } else {
      setActiveSection('home');
    }
  }, [location.pathname]);

  // Handle recommendations and badges updates
  const handleUpdateConfig = (updatedConfig: PeerMallConfig) => {
    if (address) {
      setConfig(updatedConfig);
      savePeerSpaceConfig(address, updatedConfig);
      toast({
        title: "피어몰이 업데이트되었습니다",
        description: "변경사항이 성공적으로 저장되었습니다.",
      });
    }
  };
  
  // Handle section navigation
  const handleNavigateToSection = (section: 'home' | 'content' | 'community' | 'following' | 'guestbook') => {
    setActiveSection(section);
    
    // Update URL but don't reload the page
    let path = `/space/${address}`;
    if (section !== 'home') {
      path += `/${section}`;
    }
    navigate(path, { replace: true });
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
        <h1 className="text-2xl font-bold mb-2">피어몰을 찾을 수 없습니다</h1>
        <p className="text-gray-600">요청하신 주소에 해당하는 피어몰이 존재하지 않습니다.</p>
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
        activeSection={activeSection}
        onNavigateToSection={handleNavigateToSection}
      />
    </div>
  );
};

export default PeerSpace;
