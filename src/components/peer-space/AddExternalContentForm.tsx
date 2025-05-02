
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Content, ContentType } from './types';

interface ExternalPreview {
  title: string;
  description: string;
  imageUrl: string;
  price?: number;
  type?: ContentType;
  isExternal: boolean;
  externalUrl: string;
  source?: string;
}

interface AddExternalContentFormProps {
  onBack: () => void;
  onSubmit: (content: Partial<Content>) => void;
}

export const AddExternalContentForm = ({ onBack, onSubmit }: AddExternalContentFormProps) => {
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const [externalPreview, setExternalPreview] = useState<ExternalPreview | null>(null);
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFetchExternalPreview = async () => {
    if (!externalUrlInput) return;
    
    setIsLoading(true);
    toast({ title: '외부 정보 가져오는 중...', description: externalUrlInput });
    
    try {
      // Simulate API call to fetch preview data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyze URL to determine content type (in a real app, this would come from an API)
      let contentType: ContentType = 'post';
      
      if (externalUrlInput.includes('review') || externalUrlInput.includes('youtube')) {
        contentType = 'review';
      } else if (externalUrlInput.includes('store') || externalUrlInput.includes('product')) {
        contentType = 'product';
      }
      
      setExternalPreview({
        title: '가져온 콘텐츠 제목 (자동)',
        description: '외부 페이지 설명...',
        imageUrl: 'https://via.placeholder.com/150/d4eaf7/3b3c3d?text=Preview',
        price: contentType === 'product' ? 50000 : undefined,
        type: contentType,
        isExternal: true,
        externalUrl: externalUrlInput,
        source: new URL(externalUrlInput).hostname
      });
      
      toast({ title: '미리보기 로드 완료!' });
    } catch (error) {
      console.error('Error fetching preview:', error);
      toast({ 
        title: '미리보기 로드 실패', 
        description: 'URL을 확인하거나 다시 시도해 주세요.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExternalContent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!externalPreview) return;
    
    // Create a partial content object with default values for missing required fields
    const contentWithMemo: Partial<Content> = {
      ...externalPreview,
      description: memo || externalPreview.description,
      // Add default values for required fields in Content interface
      peerSpaceAddress: 'external',
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      saves: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSubmit(contentWithMemo);
  };

  return (
    <form onSubmit={handleAddExternalContent} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">외부 링크 URL</label>
        <div className="flex gap-2">
          <Input 
            placeholder="https://..." 
            required 
            value={externalUrlInput} 
            onChange={(e) => setExternalUrlInput(e.target.value)}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleFetchExternalPreview} 
            disabled={!externalUrlInput || isLoading}
          >
            {isLoading ? '로딩중...' : '미리보기'}
          </Button>
        </div>
        <p className="text-xs text-text-200 mt-1">
          제품, 블로그 글, 리뷰, 유튜브 영상 등의 링크를 입력하세요.
        </p>
      </div>
      
      {externalPreview && (
        <div className="border rounded-md p-4 bg-bg-100 space-y-3 animate-fade-in"> 
          <h3 className="font-medium mb-2">미리보기</h3> 
          <div className="flex items-center space-x-4"> 
            {externalPreview.imageUrl && (
              <img 
                src={externalPreview.imageUrl} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded" 
              />
            )}
            <div className="flex-1"> 
              <p className="font-semibold">{externalPreview.title}</p> 
              <p className="text-sm text-text-200 line-clamp-2">{externalPreview.description}</p> 
              {externalPreview.price && (
                <p className="text-sm font-bold mt-1">{externalPreview.price}</p>
              )}
              {externalPreview.source && (
                <p className="text-xs text-gray-500 mt-1">출처: {externalPreview.source}</p>
              )}
            </div> 
            <Badge variant="outline">{externalPreview.type || '콘텐츠'}</Badge> 
          </div> 
          <Textarea 
            placeholder="이 링크에 대한 메모 (선택사항)" 
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          /> 
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>뒤로</Button>
        <Button type="submit" disabled={!externalPreview}>
          MyMall에 추가
        </Button>
      </div>
    </form>
  );
};

export default AddExternalContentForm;
