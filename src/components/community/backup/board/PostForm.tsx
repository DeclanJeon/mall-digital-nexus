
// src/components/community/board/PostForm.tsx
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PostFormProps } from '../types';
import { toast } from 'sonner';

// Toast UI Editor imports
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

const PostForm: React.FC<PostFormProps> = ({
  form,
  onSubmit,
  onCancel,
  editingPost,
}) => {
  // Reference to the Toast UI Editor
  const editorRef = useRef<any>(null);
  
  // Get content from editor when submitting
  const handleSubmit = (data: any) => {
    if (editorRef.current) {
      // Get the editor's content before submitting
      const editorContent = editorRef.current.getInstance().getMarkdown();
      // Update the form data with the editor content
      data.content = editorContent;
    }
    onSubmit(data);
  };
  
  // Set editor content when editing a post
  useEffect(() => {
    if (editingPost && editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.setMarkdown(editingPost.content || '');
    }
  }, [editingPost, editorRef]);
  
  return (
    <Card className="bg-white border border-gray-200 mb-6 overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="text-gray-900">{editingPost ? '게시글 수정' : '새 게시글 작성'}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "제목을 입력해주세요." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">제목</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="제목 입력" 
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">태그 (쉼표로 구분)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="예: react, typescript, 커뮤니티" 
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              rules={{ required: "내용을 입력해주세요." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">내용</FormLabel>
                  <FormControl>
                    <div className="min-h-[400px] border border-gray-300 rounded-md overflow-hidden">
                      <Editor
                        ref={editorRef}
                        initialValue={field.value || ''}
                        previewStyle="tab"
                        height="400px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        toolbarItems={[
                          ['heading', 'bold', 'italic', 'strike'],
                          ['hr', 'quote', 'ul', 'ol', 'task', 'indent', 'outdent'],
                          ['table', 'image', 'link'],
                          ['code', 'codeblock'],
                        ]}
                        hooks={{
                          change: () => {
                            if (editorRef.current) {
                              const editorContent = editorRef.current.getInstance().getMarkdown();
                              field.onChange(editorContent);
                            }
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100">
                취소
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
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
