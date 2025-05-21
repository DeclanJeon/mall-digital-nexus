
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
import CommunityPage from "./pages/Community";
import CommunityDetailPage from "./pages/ContentDetailPage";
import PostDetailPage from "./pages/PostDetailPage";
import Community from "./components/community/Community";

// Remove imports for non-existent pages
// import Peers from "./pages/space/Peers";
// import Achievements from "./pages/space/Achievements";
// import Messages from "./pages/space/Messages";
// import Space from "./pages/space/Space";

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
        {/* <Route path="/community" element={<Community />} /> 
        <Route path="/community/planet/:planetId" element={<Community />} /> 
        <Route path="/community/planet/:planetId/post/:postId" element={<Community />} /> */}

        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:communityId" element={<CommunityDetailPage />} />
        <Route path="/community/:communityId/post/:postId" element={<PostDetailPage />} />
        <Route path="/community/:communityId/post/by-slug/:slug" element={<PostDetailPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="/space/:address" element={<PeerSpace />} />
        <Route path="/space/:address/settings" element={<PeerSpaceSettings />} />
        <Route path="/space/:address/content/:contentId" element={<ContentDetailPage />} />
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
