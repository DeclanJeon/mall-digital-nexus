
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Heart, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostListProps {
  posts: any[];
  username: string;
  onEditPost: (post: any) => void;
  onDeletePost: (id: string | number) => void;
  onViewPostDetail: (post: any) => void;
  viewMode?: "list" | "grid";
}

const PostList: React.FC<PostListProps> = ({
  posts,
  username,
  onEditPost,
  onDeletePost,
  onViewPostDetail,
  viewMode = "list"
}) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">게시글이 없습니다</h3>
        <p className="text-sm text-gray-400">이 커뮤니티에 첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors hover-scale cursor-pointer"
            onClick={() => onViewPostDetail(post)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.authorAvatar} alt={post.author} />
                    <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-xs text-gray-400">{post.date}</div>
                  </div>
                </div>
                {username === post.author && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditPost(post); }}>
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (window.confirm('정말 삭제하시겠습니까?')) {
                            onDeletePost(post.id); 
                          }
                        }}
                        className="text-red-500"
                      >
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-300 line-clamp-2 text-sm">{post.content}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="flex space-x-3 text-sm">
                <div className="flex items-center text-gray-400">
                  <Eye className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 100) + 10}
                </div>
                <div className="flex items-center text-gray-400">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes}
                </div>
                <div className="flex items-center text-gray-400">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.comments}
                </div>
              </div>
              <div className="flex space-x-1">
                {post.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-600/20 text-blue-300">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => onViewPostDetail(post)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                  <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{post.author}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  {username === post.author && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditPost(post); }}>
                          수정하기
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (window.confirm('정말 삭제하시겠습니까?')) {
                              onDeletePost(post.id); 
                            }
                          }}
                          className="text-red-500"
                        >
                          삭제하기
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                <p className="text-gray-300 line-clamp-2">{post.content}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-600/20 text-blue-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex space-x-6 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Eye className="h-4 w-4 mr-1.5" />
                    {Math.floor(Math.random() * 100) + 10}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Heart className="h-4 w-4 mr-1.5" />
                    {post.likes}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    {post.comments}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
