
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Search, Menu, Bell, User, Share2, Heart, MessageSquare, MapPin,
  Plus, Edit, Calendar, ExternalLink, Star, ThumbsUp, Eye,
  Users, Award, ShoppingBag, Link as LinkIcon, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { PeerMallConfig, Content, Review, Event, Quest } from './types';
import PeerSpaceHeader from './PeerSpaceHeader';
import PeerSpaceHero from './PeerSpaceHero';
import PeerSpaceContentSection from './PeerSpaceContentSection';
import PeerSpaceCommunitySection from './PeerSpaceCommunitySection';
import PeerSpaceEventsSection from './PeerSpaceEventsSection';
import PeerSpaceInfoHub from './PeerSpaceInfoHub';
import PeerSpaceReviewSection from './PeerSpaceReviewSection';
import PeerSpaceMapSection from './PeerSpaceMapSection';
import PeerSpaceTrustSection from './PeerSpaceTrustSection';
import PeerSpaceFooter from './PeerSpaceFooter';

interface PeerSpaceHomeProps {
  config: PeerMallConfig;
  isOwner: boolean;
  contents: Content[];
  reviews: Review[];
  events: Event[];
  quests: Quest[];
}

const PeerSpaceHome: React.FC<PeerSpaceHomeProps> = ({
  config,
  isOwner,
  contents,
  reviews,
  events,
  quests
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [contentType, setContentType] = useState<string>('');

  const handleShare = () => {
    toast({
      title: "공유하기",
      description: "링크가 클립보드에 복사되었습니다.",
    });
  };

  const handleFollow = () => {
    toast({
      title: "팔로우 완료",
      description: `${config.owner}님을 팔로우합니다.`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "메시지 보내기",
      description: "메시지 창이 열렸습니다.",
    });
  };

  const handleQRGenerate = () => {
    setShowQRModal(true);
  };

  const handleAddContent = () => {
    setShowAddContentModal(true);
  };

  // Helper function to render sections according to config
  const renderSection = (sectionType: string) => {
    switch(sectionType) {
      case 'hero':
        return <PeerSpaceHero config={config} isOwner={isOwner} />;
      case 'content':
        return <PeerSpaceContentSection 
          config={config} 
          contents={contents} 
          isOwner={isOwner} 
          onAddContent={handleAddContent} 
        />;
      case 'community':
        return <PeerSpaceCommunitySection config={config} isOwner={isOwner} />;
      case 'events':
      case 'quests':
        return <PeerSpaceEventsSection 
          config={config} 
          events={events} 
          quests={quests} 
          isOwner={isOwner} 
        />;
      case 'infoHub':
        return <PeerSpaceInfoHub config={config} />;
      case 'reviews':
        return <PeerSpaceReviewSection 
          config={config} 
          reviews={reviews} 
          isOwner={isOwner} 
        />;
      case 'map':
        return (config.location ? 
          <PeerSpaceMapSection 
            location={config.location} 
            title={config.title} 
          /> : null);
      case 'trust':
        return <PeerSpaceTrustSection config={config} />;
      default:
        return null;
    }
  };

  // Modal for QR codes
  const renderQRModal = () => (
    <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">내 스페이스 QR 코드</DialogTitle>
        </DialogHeader>
        <div className="p-4 flex justify-center">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            QR 코드 영역
          </div>
        </div>
        <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">
          {`https://peermall.com/space/${config.id}`}
        </div>
        <Button className="w-full mt-2">이미지 다운로드</Button>
      </DialogContent>
    </Dialog>
  );

  // Modal for adding content
  const renderAddContentModal = () => (
    <Dialog open={showAddContentModal} onOpenChange={setShowAddContentModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Plus className="mr-2"/> 새로운 콘텐츠 추가
          </DialogTitle>
        </DialogHeader>
        
        {!contentType ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {[
              { id: 'product', name: '상품', description: '판매할 제품 등록', icon: ShoppingBag },
              { id: 'portfolio', name: '포트폴리오', description: '작업물 전시', icon: Award },
              { id: 'service', name: '서비스', description: '제공할 서비스 등록', icon: Users },
              { id: 'post', name: '게시글', description: '커뮤니티에 글 작성', icon: Edit },
              { id: 'external', name: '외부 링크', description: '외부 콘텐츠 연결', icon: LinkIcon },
              { id: 'event', name: '이벤트', description: '이벤트 생성', icon: Calendar },
            ].map(type => (
              <div 
                key={type.id} 
                className="cursor-pointer hover:border-accent-100 transition-colors group text-center p-4 border-2 border-transparent rounded-lg"
                onClick={() => setContentType(type.id)}
              >
                <type.icon className="h-10 w-10 mx-auto mb-2 text-gray-400 group-hover:text-accent-100 transition-colors" />
                <h3 className="font-semibold mb-1">{type.name}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">제목</label>
              <Input placeholder={`${contentType} 제목`} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">설명</label>
              <Textarea placeholder={`${contentType} 설명`} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">대표 이미지</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center mt-1">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">이미지 업로드</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setContentType('')}>
                뒤로
              </Button>
              <Button type="button">
                {contentType === 'external' ? '외부 링크 추가' : `${contentType} 등록`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PeerSpaceHeader 
        config={config} 
        isOwner={isOwner} 
        onAddContent={handleAddContent} 
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Quick action buttons for non-owners */}
        {!isOwner && (
          <div className="flex mb-6 gap-2">
            <Button onClick={handleFollow} className="flex-1">
              <Heart className="mr-1 h-4 w-4" /> 팔로우
            </Button>
            <Button onClick={handleMessage} variant="outline" className="flex-1">
              <MessageSquare className="mr-1 h-4 w-4" /> 메시지
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="mr-1 h-4 w-4" /> 공유
            </Button>
            <Button onClick={handleQRGenerate} variant="outline">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Render sections based on config */}
        <div className="space-y-10">
          {config.sections.map((section) => (
            <div key={section}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </main>
      
      <PeerSpaceFooter config={config} />
      
      {/* Modals */}
      {renderQRModal()}
      {renderAddContentModal()}
    </div>
  );
};

export default PeerSpaceHome;
