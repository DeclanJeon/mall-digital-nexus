import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search, 
  ThumbsUp, 
  MessageSquare, 
  Eye,
  QrCode,
  Link as LinkIcon,
  Users,
  X,
} from "lucide-react";
import { Post, Channel } from '@/types/post';
import { Skeleton } from "@/components/ui/skeleton";

interface PostDisplayProps {
  posts: Post[];
  viewMode: "list" | "grid" | "compact";
  isLoading: boolean;
  searchQuery: string;
  channels: Channel[];
  onPostClick: (post: Post) => void;
  handleShowQRCode: (e: React.MouseEvent, post: Post) => void;
  getPostUrl: (post: Post) => string;
  setSearchQuery: (query: string) => void;
}

const PostDisplay: React.FC<PostDisplayProps> = ({
  posts,
  viewMode,
  isLoading,
  searchQuery,
  channels,
  onPostClick,
  handleShowQRCode,
  getPostUrl,
  setSearchQuery,
}) => {
  
  const getChannelInfo = (channelId: string) => {
    return channels.find(c => c.id === channelId);
  };

  if (isLoading) {
    return (
      <div className="flex-grow overflow-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex gap-1 mb-3">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'compact' ? (
          <div className="space-y-1">
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 border-b">
                <div className="flex items-center gap-3 flex-grow">
                  <Skeleton className="h-5 w-3/5" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className="border rounded-lg p-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-4/5 mb-4" />
                <div className="flex gap-1 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">검색 결과가 없습니다.</p>
          <p className="text-sm mt-2">다른 검색어나 필터 옵션을 시도해보세요.</p>
          {searchQuery && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 mr-2" />
              검색 초기화
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-auto p-6">
      {searchQuery.trim() && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{posts.length}개</span>의 검색 결과: 
            <span className="ml-1 font-medium text-indigo-600">"{searchQuery}"</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSearchQuery("")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            검색 초기화
          </Button>
        </div>
      )}
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`overflow-hidden cursor-pointer transition-all h-full flex flex-col 
                  ${post.isNotice ? 'border-l-4 border-l-yellow-400' : ''}`}
                onClick={() => onPostClick(post)}
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center text-sm font-medium text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-gray-50 text-xs">
                        {post.date}
                      </Badge>
                      {post.isNotice && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
                          공지
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-600 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <ThumbsUp className={`h-3 w-3 mr-1 ${post.likes > 0 ? 'text-blue-500' : ''}`} /> 
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className={`h-3 w-3 mr-1 ${post.comments > 0 ? 'text-green-500' : ''}`} /> 
                        {post.comments}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> 
                        {post.viewCount || 0}
                      </div>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => handleShowQRCode(e, post)}
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>QR 코드로 공유</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : viewMode === 'compact' ? (
        <div className="space-y-1 border rounded-lg overflow-hidden">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-between py-2 px-3 border-b hover:bg-gray-50 cursor-pointer ${
                post.isNotice ? 'bg-yellow-50 hover:bg-yellow-100' : ''
              }`}
              onClick={() => onPostClick(post)}
            >
              <div className="flex items-center gap-3 flex-grow overflow-hidden">
                {post.isNotice && <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs whitespace-nowrap">공지</Badge>}
                <span className="text-xs" style={{ color: getChannelInfo(post.channelId)?.color }}>
                  {getChannelInfo(post.channelId)?.icon || '📄'}
                </span>
                <span className="font-medium text-gray-800 truncate">{post.title}</span>
                {post.comments > 0 && <span className="text-xs text-indigo-500 font-semibold whitespace-nowrap">[{post.comments}]</span>}
                {post.date === new Date().toISOString().split('T')[0] && (
                  <Badge className="bg-indigo-500 text-white text-xs whitespace-nowrap">NEW</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                <span className="hidden sm:inline">{post.author}</span>
                <span>{post.date}</span>
                <div className="flex items-center">
                  <ThumbsUp className={`h-3 w-3 mr-1 ${post.likes > 0 ? 'text-blue-500' : ''}`} /> 
                  {post.likes}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -2, boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  post.isNotice ? 'border-l-4 border-l-yellow-400' : ''
                }`}
                onClick={() => onPostClick(post)}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className="hidden sm:flex"
                        style={{ 
                          backgroundColor: `${getChannelInfo(post.channelId)?.color}20`, 
                          color: getChannelInfo(post.channelId)?.color
                        }}
                      >
                        <span className="mr-1">
                          {getChannelInfo(post.channelId)?.icon}
                        </span>
                        {getChannelInfo(post.channelId)?.name}
                      </Badge>
                      
                      <h3 className="font-bold text-lg text-gray-800 break-all">
                        {post.title}
                      </h3>
                      
                      {post.date === new Date().toISOString().split('T')[0] && (
                        <Badge className="bg-indigo-500 text-white">NEW</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                      {post.isNotice && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                          공지
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-gray-50">
                        {post.date}
                      </Badge>
                      <span className="font-medium flex items-center">
                        <Users className="h-3 w-3 mr-1 text-gray-400" />
                        {post.author}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUp className={`h-4 w-4 mr-1 ${post.likes > 0 ? 'text-blue-500' : ''}`} /> 
                        <span className="text-sm">{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className={`h-4 w-4 mr-1 ${post.comments > 0 ? 'text-green-500' : ''}`} /> 
                        <span className="text-sm">{post.comments}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" /> 
                        <span className="text-sm">{post.viewCount || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(getPostUrl(post));
                                // toast는 PostDisplay 외부에서 관리되므로, 여기서는 직접 호출하지 않습니다.
                                // 대신, 상위 컴포넌트에서 전달받은 콜백을 사용해야 합니다.
                                // 현재는 직접 navigator.clipboard를 사용하고, toast는 PostDisplay 외부에서 처리하도록 합니다.
                              }}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>링크 복사</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleShowQRCode(e, post)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>QR 코드 보기</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDisplay;
