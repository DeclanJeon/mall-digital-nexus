// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet, useLocation, useParams, useSearchParams } from "react-router-dom"; // useParams 추가
// import Index from "./pages/Index";
// import Shopping from "./pages/Shopping";
// import CurationLinks from "./pages/CurationLinks";
// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";
// import ServicePage from "./pages/Service";
// import MyInfoPage from "./pages/MyInfoPage";
// import Footer from "./components/layout/Footer";
// import Header from "./components/layout/Header";
// import PeerSpace from "./pages/PeerSpace";
// import PeerSpaceSettings from "./pages/PeerSpaceSettings";
// import ContentDetailPage from "./pages/ContentDetailPage";
// import CustomerSupport from "./pages/CustomerSupport";
// import CommunityDetailPage from "./pages/ContentDetailPage";
// import PostDetailPage from "./pages/PostDetailPage";
// import QRCodeGenerator from "@/components/feature-sections/QRCodeGenerator";
// import PeermallsPage from "./pages/PeermallsPage"; // PeermallsPage import 추가
import ProductDetailPage from '@/components/peer-space/products/ProductDetailPage';

// import PeerSpaceHeader from "./components/peer-space/layout/PeerSpaceHeader";
// import RightSideBar from "./components/peer-space/layout/RightSideBar";
// import LeftSideBar from "./components/peer-space/layout/LeftSideBar";
// import { useState } from "react";
// import { SectionType } from "./types/space";

// const queryClient = new QueryClient();

// const AppContent = () => {
//   const location = useLocation();
//   const isPeerSpacePage = location.pathname.startsWith('/space/');

//   const [searchQuery, setSearchQuery] = useState('');
//   const [sections, setSections] = useState<SectionType[]>([]);

//   const isOwner = true; // 테스트용

//   return (
//     <>
//       {!isPeerSpacePage && <Header />}
//       {isPeerSpacePage && <PeerSpaceHeader
//         isOwner={isOwner}
//         onSearchChange={setSearchQuery}
//       />}

//       {isPeerSpacePage && <LeftSideBar />}

//       {isPeerSpacePage &&
//         <RightSideBar
//           customSections={sections}
//           showLocationSection={true}
//         />
//       }

//       <Routes>
//         <Route path="/" element={<Index />} />
//         <Route path="/products" element={<Shopping />} />
//         <Route path="/peermalls" element={<PeermallsPage />} /> {/* 이 라인 수정 */}
//         {/* <Route path="/products" element={< />} /> */}
//         {/* <Route path="/curation-links" element={<CurationLinks />} /> */}
//         <Route path="/create-qrcode" element={<QRCodeGenerator />} />
//         <Route path="/space/:address/product/*" element={<PeerSpace />} />
//         {/* <Route path="/community" element={<Community />} /> 
//         <Route path="/community/planet/:planetId" element={<Community />} /> 
//         <Route path="/community/planet/:planetId/post/:postId" element={<Community />} /> */}

//         {/* <Route path="/space/:address/community" element={<CommunityPage />} /> */}
//         <Route path="/space/:address/community/:communityId" element={<CommunityDetailPage />} />
//         <Route path="/space/:address/community/:communityId/post/:postId" element={<PostDetailPage />} />
//         <Route path="/space/:address/community/:communityId/post/by-slug/:slug" element={<PostDetailPage />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/service" element={<ServicePage />} />
//         <Route path="/my-info" element={<MyInfoPage />} />
        
//         <Route path="/space/:address/*" element={<PeerSpace />} /> 
//         {/* 
//           기존 /space/:address 라우트 외에 /settings, /content/:contentId 등도 
//           PeerSpace 컴포넌트 내부에서 Outlet과 중첩 라우팅으로 처리하는 것이 일반적입니다.
//           만약 PeerSpaceSettings, ContentDetailPage가 PeerSpace 레이아웃을 공유하지 않는다면
//           현재 구조를 유지해도 됩니다. 
//           하지만 '/space/:address/community'는 PeerSpace 내부에서 처리해야 하므로 아래 라우트들은 제거합니다.
//         */}
        
//         <Route path="/space/:address/settings" element={<PeerSpaceSettings />} /> {/* PeerSpace 레이아웃 공유 여부 확인 필요 */}

//         {/* 아래 /space/:address/community 관련 라우트들 제거 */}
//         {/* 
//         <Route path="/space/:address/community" element={<CommunityPage />} />
//         <Route path="/space/:address/community/:communityId" element={<CommunityDetailPage />} />
//         <Route path="/space/:address/community/:communityId/post/:postId" element={<PostDetailPage />} />
//         <Route path="/space/:address/community/:communityId/post/by-slug/:slug" element={<PostDetailPage />} />
//         */}

//         <Route path="/customer-support" element={<CustomerSupport />} />
//         {/* 변경된 채팅방 상세 경로 */}
//         {/* <Route path="/community/planet/:planetId/chat/:roomId" element={<ChatRoomView />} /> */}

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       {!isPeerSpacePage && <Footer />}
//     </>
//   );
// };

// const AppWithProviders = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <HelmetProvider>
//         <TooltipProvider>
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <AppContent />
//           </BrowserRouter>

// Pages
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/Service";
import MyInfoPage from "./pages/MyInfoPage";
import CustomerSupport from "./pages/CustomerSupport";
import PeermallsPage from "./pages/PeermallsPage";

// PeerSpace related
import PeerSpace from "./pages/PeerSpace";
import PeerSpaceSettings from "./pages/PeerSpaceSettings";
import ContentDetailPage from "./pages/ContentDetailPage";
import PostDetailPage from "./pages/PostDetailPage";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import PeerSpaceLayout from "@/components/peer-space/layout/PeerSpaceLayout";

// Features
import QRCodeGenerator from "@/components/feature-sections/QRCodeGenerator";
import ProductDetailComponent from "./components/shopping/products/ProductDetailComponent";
import PeerSpaceContentLayout from "./components/peer-space/layout/PeerSpaceContentLayout";

const queryClient = new QueryClient();

// App.tsx에서 이 부분이 제대로 작동하는지 확인
const isPeerSpace = location.pathname.startsWith('/space/');
console.log('Current path:', location.pathname);
console.log('isPeerSpace:', isPeerSpace); // 이게 true로 나오는지 확인


/**
 * 메인 레이아웃을 사용하는 라우트들
 */
const MainLayoutRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Shopping />} />
        <Route path="/peermalls" element={<PeermallsPage />} />
        <Route path="/create-qrcode" element={<QRCodeGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
      </Routes>
    </MainLayout>
  );
};

/**
 * PeerSpace 레이아웃을 사용하는 라우트들
 */
const ProductDetailPageWrapper = () => {
  // ProductDetailPage는 URL 파라미터를 직접 사용하므로 별도의 props 전달 없이 렌더링
  return <ProductDetailPage />;
};

// const PeerSpaceRoutes = () => {
//   return (
//     <PeerSpaceLayout>
//       <Routes>
//         {/* PeerSpace 메인 */}
//         <Route path="/space/:address" element={<PeerSpace />} />
        
//         {/* PeerSpace 하위 페이지들 */}
//         <Route path="/space/:address/settings" element={<PeerSpaceSettings />} />
        
//         {/* 상품 관련 */}
//         <Route 
//           path="product" 
//           element={
//             <ProductDetailPageWrapper />
//           } 
//         />
        
//         {/* 커뮤니티 관련 - 중복 제거하고 정리 */}
//         <Route path="/space/:address/community/:communityId" element={<ContentDetailPage />} />
//         <Route path="/space/:address/community/:communityId/post/:postId" element={<PostDetailPage />} />
//         <Route path="/space/:address/community/:communityId/post/by-slug/:slug" element={<PostDetailPage />} />
        
//         {/* PeerSpace 내 모든 하위 경로 */}
//         <Route path="/space/:address/*" element={<PeerSpace />} />
//       </Routes>
//     </PeerSpaceLayout>
//   );
// };

/**
 * 라우트 분기 컴포넌트
 */
const AppContent = () => {
  return (
    <Routes>
      <Route path="/space/:address/*" element={
        <PeerSpaceLayout>
          <PeerSpace />
        </PeerSpaceLayout>
      } />
      
      <Route path="/*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Shopping />} />
            <Route path="/peermalls" element={<PeermallsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
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