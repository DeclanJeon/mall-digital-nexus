
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Content, PeerMallConfig, SectionType } from './types';
import { Heart, MessageSquare, Share2, QrCode } from 'lucide-react';
import { 
  getPeerSpaceContents, 
  addPeerSpaceContent, 
  savePeerSpaceContents 
} from '@/utils/peerSpaceStorage';
import { ContentFormValues } from './AddContentForm';
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

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
}

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ isOwner, address }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  
  // Basic config for the PeerSpace with correct section types
  const [config, setConfig] = useState<PeerMallConfig>({
    id: address || 'default-peer-space',
    title: '내 피어스페이스',
    description: '나만의 공간을 구성해보세요',
    owner: '나',
    peerNumber: 'P-00000-0000',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=default',
    badges: [],
    followers: 0,
    recommendations: 0,
    level: 1,
    experience: 0,
    nextLevelExperience: 100,
    isVerified: false,
    skin: 'default',
    sections: ['hero', 'content', 'community', 'events', 'reviews'] as SectionType[],
    customizations: {
      primaryColor: '#71c4ef',
      secondaryColor: '#3B82F6',
      showChat: true,
      allowComments: true,
      showBadges: true,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
      address: 'Seoul, South Korea'
    }
  });

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

  const handleShare = () => {
    toast({
      title: "공유하기",
      description: "링크가 클립보드에 복사되었습니다.",
    });
  };

  const handleFollow = () => {
    toast({
      title: "팔로우 완료",
      description: `${config.owner}님을 팔로우합니다.`,
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
        onAddContent={() => {}} 
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Quick action buttons for non-owners */}
        {!isOwner && (
          <div className="flex mb-6 gap-2">
            <Button onClick={handleFollow} className="flex-1">
              <Heart className="mr-1 h-4 w-4" /> 팔로우
            </Button>
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
    </div>
  );
};

export default PeerSpaceHome;
