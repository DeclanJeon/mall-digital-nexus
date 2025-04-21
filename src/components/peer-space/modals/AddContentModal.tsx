import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AddContentModal = () => {
  const [contentType, setContentType] = useState('');

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 콘텐츠 추가</DialogTitle>
        </DialogHeader>
        {!contentType ? (
          <div className="grid gap-4 py-4">
            <Button onClick={() => setContentType('product')}>상품</Button>
            <Button onClick={() => setContentType('service')}>서비스</Button>
            <Button onClick={() => setContentType('event')}>이벤트</Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <Input placeholder="제목" />
            <Textarea placeholder="설명" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setContentType('')}>
                취소
              </Button>
              <Button>저장</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddContentModal;
