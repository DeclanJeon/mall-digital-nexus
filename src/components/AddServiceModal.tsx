import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (name: string, link: string) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onAddService }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceLink, setServiceLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceName.trim() && serviceLink.trim()) {
      onAddService(serviceName, serviceLink);
      setServiceName('');
      setServiceLink('');
      onClose(); // 모달 닫기
    } else {
      // 간단한 유효성 검사 피드백 (필요에 따라 개선)
      alert('서비스 이름과 링크를 모두 입력해주세요.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>즐겨찾는 서비스 추가</DialogTitle>
          <DialogDescription>
            추가할 서비스의 이름과 링크를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-name" className="text-right">
                서비스명
              </Label>
              <Input
                id="service-name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="col-span-3"
                placeholder="예: 자주 가는 쇼핑몰"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-link" className="text-right">
                링크
              </Label>
              <Input
                id="service-link"
                value={serviceLink}
                onChange={(e) => setServiceLink(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
                type="url" // URL 타입 지정
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="submit">추가하기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
