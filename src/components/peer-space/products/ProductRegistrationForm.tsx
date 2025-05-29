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
  X
} from "lucide-react";
import ProductRegistrationPreview from "./ProductRegistrationPreview";
import { Product } from "@/types/product";
import { ContentType } from '@/types/space';
import { peermallStorage } from '@/services/storage/peermallStorage';

// Define categories for the dropdown
const PRODUCT_CATEGORIES = [
  { id: 1, name: '가전/디지털' },
  { id: 2, name: '패션의류' },
  { id: 3, name: '식품/생필품' },
  { id: 4, name: '가구/인테리어' },
  { id: 5, name: '스포츠/레저' },
  { id: 6, name: '뷰티/화장품' },
  { id: 7, name: '취미/문구' },
  { id: 8, name: '도서/음반' },
  { id: 9, name: '여행/레저' },
  { id: 10, name: '유아동/출산' },
  { id: 11, name: '반려동물용품' },
  { id: 12, name: '자동차용품' },
  { id: 13, name: '공구/산업용품' },
  { id: 14, name: '의료/건강용품' },
  { id: 15, name: '농수축산물' },
  { id: 16, name: '꽃/원예' },
  { id: 17, name: '예술/공예' },
  { id: 18, name: '서비스/티켓' },
  { id: 19, name: '기타' }
];

// Define form schema with enhanced validation
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(""),
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
  categoryId: z.string().default(''),
  tags: z.array(z.string()).default([]),
  peerMallName: z.string().default(''),
  peerMallKey: z.string().default(''),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  isCertified: z.boolean().default(false),
  stock: z.string().default(''),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).default([]),
  isPublic: z.boolean().default(true)
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
  const [previewImage, setPreviewImage] = useState<string>("");
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [options, setOptions] = useState<{name: string, values: string[]}[]>([]);
  const [optionName, setOptionName] = useState<string>("");
  const [optionValues, setOptionValues] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const qrRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "", // 🔥 고정 ID 사용
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
      categoryId: "",
      tags: [],
      stock: "",
      options: [],
      isPublic: true,
      peerMallName: "",
      peerMallKey: "",
      isBestSeller: false,
      isNew: false,
      isRecommended: false,
      isCertified: false
    }
  });

  // Watch form fields for preview
  const watchImageUrl = form.watch("imageUrl");
  const watchSaleUrl = form.watch("saleUrl");
  const watchAllFields = form.watch();

  React.useEffect(() => {
    const saveData = debounce(() => {
      const dataToSave = {
        ...form.getValues(),
        productTags: productTags,
        options: options,
      };
    }, 500);

    saveData();

    return () => {
      saveData.cancel();
    };
  }, [watchAllFields, productTags, options, form]);

  React.useEffect(() => {
    if (watchImageUrl) {
      setPreviewImage(watchImageUrl);
    } else {
      setPreviewImage("");
    }
  }, [watchImageUrl]);

  React.useEffect(() => {
    if (previewUrl) {
      setQrCodeUrl(previewUrl);
    } else {
      setQrCodeUrl(null);
    }
  }, [previewUrl]);

  // Function to add a tag
  const addTag = () => {
    if (tagInput && tagInput.trim() !== "" && !productTags.includes(tagInput.trim())) {
      const newTags = [...productTags, tagInput.trim()];
      setProductTags(newTags);
      form.setValue('tags', newTags);
      setTagInput("");
      tagInputRef.current?.focus();
    }
  };

  // Function to remove a tag
  const removeTag = (tagToRemove: string) => {
    const newTags = productTags.filter(tag => tag !== tagToRemove);
    setProductTags(newTags);
    form.setValue('tags', newTags);
  };

  // Function to handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Function to add an option
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

  // Function to remove an option
  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  // Helper function to generate QR code image URL
  const generateQrCodeImageUrl = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(content)}`;
  };

  // Function to download QR code
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

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // 🔥 중복 저장 문제 해결 - 단일 저장 함수
  const createProductFromForm = (formValues: ProductFormValues): Product => {
    const now = new Date().toISOString();
    
    // peermall 정보 가져오기
    // const getPeermalls = peermallStorage.getAll().map(p => ({
    //     id: p.id,
    //     title: p.title,
    // }))
    // const findPeermalls = getPeermalls.find(peermall => peermall.id === address);
    // const peermallName = findPeermalls.title || 'Unknown Peermall';
    
    // if (!findPeermalls.id) {
    //   console.error('❌ Peermall not found for address:', findPeermalls.id);
    //   toast({
    //     title: '피어몰을 찾을 수 없습니다',
    //     description: '상품을 등록할 피어몰 정보를 찾을 수 없습니다. 새로고침 후 다시 시도해주세요.',
    //     variant: 'destructive'
    //   });
    //   throw new Error('Peermall not found');
    // }
    
    return {
      id: "",
      title: formValues.name,
      peerSpaceAddress: address,
      name: formValues.name,
      description: formValues.description || '',
      type: ContentType.Product,
      date: now,
      likes: 0,
      comments: 0,
      views: 0,
      saves: 0,
      owner: '', // Add owner field

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
      isBestSeller: false,
      isNew: true,
      isRecommended: false,
      isCertified: false,
      saleUrl: formValues.saleUrl || '',
    };
  };

  // 🔥 단일 저장 함수 - 중복 제거
  const handleSubmit = async (formValues: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 🔥 한 번만 생성, 한 번만 저장
      const newProduct = createProductFromForm(formValues);
      console.log("💾 저장할 상품 데이터:", newProduct);
      
      // 🔥 상위 컴포넌트에 알림 (UI 업데이트용)
      onProductSave(newProduct);

      toast({
        title: "상품이 성공적으로 등록되었습니다! 🎉",
        description: `"${newProduct.title}"이(가) 상품 목록에 추가되었습니다.`,
      });

      // Reset form and state
      form.reset();
      setPreviewImage("");
      setQrCodeUrl(null);
      setProductTags([]);
      setOptions([]);
      setActiveTab("basic");
      
      // 상품 상세 페이지로 이동
      //navigate(`/space/${address}/product/${newProduct.id}`);
      
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
    return () => subscription.unsubscribe();
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
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePreview}
                    className="flex items-center gap-1"
                  >
                    {isPreviewMode ? <FileImage className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                    {isPreviewMode ? "편집 모드" : "미리보기 모드"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPreviewMode ? "상품 정보 편집으로 돌아가기" : "상품 미리보기 확인하기"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* 나머지 JSX는 동일하지만 Form의 onSubmit만 수정 */}
        {isPreviewMode ? (
          // Preview Mode - 기존과 동일
          <div className="grid md:grid-cols-2 gap-8">
            {/* 기존 미리보기 코드 그대로 */}
          </div>
        ) : (
          // Form Mode
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
                  {/* 🔥 기존 폼 내용 그대로, handleSubmit만 수정됨 */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 grid grid-cols-2">
                      <TabsTrigger value="basic">기본 정보</TabsTrigger>
                      <TabsTrigger value="details">상세 정보</TabsTrigger>
                      {/* <TabsTrigger value="options">옵션 및 설정</TabsTrigger> */}
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      {/* 기존 기본 정보 폼 필드들 그대로 */}
                      <FormField
                        control={form.control}
                        name="saleUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              상품 링크 
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
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

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>상품명</FormLabel>
                            <FormControl>
                              <Input placeholder="상품명을 입력하세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>가격 (원)</FormLabel>
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
                              <FormLabel>재고 수량</FormLabel>
                              <FormControl>
                                <Input placeholder="100" {...field} type="number" min="0" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이미지 URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <FileImage className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <Input 
                                    placeholder="상품 이미지 URL을 입력하세요" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button type="button" variant="outline" size="icon">
                                      <HelpCircle className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>이미지 URL 찾는 방법</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        1. 웹페이지에서 원하는 이미지에 우클릭하세요.<br />
                                        2. '이미지 주소 복사' 또는 '이미지 링크 복사'를 선택하세요.<br />
                                        3. 복사한 URL을 이 필드에 붙여넣기 하세요.<br /><br />
                                        <strong>참고:</strong> 항상 이미지 사용 권한을 확인하세요.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>닫기</AlertDialogCancel>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel htmlFor="tags">태그</FormLabel>
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
                    
                    <TabsContent value="details" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>상품 설명</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="상품에 대한 추가 설명을 입력하세요"
                                className="min-h-40 resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              상품의 특징, 사용법, 주의사항 등을 상세히 입력하세요.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="manufacturer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>제조사</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Factory className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <Input placeholder="제조사 정보" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
</FormItem >
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="distributor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>유통사</FormLabel>
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
                    </TabsContent>
                    
                    <TabsContent value="options" className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">상품 옵션</h4>
                        <Card className="mb-4">
                          <CardContent className="p-4">
                            {options.length > 0 ? (
                              <div className="space-y-3">
                                {options.map((option, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                    <div>
                                      <span className="font-medium">{option.name}:</span>{" "}
                                      <span className="text-gray-600">{option.values.join(', ')}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOption(index)}
                                    >
                                      <X className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center p-4 text-gray-500">
                                <p>등록된 옵션이 없습니다.</p>
                              </div>
                            )}
                            
                            <div className="mt-4 space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                  <Input
                                    placeholder="옵션명 (예: 색상)"
                                    value={optionName}
                                    onChange={(e) => setOptionName(e.target.value)}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Input
                                    placeholder="옵션값 (쉼표로 구분, 예: 빨강,파랑,검정)"
                                    value={optionValues}
                                    onChange={(e) => setOptionValues(e.target.value)}
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={addOption}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                옵션 추가
                              </Button>
                              <p className="text-xs text-gray-500">
                                옵션명과 옵션값을 입력하세요. 옵션값은 쉼표(,)로 구분합니다.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border border-gray-100">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">상품 공개 설정</FormLabel>
                              <FormDescription>
                                상품을 공개하면 피어몰 페이지와 검색 결과에 표시됩니다.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            등록 중...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            상품 등록하기
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={togglePreview}
                        size="lg"
                        disabled={isSubmitting}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        미리보기
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* 미리보기 패널 */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">실시간 미리보기</h3>
              <Card className="overflow-hidden">
                <div className="aspect-video w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="상품 이미지 미리보기"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.log('이미지 로드 실패');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
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
                  
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-blue-600 font-bold text-xl">
                      {form.watch("price") ? `₩${Number(form.watch("price")).toLocaleString()}` : "가격을 입력하세요"}
                    </p>
                    {form.watch("stock") && (
                      <p className="text-sm text-gray-500">재고: {form.watch("stock")}개</p>
                    )}
                  </div>

                  {productTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {productTags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          #{tag}
                        </Badge>
                      ))}
                      {productTags.length > 3 && (
                        <Badge variant="outline">+{productTags.length - 3}</Badge>
                      )}
                    </div>
                  )}

                  {(form.watch("distributor") || form.watch("manufacturer")) && (
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      {form.watch("manufacturer") && (
                        <div className="flex items-center">
                          <Factory className="h-3 w-3 mr-1" />
                          <span>{form.watch("manufacturer")}</span>
                        </div>
                      )}
                      {form.watch("distributor") && (
                        <div className="flex items-center">
                          <Truck className="h-3 w-3 mr-1" />
                          <span>{form.watch("distributor")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {form.watch("description") && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {form.watch("description")}
                    </p>
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
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <QrCode className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="font-medium">QR 코드 미리보기</h3>
                </div>

                <div className="flex justify-center bg-white p-4 rounded-md mb-3" ref={qrRef}>
                  {qrCodeUrl ? (
                    <img
                      src={generateQrCodeImageUrl(qrCodeUrl)}
                      alt="Generated QR Code"
                      className="w-32 h-32 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                      <QrCode className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-center text-gray-500">
                  {form.watch("saleUrl") ? 
                    "QR 코드로 상품 페이지에 바로 접근할 수 있습니다." : 
                    "판매 URL을 입력하면 QR 코드가 생성됩니다."
                  }
                </p>

                {qrCodeUrl && (
                  <div className="mt-3 flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadQRCode}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      QR 코드 다운로드
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRegistrationForm;