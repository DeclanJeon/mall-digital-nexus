
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Settings, BarChart2, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const dummyReviews = [
  {
    id: 1,
    author: '박지성',
    rating: 5,
    content: '정말 좋은 제품이에요. 다음에도 구매할 예정입니다.',
    date: '2025-04-20',
    status: '공개',
    product: '프리미엄 티셔츠',
    replied: true
  },
  {
    id: 2,
    author: '김연아',
    rating: 4,
    content: '배송이 조금 늦었지만 품질은 좋았습니다.',
    date: '2025-04-18',
    status: '공개',
    product: '디자인 노트북',
    replied: false
  },
  {
    id: 3,
    author: '손흥민',
    rating: 2,
    content: '기대했던 것보다 품질이 떨어집니다.',
    date: '2025-04-15',
    status: '비공개',
    product: '스마트 워치',
    replied: true
  },
  {
    id: 4,
    author: '외부_리뷰',
    rating: 5,
    content: '네이버 쇼핑에서 가져온 리뷰입니다. 최고의 서비스!',
    date: '2025-04-10',
    status: '공개',
    product: '디자인 노트북',
    source: '네이버 쇼핑',
    replied: false
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
        />
      ))}
    </div>
  );
};

const ReviewsManagementSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (id: number) => {
    // 실제 구현에서는 리뷰 답변을 저장하는 로직
    console.log('Reply to review:', id, replyText);
    setReplyText('');
    setSelectedReview(null);
  };

  const filteredReviews = activeTab === 'all' 
    ? dummyReviews 
    : dummyReviews.filter(r => 
        (activeTab === 'public' && r.status === '공개') ||
        (activeTab === 'private' && r.status === '비공개') ||
        (activeTab === 'external' && r.source) ||
        (activeTab === 'unreplied' && !r.replied)
      );

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Star className="mr-2 h-6 w-6" />
        리뷰 관리
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="inline mr-2 h-4 w-4" /> 
                  리뷰 목록
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="정렬 기준" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">최신순</SelectItem>
                      <SelectItem value="highest">평점 높은순</SelectItem>
                      <SelectItem value="lowest">평점 낮은순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full grid grid-cols-5">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="public">공개</TabsTrigger>
                  <TabsTrigger value="private">비공개</TabsTrigger>
                  <TabsTrigger value="external">외부 리뷰</TabsTrigger>
                  <TabsTrigger value="unreplied">미답변</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs">
                        <tr>
                          <th className="py-2 px-4 text-left">평점</th>
                          <th className="py-2 px-4 text-left">작성자</th>
                          <th className="py-2 px-4 text-left">내용</th>
                          <th className="py-2 px-4 text-left">상태</th>
                          <th className="py-2 px-4 text-left">작성일</th>
                          <th className="py-2 px-4 text-left">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReviews.map((review) => (
                          <tr key={review.id} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4"><RatingStars rating={review.rating} /></td>
                            <td className="py-2 px-4">{review.author}</td>
                            <td className="py-2 px-4">
                              <div className="max-w-[200px] truncate">
                                {review.source && (
                                  <Badge variant="outline" className="mr-1">{review.source}</Badge>
                                )}
                                {review.content}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <Badge variant={review.status === '공개' ? 'default' : 'secondary'}>
                                {review.status}
                              </Badge>
                            </td>
                            <td className="py-2 px-4 text-xs">{review.date}</td>
                            <td className="py-2 px-4">
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedReview(review.id)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {selectedReview && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>
                  <MessageSquare className="inline mr-2 h-4 w-4" /> 
                  리뷰 답변
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      선택한 리뷰에 대한 답변을 작성합니다.
                    </p>
                  </div>
                  <div>
                    <textarea 
                      className="w-full border rounded-md p-2 h-24"
                      placeholder="답변 내용을 입력하세요..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedReview(null)}>취소</Button>
                    <Button onClick={() => handleReply(selectedReview)}>답변 등록</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Settings className="inline mr-2 h-4 w-4" /> 
                리뷰 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">표시 정책</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="리뷰 표시 정책" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 리뷰 표시</SelectItem>
                    <SelectItem value="verified">구매 인증 리뷰만 표시</SelectItem>
                    <SelectItem value="rating3up">3점 이상 리뷰만 표시</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">기본 정렬 방식</label>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="리뷰 정렬 방식" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="highest">평점 높은순</SelectItem>
                    <SelectItem value="helpful">도움순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  외부 리뷰 연동 설정
                </Button>
              </div>
              
              <div>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  리뷰 평판 대시보드
                </Button>
              </div>
              
              <div>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  리뷰 데이터 내보내기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewsManagementSection;
