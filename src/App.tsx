
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
        <Route path="/community" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="/space/:address" element={<PeerSpace />} />
        <Route path="/space/:address/settings" element={<PeerSpaceSettings />} />
        <Route path="/space/:address/content/:contentId" element={<ContentDetailPage />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path="/community/chat/:roomId" element={<ChatRoomView />} /> {/* Add the new route */}

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isPeerSpacePage && <Footer />}
    </>
  );
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
