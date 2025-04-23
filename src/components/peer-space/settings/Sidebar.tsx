import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Paintbrush, FileText, ShoppingBag, 
  MessageCircle, QrCode, Link2, Star, BarChart2, ShieldCheck, Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarItem from './SidebarItem';
import SidebarCategory from './SidebarCategory';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const handleBackToMyMall = () => {
    navigate('/peer-space');
  };

  return (
    <div className="w-64 h-screen bg-white shadow-sm border-r border-gray-100 p-4 flex-shrink-0 sticky top-0">
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
    </div>
  );
};

export default Sidebar;
