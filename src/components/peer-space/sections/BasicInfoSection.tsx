import React, { useState, useEffect } from "react";
import type { PeerMallConfig } from "@/types/space";
import { Card } from "@/components/ui/card";
import { 
  User, Info, Mail, Phone, MapPin, Building, Shield, Link, Users, 
  FileText, Image as ImageIcon, Globe, UploadCloud, X, Edit3, 
  Save, ArrowLeft, Sparkles, Zap, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import type { Peermall } from '@/types/peermall';

// 개선된 이미지 업로드 컴포넌트 - 새 테마 적용
const EnhancedImageUpload: React.FC<{
  label: string;
  storageKey: string;
  description: string;
  initialImage?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ label, storageKey, description, initialImage, size = 'md' }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputId = `upload-${storageKey}`;

  // 크기별 스타일 정의
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28", 
    lg: "w-36 h-36"
  };

  useEffect(() => {
    const savedImage = localStorage.getItem(storageKey);
    if (savedImage) {
      setImagePreview(savedImage);
    } else if (initialImage) {
      setImagePreview(initialImage);
    }
  }, [storageKey, initialImage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        localStorage.setItem(storageKey, dataUrl);
        setIsUploading(false);
        setUploadSuccess(true);
        
        setTimeout(() => setUploadSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    localStorage.removeItem(storageKey);
    setUploadSuccess(false);
  };

  return (
    <div className="space-y-3 group">
      {/* 레이블과 설명 - 새 테마 적용 */}
      <div className="space-y-1">
        <Label 
          htmlFor={inputId} 
          className="text-sm font-semibold flex items-center gap-2"
          style={{ color: 'var(--text-100)' }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-100)' }} />
          {label}
        </Label>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-200)' }}>
          {description}
        </p>
      </div>
      
      {/* 업로드 영역 */}
      <div className="relative">
        {imagePreview ? (
          <div className={`relative ${sizeClasses[size]} group/preview`}>
            <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-lg ${
              uploadSuccess 
                ? 'border-green-400 shadow-green-100' 
                : 'hover:scale-105'
            }`}
            style={{
              borderColor: uploadSuccess ? '#4ade80' : 'var(--accent-200)',
              boxShadow: uploadSuccess 
                ? '0 10px 25px -3px rgba(74, 222, 128, 0.1), 0 4px 6px -2px rgba(74, 222, 128, 0.05)'
                : '0 10px 25px -3px rgba(120, 129, 137, 0.1), 0 4px 6px -2px rgba(120, 129, 137, 0.05)'
            }}>
              <img 
                src={imagePreview} 
                alt={label} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-105" 
              />
              
              {/* 성공 오버레이 */}
              {uploadSuccess && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <Sparkles className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              )}
            </div>
            
            {/* 제거 버튼 - 보색 적용으로 가독성 향상 */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 shadow-lg bg-red-500 hover:bg-red-600 text-white border-0"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Label
            htmlFor={inputId}
            className={`${sizeClasses[size]} flex flex-col items-center justify-center 
              border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
              hover:scale-105 focus-within:ring-2 focus-within:ring-offset-2
              group-hover:scale-105`}
            style={{
  backgroundColor: 'var(--bg-200)',
  borderColor: 'var(--accent-200)',
  '--tw-ring-color': 'var(--accent-100)'
} as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-300)';
              e.currentTarget.style.borderColor = 'var(--accent-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-200)';
              e.currentTarget.style.borderColor = 'var(--accent-200)';
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
                  style={{ borderColor: 'var(--accent-100)', borderTopColor: 'transparent' }}
                ></div>
                <span className="text-xs font-medium" style={{ color: 'var(--accent-100)' }}>
                  업로드 중...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: 'var(--primary-300)' }}
                >
                  <UploadCloud className="h-6 w-6" style={{ color: 'var(--accent-100)' }} />
                </div>
                <div className="text-center">
                  <span 
                    className="text-sm font-medium block" 
                    style={{ color: 'var(--text-100)' }}
                  >
                    업로드
                  </span>
                  <span 
                    className="text-xs opacity-75" 
                    style={{ color: 'var(--text-200)' }}
                  >
                    클릭하여 선택
                  </span>
                </div>
              </div>
            )}
          </Label>
        )}
        
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

// 정보 섹션 컴포넌트 - 테마 적용
const InfoSection: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}> = ({ icon, label, value, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center gap-2">
      {React.cloneElement(icon as React.ReactElement, { 
        style: { color: 'var(--accent-100)' } 
      })}
      <span 
        className="text-sm font-medium" 
        style={{ color: 'var(--text-200)' }}
      >
        {label}
      </span>
    </div>
    <div 
      className="font-semibold leading-relaxed" 
      style={{ color: 'var(--text-100)' }}
    >
      {value}
    </div>
  </div>
);

// 태그 컴포넌트 - 테마 적용
const TagDisplay: React.FC<{
  items: string[];
  variant?: 'category' | 'tag';
}> = ({ items, variant = 'tag' }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items?.map((item, index) => (
        <span 
          key={index} 
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 border"
          style={{
            backgroundColor: variant === 'category' ? 'var(--primary-300)' : 'var(--bg-200)',
            color: variant === 'category' ? 'var(--primary-100)' : 'var(--text-100)',
            borderColor: variant === 'category' ? 'var(--accent-200)' : 'var(--accent-200)'
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

interface BasicInfoSectionProps {
  config: PeerMallConfig;
  peermall?: {
    title?: string;
    [key: string]: any;
  };
  isLoading?: boolean;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onEditToggle?: () => void;
}

const BasicInfoSection = ({ 
  config, 
  peermall, 
  isLoading = false, 
  onSave, 
  onCancel, 
  isEditing, 
  onEdit, 
  onDelete, 
  onEditToggle 
}: BasicInfoSectionProps) => {
  const [activeTab, setActiveTab] = useState("site-info");
  const [isEditMode, setIsEditMode] = useState(false);

  const safeConfig = config || { 
    title: '로딩 중...', 
    slogan: '', 
    externalUrl: '#' 
  };
  const safePeermall = peermall || { title: '로딩 중...' };

  // 로딩 상태 - 새 테마 적용
  if (isLoading) {
    return (
      <Card 
        className="p-8 backdrop-blur-sm rounded-2xl shadow-xl border"
        style={{
          backgroundColor: 'var(--bg-100)',
          borderColor: 'var(--accent-200)'
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{
                borderColor: 'var(--accent-200)',
                borderTopColor: 'var(--accent-100)'
              }}
            ></div>
          </div>
          <div className="text-center space-y-2">
            <h3 
              className="text-lg font-semibold" 
              style={{ color: 'var(--text-100)' }}
            >
              피어몰 정보 로딩 중
            </h3>
            <p 
              className="text-sm" 
              style={{ color: 'var(--text-200)' }}
            >
              잠시만 기다려주세요...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-100)',
        borderColor: 'var(--accent-200)'
      }}
    >
      {/* 헤더 섹션 - 새 테마의 그라데이션 적용 */}
      <div 
        className="p-6"
        style={{
          background: `linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="p-3 backdrop-blur-sm rounded-xl"
              style={{ backgroundColor: 'var(--primary-300)' }}
            >
              <User className="w-8 h-8" style={{ color: 'var(--primary-100)' }} />
            </div>
            <div>
              <h2 
                className="text-2xl font-bold" 
                style={{ color: 'var(--primary-300)' }}
              >
                피어몰 기본 정보
              </h2>
              <p 
                className="text-sm" 
                style={{ color: 'var(--accent-200)' }}
              >
                미래를 향한 디지털 공간 관리 🚀
              </p>
            </div>
          </div>
          
          {/* 편집 모드 토글 - 보색 적용으로 가독성 향상 */}
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            className="backdrop-blur-sm border transition-all duration-200 font-medium"
            style={{
              backgroundColor: 'var(--primary-300)',
              color: 'var(--primary-100)',
              borderColor: 'var(--accent-200)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-200)';
              e.currentTarget.style.color = 'var(--primary-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-300)';
              e.currentTarget.style.color = 'var(--primary-100)';
            }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditMode ? '보기 모드' : '편집 모드'}
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* 탭 네비게이션 - 새 테마 적용 */}
        <Tabs defaultValue="site-info" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList 
            className="grid grid-cols-2 w-full rounded-xl p-1 backdrop-blur-sm"
            style={{ backgroundColor: 'var(--bg-200)' }}
          >
            <TabsTrigger 
              value="site-info" 
              className="rounded-lg transition-all duration-300 text-base font-medium data-[state=active]:shadow-lg"
              style={{
                color: 'var(--text-100)'
              }}
              data-state={activeTab === "site-info" ? "active" : "inactive"}
              onMouseEnter={(e) => {
                if (activeTab !== "site-info") {
                  e.currentTarget.style.backgroundColor = 'var(--bg-300)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "site-info") {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              사이트 정보
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="rounded-lg transition-all duration-300 text-base font-medium data-[state=active]:shadow-lg"
              style={{
                color: 'var(--text-100)'
              }}
              data-state={activeTab === "contact" ? "active" : "inactive"}
              onMouseEnter={(e) => {
                if (activeTab !== "contact") {
                  e.currentTarget.style.backgroundColor = 'var(--bg-300)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "contact") {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Heart className="w-4 h-4 mr-2" />
              연락처
            </TabsTrigger>
          </TabsList>

          {/* 사이트 정보 탭 */}
          <TabsContent value="site-info" className="space-y-8">
            
            {/* 기본 식별 정보 */}
            <div 
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--primary-300)',
                borderColor: 'var(--accent-200)'
              }}
            >
              <h3 
                className="text-lg font-bold mb-6 flex items-center gap-2"
                style={{ color: 'var(--text-100)' }}
              >
                <Zap className="w-5 h-5" style={{ color: 'var(--accent-100)' }} />
                기본 식별 정보
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <InfoSection
                  icon={<Building className="w-4 h-4" />}
                  label="피어몰 이름"
                  value={safePeermall.title || safeConfig.title}
                />
                
                <InfoSection
                  icon={<Sparkles className="w-4 h-4" />}
                  label="슬로건"
                  value={safeConfig.slogan || "슬로건이 설정되지 않았습니다"}
                />

                <InfoSection
                  icon={<Globe className="w-4 h-4" />}
                  label="피어몰 주소 (URL)"
                  value={
                    <a 
                      href={safeConfig.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium hover:underline transition-colors"
                      style={{ color: 'var(--accent-100)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--primary-200)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--accent-100)';
                      }}
                    >
                      {safeConfig.externalUrl}
                    </a>
                  }
                  className="md:col-span-2"
                />

                <InfoSection
                  icon={<Shield className="w-4 h-4" />}
                  label="피어몰 ID"
                  value={
                    <code 
                      className="px-3 py-1 rounded-lg text-sm font-mono"
                      style={{
                        backgroundColor: 'var(--bg-200)',
                        color: 'var(--primary-100)'
                      }}
                    >
                      {peermall?.id || config.address}
                    </code>
                  }
                />
                
                <InfoSection
                  icon={<Shield className="w-4 h-4" />}
                  label="피어 ID"
                  value={
                    <code 
                      className="px-3 py-1 rounded-lg text-sm font-mono"
                      style={{
                        backgroundColor: 'var(--accent-200)',
                        color: 'var(--primary-100)'
                      }}
                    >
                      {config.peerNumber}
                    </code>
                  }
                />
              </div>
            </div>

            {/* 피어몰 설명 */}
            <div 
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--primary-300)',
                borderColor: 'var(--accent-200)'
              }}
            >
              <h3 
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: 'var(--text-100)' }}
              >
                <FileText className="w-5 h-5" style={{ color: 'var(--accent-100)' }} />
                피어몰 설명
              </h3>
              <div 
                className="backdrop-blur-sm p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-100)',
                  borderColor: 'var(--accent-200)'
                }}
              >
                <p 
                  className="leading-relaxed"
                  style={{ color: 'var(--text-200)' }}
                >
                  {peermall?.description || config.description || "아직 설명이 작성되지 않았습니다. 편집 모드에서 추가해보세요!"}
                </p>
              </div>
            </div>

            {/* 이미지 자산 */}
            <div 
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--primary-300)',
                borderColor: 'var(--accent-200)'
              }}
            >
              <h3 
                className="text-lg font-bold mb-6 flex items-center gap-2"
                style={{ color: 'var(--text-100)' }}
              >
                <ImageIcon className="w-5 h-5" style={{ color: 'var(--accent-100)' }} />
                이미지 자산
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <EnhancedImageUpload
                  label="대표 이미지"
                  storageKey="peerspace_rep_image"
                  description="피어몰 목록과 검색 결과에 표시됩니다"
                  initialImage={peermall?.imageUrl}
                  size="lg"
                />
                <EnhancedImageUpload
                  label="로고 이미지"
                  storageKey="peerspace_logo"
                  description="피어몰 페이지 상단에 표시됩니다"
                  size="md"
                />
                <EnhancedImageUpload
                  label="파비콘"
                  storageKey="peerspace_favicon"
                  description="브라우저 탭에 표시됩니다"
                  size="sm"
                />
              </div>
            </div>

            {/* 카테고리 및 태그 */}
            <div 
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--primary-300)',
                borderColor: 'var(--accent-200)'
              }}
            >
              <h3 
                className="text-lg font-bold mb-6 flex items-center gap-2"
                style={{ color: 'var(--text-100)' }}
              >
                <Users className="w-5 h-5" style={{ color: 'var(--accent-100)' }} />
                분류 및 태그
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label 
                    className="text-sm font-medium mb-3 block"
                    style={{ color: 'var(--text-100)' }}
                  >
                    대표 카테고리
                  </Label>
                  <TagDisplay items={config.categories || []} variant="category" />
                </div>
                
                <div>
                  <Label 
                    className="text-sm font-medium mb-3 block"
                    style={{ color: 'var(--text-100)' }}
                  >
                    검색 태그
                  </Label>
                  <TagDisplay items={config.tags || []} variant="tag" />
                </div>
              </div>
            </div>

            {/* 액션 버튼 - 보색 적용으로 최적 가독성 */}
            <div className="flex justify-end space-x-3">
              <Button 
                className="border font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-100)',
                  borderColor: 'var(--accent-100)',
                  color: 'var(--text-100)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-200)';
                  e.currentTarget.style.borderColor = 'var(--accent-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-100)';
                  e.currentTarget.style.borderColor = 'var(--accent-100)';
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전으로
              </Button>
              <Button 
                className="shadow-lg font-medium transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)`,
                  color: 'var(--primary-300)', // 배경이 어두우므로 밝은 텍스트로 보색 처리
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(30, 32, 34, 0.1), 0 10px 10px -5px rgba(30, 32, 34, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(30, 32, 34, 0.1), 0 4px 6px -2px rgba(30, 32, 34, 0.05)';
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                정보 저장
              </Button>
            </div>
          </TabsContent>

          {/* 연락처 탭 */}
          <TabsContent value="contact" className="space-y-6">
            <div 
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--primary-300)',
                borderColor: 'var(--accent-200)'
              }}
            >
              <h3 
                className="text-lg font-bold mb-6 flex items-center gap-2"
                style={{ color: 'var(--text-100)' }}
              >
                <Heart className="w-5 h-5" style={{ color: 'var(--accent-100)' }} />
                연락처 정보
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InfoSection
                    icon={<User className="w-5 h-5" />}
                    label="대표자명"
                    value={config.owner || "정보 없음"}
                  />
                  
                  <InfoSection
                    icon={<Mail className="w-5 h-5" />}
                    label="이메일"
                    value={
                      <a 
                        href={`mailto:${config.contactEmail}`}
                        className="hover:underline transition-colors"
                        style={{ color: 'var(--accent-100)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--primary-200)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--accent-100)';
                        }}
                      >
                        {config.contactEmail || "이메일 정보 없음"}
                      </a>
                    }
                  />
                  
                  <InfoSection
                    icon={<Phone className="w-5 h-5" />}
                    label="전화번호"
                    value={peermall?.phone || config.contactPhone || "전화번호 정보 없음"}
                  />
                </div>
                
                <div>
                  <InfoSection
                    icon={<MapPin className="w-5 h-5" />}
                    label="사업장 주소"
                    value={peermall?.location?.address || "주소 정보 없음"}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button 
                  className="border font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-100)',
                    borderColor: 'var(--accent-100)',
                    color: 'var(--text-100)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-200)';
                    e.currentTarget.style.borderColor = 'var(--accent-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-100)';
                    e.currentTarget.style.borderColor = 'var(--accent-100)';
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  연락처 수정
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 하단 안내 메시지 - 새 테마 적용 */}
        <Alert 
          className="mt-8 border"
          style={{
            backgroundColor: 'var(--bg-200)',
            borderColor: 'var(--accent-200)'
          }}
        >
          <Info className="h-4 w-4" style={{ color: 'var(--accent-100)' }} />
          <AlertDescription 
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-200)' }}
          >
            <span 
              className="font-semibold" 
              style={{ color: 'var(--accent-100)' }}
            >
              💡 개발자 노트:
            </span>{' '}
            현재 이미지들은 로컬 스토리지에 임시 저장됩니다. 프로덕션 환경에서는{' '}
            <span 
              className="font-medium" 
              style={{ color: 'var(--text-100)' }}
            >
              클라우드 스토리지 연동
            </span>
            이 필요해요! 미래의 피어몰은{' '}
            <span 
              className="font-medium" 
              style={{ color: 'var(--accent-100)' }}
            >
              무한한 가능성
            </span>
            을 품고 있답니다 🌟
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};

export default BasicInfoSection;