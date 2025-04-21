
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import CurationLinks from "./pages/CurationLinks";
import Community from "./pages/Community";
import OpenChat from "./components/OpenChatSection";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/Service";
import MyInfoPage from "./pages/MyInfoPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import OpenChatRoom from "./components/community/OpenChatRoom";
import PeerSpace from "./pages/PeerSpace";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/peer-space';

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && <CategoryNav />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/curation-links" element={<CurationLinks />} />
        <Route path="/community" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="/peer-space" element={<PeerSpace />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/community/chat/:id" element={<OpenChatRoom />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => (
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

export default App;
