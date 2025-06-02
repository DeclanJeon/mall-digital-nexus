import React, { useMemo } from 'react';
import { Content, PeerMallConfig, ContentType } from '@/types/space';
import { Product } from '@/types/product';
import { heroSlides, guestbookData, followingPeermalls } from '../data/homeMockData';
import BasicInfoSection from './BasicInfoSection';
import HeroSection from './HeroSection';
import ProductContentSection from './ProductContentSection';
import CommunitySection from './CommunitySection';
import GuestbookSection from './GuestbookSection';
import FollowingSection from './FollowingSection';
import PeerSpaceContentSection from './PeerSpaceContentSection';
import EcosystemMap from '@/components/EcosystemMap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PeerSpaceMapSection from './PeerSpaceMapSection';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface PeerSpaceHomeSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  activeSection: 'space' | 'products' | 'community' | 'following' | 'guestbook' | 'settings' | 'peermap'; // 🚀 peermap 추가
  products: Content[];
  posts: Content[];
  searchQuery: string;
  currentView: 'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry';
  onNavigateToSection: (section: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentView: (view: 'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry') => void;
  handleShowProductForm: () => void;
  onDetailView: (productKey: string | number) => void;
}

const PeerSpaceHomeSection: React.FC<PeerSpaceHomeSectionProps> = ({
  isOwner,
  address,
  config,
  activeSection,
  products,
  posts,
  searchQuery,
  currentView,
  onNavigateToSection,
  setSearchQuery,
  setCurrentView,
  handleShowProductForm,
  onDetailView,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  const handleProductDetailView = (productKey: string | number) => {
    onDetailView(productKey);
  };

  // 🗺️ 피어맵에서 위치 선택 시 처리 함수
  const handleLocationSelect = (location: any) => {
    console.log('🚀 선택된 피어몰:', location);
    // 선택된 피어몰로 이동하는 로직을 여기에 추가할 수 있습니다
    if (location.peerMallKey) {
      navigate(`/space/${location.peerMallKey}?mk=${location.peerMallKey}`);
    }
  };

  const filteredProducts = useMemo(() =>
    products.filter(product =>
      (product.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ).map(content => ({
      ...content,
      productKey: content.id,
      title: content.title || '제목 없음',
      owner: address,
      currency: content.price ? 'ETH' : 'ETH',
      reviewCount: content.rating ? content.rating : 0,
      peermallName: config.name,
      type: ContentType.Product,
      price: Number(content.price || 0),
      imageUrl: content.imageUrl || '',
      category: content.category || '기타',
      tags: content.tags || [],
    }) as unknown as Product),
    [products, searchQuery, config.name]
  );

  const filteredPosts = useMemo(() =>
    posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [posts, searchQuery]
  );

  return (
    <div className="w-full">
      {/* 🎯 반응형 컨테이너 */}
      <div className="w-full max-w-none">
        {activeSection === 'space' && (
          <div className="space-y-6 lg:space-y-8">
            {/* 🎨 피어스페이스 메인 콘텐츠 */}
            <PeerSpaceContentSection
              isOwner={isOwner}
              address={address}
              config={config}
              products={filteredProducts}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleShowProductForm={handleShowProductForm}
              onDetailView={handleProductDetailView}
            />
          </div>
        )}

        {activeSection === 'products' && (
          <div className="space-y-6 lg:space-y-8">
            <ProductContentSection
              isOwner={isOwner}
              products={filteredProducts}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleShowProductForm={handleShowProductForm}
              showAll={true}
              onDetailView={handleProductDetailView}
            />
          </div>
        )}

        {activeSection === 'community' && (
          <div className="space-y-6 lg:space-y-8">
            <CommunitySection
              posts={filteredPosts}
              isOwner={isOwner}
              showAll={true}
              owner={config.owner}
            />
          </div>
        )}

        {activeSection === 'peermap' && (
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
              {/* 🎨 피어맵 헤더 - 아이콘 통일 */}
              <div className="p-6 bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 border-b border-gray-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <Globe className="w-7 h-7 text-white" /> {/* 🗺️ 통일된 아이콘 */}
                    </motion.div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
                        🗺️ 피어맵
                      </h2>
                      <p className="text-gray-600 font-medium text-sm lg:text-base">
                        전 세계 피어몰을 지도에서 탐험해보세요 ✨
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/60">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">실시간 업데이트</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🗺️ 피어맵 컴포넌트 */}
              <div className="h-[500px] sm:h-[600px] lg:h-[700px] relative">
                <EcosystemMap 
                  onLocationSelect={handleLocationSelect}
                  isFullscreen={false}
                />
              </div>

              {/* 🎯 하단 정보 */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200/60">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">실시간 업데이트</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="font-medium">인증된 피어몰</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="font-medium">추천 피어몰</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-500 font-medium text-center sm:text-right">
                    🎯 클릭하여 피어몰 상세보기
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {activeSection === 'following' && (
          <div className="space-y-6 lg:space-y-8">
            <FollowingSection
              following={followingPeermalls}
            />
          </div>
        )}

        {activeSection === 'guestbook' && (
          <div className="space-y-6 lg:space-y-8">
            <GuestbookSection
              entries={guestbookData}
              showAll={true}
            />
          </div>
        )} */}

        {activeSection === 'settings' && (
          <div className="space-y-6 lg:space-y-8">
            <BasicInfoSection config={config} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerSpaceHomeSection;