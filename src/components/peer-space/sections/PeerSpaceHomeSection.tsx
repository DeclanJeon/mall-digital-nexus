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
            <div>
              피어몰
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