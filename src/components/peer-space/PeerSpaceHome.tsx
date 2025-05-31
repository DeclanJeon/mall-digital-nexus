import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Content, ContentType, PeerMallConfig, SectionType } from '@/types/space';
import { Product, isProduct } from '@/types/product';
import { Peermall } from '@/types/peermall';
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
  Map
} from 'lucide-react';
import { createContent } from '@/services/contentService';
// import { getPeerSpaceContents } from '@/utils/peerSpaceStorage';
import { ContentFormValues } from './forms/AddContentForm';
import { usePeerSpaceTabs } from '@/hooks/usePeerSpaceTabs';
// import { add } from '@/utils/indexedDBService';
import EmptyState from './ui/EmptyState';
import ProductCard from '@/components/shopping/products/ProductCard';
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

interface PeerSpaceHomeProps {
  isOwner: boolean;
  address: string;
  config: PeerMallConfig;
  peermall: Peermall | null;
  onUpdateConfig: (updatedConfig: PeerMallConfig) => void;
  activeSection: SectionType;
  onNavigateToSection: (section: SectionType) => void;
  onDetailView?: (productId: string | number) => void;
}


// 🎯 데이터 변환 함수 분리
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
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
  const [ searchParams ] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  useEffect(() => {

     const loadAllData = async () => {
       if (!address) return;
       
      try {
        console.log('🔄 데이터 로딩 시작...', { address, peerMallKey });
        
        // 🎯 API 한 번만 호출!
        const loadedProductsResponse = await productService.getProductList(address, peerMallKey);
        console.log('📦 API 응답 원본:', loadedProductsResponse);
        
        if (loadedProductsResponse && loadedProductsResponse.productList) {
          // 🔥 데이터 변환
          const transformedProducts = loadedProductsResponse.productList.map((apiProduct: any) => 
            transformApiProductToProduct(apiProduct, address, config, peerMallKey || '')
          );
          
          setProducts(transformedProducts);
          console.log('✅ 변환된 products:', transformedProducts);
          console.log('🔍 첫 번째 제품의 productKey:', transformedProducts[0]?.productKey);
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

  const handleMessage = () => {
    toast({ title: "메시지 보내기", description: "메시지 창이 열렸습니다." });
  };
  
  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  const handleQRGenerate = () => setShowQRModal(true);
  const handleShowProductForm = () => setShowProductForm(true);
  const handleShowSettings = () => setShowSettingsModal(true);
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!address) {
    return <div className="container mx-auto p-6"><EmptyState title="404 - 피어몰을 찾을 수 없습니다" description="올바른 피어몰 주소인지 확인해주세요." /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-0 h-full z-20">
        <div className="flex flex-col h-full">
          {/* 로고 영역 */}
          <div className="p-4 border-b">
            <Link to={`/space/${address}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {config.profileImage ? (
                  <img src={config.profileImage} alt="Space logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-blue-500">{config.peerMallName.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm truncate max-w-[180px]">{config.peerMallName}</h3>
                <span className="text-xs text-gray-500">{config.peerNumber}</span>
              </div>
            </Link>
          </div>

          {/* 메뉴 영역 */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateToSection('space')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'space' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>홈</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('products')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'products' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span>제품</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('community')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'community' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>커뮤니티</span>
                </button>
              </li>
              {/* <li>
                <button 
                  onClick={() => onNavigateToSection('following')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'following' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>팔로잉 피어몰</span>
                </button>
              </li> */}
              {/* <li>
                <button 
                  onClick={() => onNavigateToSection('guestbook')}
                  className={`w-full flex items-center p-2 rounded-lg ${activeSection === 'guestbook' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <span>방명록</span>
                </button>
              </li> */}
              
              <li className="pt-4 mt-4 border-t">
                {isOwner ? (
                  <Link to={`/space/${address}/settings`} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5 mr-3" />
                    <span>내 피어몰 관리</span>
                  </Link>
                ) : (
                  <button onClick={handleMessage} className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <span>메시지 보내기</span>
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {/* 하단 프로필 */}
          <div className="border-t p-4">
            <div className="flex items-center justify-center"> 
              <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>홈으로 가기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="ml-64 flex-1">
        {/* 상단 검색 영역 */}
        <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            <input 
              type="text" 
              placeholder="제품, 콘텐츠, 게시물 검색..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleQRGenerate}>
              <QrCode className="w-5 h-5" />
            </Button>
            {/* <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button> */}
            {/* {isOwner && (
              <Button variant="ghost" size="sm" onClick={handleShowSettings}>
                <Settings className="w-5 h-5" />
              </Button>
            )} */}
          </div>
        </div>

        <div className="flex p-6">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 pr-6">
            {activeSection === 'space' && (
            <PeerSpaceHomeSection
              isOwner={isOwner}
              address={address}
              config={config}
              onNavigateToSection={onNavigateToSection}
              products={products}
              posts={posts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleShowProductForm={handleShowProductForm}
              activeSection={activeSection}
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
                onDetailView={onDetailView}
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

          {/* 오른쪽 사이드바 */}
          <div className="w-80 flex-shrink-0">
            {/* 공지사항 섹션 */}
            {/* <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="font-bold text-lg">공지사항</h3>
              </div>
              <div className="p-4">
                {notificationsData.slice(0, 3).map(notice => (
                  <div 
                    key={notice.id} 
                    className={`p-3 mb-2 last:mb-0 rounded-lg cursor-pointer ${
                      notice.important ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h4 className="font-medium text-sm">{notice.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                  </div>
                ))}
                
                <Button variant="link" className="w-full mt-2 text-blue-600">
                  모든 공지 보기
                </Button>
              </div>
            </div> */}
            
            {/* 알림 섹션 */}
            {/* <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">최근 알림</h3>
                <Badge variant="outline">{alertsData.filter(a => !a.read).length}</Badge>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {alertsData.slice(0, 3).map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-3 bg-gray-50 rounded-lg border-l-4 ${
                        alert.read ? 'border-gray-300' : 'border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
            
            {/* 광고 섹션 */}
            {/* <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-bold text-lg">스폰서</h3>
              </div>
              <div className="p-4">
                {sponsorsData.map(sponsor => (
                  <div key={sponsor.id} className="mb-4 last:mb-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-32 overflow-hidden">
                      <img src={sponsor.imageUrl} alt={sponsor.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm">{sponsor.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{sponsor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            
            {/* 피어맵 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">위치</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48 relative mb-3">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Button onClick={handleOpenMap} className="bg-white text-blue-600">
                      <Map className="w-4 h-4 mr-2" />
                      지도 보기
                    </Button>
                  </div>
                  <div className="absolute inset-0 opacity-60" onClick={handleOpenMap}>
                    {/* EcosystemMap 컴포넌트가 PeerSpaceHome.tsx에서 직접 사용되지 않으므로 제거 */}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{config.location && typeof config.location !== 'string' ? config.location.address : '위치 정보 없음'}</p>
                      {config.location && typeof config.location !== 'string' && (
                        <p className="text-xs text-gray-500 mt-1">좌표: {config.location.lat}, {config.location.lng}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 모달 렌더링 */}
      <PeerSpaceQRModal showQRModal={showQRModal} setShowQRModal={setShowQRModal} address={address} />
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
      <PeerSpaceMapModal showMapModal={showMapModal} setShowMapModal={setShowMapModal} />
    </div>
  );
};

export default PeerSpaceHome;
