// components/layout/PeerSpaceLayout.tsx - 완전한 해결책
import React, { useState, useEffect } from 'react';
import PeerSpaceHeader from '@/components/peer-space/layout/PeerSpaceHeader';
import LeftSideBar from '@/components/peer-space/layout/LeftSideBar';
import RightSideBar from '@/components/peer-space/layout/RightSideBar';
import { SectionType } from '@/types/space';
import { useParams } from 'react-router-dom';

interface PeerSpaceLayoutProps {
  children: React.ReactNode;
}

const PeerSpaceLayout: React.FC<PeerSpaceLayoutProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<SectionType[]>([]);
  const [headerHeight, setHeaderHeight] = useState(64);
  const searchParams = new URLSearchParams(location.search);

  const isOwner = true;

  // 🎯 헤더 높이 동적 계산
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('[data-header]') || document.querySelector('header');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    
    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎯 헤더 - data-header 속성 추가 */}
      <div data-header>
        <PeerSpaceHeader
          isOwner={isOwner}
          onSearchChange={setSearchQuery}
        />
      </div>
      
      {/* 🎯 메인 레이아웃 - 정확한 높이 계산 */}
      <div 
        className="flex"
        style={{ height: `calc(100vh - ${headerHeight}px)` }}
      >
        {/* 🎯 사이드바 - 완전 고정 */}
        <div className="flex-shrink-0">
          <LeftSideBar 
            isOwner={isOwner}
            onNavigateToSection={(section) => {
              // console.log('Navigate to section:', section);
            }}
          />
        </div>
        
        {/* 🎯 메인 콘텐츠 - 독립적인 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PeerSpaceLayout;
