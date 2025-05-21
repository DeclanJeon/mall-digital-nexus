
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from './types';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  QrCode, 
  Settings, 
  Home, 
  FileText, 
  Users, 
  LogOut,
  User,
  Mail,
  Clock,
  Bell,
  MapPin,
  Search,
  ChevronRight,
  Bookmark,
  Grid2X2,
  List,
  Star,
  CalendarDays,
  Image,
  PhoneCall,
  UserPlus,
  Plus
} from 'lucide-react';
import { createContent } from '@/services/contentService';
import { getPeerSpaceContents } from '@/utils/peerSpaceStorage';
import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
import { add } from '@/utils/indexedDBService';
import ProductRegistrationForm from './products/ProductRegistrationForm';
import EmptyState from './ui/EmptyState';
import ProductCard from '../shopping/ProductCard';
import BadgeSelector from './ui/BadgeSelector';
import PeerSpaceHeader from './layout/PeerSpaceHeader';
import EcosystemMap from '@/components/EcosystemMap';
import PeermallMap from '../peermall-features/PeermallMap';
import { Location } from '@/types/map';

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
  activeSection: 'home' | 'content' | 'community' | 'following' | 'guestbook';
  onNavigateToSection: (section: 'home' | 'content' | 'community' | 'following' | 'guestbook') => void;
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
  onUpdateConfig,
  activeSection,
  onNavigateToSection
}) => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(config.badges || []);
  const [isBadgeSelectorOpen, setIsBadgeSelectorOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>(getSectionOrder(address, config.sections || ['hero', 'content', 'community']));
  const [activeTab, setActiveTab] = useState<string>('all');
  const { activeTab: hookActiveTab, handleTabChange, filterContentByTab } = usePeerSpaceTabs();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load contents from localStorage
    const storedContents = getPeerSpaceContents(address);
    if (storedContents) {
      setContents(storedContents);
    }
  }, [address]);

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = localStorage.getItem(`peer_space_${address}_products`);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, [address]);

  useEffect(() => {
    // Save section order to localStorage whenever it changes
    saveSectionOrder(address, sectionOrder);
  }, [address, sectionOrder]);

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  const handleBadgeChange = (badges: string[]) => {
    setSelectedBadges(badges);
  };

  const handleUpdateBadges = () => {
    const updatedConfig = { ...config, badges: selectedBadges };
    onUpdateConfig(updatedConfig);
    setIsBadgeSelectorOpen(false);
  };

  const handleOpenBadgeSelector = () => {
    setIsBadgeSelectorOpen(true);
  };

  const handleCloseBadgeSelector = () => {
    setIsBadgeSelectorOpen(false);
  };

  const handleAddContent = async (content: ContentFormValues) => {
    try {
      const newContent: Content = {
        ...content,
        id: Date.now().toString(),
        peerSpaceAddress: address,
        likes: 0,
        comments: 0,
        views: 0,
        saves: 0,
        date: new Date().toISOString(), // Added required date field
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: content.type || ContentType.Article, // Ensure type is set
      };

      // Save to indexedDB
      await add('contents', newContent);

      // Optimistically update state
      setContents(prevContents => [...prevContents, newContent]);

      // Optionally, save to localStorage as well
      const storedContents = getPeerSpaceContents(address) || [];
      localStorage.setItem(`peer_space_${address}_contents`, JSON.stringify([...storedContents, newContent]));

      toast({
        title: "콘텐츠가 추가되었습니다",
        description: "새로운 콘텐츠가 성공적으로 추가되었습니다.",
      });
      setIsAddingContent(false);
    } catch (error) {
      toast({
        title: "콘텐츠 추가 실패",
        description: "콘텐츠 추가 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
      console.error("콘텐츠 추가 오류:", error);
    }
  };

  const handleAddProduct = (product: any) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      peerSpaceAddress: address,
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);

    // Save to localStorage
    localStorage.setItem(`peer_space_${address}_products`, JSON.stringify([...products, newProduct]));

    toast({
      title: "상품이 추가되었습니다",
      description: "새로운 상품이 성공적으로 추가되었습니다.",
    });
    setIsAddingProduct(false);
  };

  const handleSectionReorder = (newOrder: SectionType[]) => {
    setSectionOrder(newOrder);
    saveSectionOrder(address, newOrder);
  };

  const renderHomeSection = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">홈</h2>
      <p>피어스페이스 홈 섹션입니다. 여기에 피어스페이스에 대한 요약 정보나 주요 콘텐츠를 표시할 수 있습니다.</p>
      <Button onClick={handleOpenMap}>Show Map</Button>
      <PeermallMap 
        isOpen={isMapOpen} 
        onClose={handleCloseMap} 
        selectedLocation={
          config.location ? {
            lat: config.location.lat,
            lng: config.location.lng,
            address: config.location.address,
            title: config.name || 'Location' // Added required title field
          } : null
        } 
        allLocations={[{
          lat: 37.5665,
          lng: 126.9780,
          address: 'Seoul, South Korea',
          title: 'Seoul'
        }]} 
      />
    </div>
  );

  const renderContentSection = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">콘텐츠</h2>
        {isOwner && (
          <Button size="sm" onClick={() => setIsAddingContent(true)}>
            <Plus className="h-4 w-4 mr-2" />
            콘텐츠 추가
          </Button>
        )}
      </div>
      {contents.length === 0 ? (
        <EmptyState 
          title="콘텐츠가 없습니다"
          description="새로운 콘텐츠를 추가하여 피어스페이스를 풍성하게 만들어보세요."
          actionLabel={isOwner ? "콘텐츠 추가" : undefined}
          onAction={isOwner ? () => setIsAddingContent(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map(content => (
            <div key={content.id} className="border rounded-md p-4">
              <h3 className="font-semibold">{content.title}</h3>
              <p className="text-sm text-gray-500">{content.description}</p>
              <Link to={`/space/${address}/content/${content.id}`} className="text-blue-500 hover:underline">
                자세히 보기
              </Link>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새로운 콘텐츠 추가</DialogTitle>
          </DialogHeader>
          {/* <AddContentForm onSubmit={handleAddContent} /> */}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderCommunitySection = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">커뮤니티</h2>
      <p>피어스페이스 커뮤니티 섹션입니다. 여기에 커뮤니티 활동, 게시물 등을 표시할 수 있습니다.</p>
    </div>
  );

  const renderFollowingSection = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">팔로잉</h2>
      <p>피어스페이스 팔로잉 섹션입니다. 여기에 팔로우하는 다른 피어스페이스나 사용자를 표시할 수 있습니다.</p>
    </div>
  );

  const renderGuestbookSection = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">방명록</h2>
      <p>피어스페이스 방명록 섹션입니다. 여기에 방문자들이 남긴 메시지를 표시할 수 있습니다.</p>
    </div>
  );

  // Render appropriate content based on activeSection
  const renderMainContent = () => {
    switch (activeSection) {
      case 'content':
        return renderContentSection();
      case 'community':
        return renderCommunitySection();
      case 'following':
        return renderFollowingSection();
      case 'guestbook':
        return renderGuestbookSection();
      default:
        return renderHomeSection();
    }
  };

  return (
    <div>
      <PeerSpaceHeader 
        config={config}
        isOwner={isOwner}
        onAddContent={() => setIsAddingContent(true)}
        onAddProduct={() => setIsAddingProduct(true)}
      />
      <div className="container mx-auto">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default PeerSpaceHome;
