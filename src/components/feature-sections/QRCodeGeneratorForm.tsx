import React, { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  QrCode, Link, Store, User, Text, Mail, Phone, MessageSquare,
  Wifi, FileText, Image as ImageIcon, Video, Users, Calendar,
  Smartphone, Shield, Bell, AlertCircle // AlertCircle 아이콘 추가
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';

// --- QR Code Types Definition ---

interface QrTypeDefinition {
  value: string;
  label: string;
  icon: React.ElementType;
  placeholder?: string;
  fields?: {
    id: string;
    label: string;
    placeholder?: string;
    type?: 'text' | 'textarea' | 'email' | 'tel' | 'url';
    required?: boolean;
    value?: string;
    readOnly?: boolean;
  }[];
  isStaticOnly?: boolean; // 동적 QR 코드 지원 여부 (true면 정적만 지원)
}

// Main services that should be shown by default
const MAIN_SERVICES: QrTypeDefinition[] = [
  {
    value: 'peermall',
    label: '피어몰 생성',
    icon: Store,
    fields: [
      {
        id: 'url',
        label: '피어몰 생성 URL',
        type: 'url',
        value: typeof window !== 'undefined' ? `${window.location.origin}/create-qrcode?create-peermall=true&step=1` : '',
        readOnly: true,
        required: true
      }
    ],
    isStaticOnly: true, // 피어몰 생성은 항상 정적
  },
  {
    value: 'peernumber',
    label: '피어넘버',
    icon: Shield,
    fields: [
      { id: 'peerNumber', label: '피어넘버', placeholder: 'PEER-XXXX-XXXX-XXXX', required: true },
      { id: 'email', label: '내 이메일 (알림 수신용)', type: 'email', placeholder: 'your@email.com', required: true },
      { id: 'displayName', label: '표시 이름', placeholder: '홍길동' },
      { id: 'message', label: '환영 메시지', type: 'textarea', placeholder: '안녕하세요! 피어테라에서 연결해요.' }
    ],
    isStaticOnly: true, // 피어넘버는 항상 정적
  },
  {
    value: 'product',
    label: '제품 QR코드',
    icon: QrCode,
    fields: [
      { id: 'productName', label: '제품명', required: true },
      { id: 'productUrl', label: '제품 URL', type: 'url', required: true },
      { id: 'description', label: '제품 설명', type: 'textarea' }
    ]
  },
  {
    value: 'community',
    label: '커뮤니티 QR코드',
    icon: Users,
    fields: [
      { id: 'communityName', label: '커뮤니티명', required: true },
      { id: 'communityUrl', label: '커뮤니티 URL', type: 'url', required: true },
      { id: 'description', label: '커뮤니티 소개', type: 'textarea' }
    ]
  },
];

// Other services that will be in the dropdown
const OTHER_SERVICES: QrTypeDefinition[] = [
  { value: 'url', label: 'URL', icon: Link, placeholder: 'https://example.com' },
  { value: 'text', label: '텍스트', icon: Text, placeholder: '텍스트 내용을 입력하세요...', fields: [{ id: 'text', label: '텍스트 내용', type: 'textarea', required: true }] },
  { value: 'email', label: '이메일', icon: Mail, fields: [{ id: 'to', label: '받는 사람 이메일', type: 'email', required: true }, { id: 'subject', label: '제목' }, { id: 'body', label: '내용', type: 'textarea' }] },
  { value: 'call', label: '전화번호', icon: Phone, placeholder: '국가번호 포함 전화번호', fields: [{ id: 'phone', label: '전화번호', type: 'tel', required: true }] },
  { value: 'sms', label: 'SMS', icon: MessageSquare, fields: [{ id: 'phone', label: '받는 사람 전화번호', type: 'tel', required: true }, { id: 'message', label: '메시지 내용', type: 'textarea' }] },
  { value: 'whatsapp', label: 'WhatsApp', icon: Smartphone, fields: [{ id: 'phone', label: 'WhatsApp 전화번호 (국가코드 포함)', type: 'tel', required: true }, { id: 'message', label: '미리 채울 메시지', type: 'textarea' }] },
  { value: 'wifi', label: 'WiFi', icon: Wifi, fields: [{ id: 'ssid', label: '네트워크 이름 (SSID)', required: true }, { id: 'password', label: '비밀번호' }, { id: 'encryption', label: '암호화 (WPA/WPA2, WEP, none)', placeholder: 'WPA' }, { id: 'hidden', label: '숨겨진 네트워크 여부 (true/false)', placeholder: 'false'}] },
  { value: 'vcard', label: '연락처 (VCard)', icon: User, fields: [
    { id: 'firstName', label: '이름', required: true }, { id: 'lastName', label: '성' },
    { id: 'organization', label: '회사/조직' }, { id: 'title', label: '직책' },
    { id: 'phoneWork', label: '직장 전화', type: 'tel' }, { id: 'phoneMobile', label: '휴대폰', type: 'tel' },
    { id: 'email', label: '이메일', type: 'email' }, { id: 'website', label: '웹사이트' },
    { id: 'street', label: '주소' }, { id: 'city', label: '도시' }, { id: 'zip', label: '우편번호' }, { id: 'country', label: '국가' }
  ]},
  { value: 'event', label: '이벤트', icon: Calendar, fields: [
    { id: 'summary', label: '이벤트 제목', required: true },
    { id: 'dtstart', label: '시작일시 (YYYYMMDDTHHMMSSZ)', placeholder:'20250402T180000Z', required: true },
    { id: 'dtend', label: '종료일시 (YYYYMMDDTHHMMSSZ)' },
    { id: 'location', label: '장소' }, { id: 'description', label: '설명', type: 'textarea' }
  ]},
  { value: 'pdf', label: 'PDF', icon: FileText, placeholder: 'PDF 파일 URL' },
  { value: 'images', label: '이미지 갤러리', icon: ImageIcon, placeholder: '이미지 갤러리 URL' },
  { value: 'video', label: '비디오', icon: Video, placeholder: '비디오 URL (Youtube, Vimeo 등)' },
  { value: 'social', label: '소셜 미디어', icon: Users, placeholder: '소셜 미디어 프로필 URL' },
  { value: 'app', label: '앱 스토어', icon: Smartphone, fields: [{ id: 'iosUrl', label: 'App Store URL' }, { id: 'androidUrl', label: 'Google Play URL' }] },
];

// Combine all QR types for internal use
const QR_TYPES: QrTypeDefinition[] = [...MAIN_SERVICES, ...OTHER_SERVICES];

// --- Placeholder functions ---
const generateQrCodeImageUrl = (content: string) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(content)}`;
};

const formatQrContent = (type: string, data: Record<string, string>, isDynamic: boolean, dynamicBaseUrl: string = "https://peermall.dynamic/qr/"): string => {
  let staticContent = '';

  switch (type) {
    case 'url': staticContent = data.url || ''; break;
    case 'text': staticContent = data.text || ''; break;
    case 'email': staticContent = `mailto:${data.to || ''}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`; break;
    case 'call': staticContent = `tel:${data.phone || ''}`; break;
    case 'sms': staticContent = `smsto:${data.phone || ''}:${encodeURIComponent(data.message || '')}`; break;
    case 'whatsapp': staticContent = `https://wa.me/${(data.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(data.message || '')}`; break;
    case 'peernumber':
      const peerNumber = data.peerNumber || '';
      const email = data.email || '';
      const displayName = data.displayName || '';
      const message = data.message || '';
      
      if (!peerNumber || !email) {
        staticContent = '';
        break;
      }
      
      let peerUrl = `https://peerterra.com/one/channel/${peerNumber}`;
      const params = new URLSearchParams();
      
      params.append('email', email);
      if (displayName) params.append('name', displayName);
      if (message) params.append('message', message);
      params.append('scan_id', uuidv4().substring(0, 8));
      
      peerUrl += `?${params.toString()}`;
      staticContent = peerUrl;
      break;
    case 'wifi': staticContent = `WIFI:T:${data.encryption || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};H:${data.hidden === 'true' ? 'true' : 'false'};;`; break;
    case 'vcard':
      staticContent = `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName || ''};${data.firstName || ''}\nFN:${data.firstName || ''} ${data.lastName || ''}\nORG:${data.organization || ''}\nTITLE:${data.title || ''}\n${data.phoneWork ? `TEL;TYPE=WORK,VOICE:${data.phoneWork}\n` : ''}${data.phoneMobile ? `TEL;TYPE=CELL,VOICE:${data.phoneMobile}\n` : ''}${data.email ? `EMAIL:${data.email}\n` : ''}${data.website ? `URL:${data.website}\n` : ''}${data.street || data.city || data.zip || data.country ? `ADR;TYPE=WORK:;;${data.street || ''};${data.city || ''};;${data.zip || ''};${data.country || ''}\n` : ''}END:VCARD`;
      break;
    case 'event':
      staticContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${data.summary || ''}\nDTSTART:${data.dtstart || ''}\n${data.dtend ? `DTEND:${data.dtend}\n` : ''}${data.location ? `LOCATION:${data.location || ''}\n` : ''}${data.description ? `DESCRIPTION:${data.description || ''}\n` : ''}END:VEVENT\nEND:VCALENDAR`;
      break;
    case 'store': // Assuming 'store' is similar to 'peermall' or a generic URL type for products/services
    case 'product': // Explicitly handle product if it has a specific format, otherwise defaults to URL
    case 'community': // Explicitly handle community if it has a specific format, otherwise defaults to URL
    case 'pdf':
    case 'images':
    case 'video':
    case 'social':
      staticContent = data.url || data.productUrl || data.communityUrl || ''; // Prioritize specific fields if available
      break;
    case 'app':
      staticContent = data.iosUrl || data.androidUrl || '';
      break;
    default: staticContent = data.default || '';
  }

  if (isDynamic && type !== 'peernumber' && type !== 'peermall') { // peermall and peernumber are not typically dynamic in this context
    const uniqueId = uuidv4().substring(0, 8);
    // This is where you would typically save the 'staticContent' to a database associated with 'uniqueId'
    // For now, we just return the dynamic link structure.
    // The actual resolution of this dynamic link to 'staticContent' would happen server-side.
    return `${dynamicBaseUrl}${uniqueId}`;
  }
  return staticContent;
};

// --- Saved QR Code Type ---
interface SavedQRCode {
  id: string;
  name: string;
  originalData: Record<string, string>;
  qrContent: string;
  image: string;
  type: string;
  isDynamic: boolean;
  createdAt: string;
  // Optional: fields for dynamic QR codes if you store target URL directly
  dynamicTarget?: string; 
}

const QRCodeGeneratorForm = () => {
  const { isAuthenticated, user } = useAuth(); // isAuthenticated와 user 가져오기
  const [selectedType, setSelectedType] = useState<string>('url');
  const [isDynamic, setIsDynamic] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({ url: 'https://peermall.com' });
  const [qrName, setQrName] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showAllServices, setShowAllServices] = useState<boolean>(false);
  const [savedQRCodes, setSavedQRCodes] = useState<SavedQRCode[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');

  // 로그인 상태 변경 시 동적 QR 코드 상태 업데이트
  useEffect(() => {
    if (!isAuthenticated) {
      setIsDynamic(false); // 로그아웃 상태이면 강제로 정적 QR로 설정
    }
  }, [isAuthenticated]);

  // Load saved QR codes from local storage on mount
  useEffect(() => {
    const storedQRCodes = localStorage.getItem('peermall-qrcodes-v2');
    if (storedQRCodes) {
      try {
        const parsedQRCodes = JSON.parse(storedQRCodes);
        // Date strings might need to be parsed back into Date objects if necessary
        setSavedQRCodes(parsedQRCodes);
      } catch (error) {
        console.error("Failed to parse saved QR codes:", error);
        localStorage.removeItem('peermall-qrcodes-v2'); // Clear corrupted data
      }
    }
  }, []);

  const currentQrType = useMemo(() => {
    return QR_TYPES.find(type => type.value === selectedType);
  }, [selectedType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    const typeDefinition = QR_TYPES.find(t => t.value === newType);
    const initialFormData: Record<string, string> = {};
    if (typeDefinition?.fields) {
      typeDefinition.fields.forEach(field => {
        initialFormData[field.id] = field.value || ''; // Use pre-defined value if available
      });
    } else if (typeDefinition?.placeholder && newType !== 'peermall') {
      // For types like 'url', 'text' etc., that have a direct placeholder
      // Ensure the key for formData matches the 'value' of the type definition
      initialFormData[newType] = ''; // Default to empty or could use placeholder if desired
    }
    setFormData(initialFormData);
    setQrName(typeDefinition?.label ? `${typeDefinition.label} QR 코드` : '새 QR 코드');
    setQrImageUrl(''); // Reset QR image on type change
    setGeneratedContent('');
  };

  const generateQRCode = () => {
    if (!currentQrType) {
      toast({ title: "오류", description: "QR 코드 유형을 선택해주세요.", variant: "destructive" });
      return;
    }

    let dataToFormat = { ...formData };

    // 필수 필드 검증
    if (currentQrType.fields) {
      for (const field of currentQrType.fields) {
        if (field.required && !dataToFormat[field.id]) {
          toast({ title: "입력 필요", description: `${field.label} 필드를 입력해주세요.`, variant: "destructive" });
          return;
        }
        // 필드에 고정값이 있고, 사용자가 입력하지 않았거나 기본값을 사용해야 하는 경우
        if (field.value && field.readOnly && !dataToFormat[field.id]) {
            dataToFormat[field.id] = field.value;
        }
      }
    } else if (!dataToFormat[currentQrType.value] && currentQrType.placeholder && currentQrType.value !== 'peermall') {
      // 단일 입력 타입 (필드가 없고 placeholder만 있는 경우, peermall 제외)
      toast({ title: "입력 필요", description: `${currentQrType.label} 내용을 입력해주세요.`, variant: "destructive" });
      return;
    }

    // 'peermall' 타입의 경우, formData에 고정 URL을 설정 (handleTypeChange에서 이미 처리되었을 수 있음)
    if (selectedType === 'peermall' && currentQrType.fields) {
        currentQrType.fields.forEach(field => {
            if (field.value && field.readOnly) { // 고정된 값이 있는 경우
                dataToFormat[field.id] = field.value;
            }
        });
    }
    
    // 로그인하지 않은 사용자는 동적 QR 코드 생성 불가 (UI에서 비활성화되지만, 이중 방어)
    // peermall 및 peernumber는 이 로직에서 동적 QR 대상이 아님
    const canBeDynamic = selectedType !== 'peermall' && selectedType !== 'peernumber';
    const effectiveIsDynamic = isAuthenticated && isDynamic && canBeDynamic;

    const content = formatQrContent(selectedType, dataToFormat, effectiveIsDynamic);
    if (!content) {
      toast({ title: "생성 실패", description: "QR 코드 내용을 생성할 수 없습니다. 입력값을 확인해주세요.", variant: "destructive" });
      return;
    }
    setGeneratedContent(content);
    setQrImageUrl(generateQrCodeImageUrl(content));
    toast({ title: "QR 코드 생성됨", description: "아래에서 QR 코드를 확인하세요." });
  };

  const saveQRCode = () => {
    if (!qrImageUrl || !generatedContent) {
      toast({ title: "저장 실패", description: "먼저 QR 코드를 생성해주세요.", variant: "destructive" });
      return;
    }
    if (!qrName.trim()) {
      toast({ title: "저장 실패", description: "QR 코드 이름을 입력해주세요.", variant: "destructive" });
      return;
    }

    const canBeDynamic = selectedType !== 'peermall' && selectedType !== 'peernumber';
    const effectiveIsDynamic = isAuthenticated && isDynamic && canBeDynamic;

    const newQRCode: SavedQRCode = {
      id: uuidv4(),
      name: qrName.trim(),
      originalData: { ...formData },
      qrContent: generatedContent,
      image: qrImageUrl,
      type: selectedType,
      isDynamic: effectiveIsDynamic,
      createdAt: new Date().toISOString(),
      dynamicTarget: effectiveIsDynamic ? generatedContent : undefined // Store original content if dynamic for potential future editing
    };

    const updatedQRCodes = [newQRCode, ...savedQRCodes];
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('peermall-qrcodes-v2', JSON.stringify(updatedQRCodes));
    toast({ title: "QR 코드 저장됨", description: `"${newQRCode.name}" 이름으로 저장되었습니다.` });
    setActiveTab('saved');
  };

  const loadSavedQRCodes = () => {
    const storedQRCodes = localStorage.getItem('peermall-qrcodes-v2');
    if (storedQRCodes) {
      setSavedQRCodes(JSON.parse(storedQRCodes));
    }
  };

  const handleSelectSavedQRCode = (qrCode: SavedQRCode) => {
    setSelectedType(qrCode.type);
    setFormData(qrCode.originalData);
    setQrName(qrCode.name);
    setQrImageUrl(qrCode.image);
    setGeneratedContent(qrCode.qrContent);
    setIsDynamic(qrCode.isDynamic);
    setActiveTab('create');
    toast({ title: 'QR 코드 불러옴', description: `"${qrCode.name}" QR 코드를 수정합니다.` });
  };

  const deleteQRCode = (idToDelete: string) => {
    const updatedQRCodes = savedQRCodes.filter(qr => qr.id !== idToDelete);
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('peermall-qrcodes-v2', JSON.stringify(updatedQRCodes));
    toast({ title: 'QR 코드 삭제됨', variant: 'destructive' });
  };

  const copyQRCodeImage = async () => {
    if (!qrImageUrl) return;
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      toast({ title: 'QR 코드 이미지 복사됨' });
    } catch (error) {
      toast({ title: '복사 실패', description: '이미지를 복사할 수 없습니다.', variant: 'destructive' });
    }
  };

  const downloadQRCodeImage = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `${qrName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'qrcode'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'QR 코드 이미지 다운로드 시작됨' });
  };

  const displayedServices = showAllServices ? QR_TYPES : MAIN_SERVICES;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <Button 
            onClick={() => setActiveTab('create')} 
            variant={activeTab === 'create' ? 'default' : 'outline'}
            className="rounded-r-none"
          >
            QR 생성
          </Button>
          {/* <Button 
            onClick={() => setActiveTab('saved')} 
            variant={activeTab === 'saved' ? 'default' : 'outline'}
            className="rounded-l-none"
          >
            저장된 QR ({savedQRCodes.length})
          </Button> */}
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel: QR Code Options */}
          <div className="md:col-span-2 space-y-6 bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">1. QR 코드 유형 선택</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {displayedServices.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "secondary" : "outline"}
                  onClick={() => handleTypeChange(type.value)}
                  className="flex flex-col items-center justify-center h-24 p-2 text-center"
                >
                  <type.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs leading-tight">{type.label}</span>
                </Button>
              ))}
            </div>
            {!showAllServices && OTHER_SERVICES.length > 0 && (
              <Button variant="link" onClick={() => setShowAllServices(true)} className="w-full">
                더 많은 서비스 보기...
              </Button>
            )}
            {showAllServices && (
              <Button variant="link" onClick={() => setShowAllServices(false)} className="w-full">
                간단히 보기
              </Button>
            )}

            <h2 className="text-xl font-semibold mb-2 pt-4">2. 내용 입력</h2>
            <Input
              type="text"
              placeholder="QR 코드 이름 (예: 내 웹사이트)"
              value={qrName}
              onChange={(e) => setQrName(e.target.value)}
              className="w-full mb-4"
            />

            {currentQrType?.fields?.map(field => (
              <div key={field.id} className="space-y-1">
                <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder || field.label}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    readOnly={field.readOnly}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type || 'text'}
                    placeholder={field.placeholder || field.label}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    readOnly={field.readOnly}
                  />
                )}
              </div>
            ))}
            {!currentQrType?.fields && currentQrType?.placeholder && currentQrType.value !== 'peermall' && (
              <div className="space-y-1">
                <Label htmlFor={currentQrType.value}>{currentQrType.label}</Label>
                <Textarea
                  id={currentQrType.value}
                  placeholder={currentQrType.placeholder}
                  value={formData[currentQrType.value] || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            )}
            
            {/* Dynamic QR Switch - peermall과 peernumber는 동적 QR 대상이 아님 */}
            {selectedType !== 'peermall' && selectedType !== 'peernumber' && (
              <div className="flex items-center space-x-2 pt-4">
                {/* <Switch
                  id="dynamic-qr"
                  checked={isDynamic}
                  onCheckedChange={setIsDynamic}
                  disabled={!isAuthenticated}
                  aria-readonly={!isAuthenticated}
                />
                <Label htmlFor="dynamic-qr" className="flex flex-col space-y-1">
                  <span>동적 QR 코드 (로그인 필요)</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    생성 후에도 QR 코드의 내용을 변경할 수 있습니다.
                  </span>
                </Label> */}
              </div>
            )}
            {isDynamic && !isAuthenticated && (
              <p className="text-sm text-red-500 mt-1">
                동적 QR 코드를 생성하려면 로그인이 필요합니다.
              </p>
            )}
            {isDynamic && currentQrType?.isStaticOnly && (
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700 text-sm">
                이 QR 코드 유형은 정적 QR 코드만 지원합니다.
              </div>
            )}
            <Button onClick={generateQRCode} className="w-full mt-6 py-3 text-lg">
              <QrCode className="mr-2 h-5 w-5" /> QR 코드 생성
            </Button>
          </div>

          {/* Right Panel: QR Code Preview & Actions */}
          <div className="space-y-4 bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">3. QR 코드 확인</h2>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                {qrImageUrl ? (
                  <img src={qrImageUrl} alt="Generated QR Code" className="w-48 h-48 object-contain border rounded" />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded border">
                    <QrCode className="w-16 h-16" />
                  </div>
                )}
                {generatedContent && (
                  <p className="text-xs text-muted-foreground mt-2 break-all max-w-xs text-center">
                    내용: {generatedContent.length > 70 ? generatedContent.substring(0, 70) + '...' : generatedContent}
                  </p>
                )}
                {qrImageUrl && (
                    <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                        <Button onClick={copyQRCodeImage} variant="outline" className="flex-1">이미지 복사</Button>
                        <Button onClick={downloadQRCodeImage} variant="outline" className="flex-1">다운로드</Button>
                    </div>
                )}
                {/* <Button onClick={saveQRCode} disabled={!qrImageUrl} className="w-full mt-2">QR 코드 저장</Button> */}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6 text-center">저장된 QR 코드 목록</h2>
          {savedQRCodes.length === 0 ? (
            <p className="text-center text-muted-foreground">저장된 QR 코드가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedQRCodes.map(qr => (
                <Card key={qr.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate mb-2" title={qr.name}>{qr.name}</h3>
                    <img src={qr.image} alt={qr.name} className="w-full h-auto aspect-square object-contain rounded border mb-2" />
                    <p className="text-xs text-muted-foreground truncate">종류: {QR_TYPES.find(t => t.value === qr.type)?.label || qr.type}</p>
                    <p className="text-xs text-muted-foreground">상태: {qr.isDynamic ? '동적' : '정적'}</p>
                    <p className="text-xs text-muted-foreground">생성일: {new Date(qr.createdAt).toLocaleDateString()}</p>
                    <div className="mt-3 flex space-x-2">
                      <Button onClick={() => handleSelectSavedQRCode(qr)} size="sm" variant="outline" className="flex-1">선택</Button>
                      <Button onClick={() => deleteQRCode(qr.id)} size="sm" variant="destructive" className="flex-1">삭제</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeGeneratorForm;