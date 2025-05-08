import React, { useState } from 'react';
import { Content } from '../types';
import ContentCard from '../content/ContentCard';
import { Button } from '@/components/ui/button';
import AddContentForm from '../forms/AddContentForm';
import EmptyState from '../ui/EmptyState';

interface PeerSpaceContentSectionProps {
  contents: Content[];
  isOwner: boolean;
}

const PeerSpaceContentSection: React.FC<PeerSpaceContentSectionProps> = ({
  contents,
  isOwner
}) => {
  const [isAddingContent, setIsAddingContent] = useState(false);

  const handleAddContentClick = () => {
    setIsAddingContent(true);
  };

  const handleContentSubmit = (newContent: Content) => {
    // TODO: Implement content submission logic
    console.log("새로운 콘텐츠:", newContent);
    setIsAddingContent(false);
  };

  const handleCancelAddContent = () => {
    setIsAddingContent(false);
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">콘텐츠</h2>
        {isOwner && (
          <Button onClick={handleAddContentClick}>
            콘텐츠 추가
          </Button>
        )}
      </div>

      {isAddingContent ? (
        <AddContentForm onSubmit={handleContentSubmit} onCancel={handleCancelAddContent} />
      ) : contents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contents.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <EmptyState 
          message="콘텐츠가 없습니다."
          description="새로운 콘텐츠를 추가하여 피어 스페이스를 풍성하게 만들어보세요."
        />
      )}
    </section>
  );
};

export default PeerSpaceContentSection;
