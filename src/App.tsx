import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom"; // useParams 추가
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import CurationLinks from "./pages/CurationLinks";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/Service";
import MyInfoPage from "./pages/MyInfoPage";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import PeerSpace from "./pages/PeerSpace";
import PeerSpaceSettings from "./pages/PeerSpaceSettings";
import ContentDetailPage from "./pages/ContentDetailPage";
import CustomerSupport from "./pages/CustomerSupport";
import CommunityDetailPage from "./pages/ContentDetailPage";
import PostDetailPage from "./pages/PostDetailPage";
import QRCodeGenerator from "@/components/feature-sections/QRCodeGenerator";
import PeermallsPage from "./pages/PeermallsPage"; // PeermallsPage import 추가
import ProductDetailPage from './components/peer-space/products/ProductDetailPage';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isPeerSpacePage = location.pathname.startsWith('/space/');

  return (
    <>
      {!isPeerSpacePage && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Shopping />} />
        <Route path="/peermalls" element={<PeermallsPage />} /> {/* 이 라인 수정 */}
        {/* <Route path="/products" element={< />} /> */}
        {/* <Route path="/curation-links" element={<CurationLinks />} /> */}
        <Route path="/create-qrcode" element={<QRCodeGenerator />} />
        <Route path="/space/:address/product/:productId" element={<ProductDetailPage />} />
        {/* <Route path="/space/:address/product/*" element={<ProductDetailPage />} /> */}
        {/* <Route path="/community" element={<Community />} /> 
        <Route path="/community/planet/:planetId" element={<Community />} /> 
        <Route path="/community/planet/:planetId/post/:postId" element={<Community />} /> */}

        {/* <Route path="/space/:address/community" element={<CommunityPage />} /> */}
        <Route path="/space/:address/community/:communityId" element={<CommunityDetailPage />} />
        <Route path="/space/:address/community/:communityId/post/:postId" element={<PostDetailPage />} />
        <Route path="/space/:address/community/:communityId/post/by-slug/:slug" element={<PostDetailPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        
        <Route path="/space/:address/*" element={<PeerSpace />} /> 
        {/* 
          기존 /space/:address 라우트 외에 /settings, /content/:contentId 등도 
          PeerSpace 컴포넌트 내부에서 Outlet과 중첩 라우팅으로 처리하는 것이 일반적입니다.
          만약 PeerSpaceSettings, ContentDetailPage가 PeerSpace 레이아웃을 공유하지 않는다면
          현재 구조를 유지해도 됩니다. 
          하지만 '/space/:address/community'는 PeerSpace 내부에서 처리해야 하므로 아래 라우트들은 제거합니다.
        */}
        
        <Route path="/space/:address/settings" element={<PeerSpaceSettings />} /> {/* PeerSpace 레이아웃 공유 여부 확인 필요 */}

        {/* 아래 /space/:address/community 관련 라우트들 제거 */}
        {/* 
        <Route path="/space/:address/community" element={<CommunityPage />} />
        <Route path="/space/:address/community/:communityId" element={<CommunityDetailPage />} />
        <Route path="/space/:address/community/:communityId/post/:postId" element={<PostDetailPage />} />
        <Route path="/space/:address/community/:communityId/post/by-slug/:slug" element={<PostDetailPage />} />
        */}

        <Route path="/customer-support" element={<CustomerSupport />} />
        {/* 변경된 채팅방 상세 경로 */}
        {/* <Route path="/community/planet/:planetId/chat/:roomId" element={<ChatRoomView />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isPeerSpacePage && <Footer />}
    </>
  );
};

const AppWithProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default AppWithProviders;
