import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Store, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Phone, 
  X,
  Hash,
  Globe,
  Eye,
  EyeOff,
  Bookmark,
  AlertCircle,
  Ticket
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the form schema with validation
const formSchema = z.object({
  address: z.string()
    .min(1, { message: '피어몰 주소를 입력해주세요' })
    .regex(/^[a-z0-9-]+$/, { message: '소문자, 숫자, 하이픈(-)만 사용 가능합니다' }),
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  type: z.string().default('기타'),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  hashtags: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  representativeName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  referralCode: z.string().optional(),
  hasReferral: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePeermallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (peermallData: {name: string; type: string}) => void;
}

const CreatePeermallModal: React.FC<CreatePeermallModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      description: '',
      hashtags: '',
      logoUrl: '',
      faviconUrl: '',
      imageUrl: '',
      representativeName: '',
      phoneNumber: '',
      email: '',
      referralCode: '',
      hasReferral: false,
      isPublic: true,
    },
  });

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'imageUrl' | 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // Here we're just creating a fake URL
      const fakeImageUrl = URL.createObjectURL(file);
      form.setValue(fieldName, fakeImageUrl);
    }
  };

  // Form submission handler
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Process hashtag (split string into array, trim whitespace)
      const processedValues = {
        ...values,
        hashtags: values.hashtags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
      };
      console.log('피어몰 생성 데이터:', processedValues);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock peermall ID based on the address
      const peermallId = values.address.toLowerCase().replace(/\s+/g, '-');

      // 로컬 스토리지에 피어몰 정보 저장
      const storedPeermalls = localStorage.getItem('peermalls');
      const peermalls = storedPeermalls ? JSON.parse(storedPeermalls) : [];
      peermalls.push({
        id: peermallId,
        title: values.name,
        description: values.description,
        owner: values.representativeName,
        imageUrl: values.imageUrl,
        category: '기타', // 기본값
        tags: Array.isArray(values.hashtags) ? values.hashtags : [],
        rating: 0,
        reviewCount: 0,
        location: {
          address: values.address,
          lat: 0,
          lng: 0,
        },
      });
      localStorage.setItem('peermalls', JSON.stringify(peermalls));

      toast({
        title: "피어몰 등록 완료",
        description: "피어몰이 성공적으로 등록되었습니다.",
        variant: "default",
      });
    
      // Reset the form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess({
          name: values.name,
          type: values.type
        });
      } else {
        // Just close the modal if no callback provided
        onClose();
      }
    } catch (error) {
      toast({
        title: "피어몰 등록 실패",
        description: "피어몰 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component for required field label
  const RequiredLabel: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto z-[1000]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Store className="h-6 w-6 text-accent-100" />
              피어몰 만들기
            </DialogTitle>
            <DialogDescription className="text-base">
              새로운 피어몰을 생성하기 위한 정보를 입력해주세요.
              <div className="mt-2 text-sm flex items-center gap-1 text-red-500">
                <AlertCircle className="h-4 w-4" /> 
                <span className="font-medium">표시는 필수 입력 항목입니다.</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs 
                defaultValue="basic" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic" className="relative">
                    <span className="flex items-center">
                      기본 정보
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <span className="flex items-center">
                      디자인
                      <span className="text-gray-400 text-xs ml-1">(선택사항)</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <span className="flex items-center">
                      고급 설정
                      <span className="text-gray-400 text-xs ml-1">(선택사항)</span>
                    </span>
                  </TabsTrigger>
                </TabsList>
                
                {/* 기본 정보 탭 */}
                <TabsContent value="basic" className="space-y-4">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      {/* 피어몰 주소 */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Globe className="h-4 w-4 text-accent-100" /> 
                              <RequiredLabel>피어몰 주소</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-1 select-none">peermall.com/space/</span>
                                <Input placeholder="mystore" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* 피어몰 이름 */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Store className="h-4 w-4 text-accent-100" /> 
                              <RequiredLabel>피어몰 이름</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="내 멋진 피어몰" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* 피어몰 설명 */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <FileText className="h-4 w-4 text-accent-100" /> 
                              <RequiredLabel>피어몰 설명</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="피어몰에 대한 간단한 소개를 작성해주세요" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* 해시태그 */}
                      <FormField
                        control={form.control}
                        name="hashtags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Hash className="h-4 w-4 text-accent-100" /> 해시태그 (쉼표로 구분)
                              <span className="text-gray-400 text-xs ml-1">(선택사항)</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="예: #맛집, #핸드메이드, #서울" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      {/* 대표자 이름 */}
                      <FormField
                        control={form.control}
                        name="representativeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <User className="h-4 w-4 text-accent-100" /> 
                              <RequiredLabel>대표자 이름</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="홍길동" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* 연락처 */}
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-accent-100" /> 
                              <RequiredLabel>전화번호</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="전화번호를 입력해주세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* 이메일 */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-accent-100" /> 
                              <RequiredLabel>이메일</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="이메일을 입력해주세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* 대표 이미지 */}
                  <Card>
                    <CardContent className="pt-4">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4 text-accent-100" /> 
                              대표 이미지
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <Input
                                  id="imageUpload"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'imageUrl')}
                                  className="hidden"
                                />
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                  >
                                    이미지 업로드
                                  </Button>
                                  {field.value && (
                                    <div className="relative">
                                      <img 
                                        src={field.value} 
                                        alt="Preview" 
                                        className="w-20 h-20 object-cover rounded-md"
                                      />
                                      <button
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                        onClick={() => form.setValue('imageUrl', '')}
                                      >
                                        <X className="h-3 w-3 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input type="hidden" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* 디자인 탭 */}
                <TabsContent value="appearance" className="space-y-4">
                  <div className="flex items-center p-2 bg-blue-50 rounded-md border border-blue-100 mb-2">
                    <div className="text-blue-600 text-sm">
                      디자인 설정은 선택사항입니다. 나중에 언제든지 수정할 수 있습니다.
                    </div>
                  </div>
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      {/* 로고 이미지 */}
                      <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Bookmark className="h-4 w-4 text-accent-100" /> 로고 이미지
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <Input
                                  id="logoUpload"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'logoUrl')}
                                  className="hidden"
                                />
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('logoUpload')?.click()}
                                  >
                                    로고 업로드
                                  </Button>
                                  {field.value && (
                                    <div className="relative">
                                      <img 
                                        src={field.value} 
                                        alt="Logo Preview" 
                                        className="w-16 h-16 object-contain rounded-md"
                                      />
                                      <button
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                        onClick={() => form.setValue('logoUrl', '')}
                                      >
                                        <X className="h-3 w-3 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input type="hidden" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* 파비콘 */}
                      <FormField
                        control={form.control}
                        name="faviconUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Globe className="h-4 w-4 text-accent-100" /> 파비콘 (브라우저 탭 아이콘)
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <Input
                                  id="faviconUpload"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'faviconUrl')}
                                  className="hidden"
                                />
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('faviconUpload')?.click()}
                                  >
                                    파비콘 업로드
                                  </Button>
                                  {field.value && (
                                    <div className="relative">
                                      <img 
                                        src={field.value} 
                                        alt="Favicon Preview" 
                                        className="w-10 h-10 object-contain rounded-md"
                                      />
                                      <button
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                        onClick={() => form.setValue('faviconUrl', '')}
                                      >
                                        <X className="h-3 w-3 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <input type="hidden" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* 고급 설정 탭 */}
                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center p-2 bg-blue-50 rounded-md border border-blue-100 mb-2">
                    <div className="text-blue-600 text-sm">
                      고급 설정은 선택사항입니다. 나중에 언제든지 수정할 수 있습니다.
                    </div>
                  </div>
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      {/* 추천인 코드 */}
                      <FormField
                        control={form.control}
                        name="hasReferral"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={(e) => {
                                    field.onChange(e.target.checked);
                                    if (!e.target.checked) {
                                      form.setValue('referralCode', '');
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                              </FormControl>
                              <FormLabel className="flex items-center gap-1 m-0">
                                <Ticket className="h-4 w-4 text-accent-100" /> 추천인 코드 / 스폰서 등록
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch('hasReferral') && (
                        <FormField
                          control={form.control}
                          name="referralCode"
                          render={({ field }) => (
                            <FormItem className="ml-6">
                              <FormControl>
                                <Input placeholder="추천인 코드를 입력하세요" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* 공개/비공개 설정 */}
                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="flex items-center gap-1">
                                {field.value ? <Eye className="h-4 w-4 text-accent-100" /> : <EyeOff className="h-4 w-4 text-accent-100" />}
                                {field.value ? "공개 피어몰" : "비공개 피어몰"}
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {field.value 
                                ? "모든 사용자가 검색 및 접근 가능합니다." 
                                : "초대받은 사용자만 접근 가능합니다."}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Separator className="my-4" />
              
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button 
                  type="submit"
                  className="bg-accent-100 hover:bg-accent-100/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "등록 중..." : "피어몰 생성하기"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePeermallModal;