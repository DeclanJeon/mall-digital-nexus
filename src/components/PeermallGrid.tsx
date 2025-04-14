
import React from 'react';
import PeermallCard from './PeermallCard';
import { ChevronRight } from 'lucide-react';

interface PeermallGridProps {
  title: string;
  malls: {
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
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
  }[];
  viewMore?: boolean;
  onOpenMap: (location: { lat: number; lng: number; address: string; title: string }) => void;
}

const PeermallGrid = ({ title, malls, viewMore = true, onOpenMap }: PeermallGridProps) => {
  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-300">{title}</h2>
        {viewMore && malls.length > 0 && (
          <a href="#" className="flex items-center text-accent-200 hover:text-accent-100 transition-colors">
            더보기 
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {malls.map((mall, index) => (
          <PeermallCard
            key={index}
            {...mall}
            onOpenMap={onOpenMap}
          />
        ))}
      </div>
    </section>
  );
};

export default PeermallGrid;
