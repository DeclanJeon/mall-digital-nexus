
import React, { useEffect, useState } from 'react';
import NewPeermallCard from './NewPeermallCard';
import { ChevronRight } from 'lucide-react';

interface Peermall {
  id?: string;
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  likes?: number;
  followers?: number;
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

interface PeermallGridProps {
  title: string;
  malls: Peermall[];
  viewMore?: boolean;
  onOpenMap: (location: { lat: number; lng: number; address: string; title: string }) => void;
  viewMode: 'grid' | 'list'; // viewMode prop 추가
  onShowQrCode?: (peermallId: string, peermallTitle: string) => void; // QR 코드 콜백 추가
  isPopularSection?: boolean;
}

const PeermallGrid = ({ 
  title, 
  malls, 
  viewMore = true, 
  onOpenMap, 
  viewMode, 
  onShowQrCode,
  isPopularSection = false 
}: PeermallGridProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [malls]);

  const gridLayoutClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
  const listLayoutClasses = "flex flex-col gap-4";

  return (
    <section className="my-4">
      <div className="flex items-center justify-between mb-4">
        {title && <h2 className="text-2xl font-bold text-primary-100">{title}</h2>}
      </div>
      
      {isLoading ? (
        <div className={viewMode === 'grid' ? gridLayoutClasses : listLayoutClasses}>
          {[...Array(viewMode === 'grid' ? 4 : 2)].map((_, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-md p-4 animate-pulse ${viewMode === 'list' ? 'flex flex-row h-32' : 'h-64'}`}>
              <div className={`bg-gray-200 rounded-md ${viewMode === 'list' ? 'w-32 h-full mr-4' : 'h-32 mb-4'}`}></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                {viewMode === 'list' && <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>}
              </div>
            </div>
          ))}
        </div>
      ) : malls.length > 0 ? (
        <div className={viewMode === 'grid' ? gridLayoutClasses : listLayoutClasses}>
          {malls.map((mall, index) => (
            <NewPeermallCard
              key={mall.id || index}
              id={mall.id || `mall-${index}`}
              title={mall.title}
              description={mall.description}
              owner={mall.owner}
              imageUrl={mall.imageUrl}
              likes={mall.likes || 0}
              rating={mall.rating}
              followers={mall.followers || 0}
              tags={mall.tags || []}
              isPopular={isPopularSection || mall.featured}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg border border-dashed">
          <p className="text-gray-500">피어몰이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">새 피어몰을 만들어보세요!</p>
        </div>
      )}

      {viewMore && malls.length > 0 && (
        <div className="flex items-center justify-end mt-4">
          <a href="#" className="flex items-center text-accent-100 hover:text-primary-100 transition-colors">
            더보기 <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      )}
      
    </section>
  );
};

export default PeermallGrid;
