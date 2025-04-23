import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminDashboardSection from "@/components/peer-space/AdminDashboardSection";
import BasicInfoSection from "@/components/peer-space/BasicInfoSection";
import DesignSettingsSection from "@/components/peer-space/DesignSettingsSection";
import ContentManagementSection from "@/components/peer-space/ContentManagementSection";
import ProductManagementSection from "@/components/peer-space/ProductManagementSection";
import CommunityManagementSection from './CommunityManagementSection';
import QRCodeManagementSection from './QRCodeManagementSection';
import RelationshipManagementSection from './RelationshipManagementSection';

interface ContentSectionProps {
  activeSection: string;
  saved: boolean;
  onSave: () => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  activeSection, 
  saved, 
  onSave 
}) => {
  const getSectionTitle = () => {
    switch(activeSection) {
      case 'dashboard': return '대시보드';
      case 'basic-info': return '기본 정보';
      case 'design': return '디자인 설정';
      case 'content': return '콘텐츠 관리';
      case 'products': return '제품 관리';
      case 'community': return '커뮤니티 관리';
      case 'qr-codes': return 'QR 코드 관리';
      case 'relationships': return '관계 관리';
      case 'reviews': return '리뷰 관리';
      case 'analytics': return '통계 및 분석';
      case 'security': return '보안 및 접근 관리';
      case 'settings': return '설정';
      default: return '';
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {getSectionTitle()}
        </h1>
        {!saved && (
          <Button onClick={onSave}>변경사항 저장</Button>
        )}
      </div>
      
      {activeSection === 'dashboard' && <AdminDashboardSection />}
      {activeSection === 'basic-info' && <BasicInfoSection />}
      {activeSection === 'design' && <DesignSettingsSection />}
      {activeSection === 'content' && <ContentManagementSection />}
      {activeSection === 'products' && <ProductManagementSection />}
      {activeSection === 'community' && <CommunityManagementSection />}
      {activeSection === 'qr-codes' && <QRCodeManagementSection />}
      {activeSection === 'relationships' && <RelationshipManagementSection />}
      
      {!['dashboard', 'basic-info', 'design', 'content', 'products', 'community', 'qr-codes', 'relationships'].includes(activeSection) && (
        <Card className="p-6">
          <p className="text-text-200">
            이 페이지는 현재 개발 중입니다. 다음 단계에서 {activeSection} 섹션이 구현될 예정입니다.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ContentSection;
