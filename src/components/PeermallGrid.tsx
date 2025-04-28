
import React, { useEffect, useState } from 'react';
import PeermallCard from './PeermallCard';
import { ChevronRight } from 'lucide-react';

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

interface PeermallGridProps {
  title: string;
  malls: Peermall[];
  viewMore?: boolean;
  onOpenMap: (location: { lat: number; lng: number; address: string; title: string }) => void;
}

const PeermallGrid = ({ title, malls: initialMalls, viewMore = true, onOpenMap }: PeermallGridProps) => {
  const [malls, setMalls] = useState<Peermall[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 피어몰 정보 불러오기
    const storedMalls = localStorage.getItem('peermalls');
    if (storedMalls) {
      setMalls(JSON.parse(storedMalls));
    } else {
      // 로컬 스토리지에 정보가 없으면 initialMalls 사용
      setMalls(initialMalls);
    }
  }, [initialMalls]);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-300">{title}</h2>
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

      <div className="flex items-center justify-end mt-4">
        <a href="#" className="flex items-center text-accent-200 hover:text-accent-100 transition-colors">
          더보기 <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
    </section>
  );
};

export default PeermallGrid;
