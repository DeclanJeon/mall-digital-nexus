
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Content, ContentType } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';

// Validation schema for content editing
const contentSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요' }),
  description: z.string().min(1, { message: '설명을 입력해주세요' }),
  imageUrl: z.string().url({ message: '올바른 이미지 URL을 입력해주세요' }),
  type: z.enum([
    'portfolio', 'service', 'product', 'event', 'post', 
    'review', 'quest', 'advertisement', 'stream', 'guestbook',
    'course', 'workshop', 'challenge', 'tool'
  ]),
  price: z.string().optional(),
  externalUrl: z.string().url({ message: '올바른 URL을 입력해주세요' }).optional().or(z.literal('')),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentEditFormProps {
  initialContent: Content;
  onSubmit: (content: Content) => void;
}

const ContentEditForm: React.FC<ContentEditFormProps> = ({ initialContent, onSubmit }) => {
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialContent.title,
      description: initialContent.description,
      imageUrl: initialContent.imageUrl,
      type: initialContent.type,
      price: initialContent.price || '',
      externalUrl: initialContent.externalUrl || '',
    },
  });

  const handleFormSubmit = (values: ContentFormValues) => {
    const updatedContent: Content = {
      ...initialContent,
      ...values,
      // Maintain other properties that might not be in the form
      date: initialContent.date,
      likes: initialContent.likes,
      comments: initialContent.comments,
      saves: initialContent.saves,
      views: initialContent.views,
    };
    
    onSubmit(updatedContent);
  };

  const contentTypeOptions = [
    { value: 'portfolio', label: '포트폴리오' },
    { value: 'service', label: '서비스' },
    { value: 'product', label: '상품' },
    { value: 'event', label: '이벤트' },
    { value: 'post', label: '게시글' },
    { value: 'review', label: '리뷰' },
    { value: 'quest', label: '퀘스트' },
    { value: 'advertisement', label: '광고' },
    { value: 'stream', label: '스트림' },
    { value: 'guestbook', label: '방명록' },
    { value: 'course', label: '코스' },
    { value: 'workshop', label: '워크샵' },
    { value: 'challenge', label: '챌린지' },
    { value: 'tool', label: '도구' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>콘텐츠 유형</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>가격 (선택사항)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예: ₩30,000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이미지 URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="externalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>외부 URL (선택사항)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            저장하기
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentEditForm;
