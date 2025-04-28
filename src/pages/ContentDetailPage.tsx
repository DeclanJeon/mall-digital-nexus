
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  ChevronLeft, 
  ExternalLink, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Content } from '@/components/peer-space/types';
import { getPeerSpaceContents, deletePeerSpaceContent } from '@/utils/peerSpaceStorage';
import { toast } from '@/hooks/use-toast';

const ContentDetailPage: React.FC = () => {
  const { address, contentId } = useParams<{ address: string, contentId: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(true); // For demo, assume true
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (address && contentId) {
      const allContents = getPeerSpaceContents(address);
      const foundContent = allContents.find(c => c.id === contentId);
      
      if (foundContent) {
        setContent(foundContent);
      }
    }
  }, [address, contentId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "링크 복사 완료",
      description: "URL이 클립보드에 복사되었습니다.",
    });
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "좋아요 취소" : "좋아요 추가",
      description: isLiked ? "좋아요를 취소했습니다." : "좋아요를 추가했습니다.",
    });
  };

  const handleDelete = () => {
    if (address && contentId && window.confirm("정말로 이 콘텐츠를 삭제하시겠습니까?")) {
      deletePeerSpaceContent(address, contentId);
      toast({
        title: "콘텐츠 삭제 완료",
        description: "콘텐츠가 성공적으로 삭제되었습니다.",
      });
      navigate(`/space/${address}`);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    toast({
      title: "콘텐츠 수정",
      description: "콘텐츠 수정 기능은 아직 개발 중입니다.",
    });
  };

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleGoBack}>
            <ChevronLeft className="mr-1 h-5 w-5" /> 뒤로가기
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">콘텐츠를 찾을 수 없습니다</h2>
          <p className="text-gray-500">요청하신 콘텐츠가 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleGoBack}>
          <ChevronLeft className="mr-1 h-5 w-5" /> 뒤로가기
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {content.imageUrl && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img 
                  src={content.imageUrl} 
                  alt={content.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                      {content.type}
                    </Badge>
                    {content.date && (
                      <span className="text-sm text-gray-500">
                        {new Date(content.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{content.title}</h1>
                </div>
                
                {isOwner && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-1" /> 수정
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-300 hover:bg-red-50" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-1" /> 삭제
                    </Button>
                  </div>
                )}
              </div>
              
              {content.price && (
                <div className="mb-4">
                  <p className="text-xl font-bold text-primary-500">{content.price}</p>
                </div>
              )}
              
              <div className="mb-6 whitespace-pre-line">
                <p className="text-gray-700">{content.description}</p>
              </div>
              
              {content.externalUrl && (
                <div className="mb-6">
                  <a 
                    href={content.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> 외부 링크로 이동
                  </a>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant={isLiked ? "default" : "outline"} 
                  size="sm"
                  onClick={handleToggleLike}
                  className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} /> 
                  {content.likes || 0}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" /> 
                  {content.comments || 0}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" /> 공유
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">정보</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">조회수</p>
                <p className="font-medium">{content.views || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">게시일</p>
                <p className="font-medium">
                  {content.date 
                    ? new Date(content.date).toLocaleDateString() 
                    : "정보 없음"}
                </p>
              </div>
              
              {content.source && (
                <div>
                  <p className="text-sm text-gray-500">출처</p>
                  <p className="font-medium">{content.source}</p>
                </div>
              )}
              
              {content.rating !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">평점</p>
                  <p className="font-medium">{content.rating} / 5</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">관련 콘텐츠</h3>
            <p className="text-center text-sm text-gray-500 py-3">
              관련 콘텐츠가 없습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
