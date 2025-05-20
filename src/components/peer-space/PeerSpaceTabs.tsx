import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Edit, Trash, Bookmark } from "lucide-react"; // Added Bookmark
import { Content, ContentType, CONTENT_TYPES } from "./types"; // Make sure ContentType includes all tab values if filtering by type
// import ContentCard from "@/components/peer-space/ContentCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ContentCard from './content/ContentCard';

interface PeerSpaceTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  contents: Content[]; // Changed from featuredContent
  isOwner: boolean;
  onAddContentClick: () => void; // Renamed
  onContentClick: (content: Content) => void;
  onEditContentClick: (content: Content) => void; // New prop
  onDeleteContentClick: (contentId: string) => void; // New prop
  onSaveContentClick: (content: Content) => void; // New prop for 찜하기
}

export const PeerSpaceTabs = ({
  activeTab = 'product', // Default to product tab
  onTabChange,
  contents, // Changed
  isOwner,
  onAddContentClick, // Renamed
  onContentClick,
  onEditContentClick, // New
  onDeleteContentClick, // New
  onSaveContentClick, // New
}: PeerSpaceTabsProps) => {
  const [selectedContentForDialog, setSelectedContentForDialog] = useState<Content | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    // Add other editable fields from Content type if needed
  });

  // Filter content based on the current active tab
  const getFilteredContent = (tabValue: string): Content[] => {
    if (tabValue === 'product') {
      // For "추천 콘텐츠", you might have a specific flag or logic.
      // For now, let's assume it shows all, or you might filter by a `isFeatured` flag on Content.
      // This example shows all, adjust if 'featured' has specific criteria.
      return contents;
    } else if (CONTENT_TYPES.includes(tabValue as ContentType)) {
      // Filters by content.type if tabValue is a valid ContentType
      return contents.filter(content => content.type === tabValue);
    }
    // Fallback or if tabValue doesn't match a type (e.g., 'quest' might not be a ContentType yet)
    // For 'quest', you might filter by content.type === 'quest' if you add it to ContentType
    // or handle it differently. This example filters by type.
    return contents.filter(content => content.type === tabValue);
  };

  const currentTabContent = getFilteredContent(activeTab);

  const handleOpenEditDialog = (content: Content, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedContentForDialog(content);
    setEditForm({
        title: content.title,
        description: content.description,
        imageUrl: content.imageUrl || '',
        price: content.price ? content.price.toString() : '',
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (content: Content, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedContentForDialog(content);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (!selectedContentForDialog) return;

    const updatedContentData = {
      ...selectedContentForDialog,
      title: editForm.title,
      description: editForm.description,
      imageUrl: editForm.imageUrl,
      price: editForm.price ? parseFloat(editForm.price) : undefined, // Ensure price is a number
      // type: selectedContentForDialog.type // type should not change here usually
    };
    
    onEditContentClick(updatedContentData); // Pass the whole updated content object
    setIsEditDialogOpen(false);
    setSelectedContentForDialog(null);
    // Toast is handled by the parent component after successful DB operation
  };

  const handleConfirmDelete = () => {
    if (!selectedContentForDialog) return;
    onDeleteContentClick(selectedContentForDialog.id);
    setIsDeleteDialogOpen(false);
    setSelectedContentForDialog(null);
    // Toast is handled by the parent component
  };

  const handleSaveAction = (content: Content, event: React.MouseEvent) => {
    event.stopPropagation();
    onSaveContentClick(content);
  }

  const getTabDisplayName = (tabKey: string) => {
    const names: Record<string, string> = {
      product: "제품",
      content: "콘텐츠", // General content
    };
    return names[tabKey] || "콘텐츠";
  }

  const getAddButtonText = (tabKey: string) => {
    const names: Record<string, string> = {
        product: "제품 추가",
        content: "콘텐츠 추가",
      };
      return names[tabKey] || "항목 추가";
  }

  // Define tab triggers based on your new structure
  const tabTriggers = [
    { value: "product", label: "제품" },
    { value: "content", label: "콘텐츠" }, // General content type
  ];

  return (
    <>
      <Tabs defaultValue="product" className="mb-8" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full justify-start pb-1 border-b">
          {tabTriggers.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-sm sm:text-base">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Render TabsContent for each defined tab */}
        {tabTriggers.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6 pt-4">
            {activeTab === tab.value && ( // Only render content for the active tab
              <section>
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                    {getTabDisplayName(activeTab)}
                  </h2>
                  {isOwner && (
                    <Button 
                        variant="default" // Changed to default for better visibility
                        size="sm" 
                        className="flex items-center shadow-sm" 
                        onClick={onAddContentClick}
                    >
                      <Plus className="mr-1 h-4 w-4" /> 
                      {getAddButtonText(activeTab)}
                    </Button>
                  )}
                </div>
                
                {currentTabContent && currentTabContent.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {currentTabContent.map(contentItem => (
                      <div 
                        key={contentItem.id} 
                        className="relative group"
                      >
                        <ContentCard 
                            content={contentItem} 
                            onClick={() => onContentClick(contentItem)}
                        />
                        <div className="absolute top-2 right-2 flex flex-col sm:flex-row gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!isOwner && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-7 w-7 sm:h-8 sm:w-8 bg-white/70 backdrop-blur-sm hover:bg-white text-pink-500"
                              onClick={(e) => handleSaveAction(contentItem, e)}
                              title="찜하기"
                            >
                              <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                          {isOwner && (
                            <>
                              <Button 
                                size="icon" 
                                variant="secondary" 
                                className="h-7 w-7 sm:h-8 sm:w-8 bg-white/70 backdrop-blur-sm hover:bg-white"
                                onClick={(e) => handleOpenEditDialog(contentItem, e)}
                                title="수정"
                              >
                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="secondary"
                                className="h-7 w-7 sm:h-8 sm:w-8 bg-white/70 backdrop-blur-sm hover:bg-red-100 text-red-500 hover:text-red-600"
                                onClick={(e) => handleOpenDeleteDialog(contentItem, e)}
                                title="삭제"
                              >
                                <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg shadow-sm">
                    <p>{getTabDisplayName(activeTab)} 섹션에 아직 콘텐츠가 없습니다.</p>
                    {isOwner && <p className="text-sm mt-1">위의 '{getAddButtonText(activeTab)}' 버튼을 클릭하여 추가해 보세요.</p>}
                  </div>
                )}
                
                {/* Consider a more robust pagination or "load more" if needed */}
                {currentTabContent && currentTabContent.length > 8 && activeTab !== 'featured' && (
                  <div className="flex justify-center mt-8">
                    <Button variant="outline" className="flex items-center">
                      {getTabDisplayName(activeTab)} 더보기 <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </section>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg"> {/* Slightly wider dialog */}
          <DialogHeader>
            <DialogTitle>콘텐츠 수정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="title">제목</Label>
              <Input 
                id="title"
                name="title" 
                value={editForm.title} 
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input 
                id="imageUrl" 
                name="imageUrl"
                value={editForm.imageUrl} 
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="price">가격 (숫자만 입력, 선택사항)</Label>
              <Input 
                id="price" 
                name="price"
                type="number"
                value={editForm.price} 
                onChange={handleInputChange}
                placeholder="예: 10000"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description">설명</Label>
              <Textarea 
                id="description" 
                name="description"
                value={editForm.description} 
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>취소</Button>
            <Button type="button" onClick={handleSaveEdit}>변경사항 저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>콘텐츠 삭제 확인</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            정말로 '{selectedContentForDialog?.title}' 콘텐츠를 삭제하시겠습니까? <br/>이 작업은 되돌릴 수 없습니다.
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
