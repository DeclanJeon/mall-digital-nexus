
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Content } from './types';
import ContentCard from './ContentCard';
import { ArrowRight } from 'lucide-react';

interface LearningHubTabsProps {
  courses: Content[];
  resources: Content[];
  workshops: Content[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LearningHubTabs: React.FC<LearningHubTabsProps> = ({
  courses,
  resources,
  workshops,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="courses">코스</TabsTrigger>
        <TabsTrigger value="resources">학습 자료</TabsTrigger>
        <TabsTrigger value="workshops">워크숍</TabsTrigger>
      </TabsList>

      <TabsContent value="courses" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <ContentCard
              key={course.id}
              content={course}
            />
          ))}
        </div>
        {courses.length > 8 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline">
              더 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="resources" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map(resource => (
            <ContentCard
              key={resource.id}
              content={resource}
            />
          ))}
        </div>
        {resources.length > 8 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline">
              더 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="workshops" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workshops.map(workshop => (
            <ContentCard
              key={workshop.id}
              content={workshop}
            />
          ))}
        </div>
        {workshops.length > 8 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline">
              더 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LearningHubTabs;
