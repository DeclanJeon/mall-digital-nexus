
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import CurationLinks from "./pages/CurationLinks";
import Community from "./pages/Community";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServiceCardsSection from "./components/ServiceCardsSection";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/curation-links" element={<CurationLinks />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
