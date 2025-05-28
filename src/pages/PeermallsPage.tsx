import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import { Peermall } from '@/types/peermall';
import { peermallStorage } from '@/services/storage/peermallStorage';

const PeermallsPage: React.FC = () => {
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);

  useEffect(() => {
    const loadPeermalls = () => {
      const allPeermalls = peermallStorage.getAll();
      setPeermalls(allPeermalls);
    };

    loadPeermalls();

    const unsubscribe = peermallStorage.addEventListener((updatedPeermalls) => {
      setPeermalls(updatedPeermalls);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <PeermallGrid
          malls={peermalls}
          title="피어몰 둘러보기"
          onOpenMap={() => { /* 지도 열기 로직 */ }}
          viewMode="grid"
        />
      </main>
    </div>
  );
};

export default PeermallsPage;
