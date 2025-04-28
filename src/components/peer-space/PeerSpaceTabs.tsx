
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { Content } from "./types";
import ContentCard from "@/components/peer-space/ContentCard";

interface PeerSpaceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  featuredContent: Content[];
  isOwner: boolean;
  onAddContent: () => void;
  onContentClick: (content: Content) => void;
}

export const PeerSpaceTabs = ({
  activeTab,
  onTabChange,
  featuredContent,
  isOwner,
  onAddContent,
  onContentClick
}: PeerSpaceTabsProps) => {
  // Filter content based on the current active tab
  const getFilteredContent = (tabValue: string): Content[] => {
    if (tabValue === 'featured') {
      return featuredContent;
    } else {
      // Filter the content based on the tab value (which corresponds to content type)
      return featuredContent.filter(content => content.type === tabValue);
    }
  };

  // Get content for current tab
  const currentTabContent = getFilteredContent(activeTab);

  return (
    <Tabs defaultValue="featured" className="mb-8" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
        <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
        <TabsTrigger value="service">서비스</TabsTrigger>
        <TabsTrigger value="community">커뮤니티</TabsTrigger>
        <TabsTrigger value="review">리뷰</TabsTrigger>
        <TabsTrigger value="map">지도</TabsTrigger>
        <TabsTrigger value="event">이벤트</TabsTrigger>
        {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
      </TabsList>
      
      <TabsContent value={activeTab} className="space-y-10">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-300">
              {activeTab === 'featured' ? '추천 콘텐츠' : 
               activeTab === 'portfolio' ? '포트폴리오' :
               activeTab === 'service' ? '서비스' :
               activeTab === 'community' ? '커뮤니티' :
               activeTab === 'review' ? '리뷰' :
               activeTab === 'map' ? '지도' :
               activeTab === 'event' ? '이벤트' :
               activeTab === 'analytics' ? '분석' : '콘텐츠'}
            </h2>
            {isOwner && (
              <Button variant="outline" size="sm" className="flex items-center" onClick={onAddContent}>
                <Plus className="mr-1 h-4 w-4" /> 
                {activeTab === 'featured' ? '콘텐츠 추가' :
                 activeTab === 'portfolio' ? '포트폴리오 추가' :
                 activeTab === 'service' ? '서비스 추가' :
                 activeTab === 'community' ? '게시글 추가' :
                 activeTab === 'review' ? '리뷰 추가' :
                 activeTab === 'event' ? '이벤트 추가' : '추가'}
              </Button>
            )}
          </div>
          
          {currentTabContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentTabContent.map(content => (
                <div 
                  key={content.id} 
                  className="cursor-pointer" 
                  onClick={() => onContentClick(content)}
                >
                  <ContentCard content={content} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-text-200 bg-gray-50 rounded-lg">
              {activeTab === 'featured' ? '추천 콘텐츠가 없습니다.' :
               activeTab === 'portfolio' ? '포트폴리오가 없습니다.' :
               activeTab === 'service' ? '서비스가 없습니다.' :
               activeTab === 'community' ? '커뮤니티 콘텐츠가 없습니다.' :
               activeTab === 'review' ? '리뷰가 없습니다.' :
               activeTab === 'map' ? '지도 정보가 없습니다.' :
               activeTab === 'event' ? '이벤트가 없습니다.' :
               activeTab === 'analytics' ? '분석 데이터가 없습니다.' : '콘텐츠가 없습니다.'}
            </div>
          )}
          
          {currentTabContent.length > 4 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="flex items-center">
                더보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </TabsContent>
    </Tabs>
  );
};

export default PeerSpaceTabs;
