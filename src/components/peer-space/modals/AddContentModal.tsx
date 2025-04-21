import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";

const contentTypes = [
  { id: 'type1', name: '상품', description: '판매할 제품 등록' },
  { id: 'type2', name: '포트폴리오', description: '작업물 전시' },
  { id: 'type3', name: '서비스', description: '제공할 서비스 등록' },
  { id: 'type4', name: '게시글', description: '커뮤니티에 글 작성' },
  { id: 'type5', name: '외부 링크', description: '외부 콘텐츠 연결' }
];

interface AddContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (type: string, data: unknown) => void;
}

export const AddContentModal = ({
  open,
  onOpenChange,
  onSubmit
}: AddContentModalProps) => {
  const [newContentType, setNewContentType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newContentType, {});
    onOpenChange(false);
  };

  const handleExternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit('external', {});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">새 콘텐츠 추가</DialogTitle>
        </DialogHeader>
        
        {!newContentType ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {contentTypes.map(type => (
              <Card 
                key={type.id} 
                className="cursor-pointer hover:border-primary-300 transition-colors"
                onClick={() => setNewContentType(type.name)}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold mb-2">{type.name}</h3>
                  <p className="text-sm text-text-200">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newContentType === '외부 링크' ? (
          <form onSubmit={handleExternalSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">외부 링크 URL</label>
              <Input placeholder="https://example.com/your-content" required />
              <p className="text-xs text-text-200 mt-1">
                외부 콘텐츠(상품, 글, 이미지 등)의 URL을 입력하세요. 
                피어몰이 자동으로 정보를 가져옵니다.
              </p>
            </div>
            
            <div className="border rounded-md p-4 bg-bg-100">
              <h3 className="font-medium mb-2">미리보기</h3>
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 bg-bg-200 rounded flex items-center justify-center text-text-300">
                  이미지
                </div>
                <div>
                  <p className="font-medium">가져온 콘텐츠 제목</p>
                  <p className="text-sm text-text-200">가져온 설명 내용의 일부...</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">메모 (선택사항)</label>
              <Textarea placeholder="이 콘텐츠에 대한 메모를 남겨보세요." />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setNewContentType('')}>
                뒤로
              </Button>
              <Button type="submit">외부 링크 가져오기</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <Input placeholder={`${newContentType} 제목`} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <Textarea placeholder={`${newContentType}에 대한 설명을 입력하세요.`} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">대표 이미지</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <div className="flex flex-col items-center">
                  <Plus className="h-8 w-8 text-text-200 mb-2" />
                  <p className="text-sm text-text-200">클릭하여 이미지 업로드</p>
                  <p className="text-xs text-text-300 mt-1">또는 파일을 여기에 끌어다 놓으세요</p>
                </div>
              </div>
            </div>
            
            {(newContentType === '상품' || newContentType === '서비스') && (
              <div>
                <label className="block text-sm font-medium mb-1">가격</label>
                <div className="relative">
                  <Input placeholder="가격을 입력하세요" required />
                  <span className="absolute right-3 top-2 text-text-200">원</span>
                </div>
              </div>
            )}
            
            {newContentType === '이벤트' && (
              <div>
                <label className="block text-sm font-medium mb-1">날짜 및 시간</label>
                <Input type="datetime-local" required />
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setNewContentType('')}>
                뒤로
              </Button>
              <Button type="submit">{newContentType} 등록하기</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
