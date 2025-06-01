// components/layout/PeerSpaceLayout.tsx
import React, { useState } from 'react';
import PeerSpaceHeader from '@/components/peer-space/layout/PeerSpaceHeader';
import LeftSideBar from '@/components/peer-space/layout/LeftSideBar';
import { SectionType } from '@/types/space';

interface PeerSpaceContentLayoutProps {
  children: React.ReactNode;
}

const PeerSpaceContentLayout: React.FC<PeerSpaceContentLayoutProps> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sections, setSections] = useState<SectionType[]>([]);
    const searchParams = new URLSearchParams(location.search);

    // TODO: 실제로는 주소에서 추출하거나 API에서 가져와야 함
    const isOwner = true;

  return (
        <div className="min-h-screen bg-gray-50">
            <PeerSpaceHeader
                isOwner={isOwner}
                onSearchChange={setSearchQuery}
            />
            
            <div className="flex">
                <LeftSideBar 
                isOwner={isOwner}
                onNavigateToSection={(section) => {
                    // Handle navigation to different sections
                    console.log('Navigate to section:', section);
                }}
                />
                
                <main className="flex-1 p-4">
                {children}
                </main>
            </div>
            </div>
        );
    };

export default PeerSpaceContentLayout;
