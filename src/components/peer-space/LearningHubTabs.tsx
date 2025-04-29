
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import ContentCard from "@/components/peer-space/ContentCard";
import { Content } from "./types";

export interface LearningHubTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isOwner: boolean;
  onAddContent: () => void;
  onContentClick: () => void;
}

export const LearningHubTabs: React.FC<LearningHubTabsProps> = ({
  activeTab,
  onTabChange,
  isOwner,
  onAddContent,
  onContentClick
}) => {
  return (
    <Tabs defaultValue="courses" className="mb-8" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="courses">강좌</TabsTrigger>
        <TabsTrigger value="workshops">워크샵</TabsTrigger>
        <TabsTrigger value="challenges">챌린지</TabsTrigger>
        <TabsTrigger value="quests">퀘스트</TabsTrigger>
        <TabsTrigger value="resources">자료실</TabsTrigger>
        {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
      </TabsList>
      
      <TabsContent value={activeTab} className="space-y-10">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-300">
              {activeTab === 'courses' ? '강좌' : 
               activeTab === 'workshops' ? '워크샵' :
               activeTab === 'challenges' ? '챌린지' :
               activeTab === 'quests' ? '퀘스트' :
               activeTab === 'resources' ? '자료실' :
               activeTab === 'analytics' ? '분석' : '콘텐츠'}
            </h2>
            {isOwner && (
              <Button variant="outline" size="sm" className="flex items-center" onClick={onAddContent}>
                <Plus className="mr-1 h-4 w-4" /> 
                {activeTab === 'courses' ? '강좌 추가' :
                 activeTab === 'workshops' ? '워크샵 추가' :
                 activeTab === 'challenges' ? '챌린지 추가' :
                 activeTab === 'quests' ? '퀘스트 추가' :
                 activeTab === 'resources' ? '자료 추가' : '추가'}
              </Button>
            )}
          </div>
          
          <div className="py-10 text-center text-text-200 bg-gray-50 rounded-lg">
            {activeTab === 'courses' ? '등록된 강좌가 없습니다.' :
             activeTab === 'workshops' ? '등록된 워크샵이 없습니다.' :
             activeTab === 'challenges' ? '등록된 챌린지가 없습니다.' :
             activeTab === 'quests' ? '등록된 퀘스트가 없습니다.' :
             activeTab === 'resources' ? '등록된 자료가 없습니다.' :
             activeTab === 'analytics' ? '분석 데이터가 없습니다.' : '등록된 콘텐츠가 없습니다.'}
          </div>
        </section>
      </TabsContent>
    </Tabs>
  );
};

export default LearningHubTabs;
