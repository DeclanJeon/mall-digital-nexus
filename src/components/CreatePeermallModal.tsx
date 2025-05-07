import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Store, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Mail,
  Globe,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { add } from '@/utils/indexedDBService';
import { STORES } from '@/utils/indexedDB';

// 간소화된 스키마 정의
const formSchema = z.object({
  // 필수 항목
  address: z.string()
    .min(1, { message: '피어몰 주소를 입력해주세요' })
    .regex(/^[a-z0-9-]+$/, { message: '소문자, 숫자, 하이픈(-)만 사용 가능합니다' }),
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  representativeName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  membershipType: z.enum(['personal', 'family', 'enterprise'], {
    message: '멤버십 유형을 선택해주세요'
  }),

  // 선택 항목
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(),
  referralCode: z.string().optional(),
});

const CreatePeermallModal = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // 폼 초기화
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      description: '',
      representativeName: '',
      email: '',
      membershipType: 'personal',
      imageUrl: '',
      hashtags: '',
      referralCode: '',
    },
  });

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 다음 단계로 이동
  const handleNextStep = async () => {
    // 첫 단계에서는 필수 입력 필드 검증
    if (step === 1) {
      const isValid = await form.trigger(['address', 'name', 'description']);
      if (isValid) setStep(2);
    }
  };

  // 이전 단계로 이동
  const handlePrevStep = () => {
    setStep(1);
  };

  // 폼 제출 처리
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      // 해시태그 처리
      const processedValues = {
        ...values,
        hashtags: values.hashtags?.split(',').map(tag => {
          const trimmedTag = tag.trim();
          return trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`;
        }).filter(tag => tag !== '') || [],
      };
      
      console.log('피어몰 생성 데이터:', processedValues);
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 피어몰 ID 생성
      const peermallId = values.address.toLowerCase().replace(/\s+/g, '-');

      // IndexedDB에 피어몰 정보 저장
      await add(STORES.PEER_SPACES, {
        address: peermallId,
        title: values.name,
        description: values.description,
        owner: values.representativeName,
        imageUrl: values.imageUrl,
        category: values.membershipType,
        tags: Array.isArray(processedValues.hashtags) ? processedValues.hashtags : [],
        membershipType: values.membershipType,
        referralCode: values.referralCode,
        rating: 0,
        reviewCount: 0,
        location: {
          address: values.address,
          lat: 0,
          lng: 0,
        },
      });

      toast({
        title: "피어몰 등록 완료",
        description: "피어몰이 성공적으로 등록되었습니다.",
        variant: "default",
      });
    
      // 폼 초기화
      form.reset();
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess({
          name: values.name,
          type: '기타'
        });
      } else {
        onClose();
      }
    } catch (error) {

      console.log(error)
      toast({
        title: "피어몰 등록 실패",
        description: "피어몰 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 필수 라벨 컴포넌트
  const RequiredLabel = ({ children }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </div>
  );

  const handleClose = () => {
    onClose();
  };

  return (
    // onOpenChange에 handleClose 연결하여 외부 클릭/ESC 시 상태 초기화
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Store className="h-5 w-5 text-accent-100" />
            피어몰 만들기 {step === 1 ? '(1/2)' : '(2/2)'}
          </DialogTitle>
          <div>
            {step === 1 
              ? "피어몰의 기본 정보를 입력해주세요." 
              : "대표자 정보와 추가 정보를 입력해주세요."}
            <div className="mt-1 text-sm flex items-center gap-1 text-red-500">
              <AlertCircle className="h-3 w-3" /> 
              <span>* 표시는 필수 입력 항목입니다</span>
            </div>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          {/* onSubmit 핸들러는 form 요소에 직접 연결 */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 단계 1: 피어몰 기본 정보 */}
            {step === 1 && (
              <div className="space-y-4">
                {/* 피어몰 주소 */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>피어몰 주소</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-1">peermall.com/space/</span>
                          <Input placeholder="my-awesome-store" {...field} />
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
                      <FormLabel>
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
                      <FormLabel>
                        <RequiredLabel>피어몰 설명</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="피어몰에 대한 간단한 소개를 작성해주세요 (10자 이상)"
                          className="min-h-[80px]"
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
                        <FileText className="h-4 w-4" /> 해시태그 (쉼표로 구분)
                        <span className="text-gray-400 text-xs ml-1">(선택사항)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: #맛집, 핸드메이드, #서울"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      {/* 입력된 해시태그를 칩 형태로 표시 */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {field.value && field.value.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                          >
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* 단계 2: 대표자 정보 및 추가 정보 */}
            {step === 2 && (
              <div className="space-y-4">
                {/* 대표자 이름 */}
                <FormField
                  control={form.control}
                  name="representativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>
                           <User className="h-4 w-4 inline-block mr-1" /> 대표자 이름
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
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
                      <FormLabel>
                        <RequiredLabel>
                          <Mail className="h-4 w-4 inline-block mr-1" /> 이메일
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" {...field} />
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1">
                        알림 서비스를 사용하고 싶으시면 개인정보 관리 페이지에서 추가 정보를 입력해주세요.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 추천인 코드 */}
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Globe className="h-4 w-4" /> 추천인 코드
                        <span className="text-gray-400 text-xs ml-1">(선택사항)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="추천인 코드 입력" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 멤버십 유형 */}
                <FormField
                  control={form.control}
                  name="membershipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>멤버십 유형</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                         <select
                           value={field.value}
                           onChange={field.onChange}
                           className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                         >
                           <option value="personal">개인</option>
                           <option value="family">가족</option>
                           <option value="enterprise">기업</option>
                         </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 대표 이미지 */}
                <FormField
                  control={form.control}
                  name="imageUrl" // Zod 스키마와 이름 일치
                  render={({ field }) => ( // field는 이제 imageUrl(base64) 값을 가짐
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" /> 대표 이미지
                        <span className="text-gray-400 text-xs ml-1">(선택사항)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          {/* 숨겨진 파일 입력 */}
                          <Input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          {/* 파일 선택 버튼 */}
                          <Button
                            type="button" // form 제출 방지
                            variant="outline"
                            onClick={() => document.getElementById('imageUpload')?.click()}
                            size="sm"
                          >
                            이미지 업로드
                          </Button>
                          {/* 이미지 미리보기 */}
                          {field.value && (
                            <div className="h-12 w-12 rounded overflow-hidden border">
                              <img
                                src={field.value} // 미리보기 URL 사용
                                alt="미리보기"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {/* 실제 값(Base64)은 field에 의해 관리되지만, 화면에 직접 표시할 필요는 없음 */}
                          {/* <input type="hidden" {...field} /> -> useForm이 관리하므로 필요 없음 */}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <Separator className="my-6" /> {/* 간격 조정 */}
            
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
              {step === 1 ? (
                <>
                  <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                    취소
                  </Button>
                  <Button
                    type="button" // form 제출 방지
                    onClick={handleNextStep}
                    className="bg-accent-100 hover:bg-accent-100/90 text-white w-full sm:w-auto"
                  >
                    다음 <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="w-full sm:w-auto">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button
                    type="submit" // form 제출 버튼
                    className="bg-accent-100 hover:bg-accent-100/90 text-white w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "등록 중..." : "피어몰 생성하기"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePeermallModal;
