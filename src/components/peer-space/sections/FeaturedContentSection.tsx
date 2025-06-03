import React from 'react';
import { Content } from '../types';
import ContentCard from '../content/ContentCard';
import { FeaturedContentSectionProps } from './types';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';

const FeaturedContentSection: React.FC<FeaturedContentSectionProps> = ({
  title = "추천 콘텐츠",
  content,
  viewAll,
  maxItems = 4,
  layout = 'grid',
  isOwner = false,
  onAddContent,
  onContentClick,
}) => (
  <section>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-primary-300">{title}</h2>
      {isOwner && (
        <Button variant="outline" size="sm" className="flex items-center" onClick={onAddContent}>
          <Plus className="mr-1 h-4 w-4" /> 콘텐츠 추가
        </Button>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {content.map(item => (
        <div key={item.id} onClick={() => onContentClick?.(item)}>
          <ContentCard content={item} />
        </div>
      ))}
    </div>
    {content.length > maxItems && (
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="flex items-center">
          더보기 <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    )}
  </section>
);

export default FeaturedContentSection;
