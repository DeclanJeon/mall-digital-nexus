
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
import Footer from "./components/Footer";
import Header from "./components/Header";
import PeerSpace from "./pages/PeerSpace";
import PeerSpaceSettings from "./pages/PeerSpaceSettings";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isPeerSpacePage = location.pathname.startsWith('/peer-space');

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
        <Route path="/peer-space" element={<PeerSpace />} />
        <Route path="/peer-space/settings" element={<PeerSpaceSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isPeerSpacePage && <Footer />}
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
