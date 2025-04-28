
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Content, PeerMallConfig } from './types';
import { Button } from '@/components/ui/button';
import ContentCard from './ContentCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AddContentForm, { ContentFormValues } from './AddContentForm';
import EmptyState from './EmptyState';

interface PeerSpaceContentSectionProps {
  config: PeerMallConfig;
  contents: Content[];
  isOwner: boolean;
  onAddContent: (content: ContentFormValues) => void;
}

export default function PeerSpaceContentSection({ 
  config, 
  contents, 
  isOwner,
  onAddContent
}: PeerSpaceContentSectionProps) {
  const [showAddContentModal, setShowAddContentModal] = useState(false);

  const handleAddContent = (formValues: ContentFormValues) => {
    onAddContent(formValues);
    setShowAddContentModal(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>콘텐츠 / 상품</CardTitle>
        {isOwner && (
          <Button size="sm" onClick={() => setShowAddContentModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> 콘텐츠 추가
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {contents.length === 0 ? (
          <EmptyState 
            title="콘텐츠가 없습니다"
            description={isOwner 
              ? "새로운 콘텐츠나 상품을 추가해보세요!"
              : "아직 등록된 콘텐츠가 없습니다."
            }
            actionLabel={isOwner ? "콘텐츠 추가" : undefined}
            onAction={isOwner ? () => setShowAddContentModal(true) : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>새 콘텐츠 추가하기</DialogTitle>
          </DialogHeader>
          <AddContentForm onSubmit={handleAddContent} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
