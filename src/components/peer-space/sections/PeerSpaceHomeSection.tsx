import React, { useMemo } from 'react';
import { Content, PeerMallConfig } from '../types';
import { heroSlides, guestbookData, followingPeermalls } from '../data/homeMockData';
import BasicInfoSection from './BasicInfoSection';
import HeroSection from './HeroSection';
import ProductContentSection from './ProductContentSection';
import CommunitySection from './CommunitySection';
import GuestbookSection from './GuestbookSection';
import FollowingSection from './FollowingSection';

interface PeerSpaceHomeSectionProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  activeSection: 'home' | 'content' | 'community' | 'following' | 'guestbook' | 'settings';
  products: Content[];
  posts: Content[];
  searchQuery: string;
  currentView: 'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry';
  onNavigateToSection: (section: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentView: (view: 'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry') => void;
  handleShowProductForm: () => void;
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
}) => {
  const filteredProducts = useMemo(() => 
    products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [products, searchQuery]);

  const filteredPosts = useMemo(() => 
    posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <div className="flex p-6">
        <div className="flex-1 pr-6">
          {activeSection === 'home' && (
            <>
              <HeroSection 
                slides={heroSlides}
                badges={config.badges}
              />
              
              <ProductContentSection
                isOwner={isOwner}
                products={filteredProducts}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleShowProductForm={handleShowProductForm}
                onNavigateToSection={onNavigateToSection}
              />

              <CommunitySection
                posts={filteredPosts}
                isOwner={isOwner}
                onNavigateToSection={onNavigateToSection}
                owner={config.owner}
              />

              <GuestbookSection
                entries={guestbookData}
                onNavigateToSection={onNavigateToSection}
              />
            </>
          )}

          {activeSection === 'content' && (
            <ProductContentSection
              isOwner={isOwner}
              products={filteredProducts}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleShowProductForm={handleShowProductForm}
              showAll={true}
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
        </div>
      </div>
    </div>
  );
};

export default PeerSpaceHomeSection;
