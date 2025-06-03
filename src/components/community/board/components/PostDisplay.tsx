import React, { useCallback, useState, useEffect } from 'react';
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
  Play,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  Globe,
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

// 🔥 미디어 타입 감지 함수
const detectMediaType = (url: string) => {
  if (!url) return 'text';
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)$/i;
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|wmv|flv|m4v)$/i;
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
  const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const instagramRegex = /(?:instagram\.com\/p\/)([A-Za-z0-9_-]+)/;
  
  if (imageExtensions.test(url)) return 'image';
  if (videoExtensions.test(url)) return 'video';
  if (youtubeRegex.test(url)) return 'youtube';
  if (vimeoRegex.test(url)) return 'vimeo';
  if (twitterRegex.test(url)) return 'twitter';
  if (instagramRegex.test(url)) return 'instagram';
  if (url.startsWith('http')) return 'link';
  
  return 'text';
};

// 🔥 URL에서 미디어 콘텐츠 추출
const extractMediaFromContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlRegex) || [];
  
  return urls.map(url => ({
    url,
    type: detectMediaType(url)
  }));
};

// 🔥 YouTube ID 추출
const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

// 🔥 Vimeo ID 추출
const extractVimeoId = (url: string) => {
  const match = url.match(/(?:vimeo\.com\/)([0-9]+)/);
  return match ? match[1] : null;
};

// 🔥 링크에서 썸네일 추출 함수
const extractThumbnailFromUrl = (url: string): string | null => {
  // YouTube 썸네일
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  
  // Vimeo 썸네일 (실제로는 API 호출 필요)
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return `https://vumbnail.com/${vimeoId}.jpg`;
  }
  
  // Twitter/X 썸네일 (실제로는 OpenGraph 파싱 필요)
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png';
  }
  
  // Instagram 썸네일
  if (url.includes('instagram.com')) {
    return 'https://static.cdninstagram.com/rsrc.php/v3/yz/r/VsNE-OHk_8a.png';
  }
  
  return null;
};

// 🔥 게시글에서 대표 이미지 추출 함수
const getRepresentativeImage = (post: Post): string | null => {
  const contentMedia = extractMediaFromContent(post.content);
  const richContentMedia = post.richContent ? extractMediaFromContent(post.richContent) : [];
  const allMedia = [...contentMedia, ...richContentMedia];
  
  // 1순위: 링크에서 썸네일 추출
  for (const media of allMedia) {
    if (media.type === 'link' || media.type === 'youtube' || media.type === 'vimeo' || media.type === 'twitter' || media.type === 'instagram') {
      const thumbnail = extractThumbnailFromUrl(media.url);
      if (thumbnail) return thumbnail;
    }
  }
  
  // 2순위: 직접 이미지 URL
  const imageMedia = allMedia.find(media => media.type === 'image');
  if (imageMedia) return imageMedia.url;
  
  // 3순위: 비디오 썸네일 (YouTube 등)
  const videoMedia = allMedia.find(media => media.type === 'youtube' || media.type === 'vimeo');
  if (videoMedia) {
    const thumbnail = extractThumbnailFromUrl(videoMedia.url);
    if (thumbnail) return thumbnail;
  }
  
  return null;
};

// 🔥 미디어 통계 계산 함수
const getMediaStats = (media: any[]) => {
  const imageCount = media.filter(m => m.type === 'image').length;
  const videoCount = media.filter(m => m.type === 'video' || m.type === 'youtube' || m.type === 'vimeo').length;
  const linkCount = media.filter(m => m.type === 'link').length;
  
  return { imageCount, videoCount, linkCount };
};

// 🔥 링크 미리보기 컴포넌트 (개선된 버전)
const LinkPreview: React.FC<{ url: string }> = ({ url }) => {
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    
    // 실제 환경에서는 OpenGraph 파싱 API 사용
    // 여기서는 도메인별 더미 데이터 생성
    setTimeout(() => {
      const domain = new URL(url).hostname;
      const thumbnail = extractThumbnailFromUrl(url);
      
      setPreview({
        title: `${domain}의 콘텐츠`,
        description: "이 링크의 미리보기입니다. 실제 환경에서는 OpenGraph 메타 태그를 파싱하여 정확한 정보를 표시합니다.",
        image: thumbnail || `https://via.placeholder.com/400x200?text=${encodeURIComponent(domain)}`,
        domain: domain
      });
      setLoading(false);
    }, 500);
  }, [url]);
  
  if (loading) {
    return (
      <div className="border rounded-lg p-3 bg-gray-50">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    );
  }
  
  if (!preview) return null;
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      {preview.image && (
        <img 
          src={preview.image} 
          alt={preview.title}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{preview.title}</h4>
        <p className="text-xs text-gray-600 line-clamp-2 mt-1">{preview.description}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Globe className="h-3 w-3 mr-1" />
          {preview.domain}
          <ExternalLink className="h-3 w-3 ml-auto" />
        </div>
      </div>
    </a>
  );
};

// 🔥 대표 이미지 컴포넌트
const RepresentativeImage: React.FC<{ 
  post: Post; 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ post, size = 'medium', className = '' }) => {
  const representativeImage = getRepresentativeImage(post);
  
  if (!representativeImage) return null;
  
  const sizeClasses = {
    small: 'h-12 w-16',
    medium: 'h-20 w-28',
    large: 'h-32 w-full'
  };
  
  return (
    <div className={`relative overflow-hidden rounded-md bg-gray-100 ${sizeClasses[size]} ${className}`}>
      <img 
        src={representativeImage}
        alt={post.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        onError={(e) => {
          // 이미지 로드 실패 시 대체 이미지 표시
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/200x120?text=${encodeURIComponent(post.title.slice(0, 10))}`;
        }}
      />
      {/* 이미지 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
    </div>
  );
};

// 🔥 미디어 콘텐츠 렌더링 컴포넌트 (상세보기용)
const MediaContent: React.FC<{ media: any[], isCompact?: boolean }> = ({ media, isCompact = false }) => {
  if (media.length === 0) return null;
  
  const imageMedia = media.filter(m => m.type === 'image');
  const videoMedia = media.filter(m => m.type === 'video');
  const youtubeMedia = media.filter(m => m.type === 'youtube');
  const linkMedia = media.filter(m => m.type === 'link');
  
  return (
    <div className={`space-y-2 ${isCompact ? 'mt-2' : 'mt-3'}`}>
      {/* 이미지 */}
      {imageMedia.length > 0 && (
        <div className={`grid gap-2 ${imageMedia.length === 1 ? 'grid-cols-1' : imageMedia.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {imageMedia.slice(0, isCompact ? 1 : 3).map((item, index) => (
            <div key={index} className="relative group overflow-hidden rounded-md">
              <img 
                src={item.url} 
                alt={`Image ${index + 1}`}
                className={`w-full object-cover transition-transform group-hover:scale-105 ${
                  isCompact ? 'h-20' : imageMedia.length === 1 ? 'h-48' : 'h-24'
                }`}
                onClick={(e) => e.stopPropagation()}
              />
              {imageMedia.length > 3 && index === 2 && !isCompact && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium">
                  +{imageMedia.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* 동영상 */}
      {videoMedia.length > 0 && !isCompact && (
        <div className="space-y-2">
          {videoMedia.slice(0, 1).map((item, index) => (
            <div key={index} className="relative rounded-md overflow-hidden">
              <video 
                src={item.url}
                className="w-full h-48 object-cover"
                controls
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* YouTube */}
      {youtubeMedia.length > 0 && !isCompact && (
        <div className="space-y-2">
          {youtubeMedia.slice(0, 1).map((item, index) => {
            const videoId = extractYouTubeId(item.url);
            return videoId ? (
              <div key={index} className="relative rounded-md overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-48"
                  frameBorder="0"
                  allowFullScreen
                  onClick={(e: any) => e.stopPropagation()}
                />
              </div>
            ) : null;
          })}
        </div>
      )}
      
      {/* 링크 미리보기 */}
      {linkMedia.length > 0 && !isCompact && (
        <div className="space-y-2">
          {linkMedia.slice(0, 2).map((item, index) => (
            <LinkPreview key={index} url={item.url} />
          ))}
        </div>
      )}
      
      {/* 간단 모드에서 미디어 표시 */}
      {isCompact && (imageMedia.length > 0 || videoMedia.length > 0 || youtubeMedia.length > 0) && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {imageMedia.length > 0 && (
            <div className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              <span>{imageMedia.length}</span>
            </div>
          )}
          {(videoMedia.length > 0 || youtubeMedia.length > 0) && (
            <div className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span>{videoMedia.length + youtubeMedia.length}</span>
            </div>
          )}
          {linkMedia.length > 0 && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              <span>{linkMedia.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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

  // 🔥 각 게시글의 미디어 콘텐츠 추출
  const getPostMedia = (post: Post) => {
    const contentMedia = extractMediaFromContent(typeof post.content === 'object' ? JSON.stringify(post.content) : post.content) || [];
    const richContentMedia = post.richContent ? (extractMediaFromContent(typeof post.richContent === 'object' ? JSON.stringify(post.richContent) : post.richContent) || []) : [];
    
    // 중복 제거
    const allMedia = [...contentMedia, ...richContentMedia];
    const uniqueMedia = allMedia.filter((media, index, self) => 
      index === self.findIndex(m => m.url === media.url)
    );
    
    return uniqueMedia;
  };

  if (isLoading) {
    return (
      <div className="flex-grow overflow-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
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
              </div>
            ))}
          </div>
        ) : viewMode === 'compact' ? (
          <div className="space-y-1">
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 border-b">
                <div className="flex items-center gap-3 flex-grow">
                  <Skeleton className="h-8 w-12 rounded" />
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
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="flex">
                  <Skeleton className="h-32 w-48 flex-shrink-0" />
                  <div className="p-5 flex-grow">
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
          {posts.map((post) => {
            const media = getPostMedia(post);
            const mediaStats = getMediaStats(media);
            return (
              <motion.div
                key={post.id}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <Card 
                  className={`overflow-hidden cursor-pointer transition-all h-full flex flex-col 
                    ${post.isNotice ? 'border-l-4 border-l-yellow-400' : ''}`}
                  onClick={() => onPostClick(post)}
                >
                  {/* 🔥 대표 이미지 */}
                  <RepresentativeImage post={post} size="large" />
                  
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
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {post.content || ''}
                    </p>
                    
                    {/* 🔥 미디어 통계 표시 */}
                    {(mediaStats.imageCount > 0 || mediaStats.videoCount > 0 || mediaStats.linkCount > 0) && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        {mediaStats.imageCount > 0 && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            <span>{mediaStats.imageCount}</span>
                          </div>
                        )}
                        {mediaStats.videoCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            <span>{mediaStats.videoCount}</span>
                          </div>
                        )}
                        {mediaStats.linkCount > 0 && (
                          <div className="flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            <span>{mediaStats.linkCount}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-600 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
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
            );
          })}
        </div>
      ) : viewMode === 'compact' ? (
        <div className="space-y-1 border rounded-lg overflow-hidden">
          {posts.map((post) => {
            const media = getPostMedia(post);
            const mediaStats = getMediaStats(media);
            return (
              <motion.div 
                key={post.id}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                transition={{ duration: 0.2 }}
                className={`group flex items-center justify-between py-2 px-3 border-b hover:bg-gray-50 cursor-pointer ${
                  post.isNotice ? 'bg-yellow-50 hover:bg-yellow-100' : ''
                }`}
                onClick={() => onPostClick(post)}
              >
                <div className="flex items-center gap-3 flex-grow overflow-hidden">
                  {/* 🔥 컴팩트 모드에서 대표 이미지 */}
                  <RepresentativeImage post={post} size="small" className="flex-shrink-0" />
                                {post.isNotice && <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs whitespace-nowrap">공지</Badge>}
                  <span className="text-xs" style={{ color: getChannelInfo(post.channelId)?.color }}>
                    {getChannelInfo(post.channelId)?.icon || '📄'}
                  </span>
                  <span className="font-medium text-gray-800 truncate">{post.title}</span>
                  {post.comments > 0 && <span className="text-xs text-indigo-500 font-semibold whitespace-nowrap">[{post.comments}]</span>}
                  {post.date === new Date().toISOString().split('T')[0] && (
                    <Badge className="bg-indigo-500 text-white text-xs whitespace-nowrap">NEW</Badge>
                  )}
                  
                  {/* 🔥 컴팩트 모드에서 미디어 통계 */}
                  {(mediaStats.imageCount > 0 || mediaStats.videoCount > 0 || mediaStats.linkCount > 0) && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {mediaStats.imageCount > 0 && (
                        <div className="flex items-center gap-0.5">
                          <ImageIcon className="h-3 w-3" />
                          <span>{mediaStats.imageCount}</span>
                        </div>
                      )}
                      {mediaStats.videoCount > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Play className="h-3 w-3" />
                          <span>{mediaStats.videoCount}</span>
                        </div>
                      )}
                      {mediaStats.linkCount > 0 && (
                        <div className="flex items-center gap-0.5">
                          <LinkIcon className="h-3 w-3" />
                          <span>{mediaStats.linkCount}</span>
                        </div>
                      )}
                    </div>
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
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const media = getPostMedia(post);
            const mediaStats = getMediaStats(media);
            const representativeImage = getRepresentativeImage(post);
            
            return (
              <motion.div
                key={post.id}
                whileHover={{ y: -2, boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <Card 
                  className={`cursor-pointer transition-all overflow-hidden ${
                    post.isNotice ? 'border-l-4 border-l-yellow-400' : ''
                  }`}
                  onClick={() => onPostClick(post)}
                >
                  <div className="flex">
                    {/* 🔥 리스트 모드에서 대표 이미지 (왼쪽) */}
                    {representativeImage && (
                      <div className="w-48 flex-shrink-0">
                        <RepresentativeImage post={post} size="large" className="h-full w-full" />
                      </div>
                    )}
                    
                    <div className="p-5 flex-grow">
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
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.content || ''}
                      </p>
                      
                      {/* 🔥 리스트 모드에서는 대표 이미지가 왼쪽에 있으므로 상세 미디어는 표시하지 않음 */}
                      {!representativeImage && <MediaContent media={media} />}
                      
                      {/* 🔥 미디어 통계 표시 */}
                      {(mediaStats.imageCount > 0 || mediaStats.videoCount > 0 || mediaStats.linkCount > 0) && (
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                          {mediaStats.imageCount > 0 && (
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4" />
                              <span>{mediaStats.imageCount}개 이미지</span>
                            </div>
                          )}
                          {mediaStats.videoCount > 0 && (
                            <div className="flex items-center gap-1">
                              <Play className="h-4 w-4" />
                              <span>{mediaStats.videoCount}개 동영상</span>
                            </div>
                          )}
                          {mediaStats.linkCount > 0 && (
                            <div className="flex items-center gap-1">
                              <LinkIcon className="h-4 w-4" />
                              <span>{mediaStats.linkCount}개 링크</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {/* {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-600">
                            {tag}
                          </Badge>
                        ))} */}
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
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostDisplay;
