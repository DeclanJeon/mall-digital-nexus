// src/components/community/PostItem.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Star, MessageSquare } from 'lucide-react';
import { PostItemProps } from '../types';

const PostItem: React.FC<PostItemProps> = ({
  post,
  isAuthor,
  onEditPost,
  onDeletePost,
  onViewPostDetail,
}) => {
  return (
    <Card className="bg-white/5 border-white/10 animate-fade-in overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar>
              <AvatarImage src={post.authorAvatar} alt={post.author} />
              <AvatarFallback>{post.author ? post.author[0].toUpperCase() : 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-xs text-gray-400">{post.date}</p>
            </div>
          </div>
          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEditPost(post)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1"
                aria-label="게시글 수정"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeletePost(post.id)}
                className="text-gray-400 hover:text-red-400 transition-colors p-1"
                aria-label="게시글 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2 hover:text-blue-300 cursor-pointer" onClick={() => onViewPostDetail(post)}>
            {post.title}
        </h3>
        {post.htmlContent ? (
          <div
            className="text-gray-300 mb-4 prose-sm prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        ) : (
          <p className="text-gray-300 mb-4 whitespace-pre-line break-words">{post.content}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-blue-300 border-blue-300/30">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-blue-300 transition-colors">
              <Star className="h-4 w-4" />
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-200" onClick={() => onViewPostDetail(post)}>
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;