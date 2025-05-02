
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType } from './types';

// Define ContentFormValues type
export interface ContentFormValues {
  title: string;
  description: string;
  type: ContentType;
  imageUrl?: string;
  price?: number;
  status?: string;
  tags?: string[];
  category?: string;
  isExternal?: boolean;
  externalUrl?: string;
}

interface ContentEditFormProps {
  initialValues?: Partial<Content>;
  onSubmit: (values: ContentFormValues) => void;
  onCancel: () => void;
}

export const ContentEditForm: React.FC<ContentEditFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState<ContentFormValues>({
    title: initialValues.title || '',
    description: initialValues.description || '',
    type: initialValues.type || 'post',
    imageUrl: initialValues.imageUrl || '',
    price: initialValues.price || 0,
    status: initialValues.status || 'draft',
    tags: initialValues.tags || [],
    category: initialValues.category || '',
    isExternal: initialValues.isExternal || false,
    externalUrl: initialValues.externalUrl || '',
  });

  const handleChange = (field: keyof ContentFormValues, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValues.title || !formValues.description) {
      toast({
        title: "입력 오류",
        description: "제목과 설명은 필수 입력사항입니다.",
        variant: "destructive",
      });
      return;
    }

    // Convert price to number
    const finalValues = {
      ...formValues,
      price: formValues.price ? Number(formValues.price) : undefined,
    };

    onSubmit(finalValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={formValues.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="콘텐츠 제목"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formValues.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="콘텐츠 설명"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">콘텐츠 유형</Label>
          <Select
            value={formValues.type}
            onValueChange={(value) => handleChange('type', value as ContentType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="콘텐츠 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">상품</SelectItem>
              <SelectItem value="portfolio">포트폴리오</SelectItem>
              <SelectItem value="service">서비스</SelectItem>
              <SelectItem value="event">이벤트</SelectItem>
              <SelectItem value="post">게시글</SelectItem>
              <SelectItem value="review">리뷰</SelectItem>
              <SelectItem value="quest">퀘스트</SelectItem>
              <SelectItem value="advertisement">광고</SelectItem>
              <SelectItem value="stream">스트림</SelectItem>
              <SelectItem value="guestbook">방명록</SelectItem>
              <SelectItem value="course">강의</SelectItem>
              <SelectItem value="workshop">워크숍</SelectItem>
              <SelectItem value="challenge">챌린지</SelectItem>
              <SelectItem value="tool">도구</SelectItem>
              <SelectItem value="external">외부</SelectItem>
              <SelectItem value="livestream">라이브</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">카테고리</Label>
          <Input
            id="category"
            value={formValues.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="카테고리"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">이미지 URL</Label>
        <Input
          id="imageUrl"
          value={formValues.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="이미지 URL"
        />
        {formValues.imageUrl && (
          <div className="mt-2">
            <img src={formValues.imageUrl} alt="미리보기" className="w-40 h-40 object-cover rounded-md" />
          </div>
        )}
      </div>

      {(formValues.type === 'product' || formValues.type === 'service') && (
        <div>
          <Label htmlFor="price">가격</Label>
          <Input
            id="price"
            type="number"
            value={formValues.price || ''}
            onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : '')}
            placeholder="가격"
          />
        </div>
      )}

      <div>
        <Label htmlFor="tags">태그</Label>
        <Input
          id="tags"
          value={(formValues.tags || []).join(', ')}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
          placeholder="쉼표로 구분된 태그"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isExternal"
          checked={formValues.isExternal || false}
          onCheckedChange={(checked) => handleChange('isExternal', checked)}
        />
        <Label htmlFor="isExternal">외부 콘텐츠</Label>
      </div>

      {formValues.isExternal && (
        <div>
          <Label htmlFor="externalUrl">외부 URL</Label>
          <Input
            id="externalUrl"
            value={formValues.externalUrl || ''}
            onChange={(e) => handleChange('externalUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
};

export default ContentEditForm;
