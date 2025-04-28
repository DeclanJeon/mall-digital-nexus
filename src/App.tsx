
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import MyInfoPage from '@/pages/MyInfoPage';
import PeerSpace from '@/pages/PeerSpace';
import PeerSpaceSettings from '@/pages/PeerSpaceSettings';
import Service from '@/pages/Service';
import LearningHub from '@/pages/LearningHub';
import Shopping from '@/pages/Shopping';
import Community from '@/pages/Community';
import ContentDetailPage from '@/pages/ContentDetailPage';
import CurationLinks from '@/pages/CurationLinks';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-info" element={<MyInfoPage />} />
          <Route path="/space/:address" element={<PeerSpace />} />
          <Route path="/space/:address/content/:contentId" element={<ContentDetailPage />} />
          <Route path="/settings/:address" element={<PeerSpaceSettings />} />
          <Route path="/service" element={<Service />} />
          <Route path="/learning-hub" element={<LearningHub />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/community" element={<Community />} />
          <Route path="/curation-links" element={<CurationLinks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
