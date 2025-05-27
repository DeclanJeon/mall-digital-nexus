import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import { Peermall } from '@/types/peermall';

const mockPeermalls: Peermall[] = [
  {
    id: '1',
    title: '멋진 피어몰 1',
    description: '최신 트렌드의 패션 아이템이 가득한 곳!',
    owner: '김피어',
    imageUrl: 'https://picsum.photos/seed/peermall1/600/400',
    category: '패션',
    phone: '010-1234-5678',
    type: 'peermall',
    tags: ['패션', '트렌드', '강남'],
    rating: 4.5,
    reviewCount: 120,
    likes: 500,
    followers: 1000,
    featured: true,
    recommended: true,
    certified: true,
    location: { lat: 37.5665, lng: 126.9780, address: '서울시 강남구 테헤란로 123' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '아름다운 피어몰 2',
    description: '바다 전망이 아름다운 카페와 소품샵!',
    owner: '이피어',
    imageUrl: 'https://picsum.photos/seed/peermall2/600/400',
    category: '카페/소품',
    phone: '010-9876-5432',
    type: 'peermall',
    tags: ['카페', '소품샵', '해운대'],
    rating: 4.8,
    reviewCount: 250,
    likes: 800,
    followers: 1500,
    featured: false,
    recommended: false,
    certified: false,
    location: { lat: 35.1666, lng: 129.1333, address: '부산시 해운대구 마린시티2로 33' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '활기찬 피어몰 3',
    description: '제주도의 신선한 농산물과 특산품을 만나보세요!',
    owner: '박피어',
    imageUrl: 'https://picsum.photos/seed/peermall3/600/400',
    category: '농산물/특산품',
    phone: '010-2468-1357',
    type: 'peermall',
    tags: ['제주', '농산물', '특산품'],
    rating: 4.2,
    reviewCount: 80,
    likes: 300,
    followers: 700,
    featured: true,
    recommended: true,
    certified: true,
    location: { lat: 33.4996, lng: 126.5312, address: '제주시 첨단로 241' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const PeermallsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <PeermallGrid
          malls={mockPeermalls}
          title="피어몰 둘러보기"
          onOpenMap={() => { /* 지도 열기 로직 */ }}
          viewMode="grid"
        />
      </main>
    </div>
  );
};

export default PeermallsPage;
