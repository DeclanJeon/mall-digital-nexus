// src/components/community/PostForm.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PostFormProps } from '../types';

const PostForm: React.FC<PostFormProps> = ({
  form,
  onSubmit,
  onCancel,
  editingPost,
}) => {
  return (
    <Card className="bg-white/5 border-white/10 mb-6 overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle>{editingPost ? '게시글 수정' : '새 게시글 작성'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "제목을 입력해주세요." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목 입력" className="bg-white/10 border-white/20 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>태그 (쉼표로 구분)</FormLabel>
                  <FormControl>
                    <Input placeholder="예: react, typescript, 커뮤니티" className="bg-white/10 border-white/20 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              rules={{ required: "내용을 입력해주세요.", minLength: { value: 10, message: "내용은 최소 10자 이상 입력해주세요."} }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="내용 입력..."
                      className="min-h-[200px] bg-white/10 border-white/20 text-white resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent hover:bg-white/10">
                취소
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingPost ? '수정하기' : '게시하기'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostForm;