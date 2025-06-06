// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet, useLocation, useParams, useSearchParams } from "react-router-dom"; // useParams 추가

// Pages
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/Service";
import MyInfoPage from "./pages/MyInfoPage";
import CustomerSupport from "./pages/CustomerSupport";
import PeermallsPage from "./pages/PeermallsPage";
import PeerSpaceSettings from "./pages/PeerSpaceSettings";

// PeerSpace related
import PeerSpace from "./pages/PeerSpace";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import PeerSpaceLayout from "@/components/peer-space/layout/PeerSpaceLayout";

// Features
import QRCodeGenerator from "@/components/feature-sections/QRCodeGenerator";
import { Peermall } from "@/types/peermall";
import ProductDetailComponent from "./components/shopping/products/ProductDetailComponent";

const queryClient = new QueryClient();
// const { address } = useParams<{ address: string }>();
// const [ searchParams ] = useSearchParams();
// const peerMallKey = searchParams.get('mk');
// const productKey = searchParams.get('pk');

/**
 * 라우트 분기 컴포넌트
 */
const AppContent = () => {
    return (
    <Routes>
      <Route path="/space/:address/settings/*" element={
        <PeerSpaceLayout>
          <PeerSpaceSettings />
        </PeerSpaceLayout>
      } />
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
            <Route path="/create-qrcode" element={<QRCodeGenerator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-info" element={<MyInfoPage />} />
            <Route path="/settings/*" element={<PeerSpaceSettings />} />
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