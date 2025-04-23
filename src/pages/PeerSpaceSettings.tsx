import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings2, User, Paintbrush, FileText, ShoppingBag, MessageCircle, QrCode, 
  Link2, Star, BarChart2, ShieldCheck, Settings, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import AdminDashboardSection from "@/components/peer-space/AdminDashboardSection";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <div 
      className={`flex items-center py-2 px-3 rounded-lg cursor-pointer mb-1 transition-colors
        ${active 
          ? 'bg-primary-300 text-white' 
          : 'hover:bg-primary-100/10 text-text-200 hover:text-primary-300'
        }`}
      onClick={onClick}
    >
      <Icon className={`h-5 w-5 mr-3 ${active ? 'text-white' : 'text-primary-200'}`} />
      <span className={`text-sm font-medium ${active ? 'text-white' : ''}`}>{label}</span>
    </div>
  );
};

interface SidebarCategoryProps {
  title: string;
  children: React.ReactNode;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase text-text-200 font-semibold tracking-wider mb-2 px-3">{title}</h3>
      {children}
    </div>
  );
};

const PeerSpaceSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [saved, setSaved] = useState(true);
  
  const handleBackToMyMall = () => {
    navigate('/peer-space');
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "변경사항이 성공적으로 적용되었습니다.",
    });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-bg-100 flex">
      <aside className="w-64 h-screen bg-white shadow-sm border-r border-gray-100 p-4 flex-shrink-0 sticky top-0">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-lg font-bold text-primary-300">피어스페이스 관리</h2>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          <SidebarCategory title="기본 관리">
            <SidebarItem icon={LayoutDashboard} label="대시보드" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
            <SidebarItem icon={User} label="기본 정보" active={activeSection === 'basic-info'} onClick={() => setActiveSection('basic-info')} />
            <SidebarItem icon={Paintbrush} label="디자인 설정" active={activeSection === 'design'} onClick={() => setActiveSection('design')} />
          </SidebarCategory>
          
          <SidebarCategory title="콘텐츠 & 제품">
            <SidebarItem icon={FileText} label="콘텐츠 관리" active={activeSection === 'content'} onClick={() => setActiveSection('content')} />
            <SidebarItem icon={ShoppingBag} label="제품 관리" active={activeSection === 'products'} onClick={() => setActiveSection('products')} />
            <SidebarItem icon={MessageCircle} label="커뮤니티 관리" active={activeSection === 'community'} onClick={() => setActiveSection('community')} />
          </SidebarCategory>
          
          <SidebarCategory title="연결 & 분석">
            <SidebarItem icon={QrCode} label="QR 코드 관리" active={activeSection === 'qr-codes'} onClick={() => setActiveSection('qr-codes')} />
            <SidebarItem icon={Link2} label="관계 관리" active={activeSection === 'relationships'} onClick={() => setActiveSection('relationships')} />
            <SidebarItem icon={Star} label="리뷰 관리" active={activeSection === 'reviews'} onClick={() => setActiveSection('reviews')} />
            <SidebarItem icon={BarChart2} label="통계 및 분석" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
          </SidebarCategory>
          
          <SidebarCategory title="시스템 & 보안">
            <SidebarItem icon={ShieldCheck} label="보안 및 접근 관리" active={activeSection === 'security'} onClick={() => setActiveSection('security')} />
            <SidebarItem icon={Settings} label="설정" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
          </SidebarCategory>
        </div>
        
        <div className="mt-auto pt-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={handleBackToMyMall}>
            <span className="mr-2">←</span> 피어스페이스로 돌아가기
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {activeSection === 'dashboard' && '대시보드'}
            {activeSection === 'basic-info' && '기본 정보'}
            {activeSection === 'design' && '디자인 설정'}
            {activeSection === 'content' && '콘텐츠 관리'}
            {activeSection === 'products' && '제품 관리'}
            {activeSection === 'community' && '커뮤니티 관리'}
            {activeSection === 'qr-codes' && 'QR 코드 관리'}
            {activeSection === 'relationships' && '관계 관리'}
            {activeSection === 'reviews' && '리뷰 관리'}
            {activeSection === 'analytics' && '통계 및 분석'}
            {activeSection === 'security' && '보안 및 접근 관리'}
            {activeSection === 'settings' && '설정'}
          </h1>
          {!saved && (
            <Button onClick={handleSaveChanges}>변경사항 저장</Button>
          )}
        </div>
        {activeSection === 'dashboard' ? (
          <AdminDashboardSection />
        ) : (
          <Card className="p-6">
            <p className="text-text-200">이 페이지는 현재 개발 중입니다. 다음 단계에서 {activeSection} 섹션이 구현될 예정입니다.</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PeerSpaceSettings;
