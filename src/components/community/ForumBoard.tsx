
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  PlusCircle,
  Calendar,
  User,
  Clock,
  Eye,
  ThumbsUp,
  Tag,
  ArrowLeft
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
import { toast } from '@/hooks/use-toast';
import { Forum, ForumPost, Channel, Planet } from '@/types/forum';
import { 
  getForum, 
  getPostsByForum, 
  createPost, 
  updatePost, 
  deletePost,
  getPlanet,
} from '@/services/forumService';

interface ForumBoardProps {
  channelId: string;
  onBack: () => void;
}

const ForumBoard: React.FC<ForumBoardProps> = ({ channelId, onBack }) => {
  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [planet, setPlanet] = useState<Planet | null>(null);

  // New post state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Load forum data
  useEffect(() => {
    const loadForumData = async () => {
      try {
        setLoading(true);
        
        // Get forums for this channel
        const forumsByChannel = await import('@/services/forumService').then(
          module => module.getForumsByChannel(channelId)
        );
        
        if (forumsByChannel && forumsByChannel.length > 0) {
          const currentForum = forumsByChannel[0];
          setForum(currentForum);
          
          // Get planet info
          const planetInfo = await import('@/services/forumService').then(
            module => module.getPlanet(currentForum.planetId)
          );
          setPlanet(planetInfo || null);
          
          // Get posts for this forum
          const forumPosts = await import('@/services/forumService').then(
            module => module.getPostsByForum(currentForum.id)
          );
          setPosts(forumPosts);
        }
      } catch (error) {
        console.error("Error loading forum data:", error);
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "포럼 데이터를 불러오는데 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadForumData();
  }, [channelId]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
      });
      return;
    }
    
    if (!forum) return;
    
    try {
      // Get username from local storage or generate a random one
      const storedUsername = localStorage.getItem('peerspace_username') || '익명 사용자';
      
      // Process tags
      const tags = newPostTags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Create post
      await createPost({
        forumId: forum.id,
        title: newPostTitle,
        content: newPostContent,
        authorId: 'current-user',
        authorName: storedUsername,
        authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${storedUsername}`,
        isPinned: false,
        tags,
      });
      
      // Refresh posts
      const refreshedPosts = await getPostsByForum(forum.id);
      setPosts(refreshedPosts);
      
      // Reset form
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTags("");
      setIsCreateDialogOpen(false);
      
      toast({
        title: "게시글 작성 완료",
        description: "게시글이 성공적으로 등록되었습니다.",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "게시글 작성 실패",
        description: "게시글을 등록하는데 실패했습니다.",
      });
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => 
    searchQuery === "" || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    // Sort by pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by selected field
    if (sortDirection === "asc") {
      if (sortField === "commentCount" || sortField === "views" || sortField === "likes") {
        return a[sortField] - b[sortField];
      }
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      if (sortField === "commentCount" || sortField === "views" || sortField === "likes") {
        return b[sortField] - a[sortField];
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
          <p>포럼 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p>포럼을 찾을 수 없습니다.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-b from-gray-900/10 to-gray-900/5 p-6 rounded-xl">
      {/* Header with back button */}
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          돌아가기
        </Button>
        <h1 className="text-2xl font-bold flex-1">{forum.name}</h1>
      </div>

      {/* Description */}
      <div className="bg-gray-900/20 p-4 rounded-lg mb-6">
        <p className="text-gray-200">{forum.description}</p>
        {planet && (
          <div className="mt-2 flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: planet.color }}
            ></div>
            <span className="text-sm text-gray-300">{planet.name}</span>
          </div>
        )}
      </div>
      
      {/* Search and controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Input
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900/30 border-gray-700 text-gray-100"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              새 게시글 작성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-gray-100">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
              <DialogDescription className="text-gray-400">
                커뮤니티에 공유하고 싶은 내용을 작성해보세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-gray-300">제목</label>
                <Input
                  id="title"
                  placeholder="게시글 제목"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-gray-300">내용</label>
                <Textarea
                  id="content"
                  placeholder="게시글 내용"
                  rows={8}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="tags" className="text-gray-300">태그 (쉼표로 구분)</label>
                <Input
                  id="tags"
                  placeholder="태그1, 태그2, 태그3"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-gray-700 text-gray-300"
              >
                취소
              </Button>
              <Button 
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                게시글 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Forum stats */}
      <div className="flex justify-between items-center bg-gray-900/30 p-3 rounded-lg text-sm text-gray-300">
        <div>총 게시글: {posts.length}개</div>
      </div>
      
      {/* Posts table */}
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <Table className="bg-gray-900/20">
          <TableHeader className="bg-gray-900/40">
            <TableRow className="hover:bg-gray-900/30 border-gray-700">
              <TableHead className="w-[400px] text-gray-300">
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
              <TableHead className="hidden md:table-cell text-gray-300">작성자</TableHead>
              <TableHead className="hidden md:table-cell text-gray-300">
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
              <TableHead className="hidden md:table-cell text-gray-300">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => handleSort("commentCount")}
                >
                  댓글
                  {sortField === "commentCount" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-gray-300">
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
                <TableRow key={post.id} className="hover:bg-gray-900/40 border-gray-700">
                  <TableCell className="font-medium text-gray-100">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <Badge className="bg-purple-700">공지</Badge>
                        )}
                        <span>{post.title}</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs px-1.5 py-0 border-gray-700 text-gray-300"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="md:hidden flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>{post.authorName}</span>
                        <span>•</span>
                        <span>댓글 {post.commentCount}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700">
                        {post.authorAvatar && (
                          <img src={post.authorAvatar} alt={post.authorName} />
                        )}
                      </div>
                      {post.authorName}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-gray-400" />
                      {post.views}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-gray-400" />
                      {post.commentCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{formatDate(post.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                  게시물이 없습니다. 첫 번째 게시글을 작성해보세요!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination (simple version) */}
      {filteredPosts.length > 10 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" className="mx-1 border-gray-700 text-gray-300">1</Button>
          <Button variant="ghost" size="sm" className="mx-1 text-gray-400">2</Button>
          <Button variant="ghost" size="sm" className="mx-1 text-gray-400">3</Button>
          <span className="mx-2 text-gray-500 self-center">...</span>
          <Button variant="ghost" size="sm" className="mx-1 text-gray-400">다음</Button>
        </div>
      )}
    </div>
  );
};

export default ForumBoard;
