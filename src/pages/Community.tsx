
import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import UniverseMap from '@/components/community/UniverseMap';
import PlanetCreationWizard from '@/components/community/PlanetCreationWizard';
import PlanetDashboard from '@/components/community/PlanetDashboard';
import { Planet, Constellation } from '@/components/community/types';

// Function to initialize custom data for community page
const initializeCustomData = () => {
  console.log('Initializing universe data for community page');
  // This function would normally populate data from a backend
};

const Community = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showPlanetCreationWizard, setShowPlanetCreationWizard] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [username, setUsername] = useState('익명 우주인');
  const [planets, setPlanets] = useState<Planet[]>([
    {
      id: 'earth',
      name: '지구',
      description: '글로벌 커뮤니티 허브, 지역별 게시판 이용 가능',
      type: 'public',
      stage: 'gasGiant',
      color: '#1E88E5',
      position: [0, 0, 0],
      size: 2,
      members: 2453,
      activities: 178,
      topics: ['글로벌', '일반', '토론'],
      owner: {
        name: '시스템',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=system'
      },
      health: 95,
      constellation: '태양계',
      createdAt: '2025-01-01',
      lastActivity: '2025-05-07',
      isPrivate: false
    },
    {
      id: 'techverse',
      name: '테크버스',
      description: '기술 토론, 코딩 도움, 가젯 리뷰를 위한 커뮤니티',
      type: 'timeLimited',
      stage: 'planet',
      color: '#E53935',
      position: [6, 1, -3],
      size: 1.3,
      members: 982,
      activities: 76,
      topics: ['기술', '프로그래밍', 'IT'],
      owner: {
        name: '테크마스터',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=techmaster'
      },
      health: 82,
      constellation: '테크 콘스텔레이션',
      createdAt: '2025-03-15',
      lastActivity: '2025-05-06',
      isPrivate: false
    },
    {
      id: 'artsphere',
      name: '아트스피어',
      description: '디지털 및 전통 아티스트를 위한 창조적 예술 커뮤니티',
      type: 'public',
      stage: 'asteroid',
      color: '#43A047',
      position: [-5, -1, -4],
      size: 1.5,
      members: 754,
      activities: 92,
      topics: ['예술', '디자인', '창작'],
      owner: {
        name: '아티스트',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=artist'
      },
      health: 78,
      constellation: '창작 클러스터',
      createdAt: '2025-04-01',
      lastActivity: '2025-05-05',
      isPrivate: false
    },
    {
      id: 'marketjupiter',
      name: '마켓주피터',
      description: '이커머스 논의, 판매 팁, 시장 트렌드 공유 공간',
      type: 'private',
      stage: 'star',
      color: '#FB8C00',
      position: [8, -2, 1],
      size: 1.8,
      members: 1534,
      activities: 143,
      topics: ['마케팅', '이커머스', '창업'],
      owner: {
        name: '비즈니스킹',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=bizking'
      },
      health: 90,
      constellation: '비즈니스 네트워크',
      createdAt: '2025-02-10',
      lastActivity: '2025-05-07',
      isPrivate: true
    },
    {
      id: 'gamingpulsar',
      name: '게이밍 펄서',
      description: '게임 토론, 전략, 팁 공유를 위한 게이머 커뮤니티',
      type: 'public',
      stage: 'planet',
      color: '#9C27B0',
      position: [-7, 3, 2],
      size: 1.6,
      members: 1250,
      activities: 110,
      topics: ['게임', 'e스포츠', 'RPG'],
      owner: {
        name: '게임마스터',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=gamemaster'
      },
      health: 85,
      constellation: '엔터테인먼트 허브',
      createdAt: '2025-03-05',
      lastActivity: '2025-05-06',
      isPrivate: false
    },
    {
      id: 'eduplanet',
      name: '에듀플래닛',
      description: '교육, 학습, 자기계발을 위한 지식 공유 커뮤니티',
      type: 'public',
      stage: 'gasGiant',
      color: '#039BE5',
      position: [4, -5, -1],
      size: 1.7,
      members: 1750,
      activities: 125,
      topics: ['교육', '학습', '자기계발'],
      owner: {
        name: '교육자',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=educator'
      },
      health: 92,
      constellation: '지식 네트워크',
      createdAt: '2025-02-20',
      lastActivity: '2025-05-07',
      isPrivate: false
    }
  ]);
  
  const [constellations, setConstellations] = useState<Constellation[]>([
    {
      id: 'solar-system',
      name: '태양계',
      description: '기본 시스템 커뮤니티 모음',
      type: 'custom',
      planets: ['earth'],
      color: '#1E88E5',
      createdAt: '2025-01-01',
      createdBy: '시스템'
    },
    {
      id: 'tech-constellation',
      name: '테크 콘스텔레이션',
      description: '기술 관련 커뮤니티 모음',
      type: 'custom',
      planets: ['techverse', 'eduplanet'],
      color: '#E53935',
      createdAt: '2025-03-15',
      createdBy: 'techverse'
    },
    {
      id: 'biz-network',
      name: '비즈니스 네트워크',
      description: '비즈니스 및 마케팅 관련 커뮤니티',
      type: 'custom',
      planets: ['marketjupiter', 'eduplanet'],
      color: '#FB8C00',
      createdAt: '2025-02-10',
      createdBy: 'bizking'
    },
    {
      id: 'creative-cluster',
      name: '창작 클러스터',
      description: '예술 및 창작 관련 커뮤니티',
      type: 'custom',
      planets: ['artsphere', 'gamingpulsar'],
      color: '#43A047',
      createdAt: '2025-04-01',
      createdBy: 'artist'
    },
    {
      id: 'entertainment-hub',
      name: '엔터테인먼트 허브',
      description: '게임 및 엔터테인먼트 관련 커뮤니티',
      type: 'custom',
      planets: ['gamingpulsar'],
      color: '#9C27B0',
      createdAt: '2025-03-05',
      createdBy: 'gamemaster'
    }
  ]);
  
  // Get selected planet
  const activePlanet = planets.find(p => p.id === selectedPlanet) || null;

  useEffect(() => {
    // Get username from local storage or generate a random animal name
    const storedUsername = localStorage.getItem('peerspace_username');
    const generatedUsername = storedUsername || getRandomUsername();
    
    if (!storedUsername) {
      localStorage.setItem('peerspace_username', generatedUsername);
    }
    
    setUsername(generatedUsername);
    
    // Initialize custom data
    initializeCustomData();
  }, []);
  
  function getRandomUsername(): string {
    const prefixes = ['별빛', '우주', '코스모', '갤럭시', '스타', '오로라', '네오'];
    const suffixes = ['여행자', '탐험가', '파일럿', '나그네', '디자이너', '개발자', '아티스트'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${randomPrefix} ${randomSuffix}`;
  }
  
  const handleCreatePlanet = (planetData: any) => {
    // Add the new planet to our planets list
    setPlanets(prev => [...prev, {
      ...planetData,
      owner: {
        name: username,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`
      }
    }]);
  };
  
  const handlePlanetSelect = (planetId: string | null) => {
    setSelectedPlanet(planetId);
  };
  
  const handleBackToUniverse = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]' : 'bg-gray-50'} text-white`}>
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h1 className="text-xl font-bold">피어스페이스 Universe</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-sm bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700">
              내 행성
            </button>
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              {username.charAt(0)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {!activePlanet ? (
          <UniverseMap 
            planets={planets}
            constellations={constellations}
            selectedPlanet={selectedPlanet}
            onPlanetSelect={handlePlanetSelect}
            onCreatePlanet={() => setShowPlanetCreationWizard(true)}
          />
        ) : (
          <PlanetDashboard 
            planet={activePlanet}
            onBack={handleBackToUniverse}
            username={username}
          />
        )}
      </div>
      
      {/* Planet Creation Wizard */}
      <PlanetCreationWizard
        isOpen={showPlanetCreationWizard}
        onClose={() => setShowPlanetCreationWizard(false)}
        onCreatePlanet={handleCreatePlanet}
      />
      
      <Toaster />
    </div>
  );
};

export default Community;
