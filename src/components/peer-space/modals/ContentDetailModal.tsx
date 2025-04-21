import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Content } from '../types';

interface ContentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: Content | null;
}

const ContentDetailModal = ({ open, onOpenChange, content }: ContentDetailModalProps) => {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-text-200">{content.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
