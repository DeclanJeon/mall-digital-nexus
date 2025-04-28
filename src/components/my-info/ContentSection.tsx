
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Bookmark, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define content type with proper status values
interface Content {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  thumbnail?: string;
  status?: 'published' | 'draft' | 'archived';
  views?: number;
  likes?: number;
}

// Define SavedItem type with proper type values
interface SavedItem {
  id: string;
  title: string;
  type: 'content' | 'product';
  source: string;
  savedAt: string;
  thumbnail?: string;
}

interface Review {
  id: string;
  title: string;
  content: string;
  target: string;
  rating: number;
  createdAt: string;
  likes: number;
}

interface ContentSectionProps {
  contents: Content[];
  savedItems: SavedItem[];
  reviews: Review[];
}

const ContentSection: React.FC<ContentSectionProps> = ({
  contents,
  savedItems,
  reviews
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          콘텐츠/정보 관리
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="my-content">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="my-content">내 콘텐츠</TabsTrigger>
            <TabsTrigger value="saved">저장한 항목</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-content" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">내가 생성한 콘텐츠</h3>
              <Button variant="outline" size="sm">
                콘텐츠 생성
              </Button>
            </div>
            
            {contents.length > 0 ? (
              <div className="space-y-3">
                {contents.slice(0, 3).map((content) => (
                  <div key={content.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between">
                      <div className="flex">
                        {content.thumbnail ? (
                          <div className="h-12 w-12 mr-3 bg-muted rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={content.thumbnail} 
                              alt={content.title} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 mr-3 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium line-clamp-1">{content.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Badge variant="outline" className="text-xs mr-2">{content.type}</Badge>
                            <span>{content.createdAt}</span>
                          </div>
                          {(content.views !== undefined || content.likes !== undefined) && (
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              {content.views !== undefined && (
                                <span>조회 {content.views.toLocaleString()}</span>
                              )}
                              {content.likes !== undefined && (
                                <span>좋아요 {content.likes}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {content.status && (
                        <Badge 
                          variant={
                            content.status === 'published' ? 'default' :
                            content.status === 'draft' ? 'outline' : 'secondary'
                          }
                        >
                          {content.status === 'published' ? '게시됨' :
                           content.status === 'draft' ? '임시저장' : '보관됨'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">아직 생성한 콘텐츠가 없습니다</p>
              </div>
            )}
            
            {contents.length > 3 && (
              <Button variant="link" className="w-full">
                더 많은 콘텐츠 보기 ({contents.length - 3})
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">저장/북마크 항목</h3>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                피어허브 관리
              </Button>
            </div>
            
            {savedItems.length > 0 ? (
              <div className="space-y-2">
                {savedItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      {item.thumbnail ? (
                        <div className="h-10 w-10 mr-3 bg-background rounded overflow-hidden">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 mr-3 bg-primary/10 rounded flex items-center justify-center">
                          <Bookmark className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs mr-2">
                            {item.type === 'content' ? '콘텐츠' : '상품'}
                          </Badge>
                          <span>{item.source}</span>
                          <span className="mx-1.5">•</span>
                          <span>{item.savedAt}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">보기</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">저장한 항목이 없습니다</p>
              </div>
            )}
            
            {savedItems.length > 4 && (
              <Button variant="link" className="w-full">
                더 많은 항목 보기 ({savedItems.length - 4})
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">작성한 리뷰</h3>
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-sm text-muted-foreground">{review.target}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2 mb-2">{review.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{review.createdAt}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        <span>좋아요 {review.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">작성한 리뷰가 없습니다</p>
              </div>
            )}
            
            {reviews.length > 2 && (
              <Button variant="link" className="w-full">
                더 많은 리뷰 보기 ({reviews.length - 2})
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentSection;
