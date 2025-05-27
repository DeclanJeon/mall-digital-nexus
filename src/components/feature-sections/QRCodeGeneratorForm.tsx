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
  Smartphone, Shield, Bell
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

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
  }[];
}

// Main services that should be shown by default
const MAIN_SERVICES: QrTypeDefinition[] = [
  { 
    value: 'peernumber', 
    label: '피어넘버', 
    icon: Shield, 
    fields: [
      { id: 'peerNumber', label: '피어넘버', placeholder: 'PEER-XXXX-XXXX-XXXX', required: true },
      { id: 'email', label: '내 이메일 (알림 수신용)', type: 'email', placeholder: 'your@email.com', required: true },
      { id: 'displayName', label: '표시 이름', placeholder: '홍길동' },
      { id: 'message', label: '환영 메시지', type: 'textarea', placeholder: '안녕하세요! 피어테라에서 연결해요.' }
    ]
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
  { 
    value: 'peermall', 
    label: '피어몰 만들기', 
    icon: Store,
    fields: [
      { id: 'storeName', label: '스토어 이름', required: true },
      { id: 'ownerName', label: '대표자명', required: true },
      { id: 'email', label: '이메일', type: 'email', required: true },
      { id: 'phone', label: '전화번호', type: 'tel', required: true }
    ]
  }
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
      // 피어넘버 QR 코드 포맷: peerterra.com/one/channel/{peerNumber}?email={email}&name={displayName}&message={message}
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
      
      // 이메일은 필수 (알림 전송용)
      params.append('email', email);
      
      if (displayName) params.append('name', displayName);
      if (message) params.append('message', message);
      
      // 스캔 추적을 위한 고유 ID 추가 (선택적)
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
    case 'store':
    case 'pdf':
    case 'images':
    case 'video':
    case 'social':
      staticContent = data.url || '';
      break;
    case 'app':
      staticContent = data.iosUrl || data.androidUrl || '';
      break;
    default: staticContent = data.default || '';
  }

  if (isDynamic && type !== 'peernumber') {
    const uniqueId = uuidv4().substring(0, 8);
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
}

const QRCodeGeneratorForm = () => {
  const [selectedType, setSelectedType] = useState<string>('url');
  const [isDynamic, setIsDynamic] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({ url: 'https://peermall.com' });
  const [qrName, setQrName] = useState<string>('');
  const [qrImage, setQrImage] = useState<string>('');
  const [generatedQrContent, setGeneratedQrContent] = useState<string>('');
  const [savedQRCodes, setSavedQRCodes] = useState<SavedQRCode[]>([]);

  useEffect(() => {
    const storedQRCodes = localStorage.getItem('peermall-qrcodes-v2');
    if (storedQRCodes) {
      try {
        setSavedQRCodes(JSON.parse(storedQRCodes));
      } catch (e) {
        console.error("Error parsing saved QR codes:", e);
        localStorage.removeItem('peermall-qrcodes-v2');
      }
    }
  }, []);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  useEffect(() => {
    const currentTypeDefinition = QR_TYPES.find(t => t.value === selectedType);
    const initialData: Record<string, string> = {};
    if (currentTypeDefinition?.placeholder && !currentTypeDefinition.fields) {
      initialData[currentTypeDefinition.value] = currentTypeDefinition.placeholder || '';
    } else if (selectedType === 'url') {
      initialData['url'] = 'https://peermall.com';
    } else if (selectedType === 'peernumber') {
      // 피어넘버 기본값 설정
      initialData['peerNumber'] = 'PEER-1234-5678-9012';
      initialData['email'] = '';
      initialData['displayName'] = '내 피어테라';
      initialData['message'] = '안녕하세요! 피어테라에서 연결해요.';
    }
    setFormData(initialData);
    setQrName('');
    setQrImage('');
    setGeneratedQrContent('');
  }, [selectedType]);

  const generatePreview = () => {
    const contentToEncode = formatQrContent(selectedType, formData, isDynamic);
    if (!contentToEncode || !Object.values(formData).some(v => v.trim())) {
      setQrImage('');
      setGeneratedQrContent('');
      return;
    }
    setQrImage(generateQrCodeImageUrl(contentToEncode));
    setGeneratedQrContent(contentToEncode);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentType = QR_TYPES.find(t => t.value === selectedType);
      const requiredFields = currentType?.fields?.filter(f => f.required) || [];
      
      // 필수 필드가 모두 채워졌는지 확인
      const allRequiredFieldsFilled = requiredFields.every(field => 
        formData[field.id] && formData[field.id].trim()
      );
      
      if (requiredFields.length === 0 || allRequiredFieldsFilled) {
        generatePreview();
      } else {
        setQrImage('');
        setGeneratedQrContent('');
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [formData, selectedType, isDynamic]);

  const handleSaveQR = () => {
    if (!qrName.trim()) {
      toast({ title: "이름 필요", description: "QR 코드를 저장하려면 이름을 입력해야 합니다.", variant: "destructive" });
      return;
    }
    if (!generatedQrContent) {
      toast({ title: "QR 코드 필요", description: "먼저 QR 코드를 생성하거나 내용을 입력해야 합니다.", variant: "destructive" });
      return;
    }

    // 피어넘버 QR 코드의 경우 백엔드에 알림 설정 정보 저장
    if (selectedType === 'peernumber') {
      console.log("Saving PeerNumber QR with email notification setup:", {
        name: qrName,
        peerNumber: formData.peerNumber,
        email: formData.email,
        displayName: formData.displayName,
        message: formData.message,
        qrUrl: generatedQrContent
      });
      toast({ 
        title: "피어넘버 QR 생성 완료", 
        description: `${formData.email}로 스캔 알림이 전송됩니다.`,
        duration: 4000
      });
    }

    if (isDynamic) {
      console.log("Saving Dynamic QR Info (requires backend):", {
        name: qrName,
        type: selectedType,
        targetData: formData,
        generatedDynamicUrl: generatedQrContent
      });
      toast({ title: "동적 QR 정보 기록 (백엔드 필요)", description: "실제 저장은 백엔드 연동이 필요합니다." });
    }

    const newQRCode: SavedQRCode = {
      id: uuidv4(),
      name: qrName,
      originalData: { ...formData },
      qrContent: generatedQrContent,
      image: qrImage,
      type: selectedType,
      isDynamic,
      createdAt: new Date().toISOString()
    };

    const updatedQRCodes = [...savedQRCodes, newQRCode];
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('peermall-qrcodes-v2', JSON.stringify(updatedQRCodes));
    toast({ title: "QR 코드가 저장되었습니다", description: "저장된 QR 코드는 목록에서 확인할 수 있습니다." });
    setQrName('');
  };

  const handleDownloadQR = async () => {
    if (!qrImage) {
      toast({ title: "이미지 없음", description: "다운로드할 QR 코드 이미지가 없습니다.", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch(qrImage);
      if (!response.ok) throw new Error('QR 코드 이미지 다운로드 실패');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = qrName ? `${qrName}.png` : `peerterra-qrcode-${selectedType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({ title: "QR 코드 다운로드 시작", description: "QR 코드 다운로드가 시작되었습니다." });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({ title: "다운로드 오류", description: "QR 코드 이미지 다운로드 중 오류 발생.", variant: "destructive" });
    }
  };

  const currentFormFields = useMemo(() => {
    const typeDefinition = QR_TYPES.find(t => t.value === selectedType);
    if (!typeDefinition) return null;

    if (typeDefinition.fields) {
      return typeDefinition.fields.map(field => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={`${selectedType}-${field.id}`} className="text-sm font-medium text-gray-300">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={`${selectedType}-${field.id}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
            />
          ) : (
            <Input
              id={`${selectedType}-${field.id}`}
              type={field.type || 'text'}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
            />
          )}
          {/* 피어넘버 필드에 대한 추가 설명 */}
          {selectedType === 'peernumber' && field.id === 'peerNumber' && (
            <p className="text-xs text-gray-400 mt-1">
              피어테라 사용자 고유 식별번호입니다. 채널 연결에 사용됩니다.
            </p>
          )}
          {selectedType === 'peernumber' && field.id === 'email' && (
            <div className="flex items-start gap-2 mt-1">
              <Bell className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-200">
                QR 코드가 스캔될 때마다 이 이메일로 알림이 전송됩니다.
              </p>
            </div>
          )}
        </div>
      ));
    } else {
      const inputId = typeDefinition.value;
      return (
        <div className="space-y-2">
          <Label htmlFor={`${selectedType}-${inputId}`} className="text-sm font-medium text-gray-300">
            {typeDefinition.label} 내용 <span className="text-red-400">*</span>
          </Label>
          <Input
            id={`${selectedType}-${inputId}`}
            value={formData[inputId] || ''}
            onChange={(e) => handleInputChange(inputId, e.target.value)}
            placeholder={typeDefinition.placeholder}
            className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
          />
        </div>
      );
    }
  }, [selectedType, formData]);

  const [showOtherServices, setShowOtherServices] = useState(false);

  return (
    <div className="max-w-6xl mx-auto text-gray-300 p-4 md:p-6 bg-gray-600 min-h-screen rounded-2xl">
      <h2 className="text-2xl font-bold mb-8 text-center text-white">QR 코드 생성기</h2>

      <div className="mb-8">
        <Label className="text-lg font-semibold mb-4 block text-gray-200">1. QR 코드 타입 선택</Label>
        <Card className="bg-gray-800 border-gray-700 p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MAIN_SERVICES.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                className={`flex flex-col items-center justify-center h-24 p-2 ${
                  selectedType === type.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <type.icon className="h-8 w-8 mb-2" />
                <span className="text-sm text-center">{type.label}</span>
              </Button>
            ))}
            
            {/* Other Services Dropdown */}
            <Button
              variant={showOtherServices ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 p-2 bg-gray-700 hover:bg-gray-600 border-gray-600"
              onClick={() => setShowOtherServices(!showOtherServices)}
            >
              <div className="h-8 w-8 mb-2 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                  ))}
                </div>
              </div>
              <span className="text-sm text-center">기타 서비스</span>
            </Button>
          </div>

          {/* Other Services Grid */}
          {showOtherServices && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-400 mb-3">기타 서비스</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
                {OTHER_SERVICES.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center h-20 p-2 ${
                      selectedType === type.value
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                    }`}
                    onClick={() => {
                      setSelectedType(type.value);
                      setShowOtherServices(false);
                    }}
                  >
                    <type.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs text-center">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Label className="text-lg font-semibold mb-3 block text-gray-200">2. 내용 입력</Label>
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="space-y-4">
              {/* 피어넘버가 아닌 경우에만 동적 QR 옵션 표시 */}
              {selectedType !== 'peernumber' && (
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                  <Label htmlFor="dynamic-switch" className="flex flex-col space-y-1">
                    <span className="font-medium text-gray-200">{isDynamic ? '동적 QR 코드' : '정적 QR 코드'}</span>
                    <span className="text-xs text-gray-400">
                      {isDynamic ? '링크 수정 가능, 추적 가능 (백엔드 필요)' : '내용 직접 포함, 수정 불가'}
                    </span>
                  </Label>
                  <Switch
                    id="dynamic-switch"
                    checked={isDynamic}
                    onCheckedChange={setIsDynamic}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="qr-name" className="text-sm font-medium text-gray-300">
                  QR 코드 이름 (저장용) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="qr-name"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  placeholder="예: 내 피어테라 채널"
                  className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                />
              </div>

              <hr className="my-4 border-gray-700" />

              {/* 피어넘버 선택시 특별 안내 */}
              {selectedType === 'peernumber' && (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold text-green-300">피어넘버 QR 코드</h4>
                  </div>
                  <div className="space-y-2 text-sm text-green-200">
                    <p>피어넘버를 통한 채널 연결을 위한 QR 코드입니다.</p>
                    <div className="flex items-start gap-2">
                      <Bell className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p>스캔될 때마다 등록된 이메일로 알림이 전송됩니다.</p>
                    </div>
                    <p className="text-xs">
                      스캔 시 <code className="bg-green-800 px-1 rounded">peerterra.com/one/channel/{formData.peerNumber || '피어넘버'}</code>로 이동됩니다.
                    </p>
                  </div>
                </div>
              )}

              {currentFormFields}
            </div>
          </Card>
        </div>

        <div>
          <Label className="text-lg font-semibold mb-3 block text-gray-200">3. 미리보기 및 저장</Label>
          <Card className="p-6 bg-gray-800 border-gray-700 sticky top-6">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white border rounded-lg p-4 flex flex-col items-center mb-4 w-full">
                <QrCode className="text-blue-600 mb-2 h-6 w-6" />
                <h3 className="text-base font-medium mb-3 text-gray-600">QR 코드 미리보기</h3>
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                  {qrImage ? (
                    <img src={qrImage} alt="QR 코드 미리보기" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-sm text-gray-400">내용 입력 시 표시</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center break-all px-2">
                  {isDynamic ? `동적 링크: ${generatedQrContent}` : `내용: ${generatedQrContent.slice(0, 50)}${generatedQrContent.length > 50 ? '...' : ''}`}
                </p>
                {selectedType === 'peernumber' && generatedQrContent && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield className="h-3 w-3" />
                      <span>피어테라 채널 연결</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Bell className="h-3 w-3" />
                      <span>스캔 알림 활성화</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center w-full mb-4">
                <h4 className="font-medium text-gray-200 truncate px-2">{qrName || '이름 없는 QR 코드'}</h4>
              </div>
              <div className="flex flex-col space-y-2 w-full">
                <Button onClick={handleSaveQR} className="w-full bg-blue-600 hover:bg-blue-700">
                  QR 코드 저장하기
                </Button>
                <Button onClick={handleDownloadQR} className="w-full bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600" variant="outline">
                  이미지 다운로드
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">저장된 QR 코드 목록</h3>
        {savedQRCodes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {savedQRCodes.slice().reverse().map((qrCode) => (
              <Card key={qrCode.id} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative bg-gray-800 border-gray-700">
                {qrCode.isDynamic && <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">동적</span>}
                {qrCode.type === 'peernumber' && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Shield className="h-2 w-2" />
                    <span>피어</span>
                  </div>
                )}
                <CardContent className="p-3 flex flex-col items-center">
                  <div className="aspect-square w-24 h-24 flex items-center justify-center bg-gray-50 rounded-md mb-2 border">
                    <img src={qrCode.image} alt={qrCode.name} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm font-medium truncate w-full text-center text-gray-200">{qrCode.name}</p>
                  <p className="text-xs text-gray-400">{new Date(qrCode.createdAt).toLocaleDateString()}</p>
                  {qrCode.type === 'peernumber' && (
                    <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                      <Bell className="h-3 w-3" />
                      <span>알림 활성</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <QrCode className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-100 text-lg mb-2">저장된 QR 코드가 없습니다</p>
            <p className="text-gray-400 text-sm">위에서 QR 코드를 생성하고 저장해보세요</p>
          </div>
        )}
      </div>

      {/* 피어넘버 사용법 안내 */}
      {selectedType === 'peernumber' && (
        <div className="mt-8">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              피어넘버 QR 코드 작동 방식
            </h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR 코드 스캔 시 동작
                </h4>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>사용자가 QR 코드를 스캔합니다</li>
                  <li className="flex items-start gap-2">
                    <span>2.</span>
                    <div>
                      <span>자동으로 </span>
                      <code className="bg-blue-800 px-2 py-1 rounded text-xs">
                        peerterra.com/one/channel/{formData.peerNumber || '[피어넘버]'}
                      </code>
                      <span>로 이동됩니다</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>3.</span>
                    <Bell className="h-4 w-4 text-yellow-400" />
                    <span>동시에 <strong>{formData.email || '[등록된 이메일]'}</strong>로 스캔 알림이 전송됩니다</span>
                  </li>
                </ol>
              </div>

              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <h4 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일 알림 내용
                </h4>
                <div className="bg-gray-700 p-3 rounded text-xs">
                  <p className="font-medium mb-2">제목: 피어테라 QR 코드 스캔 알림</p>
                  <div className="space-y-1 text-gray-300">
                    <p>• 스캔 시간: [현재 시간]</p>
                    <p>• 피어넘버: {formData.peerNumber || '[피어넘버]'}</p>
                    <p>• 표시 이름: {formData.displayName || '[표시 이름]'}</p>
                    <p>• 스캔 ID: [고유 식별자]</p>
                    <p>• 접속 URL: peerterra.com/one/channel/{formData.peerNumber || '[피어넘버]'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                <h4 className="font-medium text-yellow-300 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  URL 파라미터 정보
                </h4>
                <div className="space-y-2 text-xs">
                  <p><code className="bg-gray-700 px-2 py-1 rounded">email</code>: 알림 수신 이메일</p>
                  <p><code className="bg-gray-700 px-2 py-1 rounded">name</code>: 표시될 이름</p>
                  <p><code className="bg-gray-700 px-2 py-1 rounded">message</code>: 환영 메시지</p>
                  <p><code className="bg-gray-700 px-2 py-1 rounded">scan_id</code>: 스캔 추적용 고유 ID</p>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                <h4 className="font-medium text-purple-300 mb-2">💡 활용 팁</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>명함에 QR 코드를 인쇄하여 네트워킹에 활용</li>
                  <li>이벤트나 미팅에서 빠른 연락처 교환</li>
                  <li>온라인 프로필이나 소셜미디어에 QR 코드 게시</li>
                  <li>스캔 알림을 통해 누가 언제 접근했는지 실시간 확인</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 백엔드 연동 안내 */}
      {selectedType === 'peernumber' && (
        <div className="mt-6">
          <Card className="bg-orange-900/20 border border-orange-600 p-4">
            <h4 className="font-medium text-orange-300 mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              개발자 노트: 백엔드 연동 필요사항
            </h4>
            <div className="text-xs text-orange-200 space-y-2">
              <p>• <strong>이메일 알림 서비스</strong>: 스캔 시 이메일 전송 기능 구현 필요</p>
              <p>• <strong>스캔 추적</strong>: scan_id를 통한 스캔 로그 저장 및 분석</p>
              <p>• <strong>URL 파라미터 처리</strong>: peerterra.com에서 파라미터 파싱 및 알림 전송 로직</p>
              <p>• <strong>보안</strong>: 이메일 주소 보호 및 스팸 방지 메커니즘</p>
            </div>
          </Card>
        </div>
      )}

      {/* 푸터 정보 */}
      <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
        <p>PeerTerra QR 코드 생성기 - 다양한 형태의 QR 코드를 생성하고 관리하세요</p>
        <p className="mt-2">피어넘버 QR 코드로 실시간 알림과 함께 채널 연결을 시작해보세요</p>
      </div>
    </div>
  );
};

export default QRCodeGeneratorForm;