import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  MapPin,
  Calendar,
  Eye,
  Bookmark,
  Gift,
  CreditCard,
  Info,
  Users,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Package,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Copy,
  QrCode,
  Phone,
  MessageSquare,
  HelpCircle,
  Send,
  User,
  Mail,
  FileText,
  ArrowRight,
  Factory,
  Building2,
  Tag,
  Globe,
  DollarSign,
  PhoneCall,
  Video,
  Zap,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  Type,
  Palette,
  Edit3,
  X,
  Play,
  Pause,
  Filter,
  Grid3X3,
  LayoutGrid,
  Search,
  SortDesc,
  Heart as HeartIcon,
  ShoppingBag,
  Percent,
  Timer,
  Flame,
  Zap as ZapIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductDetailComponentProps } from '@/types/product';
import { cn } from '@/lib/utils';
import CallModal from '@/components/features/CallModal';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// **🎯 새로운 미니멀 디자인 토큰**
const modernTokens = {
  colors: {
    primary: '#2563eb', // 블루 600
    primaryHover: '#1d4ed8', // 블루 700
    secondary: '#64748b', // 슬레이트 500
    accent: '#f59e0b', // 앰버 500
    success: '#10b981', // 에메랄드 500
    warning: '#f59e0b', // 앰버 500
    danger: '#ef4444', // 레드 500
    background: '#ffffff',
    surface: '#f8fafc', // 슬레이트 50
    border: '#e2e8f0', // 슬레이트 200
    muted: '#64748b', // 슬레이트 500
    text: '#0f172a' // 슬레이트 900
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  radius: {
    sm: '0.375rem', // 6px
    base: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem' // 24px
  }
};

// **🎯 탭 타입 정의**
type TabType = 'details' | 'related' | 'qna';

// **🎯 연관 상품 타입**
interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  email: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
}

// Q&A 데이터 타입
interface QAItem {
  id: number;
  question: string;
  answer?: string;
  user: string;
  date: string;
  isAnswered: boolean;
}

// **🎯 상담 템플릿 타입**
interface ConsultationTemplate {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  category: 'product' | 'shipping' | 'payment' | 'service';
}

// **🎯 리치 텍스트 에디터 컴포넌트**
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "상담 내용을 자세히 작성해주세요...",
  className = ""
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const updateValue = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateValue();
  };

  const insertImage = () => {
    const url = prompt('이미지 URL을 입력하세요:');
    if (url) {
      applyFormat('insertImage', url);
    }
  };

  const insertLink = () => {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
  }> = ({ onClick, icon, title, isActive = false }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            className={cn(
              "h-8 w-8 p-0 hover:bg-slate-100",
              isActive && "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className={cn("border border-slate-200 rounded-lg overflow-hidden bg-white", className)}>
      {/* 에디터 툴바 */}
      <div className="border-b border-slate-200 bg-slate-50 p-2 flex items-center gap-1 flex-wrap">
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => applyFormat('bold')}
            icon={<Bold className="h-3 w-3" />}
            title="굵게"
          />
          <ToolbarButton
            onClick={() => applyFormat('italic')}
            icon={<Italic className="h-3 w-3" />}
            title="기울임"
          />
          <ToolbarButton
            onClick={() => applyFormat('underline')}
            icon={<Underline className="h-3 w-3" />}
            title="밑줄"
          />
        </div>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => applyFormat('justifyLeft')}
            icon={<AlignLeft className="h-3 w-3" />}
            title="왼쪽 정렬"
          />
          <ToolbarButton
            onClick={() => applyFormat('justifyCenter')}
            icon={<AlignCenter className="h-3 w-3" />}
            title="가운데 정렬"
          />
          <ToolbarButton
            onClick={() => applyFormat('justifyRight')}
            icon={<AlignRight className="h-3 w-3" />}
            title="오른쪽 정렬"
          />
        </div>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            onClick={() => applyFormat('insertUnorderedList')}
            icon={<List className="h-3 w-3" />}
            title="글머리 기호"
          />
          <ToolbarButton
            onClick={() => applyFormat('insertOrderedList')}
            icon={<ListOrdered className="h-3 w-3" />}
            title="번호 매기기"
          />
          <ToolbarButton
            onClick={() => applyFormat('formatBlock', 'blockquote')}
            icon={<Quote className="h-3 w-3" />}
            title="인용구"
          />
        </div>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={insertLink}
            icon={<Link2 className="h-3 w-3" />}
            title="링크 삽입"
          />
          <ToolbarButton
            onClick={insertImage}
            icon={<ImageIcon className="h-3 w-3" />}
            title="이미지 삽입"
          />
        </div>
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="p-3 min-h-[120px] focus:outline-none bg-white text-sm text-slate-900"
        style={{ 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          lineHeight: '1.5'
        }}
        data-placeholder={placeholder}
        onInput={updateValue}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

const ProductDetailComponent: React.FC<ProductDetailComponentProps> = ({
  product,
  peerMallName,
  peerMallKey,
  onBack,
  isOwner = false
}) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // **🎯 탭 상태 관리**
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  // 🎯 통화 모달 상태
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  // **🎯 상담 모달 상태**
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [consultationContent, setConsultationContent] = useState<string>('');
  const [consultationSubject, setConsultationSubject] = useState<string>('');
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);

  // **🎯 이미지 관련 상태 (다중 이미지 지원)**
  const [isGifPlaying, setIsGifPlaying] = useState<{[key: number]: boolean}>({});
  
  // Q&A 관련 상태
  const [newQuestion, setNewQuestion] = useState('');
  
  // **🎯 연관 상품 필터 상태**
  const [relatedFilter, setRelatedFilter] = useState<'all' | 'discount' | 'new' | 'bestseller'>('all');
  const [relatedSort, setRelatedSort] = useState<'popular' | 'price_low' | 'price_high' | 'newest'>('popular');
  
  // 가격 계산 로직
  const originalPrice = Number(product.price || 0);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const finalPrice = discountPrice || originalPrice;
  const discountPercent = discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  // **🎯 다중 이미지 배열 처리 (GIF 포함)**
  const productImages = React.useMemo(() => {
    if (product.imageUrl) {
      const images = product.imageUrl.split(',').map(url => url.trim()).filter(url => url);
      return images.length > 0 ? images : ['/placeholder-product.jpg'];
    }
    return ['/placeholder-product.jpg'];
  }, [product.imageUrl]);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  }, [])

  // **🎯 연관 상품 목 데이터**
  const relatedProducts: RelatedProduct[] = React.useMemo(() => [
    {
      id: '1',
      name: '화이트 클래식 스니커즈 프리미엄',
      price: 89000,
      discountPrice: 69000,
      imageUrl: productImages[0],
      rating: 4.8,
      reviewCount: 324,
      isNew: true,
      discount: 22
    },
    {
      id: '2', 
      name: '블랙 레더 캐주얼 슈즈',
      price: 125000,
      discountPrice: 99000,
      imageUrl: productImages[0],
      rating: 4.6,
      reviewCount: 156,
      isBestSeller: true,
      discount: 21
    },
    {
      id: '3',
      name: '그레이 런닝화 에어쿠션',
      price: 159000,
      imageUrl: productImages[0],
      rating: 4.9,
      reviewCount: 89,
      isNew: true
    },
    {
      id: '4',
      name: '네이비 하이탑 스니커즈',
      price: 79000,
      discountPrice: 59000,
      imageUrl: productImages[0],
      rating: 4.5,
      reviewCount: 267,
      discount: 25
    },
    {
      id: '5',
      name: '브라운 부츠 빈티지',
      price: 189000,
      discountPrice: 149000,
      imageUrl: productImages[0],
      rating: 4.7,
      reviewCount: 98,
      isBestSeller: true,
      discount: 21
    },
    {
      id: '6',
      name: '화이트 미니멀 슬립온',
      price: 65000,
      imageUrl: productImages[0],
      rating: 4.4,
      reviewCount: 234,
      isNew: true
    }
  ], [productImages]);

  // **🎯 연관 상품 필터링 및 정렬**
  const filteredRelatedProducts = React.useMemo(() => {
    let filtered = [...relatedProducts];
    
    // 필터링
    switch (relatedFilter) {
      case 'discount':
        filtered = filtered.filter(p => p.discountPrice);
        break;
      case 'new':
        filtered = filtered.filter(p => p.isNew);
        break;
      case 'bestseller':
        filtered = filtered.filter(p => p.isBestSeller);
        break;
      default:
        break;
    }
    
    // 정렬
    switch (relatedSort) {
      case 'price_low':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
    
    return filtered;
  }, [relatedProducts, relatedFilter, relatedSort]);

  // **🎯 상담 템플릿 데이터**
  const consultationTemplates: ConsultationTemplate[] = [
    {
      id: 'product_info',
      title: '상품 정보 문의',
      content: `
        <h3>상품 정보 문의</h3>
        <p>안녕하세요. <strong>${product.name}</strong>에 대해 문의드립니다.</p>
        <ul>
          <li>상품 사양에 대한 자세한 정보</li>
          <li>사용법 및 주의사항</li>
          <li>호환성 관련 문의</li>
        </ul>
        <p>답변 부탁드립니다.</p>
      `,
      icon: <Info className="h-4 w-4" />,
      category: 'product'
    },
    {
      id: 'stock_inquiry',
      title: '재고 및 입고 문의',
      content: `
        <h3>재고 문의</h3>
        <p><strong>${product.name}</strong>의 재고 현황에 대해 문의드립니다.</p>
        <ul>
          <li>현재 재고 수량</li>
          <li>추가 입고 예정일</li>
          <li>대량 주문 가능 여부</li>
        </ul>
        <p>빠른 답변 부탁드립니다.</p>
      `,
      icon: <Package className="h-4 w-4" />,
      category: 'product'
    },
    {
      id: 'shipping_inquiry',
      title: '배송 관련 문의',
      content: `
        <h3>배송 문의</h3>
        <p><strong>${product.name}</strong> 배송에 대해 문의드립니다.</p>
        <ul>
          <li>배송 소요 시간</li>
          <li>배송비 및 무료배송 조건</li>
          <li>특별 배송 요청</li>
        </ul>
        <p>감사합니다.</p>
      `,
      icon: <Truck className="h-4 w-4" />,
      category: 'shipping'
    },
    {
      id: 'payment_inquiry',
      title: '결제 및 할인 문의',
      content: `
        <h3>결제 문의</h3>
        <p><strong>${product.name}</strong> 구매 관련 결제 문의입니다.</p>
        <ul>
          <li>할인 혜택 및 쿠폰 적용</li>
          <li>결제 방법 문의</li>
          <li>대량 구매 할인</li>
        </ul>
        <p>검토 후 연락 부탁드립니다.</p>
      `,
      icon: <CreditCard className="h-4 w-4" />,
      category: 'payment'
    },
    {
      id: 'service_inquiry',
      title: 'A/S 및 서비스 문의',
      content: `
        <h3>A/S 문의</h3>
        <p><strong>${product.name}</strong>의 A/S 및 서비스에 대해 문의드립니다.</p>
        <ul>
          <li>품질보증 기간</li>
          <li>A/S 절차 및 비용</li>
          <li>교환/반품 정책</li>
        </ul>
        <p>상세한 안내 부탁드립니다.</p>
      `,
      icon: <Shield className="h-4 w-4" />,
      category: 'service'
    },
    {
      id: 'custom_inquiry',
      title: '기타 문의',
      content: `
        <h3>기타 문의</h3>
        <p><strong>${product.name}</strong>에 대한 기타 문의사항입니다.</p>
        <p>문의 내용을 아래에 자세히 작성해주세요:</p>
        <br>
      `,
      icon: <MessageCircle className="h-4 w-4" />,
      category: 'service'
    }
  ];

  // Q&A 데이터
  const [qaList, setQaList] = useState<QAItem[]>([
    {
      id: 1,
      question: "이 제품의 배송은 언제쯤 가능한가요?",
      answer: "주문 후 1-2일 내 발송 예정입니다. 영업일 기준으로 계산되며, 주말과 공휴일은 제외됩니다.",
      user: "김구매자",
      date: "2025-05-28",
      isAnswered: true
    }
  ]);

  // 🎯 통화 모달 데이터
  const callModalData = {
    title: peerMallName,
    owner: product.owner || '피어몰 운영자',
    phone: product.email || '+82-10-1234-5678',
    email: product.email,
    imageUrl: product.imageUrl,
    trustScore: 4.8,
    responseTime: '평균 2시간',
    isOnline: true
  };

  // **🎯 GIF 재생/정지 토글**
  const toggleGifPlayback = (index: number) => {
    setIsGifPlaying(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // **🎯 이미지가 GIF인지 확인**
  const isGifImage = (url: string) => {
    return url.toLowerCase().includes('.gif');
  };

  // **🎯 상담 템플릿 선택 핸들러**
  const handleTemplateSelect = (templateId: string) => {
    const template = consultationTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setConsultationContent(template.content);
      setConsultationSubject(template.title);
    }
  };

  // **🎯 상담 신청 제출**
  const handleConsultationSubmit = async () => {
    debugger;
    if (!isLoggedIn) {
      toast({
        title: "로그인이 필요합니다",
        description: "상담 신청을 위해 먼저 로그인해주세요.",
        variant: "destructive"
      });
      return;
    }

    // if (!consultationContent.trim() || !consultationSubject.trim()) {
    //   toast({
    //     title: "내용을 입력해주세요",
    //     description: "상담 제목과 내용을 모두 입력해주세요.",
    //     variant: "destructive"
    //   });
    //   return;
    // }
    if (!consultationSubject.trim()) {
      toast({
        title: "제목목을 입력해주세요",
        description: "상담 제목을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingConsultation(true);

    try {
      ///고객상담 부분
      const consultationData = {
        productId: product.id,
        productName: product.name,
        subject: consultationSubject,
        customerEmail: 'customer@example.com',
        sellerEmail: 'seller@example.com',
        timestamp: new Date().toISOString()
      };

      console.log('📧 상담 신청 데이터:', consultationData);

      toast({
        title: "상담 신청이 완료되었습니다! 🎉",
        description: "판매자에게 이메일이 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.",
      });

      setIsConsultationModalOpen(false);
      setSelectedTemplate('');
      setConsultationContent('');
      setConsultationSubject('');

    } catch (error) {
      console.error('상담 신청 오류:', error);
      toast({
        title: "상담 신청 오류",
        description: "상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      
      // toast({
      //   title: "링크가 복사되었습니다! 📋",
      //   description: "클립보드에 상품 링크가 복사되었습니다.",
      // });

      alert('링크가 복사되었습니다! 📋')
    } catch (error) {
      console.error('공유 실패:', error);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  const generateQRCode = () => {
    const currentUrl = window.location.href;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
  };


  // Q&A 질문 추가
  const handleQuestionSubmit = () => {
    if (newQuestion.trim()) {
      const newQA: QAItem = {
        id: Date.now(),
        question: newQuestion,
        user: "익명사용자",
        date: new Date().toISOString().split('T')[0],
        isAnswered: false
      };
      setQaList(prev => [newQA, ...prev]);
      setNewQuestion('');
      
      toast({
        title: "질문이 등록되었습니다! 💬",
        description: "판매자가 확인 후 답변드릴 예정입니다.",
      });
    }
  };

  // **🎯 탭 컨텐츠 렌더링 함수들**
  const renderDetailsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                <Info className="h-3 w-3 text-white" />
              </div>
              상품 상세 정보
            </h3>

            {/* Rich Content가 있으면 우선 표시 */}
            {product.richContent ? (
              <div 
                className="prose prose-slate max-w-none"
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: '1.6'
                }}
                dangerouslySetInnerHTML={{ __html: product.richContent }}
              />
            ) : (
              <div className="prose max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  { product.description || "아직 상세 설명이 등록되지 않았습니다." }
                </p>
              </div>    
            )}
          </div>

          {/* **🎯 상품 스펙 정보** */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 제조사/유통사 정보 */}
            {(product.manufacturer || product.distributor) && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                  <Factory className="h-4 w-4 text-blue-600" />
                  제조/유통 정보
                </h4>
                <div className="space-y-3">
                  {product.manufacturer && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Factory className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">제조사</p>
                        <p className="font-medium text-slate-900">{product.manufacturer}</p>
                      </div>
                    </div>
                  )}
                  {product.distributor && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">유통사</p>
                        <p className="font-medium text-slate-900">{product.distributor}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 상품 정보 */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                상품 정보
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <div>
                    <p className="text-xs text-slate-500">등록일</p>
                    <p className="font-medium text-slate-900">
                      {product.date}
                    </p>
                  </div>
                </div>
                {product.category && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <Tag className="h-4 w-4 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">카테고리</p>
                      <p className="font-medium text-slate-900">{product.category}</p>
                    </div>
                  </div>
                )}
                {product.stock && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <Package className="h-4 w-4 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">재고</p>
                      <p className="font-medium text-slate-900">{product.stock}개</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 상품 옵션 */}
          {product.options && product.options.length > 0 && (
            <div>
              <Separator className="my-6 bg-slate-200" />
              <h4 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-blue-600" />
                상품 옵션
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.options.map((option, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{index + 1}</span>
                      </div>
                      {option.name}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value, valueIndex) => (
                        <Badge key={valueIndex} variant="outline" className="bg-white border-slate-300 text-slate-700">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderRelatedTab = () => (
    //현재 피어몰내 판매중인 다른 상품품들
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* **🎯 필터 및 정렬 컨트롤** */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-blue-600" />
                {product.name} 내에서 판매중인 다른 상품들
              </h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                {filteredRelatedProducts.length}개
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* 필터 버튼들 */}
              <div className="flex gap-1">
                {[
                  { key: 'all', label: '전체', icon: Grid3X3 },
                  { key: 'discount', label: '할인', icon: Percent },
                  { key: 'new', label: '신상', icon: Sparkles },
                  { key: 'bestseller', label: '베스트', icon: Crown }
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={relatedFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRelatedFilter(filter.key as any)}
                    className={cn(
                      "flex items-center gap-1 text-xs h-8",
                      relatedFilter === filter.key 
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-300"
                    )}
                  >
                    <filter.icon className="h-3 w-3" />
                    {filter.label}
                  </Button>
                ))}
              </div>
              
              {/* 정렬 선택 */}
              <Select value={relatedSort} onValueChange={(value) => setRelatedSort(value as any)}>
                <SelectTrigger className="w-28 h-8 text-xs border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="price_low">낮은가격순</SelectItem>
                  <SelectItem value="price_high">높은가격순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* **🎯 연관 상품 그리드** */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRelatedProducts.map((relatedProduct, index) => (
            <motion.div
              key={relatedProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                <CardContent className="p-0">
                  {/* 상품 이미지 */}
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                    
                    {/* 상품 뱃지들 */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {relatedProduct.discount && (
                        <Badge className="bg-red-500 text-white font-medium text-xs px-2 py-1">
                          -{relatedProduct.discount}%
                        </Badge>
                      )}
                      {relatedProduct.isNew && (
                        <Badge className="bg-emerald-500 text-white font-medium text-xs px-2 py-1">
                          NEW
                        </Badge>
                      )}
                      {relatedProduct.isBestSeller && (
                        <Badge className="bg-amber-500 text-white font-medium text-xs px-2 py-1">
                          BEST
                        </Badge>
                      )}
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 shadow-sm"
                      >
                        <HeartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-500 shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* 빠른 구매 버튼 */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        장바구니
                      </Button>
                    </div>
                  </div>
                  
                  {/* 상품 정보 */}
                  <div className="p-4 space-y-3">
                    <h4 className="font-medium text-slate-900 line-clamp-2 text-sm leading-5 group-hover:text-blue-600 transition-colors duration-200">
                      {relatedProduct.name}
                    </h4>
                    
                    {/* 가격 정보 */}
                    <div className="space-y-1">
                      {relatedProduct.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            ₩{relatedProduct.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-slate-500 line-through">
                            ₩{relatedProduct.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-slate-900">
                          ₩{relatedProduct.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* 평점 및 리뷰 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {relatedProduct.rating}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({relatedProduct.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <TrendingUp className="h-3 w-3" />
                        <span>인기</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* **🎯 더보기 버튼** */}
      {filteredRelatedProducts.length > 0 && (
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            className="px-6 py-2 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            더 많은 상품 보기
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </motion.div>
  );

  const renderQnaTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Q&A 질문 작성 */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <MessageCircle className="h-3 w-3 text-white" />
            </div>
            새 질문하기
          </h3>
          <div className="space-y-4">
            <Textarea
              placeholder="제품에 대해 궁금한 점을 질문해주세요..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="min-h-[100px] resize-none border-slate-200 focus:border-blue-500 rounded-lg"
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">
                구체적으로 질문해주시면 더 정확한 답변을 받을 수 있어요!
              </p>
              <Button
                onClick={handleQuestionSubmit}
                disabled={!newQuestion.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                <Send className="h-4 w-4 mr-2" />
                질문하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Q&A 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{qaList.length}</p>
            <p className="text-sm text-slate-500">전체 질문</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {qaList.filter(qa => qa.isAnswered).length}
            </p>
            <p className="text-sm text-slate-500">답변 완료</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {qaList.filter(qa => !qa.isAnswered).length}
            </p>
            <p className="text-sm text-slate-500">답변 대기</p>
          </CardContent>
        </Card>
      </div>

      {/* Q&A 리스트 */}
      <div className="space-y-4">
        <AnimatePresence>
          {qaList.map((qa, index) => (
            <motion.div
              key={qa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  {/* 질문 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">Q</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium leading-relaxed" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                          {qa.question}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{qa.user}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{qa.date}</span>
                          </div>
                          {!qa.isAnswered && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="bg-amber-50 border-amber-300 text-amber-700 text-xs">
                                답변 대기중
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 답변 */}
                  {qa.isAnswered ? (
                    <div className="ml-12 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">A</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700 leading-relaxed" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                            {qa.answer}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Crown className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-600 font-medium">{peerMallName}</span>
                              <Badge variant="outline" className="bg-blue-50 border-blue-300 text-blue-700 text-xs ml-1">
                                판매자
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-12">
                      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-3">
                          <Timer className="h-4 w-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-amber-800" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                              답변 준비 중입니다
                            </p>
                            <p className="text-xs text-amber-600">
                              판매자가 확인 후 빠른 시일 내에 답변드릴 예정입니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 빈 상태 */}
      {qaList.length === 0 && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              아직 질문이 없어요
            </h3>
            <p className="text-slate-500 mb-6">
              이 상품에 대해 궁금한 점이 있으시면 언제든 질문해주세요!
            </p>
            <Button
              onClick={() => document.querySelector('textarea')?.focus()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              첫 번째 질문하기
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"
      >
        {/* **🎯 새로운 미니멀 네비게이션 헤더** */}
        <motion.div 
          className="flex items-center justify-between mb-6 p-4 rounded-lg bg-white border border-slate-200 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">피어몰로 돌아가기</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowQRCodeModal(!showQRCodeModal)}
              className="hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCopyLink}
              className="hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* **🎯 이미지 섹션 - 미니멀 스타일** */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    {isGifImage(product.imageUrl) ? (
                      <div className="relative w-full h-full">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"

                   onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={() => toggleGifPlayback(selectedImageIndex)}
                        >
                          {isGifPlaying[selectedImageIndex] ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                        <Badge className="absolute bottom-4 left-4 bg-blue-600 text-white font-medium">
                          GIF
                        </Badge>
                      </div>
                    ) : (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                      onClick={() => setIsImageZoomed(true)}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>

                    {discountPercent > 0 && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white font-bold px-3 py-1 shadow-sm">
                          -{discountPercent}%
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <Badge className="bg-emerald-500 text-white font-medium px-2 py-1 text-xs shadow-sm">
                          NEW
                        </Badge>
                      )}
                      {product.isBestSeller && (
                        <Badge className="bg-amber-500 text-white font-medium px-2 py-1 text-xs shadow-sm">
                          BEST
                        </Badge>
                      )}
                      {product.isRecommended && (
                        <Badge className="bg-blue-500 text-white font-medium px-2 py-1 text-xs shadow-sm">
                          추천
                        </Badge>
                      )}
                      {product.isCertified && (
                        <Badge className="bg-indigo-500 text-white font-medium px-2 py-1 text-xs shadow-sm">
                          인증
                        </Badge>
                      )}
                    </div>

                    {/* {productImages.length > 1 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                          {selectedImageIndex + 1} / {productImages.length}
                        </Badge>
                      </div>
                    )} */}
                  </div>
                  
                  {/* {productImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                        onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                        disabled={selectedImageIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                        onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                        disabled={selectedImageIndex === productImages.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )} */}
                </div>
              </CardContent>
            </Card>
            
            
          </motion.div>

          {/* **🎯 제품 정보 섹션 - 미니멀 스타일** */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && (
                  <Badge 
                    variant="outline" 
                    className="bg-slate-50 border-slate-300 text-slate-700"
                  >
                    {product.category}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(product.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                {product.name}
              </h1>
            </div>

            {(product.manufacturer || product.distributor) && (
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.manufacturer && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Factory className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">제조사</p>
                          <p className="font-medium text-slate-900">{product.manufacturer}</p>
                        </div>
                      </div>
                    )}
                    {product.distributor && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">유통사</p>
                          <p className="font-medium text-slate-900">{product.distributor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  {discountPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-slate-500 line-through">
                        ₩{originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white font-medium">
                        -{discountPercent}% 할인
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-slate-900">
                        ₩{finalPrice.toLocaleString()}
                      </span>
                      <span className="text-slate-500">{product.currency || 'KRW'}</span>
                    </div>
                  </div>
                </div>

                {product.stock && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-emerald-600" />
                    <span className="text-slate-600">재고: {product.stock}개</span>
                    {Number(product.stock) > 10 ? (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        충분
                      </Badge>
                    ) : Number(product.stock) > 0 ? (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        품절임박
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        품절
                      </Badge>
                    )}
                  </div>
                )}

                <Separator className="bg-slate-200" />
                
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-slate-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>총 금액</span>
                  <span className="text-slate-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                    ₩{(finalPrice * quantity).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {product.saleUrl ? (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => window.open(product.saleUrl, '_blank')}
                  disabled={product.stock ? Number(product.stock) <= 0 : false}
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock && Number(product.stock) <= 0 ? '품절' : '구매하기'}
                </Button>
              ) : (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                disabled={product.stock ? Number(product.stock) <= 0 : false}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock && Number(product.stock) <= 0 ? '품절' : '구매하기'}
                </Button>
              )}
              {/* 브랜드 홈페이지 방문 버튼 */}
              {product.brandUrl && (
                <Button
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 text-base rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                  onClick={() => window.open(product.brandUrl, '_blank')}
                >
                  <Globe className="h-5 w-5 mr-2" />
                  브랜드 홈페이지 방문
                </Button>
              )}

              <Dialog open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-3 text-base rounded-lg transition-all duration-300"
                    style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    고객상담
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      상품 상담 신청
                    </DialogTitle>
                    <DialogDescription>
                      <strong>{product.name}</strong>에 대한 상담을 신청합니다. 
                      원하는 문의 유형을 선택하거나 직접 작성해주세요.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">문의 유형 선택</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {consultationTemplates.map((template) => (
                          <Button
                            key={template.id}
                            variant={selectedTemplate === template.id ? "default" : "outline"}
                            className={cn(
                              "justify-start h-auto p-3 text-left",
                              selectedTemplate === template.id 
                                ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700" 
                                : "border-slate-300 hover:bg-slate-50"
                            )}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <div className="flex items-center gap-2">
                              {template.icon}
                              <span className="text-sm font-medium">{template.title}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">상담 제목</label>
                      <Input
                        placeholder="상담 제목을 입력하세요"
                        value={consultationSubject}
                        onChange={(e) => setConsultationSubject(e.target.value)}
                        className="w-full border-slate-300 focus:border-blue-500"
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">상담 내용</label>
                      <RichTextEditor
                        value={consultationContent}
                        onChange={setConsultationContent}
                        placeholder="상담 내용을 자세히 작성해주세요..."
                        className="w-full"
                      />
                    </div> */}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium mb-1">상담 신청 안내</p>
                          <ul className="space-y-1 text-xs">
                            <li>• 상담 신청 시 판매자에게 이메일이 전송됩니다</li>
                            <li>• 평균 응답 시간: 2-24시간 (영업일 기준)</li>
                            <li>• 로그인 상태에서만 상담 신청이 가능합니다</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsConsultationModalOpen(false)}
                      disabled={isSubmittingConsultation}
                      className="border-slate-300"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleConsultationSubmit}
                      disabled={isSubmittingConsultation || !consultationContent.trim() || !consultationSubject.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      {isSubmittingConsultation ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          전송 중...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          상담 신청
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {peerMallName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                      {peerMallName}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCallModalOpen(true)}
                    className="flex items-center gap-2 hover:bg-emerald-50 border-emerald-200 text-emerald-700"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">통화</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* **🎯 새로운 미니멀 탭 섹션** */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* **🎯 미니멀 탭 네비게이션** */}
          <div className="flex space-x-1 mb-6 p-3 rounded-lg bg-white border border-slate-200 shadow-sm overflow-x-auto">
            {[
              { 
                key: 'details', 
                label: '상품상세', 
                icon: Info,
                description: '상세 정보 및 스펙'
              },
              { 
                key: 'related', 
                label: `${product.name} 내에서 판매중인 다른 상품들`, 
                icon: Grid3X3,
                description: '추천 상품 보기'
              }
              // { 
              //   key: 'qna', 
              //   label: 'Q&A', 
              //   icon: HelpCircle,
              //   description: '질문과 답변'
              // },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                className={cn(
                  "flex-1 min-w-[120px] min-h-[100px] flex flex-col items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.key 
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                )}
                onClick={() => setActiveTab(tab.key as TabType)}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
                <span className={cn(
                  "text-xs",
                  activeTab === tab.key ? "text-blue-100" : "text-slate-500"
                )}>
                  {tab.description}
                </span>
                {tab.key === 'qna' && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      activeTab === tab.key 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {qaList.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* **🎯 탭 컨텐츠 영역** */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderDetailsTab()}
                </motion.div>
              )}

              {activeTab === 'related' && (
                <motion.div
                  key="related"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderRelatedTab()}
                </motion.div>
              )}

              {activeTab === 'qna' && (
                <motion.div
                  key="qna"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderQnaTab()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        

        {/* **🎯 미니멀 플로팅 액션 버튼 (모바일 최적화)** */}
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <div className="flex flex-col gap-2">
            {/* 위시리스트 버튼 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg",
                  isWishlisted 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-white text-red-500 hover:bg-red-50 border border-slate-200"
                )}
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast({
                    title: isWishlisted ? "위시리스트에서 제거" : "위시리스트에 추가!",
                    description: isWishlisted ? "제거되었습니다." : "저장되었습니다.",
                  });
                }}
              >
                <Heart className={cn(
                  "h-5 w-5",
                  isWishlisted && "fill-current"
                )} />
              </Button>
            </motion.div>

            {/* 공유 버튼 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="icon"
                variant="outline"
                className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-blue-50 border border-slate-200"
                onClick={handleCopyLink}
              >
                <Share2 className="h-5 w-5 text-blue-600" />
              </Button>
            </motion.div>

            {/* 상담 버튼 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 🎯 통화 모달 */}
      <CallModal
        open={isCallModalOpen}
        onOpenChange={setIsCallModalOpen}
        owner={product.owner || 'unknown'}
        peerMallKey={peerMallKey}
        location={callModalData}
      />

      {/* **🎯 이미지 확대 모달** */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setIsImageZoomed(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {/* 이미지 네비게이션 */}
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                    disabled={selectedImageIndex === productImages.length - 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              {/* 이미지 인디케이터 */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        selectedImageIndex === index ? "bg-white" : "bg-white/50"
                      )}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR코드 모달 */}
      <Dialog open={showQRCodeModal} onOpenChange={setShowQRCodeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              QR코드로 공유하기
            </DialogTitle>
            <DialogDescription>
              QR코드를 스캔하여 이 상품을 다른 기기에서 확인할 수 있어요!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
              <img
                src={generateQRCode()}
                alt="QR Code"
                className="w-48 h-48"
                onError={(e) => {
                  // QR 생성 실패시 대체 이미지
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTUwIDEwMEwxMDAgMTUwTDUwIDEwMEwxMDAgNTBaIiBmaWxsPSIjNjM2NjZBIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM2NjZBIiBmb250LXNpemU9IjEyIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4=';
                }}
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-600">
                스마트폰 카메라로 QR코드를 스캔해보세요
              </p>
            </div>
            
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                링크 복사
              </Button>
              <Button
                onClick={handleCopyLink}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ProductDetailComponent;