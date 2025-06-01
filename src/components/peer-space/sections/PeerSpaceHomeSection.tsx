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
import { useNavigate, useSearchParams } from 'react-router-dom';

interface PeerSpaceHomeSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  activeSection: 'space' | 'products' | 'community' | 'following' | 'guestbook' | 'settings';
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
  const [ searchParams ] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  const handleProductDetailView = (productKey: string | number) => {
    // navigate(`/space/${address}/product?mk=${peerMallKey}&pk=${productKey}`);
    onDetailView(productKey);
  };

  const filteredProducts = useMemo(() =>
    products.filter(product =>
      (product.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ).map(content => ({
      ...content,
      productKey: content.id, // id를 productKey로 사용
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <div className="flex p-6 w-full">
        <div className="flex-1 pr-6">
          <>
            {activeSection === 'space' && (
              <>
                {/* <HeroSection
                  slides={heroSlides}
                  badges={config.badges}
                /> */}

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

                {/* <CommunitySection
                  posts={filteredPosts}
                  isOwner={isOwner}
                  onNavigateToSection={onNavigateToSection}
                  owner={config.owner}
                /> */}

                {/* <GuestbookSection
                  entries={guestbookData}
                  onNavigateToSection={onNavigateToSection}
                /> */}
              </>
            )}

            {activeSection === 'products' && (
              <ProductContentSection
                isOwner={isOwner}
                products={filteredProducts}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleShowProductForm={handleShowProductForm}
                showAll={true}
                onDetailView={handleProductDetailView}
              />
            )}

            {activeSection === 'community' && (
              <CommunitySection
                posts={filteredPosts}
                isOwner={isOwner}
                showAll={true}
                owner={config.owner}
              />
            )}

            {activeSection === 'following' && (
              <FollowingSection
                following={followingPeermalls}
              />
            )}

            {activeSection === 'guestbook' && (
              <GuestbookSection
                entries={guestbookData}
                showAll={true}
              />
            )}

            {activeSection === 'settings' && (
              <BasicInfoSection config={config} />
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default PeerSpaceHomeSection;
