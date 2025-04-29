
import React, { useEffect, useState } from 'react';
import PeermallCard from './PeermallCard';
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
}

const PeermallGrid = ({ title, malls, viewMore = true, onOpenMap }: PeermallGridProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when malls are loaded
    setIsLoading(false);
  }, [malls]);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-300">{title}</h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : malls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {malls.map((mall, index) => (
            <PeermallCard
              key={mall.id || index}
              {...mall}
              id={mall.id}
              onOpenMap={onOpenMap}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg border border-dashed">
          <p className="text-gray-500">피어몰이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">새 피어몰을 만들어보세요!</p>
        </div>
      )}

      {viewMore && (
        <div className="flex items-center justify-end mt-4">
          <a href="#" className="flex items-center text-accent-200 hover:text-accent-100 transition-colors">
            더보기 <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      )}
      
    </section>
  );
};

export default PeermallGrid;
