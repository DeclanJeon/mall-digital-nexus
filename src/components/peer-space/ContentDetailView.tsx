import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, ThumbsUp, ExternalLink, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from '@/hooks/use-toast';
import { generateRandomReviews } from '@/utils/contentHelper';
import RelatedQuests from './RelatedQuests';
import { Content, PeerMallConfig, Review } from './types';

interface ContentDetailViewProps {
  address: string;
  config: PeerMallConfig;
  isOwner: boolean;
}

const ContentDetailView: React.FC<ContentDetailViewProps> = ({ address, config, isOwner }) => {
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching content and reviews
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate content fetch
      const fetchedContent: Content = {
        id: contentId || 'content-1',
        peerSpaceAddress: address,
        title: '가상 콘텐츠 제목',
        description: '이것은 가상 콘텐츠에 대한 설명입니다. 실제 데이터로 대체될 예정입니다.',
        type: 'product',
        date: new Date().toISOString(),
        likes: 42,
        comments: 12,
        views: 1234,
        saves: 66,
        imageUrl: 'https://via.placeholder.com/600/457b6f',
        author: '테스트 작성자',
        authorId: 'author-1',
        tags: ['가상', '콘텐츠', '테스트'],
        category: '기타',
        price: 25000,
        badges: ['인기', '추천'],
        ecosystem: {},
        attributes: {}
      };
      setContent(fetchedContent);
      
      // Simulate reviews fetch
      const fetchedReviews = createReviews();
      setReviews(fetchedReviews);
      
      setIsLoading(false);
    };
    
    loadData();
  }, [contentId, address]);

  const getRandomDate = (daysAgo: number = 0): string => {
    const today = new Date();
    const pastDate = new Date(today.setDate(today.getDate() - daysAgo));
    return pastDate.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const reviewTexts = [
    "정말 훌륭한 제품입니다! 강력 추천합니다.",
    "기대 이상이에요. 배송도 빠르고 품질도 좋아요.",
    "가성비 최고! 이 가격에 이런 퀄리티라니 놀랍습니다.",
    "디자인이 너무 예뻐요. 사용할 때마다 기분이 좋아져요.",
    "사용하기 편리하고 기능도 다양해서 만족합니다."
  ];

  const names = ["김민수", "이서연", "박지훈", "최윤서", "정현우"];

  // Update the mock review creation to include the peerMall property
  const createReviews = () => {
    const count = Math.floor(Math.random() * 5) + 3; // 3 ~ 7 reviews
    
    return Array.from({ length: count }).map((_, index) => ({
      id: `review-${index}`,
      contentId: contentId,
      userId: `user-${index}`,
      userName: `사용자 ${index + 1}`,
      userAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=review${index}`,
      rating: Math.floor(Math.random() * 3) + 3, // 3 ~ 5 rating
      text: reviewTexts[index % reviewTexts.length],
      date: getRandomDate(),
      likes: Math.floor(Math.random() * 20),
      images: Math.random() > 0.7 ? [`https://picsum.photos/id/${(index + 12) * 5}/200/200`] : [],
      verified: Math.random() > 0.3,
      author: `사용자 ${index + 1}`,
      authorImage: `https://api.dicebear.com/7.x/personas/svg?seed=review${index}`,
      peerMall: { name: "테스트 피어몰" }
    }));
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading content...</div>;
  }

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Content not found.</div>;
  }

  const handleLike = () => {
    toast({
      title: "좋아요!",
      description: "콘텐츠가 마음에 드셨다니 기쁩니다.",
    });
  };

  const handleShare = () => {
    toast({
      title: "공유하기",
      description: "콘텐츠를 공유합니다.",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "메시지 보내기",
      description: "작성자에게 메시지를 보냅니다.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "삭제하기",
      description: "정말 삭제하시겠습니까?",
    });
  };

  const handleEdit = () => {
    toast({
      title: "수정하기",
      description: "수정 페이지로 이동합니다.",
    });
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${content.authorId}`} alt={content.author || 'Unknown Author'} />
                <AvatarFallback>{content.author?.substring(0, 1) || 'U'}</AvatarFallback>
              </Avatar>
              <span>{content.author || 'Unknown Author'}</span>
              <span className="text-gray-500"> - {new Date(content.date).toLocaleDateString()}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <img src={content.imageUrl} alt={content.title} className="w-full rounded-md aspect-video object-cover" />
          <p>{content.description}</p>

          {/* Badges */}
          <div className="flex items-center space-x-2">
            {content.badges?.map((badge, index) => (
              <Badge key={index}>{badge}</Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleLike}>
                <Heart className="mr-2 h-4 w-4" />
                좋아요 ({content.likes})
              </Button>
              <Button variant="ghost" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                공유하기
              </Button>
              <Button variant="ghost" onClick={handleSendMessage}>
                <MessageSquare className="mr-2 h-4 w-4" />
                메시지 보내기
              </Button>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open dropdown menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Quests and Events */}
      <RelatedQuests contentId={contentId || 'default'} contentType={content.type} />

      {/* Reviews Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reviews</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Write a Review <ArrowRight className="ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Write a Review</SheetTitle>
                <SheetDescription>
                  Add your review to share your experience with this content.
                </SheetDescription>
              </SheetHeader>
              {/* Add review form here */}
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map(review => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.authorImage} alt={review.author || 'Unknown'} />
                    <AvatarFallback>{review.userName?.substring(0, 1) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{review.userName}</div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">{review.text}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/space/${address}`} className="text-blue-500 hover:underline">
                    {review.peerMall?.name || '테스트 피어몰'}
                  </Link>
                  <Button variant="ghost">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {review.likes}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContentDetailView;
