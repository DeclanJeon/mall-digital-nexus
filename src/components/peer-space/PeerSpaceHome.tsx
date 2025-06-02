import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Content, PeerMallConfig, SectionType } from '@/types/space';
import { Peermall } from '@/types/peermall';
import ProductDetailComponent from '@/components/shopping/products/ProductDetailComponent';
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
  Phone,
  UserPlus,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  ArrowUp,
  Map,
  Menu
} from 'lucide-react';
import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
import EmptyState from './ui/EmptyState';
import BadgeSelector from './ui/BadgeSelector';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BasicInfoSection from './sections/BasicInfoSection';
import PeerSpaceQRModal from './modals/PeerSpaceQRModal';
import PeerSpaceProductFormModal from './modals/PeerSpaceProductFormModal';
import PeerSpaceSettingsModal from './modals/PeerSpaceSettingsModal';
import PeerSpaceMapModal from './modals/PeerSpaceMapModal';
import PeerSpaceHomeSection from './sections/PeerSpaceHomeSection';
import PeerSpaceContentSection from './sections/PeerSpaceContentSection';
import PeerSpaceCommunitySection from './sections/PeerSpaceCommunitySection';
import PeerSpaceFollowingSection from './sections/PeerSpaceFollowingSection';
import PeerSpaceGuestbookSection from './sections/PeerSpaceGuestbookSection';
import { 
  generateMockProducts, 
  generateMockPosts, 
  guestbookData, 
  notificationsData, 
  alertsData, 
  sponsorsData, 
  heroSlides, 
  followingPeermalls 
} from './data/homeMockData';
import { saveSectionOrder, getSectionOrder, getSectionDisplayName } from './utils/peerSpaceUtils';
import { peermallStorage } from '@/services/storage/peermallStorage';
import productService from '@/services/productService';
import { Product } from '@/types/product';
import { Post } from '@/types/post';
import { PeerSpaceHomeProps } from '@/types/space';
import PeerSpaceHeader from '@/components/peer-space/layout/PeerSpaceHeader';
import LeftSideBar from '@/components/peer-space/layout/LeftSideBar';
import RightSideBar from '@/components/peer-space/layout/RightSideBar';
import RightSidebar from '@/components/peer-space/layout/RightSideBar';
import { cn } from '@/lib/utils';

// 🎯 데이터 변환 함수
const transformApiProductToProduct = (apiProduct: any, address: string, config: PeerMallConfig, peerMallKey: string): Product => ({
  productId: apiProduct.productKey || '',
  productKey: apiProduct.productKey || '',
  id: apiProduct.productKey || '',
  name: apiProduct.name || '',
  title: apiProduct.name || '',
  owner: address,
  description: apiProduct.description || '',
  price: apiProduct.price || 0,
  currency: 'KRW',
  discountPrice: apiProduct.discountPrice || null,
  distributor: apiProduct.distributor || '',
  manufacturer: apiProduct.manufacturer || '',
  imageUrl: apiProduct.imageUrl || '',
  rating: apiProduct.rating || 4.5,
  reviewCount: apiProduct.reviewCount || 10,
  peerMallName: config.peerMallName,
  peerMallKey: peerMallKey || '',
  category: apiProduct.category || '기타',
  tags: apiProduct.tags ? apiProduct.tags.split(',') : [],
  isBestSeller: apiProduct.isBestSeller || false,
  isNew: apiProduct.isNew || false,
  isRecommended: apiProduct.isRecommended || false,
  isCertified: apiProduct.isCertified || false,
  saleUrl: apiProduct.saleUrl || '',
  create_date: apiProduct.create_date || new Date().toISOString(),
  update_date: apiProduct.update_date || new Date().toISOString(),
  type: 'Product',
  peerSpaceAddress: address,
  date: apiProduct.create_date || new Date().toISOString(),
  likes: apiProduct.likes || 0,
  comments: apiProduct.comments || 0,
  views: apiProduct.views || 0,
  saves: apiProduct.saves || 0
});

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({ 
  isOwner, 
  address,
  config,
  peermall,
  onUpdateConfig,
  activeSection,
  onNavigateToSection,
  onDetailView
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Content[]>([]);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [currentView, setCurrentView] = useState<'list' | 'blog' | 'grid-small' | 'grid-medium' | 'grid-large' | 'masonry'>('list');
  const [sections, setSections] = useState<SectionType[]>(
    getSectionOrder(address, config.sections)
  );
  const [hiddenSections, setHiddenSections] = useState<SectionType[]>(
    JSON.parse(localStorage.getItem(`peer_space_${address}_hidden_sections`) || '[]')
  );
  const { activeTab, handleTabChange } = usePeerSpaceTabs('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showWidgets, setShowWidgets] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchParams] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  // 🎯 데이터 로딩
  useEffect(() => {
    const loadAllData = async () => {
      if (!address) return;
      
      try {
        console.log('🔄 데이터 로딩 시작...', { address, peerMallKey });
        
        const loadedProductsResponse = await productService.getProductList(address, peerMallKey);
        console.log('📦 API 응답 원본:', loadedProductsResponse);
        
        if (loadedProductsResponse && loadedProductsResponse.productList) {
          const transformedProducts = loadedProductsResponse.productList.map((apiProduct: any) => 
            transformApiProductToProduct(apiProduct, address, config, peerMallKey || '')
          );
          
          setProducts(transformedProducts);
          console.log('✅ 변환된 products:', transformedProducts);
        } else {
          console.warn('⚠️ API 응답에 productList가 없습니다:', loadedProductsResponse);
          setProducts([]);
        }
      } catch (error) {
        console.error('❌ 데이터 로딩 오류:', error);
        setProducts([]);
      }
    };

    loadAllData();
  }, [address, config.sections]);

  // 🎯 이벤트 핸들러들
  const handleProductDetailView = (productKey: string | number) => {
    const product = products.find(p => p.productKey === productKey || p.id === productKey);
    if (product) {
      setSelectedProduct(product);
      setShowProductDetail(true);
    }
  };

  const handleBackFromDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleMessage = () => {
    toast({ title: "메시지 보내기", description: "메시지 창이 열렸습니다." });
  };
  
  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  const handleQRGenerate = () => setShowQRModal(true);
  const handleShowProductForm = () => setShowProductForm(true);
  const handleShowSettings = () => {
    setShowSettingsModal(true);
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        toast({
          title: '링크가 클립보드에 복사되었습니다.',
          description: '이 링크를 공유하세요.',
        });
      })
      .catch((error) => {
        console.error('링크 복사 실패:', error);
        toast({
          title: '링크 복사에 실패했습니다.',
          description: '다시 시도해주세요.',
          variant: 'destructive',
        });
      });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!address) {
    return (
      <div className="container mx-auto p-6">
        <EmptyState 
          title="404 - 피어몰을 찾을 수 없습니다" 
          description="올바른 피어몰 주소인지 확인해주세요." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 🎯 레이아웃 컨테이너 */}
      <div className="flex min-h-screen">
        {/* 🖥️ 데스크톱 사이드바 */}
        {/* <LeftSideBar 
          isOwner={isOwner}
          onNavigateToSection={onNavigateToSection}
          className="hidden lg:block"
        /> */}

        {/* 🎯 메인 콘텐츠 영역 */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          "lg:ml-0", // 데스크톱에서는 사이드바가 이미 공간을 차지함
          "pb-20 lg:pb-0" // 모바일에서는 하단 네비게이션 공간 확보
        )}>
          {/* 📱 모바일 헤더 */}
          <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {config.peerMallName?.charAt(0) || 'P'}
                  </span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-sm">
                    {config.peerMallName}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {address?.slice(0, 8)}...
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="p-2"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleQRGenerate}
                  className="p-2"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 🎯 콘텐츠 영역 */}
          <div className="flex-1">
            <div className="p-4 lg:p-6">
              <div className="max-w-full">
                {showProductDetail && selectedProduct ? (
                  <ProductDetailComponent
                    product={selectedProduct}
                    peerMallName={config.peerMallName}
                    peerMallKey={peerMallKey || ''}
                    onBack={handleBackFromDetail}
                    isOwner={isOwner}
                  />
                ) : (
                  <div className="space-y-6">
                    {activeSection === 'space' && (
                      <PeerSpaceHomeSection
                        isOwner={isOwner}
                        address={address}
                        products={products}
                        config={config}
                        onNavigateToSection={onNavigateToSection}
                        posts={posts}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        handleShowProductForm={handleShowProductForm}
                        activeSection={activeSection}
                        onDetailView={handleProductDetailView}
                      />
                    )}
                    
                    {activeSection === 'products' && (
                      <PeerSpaceContentSection
                        isOwner={isOwner}
                        address={address}
                        config={config}
                        products={products}
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        handleShowProductForm={handleShowProductForm}
                        onDetailView={handleProductDetailView}
                      />
                    )}
                    
                    {activeSection === 'community' && (
                      <PeerSpaceCommunitySection
                        isOwner={isOwner}
                        config={config}
                        posts={posts}
                        filteredPosts={filteredPosts}
                      />
                    )}
                    
                    {activeSection === 'following' && (
                      <PeerSpaceFollowingSection />
                    )}
                    
                    {activeSection === 'guestbook' && (
                      <PeerSpaceGuestbookSection />
                    )}
                    
                    {activeSection === 'settings' && (
                      <BasicInfoSection
                        config={config}
                        peermall={peermall}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* 🖥️ 데스크톱 우측 사이드바 */}
        {/* <RightSideBar className="hidden xl:block" /> */}
      </div>
      
      {/* 🎯 모달들 */}
      <PeerSpaceQRModal 
        showQRModal={showQRModal} 
        setShowQRModal={setShowQRModal} 
        address={address} 
      />
      
      <PeerSpaceProductFormModal 
        showProductForm={showProductForm} 
        setShowProductForm={setShowProductForm} 
        address={address} 
        setProducts={setProducts} 
        setContents={setContents} 
        products={products} 
        contents={contents} 
      />
      
      {isOwner && (
        <PeerSpaceSettingsModal 
          showSettingsModal={showSettingsModal} 
          setShowSettingsModal={setShowSettingsModal} 
          address={address} 
          sections={sections} 
          setSections={setSections} 
          hiddenSections={hiddenSections} 
          setHiddenSections={setHiddenSections} 
        />
      )}
      
      <PeerSpaceMapModal 
        showMapModal={showMapModal} 
        setShowMapModal={setShowMapModal} 
      />
    </div>
  );
};

export default PeerSpaceHome;