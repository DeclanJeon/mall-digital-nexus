import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart, BookmarkPlus, ShoppingBag, MessageSquare, Calendar, ExternalLink,
  FileText, Star
} from "lucide-react";

const ContentDetailModal = ({
  selectedContent, open, onOpenChange, peerSpaceData, reviews, referenceLinks
}: {
  selectedContent: any;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  peerSpaceData: any;
  reviews: any[];
  referenceLinks: any[];
}) => {
  if (!selectedContent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{selectedContent.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2">
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={selectedContent.imageUrl}
                alt={selectedContent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">설명</h3>
                <p className="text-text-200">{selectedContent.description}</p>
              </div>

              {selectedContent.price && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">가격</h3>
                  <p className="text-xl font-bold text-primary-300">{selectedContent.price}</p>
                </div>
              )}

              {selectedContent.date && selectedContent.date !== '' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">날짜</h3>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedContent.date}
                  </p>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  좋아요 {selectedContent.likes}
                </Button>
                <Button variant="outline" className="flex items-center">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  저장하기
                </Button>
                {selectedContent.type === 'product' && (
                  <Button className="bg-primary-300 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    구매하기
                  </Button>
                )}
                {selectedContent.type === 'service' && (
                  <Button className="bg-primary-300 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    문의하기
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">콘텐츠 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-200">작성자</span>
                  <span className="font-medium">{peerSpaceData.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-200">유형</span>
                  <Badge>{selectedContent.type}</Badge>
                </div>
                {selectedContent.isExternal && (
                  <div className="flex justify-between">
                    <span className="text-text-200">출처</span>
                    <a
                      href={`https://${selectedContent.source}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-100 hover:underline flex items-center"
                    >
                      {selectedContent.source}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">연관 링크</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {referenceLinks.slice(0, 3).map(link => (
                  <div key={link.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-text-200" />
                      <span>{link.title}</span>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-100 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="ghost" size="sm" className="w-full text-accent-100">
                  모든 관련 링크 보기
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">리뷰</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviews.slice(0, 2).map(review => (
                  <div key={review.id} className="pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={review.authorImage} />
                        <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{review.author}</span>
                      <div className="flex ml-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs mt-1 text-text-200 line-clamp-2">{review.content}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="ghost" size="sm" className="w-full text-accent-100">
                  모든 리뷰 보기 ({reviews.length})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
