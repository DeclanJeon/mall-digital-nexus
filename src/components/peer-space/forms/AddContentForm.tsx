
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ContentType } from "@/components/peer-space/types";

const contentTypes: { value: ContentType; label: string }[] = [
  { value: "product", label: "상품" },
  { value: "portfolio", label: "포트폴리오" },
  { value: "service", label: "서비스" },
  { value: "post", label: "게시글" },
  { value: "event", label: "이벤트" },
];

const formSchema = z.object({
  title: z.string().min(2, { message: "제목은 2글자 이상이어야 합니다" }).max(100),
  description: z.string().min(5, { message: "설명은 5글자 이상이어야 합니다" }).max(500),
  type: z.enum(["portfolio", "service", "product", "event", "post", "review", "quest",
    "advertisement", "stream", "guestbook", "course", "workshop", "challenge", "tool"]),
  price: z.string().optional(),
  imageUrl: z.string().url({ message: "유효한 URL을 입력해주세요." }).optional().default("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"),
  externalUrl: z.string().url({ message: "유효한 URL을 입력해주세요." }).optional(),
  tags: z.string().optional(), // 예: "태그1, 태그2, 태그3"
  category: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof formSchema>;

interface AddContentFormProps {
  onSubmit: (values: ContentFormValues) => void;
  onCancel?: () => void; // Make onCancel optional
}

export default function AddContentForm({ onSubmit, onCancel }: AddContentFormProps) {
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "product",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
      externalUrl: "",
      tags: "",
      category: "",
    },
  });

  const handleSubmit = (values: ContentFormValues) => {
    onSubmit(values);
    form.reset();
    toast({
      title: "콘텐츠 등록 완료",
      description: `${values.title} 콘텐츠가 등록되었습니다.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="콘텐츠 제목을 입력하세요" {...field} />
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
              <FormLabel>콘텐츠 유형</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="콘텐츠 유형 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="콘텐츠에 대한 설명을 입력하세요" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
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
                <Input placeholder="예: 15,000원" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
          )}
          <Button type="submit">콘텐츠 등록</Button>
        </div>
      </form>
    </Form>
  );

  // Add new form fields for externalUrl, tags, category
  // These fields are optional based on the schema.
  // You can add them similarly to how 'price' is handled if they need UI inputs.
  // For now, schema is updated, UI part for these new fields is not added in this diff.
  // Example for tags (if you want a text input for comma-separated tags):
  // <FormField
  //   control={form.control}
  //   name="tags"
  //   render={({ field }) => (
  //     <FormItem>
  //       <FormLabel>태그 (쉼표로 구분)</FormLabel>
  //       <FormControl>
  //         <Input placeholder="예: 프로그래밍, 디자인, AI" {...field} />
  //       </FormControl>
  //       <FormMessage />
  //     </FormItem>
  //   )}
  // />
}
