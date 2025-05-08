import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Content, ContentType } from '../types';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "제목은 최소 2글자 이상이어야 합니다.",
  }),
  description: z.string().min(10, {
    message: "설명은 최소 10글자 이상이어야 합니다.",
  }),
  imageUrl: z.string().url({
    message: "유효한 URL을 입력해주세요.",
  }),
  type: z.enum(['product', 'service', 'event', 'review', 'quest', 'portfolio', 'course', 'stream', 'livestream', 'advertisement', 'guestbook', 'workshop', 'challenge', 'tool', 'external']),
  price: z.string().optional(),
  isExternal: z.boolean().default(false),
  externalUrl: z.string().url({
    message: "유효한 외부 URL을 입력해주세요.",
  }).optional(),
})

const typeOptions = [
  { value: 'product', label: '상품' },
  { value: 'service', label: '서비스' },
  { value: 'event', label: '이벤트' },
  { value: 'review', label: '리뷰' },
  { value: 'quest', label: '퀘스트' },
  { value: 'portfolio', label: '포트폴리오' },
  { value: 'course', label: '코스' },
  { value: 'stream', label: '스트림' },
  { value: 'livestream', label: '라이브 스트림' },
  { value: 'advertisement', label: '광고' },
  { value: 'guestbook', label: '방명록' },
  { value: 'workshop', label: '워크샵' },
  { value: 'challenge', label: '챌린지' },
  { value: 'tool', label: '도구' },
  { value: 'external', label: '외부 링크' },
] as const;

interface ProductRegistrationFormProps {
  onSubmit: (values: Content) => void;
}

const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: '',
      type: 'product',
      price: '',
      isExternal: false,
      externalUrl: '',
    },
  })

  const [isExternal, setIsExternal] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => {
        const newContent: Content = {
          id: Date.now().toString(),
          peerSpaceAddress: 'your_peer_space_address',
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          type: values.type as ContentType,
          date: new Date().toISOString(),
          price: values.price,
          isExternal: values.isExternal,
          externalUrl: values.externalUrl,
          likes: 0,
          comments: 0,
          views: 0,
          saves: 0,
        };
        onSubmit(newContent);
      })} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="제품 제목을 입력하세요" {...field} />
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
                <Textarea
                  placeholder="제품에 대한 설명을 입력하세요"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이미지 URL</FormLabel>
              <FormControl>
                <Input placeholder="이미지 URL을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>유형</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="콘텐츠 유형을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
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
              <FormLabel>가격 (선택 사항)</FormLabel>
              <FormControl>
                <Input placeholder="가격을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isExternal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">외부 컨텐츠</FormLabel>
                <FormDescription>
                  외부 링크를 통해 제공되는 컨텐츠인 경우 선택하세요.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={isExternal} onCheckedChange={(checked) => {
                  setIsExternal(checked);
                  field.onChange(checked);
                }} />
              </FormControl>
            </FormItem>
          )}
        />
        {isExternal && (
          <FormField
            control={form.control}
            name="externalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>외부 URL</FormLabel>
                <FormControl>
                  <Input placeholder="외부 URL을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">등록하기</Button>
      </form>
    </Form>
  );
};

export default ProductRegistrationForm;
