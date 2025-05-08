
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Star, ThumbsUp, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PostDetailProps {
  post: any;
  onBack: () => void;
  onEdit?: (post: any) => void;
  onDelete?: (id: string | number) => void;
  isAuthor?: boolean;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onBack,
  onEdit,
  onDelete,
  isAuthor = false,
}) => {
  const navigate = useNavigate();
  
  if (!post) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">게시글을 찾을 수 없습니다.</p>
          <Button variant="outline" className="mt-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <Button 
              variant="ghost" 
              className="mb-2 p-0 h-auto text-gray-500 hover:text-gray-800 flex items-center justify-start w-auto" 
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
            <CardTitle className="text-xl font-bold text-gray-800">{post.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {isAuthor && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-gray-600"
                onClick={() => onEdit && onEdit(post)}
              >
                수정
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 hover:bg-red-50" 
                onClick={() => onDelete && onDelete(post.id)}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.authorAvatar} alt={post.author} />
            <AvatarFallback>{post.author ? post.author[0].toUpperCase() : 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-800">{post.author}</p>
            <p className="text-xs text-gray-500">{post.date}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{post.views || 0}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="py-6">
        {post.htmlContent ? (
          <div 
            className="prose max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        ) : (
          <div className="whitespace-pre-line text-gray-800">{post.content}</div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 pb-6 border-t border-gray-100">
        <div className="w-full space-y-4">
          <Separator />
          <h3 className="font-medium text-gray-800">댓글 {post.comments || 0}개</h3>
          
          {/* 댓글 입력 폼 */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea 
                className="w-full p-3 h-24 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="댓글을 작성해주세요"
              />
              <div className="flex justify-end mt-2">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  댓글 작성
                </Button>
              </div>
            </div>
          </div>
          
          {/* 댓글 목록은 후속 기능으로 구현 예정 */}
          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostDetail;
