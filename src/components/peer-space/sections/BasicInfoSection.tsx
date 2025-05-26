import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { User, Info, Mail, Phone, MapPin, Building, Shield, Link, Users, FileText, Image as ImageIcon, Globe, UploadCloud, X } from "lucide-react"; // 아이콘 추가!
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label"; // Label 컴포넌트 추가
import { PeerMallConfig } from '../types'; // PeerMallConfig 타입 임포트
import { Peermall } from '@/types/peermall';

// 이미지 업로드 및 미리보기 컴포넌트 재정의
// 인지 부하를 줄이고 어포던스를 명확히 하기 위해 디자인 개선
const ImageUploadPreview: React.FC<{
  label: string;
  storageKey: string;
  description: string; // 설명 추가!
  initialImage?: string; // initialImage prop 추가
}> = ({ label, storageKey, description, initialImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputId = `upload-${storageKey}`; // 각 업로더에 고유 ID 부여

  useEffect(() => {
    const savedImage = localStorage.getItem(storageKey);
    if (savedImage) {
      setImagePreview(savedImage);
    } else if (initialImage) { // initialImage가 있을 경우 설정
      setImagePreview(initialImage);
    }
  }, [storageKey, initialImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        localStorage.setItem(storageKey, dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      localStorage.removeItem(storageKey);
    }
  };

  // 이미지를 지우는 핸들러 추가 (피드백 및 제어 용이성 향상)
  const handleRemoveImage = () => {
    setImagePreview(null);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="space-y-2"> {/* 내부 간격 조정 */}
      <Label htmlFor={inputId} className="text-sm font-medium text-primary-200">{label}</Label> {/* Label 컴포넌트 사용 */}
      <p className="text-xs text-primary-200/80 mb-2">{description}</p> {/* 설명 추가 */}
      
      <div className="flex items-center gap-4">
        {imagePreview ? (
          // 이미지가 있을 때 미리보기와 제거 버튼 표시 (명확한 피드백)
          <div className="relative">
            <img src={imagePreview} alt={label} className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm" /> {/* 미리보기 크기 키우고 그림자 추가 */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemoveImage} // 제거 버튼 클릭 시
            >
              <X />
            </Button>
          </div>
        ) : (
          // 이미지가 없을 때 클릭 가능한 업로드 영역 표시 (명확한 어포던스)
          <Label
            htmlFor={inputId}
            className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 text-primary-200 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <UploadCloud className="h-8 w-8 mb-1" /> {/* 업로드 아이콘 */}
            <span className="text-xs">업로드</span> {/* 업로드 텍스트 */}
          </Label>
        )}
        
        {/* 실제 파일 인풋은 숨기고 Label 클릭으로 트리거 (접근성 & 디자인 자유도) */}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only" // 화면에서 숨김
        />
      </div>
    </div>
  );
};

interface BasicInfoSectionProps {
  config: PeerMallConfig;
  peermall: Peermall | null; // peermall prop 추가
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ config, peermall }) => {
  const [activeTab, setActiveTab] = useState("site-info");

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100"> {/* 카드 디자인 더 업그레이드! */}
      <div className="flex items-center mb-8 pb-4 border-b border-gray-200"> {/* 하단 경계선 추가 */}
        <User className="w-7 h-7 text-primary-500 mr-4" /> {/* 아이콘 크기 & 색상 조정 */}
        <h2 className="text-2xl font-extrabold text-primary-500">피어몰 기본 정보 관리</h2> {/* 제목 스타일 변경 */}
      </div>

      {/* 탭 네비게이션 - 인지적 길 찾기 지원 */}
      <Tabs defaultValue="site-info" className="space-y-8" onValueChange={setActiveTab}> {/* space-y 더 늘림 */}
        <TabsList className="grid grid-cols-2 md:w-[700px] bg-gray-100/70 rounded-lg p-1"> {/* 탭 리스트 디자인 변경 */}
          <TabsTrigger value="site-info" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all text-base">
            ✨ 사이트 정보 ✨ {/* 탭 디자인 및 텍스트 스타일 */}
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all text-base">
            📞 연락처 📞
          </TabsTrigger>
          {/* 다른 탭들은 필요에 따라 주석 해제 및 디자인 적용 */}
          {/* <TabsTrigger value="authentication" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all text-base">🛡️ 인증 및 상태 🛡️</TabsTrigger> */}
          {/* <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all text-base">⚖️ 법적 고지 ⚖️</TabsTrigger> */}
          {/* <TabsTrigger value="relationships" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all text-base">🤝 관계 설정 🤝</TabsTrigger> */}
        </TabsList>

        {/* 사이트 정보 탭 - 정보 아키텍처 개선 */}
        <TabsContent value="site-info" className="space-y-8"> {/* space-y 더 늘림 */}
          
          {/* 기본 식별 정보 그룹 */}
          <div className="grid md:grid-cols-2 gap-y-6 gap-x-8 border-b pb-6 border-gray-200"> {/* 그룹별 구분선 */}
            <div>
              <div className="text-sm text-primary-200 mb-1">피어몰 이름</div>
              <div className="font-bold text-text-100 text-lg">{peermall?.title || config.title}</div> {/* 중요 정보는 더 강조 */}
            </div>
            
            <div>
              <div className="text-sm text-primary-200 mb-1">슬로건</div>
              <div className="text-text-100 text-base">{config.slogan}</div>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm text-primary-200 mb-1">피어몰 주소 (URL)</div>
              <div className="flex items-center gap-2 text-text-100 text-base">
                <Globe className="h-4 w-4 text-primary-300" /> {/* 아이콘 색상 조정 */}
                <a href={config.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">{config.externalUrl}</a>
              </div>
            </div>

            <div>
              <div className="text-sm text-primary-200 mb-1">피어몰 ID (고유 식별자)</div>
              <div className="text-text-100 bg-primary-100/30 px-3 py-1 rounded inline-block text-sm font-mono">{peermall?.id || config.address}</div> {/* 코드처럼 보이게 폰트 변경 */}
            </div>
            
            <div>
               <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-primary-300" />
                <div className="text-sm text-primary-200">피어 ID (시스템 ID)</div> {/* 텍스트 살짝 수정 */}
              </div>
              <div className="font-semibold text-text-100 bg-primary-100/30 px-3 py-1 rounded inline-block text-sm font-mono">{config.peerNumber}</div> {/* 코드처럼 보이게 폰트 변경 */}
            </div>
          </div>

          {/* 피어몰 설명 영역 */}
          <div className="border-b pb-6 border-gray-200"> {/* 그룹별 구분선 */}
             <div className="text-sm text-primary-200 mb-2">피어몰 설명</div>
             <div className="text-text-200 text-sm bg-gray-50/50 p-4 rounded-md leading-relaxed"> {/* 패딩, 줄 간격 조정 */}
                {peermall?.description || config.description}
             </div>
          </div>

          {/* 이미지 자산 업로드 영역 - 시각적 중요성 및 어포던스 강조 */}
          <div className="grid md:grid-cols-3 gap-6 border-b pb-6 border-gray-200"> {/* 3열 레이아웃 */}
             <ImageUploadPreview
                label="대표 이미지"
                storageKey="peerspace_rep_image"
                description="피어몰 목록/검색 결과에 표시됩니다."
                initialImage={peermall?.imageUrl} // peermall?.imageUrl이 있다면 기본값으로 사용
             />
             <ImageUploadPreview
                label="로고 이미지"
                storageKey="peerspace_logo"
                description="피어몰 페이지 상단에 표시됩니다."
             />
             <ImageUploadPreview
                label="파비콘"
                storageKey="peerspace_favicon"
                description="브라우저 탭에 표시됩니다."
             />
          </div>

           {/* 카테고리 및 태그 영역 */}
           <div>
              <div className="text-sm text-primary-200 mb-2">대표 카테고리</div>
              <div className="flex flex-wrap gap-2"> {/* 간격 조정 */}
                  {config.categories && config.categories.map((category, index) => (
                    <span key={index} className="bg-primary-100/50 text-primary-300 px-2.5 py-1 rounded-full text-xs font-medium">{category}</span>
                  ))}
              </div>
              
              <div className="text-sm text-primary-200 mt-4 mb-2">검색 태그</div>
              <div className="flex flex-wrap gap-2"> {/* 간격 조정 */}
                  {config.tags && config.tags.map((tag, index) => (
                    <span key={index} className="bg-primary-100/50 text-primary-300 px-2.5 py-1 rounded-full text-xs font-medium">{tag}</span>
                  ))}
              </div>
           </div>

          {/* 정보 수정 버튼 - 명확한 어포던스 */}
          <div className="flex justify-end mt-8"> {/* 마진 더 늘림 */}
            <Button className="bg-primary-500 hover:bg-primary-600 text-white text-base px-6 py-3 rounded-lg shadow-md transition-colors">사이트 정보 수정</Button> {/* 버튼 디자인 및 텍스트 스타일 변경 */}
          </div>
        </TabsContent>

        {/* 연락처 탭 - 정보 아키텍처 개선 */}
        <TabsContent value="contact" className="space-y-6"> {/* space-y 조정 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 연락처 정보 그룹 */}
            <div className="space-y-4"> {/* 그룹 내부 간격 */}
              <div className="flex items-center gap-3"> {/* 간격 조정 */}
                <User className="h-5 w-5 text-primary-300" /> {/* 아이콘 크기 조정 */}
                <div>
                  <div className="text-sm text-primary-200">대표자명</div>
                  <div className="font-semibold text-text-100 text-base">{config.owner}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3"> {/* 간격 조정 */}
                <Mail className="h-5 w-5 text-primary-300" /> {/* 아이콘 크기 조정 */}
                 <div>
                  <div className="text-sm text-primary-200">이메일</div>
                  <div className="font-semibold text-text-100 text-base">{config.contactEmail}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3"> {/* 간격 조정 */}
                <Phone className="h-5 w-5 text-primary-300" /> {/* 아이콘 크기 조정 */}
                 <div>
                  <div className="text-sm text-primary-200">전화번호</div>
                  <div className="font-semibold text-text-100 text-base">{peermall?.phone || config.contactPhone}</div>
                </div>
              </div>
            </div>
            
            {/* 사업장 주소 그룹 */}
            <div className="space-y-4"> {/* 그룹 내부 간격 */}
               <div className="flex items-start gap-3"> {/* 아이콘과 텍스트 정렬 조정 */}
                <MapPin className="h-5 w-5 text-primary-300 mt-1" /> {/* 아이콘 크기 및 위치 조정 */}
                 <div>
                  <div className="text-sm text-primary-200">주소</div>
                  <div className="font-semibold text-text-100 text-base leading-relaxed">
                    {peermall?.location?.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 연락처 수정 버튼 - 명확한 어포던스 */}
          <div className="flex justify-end mt-6"> {/* 마진 조정 */}
            <Button variant="outline" className="text-base px-6 py-3 rounded-lg">연락처 수정</Button> {/* 버튼 디자인 및 텍스트 스타일 변경 */}
          </div>
        </TabsContent>

        {/* 다른 탭 콘텐츠 영역 (주석 처리) */}
        {/* <TabsContent value="authentication" className="space-y-4">...</TabsContent> */}
        {/* <TabsContent value="legal" className="space-y-4">...</TabsContent> */}
        {/* <TabsContent value="relationships" className="space-y-4">...</TabsContent> */}

      </Tabs>

      {/* 하단 안내 메시지 - 중요한 정보 강조 */}
      <div className="mt-8 text-xs text-primary-200 flex items-start p-4 bg-blue-50/40 rounded-lg border border-blue-100 shadow-inner"> {/* 디자인 더 강조 */}
        <Info className="flex-shrink-0 mr-3 h-4 w-4 text-blue-600 mt-0.5" /> {/* 아이콘 위치 조정 */}
        <div>
           <span className="font-medium text-blue-700">중요 안내:</span> 이 정보는 피어스페이스 프로필과 관리 시스템에 사용됩니다. 정확한 정보 입력이 매우 중요해요! 특히 대표 이미지, 로고, 파비콘은 **현재 브라우저의 로컬 스토리지에만 임시 저장**되니, 실제 운영 환경에서는 반드시 **서버로 업로드하는 기능**을 구현하셔야 합니다! 잊지 마세요! 미래로 가는 피어몰은 서버와 함께! 🚀
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
