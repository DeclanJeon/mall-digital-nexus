import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  BookmarkPlus,
  ExternalLink,
  ShoppingBag,
  Star,
  Plus,
  Trash,
  Edit,
  Calendar, 
  MapPin,
  Award,
  Info,
  Link2,
  Factory,
  Truck,
  Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, Review } from '../types';
import { 
  getPeerSpaceContents, 
  savePeerSpaceContent,
  deletePeerSpaceContent 
} from '@/utils/peerSpaceStorage';
import { generateRandomReviews } from '@/utils/contentHelper';
import ContentEditForm from './ContentEditForm';
import RelatedBadges from './RelatedBadges';
import RelatedQuests from './RelatedQuests';
import RelatedContentSection from './RelatedContentSection';
import { getAverageRating } from '@/utils/reviewUtils';

interface ContentDetailViewProps {
  address: string;
  config: PeerMallConfig;
  isOwner: boolean;
}

const ContentDetailView: React.FC<ContentDetailViewProps> = ({ address, config, isOwner }) => {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  
  const [content, setContent] = useState<Content | null>(null);
  const [relatedContents, setRelatedContents] = useState<Content[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);

  // Related information
  const relatedLinks = [
    { id: '1', title: '공식 웹사이트', url: 'https://example.com', type: 'official' },
    { id: '2', title: '사용 설명서', url: 'https://example.com/manual', type: 'manual' },
    { id: '3', title: '외부 리뷰', url: 'https://example.com/reviews', type: 'review' }
  ];

  const ecosystemInfo = {
    manufacturer: '제조사명',
    brand: '브랜드명',
    supplier: '공급사',
    influencers: [
      { id: '1', name: '인플루언서1', profileUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=influencer1' },
      { id: '2', name: '인플루언서2', profileUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=influencer2' }
    ]
  };

  useEffect(() => {
    if (contentId && address) {
      (async () => {
        const allContents = await getPeerSpaceContents(address);
        const foundContent = allContents.find(item => item.id === contentId);
        
        if (foundContent) {
          setContent(foundContent);
          
          // Find related contents (same type or by some other relation)
          const related = allContents
            .filter(item => item.id !== contentId && item.type === foundContent.type)
            .slice(0, 4);
          setRelatedContents(related);
          
          // Generate or load reviews
          const generatedReviews = await generateRandomReviews(contentId, 5);
          setReviews(generatedReviews);
          
          // Calculate average rating
          if (generatedReviews.length > 0) {
            setAverageRating(getAverageRating(generatedReviews));
          }
          
          // Calculate average rating
          setAverageRating(getAverageRating(generatedReviews));
        } else {
          // Content not found
          toast({
            variant: "destructive",
            title: "콘텐츠를 찾을 수 없습니다.",
            description: "존재하지 않거나 삭제된 콘텐츠입니다."
          });
          navigate(`/space/${address}`);
        }
      })();
    }
  }, [contentId, address, navigate]);

  const handleEditContent = async (updatedContent: Content) => {
    if (!contentId || !address) return;
    
    const allContents = await getPeerSpaceContents(address);
    const updatedContents = allContents.map(item => {
      if (item.id === contentId) {
        return { ...updatedContent, id: contentId };
      }
      return item;
    });
    
    await savePeerSpaceContent(address, updatedContent);
    setContent(updatedContent);
    setIsEditModalOpen(false);
    
    toast({
      title: "콘텐츠 수정 완료",
      description: "콘텐츠가 성공적으로 수정되었습니다."
    });
  };

  const handleDeleteContent = () => {
    if (!contentId || !address) return;
    
    deletePeerSpaceContent(address, contentId);
    toast({
      title: "콘텐츠 삭제 완료",
      description: "콘텐츠가 성공적으로 삭제되었습니다."
    });
    
    navigate(`/space/${address}`);
  };

  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      toast({
        variant: "destructive",
        title: "리뷰 내용을 입력하세요",
        description: "리뷰 내용은 최소 한 글자 이상이어야 합니다."
      });
      return;
    }
    
    const newReviewObj: Review = {
      id: `review-${Date.now()}`,
      title: `Review for ${content?.title}`,  // Adding a title since it's required
      contentId: contentId || '',
      userId: `user-${Date.now()}`,
      userName: "현재 사용자",
      author: "현재 사용자",
      authorImage: "https://api.dicebear.com/7.x/personas/svg?seed=current-user",
      content: newReview,
      text: newReview,  // Make sure to set text to match content
      rating: newRating,
      date: new Date().toISOString(),
      source: 'internal',
      likes: 0,
      replies: 0,  // Required by Review interface
      verified: true,
      helpful: 0,  // Required by Review interface
      peerMall: {
        id: address,
        name: config.title || '',
        address: address
      }
    };
    
    const updatedReviews = [...reviews, newReviewObj];
    setReviews(updatedReviews);
    setNewReview('');
    setAverageRating(getAverageRating(updatedReviews));
    
    toast({
      title: "리뷰 등록 완료",
      description: "소중한 의견을 남겨주셔서 감사합니다."
    });
  };

  const handleToggleLike = async () => {
    if (!content || !contentId || !address) return;
    
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    
    const allContents = await getPeerSpaceContents(address);
    const updatedContents = allContents.map(item => {
      if (item.id === contentId) {
        const currentLikes = item.likes || 0;
        return { 
          ...item, 
          likes: newLikeStatus ? currentLikes + 1 : Math.max(currentLikes - 1, 0) 
        };
      }
      return item;
    });
    
    // savePeerSpaceContent(address, updatedContents);
    
    //  이거 리팩토링해야됨
    // Update local content state
    if (content) {
      const updatedContent = updatedContents.find(item => item.id === contentId);
      await savePeerSpaceContent(address, updatedContent);
      const currentLikes = content.likes || 0;
      setContent({
        ...content,
        likes: newLikeStatus ? currentLikes + 1 : Math.max(currentLikes - 1, 0)
      });
    }
    
    toast({
      title: newLikeStatus ? "좋아요 추가" : "좋아요 취소",
      description: newLikeStatus ? "콘텐츠를 좋아합니다." : "좋��요를 취소했습니다."
    });
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "저장 취소" : "저장 완료",
      description: isSaved ? "저장 목록에서 제거되었습니다." : "저장 목록에 추가되었습니다."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "링크 복사 완료",
      description: "이 페이지의 링크가 클립보드에 복사되었습니다."
    });
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center p-12">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="h-56 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Update the getContentTypeDisplayName function to handle all ContentType values
  const getContentTypeDisplayName = (type: ContentType): string => {
    const typeMapping: Record<ContentType, string> = {
      [ContentType.Portfolio]: '포트폴리오',
      [ContentType.Service]: '서비스',
      [ContentType.Product]: '상품',
      [ContentType.Event]: '이벤트',
      [ContentType.Post]: '게시글',
      [ContentType.Review]: '리뷰',
      [ContentType.Quest]: '퀘스트',
      [ContentType.Advertisement]: '광고',
      [ContentType.Stream]: '라이브 스트림',
      [ContentType.Guestbook]: '방명록',
      [ContentType.Course]: '코스',
      [ContentType.Workshop]: '워크샵',
      [ContentType.Challenge]: '챌린지',
      [ContentType.Tool]: '도구',
      [ContentType.External]: '외부',
      [ContentType.Livestream]: '라이브 스트림',
      [ContentType.Article]: '아티클',
      [ContentType.Resource]: '리소스',
      [ContentType.Other]: '기타'
    };
    
    return typeMapping[type] || String(type);
  };

  const getContentActionButton = () => {
    switch (content.type as ContentType) {
      case ContentType.Product:
        return (
          <Button className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 mr-2" />
            구매하기
          </Button>
        );
      case ContentType.Service:
        return (
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            문의하기
          </Button>
        );
      case ContentType.Event:
        return (
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4 mr-2" />
            참여하기
          </Button>
        );
      case ContentType.Quest:
        return (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4 mr-2" />
            도전하기
          </Button>
        );
      default:
        return (
          <Button className="flex items-center gap-2">
            <Info className="h-4 w-4 mr-2" />
            자세히 보기
          </Button>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Left Side (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Content Header */}
          <div className="relative">
            {/* Type badge */}
            <Badge className="absolute top-4 left-4 z-10">
              {getContentTypeDisplayName(content.type)}
            </Badge>
            
            {/* Main Image */}
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 mb-6">
              <img
                src={content.imageUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Title Section */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>{new Date(content.date || Date.now()).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{content.views || 0} 조회</span>
                  {content.price && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-semibold text-blue-600">{content.price}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Edit/Delete buttons for owner */}
              {isOwner && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> 수정
                  </Button>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-1" /> 삭제
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>콘텐츠 삭제 확인</DialogTitle>
                      </DialogHeader>
                      <p className="py-4">정말 이 콘텐츠를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          취소
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteContent}>
                          삭제
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 whitespace-pre-line">{content.description}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {getContentActionButton()}
            
            <Button 
              variant="outline" 
              onClick={handleToggleLike}
              className={isLiked ? 'bg-rose-50 text-rose-600 border-rose-200' : ''}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-rose-500' : ''}`} />
              좋아요 {(content.likes || 0) + (isLiked ? 1 : 0)}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleToggleSave}
              className={isSaved ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
            >
              <BookmarkPlus className={`h-4 w-4 mr-2 ${isSaved ? 'fill-blue-500' : ''}`} />
              저장하기
            </Button>
            
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="details" className="mt-8">
            <TabsList className="mb-6 grid grid-cols-4 md:w-[600px]">
              <TabsTrigger value="details">상세 정보</TabsTrigger>
              <TabsTrigger value="ecosystem">생태계 정보</TabsTrigger>
              <TabsTrigger value="quests">퀘스트/이벤트</TabsTrigger>
              <TabsTrigger value="badges">뱃지 정보</TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>상세 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">기본 정보</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">유형</div>
                          <div>{getContentTypeDisplayName(content.type)}</div>
                        </div>
                        {content.price && (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">가격</div>
                            <div className="text-lg font-semibold text-blue-600">{content.price}</div>
                          </div>
                        )}
                        {content.date && (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">등록일</div>
                            <div>{new Date(content.date).toLocaleDateString()}</div>
                          </div>
                        )}
                        {content.externalUrl && (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">외부 링크</div>
                            <a 
                              href={content.externalUrl} 
                              target="_blank" 
                              rel="noreferrer noopener" 
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              방문하기 <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Related Links */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">관련 링크</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {relatedLinks.map(link => (
                          <a 
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{link.title}</span>
                            </div>
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Ecosystem Tab */}
            <TabsContent value="ecosystem">
              <Card>
                <CardHeader>
                  <CardTitle>생태계 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Manufacturing Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Factory className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">제조사</span>
                        </div>
                        <div className="font-medium">{ecosystemInfo.manufacturer}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">브랜드</span>
                        </div>
                        <div className="font-medium">{ecosystemInfo.brand}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">공급사</span>
                        </div>
                        <div className="font-medium">{ecosystemInfo.supplier}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Influencer Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">관련 인플루언서</h3>
                      <div className="flex flex-wrap gap-4">
                        {ecosystemInfo.influencers.map(influencer => (
                          <div key={influencer.id} className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={influencer.profileUrl} />
                              <AvatarFallback>{influencer.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{influencer.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Quests & Events Tab */}
            <TabsContent value="quests">
              <RelatedQuests contentId={contentId || ''} contentType={content.type} />
            </TabsContent>
            
            {/* Badges Tab */}
            <TabsContent value="badges">
              <RelatedBadges contentId={contentId || ''} contentType={content.type} />
            </TabsContent>
          </Tabs>

          {/* Reviews Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">리뷰 및 평가</h2>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 ml-2">({reviews.length})</span>
              </div>
            </div>
            
            {/* Write Review */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">리뷰 작성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-medium">평점</div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-6 w-6 cursor-pointer ${i < newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          onClick={() => setNewRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="리뷰 내용을 입력하세요..."
                    className="min-h-[120px]"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmitReview}>리뷰 등록</Button>
              </CardFooter>
            </Card>
            
            {/* Review List */}
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={review.authorImage} alt={review.author} />
                          <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.author}</div>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.source === 'external' && review.sourceSite && (
                        <Badge variant="outline" className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {review.sourceSite}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-3 text-gray-700">{review.content}</p>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        {review.likes || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar - Right Side (1/3) */}
        <div className="space-y-6">
          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">소유자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={config.profileImage} alt={config.owner} />
                  <AvatarFallback>{config.owner.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{config.owner}</div>
                  <div className="text-sm text-gray-500">{config.peerNumber}</div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  메시지 보내기
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Content Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">콘텐츠 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">조회수</span>
                  <span>{content.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">좋아요</span>
                  <span>{content.likes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">댓글</span>
                  <span>{content.comments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">저장</span>
                  <span>{content.saves || 0}</span>
                </div>
                {content.rating !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">평점</span>
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{content.rating}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Location Information (for events or physical products) */}
          {(content.type === 'event' || content.type === 'product') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">위치 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  {content.type === 'event' 
                    ? '이벤트 위치: 서울특별시 강남구' 
                    : '제품 배송지: 전국'}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Related Content */}
          <RelatedContentSection contents={relatedContents} baseUrl={`/space/${address}/content`} />
        </div>
      </div>
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>콘텐츠 수정</DialogTitle>
          </DialogHeader>
          {content && (
            <ContentEditForm 
              initialContent={content} 
              onSubmit={handleEditContent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentDetailView;
