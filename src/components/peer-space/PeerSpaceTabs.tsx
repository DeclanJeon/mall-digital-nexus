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
}: PeerSpaceTabsProps) => (
  <Tabs defaultValue="featured" className="mb-8" value={activeTab} onValueChange={onTabChange}>
    <TabsList className="w-full justify-start overflow-x-auto">
      <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
      <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
      <TabsTrigger value="services">서비스</TabsTrigger>
      <TabsTrigger value="community">커뮤니티</TabsTrigger>
      <TabsTrigger value="reviews">리뷰</TabsTrigger>
      <TabsTrigger value="map">지도</TabsTrigger>
      <TabsTrigger value="events">이벤트</TabsTrigger>
      {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
    </TabsList>
    
    <TabsContent value="featured" className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-300">추천 콘텐츠</h2>
          {isOwner && (
            <Button variant="outline" size="sm" className="flex items-center" onClick={onAddContent}>
              <Plus className="mr-1 h-4 w-4" /> 콘텐츠 추가
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredContent.map(content => (
            <ContentCard 
              key={content.id} 
              content={content} 
              onClick={() => onContentClick(content)} 
            />
          ))}
        </div>
        {featuredContent.length > 4 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="flex items-center">
              더보기 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </TabsContent>

    {/* 다른 탭들에 대한 기본 콘텐츠 추가 */}
    <TabsContent value="portfolio">
      <div className="py-4 text-center text-text-200">
        포트폴리오 탭 콘텐츠 준비 중
      </div>
    </TabsContent>
    
    <TabsContent value="services">
      <div className="py-4 text-center text-text-200">
        서비스 탭 콘텐츠 준비 중
      </div>
    </TabsContent>

    <TabsContent value="community">
      <div className="py-4 text-center text-text-200">
        커뮤니티 탭 콘텐츠 준비 중
      </div>
    </TabsContent>

    <TabsContent value="reviews">
      <div className="py-4 text-center text-text-200">
        리뷰 탭 콘텐츠 준비 중
      </div>
    </TabsContent>

    <TabsContent value="map">
      <div className="py-4 text-center text-text-200">
        지도 탭 콘텐츠 준비 중
      </div>
    </TabsContent>

    <TabsContent value="events">
      <div className="py-4 text-center text-text-200">
        이벤트 탭 콘텐츠 준비 중
      </div>
    </TabsContent>

    {isOwner && (
      <TabsContent value="analytics">
        <div className="py-4 text-center text-text-200">
          분석 탭 콘텐츠 준비 중
        </div>
      </TabsContent>
    )}
  </Tabs>
);
