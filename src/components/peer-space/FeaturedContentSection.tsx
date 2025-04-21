
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import ContentCard from "./ContentCard";
import { FeaturedContentSectionProps } from "./types";

const FeaturedContentSection = ({ content, isOwner, onAddContent, onContentClick }: FeaturedContentSectionProps) => (
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
      {content.map(item => (
        <ContentCard 
          key={item.id} 
          content={item} 
          onClick={() => onContentClick?.(item)} 
        />
      ))}
    </div>
    {content.length > 4 && (
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="flex items-center">
          더보기 <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    )}
  </section>
);

export default FeaturedContentSection;
