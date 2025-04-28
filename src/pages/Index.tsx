import React, { useState, useCallback, useEffect } from 'react';
import PeermallGrid from '../components/PeermallGrid';
import CommunicationWidget from '@/components/CommunicationWidget';
import HashtagFilter, { HashtagFilterOption, PeermallType } from '@/components/HashtagFilter';
import PeermallMap from '@/components/PeermallMap';
import ServiceCardsSection from '@/components/ServiceCardsSection';
import FavoriteServicesSection from '@/components/FavoriteServicesSection';
import EcosystemMap from '@/components/EcosystemMap';
import CommunityHighlights from '@/components/CommunityHighlights';

interface Peermall {
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  type?: string;
  feedDate?: string;
  recommended?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

const Index = () => {
  const [peermalls, setPeermalls] = useState<Peermall[]>(() => {
    const storedPeermalls = localStorage.getItem('peermalls');
    return storedPeermalls ? JSON.parse(storedPeermalls) : [];
  });

  const hashtagOptions: HashtagFilterOption[] = [
    { label: '전체', value: '전체' },
    { label: '#디자인', value: '#디자인' },
    { label: '#푸드', value: '#푸드' },
    { label: '#패션', value: '#패션' },
    { label: '#테크', value: '#테크' },
    { label: '#아트', value: '#아트' },
    { label: '#라이프', value: '#라이프' },
    { label: '#취미', value: '#취미' },
    { label: '#여행', value: '#여행' },
  ];

  // 날짜 포맷팅 함수
  const formatDate = (daysAgo: number) => {
    return `${daysAgo}일 전`;
  };

  const [filteredMalls, setFilteredMalls] = useState<Peermall[]>(peermalls);
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);

  const allLocations = peermalls
    .filter(mall => mall.location)
    .map(mall => ({
      lat: mall.location!.lat,
      lng: mall.location!.lng,
      address: mall.location!.address,
      title: mall.title
    }));

  const handleFilterChange = useCallback((selectedHashtags: string[], selectedTypes: PeermallType[]) => {
    if (selectedHashtags.includes('전체') && (selectedTypes.includes('all') || selectedTypes.length === 0)) {
      setFilteredMalls(peermalls);
      return;
    }
    
    let filtered = peermalls;
    
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
      filtered = filtered.filter(mall => selectedTypes.includes(mall.type as PeermallType));
    }
    
    if (selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) {
      filtered = filtered.filter(mall => 
        mall.tags && mall.tags.some(tag => selectedHashtags.includes(tag))
      );
    }
    
    setFilteredMalls(filtered);
  }, [peermalls]);

  const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleCloseMap = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  const [scrollY, setScrollY] = useState(0);
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-bg-100">
        <div className="container mx-auto px-4 py-6">
          
          <section className="mb-8 flex justify-between items-center">
            <FavoriteServicesSection />
          </section>
          <HashtagFilter
            hashtags={hashtagOptions}
            onFilterChange={handleFilterChange}
          />
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <PeermallGrid 
                title="피어몰 탐색" 
                malls={filteredMalls}
                onOpenMap={handleOpenMap}
                viewMore={false}
              />
            </div>
            
            <div className="md:col-span-1">
              <EcosystemMap />
            </div>
          </section>
          
          <section className="mb-12">
            <CommunityHighlights />
          </section>
        </div>
        
        <ServiceCardsSection />
      </main>
      
      <CommunicationWidget />

      <PeermallMap 
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        selectedLocation={selectedLocation}
        allLocations={allLocations}
      />

    </div>
  );
};

export default Index;
