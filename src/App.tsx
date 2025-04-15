
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import CurationLinks from "./pages/CurationLinks";
import Community from "./pages/Community";
import OpenChat from "./pages/OpenChat";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/Service";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <CategoryNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/curation-links" element={<CurationLinks />} />
          <Route path="/community" element={<Community />} />
          <Route path="/openchat" element={<OpenChat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/service" element={<ServicePage />} /> 
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
