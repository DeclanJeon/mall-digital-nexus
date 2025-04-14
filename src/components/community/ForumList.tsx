
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

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
    pinned: true
  },
  {
    id: 2,
    title: "디지털 아트워크 판매 경험 공유해요",
    author: "디자이너K",
    category: "경험 공유",
    views: 823,
    comments: 17,
    createdAt: "2025-04-12T09:15:00"
  },
  {
    id: 3,
    title: "한국 고유 콘텐츠로 해외 진출 성공 사례",
    author: "글로벌셀러",
    category: "성공 사례",
    views: 954,
    comments: 28,
    createdAt: "2025-04-13T11:45:00"
  },
  {
    id: 4,
    title: "첫 판매를 축하해주세요!",
    author: "신입몰러",
    category: "축하해요",
    views: 432,
    comments: 43,
    createdAt: "2025-04-14T08:20:00"
  },
  {
    id: 5,
    title: "마케팅 전략 조언 부탁드립니다",
    author: "마케팅초보",
    category: "질문",
    views: 321,
    comments: 15,
    createdAt: "2025-04-14T10:05:00"
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
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("경험 공유");

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    const newPost = {
      id: posts.length + 1,
      title: newPostTitle,
      author: "익명 사용자",
      category: newPostCategory,
      views: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    toast.success("게시글이 작성되었습니다!");
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

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <Input
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex gap-2 items-center overflow-x-auto pb-2 w-full md:w-auto">
          <Filter className="h-4 w-4" />
          {CATEGORIES.map((category) => (
            <Button 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Create new post button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{selectedCategory === "전체" ? "모든 게시물" : selectedCategory}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              새 게시글 작성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
              <DialogDescription>
                커뮤니티에 공유하고 싶은 내용을 작성해보세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">제목</label>
                <Input
                  id="title"
                  placeholder="게시글 제목"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category">카테고리</label>
                <select
                  id="category"
                  className="rounded-md border border-input bg-background px-3 py-2"
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                >
                  {CATEGORIES.filter(cat => cat !== "전체" && cat !== "공지사항").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="content">내용</label>
                <Textarea
                  id="content"
                  placeholder="게시글 내용"
                  rows={8}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreatePost}>작성 완료</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Forum posts table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">
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
              <TableHead className="hidden md:table-cell">카테고리</TableHead>
              <TableHead className="hidden md:table-cell">
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
              <TableHead className="hidden md:table-cell">
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
              <TableHead className="hidden md:table-cell">
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
              <TableHead>
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
                <TableRow key={post.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {post.pinned && (
                          <Badge variant="secondary">공지</Badge>
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
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.views.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      {post.comments}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
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
