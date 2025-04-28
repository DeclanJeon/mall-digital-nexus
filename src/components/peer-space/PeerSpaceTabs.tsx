
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Edit, Trash } from "lucide-react";
import { Content } from "./types";
import ContentCard from "@/components/peer-space/ContentCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface PeerSpaceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  featuredContent: Content[];
  isOwner: boolean;
  onAddContent: () => void;
  onContentClick: (content: Content) => void;
}

export const PeerSpaceTabs = ({
  activeTab,
  onTabChange,
  featuredContent,
  isOwner,
  onAddContent,
  onContentClick
}: PeerSpaceTabsProps) => {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

  // Filter content based on the current active tab
  const getFilteredContent = (tabValue: string): Content[] => {
    if (tabValue === 'featured') {
      return featuredContent;
    } else {
      // Filter the content based on the tab value (which corresponds to content type)
      return featuredContent.filter(content => content.type === tabValue);
    }
  };

  // Get content for current tab
  const currentTabContent = getFilteredContent(activeTab);

  const handleEditContent = (content: Content, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedContent(content);
    setEditedTitle(content.title);
    setEditedDescription(content.description);
    setEditedImageUrl(content.imageUrl);
    setEditedPrice(content.price || "");
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = (content: Content, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedContent) return;

    const updatedContent = {
      ...selectedContent,
      title: editedTitle,
      description: editedDescription,
      imageUrl: editedImageUrl,
      price: editedPrice
    };

    // Get current content from localStorage
    const address = window.location.pathname.split('/').pop() || '';
    const storedContents = JSON.parse(localStorage.getItem(`peer_space_${address}_contents`) || '[]');
    
    // Find and update the content
    const updatedContents = storedContents.map((c: Content) => 
      c.id === selectedContent.id ? updatedContent : c
    );
    
    // Save back to localStorage
    localStorage.setItem(`peer_space_${address}_contents`, JSON.stringify(updatedContents));
    
    // Refresh the page to show updates
    window.location.reload();

    setIsEditDialogOpen(false);
    toast({
      title: "콘텐츠 수정 완료",
      description: "콘텐츠가 성공적으로 수정되었습니다."
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedContent) return;

    // Get current content from localStorage
    const address = window.location.pathname.split('/').pop() || '';
    const storedContents = JSON.parse(localStorage.getItem(`peer_space_${address}_contents`) || '[]');
    
    // Filter out the deleted content
    const updatedContents = storedContents.filter((c: Content) => c.id !== selectedContent.id);
    
    // Save back to localStorage
    localStorage.setItem(`peer_space_${address}_contents`, JSON.stringify(updatedContents));
    
    // Refresh the page to show updates
    window.location.reload();

    setIsDeleteDialogOpen(false);
    toast({
      title: "콘텐츠 삭제 완료",
      description: "콘텐츠가 성공적으로 삭제되었습니다."
    });
  };

  return (
    <>
      <Tabs defaultValue="featured" className="mb-8" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="featured">추천 콘텐츠</TabsTrigger>
          <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
          <TabsTrigger value="service">서비스</TabsTrigger>
          <TabsTrigger value="community">커뮤니티</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="map">지도</TabsTrigger>
          <TabsTrigger value="event">이벤트</TabsTrigger>
          {isOwner && <TabsTrigger value="analytics">분석</TabsTrigger>}
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-10">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-300">
                {activeTab === 'featured' ? '추천 콘텐츠' : 
                 activeTab === 'portfolio' ? '포트폴리오' :
                 activeTab === 'service' ? '서비스' :
                 activeTab === 'community' ? '커뮤니티' :
                 activeTab === 'review' ? '리뷰' :
                 activeTab === 'map' ? '지도' :
                 activeTab === 'event' ? '이벤트' :
                 activeTab === 'analytics' ? '분석' : '콘텐츠'}
              </h2>
              {isOwner && (
                <Button variant="outline" size="sm" className="flex items-center" onClick={onAddContent}>
                  <Plus className="mr-1 h-4 w-4" /> 
                  {activeTab === 'featured' ? '콘텐츠 추가' :
                   activeTab === 'portfolio' ? '포트폴리오 추가' :
                   activeTab === 'service' ? '서비스 추가' :
                   activeTab === 'community' ? '게시글 추가' :
                   activeTab === 'review' ? '리뷰 추가' :
                   activeTab === 'event' ? '이벤트 추가' : '추가'}
                </Button>
              )}
            </div>
            
            {currentTabContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentTabContent.map(content => (
                  <div 
                    key={content.id} 
                    className="relative group cursor-pointer" 
                    onClick={() => onContentClick(content)}
                  >
                    <ContentCard content={content} />
                    
                    {isOwner && (
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={(e) => handleEditContent(content, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-red-500"
                          onClick={(e) => handleDeleteContent(content, e)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-text-200 bg-gray-50 rounded-lg">
                {activeTab === 'featured' ? '추천 콘텐츠가 없습니다.' :
                 activeTab === 'portfolio' ? '포트폴리오가 없습니다.' :
                 activeTab === 'service' ? '서비스가 없습니다.' :
                 activeTab === 'community' ? '커뮤니티 콘텐츠가 없습니다.' :
                 activeTab === 'review' ? '리뷰가 없습니다.' :
                 activeTab === 'map' ? '지도 정보가 없습니다.' :
                 activeTab === 'event' ? '이벤트가 없습니다.' :
                 activeTab === 'analytics' ? '분석 데이터가 없습니다.' : '콘텐츠가 없습니다.'}
              </div>
            )}
            
            {currentTabContent.length > 4 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="flex items-center">
                  더보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>콘텐츠 수정하기</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">제목</Label>
              <Input 
                id="title" 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input 
                id="imageUrl" 
                value={editedImageUrl} 
                onChange={(e) => setEditedImageUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">가격 (선택사항)</Label>
              <Input 
                id="price" 
                value={editedPrice} 
                onChange={(e) => setEditedPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea 
                id="description" 
                value={editedDescription} 
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>변경사항 저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>콘텐츠 삭제하기</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            정말 이 콘텐츠를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeerSpaceTabs;
