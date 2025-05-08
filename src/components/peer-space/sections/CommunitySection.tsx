import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Plus, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  isPrivate: boolean;
  likes: number;
  comments: number;
  tags: string[];
};

const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: '커뮤니티 이벤트 안내',
    content: '다음 주 토요일에 있을 커뮤니티 이벤트에 많은 참여 부탁드립니다.',
    author: '관리자',
    authorAvatar: '',
    date: '2025-05-07',
    isPrivate: false,
    likes: 12,
    comments: 5,
    tags: ['공지', '이벤트']
  },
  {
    id: 'post-2',
    title: '스터디 그룹 모집합니다',
    content: 'React와 TypeScript 스터디 그룹을 모집합니다. 관심있으신 분은 댓글 남겨주세요.',
    author: '스터디장',
    authorAvatar: '',
    date: '2025-05-06',
    isPrivate: false,
    likes: 8,
    comments: 7,
    tags: ['스터디', 'React', 'TypeScript']
  }
];

type DraftPost = {
  title: string;
  content?: string;
  tags: string | string[];
  author?: string;
  authorAvatar?: string;
};

const CommunitySection = () => {
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useLocalStorage<Post[]>('community_posts', initialPosts);
  const [draftPost, setDraftPost] = useLocalStorage<DraftPost | null>('draft_post', null);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const editorRef = React.useRef<any>(null);
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCreatePost = () => {
    if (editorRef.current && draftPost?.title) {
      const content = editorRef.current.getInstance().getMarkdown();
      
      // Process tags from string to array if needed
      let processedTags: string[] = [];
      if (typeof draftPost.tags === 'string') {
        processedTags = draftPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      } else {
        processedTags = draftPost.tags || [];
      }
      
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: draftPost.title || '',
        content: content,
        author: draftPost.author || '익명',
        authorAvatar: draftPost.authorAvatar || '',
        date: new Date().toISOString().split('T')[0],
        isPrivate: isPrivate,
        likes: 0,
        comments: 0,
        tags: processedTags
      };
      
      setPosts([newPost, ...posts]);
      setDraftPost(null);
      setShowNewPostForm(false);
    }
  };
  
  const handleDraft = () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getMarkdown();
      setDraftPost({
        ...draftPost || { title: '', tags: '' },
        content: content
      });
    }
  };
  
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-300 mb-6">커뮤니티</h2>
      
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <Input 
            placeholder="게시글 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-2.5">
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <Button onClick={() => {
          setShowNewPostForm(true);
          setDraftPost(draftPost || { title: '', tags: '' });
        }}>
          <Plus className="mr-1 h-4 w-4" /> 새 글쓰기
        </Button>
      </div>
      
      {showNewPostForm ? (
        <Card>
          <CardHeader>
            <CardTitle>새 글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="제목을 입력하세요"
                  value={draftPost?.title || ''}
                  onChange={(e) => setDraftPost({ ...draftPost || {}, title: e.target.value, tags: draftPost?.tags || '' })}
                />
              </div>
              <div>
                <Input
                  placeholder="태그를 쉼표로 구분하여 입력하세요"
                  value={typeof draftPost?.tags === 'string' ? draftPost.tags : (draftPost?.tags || []).join(', ')}
                  onChange={(e) => setDraftPost({ ...draftPost || {}, tags: e.target.value, title: draftPost?.title || '' })}
                />
              </div>
              <div className="min-h-[400px]">
                <Editor
                  initialValue={draftPost?.content || ''}
                  previewStyle="vertical"
                  height="400px"
                  initialEditType="markdown"
                  useCommandShortcut={true}
                  ref={editorRef}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsPrivate(!isPrivate)}>
                  {isPrivate ? <Lock className="mr-1 h-4 w-4" /> : null}
                  {isPrivate ? '비공개 글' : '공개 글'}
                </Button>
                <Badge variant="outline" className={isPrivate ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}>
                  {isPrivate ? '비공개' : '공개'}
                </Badge>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDraft}>임시 저장</Button>
                <Button variant="outline" onClick={() => {
                  setShowNewPostForm(false);
                }}>취소</Button>
                <Button onClick={handleCreatePost}>게시하기</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">전체 게시글</TabsTrigger>
            <TabsTrigger value="public">공개 게시글</TabsTrigger>
            <TabsTrigger value="private">비공개 게시글</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {filteredPosts.length > 0 ? filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar>
                          <AvatarImage src={post.authorAvatar} alt={post.author} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </div>
                      {post.isPrivate && (
                        <Badge variant="outline" className="bg-red-100 text-red-600">
                          <Lock className="mr-1 h-3 w-3" /> 비공개
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline"># {tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                      <Button variant="ghost" size="sm">자세히 보기</Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="p-8 text-center text-gray-500">
                  게시글이 없습니다.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="public">
            <div className="space-y-4">
              {filteredPosts.filter(post => !post.isPrivate).length > 0 ? 
                filteredPosts
                  .filter(post => !post.isPrivate)
                  .map(post => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        {/* Same render logic as above */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src={post.authorAvatar} alt={post.author} />
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{post.author}</p>
                              <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline"># {tag}</Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments}</span>
                          </div>
                          <Button variant="ghost" size="sm">자세히 보기</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : (
                  <div className="p-8 text-center text-gray-500">
                    공개 게시글이 없습니다.
                  </div>
                )
              }
            </div>
          </TabsContent>
          
          <TabsContent value="private">
            <div className="space-y-4">
              {filteredPosts.filter(post => post.isPrivate).length > 0 ? 
                filteredPosts
                  .filter(post => post.isPrivate)
                  .map(post => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        {/* Same render logic as above */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src={post.authorAvatar} alt={post.author} />
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{post.author}</p>
                              <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-600">
                            <Lock className="mr-1 h-3 w-3" /> 비공개
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline"># {tag}</Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments}</span>
                          </div>
                          <Button variant="ghost" size="sm">자세히 보기</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : (
                  <div className="p-8 text-center text-gray-500">
                    비공개 게시글이 없습니다.
                  </div>
                )
              }
            </div>
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
};

export default CommunitySection;
