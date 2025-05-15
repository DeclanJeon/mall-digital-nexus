import React, { useState, useRef } from 'react';
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
import { toast } from "@/hooks/use-toast";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Content, ContentType } from './types';
import { addPeerSpaceContent } from "@/utils/peerSpaceStorage";
import { add } from "@/utils/indexedDBService";
import { QRCodeSVG } from 'qrcode.react';
import ProductRegistrationPreview from "./ProductRegistrationPreview";

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
  { id: 9, name: '기타' }
];

// Define form schema with enhanced validation
const productSchema = z.object({
  name: z.string().min(1, { message: "상품명은 필수입니다." }),
  title: z.string().optional(),
  price: z.string().min(1, { message: "가격은 필수입니다." }),
  imageUrl: z.string().min(1, { message: "이미지 URL은 필수입니다." }),
  saleUrl: z.string().url({ message: "유효한 URL을 입력해주세요." }),
  distributor: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  brandUrl: z.string().url({ message: "유효한 URL을 입력해주세요." }).optional(),
  stock: z.string().optional(),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).optional(),
  isPublic: z.boolean().default(true)
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductRegistrationFormProps {
  onProductAdded: (content: Content) => void;
  address: string;
  onClose?: () => void;
}

const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({ 
  onProductAdded, 
  address,
  onClose 
}) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [productTags, setProductTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [options, setOptions] = useState<{name: string, values: string[]}[]>([]);
  const [optionName, setOptionName] = useState<string>("");
  const [optionValues, setOptionValues] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const qrRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      title: "",
      price: "",
      imageUrl: "",
      saleUrl: "",
      distributor: "",
      manufacturer: "",
      description: "",
      categoryId: "",
      tags: [],
      brandUrl: "",
      stock: "",
      options: [],
      isPublic: true
    }
  });

  // Watch form fields for preview
  const watchImageUrl = form.watch("imageUrl");
  const watchSaleUrl = form.watch("saleUrl");
  
  React.useEffect(() => {
    if (watchImageUrl) {
      setPreviewImage(watchImageUrl);
    } else {
      setPreviewImage("");
    }
  }, [watchImageUrl]);

  React.useEffect(() => {
    if (watchSaleUrl) {
      setQrCodeUrl(watchSaleUrl);
    } else {
      setQrCodeUrl("");
    }
  }, [watchSaleUrl]);

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

  // Function to download QR code
  const downloadQRCode = () => {
    if (qrRef.current && qrCodeUrl) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `${form.getValues("name") || "product"}-qrcode.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Handle form submission
  const onSubmit = async (values: ProductFormValues) => {

    console.log("submit check : ", values)

    setIsSubmitting(true);
    
    try {
      // Create the content object
      const newProduct: Content = {
        id: `product-${Date.now()}`,
        peerSpaceAddress: address,
        title: values.name,
        description: values.description || '',
        imageUrl: values.imageUrl,
        type: 'product' as ContentType,
        date: new Date().toISOString(),
        price: Number(values.price),
        likes: 0,
        comments: 0,
        views: 0,
        saves: 0,
        isExternal: !!values.saleUrl,
        externalUrl: values.saleUrl,
        source: values.manufacturer || 'Direct',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the product to storage and notify parent component
      const content: Content = {
        ...newProduct,
        peerSpaceAddress: address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addPeerSpaceContent(address, content);
      onProductAdded(content);
      
      toast({
        title: "상품이 성공적으로 등록되었습니다",
        description: "상품 목록과 QR 코드 목록에 추가되었습니다.",
      });
      
      // Reset form and state
      form.reset();
      setPreviewImage("");
      setQrCodeUrl("");
      setProductTags([]);
      setOptions([]);
      setActiveTab("basic");
      
      // Close modal if provided
      if (onClose) {
        onClose();
      }
    } catch(err) {
      console.error('상품 등록 실패:', err);
      toast({
        title: "상품 등록 오류",
        description: "서버 통신 중 에러가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">상품 등록</h2>
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

        {isPreviewMode ? (
          // Preview Mode
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">상품 미리보기</h3>
              <Card className="overflow-hidden">
                <div className="aspect-video w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="상품 이미지 미리보기"
                      className="w-full h-full object-contain"
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
                    <h3 className="font-medium text-xl text-gray-800 line-clamp-2">
                      {form.watch("name") || "상품명"}
                    </h3>
                    {form.watch("isPublic") ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">공개</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">비공개</Badge>
                    )}
                  </div>
                  
                  {form.watch("title") && (
                    <p className="text-sm text-gray-500 mb-3">{form.watch("title")}</p>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-blue-600 font-bold text-xl">
                      {form.watch("price") || "가격"}
                    </p>
                    {form.watch("stock") && (
                      <p className="text-sm text-gray-500">재고: {form.watch("stock")}</p>
                    )}
                  </div>

                  {form.watch("categoryId") && (
                    <Badge variant="secondary" className="mb-3">
                      {PRODUCT_CATEGORIES.find(cat => cat.id.toString() === form.watch("categoryId"))?.name || "카테고리"}
                    </Badge>
                  )}
                  
                  {productTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {productTags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator />

                  {(form.watch("distributor") || form.watch("manufacturer")) && (
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      {form.watch("manufacturer") && (
                        <div className="flex items-center">
                          <Factory className="h-4 w-4 mr-2 text-gray-400" />
                          <span>제조: {form.watch("manufacturer")}</span>
                        </div>
                      )}
                      {form.watch("distributor") && (
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-gray-400" />
                          <span>유통: {form.watch("distributor")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {form.watch("description") && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">상품 설명</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {form.watch("description")}
                      </p>
                    </div>
                  )}

                  {options.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">옵션</h4>
                      <div className="space-y-2">
                        {options.map((opt, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{opt.name}:</span>{" "}
                            <span className="text-gray-600">{opt.values.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                  <div className="flex items-center text-sm text-blue-600">
                    <Link className="h-4 w-4 mr-1" />
                    <span>판매 링크로 이동</span>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    <span>담기</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">QR 코드 및 공유 정보</h3>
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-white p-4 rounded-md mb-4 border border-gray-100" ref={qrRef}>
                      {qrCodeUrl ? (
                        <QRCodeSVG value={qrCodeUrl} size={180} />
                      ) : (
                        <div className="w-44 h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                          <QrCode className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    {qrCodeUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadQRCode}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        QR 코드 다운로드
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">판매 URL</h4>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={qrCodeUrl} 
                          readOnly 
                          className="bg-gray-50 text-gray-600" 
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => {
                                  navigator.clipboard.writeText(qrCodeUrl);
                                  toast({
                                    description: "URL이 클립보드에 복사되었습니다.",
                                  });
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>URL 복사하기</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">피어몰 정보</h4>
                      <div className="p-3 rounded-md bg-gray-50 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">피어몰 주소:</span>
                          <span className="font-medium">{address || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Form Mode
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 grid grid-cols-3">
                      <TabsTrigger value="basic">기본 정보</TabsTrigger>
                      <TabsTrigger value="details">상세 정보</TabsTrigger>
                      <TabsTrigger value="options">옵션 및 설정</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="saleUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              판매 URL <span className="text-red-500 ml-1">*</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>실제 상품이 판매되는 URL을 입력해주세요. QR 코드가 자동 생성됩니다.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input 
                                  placeholder="https://example.com/product" 
                                  {...field} 
                                  className="flex-1"
                                />
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon"
                                        onClick={() => {
                                          if (navigator.clipboard) {
                                            navigator.clipboard.readText().then(text => {
                                              if (text.startsWith('http')) {
                                                form.setValue('saleUrl', text);
                                              }
                                            });
                                          }
                                        }}
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>클립보드에서 URL 붙여넣기</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </FormControl>
                            <FormDescription>
                              실제 상품이 판매되는 URL을 입력해주세요.
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
                            <FormLabel>상품명 <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="상품명을 입력하세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>상품 제목 (선택)</FormLabel>
                            <FormControl>
                              <Input placeholder="상품 제목을 입력하세요 (선택 사항)" {...field} />
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
                              <FormLabel>가격 <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <Input 
                                    placeholder="예: ₩30,000" 
                                    {...field} 
                                    className="pl-10"
                                  />
                                </div>
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
                                <Input placeholder="재고 수량" {...field} type="number" min="0" />
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
                            <FormLabel>이미지 URL <span className="text-red-500">*</span></FormLabel>
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

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>카테고리</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="카테고리 선택" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PRODUCT_CATEGORIES.map(category => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                            </FormItem>
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

                      <FormField
                        control={form.control}
                        name="brandUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>브랜드 URL</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Globe className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <Input 
                                  placeholder="브랜드 또는 제조사 웹사이트" 
                                  {...field} 
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              브랜드 또는 제조사의 공식 웹사이트 URL을 입력하세요.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                        className="flex-1"
                        size="lg"
                        
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
                      >
                        <Image className="mr-2 h-4 w-4" />
                        미리보기
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">미리보기</h3>
              <Card className="overflow-hidden">
                <div className="aspect-video w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="상품 이미지 미리보기"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Image className="h-12 w-12 mb-2" />
                      <p>이미지 미리보기</p>
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  <h3 className="font-medium text-lg mb-1 line-clamp-2">
                    {form.watch("name") || "상품명"}
                  </h3>
                  {form.watch("title") && (
                    <p className="text-sm text-gray-500 mb-2">{form.watch("title")}</p>
                  )}
                  <p className="text-blue-600 font-bold mt-1 mb-3">
                    {form.watch("price") || "가격"}
                  </p>

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
                      <Link className="h-3 w-3 mr-1" />
                      <span>판매 링크</span>
                    </div>
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <QrCode className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="font-medium">QR 코드 미리보기</h3>
                </div>

                <div className="flex justify-center bg-white p-4 rounded-md mb-3" ref={qrRef}>
                  {qrCodeUrl ? (
                    <QRCodeSVG value={qrCodeUrl} size={128} />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                      QR 코드
                    </div>
                  )}
                </div>

                <p className="text-sm text-center text-gray-500">
                  판매 URL을 입력하면 자동으로 QR 코드가 생성됩니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRegistrationForm;