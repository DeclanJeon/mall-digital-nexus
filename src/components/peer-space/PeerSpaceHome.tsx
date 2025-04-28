
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Content, PeerMallConfig, SectionType } from './types';
import { Heart, MessageSquare, Share2, QrCode, Award, ThumbsUp } from 'lucide-react';
import { 
  getPeerSpaceContents, 
  savePeerSpaceContents 
} from '@/utils/peerSpaceStorage';
import PeerSpaceHeader from './PeerSpaceHeader';
import PeerSpaceHero from './PeerSpaceHero';
import PeerSpaceContentSection from './PeerSpaceContentSection';
import PeerSpaceCommunitySection from './PeerSpaceCommunitySection';
import PeerSpaceEventsSection from './PeerSpaceEventsSection';
import PeerSpaceInfoHub from './PeerSpaceInfoHub';
import PeerSpaceReviewSection from './PeerSpaceReviewSection';
import PeerSpaceMapSection from './PeerSpaceMapSection';
import PeerSpaceTrustSection from './PeerSpaceTrustSection';
import PeerSpaceRelatedMallsSection from './PeerSpaceRelatedMallsSection';
import PeerSpaceActivityFeed from './PeerSpaceActivityFeed';
import PeerSpaceLiveCollaboration from './PeerSpaceLiveCollaboration';
import PeerSpaceFooter from './PeerSpaceFooter';
import EmptyState from './EmptyState';
import ProductRegistrationForm from './ProductRegistrationForm';
import BadgeSelector from './BadgeSelector';
import { ContentFormValues } from './AddContentForm';

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
}

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ 
  isOwner, 
  address,
  config,
  onUpdateConfig 
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    if (address) {
      // Load contents from localStorage based on the address
      const loadedContents = getPeerSpaceContents(address);
      setContents(loadedContents);
    }
  }, [address]);

  const handleAddContent = (formValues: ContentFormValues) => {
    if (!address) return;

    const now = new Date().toISOString();
    
    // Create a new content object
    const newContent: Content = {
      id: `content-${Date.now()}`,
      title: formValues.title,
      description: formValues.description,
      imageUrl: formValues.imageUrl,
      type: formValues.type,
      date: now,
      price: formValues.price,
      likes: 0,
      comments: 0,
      views: 0,
      saves: 0,
    };
    
    // Add the new content and update state
    const updatedContents = [...contents, newContent];
    setContents(updatedContents);
    
    // Save to localStorage
    savePeerSpaceContents(address, updatedContents);
    
    toast({
      title: "콘텐츠 추가 완료",
      description: "새로운 콘텐츠가 성공적으로 등록되었습니다.",
    });
  };

  const handleProductAdded = (product: Content) => {
    // Add the product and update state
    const updatedContents = [...contents, product];
    setContents(updatedContents);
    
    // Close product form dialog
    setShowProductForm(false);
  };

  const handleShare = () => {
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "공유하기",
      description: "링크가 클립보드에 복사되었습니다.",
    });
  };

  const handleFollow = () => {
    // Update followers count in the config
    const updatedConfig = {
      ...config,
      followers: config.followers + 1
    };
    
    // Save the updated config
    onUpdateConfig(updatedConfig);
    
    toast({
      title: "팔로우 완료",
      description: `${config.owner}님을 팔로우합니다.`,
    });
  };

  const handleAddRecommendation = () => {
    // Update recommendations count in the config
    const updatedConfig = {
      ...config,
      recommendations: config.recommendations + 1
    };
    
    // Save the updated config
    onUpdateConfig(updatedConfig);
    
    toast({
      title: "추천 완료",
      description: "해당 피어스페이스를 추천하였습니다.",
    });
  };

  const handleAddBadge = (badge: string) => {
    // Don't add duplicate badges
    if (config.badges.includes(badge)) {
      toast({
        title: "이미 추가된 뱃지",
        description: "이미 추가한 뱃지입니다.",
        variant: "destructive",
      });
      return;
    }
    
    // Add badge to config
    const updatedConfig = {
      ...config,
      badges: [...config.badges, badge]
    };
    
    // Save the updated config
    onUpdateConfig(updatedConfig);
    
    toast({
      title: "뱃지 추가 완료",
      description: "뱃지가 성공적으로 추가되었습니다.",
    });
  };

  const handleMessage = () => {
    toast({
      title: "메시지 보내기",
      description: "메시지 창이 열렸습니다.",
    });
  };

  const handleQRGenerate = () => {
    setShowQRModal(true);
  };

  const handleShowProductForm = () => {
    setShowProductForm(true);
  };

  // Modal for QR codes
  const renderQRModal = () => (
    <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">내 스페이스 QR 코드</DialogTitle>
        </DialogHeader>
        <div className="p-4 flex justify-center">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            QR 코드 영역
          </div>
        </div>
        <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">
          {`https://peermall.com/space/${address}`}
        </div>
        <Button className="w-full mt-2">이미지 다운로드</Button>
      </DialogContent>
    </Dialog>
  );

  // Product registration modal
  const renderProductFormModal = () => (
    <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">제품 등록</DialogTitle>
        </DialogHeader>
        <ProductRegistrationForm 
          onProductAdded={handleProductAdded} 
          address={address}
          onClose={() => setShowProductForm(false)}
        />
      </DialogContent>
    </Dialog>
  );

  // Helper function to render sections
  const renderSection = (sectionType: SectionType) => {
    switch(sectionType) {
      case 'hero':
        return <PeerSpaceHero config={config} isOwner={isOwner} />;
      case 'content':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <PeerSpaceContentSection 
                config={config} 
                contents={contents} 
                isOwner={isOwner} 
                onAddContent={handleAddContent}
                onAddProduct={handleShowProductForm}
              />
            </div>
            {config.sections.includes('activityFeed') && (
              <div className="lg:col-span-1">
                <PeerSpaceActivityFeed />
              </div>
            )}
          </div>
        );
      case 'community':
        return <PeerSpaceCommunitySection config={config} isOwner={isOwner} />;
      case 'events':
        return <PeerSpaceEventsSection 
          config={config} 
          events={[]} 
          quests={[]} 
          isOwner={isOwner} 
        />;
      case 'infoHub':
        return <PeerSpaceInfoHub config={config} />;
      case 'reviews':
        return <PeerSpaceReviewSection 
          config={config} 
          reviews={[]} 
          isOwner={isOwner} 
        />;
      case 'map':
        return config.location ? 
          <PeerSpaceMapSection 
            location={config.location} 
            title={config.title} 
          /> : null;
      case 'trust':
        return <PeerSpaceTrustSection config={config} />;
      case 'relatedMalls':
        return <PeerSpaceRelatedMallsSection />;
      case 'activityFeed':
        return null;
      case 'liveCollaboration':
        return <PeerSpaceLiveCollaboration />;
      default:
        return null;
    }
  };

  if (!address) {
    return (
      <div className="container mx-auto p-6">
        <EmptyState 
          title="404 - 피어스페이스를 찾을 수 없습니다"
          description="올바른 피어스페이스 주소인지 확인해주세요."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PeerSpaceHeader 
        config={config} 
        isOwner={isOwner} 
        onAddContent={handleAddContent} 
        onAddProduct={handleShowProductForm}
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Quick action buttons for non-owners */}
        {!isOwner && (
          <div className="flex mb-6 gap-2 flex-wrap">
            <Button onClick={handleFollow} className="flex-1">
              <Heart className="mr-1 h-4 w-4" /> 팔로우
            </Button>
            <Button onClick={handleAddRecommendation} variant="outline" className="flex-1">
              <ThumbsUp className="mr-1 h-4 w-4" /> 추천하기
            </Button>
            <BadgeSelector 
              onBadgeAdd={handleAddBadge} 
              currentBadges={config.badges} 
            />
            <Button onClick={handleMessage} variant="outline" className="flex-1">
              <MessageSquare className="mr-1 h-4 w-4" /> 메시지
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="mr-1 h-4 w-4" /> 공유
            </Button>
            <Button onClick={handleQRGenerate} variant="outline">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Render sections based on config */}
        <div className="space-y-10">
          {config.sections.map((section) => (
            <div key={section}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </main>
      
      <PeerSpaceFooter config={config} />
      
      {/* Modals */}
      {renderQRModal()}
      {renderProductFormModal()}
    </div>
  );
};

export default PeerSpaceHome;
