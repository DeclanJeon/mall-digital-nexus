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
  Smartphone
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// --- QR Code Types Definition ---
interface QrTypeDefinition {
  value: string;
  label: string;
  icon: React.ElementType;
  placeholder?: string;
  fields?: { id: string; label: string; placeholder?: string; type?: 'text' | 'textarea' | 'email' | 'tel'; required?: boolean }[];
}

const QR_TYPES: QrTypeDefinition[] = [
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
  { value: 'store', label: '스토어 링크', icon: Store, placeholder: '스토어 ID 또는 URL' },
  { value: 'pdf', label: 'PDF', icon: FileText, placeholder: 'PDF 파일 URL' },
  { value: 'images', label: '이미지 갤러리', icon: ImageIcon, placeholder: '이미지 갤러리 URL' },
  { value: 'video', label: '비디오', icon: Video, placeholder: '비디오 URL (Youtube, Vimeo 등)' },
  { value: 'social', label: '소셜 미디어', icon: Users, placeholder: '소셜 미디어 프로필 URL' },
  { value: 'app', label: '앱 스토어', icon: Smartphone, fields: [{ id: 'iosUrl', label: 'App Store URL' }, { id: 'androidUrl', label: 'Google Play URL' }] },
];

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

  if (isDynamic) {
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
      const requiredField = currentType?.fields?.find(f => f.required)?.id;
      if (!requiredField || (formData[requiredField] && formData[requiredField].trim())) {
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
      link.download = qrName ? `${qrName}.png` : `peermall-qrcode-${selectedType}.png`;
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

  return (
    <div className="max-w-6xl mx-auto text-gray-300 p-4 md:p-6 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-8 text-center text-white">QR 코드 생성기</h2>

      <div className="mb-8">
        <Label className="text-lg font-semibold mb-4 block text-gray-200">1. QR 코드 타입 선택</Label>
        <Card className="bg-gray-800 border-gray-700 p-4 md:p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
            {QR_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                className={`flex flex-col items-center justify-center h-20 p-2 ${
                  selectedType === type.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <type.icon className="h-6 w-6 mb-1" />
                <span className="text-xs text-center">{type.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Label className="text-lg font-semibold mb-3 block text-gray-200">2. 내용 입력</Label>
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="qr-name" className="text-sm font-medium text-gray-300">
                  QR 코드 이름 (저장용) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="qr-name"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  placeholder="예: 내 웹사이트"
                  className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                />
              </div>

              <hr className="my-4 border-gray-700" />

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
                <h3 className="text-base font-medium mb-3 text-gray-800">QR 코드 미리보기</h3>
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
                <CardContent className="p-3 flex flex-col items-center">
                  <div className="aspect-square w-24 h-24 flex items-center justify-center bg-gray-50 rounded-md mb-2 border">
                    <img src={qrCode.image} alt={qrCode.name} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm font-medium truncate w-full text-center text-gray-200">{qrCode.name}</p>
                  <p className="text-xs text-gray-400">{new Date(qrCode.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">저장된 QR 코드가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default QRCodeGeneratorForm;