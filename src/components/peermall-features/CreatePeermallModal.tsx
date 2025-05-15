import React, { useState, useEffect } from 'react'; // useEffect 추가 (필요시)
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
  MapPin, // MapPin 아이콘 추가
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
    message: '멤버십 유형을 선택해주세요' // 기본값은 form defaultValues에서 설정
  }),

  // 선택 항목
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(),
  referralCode: z.string().optional(),
  mapAddress: z.string().optional(), // 피어맵에 표시될 주소 (선택)
});

// localStorage 키 정의
const LOCAL_STORAGE_PEERMALL_KEY_PREFIX = 'peermall_';

const CreatePeermallModal = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      description: '',
      representativeName: '',
      email: '',
      membershipType: 'personal', // 기본 멤버십 유형 설정
      imageUrl: '',
      hashtags: '',
      referralCode: '',
      mapAddress: '', // mapAddress 기본값 추가
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { // onloadend 사용 권장 (성공/실패 모두 처리)
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
      };
      reader.onerror = () => {
        console.error("이미지 읽기 오류");
        toast({
          title: "이미지 업로드 실패",
          description: "이미지를 읽는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(['address', 'name', 'description']);
      if (isValid) setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const processedHashtags = values.hashtags
        ?.split(',')
        .map(tag => {
          const trimmedTag = tag.trim();
          // 이미 #으로 시작하면 그대로, 아니면 # 추가, 빈 태그는 필터링
          return trimmedTag && (trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`);
        })
        .filter(tag => tag) || []; // null 또는 빈 문자열일 경우 빈 배열

      const peermallId = values.address.toLowerCase().replace(/\s+/g, '-');

      const peermallDataForStorage = {
        address: peermallId, // IndexedDB와 동일한 식별자 사용
        title: values.name,
        description: values.description,
        owner: values.representativeName, // 대표자 이름
        email: values.email, // 이메일 추가
        imageUrl: values.imageUrl || '', // 빈 문자열로 기본값
        category: values.membershipType, // 멤버십 유형을 카테고리로 사용 (혹은 별도 필드)
        tags: processedHashtags,
        membershipType: values.membershipType,
        referralCode: values.referralCode || '', // 빈 문자열로 기본값
        // IndexedDB에 저장하는 추가 정보들 (localStorage에도 동일하게 저장하려면 추가)
        rating: 0,
        reviewCount: 0,
        // location 정보 구성 시 mapAddress 우선 사용
        location: {
          // TODO: values.mapAddress 또는 values.address를 기반으로 실제 위도(lat), 경도(lng)를 지오코딩 API를 통해 가져와야 합니다.
          // 현재는 입력된 주소 문자열만 저장하고, lat/lng는 기본값 0으로 설정합니다.
          address: values.mapAddress || values.address, // mapAddress가 있으면 사용, 없으면 URL 주소 사용
          lat: 0, // 지오코딩 API 연동 필요
          lng: 0, // 지오코딩 API 연동 필요
        },
        mapDisplayAddress: values.mapAddress || '', // 지도 표시용 주소 명시적 저장
        createdAt: new Date().toISOString(), // 생성 시간 추가
      };
      
      console.log('피어몰 생성 데이터 (저장용):', peermallDataForStorage);
      
      // API 호출 시뮬레이션 (실제 API가 있다면 이 부분 대체)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 1. IndexedDB에 피어몰 정보 저장
      await add(STORES.PEER_SPACES, peermallDataForStorage);

      // 2. localStorage에 피어몰 정보 저장
      try {
        // 각 피어몰 주소를 키로 사용하여 저장
        localStorage.setItem(`${LOCAL_STORAGE_PEERMALL_KEY_PREFIX}${peermallId}`, JSON.stringify(peermallDataForStorage));
        
        // (선택적) 모든 피어몰 주소 목록을 관리하는 키도 업데이트 가능
        const allPeermallAddresses = JSON.parse(localStorage.getItem('all_peermall_addresses') || '[]');
        if (!allPeermallAddresses.includes(peermallId)) {
          allPeermallAddresses.push(peermallId);
          localStorage.setItem('all_peermall_addresses', JSON.stringify(allPeermallAddresses));
        }
        console.log('localStorage에 피어몰 정보 저장 완료:', peermallId);

      } catch (storageError) {
        console.error('localStorage 저장 오류:', storageError);
        // localStorage 저장 실패 시 사용자에게 알릴 필요는 없을 수 있으나, 로깅은 중요
        toast({
          title: "데이터 저장 경고",
          description: "피어몰 정보는 등록되었으나, 일부 로컬 데이터 저장에 실패했습니다.",
          variant: "default", // 경고 레벨
        });
      }

      toast({
        title: "피어몰 등록 완료",
        description: `${values.name} 피어몰이 성공적으로 등록되었습니다.`,
        variant: "default",
      });
    
      form.reset();
      setStep(1); // 성공 후 첫 단계로 초기화
      
      if (onSuccess) {
        // onSuccess 콜백에 생성된 피어몰의 주요 정보 전달 가능
        onSuccess({
          id: peermallId,
          name: values.name,
          type: values.membershipType,
          location: peermallDataForStorage.location, // location 정보 전달
          ...peermallDataForStorage
        });
      } else {
        onClose(); // onSuccess가 없으면 그냥 모달 닫기
      }

    } catch (error) {
      console.error("피어몰 등록 중 전체 오류:", error);
      toast({
        title: "피어몰 등록 실패",
        description: "피어몰 등록 중 오류가 발생했습니다. 입력 내용을 확인하고 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredLabel = ({ children }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </div>
  );

  const handleCloseAndReset = () => {
    form.reset(); // 폼 상태 초기화
    setStep(1);   // 단계 초기화
    onClose();    // 부모 컴포넌트의 닫기 핸들러 호출
  };

  // 해시태그 입력 필드에서 Enter 키 처리 (다음 필드로 포커스 이동 방지)
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      // 원하는 경우, Enter 시 태그를 확정하는 로직 추가 가능
    }
  };

  // 현재 입력된 해시태그를 칩 형태로 보여주기 위한 상태 (선택적 UI 개선)
  const hashtagsValue = form.watch('hashtags'); // hashtags 필드의 현재 값 감시
  const displayHashtags = hashtagsValue
    ?.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag) // 빈 태그 제거
    .map(tag => (tag.startsWith('#') ? tag : `#${tag}`)) || [];


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) { // 모달이 닫힐 때
        handleCloseAndReset();
      }
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4"> {/* 헤더와 폼 사이 간격 */}
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Store className="h-5 w-5 text-blue-500" /> {/* 아이콘 색상 변경 */}
            피어몰 만들기 {step === 1 ? '(1/2)' : '(2/2)'}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {step === 1 
              ? "피어몰의 기본 정보를 입력해주세요." 
              : "대표자 정보와 추가 정보를 입력해주세요."}
          </div>
          <div className="mt-1 text-xs flex items-center gap-1 text-red-600"> {/* 빨간색 강조 */}
            <AlertCircle className="h-3.5 w-3.5" /> 
            <span>\* 표시는 필수 입력 항목입니다.</span>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5"> {/* 필드 간 간격 조정 */}
            {step === 1 && (
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>피어몰 주소 (URL)</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <span className="text-sm text-muted-foreground pl-3 pr-1 py-2 bg-gray-50 border-r">peermall.com/space/</span>
                          <Input placeholder="my-store" {...field} className="border-0 rounded-l-none focus:ring-0 flex-1" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>피어몰 이름</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 내 멋진 가게" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                          placeholder="피어몰을 잘 나타내는 설명을 작성해주세요 (최소 10자)."
                          className="min-h-[100px]" // 높이 살짝 늘림
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hashtags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" /> 해시태그 (쉼표로 구분)
                        <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="#패션, #핸드메이드, #맛집"
                          {...field}
                          onKeyDown={handleHashtagKeyDown} // Enter 키 처리
                        />
                      </FormControl>
                      <FormMessage />
                      {displayHashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {displayHashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="representativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>
                           <User className="h-4 w-4 inline-block mr-1 text-muted-foreground" /> 대표자 이름
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>
                          <Mail className="h-4 w-4 inline-block mr-1 text-muted-foreground" /> 이메일 주소
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1.5">
                        알림 및 중요 안내 수신에 사용됩니다.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-muted-foreground" /> 추천인 코드
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="추천코드가 있다면 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mapAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" /> 피어맵 표시 주소
                        <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 서울특별시 강남구 테헤란로 123" {...field} />
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1.5">
                        피어맵에 표시될 실제 주소를 입력해주세요. 입력 시 해당 위치로 피어맵에 등록됩니다.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field: { onChange, value, ...restField } }) => ( // onChange만 직접 사용, 나머지는 react-hook-form에 위임
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" /> 대표 이미지
                        <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload} // 커스텀 핸들러 사용
                            className="hidden"
                            {...restField} // name, ref 등 react-hook-form이 필요로 하는 props 전달
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('imageUpload')?.click()}
                            size="sm"
                          >
                            이미지 선택
                          </Button>
                          {value && typeof value === 'string' && ( // value가 문자열(Base64)인지 확인
                            <div className="h-12 w-12 rounded-md overflow-hidden border bg-gray-100">
                              <img
                                src={value}
                                alt="이미지 미리보기"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <Separator className="my-6" />
            
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2 pt-2">
              {step === 1 ? (
                <>
                  <Button type="button" variant="outline" onClick={handleCloseAndReset} className="w-full sm:w-auto">
                    취소
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto" // 버튼 색상 변경
                  >
                    다음 단계 <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="w-full sm:w-auto">
                    <ChevronLeft className="mr-1.5 h-4 w-4" /> 이전 단계
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto" // 버튼 색상 변경
                    disabled={isLoading || !form.formState.isValid} // 폼 유효성 검사 추가
                  >
                    {isLoading ? "등록 중..." : "피어몰 생성 완료"}
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
