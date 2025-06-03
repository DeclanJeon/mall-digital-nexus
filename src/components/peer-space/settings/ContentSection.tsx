
import React from 'react';
import { Button } from '@/components/ui/button';
// import AdminDashboardSection from "@/components/peer-space/AdminDashboardSection";
// import BasicInfoSection from "@/components/peer-space/BasicInfoSection";
// import DesignSettingsSection from "@/components/peer-space/DesignSettingsSection";
// import ContentManagementSection from "@/components/peer-space/ContentManagementSection";
// import ProductManagementSection from "@/components/peer-space/ProductManagementSection";
import CommunityManagementSection from './CommunityManagementSection';
import QRCodeManagementSection from './QRCodeManagementSection';
import RelationshipManagementSection from './RelationshipManagementSection';
import ReviewsManagementSection from './ReviewsManagementSection';
import AnalyticsSection from './AnalyticsSection';
import SecuritySection from './SecuritySection';
import SettingsSection from './SettingsSection';
import ProductEcosystemSection from './ProductEcosystemSection';
import MarketingPromotionSection from './MarketingPromotionSection';
import LocationServiceSection from './LocationServiceSection';
import CustomerSupportSection from './CustomerSupportSection';
import AdvertisementSection from './AdvertisementSection';
import GamificationSection from './GamificationSection';
import ReferralSystemSection from './ReferralSystemSection';
import ProductManagementSection from '../sections/ProductManagementSection';
import ContentManagementSection from '../content/ContentManagementSection';
import DesignSettingsSection from '../sections/DesignSettingsSection';
import BasicInfoSection from '../sections/BasicInfoSection';
import AdminDashboardSection from '../sections/AdminDashboardSection';
import { PeerMallConfig } from '@/types/space';

interface ContentSectionProps {
  activeSection: string;
  saved: boolean;
  onSave: () => void;
  address: string;
  config: PeerMallConfig;
  peermall?: any; // 실제 타입으로 대체하세요
  isLoading?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  activeSection, 
  saved, 
  onSave,
  address,
  config,
  peermall,
  isLoading = false
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
      case 'product-ecosystem': return '제품 생태계 관리';
      case 'marketing': return '마케팅 및 홍보 관리';
      case 'location': return '위치 기반 서비스 관리';
      case 'customer-support': return '고객 지원 관리';
      case 'advertisement': return '광고 관리';
      case 'gamification': return '게임화 요소';
      case 'referral': return '추천인 시스템';
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
      {activeSection === 'basic-info' && (
        <BasicInfoSection 
          config={config} 
          peermall={peermall} 
          isLoading={isLoading} 
        />
      )}
      {activeSection === 'design' && <DesignSettingsSection />}
      {activeSection === 'content' && <ContentManagementSection />}
      {activeSection === 'products' && <ProductManagementSection />}
      {activeSection === 'community' && <CommunityManagementSection />}
      {activeSection === 'qr-codes' && <QRCodeManagementSection />}
      {activeSection === 'relationships' && <RelationshipManagementSection />}
      {activeSection === 'reviews' && <ReviewsManagementSection />}
      {activeSection === 'analytics' && <AnalyticsSection />}
      {activeSection === 'security' && <SecuritySection />}
      {activeSection === 'settings' && <SettingsSection />}
      {activeSection === 'product-ecosystem' && <ProductEcosystemSection />}
      {activeSection === 'marketing' && <MarketingPromotionSection />}
      {activeSection === 'location' && <LocationServiceSection />}
      {activeSection === 'customer-support' && <CustomerSupportSection />}
      {/* 새로 추가된 섹션들 */}
      {activeSection === 'advertisement' && <AdvertisementSection />}
      {activeSection === 'gamification' && <GamificationSection />}
      {activeSection === 'referral' && <ReferralSystemSection />}
    </div>
  );
};

export default ContentSection;
