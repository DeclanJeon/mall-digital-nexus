import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from './types';
import { Heart, MessageSquare, Share2, QrCode, Award, ThumbsUp, Settings } from 'lucide-react';
import { createContent } from '@/services/contentService'; // updateContent는 사용되지 않으므로 제거 가능
import { getPeerSpaceContents } from '@/utils/peerSpaceStorage'; // savePeerSpaceContent는 사용되지 않으므로 제거 가능
import PeerSpaceHero from './PeerSpaceHero';
import PeerSpaceInfoHub from './PeerSpaceInfoHub';

import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
import PeerSpaceTabs from './PeerSpaceTabs';
import { Link } from 'react-router-dom';
import { add } from '@/utils/indexedDBService';
import PeerSpaceRelatedMallsSection from './sections/PeerSpaceRelatedMallsSection';

import ProductRegistrationForm from './products/ProductRegistrationForm';
import EmptyState from './ui/EmptyState';
import PeerSpaceFooter from './layout/PeerSpaceFooter';
import BadgeSelector from './ui/BadgeSelector';
import PeerSpaceActivityFeed from './others/PeerSpaceActivityFeed';
import PeerSpaceMapSection from './sections/PeerSpaceMapSection';
import PeerSpaceHeader from './layout/PeerSpaceHeader';

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
  const { activeTab, handleTabChange } = usePeerSpaceTabs('product'); // filterContentByTab 제거 (contents 직접 필터링 안 함)

  useEffect(() => {
    const loadContents = async () => {
      if (address) {
        try {
          const loadedContents = await getPeerSpaceContents(address);
          setContents(loadedContents);
          
          const storedSections = getSectionOrder(address, config.sections);
          setSections(storedSections);
          
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

  useEffect(() => {
    if (address) {
      localStorage.setItem(`peer_space_${address}_hidden_sections`, JSON.stringify(hiddenSections));
    }
  }, [hiddenSections, address]);

  const handleAddContent = async (formValues: ContentFormValues) => {
    if (!address) return;
    const now = new Date().toISOString();
    const newContentData: Omit<Content, 'id' | 'createdAt' | 'updatedAt'> = {
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
      externalUrl: formValues.externalUrl || '',
      tags: formValues.tags ? formValues.tags.split(',').map(tag => tag.trim()) : [],
      category: formValues.category || '',
      badges: [], // 기본값 또는 formValues에서
      ecosystem: {}, // 기본값 또는 formValues에서
      attributes: {}, // 기본값 또는 formValues에서
    };
    try {
      const contentId = await createContent(newContentData);
      const newFullContent: Content = {
        ...newContentData,
        id: contentId,
        createdAt: now,
        updatedAt: now,
      };
      const updatedContents = [...contents, newFullContent];
      setContents(updatedContents);
      // await savePeerSpaceContent(address, newFullContent); // 개별 저장 대신 전체 저장으로 변경 가능성
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


  const handleToggleSectionVisibility = (section: SectionType) => {
    if (hiddenSections.includes(section)) {
      setHiddenSections(hiddenSections.filter(s => s !== section));
      toast({ title: "섹션 표시", description: `${getSectionDisplayName(section)} 섹션이 표시됩니다.` });
    } else {
      setHiddenSections([...hiddenSections, section]);
      toast({ title: "섹션 숨김", description: `${getSectionDisplayName(section)} 섹션이 숨겨졌습니다.` });
    }
  };

  const handleMoveSectionUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };
  
  const handleMoveSectionDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    setSections(newSections);
    saveSectionOrder(address, newSections);
  };

  const getSectionDisplayName = (sectionType: SectionType): string => {
    const sectionNames: Record<SectionType, string> = {
      'hero': '히어로', 'content': '콘텐츠/상품', 'community': '커뮤니티', 'about': '소개',
      'products': '제품', 'services': '서비스', 'events': '이벤트', 'reviews': '리뷰',
      'contact': '연락처', 'map': '지도', 'guestbook': '방명록', 'trust': '신뢰도',
      'featured': '추천', 'achievements': '성과', 'learning': '학습', 'quests': '퀘스트',
      'infoHub': '정보 허브', 'activityFeed': '활동 피드', 'relatedMalls': '관련 피어몰',
      'liveCollaboration': '실시간 연결', 'livestream': '라이브 스트림'
    };
    return sectionNames[sectionType] || sectionType;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "공유하기", description: "링크가 클립보드에 복사되었습니다." });
  };

  const handleFollow = () => {
    const updatedConfig = { ...config, followers: (config.followers || 0) + 1 };
    onUpdateConfig(updatedConfig);
    toast({ title: "팔로우 완료", description: `${config.owner}님을 팔로우합니다.` });
  };

  const handleAddRecommendation = () => {
    const updatedConfig = { ...config, recommendations: (config.recommendations || 0) + 1 };
    onUpdateConfig(updatedConfig);
    toast({ title: "추천 완료", description: "해당 피어스페이스를 추천하였습니다." });
  };

  const handleAddBadge = (badge: string) => {
    if (config.badges.includes(badge)) {
      toast({ title: "이미 추가된 뱃지", description: "이미 추가한 뱃지입니다.", variant: "destructive" });
      return;
    }
    const updatedConfig = { ...config, badges: [...config.badges, badge] };
    onUpdateConfig(updatedConfig);
    toast({ title: "뱃지 추가 완료", description: "뱃지가 성공적으로 추가되었습니다." });
  };

  const handleMessage = () => {
    toast({ title: "메시지 보내기", description: "메시지 창이 열렸습니다." });
  };

  const handleQRGenerate = () => setShowQRModal(true);
  const handleShowProductForm = () => setShowProductForm(true);
  const handleShowSettings = () => setShowSettingsModal(true);
  
  const handleContentClick = (contentItem: Content) => { // 파라미터 이름 변경
    console.log('Content clicked:', contentItem);
  };

  const renderQRModal = () => (
    <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-xl font-bold">내 스페이스 QR 코드</DialogTitle></DialogHeader>
        <div className="p-4 flex justify-center">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">QR 코드 영역</div>
        </div>
        <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">{`https://peermall.com/space/${address}`}</div>
        <Button className="w-full mt-2">이미지 다운로드</Button>
      </DialogContent>
    </Dialog>
  );

  const renderProductFormModal = () => (
    <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader><DialogTitle className="text-xl font-bold">제품 등록</DialogTitle></DialogHeader>
        <ProductRegistrationForm 
          onSubmit={async (productData) => {
            const now = new Date().toISOString();
            const newProduct: Content = {
              ...productData,
              id: `prod-${Date.now()}`,
              peerSpaceAddress: address,
              title: productData.title || '',
              description: productData.description || '',
              type: 'product',
              date: now,
              createdAt: now,
              updatedAt: now,
              likes: productData.likes || 0,
              comments: productData.comments || 0,
              views: productData.views || 0,
              saves: productData.saves || 0,
              imageUrl: productData.imageUrl || '',
              price: productData.price || 0,
              isExternal: false,
              externalUrl: '',
              source: '',
              tags: [],
              category: '',
              badges: [],
              ecosystem: {},
              attributes: {}
            };
            await add('products', newProduct);
            const updatedContents = [...contents, newProduct];
            setContents(updatedContents);
            setShowProductForm(false);
            toast({ title: "제품 등록 완료", description: `${newProduct.title} 제품이 등록되었습니다.` });
          }}
          address={address}
          onClose={() => setShowProductForm(false)}
        />
      </DialogContent>
    </Dialog>
  );

  const renderSettingsModal = () => (
    <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-xl font-bold">섹션 관리</DialogTitle></DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">섹션의 순서를 변경하거나 표시 여부를 설정하세요.</p>
          <ul className="space-y-3">
            {sections.map((section, index) => (
              <li key={section} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{getSectionDisplayName(section)}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled={index === 0} onClick={() => handleMoveSectionUp(index)}>↑</Button>
                  <Button variant="outline" size="sm" disabled={index === sections.length - 1} onClick={() => handleMoveSectionDown(index)}>↓</Button>
                  <Button variant={hiddenSections.includes(section) ? "default" : "outline"} size="sm" onClick={() => handleToggleSectionVisibility(section)}>
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

  const renderSection = (sectionType: SectionType) => {
    if (hiddenSections.includes(sectionType)) return null;

    switch(sectionType) {
      // case 'hero':
      //   return (
      //     <PeerSpaceHero
      //       config={config}
      //       isOwner={isOwner}
      //       onAddBadge={handleAddBadge}
      //       onAddRecommendation={handleAddRecommendation}
      //       onFollow={handleFollow}
      //       onUpdateConfig={(updatedConfig) => { // onUpdateConfig 핸들러 추가
      //         onUpdateConfig(updatedConfig); // PeerSpace.tsx로 전파 (선택적, App 레벨에서 관리 시)
      //         // PeerSpaceHome 내부에서도 config 상태를 직접 업데이트 할 수 있다면 여기서 처리
      //         // 예: setConfig(updatedConfig); // 만약 config가 PeerSpaceHome의 상태라면
      //         // localStorage에도 저장
      //         try {
      //           localStorage.setItem(`peer_space_${address}_config`, JSON.stringify(updatedConfig));
      //           // 부모 컴포넌트(PeerSpace.tsx)에서 config를 관리하고 prop으로 내려주므로,
      //           // onUpdateConfig를 통해 부모에게 알리고 부모가 localStorage를 업데이트하게 할 수도 있음.
      //           // 현재 onUpdateConfig는 PeerSpace.tsx에서 내려오므로 그곳에서 localStorage 업데이트를 담당.
      //           toast({ title: "설정 업데이트됨", description: "커버 이미지가 변경되었습니다."});
      //         } catch (error) {
      //           console.error("Error saving updated config to localStorage:", error);
      //           toast({ title: "오류", description: "설정 저장 중 오류 발생", variant: "destructive"});
      //         }
      //       }}
      //     />
      //   );
      case 'content':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <PeerSpaceTabs activeTab={activeTab} onTabChange={handleTabChange} contents={contents} isOwner={isOwner} onAddContentClick={handleShowProductForm} onContentClick={handleContentClick} onEditContentClick={() => {}} onDeleteContentClick={() => {}} onSaveContentClick={() => {}} />
            </div>
            {!hiddenSections.includes('activityFeed') && <div className="lg:col-span-1"><PeerSpaceActivityFeed /></div>}
          </div>
        );
      // case 'community':
      //   return (
      //     <div id="peerspace-community-section" className="mb-10 scroll-mt-20">
      //       <div className="flex justify-between items-center mb-6">
      //         <h2 className="text-2xl font-bold text-gray-800">커뮤니티</h2>
      //         <Link to={`/space/${address}/community`}>
      //           <Button variant="outline">피어스페이스 커뮤니티 바로가기</Button>
      //         </Link>
      //       </div>
      //       <p className="text-gray-600">이 피어스페이스와 관련된 커뮤니티 활동, 게시판, 채팅방 등을 확인하려면 위 버튼을 클릭하세요.</p>
      //     </div>
      //   );
      // case 'events':
      //   // PeerSpaceEventsProps에 맞게 quests 제거, config와 isOwner는 전달
      //   return <PeerSpaceEventsSection events={[]} isOwner={isOwner} config={config} />;
      // case 'infoHub':
      //   return <PeerSpaceInfoHub config={config} />;
      // case 'reviews':
      //   return <PeerSpaceReviewSection config={config} isOwner={isOwner} />;
      case 'map':
        return (
          <PeerSpaceMapSection
            location={typeof config.location === 'string' ? undefined : config.location} // 문자열이면 undefined로 처리 (구조에 맞게)
            title={config.title}
            isOwner={isOwner}
            onLocationUpdate={(newLocation) => {
              const updatedConfig = { ...config, location: newLocation };
              onUpdateConfig(updatedConfig); // 상위 컴포넌트(PeerSpace.tsx)로 전파
              // localStorage에도 저장 (PeerSpace.tsx에서 처리하거나 여기서 직접)
              try {
                localStorage.setItem(`peer_space_${address}_config`, JSON.stringify(updatedConfig));
                toast({ title: "위치 정보 업데이트됨", description: `새로운 위치: ${newLocation.address}` });
              } catch (error) {
                console.error("Error saving updated location to localStorage:", error);
                toast({ title: "오류", description: "위치 정보 저장 중 오류 발생", variant: "destructive"});
              }
            }}
          />
        );
      // case 'trust':
      //   return <PeerSpaceTrustSection config={config} />;
      case 'relatedMalls':
        return <PeerSpaceRelatedMallsSection />;
      case 'activityFeed': return null; // 'content' 섹션 내에서 처리
      // case 'liveCollaboration': return <PeerSpaceLiveCollaboration />;
      // case 'livestream':
      //   return <div className="mb-10"><h2 className="text-2xl font-bold mb-6">라이브 스트림</h2><div className="bg-gray-50 p-8 rounded-lg text-center"><p className="text-gray-500">라이브 스트림이 현재 없습니다.</p></div></div>;
      default: return null;
    }
  };

  if (!address) {
    return <div className="container mx-auto p-6"><EmptyState title="404 - 피어스페이스를 찾을 수 없습니다" description="올바른 피어스페이스 주소인지 확인해주세요." /></div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PeerSpaceHeader config={config} isOwner={isOwner} onAddContent={handleAddContent} onAddProduct={handleShowProductForm} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex mb-6 gap-2 flex-wrap items-center">
          {!isOwner && (
            <>
              <Button onClick={handleFollow} className="flex-1"><Heart className="mr-1 h-4 w-4" /> 팔로우</Button>
              <Button onClick={handleAddRecommendation} variant="outline" className="flex-1"><ThumbsUp className="mr-1 h-4 w-4" /> 추천하기</Button>
              <BadgeSelector onBadgeAdd={handleAddBadge} currentBadges={config.badges} />
              <Button onClick={handleMessage} variant="outline" className="flex-1"><MessageSquare className="mr-1 h-4 w-4" /> 메시지</Button>
            </>
          )}
          {/* <Button onClick={handleShare} variant="outline" className="flex-1"><Share2 className="mr-1 h-4 w-4" /> 공유</Button> */}
          {/* <Button onClick={handleQRGenerate} variant="outline"><QrCode className="h-4 w-4" /></Button> */}
          {/* {isOwner && <Button onClick={handleShowSettings} variant="outline" className="ml-auto"><Settings className="h-4 w-4 mr-1" /> 섹션 관리</Button>} */}
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </main>
      
      <PeerSpaceFooter config={config} />
      
      {renderQRModal()}
      {renderProductFormModal()}
      {isOwner && renderSettingsModal()}
      {/* IntegratedPlanetCreationWizard는 Community.tsx에서 관리되므로 여기서는 제거 */}
    </div>
  );
};

export default PeerSpaceHome;
