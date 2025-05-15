
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom"; // useParams 추가
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import CurationLinks from "./pages/CurationLinks";
import Community from "./pages/Community";
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
import ChatRoomView from "./components/community/chat/ChatRoomView"; // Import the new component

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isPeerSpacePage = location.pathname.startsWith('/space/');

  return (
    <>
      {!isPeerSpacePage && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/curation-links" element={<CurationLinks />} />
        <Route path="/community" element={<Community />} /> {/* 기본 커뮤니티 경로 */}
        <Route path="/community/planet/:planetId" element={<Community />} /> {/* 행성(게시판) 상세 경로 */}
        <Route path="/community/planet/:planetId/post/:postId" element={<Community />} /> {/* 게시글 상세 경로 (Community 컴포넌트 내에서 처리) */}
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="/space/:address" element={<PeerSpace />} />
        {/* 수정: PeerSpace의 커뮤니티는 Community 컴포넌트를 사용하고 address를 prop으로 전달 */}
        <Route path="/space/:address/community" element={<CommunityWrapper />} />
        <Route path="/space/:address/community/planet/:planetId" element={<CommunityWrapper />} />
        <Route path="/space/:address/community/planet/:planetId/post/:postId" element={<CommunityWrapper />} />
        <Route path="/space/:address/settings" element={<PeerSpaceSettings />} />
        <Route path="/space/:address/content/:contentId" element={<ContentDetailPage />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        {/* 변경된 채팅방 상세 경로 */}
        <Route path="/community/planet/:planetId/chat/:roomId" element={<ChatRoomView />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isPeerSpacePage && <Footer />}
    </>
  );
};

// Wrapper 컴포넌트 추가하여 useParams를 통해 address를 Community 컴포넌트에 전달
const CommunityWrapper = () => {
  const { address } = useParams<{ address: string }>();
  return <Community peerSpaceAddress={address} />;
};

const AppWithProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppWithProviders;
