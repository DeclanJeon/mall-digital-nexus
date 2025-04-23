
import React from 'react';
import { Button } from '@/components/ui/button';
import { Content, Review, CommunityPost, Quest, Event } from './types';
import { ArrowRight } from 'lucide-react';
import ContentCard from './ContentCard';

interface DynamicSectionProps {
  sectionId: string;
  sectionTitle: string;
  itemsToShow: number;
  contentItems?: Content[];
  reviewItems?: Review[];
  communityPosts?: CommunityPost[];
  questItems?: Quest[];
  eventItems?: Event[];
  renderContentCard: (content: Content) => React.ReactNode;
  renderReviewCard?: (review: Review) => React.ReactNode;
  renderQuestCard?: (quest: Quest) => React.ReactNode;
  renderEventCard?: (event: Event) => React.ReactNode;
  renderCommunityPost?: (post: CommunityPost) => React.ReactNode;
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
  renderContentCard,
  renderReviewCard,
  renderQuestCard,
  renderEventCard,
  renderCommunityPost,
  viewAllLinkText = "더보기",
  onViewAll
}: DynamicSectionProps) => {
  // Determine which items to display based on what's provided
  const hasContent = contentItems.length > 0;
  const hasReviews = reviewItems.length > 0 && renderReviewCard;
  const hasCommunityPosts = communityPosts.length > 0 && renderCommunityPost;
  const hasQuests = questItems.length > 0 && renderQuestCard;
  const hasEvents = eventItems.length > 0 && renderEventCard;
  
  // Determine grid layout based on content type
  const getGridClass = () => {
    if (hasReviews || hasCommunityPosts) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5";
  };

  // Show appropriate items
  const renderContent = () => {
    if (hasContent) {
      return contentItems.slice(0, itemsToShow).map(renderContentCard);
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
    
    return <div className="text-center py-8 text-text-200">콘텐츠가 없습니다</div>;
  };

  const showViewAll = (
    hasContent && contentItems.length > itemsToShow ||
    hasReviews && reviewItems.length > itemsToShow ||
    hasCommunityPosts && communityPosts.length > itemsToShow
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
