import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from './types';
import { Heart, MessageSquare, Share2, QrCode, Award, ThumbsUp, Settings } from 'lucide-react';
import { createContent, updateContent } from '@/services/contentService';
import { getPeerSpaceContents, savePeerSpaceContent } from '@/utils/peerSpaceStorage';
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
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
import PeerSpaceTabs from './PeerSpaceTabs';
import GuestbookSection from './GuestbookSection';
import QuestEventSection from './QuestEventSection';
import { Link } from 'react-router-dom';
import { add } from '@/utils/indexedDBService';

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
}

// Save section order to localStorage
const saveSectionOrder = (address: string, sections: SectionType[]) => {
  try {
    localStorage.setItem(`peer_space_${address}_sections`, JSON.stringify(sections));
  } catch (error) {
    console.error("Error saving section order:", error);
  }
};

// Get section order from localStorage
const getSectionOrder = (address: string, defaultSections: SectionType[]): SectionType[] => {
  try {
    const stored = localStorage.getItem(`peer_space_${address}_sections`);
    return stored ? JSON.parse(stored) : defaultSections;
  } catch (error) {
    console.error("Error loading section order:", error);
    return defaultSections;
  }
};

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ 
  isOwner, 
  address,
  config,
  onUpdateConfig 
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sections, setSections] = useState<SectionType[]>(
    getSectionOrder(address, config.sections)
  );
  const [hiddenSections, setHiddenSections] = useState<SectionType[]>(
    JSON.parse(localStorage.getItem(`peer_space_${address}_hidden_sections`) || '[]')
  );
  const { activeTab, handleTabChange, filterContentByTab } = usePeerSpaceTabs('featured');

  useEffect(() => {
    const loadContents = async () => {
      if (address) {
        try {
          // Load contents from localStorage based on the address
          const loadedContents = await getPeerSpaceContents(address);
          setContents(loadedContents);
          
          // Load section order from localStorage
          const storedSections = getSectionOrder(address, config.sections);
          setSections(storedSections);
          
          // Load hidden sections from localStorage
          const storedHiddenSections = localStorage.getItem(`peer_space_${address}_hidden_sections`);
          if (storedHiddenSections) {
            setHiddenSections(JSON.parse(storedHiddenSections));
          }
        } catch (error) {
          console.error("Error loading contents:", error);
        }
      }
    };
    loadContents();
  }, [address, config.sections]);

  // Persist hidden sections to localStorage whenever they change
  useEffect(() => {
    if (address) {
      localStorage.setItem(`peer_space_${address}_hidden_sections`, JSON.stringify(hiddenSections));
    }
  }, [hiddenSections, address]);

  const handleAddContent = async (formValues: ContentFormValues) => {
    if (!address) return;

    const now = new Date().toISOString();
    
    // Create a new content object
      const newContent: Omit<Content, 'id' | 'createdAt' | 'updatedAt'> = {
        peerSpaceAddress: address,
        title: formValues.title,
        description: formValues.description,
        imageUrl: formValues.imageUrl || '',
        type: formValues.type as ContentType,
        date: now,
        price: formValues.price ? Number(formValues.price) : 0,
        likes: 0,
        comments: 0,
        views: 0,
        saves: 0,
        externalUrl: '',
        tags: [],
        category: '',
        badges: [],
        ecosystem: {},
        attributes: {},
      };
    
    try {
      // Create content using service with explicit type assertion
      const contentId = await createContent(newContent);
      
      // Add the new content and update state
      const updatedContent: Content = {
        ...newContent,
        id: contentId,
        likes: 0,
        comments: 0,
        views: 0,
        saves: 0,
        createdAt: '',
        updatedAt: ''
      };
      
      const updatedContents = [...contents, updatedContent];
      setContents(updatedContents as Content[]);
      
      toast({
        title: "콘텐츠 추가 완료",
        description: "새로운 콘텐츠가 성공적으로 등록되었습니다.",
      });
    } catch (error) {
      console.error("콘텐츠 생성 오류:", error);
      toast({
        title: "콘텐츠 추가 실패",
        description: "콘텐츠 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleProductAdded = async (product: Content) => {
    // Save to IndexedDB
    await add('products', {
      ...product,
      peerSpaceAddress: address,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString()
    });
    
    // Add the product and update state
    const updatedContents = [...contents, {
      ...product,
      peerSpaceAddress: address,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString()
    }];
    setContents(updatedContents as Content[]);
    
    // Close product form dialog
    setShowProductForm(false);
  };

  const handleToggleSectionVisibility = (section: SectionType) => {
    if (hiddenSections.includes(section)) {
      setHiddenSections(hiddenSections.filter(s => s !== section));
      toast({
        title: "섹션 표시",
        description: `${getSectionDisplayName(section)} 섹션이 표시됩니다.`,
      });
    } else {
      setHiddenSections([...hiddenSections, section]);
      toast({
        title: "섹션 숨김",
        description: `${getSectionDisplayName(section)} 섹션이 숨겨졌습니다.`,
      });
    }
  };

  const handleMoveSectionUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };
  
  const handleMoveSectionDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };

  // Update the getSectionDisplayName function to handle all section types
  const getSectionDisplayName = (sectionType: SectionType): string => {
    const sectionNames: Record<string, string> = {
      'hero': '히어로',
      'content': '콘텐츠/상품',
      'community': '커뮤니티',
      'liveCollaboration': '실시간 연결',
      'livestream': '라이브 스트리밍',
      'infoHub': '정보 허브',
      'map': '지도',
      'introduction': '소개',
      'advertising': '광고',
      'reviews': '리뷰',
      'quests': '퀘스트',
      'events': '이벤트',
      'guestbook': '방명록',
      'trust': '신뢰도',
      'qrCodeList': 'QR 코드',
      'support': '고객 지원',
      'relatedMalls': '관련 피어몰',
      'activityFeed': '활동 피드',
      'about': '소개',
      'products': '상품',
      'services': '서비스',
      'contact': '연락처',
      'featured': '특징',
      'achievements': '업적',
      'learning': '학습'
    };
    
    return sectionNames[sectionType] || sectionType;
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
  
  const handleShowSettings = () => {
    setShowSettingsModal(true);
  };
  
  const handleContentClick = (content: Content) => {
    console.log('Content clicked:', content);
    // Implement content click functionality here
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

  // Settings modal for section management
  const renderSettingsModal = () => (
    <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">섹션 관리</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">섹션의 순서를 변경하거나 표시 여부를 설정하세요.</p>
          <ul className="space-y-3">
            {sections.map((section, index) => (
              <li key={section} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{getSectionDisplayName(section)}</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveSectionUp(index)}
                  >
                    ↑
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={index === sections.length - 1}
                    onClick={() => handleMoveSectionDown(index)}
                  >
                    ↓
                  </Button>
                  <Button 
                    variant={hiddenSections.includes(section) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleSectionVisibility(section)}
                  >
                    {hiddenSections.includes(section) ? "표시" : "숨김"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Helper function to render sections
  const renderSection = (sectionType: SectionType) => {
    // Skip rendering if the section is hidden
    if (hiddenSections.includes(sectionType)) {
      return null;
    }

    switch(sectionType) {
      case 'hero':
        return (
          <PeerSpaceHero 
            config={config} 
            isOwner={isOwner} 
            onAddBadge={handleAddBadge}
            onAddRecommendation={handleAddRecommendation}
            onFollow={handleFollow}
          />
        );
      case 'content':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
          <PeerSpaceTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            featuredContent={contents as Content[]}
            isOwner={isOwner}
            onAddContent={handleShowProductForm}
            onContentClick={handleContentClick}
          />
            </div>
            {!hiddenSections.includes('activityFeed') && (
              <div className="lg:col-span-1">
                <PeerSpaceActivityFeed />
              </div>
            )}
          </div>
        );
      case 'community':
        return (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">커뮤니티</h2>
              <Link to="/community">
                <Button variant="outline">
                  모든 게시글 보기
                </Button>
              </Link>
            </div>
            <PeerSpaceCommunitySection config={config} isOwner={isOwner} />
          </div>
        );
      case 'events':
        return (
          <QuestEventSection
            peerAddress={address}
            isOwner={isOwner}
          />
        );
      case 'infoHub':
        return <PeerSpaceInfoHub config={config} />;
      case 'reviews':
        return (
          <GuestbookSection
            peerAddress={address}
            isOwner={isOwner}
          />
        );
      case 'map':
        return config.location ? 
          <PeerSpaceMapSection 
            location={config.location} 
            title={config.title || ''} 
          /> : null;
      case 'trust':
        return <PeerSpaceTrustSection config={config} />;
      case 'relatedMalls':
        return <PeerSpaceRelatedMallsSection />;
      case 'activityFeed':
        return null; // Handled within content section
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
        {/* Quick action buttons */}
        <div className="flex mb-6 gap-2 flex-wrap items-center">
          {!isOwner && (
            <>
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
            </>
          )}
          
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="mr-1 h-4 w-4" /> 공유
          </Button>
          <Button onClick={handleQRGenerate} variant="outline">
            <QrCode className="h-4 w-4" />
          </Button>
          
          {isOwner && (
            <Button onClick={handleShowSettings} variant="outline" className="ml-auto">
              <Settings className="h-4 w-4 mr-1" /> 섹션 관리
            </Button>
          )}
        </div>

        {/* Render sections based on config */}
        <div className="space-y-10">
          {sections.map((section) => (
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
      {isOwner && renderSettingsModal()}
    </div>
  );
};

export default PeerSpaceHome;
