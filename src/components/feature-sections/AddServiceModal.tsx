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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import { ScrollArea } from '@/components/ui/scroll-area'; 

// SRS 문서 기반 내부 서비스 목록
const INTERNAL_SERVICES = [
  { id: 'digital-business-card', name: '디지털 명함 서비스' },
  { id: 'phonebook', name: '전화등록부 시스템' },
  { id: 'email-qr', name: '이메일 QR 서비스' },
  { id: 'peermall-link', name: '피어몰 연결 서비스' },
  { id: 'curation-link', name: '큐레이션 링크' }, // 피어몰 연결 서비스의 하위 기능으로 볼 수도 있지만 별도 항목으로 추가
  { id: 'multi-qr', name: '멀티 QR 솔루션' },
  // 필요에 따라 SRS의 다른 섹션에서 추가 서비스 식별 가능 (예: 커뮤니티, 고객센터 등)
  { id: 'community', name: '커뮤니티' }, 
  { id: 'support', name: '고객센터' },
];

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExternalService: (name: string, link: string) => void; 
  onAddInternalServices: (serviceIds: string[]) => void; 
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddExternalService, 
  onAddInternalServices 
}) => {
  const [externalServiceName, setExternalServiceName] = useState('');
  const [externalServiceLink, setExternalServiceLink] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]); 

  const handleExternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (externalServiceName.trim() && externalServiceLink.trim()) {
      onAddExternalService(externalServiceName, externalServiceLink);
      setExternalServiceName('');
      setExternalServiceLink('');
      onClose(); 
    } else {
      alert('서비스 이름과 링크를 모두 입력해주세요.');
    }
  };

  const handleInternalServiceChange = (serviceId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId) 
        : [...prevSelected, serviceId] 
    );
  };

  const handleInternalSubmit = () => {
    if (selectedServices.length > 0) {
      onAddInternalServices(selectedServices);
      setSelectedServices([]); 
      onClose();
    } else {
      alert('등록할 내부 서비스를 하나 이상 선택해주세요.');
    }
  };

  // 모달이 닫힐 때 상태 초기화
  const handleModalClose = () => {
    setExternalServiceName('');
    setExternalServiceLink('');
    setSelectedServices([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-lg bg-background text-foreground border-border"> 
        <DialogHeader>
          <DialogTitle className="text-text-100">즐겨찾는 서비스 추가</DialogTitle> 
          <DialogDescription className="text-text-200"> 
            추가할 서비스 유형을 선택하고 정보를 입력하거나 선택하세요.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="external" className="w-full">
          {/* <TabsList className="grid w-full grid-cols-1 bg-muted"> 
            <TabsTrigger value="internal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">피어몰 서비스</TabsTrigger> 
            <TabsTrigger value="external" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">외부 서비스(링크)</TabsTrigger> 
          </TabsList> */}

          {/* 내부 서비스 탭 */}
          <TabsContent value="internal">
            <div className="py-4 space-y-4">
              <Label className="text-text-100">등록할 서비스 선택</Label> 
              <ScrollArea className="h-48 w-full rounded-md border border-border p-4 bg-muted/50"> 
                <div className="space-y-2">
                  {INTERNAL_SERVICES.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleInternalServiceChange(service.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary" 
                      />
                      <Label htmlFor={service.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-100"> 
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleModalClose}>취소</Button>
              <Button type="button" onClick={handleInternalSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">선택 등록</Button> 
            </DialogFooter>
          </TabsContent>

          {/* 외부 서비스 탭 */}
          <TabsContent value="external">
            <form onSubmit={handleExternalSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="external-service-name" className="text-right text-text-100"> 
                    서비스명
                  </Label>
                  <Input
                    id="external-service-name"
                    value={externalServiceName}
                    onChange={(e) => setExternalServiceName(e.target.value)}
                    className="col-span-3 bg-input text-foreground border-border placeholder:text-muted-foreground" 
                    placeholder="예: 자주 가는 쇼핑몰"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="external-service-link" className="text-right text-text-100"> 
                    링크
                  </Label>
                  <Input
                    id="external-service-link"
                    value={externalServiceLink}
                    onChange={(e) => setExternalServiceLink(e.target.value)}
                    className="col-span-3 bg-input text-foreground border-border placeholder:text-muted-foreground" 
                    placeholder="https://example.com"
                    type="url" 
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleModalClose}>취소</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">링크 추가</Button> 
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
