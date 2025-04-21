
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Plus, ArrowRight } from "lucide-react";

type FeaturedContentSectionProps = {
  content: any[];
  isOwner: boolean;
  onAddContent?: () => void;
  onContentClick?: (c: any) => void;
};

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
      {content.map(content => (
        <Card
          key={content.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onContentClick?.(content)}
        >
          <div className="aspect-video relative overflow-hidden">
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            {content.type === 'event' && <Badge className="absolute top-2 right-2 bg-accent-100">이벤트</Badge>}
            {content.type === 'product' && <Badge className="absolute top-2 right-2 bg-primary-200">상품</Badge>}
            {content.type === 'service' && <Badge className="absolute top-2 right-2 bg-secondary">서비스</Badge>}
            {content.isExternal && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                외부 콘텐츠
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold mb-1">{content.title}</h3>
            <p className="text-sm text-text-200 mb-3">{content.description}</p>
            <div className="flex justify-between items-center">
              <div>
                {content.price && <p className="font-semibold text-primary-300">{content.price}</p>}
                {content.date && content.date !== '' && !content.price && (
                  <p className="text-sm text-text-200">{content.date}</p>
                )}
                {content.isExternal && <p className="text-xs text-gray-500">출처: {content.source}</p>}
              </div>
              <div className="text-sm text-text-200 flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                {content.likes}
              </div>
            </div>
          </CardContent>
        </Card>
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
