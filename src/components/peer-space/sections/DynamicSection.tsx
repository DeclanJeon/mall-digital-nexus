import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Content, Review, CommunityPost, Quest, Event, GuestbookEntry, LiveStream, Advertisement } from './types';
import { ArrowRight } from 'lucide-react';
import ContentCard from '../content/ContentCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DynamicSectionProps {
  sectionId: string;
  sectionTitle: string;
  itemsToShow: number;
  contentItems?: Content[];
  reviewItems?: Review[];
  communityPosts?: CommunityPost[];
  questItems?: Quest[];
  eventItems?: Event[];
  guestbookEntries?: GuestbookEntry[];
  streamers?: LiveStream[];
  advertisements?: Advertisement[];
  renderContentCard?: (content: Content) => React.ReactNode;
  renderItem?: (content: Content | Review | Event | Quest) => React.ReactNode;
  renderReviewCard?: (review: Review) => React.ReactNode;
  renderQuestCard?: (quest: Quest) => React.ReactNode;
  renderEventCard?: (event: Event) => React.ReactNode;
  renderCommunityPost?: (post: CommunityPost) => React.ReactNode;
  renderGuestbookEntry?: (entry: GuestbookEntry) => React.ReactNode;
  renderStream?: (stream: LiveStream) => React.ReactNode;
  renderAd?: (ad: Advertisement) => React.ReactNode;
  viewAllLinkText?: string;
  onViewAll?: () => void;
}

export const DynamicSection = ({
  sectionId,
  sectionTitle,
  itemsToShow,
  contentItems = [],
  reviewItems = [],
  communityPosts = [],
  questItems = [],
  eventItems = [],
  guestbookEntries = [],
  streamers = [],
  advertisements = [],
  renderContentCard,
  renderItem,
  renderReviewCard,
  renderQuestCard,
  renderEventCard,
  renderCommunityPost,
  renderGuestbookEntry,
  renderStream,
  renderAd,
  viewAllLinkText = "더보기",
  onViewAll
}: DynamicSectionProps) => {
  const hasContent = contentItems.length > 0;
  const hasReviews = reviewItems.length > 0 && renderReviewCard;
  const hasCommunityPosts = communityPosts.length > 0 && renderCommunityPost;
  const hasQuests = questItems.length > 0 && renderQuestCard;
  const hasEvents = eventItems.length > 0 && renderEventCard;
  const hasGuestbookEntries = guestbookEntries.length > 0 && renderGuestbookEntry;
  const hasStreamers = streamers.length > 0 && renderStream;
  const hasAdvertisements = advertisements.length > 0 && renderAd;

  const getGridClass = () => {
    if (hasReviews || hasCommunityPosts) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5";
  };

  const renderContent = () => {
    if (hasContent) {
      const renderFn = renderItem || renderContentCard;
      if (!renderFn) {
        console.error('No render function provided for content items');
        return null;
      }
      return contentItems.slice(0, itemsToShow).map(renderFn);
    }
    
    if (hasReviews) {
      return reviewItems.slice(0, itemsToShow).map(renderReviewCard!);
    }
    
    if (hasCommunityPosts) {
      return communityPosts.slice(0, itemsToShow).map(renderCommunityPost!);
    }
    
    if (sectionId === 'eventsAndQuests') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hasEvents && eventItems.length > 0 && renderEventCard!(eventItems[0])}
          {hasQuests && questItems.length > 0 && renderQuestCard!(questItems[0])}
        </div>
      );
    }
    
    if (sectionId === 'guestbook' && guestbookEntries.length > 0 && renderGuestbookEntry) {
      return guestbookEntries.slice(0, itemsToShow).map(renderGuestbookEntry);
    }
    
    if (sectionId === 'streams' && streamers.length > 0 && renderStream) {
      return streamers.slice(0, itemsToShow).map(renderStream);
    }
    
    if (sectionId === 'advertisements' && advertisements.length > 0 && renderAd) {
      return advertisements.slice(0, itemsToShow).map(renderAd);
    }
    
    return <div className="text-center py-8 text-text-200">콘텐츠가 없습니다</div>;
  };

  const showViewAll = (
    hasContent && contentItems.length > itemsToShow ||
    hasReviews && reviewItems.length > itemsToShow ||
    hasCommunityPosts && communityPosts.length > itemsToShow ||
    hasQuests && questItems.length > itemsToShow ||
    hasEvents && eventItems.length > itemsToShow ||
    hasGuestbookEntries && guestbookEntries.length > itemsToShow ||
    hasStreamers && streamers.length > itemsToShow ||
    hasAdvertisements && advertisements.length > itemsToShow
  );

  return (
    <section key={sectionId} className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{sectionTitle}</h2>
      
      <div className={getGridClass()}>
        {renderContent()}
      </div>
      
      {showViewAll && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll} 
            className="flex items-center mx-auto"
          >
            {viewAllLinkText} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default DynamicSection;
