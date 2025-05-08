
import React, { useState, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import PostDetail from './PostDetail';

// Toast UI Editor imports
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

// Mock forum posts data
const MOCK_POSTS = [
  {
    id: 1,
    title: "피어몰 시작하기 위한 팁 공유합니다",
    author: "창업왕",
    category: "팁과 노하우",
    views: 1245,
    comments: 32,
    createdAt: "2025-04-10T14:30:00",
    pinned: true,
    content: "피어몰을 처음 시작하시는 분들을 위해 제가 알게 된 팁을 공유합니다.\n\n1. 먼저 타겟 고객층을 명확히 정의하세요.\n2. 판매하실 제품이나 서비스의 차별점을 명확히 해주세요.\n3. 소셜 미디어를 적극 활용하세요.\n4. 초기 고객들의 피드백을 적극 수용하세요.\n5. 꾸준히 콘텐츠를 업데이트하세요.",
    tags: ["초보자팁", "마케팅", "피어몰"]
  },
  {
    id: 2,
    title: "디지털 아트워크 판매 경험 공유해요",
    author: "디자이너K",
    category: "경험 공유",
    views: 823,
    comments: 17,
    createdAt: "2025-04-12T09:15:00",
    content: "안녕하세요, 디지털 아트 작가로 활동 중인 디자이너K입니다. 제가 피어몰에서 디지털 아트워크를 판매하며 겪은 경험을 공유합니다.\n\n처음에는 판매가 잘 되지 않았지만, 꾸준히 작품을 업로드하고 SNS에서 홍보한 결과 지금은 매달 안정적인 수익을 올리고 있습니다. 궁금한 점 있으시면 댓글로 남겨주세요!",
    tags: ["디지털아트", "경험담", "판매전략"]
  },
  {
    id: 3,
    title: "한국 고유 콘텐츠로 해외 진출 성공 사례",
    author: "글로벌셀러",
    category: "성공 사례",
    views: 954,
    comments: 28,
    createdAt: "2025-04-13T11:45:00",
    content: "한국의 전통문화를 재해석한 제품으로 해외 시장에 성공적으로 진출한 경험을 나눕니다. 특히 K-문화에 관심이 많은 북미 및 유럽 지역에서의 마케팅 전략과 현지화 과정에서 배운 점을 중심으로 이야기하겠습니다.",
    tags: ["해외진출", "K-콘텐츠", "글로벌마케팅"]
  },
  {
    id: 4,
    title: "첫 판매를 축하해주세요!",
    author: "신입몰러",
    category: "축하해요",
    views: 432,
    comments: 43,
    createdAt: "2025-04-14T08:20:00",
    content: "드디어 제 피어몰에서 첫 판매가 일어났습니다! 한 달 동안 준비하고 기다린 끝에 첫 고객이 생겼어요. 정말 기쁘고 더 열심히 해야겠다는 동기부여가 됩니다. 여러분의 첫 판매는 어땠나요?",
    tags: ["첫판매", "성취", "동기부여"]
  },
  {
    id: 5,
    title: "마케팅 전략 조언 부탁드립니다",
    author: "마케팅초보",
    category: "질문",
    views: 321,
    comments: 15,
    createdAt: "2025-04-14T10:05:00",
    content: "피어몰을 시작한지 2주가 되었는데 아직 방문자 수가 너무 적습니다. 효과적인 마케팅 전략이 있을까요? 소셜 미디어는 활용하고 있지만 큰 효과를 보지 못하고 있습니다. 도움 부탁드립니다!",
    tags: ["마케팅질문", "방문자유치", "홍보전략"]
  },
];

// Forum categories
const CATEGORIES = [
  "전체",
  "공지사항",
  "팁과 노하우",
  "경험 공유",
  "질문",
  "성공 사례",
  "축하해요",
];

const ForumList = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Reference to the Toast UI Editor
  const editorRef = useRef<any>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      category: '경험 공유',
      content: '',
      tags: '',
    },
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleCreatePost = () => {
    const formValues = form.getValues();
    const title = formValues.title;
    const category = formValues.category;
    const tagsString = formValues.tags;
    
    // Get content from editor
    let content = '';
    if (editorRef.current) {
      content = editorRef.current.getInstance().getMarkdown();
    }
    
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // Parse tags
    const tags = tagsString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const newPost = {
      id: posts.length + 1,
      title: title,
      author: "익명 사용자",
      category: category,
      views: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      content: content,
      tags: tags,
    };

    setPosts([newPost, ...posts]);
    form.reset();
    setShowNewPostDialog(false);
    toast.success("게시글이 작성되었습니다!");
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  const handleEditPost = (post) => {
    // 게시글 수정 기능 구현 예정
    toast.info("게시글 수정 기능은 개발 중입니다.");
  };

  const handleDeletePost = (postId) => {
    // 확인 후 삭제
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      setPosts(posts.filter(post => post.id !== postId));
      toast.success("게시글이 삭제되었습니다.");
      if (selectedPost) {
        setSelectedPost(null);
      }
    }
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => 
      (selectedCategory === "전체" || post.category === selectedCategory) &&
      (searchQuery === "" || 
       post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       post.author.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then sort by selected field
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 게시글 상세보기가 선택되었을 경우
  if (selectedPost) {
    return (
      <div className="space-y-6">
        <PostDetail 
          post={selectedPost} 
          onBack={handleBackToList}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          isAuthor={selectedPost.author === "익명 사용자"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <Input
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-400"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-2 items-center overflow-x-auto pb-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          {CATEGORIES.map((category) => (
            <Button 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-blue-600 text-white" : 
                "text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Create new post button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{selectedCategory === "전체" ? "모든 게시물" : selectedCategory}</h2>
        <Button onClick={() => setShowNewPostDialog(true)} className="bg-blue-600 text-white hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          새 게시글 작성
        </Button>
      </div>
      
      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">새 게시글 작성</DialogTitle>
            <DialogDescription className="text-gray-600">
              커뮤니티에 공유하고 싶은 내용을 작성해보세요.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-gray-800 font-medium">제목</label>
              <Input
                id="title"
                placeholder="게시글 제목"
                {...form.register('title', { required: true })}
                className="bg-white border-gray-300 text-gray-900"
              />
              {form.formState.errors.title && (
                <p className="text-red-600 text-sm">제목을 입력해주세요.</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="category" className="text-gray-800 font-medium">카테고리</label>
              <select
                id="category"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
                {...form.register('category')}
              >
                {CATEGORIES.filter(cat => cat !== "전체" && cat !== "공지사항").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="tags" className="text-gray-800 font-medium">태그 (쉼표로 구분)</label>
              <Input
                id="tags"
                placeholder="예: react, typescript, 커뮤니티"
                {...form.register('tags')}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="content" className="text-gray-800 font-medium">내용</label>
              <div className="min-h-[400px] border border-gray-300 rounded-md overflow-hidden">
                <Editor
                  ref={editorRef}
                  initialValue=""
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
                />
              </div>
              {form.formState.errors.content && (
                <p className="text-red-600 text-sm">내용을 입력해주세요.</p>
              )}
            </div>
          </form>
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewPostDialog(false)}
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              취소
            </Button>
            <Button 
              type="button" 
              onClick={handleCreatePost}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              작성 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Forum posts table */}
      <div className="border rounded-lg overflow-hidden border-gray-200 shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px] bg-gray-50 text-gray-700">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => handleSort("title")}
                >
                  제목
                  {sortField === "title" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell bg-gray-50 text-gray-700">카테고리</TableHead>
              <TableHead className="hidden md:table-cell bg-gray-50 text-gray-700">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => handleSort("author")}
                >
                  작성자
                  {sortField === "author" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell bg-gray-50 text-gray-700">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => handleSort("views")}
                >
                  조회수
                  {sortField === "views" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell bg-gray-50 text-gray-700">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => handleSort("comments")}
                >
                  댓글
                  {sortField === "comments" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-gray-700">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => handleSort("createdAt")}
                >
                  작성일
                  {sortField === "createdAt" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow 
                  key={post.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleViewPost(post)}
                >
                  <TableCell className="font-medium text-gray-800">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {post.pinned && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">공지</Badge>
                        )}
                        {post.title}
                      </div>
                      <div className="md:hidden flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>댓글 {post.comments}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-gray-700 border-gray-300 bg-gray-50">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-700">{post.views.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-gray-700">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                      {post.comments}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{formatDate(post.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  게시물이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ForumList;
