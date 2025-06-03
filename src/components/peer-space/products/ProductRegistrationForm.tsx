import React, { useState, useRef, useEffect } from 'react';
import { saveProduct } from '@/services/storage/productStorage';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Image,
  Link,
  ShoppingBag,
  Truck,
  Factory,
  Check,
  QrCode,
  Info,
  FileImage,
  RefreshCw,
  Save,
  Tag,
  Globe,
  DollarSign,
  ExternalLink,
  Download,
  HelpCircle,
  Plus,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  ImageIcon,
  Type,
  Palette,
  Eye,
  Edit3,
  Copy,
  Clipboard,
  FileText,
  Sparkles,
  Building2,
  Package,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  Award,
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Layers,
  Grid,
  RotateCcw
} from "lucide-react";
import ProductRegistrationPreview from "./ProductRegistrationPreview";
import { Product } from "@/types/product";
import { ContentType } from '@/types/space';
import { peermallStorage } from '@/services/storage/peermallStorage';

// **🎯 Rich Text Editor Component**
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "내용을 입력하거나 다른 곳에서 복사해서 붙여넣으세요...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // 🎯 초기화 및 값 설정
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
    setIsEmpty(!value || value.trim() === '');
  }, []);

  // 🎯 에디터 내용 업데이트 (수정됨)
  const updateValue = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const textContent = editorRef.current.textContent || '';
      
      setIsEmpty(textContent.trim() === '');
      onChange(content);
    }
  };

  // **🎯 붙여넣기 이벤트 핸들러 - 서식 완벽 유지**
  const handlePaste = (
    e: React.ClipboardEvent,
    editorRef: React.RefObject<HTMLDivElement>
  ) => {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // 🎯 HTML 데이터 우선 처리 (서식 유지)
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    const rtfData = clipboardData.getData('text/rtf');

    console.log('📋 붙여넣기 데이터:', {
      htmlData: !!htmlData,
      textData: !!textData,
      rtfData: !!rtfData,
    });

    if (htmlData) {
      // HTML 서식이 있는 경우 - 서식 유지하면서 정리
      const cleanedHtml = sanitizeAndPreserveHtml(htmlData);
      insertHtmlAtCursor(cleanedHtml);
    } else if (textData) {
      // 텍스트만 있는 경우 - 줄바꿈 보존
      const formattedText = preserveTextFormatting(textData);
      insertTextAtCursor(formattedText);
    }

    updateValue();
  };

  // **🧹 HTML 정리하면서 서식 보존**
  const sanitizeAndPreserveHtml = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 🚨 위험한 요소들 제거
    const dangerousElements = tempDiv.querySelectorAll(
      'script, object, embed, applet, form, input, button, iframe'
    );
    dangerousElements.forEach(el => el.remove());

    // 🎯 스타일 속성 정리 (중요한 서식만 보존)
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      const element = el as HTMLElement;

      // 위험한 속성들 제거
      element.removeAttribute('onclick');
      element.removeAttribute('onload');
      element.removeAttribute('onerror');
      element.removeAttribute('onmouseover');
      element.removeAttribute('id');
      element.removeAttribute('class');

      // 🎨 중요한 스타일 속성들만 보존
      const style = element.style;
      const preservedStyles: { [key: string]: string } = {};

      // 텍스트 서식
      if (style.fontWeight) preservedStyles.fontWeight = style.fontWeight;
      if (style.fontStyle) preservedStyles.fontStyle = style.fontStyle;
      if (style.textDecoration)
        preservedStyles.textDecoration = style.textDecoration;
      if (style.fontSize) preservedStyles.fontSize = style.fontSize;
      if (style.fontFamily) preservedStyles.fontFamily = style.fontFamily;
      if (style.color) preservedStyles.color = style.color;
      if (style.backgroundColor)
        preservedStyles.backgroundColor = style.backgroundColor;

      // 레이아웃
      if (style.textAlign) preservedStyles.textAlign = style.textAlign;
      if (style.lineHeight) preservedStyles.lineHeight = style.lineHeight;
      if (style.margin) preservedStyles.margin = style.margin;
      if (style.padding) preservedStyles.padding = style.padding;
      if (style.borderLeft) preservedStyles.borderLeft = style.borderLeft; // 인용구용

      // 스타일 재적용
      element.removeAttribute('style');
      Object.entries(preservedStyles).forEach(([key, value]) => {
        element.style.setProperty(key, value);
      });
    });

    // 🎯 특별한 요소들 처리
    processSpecialElements(tempDiv);

    return tempDiv.innerHTML;
  };

  // **🎨 특별한 요소들 처리 (표, 리스트, 인용구 등)**
  const processSpecialElements = (container: HTMLElement) => {
    // 📊 표 스타일 개선
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.border = '1px solid #e5e7eb';
      table.style.marginTop = '1rem';
      table.style.marginBottom = '1rem';

      // 테이블 셀 스타일
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        const cellElement = cell as HTMLElement;
        cellElement.style.border = '1px solid #e5e7eb';
        cellElement.style.padding = '8px 12px';
        if (cell.tagName === 'TH') {
          cellElement.style.backgroundColor = '#f9fafb';
          cellElement.style.fontWeight = 'bold';
        }
      });
    });

    // 📝 리스트 스타일 개선
    const lists = container.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const listElement = list as HTMLElement;
      listElement.style.paddingLeft = '1.5rem';
      listElement.style.marginTop = '0.5rem';
      listElement.style.marginBottom = '0.5rem';
    });

    // 💬 인용구 스타일 개선
    const blockquotes = container.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      const quoteElement = quote as HTMLElement;
      quoteElement.style.borderLeft = '4px solid #3b82f6';
      quoteElement.style.paddingLeft = '1rem';
      quoteElement.style.margin = '1rem 0';
      quoteElement.style.backgroundColor = '#f8fafc';
      quoteElement.style.fontStyle = 'italic';
    });

    // 🖼️ 이미지 처리
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      const imgElement = img as HTMLElement;
      imgElement.style.maxWidth = '100%';
      imgElement.style.height = 'auto';
      imgElement.style.borderRadius = '8px';
      imgElement.style.margin = '0.5rem 0';
    });

    // 🔗 링크 스타일
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      const linkElement = link as HTMLElement;
      linkElement.style.color = '#3b82f6';
      linkElement.style.textDecoration = 'underline';
      // 보안을 위해 target과 rel 설정
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // 📄 제목 태그들 스타일 개선
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const headingElement = heading as HTMLElement;
      headingElement.style.fontWeight = 'bold';
      headingElement.style.marginTop = '1.5rem';
      headingElement.style.marginBottom = '0.75rem';

      switch (heading.tagName) {
        case 'H1':
          headingElement.style.fontSize = '2rem';
          break;
        case 'H2':
          headingElement.style.fontSize = '1.75rem';
          break;
        case 'H3':
          headingElement.style.fontSize = '1.5rem';
          break;
        case 'H4':
          headingElement.style.fontSize = '1.25rem';
          break;
        default:
          headingElement.style.fontSize = '1.125rem';
      }
    });
  };

  // **📝 텍스트 서식 보존 (줄바꿈, 공백 등)**
  const preserveTextFormatting = (text: string): string => {
    return text
      .replace(/\r\n/g, '\n') // Windows 줄바꿈 통일
      .replace(/\r/g, '\n') // Mac 줄바꿈 통일
      .split('\n')
      .map(line => {
        // 빈 줄은 <br>로, 내용이 있는 줄은 <p>로 감싸기
        if (line.trim() === '') {
          return '<br>';
        } else {
          // HTML 특수문자 이스케이프
          const escapedLine = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          return `<p>${escapedLine}</p>`;
        }
      })
      .join('');
  };

  // **🎯 커서 위치에 HTML 삽입 (개선된 버전)**
  const insertHtmlAtCursor = (html: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // 커서가 없으면 에디터 끝에 추가
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
      }
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();

    // HTML을 DocumentFragment로 변환
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    range.insertNode(fragment);

    // 커서를 삽입된 내용 뒤로 이동
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    // 포커스 유지
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // **📝 커서 위치에 텍스트 삽입 (개선된 버전)**
  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.innerHTML += text;
      }
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();

    // HTML 형태로 삽입
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    if (editorRef.current) {
      editorRef.current.focus();
    }
  };



  // 🎯 포커스 핸들러 (수정됨)
  const handleFocus = () => {
    setIsEmpty(false);
    // 에디터가 비어있으면 커서를 맨 앞으로
    if (editorRef.current && editorRef.current.textContent?.trim() === '') {
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(editorRef.current, 0);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // 🎯 블러 핸들러 (수정됨)
  const handleBlur = () => {
    if (editorRef.current) {
      const textContent = editorRef.current.textContent || '';
      setIsEmpty(textContent.trim() === '');
    }
  };

  // 🎯 키보드 입력 핸들러 추가
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter 키 처리
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: 줄바꿈
        e.preventDefault();
        document.execCommand('insertHTML', false, '<br>');
        updateValue();
      }
      // 일반 Enter는 기본 동작 허용 (새 문단)
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {isPreviewMode ? (
        <div className="p-4 min-h-[200px] bg-white">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">내용이 없습니다.</p>' }}
          />
        </div>
      ) : (
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="p-4 min-h-[200px] focus:outline-none bg-white relative"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              lineHeight: '1.6'
            }}
            onInput={updateValue}
            onPaste={(e) => handlePaste(e, editorRef)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            data-placeholder={placeholder}
            // 🚨 dangerouslySetInnerHTML 제거!
          />
          {isEmpty && (
            <div 
              className="absolute top-4 left-4 pointer-events-none text-gray-400 select-none"
              style={{ zIndex: 1 }}
            >
              {placeholder}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// **🎯 카테고리 정의**
const PRODUCT_CATEGORIES = [
  { id: 1, name: '가전/디지털', icon: '📱' },
  { id: 2, name: '패션의류', icon: '👕' },
  { id: 3, name: '식품/생필품', icon: '🍎' },
  { id: 4, name: '가구/인테리어', icon: '🪑' },
  { id: 5, name: '스포츠/레저', icon: '⚽' },
  { id: 6, name: '뷰티/화장품', icon: '💄' },
  { id: 7, name: '취미/문구', icon: '🎨' },
  { id: 8, name: '도서/음반', icon: '📚' },
  { id: 9, name: '여행/레저', icon: '✈️' },
  { id: 10, name: '유아동/출산', icon: '🍼' },
  { id: 11, name: '반려동물용품', icon: '🐕' },
  { id: 12, name: '자동차용품', icon: '🚗' },
  { id: 13, name: '공구/산업용품', icon: '🔧' },
  { id: 14, name: '의료/건강용품', icon: '💊' },
  { id: 15, name: '농수축산물', icon: '🌾' },
  { id: 16, name: '꽃/원예', icon: '🌸' },
  { id: 17, name: '예술/공예', icon: '🎭' },
  { id: 18, name: '서비스/티켓', icon: '🎫' },
  { id: 19, name: '기타', icon: '📦' }
];

// **🎯 스키마 업데이트**
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "상품명을 입력해주세요.").default(""),
  price: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? 0 : Number(val), 
    z.number().min(0, { message: "가격은 0 이상이어야 합니다." })
  ).default(0),
  currency: z.string().default('KRW'),
  discountPrice: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? '' : String(val), 
    z.string().optional()
  ).default(''),
  imageUrl: z.string().default(''),
  imageFile: z.any().optional(),
  saleUrl: z.string().default(''),
  distributor: z.string().default(''),
  manufacturer: z.string().default(''),
  description: z.string().default(''),
  richContent: z.string().default(''),
  categoryId: z.string().default(''),
  tags: z.array(z.string()).default([]),
  stock: z.string().default(''),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).default([{ name: '', values: [''] }]), // changed from optional to required
  isPublic: z.boolean().default(true),
  peerMallName: z.string().default(''),
  peerMallKey: z.string().default(''),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isRecommended: z.boolean().default(false),
  isCertified: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const LOCAL_STORAGE_KEY = 'productRegistrationForm';

interface ProductRegistrationFormProps {
  address: string;
  onProductSave: (newProduct: Product) => void;
  onClose: () => void;
}

const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({
  address,
  onProductSave,
  onClose,
}) => {
  // **🎯 다중 이미지 상태**
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>(['']);
  const [isGifPlaying, setIsGifPlaying] = useState<{[key: number]: boolean}>({});

  // 기존 상태들
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [options, setOptions] = useState<{name: string, values: string[]}[]>([{ name: '', values: [''] }]); // changed from optional to required
  const [optionName, setOptionName] = useState<string>("");
  const [optionValues, setOptionValues] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const qrRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // **🎯 Rich Text 콘텐츠 상태**
  const [richContent, setRichContent] = useState<string>('');

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      currency: 'KRW',
      imageUrl: "",
      imageFile: null,
      saleUrl: "",
      discountPrice: "",
      distributor: "",
      manufacturer: "",
      description: "",
      richContent: "",
      categoryId: "",
      tags: [],
      stock: "",
      options: [{ name: '', values: [''] }], // changed from optional to required
      isPublic: true,
      peerMallName: "",
      peerMallKey: "",
      isBestSeller: false,
      isNew: true,
      isRecommended: false,
      isCertified: false
    }
  });

  // Watch form fields for preview
  const watchImageUrl = form.watch("imageUrl");
  const watchSaleUrl = form.watch("saleUrl");
  const watchAllFields = form.watch();

  // **🎯 이미지 관련 함수들**
  const addImageUrl = () => {
    if (imageUrls.length < 10) {
      setImageUrls([...imageUrls, '']);
      setCurrentImageIndex(imageUrls.length);
    }
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
      updateFormImageUrl(newUrls);
      if (currentImageIndex >= newUrls.length) {
        setCurrentImageIndex(newUrls.length - 1);
      }
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
    updateFormImageUrl(newUrls);
  };

  const updateFormImageUrl = (urls: string[]) => {
    const imageUrlString = urls.filter(url => url.trim()).join(',');
    form.setValue('imageUrl', imageUrlString);
    setPreviewImages(urls.filter(url => url.trim()));
  };

  const isGifUrl = (url: string) => {
    return url.toLowerCase().includes('.gif') || 
           url.toLowerCase().includes('giphy.com') ||
           url.toLowerCase().includes('.webp');
  };

  const toggleGifPlayback = (index: number) => {
    setIsGifPlaying(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // **🎯 Rich Content 변경 핸들러**
  const handleRichContentChange = (content: string) => {
    setRichContent(content);
    form.setValue('richContent', content);
  };

  // 자동 저장
  React.useEffect(() => {
    const saveData = debounce(() => {
      const dataToSave = {
        ...form.getValues(),
        productTags: productTags,
        options: options,
        richContent: richContent,
        imageUrls: imageUrls,
      };
    }, 500);

    saveData();

    return () => {
      saveData.cancel();
    };
  }, [watchAllFields, productTags, options, richContent, imageUrls, form]);

  // 이미지 미리보기 업데이트
  React.useEffect(() => {
    const validUrls = imageUrls.filter(url => url.trim());
    setPreviewImages(validUrls);
  }, [imageUrls]);

  React.useEffect(() => {
    if (previewUrl) {
      setQrCodeUrl(previewUrl);
    } else {
      setQrCodeUrl(null);
    }
  }, [previewUrl]);

  // 태그 관련 함수들
  const addTag = () => {
    if (tagInput && tagInput.trim() !== "" && !productTags.includes(tagInput.trim())) {
      const newTags = [...productTags, tagInput.trim()];
      setProductTags(newTags);
      form.setValue('tags', newTags);
      setTagInput("");
      tagInputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = productTags.filter(tag => tag !== tagToRemove);
    setProductTags(newTags);
    form.setValue('tags', newTags);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // 옵션 관련 함수들
  const addOption = () => {
    if (optionName.trim() !== "" && optionValues.trim() !== "") {
      const values = optionValues.split(',').map(v => v.trim()).filter(v => v !== "");
      if (values.length > 0) {
        const newOption = { name: optionName.trim(), values };
        const newOptions = [...options, newOption];
        setOptions(newOptions);
        form.setValue('options', newOptions);
        setOptionName("");
        setOptionValues("");
      }
    }
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  // QR 코드 관련 함수들
  const generateQrCodeImageUrl = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(content)}`;
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const imageUrl = generateQrCodeImageUrl(qrCodeUrl);
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `${form.getValues("name") || "product"}-qrcode.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // **🎯 상품 생성 함수**
  const createProductFromForm = (formValues: ProductFormValues): Product => {
    const now = new Date().toISOString();
    
    return {
      id: "",
      productId: "",
      productKey: "",
      title: formValues.name,
      peerSpaceAddress: address,
      name: formValues.name,
      description: formValues.description || '',
      richContent: formValues.richContent || '',
      type: ContentType.Product,
      date: now,
      likes: 0,
      comments: 0,
      views: 0,
      saves: 0,
      owner: '',

      // Product 필드
      price: Number(formValues.price) || 0,
      currency: formValues.currency || 'KRW',
      discountPrice: formValues.discountPrice && formValues.discountPrice !== '' 
        ? Number(formValues.discountPrice) 
        : null,
      imageUrl: formValues.imageUrl || '',
      rating: 0,
      reviewCount: 0,
      peerMallName: address,
      peerMallKey: "",
      category: formValues.categoryId ?
        PRODUCT_CATEGORIES.find(c => c.id.toString() === formValues.categoryId)?.name || '' : '',
      tags: formValues.tags || [],
      isBestSeller: formValues.isBestSeller || false,
      isNew: formValues.isNew || true,
      isRecommended: formValues.isRecommended || false,
      isCertified: formValues.isCertified || false,
      saleUrl: formValues.saleUrl || '',
      distributor: formValues.distributor || '',
      manufacturer: formValues.manufacturer || '',
      stock: formValues.stock || '',
      options: (formValues.options || []).map(option => ({
        name: option.name || '',
        values: option.values || [],
      })),
      create_date: now,
      update_date: now,
    };
  };

  // **🎯 제출 핸들러**
  const handleSubmit = async (formValues: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      const enhancedFormValues = {
        ...formValues,
        description: richContent || formValues.description,
        richContent: richContent
      };

      const newProduct = createProductFromForm(enhancedFormValues);
      console.log("💾 저장할 상품 데이터:", newProduct);
      
      onProductSave(newProduct);

      toast({
        title: "상품이 성공적으로 등록되었습니다! 🎉",
        description: `"${newProduct.title}"이(가) 상품 목록에 추가되었습니다.`,
      });

      // Reset form and state
      form.reset();
      setImageUrls(['']);
      setPreviewImages(['']);
      setQrCodeUrl(null);
      setProductTags([]);
      setOptions([{ name: '', values: [''] }]); // changed from optional to required
      setRichContent('');
      setActiveTab("basic");
      setCurrentImageIndex(0);
      
    } catch(err) {
      console.error('🚨 상품 등록 중 오류 발생:', err);
      toast({
        title: "상품 등록 오류",
        description: "상품 저장 중 에러가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' || name === 'price' || name === 'saleUrl') {
        const currentSaleUrl = value.saleUrl;
        const currentName = value.name || '상품명';
        const currentPrice = value.price ? `${value.price}원` : '가격';

        if (currentSaleUrl) {
          setPreviewUrl(`
            판매: ${currentSaleUrl}
            상품명: ${currentName}
            가격: ${currentPrice}
          `);
        } else {
          setPreviewUrl(null);
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form.formState.isSubmitSuccessful, form]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 z-[500]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">

<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                  상품 등록하기
                </h2>
                <p className="text-sm text-gray-500">피어몰에 새로운 상품을 등록해보세요</p>
              </div>
            </div>
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePreview}
                    className="flex items-center gap-1"
                  >
                    {isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {isPreviewMode ? "편집 모드" : "미리보기 모드"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPreviewMode ? "상품 정보 편집으로 돌아가기" : "상품 미리보기 확인하기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
        </div>

        {isPreviewMode ? (
          // **🎯 미리보기 모드**
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
                  {previewImages.length > 0 && previewImages[currentImageIndex] ? (
                    <>
                      {isGifUrl(previewImages[currentImageIndex]) ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previewImages[currentImageIndex]}
                            alt="상품 미리보기"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.jpg';
                            }}
                          />
                          <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                            GIF 🎬
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                            onClick={() => toggleGifPlayback(currentImageIndex)}
                          >
                            {isGifPlaying[currentImageIndex] ? 
                              <Pause className="h-4 w-4" /> : 
                              <Play className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      ) : (
                        <img
                          src={previewImages[currentImageIndex]}
                          alt="상품 미리보기"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                          }}
                        />
                      )}
                      
                      {/* 이미지 카운터 */}
                      {previewImages.length > 1 && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                          <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                            {currentImageIndex + 1} / {previewImages.length}
                          </Badge>
                        </div>
                      )}

                      {/* 이미지 네비게이션 */}
                      {previewImages.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                            disabled={currentImageIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                            onClick={() => setCurrentImageIndex(Math.min(previewImages.length - 1, currentImageIndex + 1))}
                            disabled={currentImageIndex === previewImages.length - 1}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                      <Image className="h-16 w-16 mb-4" />
                      <p>이미지 미리보기</p>
                    </div>
                  )}
                </div>

                {/* 썸네일 이미지 */}
                {previewImages.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {previewImages.map((image, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 relative ${
                            currentImageIndex === index 
                              ? "border-purple-500 shadow-lg" 
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`썸네일 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isGifUrl(image) && (
                            <div className="absolute bottom-0 right-0">
                              <Badge className="bg-purple-500 text-white text-xs px-1 py-0">
                                GIF
                              </Badge>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {form.watch("name") || "상품명을 입력하세요"}
                    </h1>
                    
                    {form.watch("categoryId") && (
                      <Badge variant="outline" className="mb-3">
                        {PRODUCT_CATEGORIES.find(c => c.id.toString() === form.watch("categoryId"))?.icon}{" "}
                        {PRODUCT_CATEGORIES.find(c => c.id.toString() === form.watch("categoryId"))?.name}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {form.watch("discountPrice") && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-500 line-through">
                          ₩{Number(form.watch("price") || 0).toLocaleString()}
                        </span>
                        <Badge className="bg-red-500 text-white">
                          할인가
                        </Badge>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-purple-600">
                      ₩{Number(form.watch("discountPrice") || form.watch("price") || 0).toLocaleString()}
                    </div>
                  </div>

                  {form.watch("stock") && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">재고: {form.watch("stock")}개</span>
                      {Number(form.watch("stock")) > 10 ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">충분</Badge>
                      ) : Number(form.watch("stock")) > 0 ? (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">품절임박</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 text-xs">품절</Badge>
                      )}
                    </div>
                  )}

                  {(form.watch("manufacturer") || form.watch("distributor")) && (
                    <div className="space-y-2 text-sm">
                      {form.watch("manufacturer") && (
                        <div className="flex items-center gap-2">
                          <Factory className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-600">제조사: {form.watch("manufacturer")}</span>
                        </div>
                      )}
                      {form.watch("distributor") && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span className="text-gray-600">유통사: {form.watch("distributor")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {productTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {productTags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {richContent && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">상품 설명</h3>
                      <div 
                        className="prose prose-sm max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{ 
                          __html: richContent.substring(0, 200) + (richContent.length > 200 ? '...' : '') 
                        }}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      구매하기
                    </Button>
                    <Button variant="outline" className="flex-1">
                      장바구니
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // **🎯 편집 모드**
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 grid grid-cols-3">
                      <TabsTrigger value="basic" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        기본 정보
                      </TabsTrigger>
                      <TabsTrigger value="content" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        상품 설명
                      </TabsTrigger>
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        상세 정보
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      {/* **🎯 판매 링크** */}
                      <FormField
                        control={form.control}
                        name="saleUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4 text-purple-600" />
                              상품 판매 링크
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>구매 가능한 실제 판매 링크를 입력해주세요.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input 
                                  placeholder="https://example.com/product-purchase" 
                                  {...field} 
                                  className="flex-1"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              고객이 실제로 구매할 수 있는 링크를 입력하세요.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* **🎯 상품명** */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-blue-600" />
                              상품명
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="상품명을 입력하세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* **🎯 가격 및 재고** */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                가격 (원)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="30000" 
                                  {...field} 
                                  type="number"
                                  min="0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                재고 수량
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="100" 
                                  {...field} 
                                  type="number" 
                                  min="0"
                                  className="text-center font-semibold"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                재고가 0이 되면 자동으로 품절 표시됩니다.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* **🎯 할인가** */}
                      {/* <FormField
                        control={form.control}
                        name="discountPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-red-600" />
                              할인가 (선택사항)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="할인된 가격을 입력하세요" 
                                {...field} 
                                type="number"
                                min="0"
                              />
                            </FormControl>
                            <FormDescription>
                              할인가를 입력하면 원가에 취소선이 표시됩니다.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      {/* **🎯 다중 이미지 입력** */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FormLabel className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-purple-600" />
                            상품 이미지 ({imageUrls.filter(url => url.trim()).length}/10)
                          </FormLabel>
                          {/* <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addImageUrl}
                            disabled={imageUrls.length >= 10}
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            이미지 추가
                          </Button> */}
                        </div>
                        
                        <div className="space-y-3">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <div className="flex-1 relative">
                                <Input
                                  placeholder={`이미지 URL ${index + 1} (GIF 지원)`}
                                  value={url}
                                  onChange={(e) => updateImageUrl(index, e.target.value)}
                                  className="pr-20"
                                />
                                {isGifUrl(url) && (
                                  <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-100 text-purple-600 text-xs">
                                    GIF 🎬
                                  </Badge>
                                )}
                              </div>
                              {imageUrls.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeImageUrl(index)}
                                  className="h-10 w-10 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-semibold text-gray-900">이미지 등록 꿀팁! 🍯</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li>• <strong>GIF 파일</strong>도 업로드 가능합니다! 🎬</li>
                                  <li>• <strong>최대 10개</strong>까지 등록할 수 있어요</li>
                                  <li>• <strong>첫 번째 이미지</strong>가 대표 이미지로 설정됩니다</li>
                                  <li>• <strong>고화질 이미지</strong>를 사용하면 더 좋아요! ✨</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card> */}
                      </div>

                      {/* **🎯 태그** */}
                      <div>
                        <FormLabel htmlFor="tags" className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-orange-600" />
                          태그
                        </FormLabel>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {productTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              #{tag}
                              <button 
                                type="button" 
                                onClick={() => removeTag(tag)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                              id="tags"
                              placeholder="태그 입력 후 Enter 또는 추가"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                              className="pl-10"
                              ref={tagInputRef}
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addTag}
                          >
                            추가
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">태그를 추가하면 상품 검색 노출이 향상됩니다.</p>
                      </div>
                    </TabsContent>
                    
                    {/* **🎯 Rich Content 탭** */}
                    <TabsContent value="content" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel className="text-lg font-semibold flex items-center gap-2">
                              <FileText className="h-5 w-5 text-purple-600" />
                              상품 상세 설명
                            </FormLabel>
                            {/* <FormDescription className="mt-1">
                              다른 사이트나 문서에서 복사한 내용을 붙여넣으면 서식이 그대로 유지됩니다.
                            </FormDescription> */}
                          </div>
                          <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Rich Editor
                          </Badge>
                        </div>

                        {/* Rich Text Editor */}
                        <RichTextEditor
                          value={richContent}
                          onChange={handleRichContentChange}
                          placeholder="상품에 대한 상세한 설명을 입력하거나, 다른 곳에서 복사한 내용을 붙여넣으세요..."
                          className="w-full"
                        />

                        {/* 빠른 템플릿 버튼들 */}
                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = `
                                <h2>✨ 상품 특징</h2>
                                <ul>
                                  <li>특징 1</li>
                                  <li>특징 2</li>
                                  <li>특징 3</li>
                                </ul>
                              `;
                              setRichContent(richContent + template);
                            }}
                            className="text-xs"
                          >
                            📝 특징 템플릿
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = `
                                <h2>📦 상품 정보</h2>
                                <table border="1" style="border-collapse: collapse; width: 100%;">
                                  <tr>
                                    <td style="padding: 8px; background: #f5f5f5;"><strong>브랜드</strong></td>
                                    <td style="padding: 8px;">브랜드명</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 8px; background: #f5f5f5;"><strong>원산지</strong></td>
                                    <td style="padding: 8px;">원산지</td>
                                  </tr>
                                </table>
                              `;
                              setRichContent(richContent + template);
                            }}
                            className="text-xs"
                          >
                            📊 정보 테이블
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = `
                                <h2>🚚 배송 안내</h2>
                                <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; background: #f8fafc;">
                                  <p><strong>무료배송:</strong> 30,000원 이상 구매시</p>
                                  <p><strong>배송시간:</strong> 주문 후 1-2일</p>
                                  <p><strong>배송지역:</strong> 전국 (일부 도서산간 제외)</p>
                                </blockquote>
                              `;
                              setRichContent(richContent + template);
                            }}
                            className="text-xs"
                          >
                            🚚 배송 정보
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = `
                                <h2>💡 사용법</h2>
                                <ol>
                                  <li>1단계: 포장을 뜯습니다</li>
                                  <li>2단계: 사용 전 확인사항을 점검합니다</li>
                                  <li>3단계: 안전하게 사용합니다</li>
                                </ol>
                              `;
                              setRichContent(richContent + template);
                            }}
                            className="text-xs"
                          >
                            💡 사용법
                          </Button>
                        </div> */}

                        {/* 복사 붙여넣기 도움말 */}
                        {/* <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Clipboard className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">복사 붙여넣기 꿀팁! 🍯</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li>• <strong>웹페이지</strong>에서 복사: 서식, 이미지, 링크가 그대로 유지됩니다</li>
                                  <li>• <strong>워드/한글</strong>에서 복사: 글꼴, 색상, 표 등이 보존됩니다</li>
                                  <li>• <strong>노션/구글독스</strong>에서 복사: 레이아웃이 완벽하게 이전됩니다</li>
                                  <li>• <strong>이미지</strong>는 자동으로 인식되어 삽입됩니다</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card> */}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4">
                      {/* **🎯 간단 설명** */}
                      {/* <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              간단 설명 (선택사항)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="상품에 대한 간단한 설명을 입력하세요 (Rich Editor를 사용하지 않는 경우)"
                                className="min-h-20 resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Rich Editor에서 작성한 내용이 우선적으로 사용됩니다.
                            </FormDescription>
                            <FormMessage />
                        </FormItem >
                        )}
                      /> */}

                      {/* **🎯 제조사/유통사** */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="manufacturer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Factory className="h-4 w-4 text-blue-600" />
                                제조사
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Factory className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <Input placeholder="제조사 정보" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="distributor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-green-600" />
                                유통사
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Truck className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <Input placeholder="유통사 정보" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* **🎯 카테고리** */}
                        <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Grid className="h-4 w-4 text-purple-600" />
                              카테고리
                            </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="카테고리를 선택하세요" />
                                  </SelectTrigger>
                                </FormControl>
                                {/* 🚀 portal을 body에 렌더링해서 z-index 문제 완전 해결! */}
                                <SelectContent 
                                  className="z-[9999]" 
                                  position="popper"
                                  side="bottom"
                                  align="start"
                                >
                                  {PRODUCT_CATEGORIES.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-base">{category.icon}</span>
                                        <span className="font-medium">{category.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* **🎯 상품 옵션** */}
                      {/* <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FormLabel className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-indigo-600" />
                            상품 옵션
                          </FormLabel>
                          <Badge variant="outline" className="text-xs">
                            {options.length}개 등록됨
                          </Badge>
                        </div>

                        {options.length > 0 && (
                          <div className="space-y-2">
                            {options.map((option, index) => (
                              <Card key={index} className="p-3 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm">{option.name}</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {option.values.map((value, valueIndex) => (
                                        <Badge key={valueIndex} variant="outline" className="text-xs">
                                          {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}

                        <Card className="p-4 border-dashed border-2 border-gray-300">
                          <div className="space-y-3">
                            <Input
                              placeholder="옵션명 (예: 색상, 사이즈)"
                              value={optionName}
                              onChange={(e) => setOptionName(e.target.value)}
                            />
                            <Input
                              placeholder="옵션값들 (쉼표로 구분, 예: 빨강,파랑,검정)"
                              value={optionValues}
                              onChange={(e) => setOptionValues(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addOption}
                              disabled={!optionName.trim() || !optionValues.trim()}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              옵션 추가
                            </Button>
                          </div>
                        </Card>
                      </div> */}

                      {/* **🎯 상품 상태 설정** */}
                      {/* <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                        <CardContent className="p-0">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Crown className="h-4 w-4 text-purple-600" />
                            상품 상태 설정
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-green-600" />
                                <span className="text-sm">신상품</span>
                              </div>
                              <Switch
                                checked={form.watch("isNew")}
                                onCheckedChange={(checked) => form.setValue("isNew", checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm">베스트셀러</span>
                              </div>
                              <Switch
                                checked={form.watch("isBestSeller")}
                                onCheckedChange={(checked) => form.setValue("isBestSeller", checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-purple-600" />
                                <span className="text-sm">추천상품</span>
                              </div>
                              <Switch
                                checked={form.watch("isRecommended")}
                                onCheckedChange={(checked) => form.setValue("isRecommended", checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">인증상품</span>
                              </div>
                              <Switch
                                checked={form.watch("isCertified")}
                                onCheckedChange={(checked) => form.setValue("isCertified", checked)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card> */}

                      {/* **🎯 공개 설정** */}
                      {/* <Card className="p-4">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                <Globe className="h-4 w-4 text-green-600" />
                                상품 공개 설정
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                공개로 설정하면 모든 사용자가 상품을 볼 수 있습니다.
                              </p>
                            </div>
                            <Switch
                              checked={form.watch("isPublic")}
                              onCheckedChange={(checked) => form.setValue("isPublic", checked)}
                            />
                          </div>
                        </CardContent>
                      </Card> */}
                    </TabsContent>
                  </Tabs>

                  {/* **🎯 제출 버튼** */}
                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 text-lg"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                            등록 중...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-5 w-5" />
                            상품 등록하기
                          </>
                        )}
                      </Button>
                      {/* <Button 
                        type="button" 
                        variant="outline" 
                        onClick={togglePreview}
                        size="lg"
                        disabled={isSubmitting}
                        className="px-8"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        미리보기
                      </Button> */}
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* **🎯 실시간 미리보기 패널** */}
            <div>
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    실시간 미리보기
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    실시간 동기화 ✨
                  </Badge>
                </div>

                <Card className="overflow-hidden">
                  <div className="aspect-video w-full bg-gray-50 flex items-center justify-center overflow-hidden relative">
                    {previewImages.length > 0 && previewImages[currentImageIndex] ? (
                      <>
                        {isGifUrl(previewImages[currentImageIndex]) ? (
                          <div className="relative w-full h-full">
                            <img
                              src={previewImages[currentImageIndex]}
                              alt="상품 이미지 미리보기"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs">
                              GIF 🎬
                            </Badge>
                          </div>
                        ) : (
                          <img
                            src={previewImages[currentImageIndex]}
                            alt="상품 이미지 미리보기"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}

                        {/* 이미지 네비게이션 */}
                        {previewImages.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                              disabled={currentImageIndex === 0}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={() => setCurrentImageIndex(Math.min(previewImages.length - 1, currentImageIndex + 1))}
                              disabled={currentImageIndex === previewImages.length - 1}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* 이미지 카운터 */}
                        {previewImages.length > 1 && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                              {currentImageIndex + 1} / {previewImages.length}
                            </Badge>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Image className="h-12 w-12 mb-2" />
                        <p>이미지 미리보기</p>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg mb-1 line-clamp-2">
                        {form.watch("name") || "상품명을 입력하세요"}
                      </h3>
                      {form.watch("isPublic") ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          공개
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          비공개
                        </Badge>
                      )}
                    </div>
                    
                    {/* 가격 정보 */}
                    <div className="space-y-1 mb-3">
                      {form.watch("discountPrice") && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">
                            ₩{Number(form.watch("price") || 0).toLocaleString()}
                          </span>
                          <Badge className="bg-red-500 text-white text-xs">
                            할인
                          </Badge>
                        </div>
                      )}
                      <p className="text-blue-600 font-bold text-xl">
                        {form.watch("discountPrice") ? 
                          `₩${Number(form.watch("discountPrice")).toLocaleString()}` :
                          form.watch("price") ? `₩${Number(form.watch("price")).toLocaleString()}` : "가격을 입력하세요"
                        }
                      </p>
                    </div>

                    {/* 재고 정보 */}
                    {form.watch("stock") && (
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">재고: {form.watch("stock")}개</span>
                        {Number(form.watch("stock")) > 10 ? (
                          <Badge className="bg-green-100 text-green-700 text-xs">충분</Badge>
                        ) : Number(form.watch("stock")) > 0 ? (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">품절임박</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 text-xs">품절</Badge>
                        )}
                      </div>
                    )}

                    {/* 상품 상태 뱃지 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {form.watch("isNew") && (
                        <Badge className="bg-green-100 text-green-700 text-xs">NEW ✨</Badge>
                      )}
                      {form.watch("isBestSeller") && (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">BEST 👑</Badge>
                      )}
                      {form.watch("isRecommended") && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">추천 ⭐</Badge>
                      )}
                      {form.watch("isCertified") && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">인증 🛡️</Badge>
                      )}
                    </div>

                    {/* 태그 */}
                    {productTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {productTags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {productTags.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{productTags.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    {/* Rich Content 미리보기 */}
                    {richContent && (
                      <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          상세 설명 미리보기
                        </h4>
                        <div 
                          className="prose prose-sm max-w-none text-gray-600 text-xs"
                          dangerouslySetInnerHTML={{ __html: richContent.substring(0, 150) + (richContent.length > 150 ? '...' : '') }}
                        />
                        {richContent.length > 150 && (
                          <p className="text-xs text-gray-500 mt-2">전체 내용은 상품 상세 페이지에서 확인할 수 있습니다.</p>
                        )}
                      </div>
                    )}

                    {/* 제조사/유통사 정보 */}
                    {(form.watch("distributor") || form.watch("manufacturer")) && (
                      <div className="mt-3 space-y-1 text-sm text-gray-500">
                        {form.watch("manufacturer") && (
                          <div className="flex items-center gap-1">
                            <Factory className="h-3 w-3" />
                            <span className="text-xs">제조사: {form.watch("manufacturer")}</span>
                          </div>
                        )}
                        {form.watch("distributor") && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span className="text-xs">유통사: {form.watch("distributor")}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-sm text-blue-500">
                        {form.watch("saleUrl") ? (
                          <div className="flex items-center">
                            <Link className="h-3 w-3 mr-1" />
                            <span>판매 링크 연결됨</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <Link className="h-3 w-3 mr-1" />
                            <span>판매 링크 없음</span>
                          </div>
                        )}
                      </div>
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* QR 코드 미리보기 */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <QrCode className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="font-medium">QR 코드 미리보기</h3>
                    </div>

                    <div className="flex justify-center bg-white p-4 rounded-md mb-3" ref={qrRef}>
                      {qrCodeUrl ? (
                        <img
                          src={generateQrCodeImageUrl(qrCodeUrl)}
                          alt="Generated QR Code"
                          className="w-24 h-24 object-contain mx-auto"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400">
                          <QrCode className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-center text-gray-500 mb-3">
                      {form.watch("saleUrl") ? 
                        "QR 코드로 상품 페이지에 바로 접근할 수 있습니다." : 
                        "판매 URL을 입력하면 QR 코드가 생성됩니다."
                      }
                    </p>

                    {qrCodeUrl && (
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadQRCode}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Download className="h-3 w-3" />
                          QR 코드 다운로드
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 등록 상태 요약 */}
                {/* <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      등록 진행 상황
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>상품명</span>
                        {form.watch("name") ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span>가격</span>
                        {form.watch("price") && Number(form.watch("price")) > 0 ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span>이미지</span>
                        {previewImages.length > 0 ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        }
                      </div>
                      <div className="flex items-center justify-between">
                        <span>상세 설명</span>
                        {richContent || form.watch("description") ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRegistrationForm;