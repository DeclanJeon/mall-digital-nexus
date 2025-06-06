import React, { useState, useEffect, forwardRef, lazy, Suspense, useCallback } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { peermallStorage } from '@/services/storage/peermallStorage';

// MapSelectorDialog만 lazy load (MapMarkerSelector는 그 안에서 처리)
const MapSelectorDialog = lazy(() => import('./MapSelectorDialog'));

import { 
  MapPin, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Mail, 
  Image as ImageIcon,
  Eye as EyeIcon,
  EyeOff, 
  FileText, 
  Gift, 
  Info 
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CreatePeermallModalProps, Peermall, FamilyMember, PeermallFormData } from '@/types/peermall';
import { createPeerMall } from '@/services/peerMallService';


// 스키마들 (기존과 동일)
const step1Schema = z.object({
  address: z.string()
    .min(1, { message: '피어몰 주소를 입력해주세요' })
    .regex(/^[a-zA-Z0-9-가-힣]+$/, { message: '한글, 영문 대소문자, 숫자, 하이픈(-)만 사용 가능합니다' }),
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  ownerName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
});

const step2Schema = z.object({
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(),
  mapAddress: z.string().optional(),
  visibility: z.enum(['public', 'partial', 'private'], {
    message: '공개 범위를 선택해주세요',
  }).optional(), // Optional, as it's commented out in UI
  requestCertification: z.boolean().optional(),
  referralCode: z.string().optional(),
});

const formSchema = step1Schema.merge(step2Schema);


// 재사용 가능한 디바운스 훅
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


const CreatePeermallModal: React.FC<CreatePeermallModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(true);
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false);
  const [familyMembers] = useState<FamilyMember[]>([]); // Unused, consider removing
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);


  // React Hook Form 설정
  const form = useForm<PeermallFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      description: '',
      ownerName: '',
      email: '',
      membershipType: '', // Not in schema, consider removing or adding
      imageUrl: '',
      hashtags: '',
      mapAddress: '',
      visibility: 'public', // Default value is fine even if UI is commented out
      requestCertification: false,
      referralCode: '',
    },
    mode: 'onBlur',
  });

  // 주소 중복 체크 (더미 함수 - 실제로는 서버에서 확인해야 함)
  const checkDuplicateAddress = useCallback((address: string) => {
    // 실제 서버 호출 로직이 들어가야 함
    // 예시: return address === 'test-mall';
    return false; // 항상 false로 가정하여 테스트
  }, []);

  // 주소 변경 시 중복 검사 (디바운싱 적용)
  const addressFieldValue = form.watch('address'); // address 필드의 현재 값을 가져옴
  const debouncedAddress = useDebounce(addressFieldValue, 500); // 500ms 디바운스 적용

  useEffect(() => {
    if (debouncedAddress) { // 디바운스된 주소 값이 있을 때만 중복 검사 실행
      setIsDuplicateAddress(checkDuplicateAddress(debouncedAddress));
    } else {
      setIsDuplicateAddress(false); // 주소 값이 비어있으면 중복 아님으로 설정
    }
  }, [debouncedAddress, checkDuplicateAddress]); // 디바운스된 주소 값과 checkDuplicateAddress 함수가 변경될 때만 실행

  // 1단계 유효성 검사 (handleNextStep에서만 사용되므로 그대로 둠)
  const validateStep1 = async () => {
    const step1Data = {
      address: form.getValues('address'),
      name: form.getValues('name'),
      description: form.getValues('description'),
      representativeName: form.getValues('ownerName'),
      email: form.getValues('email'),
    };

    try {
      step1Schema.parse(step1Data);
      if (checkDuplicateAddress(step1Data.address)) {
        setIsDuplicateAddress(true); // 여기서도 상태 업데이트를 하지만, 디바운싱된 useEffect와 충돌하지 않음
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  // 다음 단계로 - 수정된 버전 (추가 설정하기 버튼 클릭 시)
  const handleNextStep = async () => {
    console.log('추가 설정하기 버튼 클릭됨');
    
    try {
      // 1단계 필수 필드들 검증
      const step1Fields = ['address', 'name', 'description', 'representativeName', 'email'];
      let isStep1Valid = true;
      
      for (const field of step1Fields) {
        const result = await form.trigger(field as keyof PeermallFormData);
        if (!result) isStep1Valid = false;
      }

      // 중복 주소 체크
      if (isDuplicateAddress) { // isDuplicateAddress는 debouncedAddress에 의해 업데이트된 최신 값
        isStep1Valid = false;
        toast({
          title: '중복된 주소',
          description: '이미 사용 중인 주소입니다. 다른 주소를 입력해주세요.',
          variant: 'destructive',
        });
      }

      if (isStep1Valid) {
        // 2단계로 이동
        setCurrentStep(2);
        // 스크롤을 맨 위로 이동
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // **추가: 2단계로 전환 후 첫 번째 필드에 포커스**
        // DOM 렌더링을 기다리기 위해 작은 setTimeout 사용
        setTimeout(() => {
          const firstInputInStep2 = document.querySelector<HTMLInputElement>('[name="imageUrl"]');
          if (firstInputInStep2) {
            firstInputInStep2.focus();
          } else {
            // imageUrl이 없을 경우 hashtags 필드에 포커스 시도
            const hashtagsInput = document.querySelector<HTMLInputElement>('[name="hashtags"]');
            if (hashtagsInput) {
                hashtagsInput.focus();
            }
          }
        }, 0); // 0ms setTimeout은 다음 이벤트 루프 틱에 실행되어 DOM 업데이트를 기다림

        toast({
          title: '1단계 완료! 🎉',
          description: '이제 브랜딩과 개인화 설정을 진행해보세요.',
          variant: 'default',
        });
      } else {
        // 유효성 검사 실패 시 첫 번째 오류 필드로 스크롤
        const errorFields = Object.keys(form.formState.errors);
        if (errorFields.length > 0) {
          const firstErrorField = document.querySelector(`[name="${errorFields[0]}"]`);
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            // **추가: 오류 필드에 포커스**
            (firstErrorField as HTMLElement).focus();
          }
        }
        
        toast({
          title: '입력 확인 필요',
          description: '필수 항목을 모두 올바르게 입력해주세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('handleNextStep 오류:', error);
      toast({
        title: '오류 발생',
        description: '다음 단계로 넘어가는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 이전 단계로
  const handlePrevStep = () => {
    setCurrentStep(1);
    // **추가: 1단계로 전환 후 첫 번째 필드에 포커스**
    setTimeout(() => {
      const firstInputInStep1 = document.querySelector<HTMLInputElement>('[name="address"]');
      if (firstInputInStep1) {
        firstInputInStep1.focus();
      }
    }, 0);
  };

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '파일 크기 초과',
        description: '이미지 파일은 5MB 이하로 업로드해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue('imageUrl', reader.result as string, {
        shouldValidate: true,
      });
      setShowImagePreview(true);
      toast({
        title: '이미지 업로드 완료! 📸',
        description: '대표 이미지가 설정되었습니다.',
        variant: 'default',
      });
    };
    reader.onerror = () => {
      toast({
        title: '이미지 업로드 실패',
        description: '이미지를 읽는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  // 해시태그 처리
  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const rawHashtags = form.watch('hashtags') || '';
  const displayHashtags = rawHashtags
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
    .map(t => (t.startsWith('#') ? t : `#${t}`));

  // 지도 위치 선택 핸들러 - 수정된 버전
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    console.log('위치 선택됨:', location);
    setMapLocation(location);
    form.setValue('mapAddress', location.address, { shouldValidate: true });
    
    toast({
      title: '위치 선택 완료! 📍',
      description: `${location.address}로 설정되었습니다.`,
      variant: 'default',
    });
    setIsMapDialogOpen(false); // 지도 선택 후 다이얼로그 닫기
  };

  // 지도 다이얼로그 열기
  const handleOpenMapDialog = () => {
    console.log('지도 다이얼로그 열기');
    setIsMapDialogOpen(true);
  };

  // 지도 다이얼로그 닫기
  const handleCloseMapDialog = () => {
    console.log('지도 다이얼로그 닫기');
    setIsMapDialogOpen(false);
  };

  // 폼 제출 핸들러 - 멀티 스텝 폼 처리
  const onSubmit: SubmitHandler<PeermallFormData> = async (values) => {
    console.log('폼 제출 시작 - 현재 스텝:', currentStep, values);
    setIsLoading(true);

    // 1단계 필수 필드 검증 (모든 제출 시 공통)
    const step1Fields = ['address', 'name', 'description', 'representativeName', 'email'];
    let isStep1Valid = true;
    
    for (const field of step1Fields) {
      const result = await form.trigger(field as keyof PeermallFormData);
      if (!result) isStep1Valid = false;
    }

    // 1단계 유효성 검사 실패 시
    if (!isStep1Valid) {
      toast({
        title: '입력 확인 필요',
        description: '필수 항목을 모두 올바르게 입력해주세요.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // 중복 주소 체크
    if (isDuplicateAddress) {
      toast({
        title: '중복된 주소',
        description: '이미 사용 중인 주소입니다. 다른 주소를 입력해주세요.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // 2단계에서 '피어몰 생성하기' 버튼 클릭 시 (여기서는 항상 유효성 검사한다고 가정)
    if (currentStep === 2) {
      // 2단계 필드 검증 (선택사항이지만, 강제하고 싶다면)
      // visibility는 현재 UI에서 주석 처리되어 있으므로 스키마에서 optional로 설정
      const step2FieldsToValidate: (keyof PeermallFormData)[] = []; // 필요에 따라 추가
      // 예: if (values.visibility) step2FieldsToValidate.push('visibility');
      
      for (const field of step2FieldsToValidate) {
        const result = await form.trigger(field);
        if (!result) {
            toast({
              title: '입력 확인 필요',
              description: '추가 설정의 필수 항목을 올바르게 입력해주세요.',
              variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }
      }
    }

    // 지오코딩 처리 개선
    let finalLocation = mapLocation;
    if (values.mapAddress && !mapLocation) {
      try {
        console.log('주소로 지오코딩 시도:', values.mapAddress);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(values.mapAddress)}&limit=1`
        );
        const data = await response.json();
        if (data && data[0]) {
          finalLocation = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            address: values.mapAddress
          };
          console.log('지오코딩 성공:', finalLocation);
          toast({
            title: '주소 지오코딩 성공! 🗺️',
            description: `'${values.mapAddress}'에 대한 위치 정보가 설정되었습니다.`,
            variant: 'default',
          });
        } else {
          console.warn('지오코딩 결과 없음:', values.mapAddress);
          toast({
            title: '주소 지오코딩 실패',
            description: `'${values.mapAddress}'에 대한 정확한 위치를 찾을 수 없습니다. 기본 위치가 사용됩니다.`,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('지오코딩 실패:', error);
        toast({
          title: '지오코딩 오류',
          description: '주소를 위치 정보로 변환하는 중 오류가 발생했습니다. 기본 위치가 사용됩니다.',
          variant: 'destructive',
        });
      }
    }

    const tags = (values.hashtags || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t)
      .map((t: string) => (t.startsWith('#') ? t : `#${t}`));

    const id = values.address.toLowerCase().replace(/\s+/g, '-');
    // 저장용 데이터 객체
    const dataForStorage = {
      address: id,
      id: id,
      title: values.name, // name을 title로 매핑
      name: values.name,                    // title 대신 name
      ownerName: values.ownerName, // owner 대신 representativeName
      description: values.description,
      email: values.email,
      imageUrl: values.imageUrl || 'https://picsum.photos/400/300',
      membershipType: values.membershipType || '',
      visibility: values.visibility || 'public', // Default if not selected
      requestCertification: !!values.requestCertification,
      hashtags: values.hashtags || '',
      tags,
      mapAddress: values.mapAddress || '',
      referralCode: values.referralCode || '',
      type: 'peermall',
      rating: 0,
      reviewCount: 0,
      followers: 0,
      featured: false,
      certified: false,
      recommended: false,
      location: {
        address: finalLocation?.address || values.mapAddress || values.address,
        lat: finalLocation?.lat ?? 37.5665, // Default if geocoding fails
        lng: finalLocation?.lng ?? 126.9780, // Default if geocoding fails
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const formData = new FormData();
      // 텍스트 데이터 추가
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      formData.append('lat', String(finalLocation?.lat || 37.5665));
      formData.append('lng', String(finalLocation?.lng || 126.9780));

      // 이미지 파일 추가
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createPeerMall(formData);

        // 초기화
      form.reset();
      setCurrentStep(1);
      setShowImagePreview(true);
      setIsDuplicateAddress(false);
      setMapLocation(null);
      setIsLoading(false);
      
      // 성공 토스트 메시지
      toast({
        title: '피어몰이 성공적으로 저장되었습니다.',
        description: `${values.name} 피어몰이 등록되었습니다.`,
        variant: 'default',
      });
      
      if (onSuccess) {
        onSuccess(dataForStorage);
      }
      onClose();
    } catch (error) {
      console.error('피어몰 저장 실패:', error);
      toast({
        title: '저장 오류',
        description: '피어몰을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      setIsLoading(false); // 에러 발생 시 로딩 상태 해제
      return;
    }
  };

  const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="flex items-center gap-1 font-semibold">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  const handleCancel = () => {
    form.reset();
    setCurrentStep(1);
    setShowImagePreview(true);
    setIsDuplicateAddress(false);
    setMapLocation(null);
    onClose();
  };

  // 수동 주소 입력 핸들러 - 개선된 버전
  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    form.setValue('mapAddress', newAddress, { shouldValidate: true });
    
    // 기존 위치 정보의 주소만 업데이트
    if (mapLocation) {
      setMapLocation({
        ...mapLocation,
        address: newAddress
      });
    }
  };

  // 스텝 인디케이터 컴포넌트 (기존과 동일)
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        {/* Step 1 */}
        <div className="flex items-center group">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full border-2 
            transition-all duration-300 ease-in-out transform
            ${currentStep >= 1 
              ? 'bg-blue-500 border-blue-500 text-white scale-105 shadow-lg shadow-blue-200' 
              : 'border-gray-300 text-gray-300 hover:border-gray-400'
            }
          `}>
            {currentStep > 1 ? (
              <Check className="w-4 h-4 animate-in fade-in duration-200" />
            ) : (
              <span className="text-sm font-semibold">1</span>
            )}
          </div>
          <span className={`ml-3 text-sm font-medium transition-colors duration-200 ${
            currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            기본 정보
          </span>
        </div>
        
        {/* Arrow */}
        <div className="relative">
          <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
            currentStep >= 2 ? 'text-blue-500 transform translate-x-0.5' : 'text-gray-300'
          }`} />
          {currentStep >= 2 && (
            <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          )}
        </div>
        
        {/* Step 2 */}
        <div className="flex items-center group">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full border-2 
            transition-all duration-300 ease-in-out transform
            ${currentStep >= 2 
              ? 'bg-blue-500 border-blue-500 text-white scale-105 shadow-lg shadow-blue-200' 
              : 'border-gray-300 text-gray-300 hover:border-gray-400'
            }
          `}>
            {currentStep > 2 ? (
              <Check className="w-4 h-4 animate-in fade-in duration-200" />
            ) : (
              <span className="text-sm font-semibold">2</span>
            )}
          </div>
          <span className={`ml-3 text-sm font-medium transition-colors duration-200 ${
            currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            추가 설정
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            피어몰 만들기
          </DialogTitle>
          <DialogDescription className="sr-only">
            피어몰 생성을 위한 정보를 입력하는 모달입니다.
          </DialogDescription>
          <StepIndicator />
        </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  const currentStepFields = document.querySelectorAll(`[data-step="${currentStep}"] input:not([disabled]), [data-step="${currentStep}"] textarea:not([disabled]), [data-step="${currentStep}"] button:not([disabled])`);
                  if (currentStepFields.length === 0) return;

                  const firstField = currentStepFields[0];
                  const lastField = currentStepFields[currentStepFields.length - 1];

                  if (document.activeElement === lastField && !e.shiftKey) {
                    e.preventDefault();
                    (firstField as HTMLElement).focus();
                  } else if (document.activeElement === firstField && e.shiftKey) {
                    e.preventDefault();
                    (lastField as HTMLElement).focus();
                  }
                }
              }}
              className="space-y-6"
            >
            {/* 각 단계별 카드에 data-step 속성 추가 */}
            {currentStep === 1 && (
              <Card className="border-blue-100 bg-blue-50/30" data-step="1">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-blue-700">기본 정보 입력</h3>
                    <Info className="w-4 h-4 text-blue-500" />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">기본 정보만으로도 피어몰 생성이 가능해요! 🎉</p>
                        <p>지금 바로 생성하거나, 추가 설정으로 더 멋진 피어몰을 만들어보세요.</p>
                      </div>
                    </div>
                  </div>

                  {/* 피어몰 주소 */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>피어몰 주소 (URL)</RequiredLabel>
                        </FormLabel>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                          <span className="bg-gray-50 px-3 py-2 text-sm text-muted-foreground border-r">
                            {window.location.origin}/space
                          </span>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="my-awesome-store"
                              className="flex-1 border-0 focus:ring-0 focus-visible:ring-0"
                              maxLength={30}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                        {isDuplicateAddress && (
                          <div className="mt-1 flex items-center text-xs text-red-500">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            이미 사용 중인 주소입니다.
                          </div>
                        )}
                        <div className="mt-1 text-xs text-muted-foreground">
                          💡 소문자, 숫자, 하이픈(-) 사용 가능 • 나중에 변경할 수 없어요
                        </div>
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
                          <Input
                            {...field}
                            placeholder="예: 내멋진가게, 홍길동의 수제품샵"
                            maxLength={20}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* 대표자 이름 */}
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>
                              <User className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                              대표자 이름
                            </RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="홍길동"
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
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
                              <Mail className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                              이메일
                            </RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="contact@example.com"
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            {...field}
                            placeholder="어떤 피어몰인지 간단히 소개해주세요! 고객들이 가장 먼저 보게 될 설명이에요. (최소 10자)"
                            className="min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            maxLength={500}
                          />
                           </FormControl>
                        <FormMessage />
                        <div className="text-xs text-muted-foreground text-right">
                          {field.value?.length || 0}/500
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            
            {currentStep === 2 && (
              <Card className="border-green-100 bg-green-50/30" data-step="2">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-green-700">추가 설정</h3>
                    <ImageIcon className="w-4 h-4 text-green-500" />
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">선택사항입니다!</p>
                        <p>나중에 언제든지 수정할 수 있으니 부담없이 설정해보세요.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 왼쪽 컬럼 */}
                    <div className="space-y-4">
                      {/* 대표 이미지 */}
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 font-semibold">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              대표 이미지
                              <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                            </FormLabel>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <input
                                  id="img-upl"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('img-upl')?.click()}
                                  className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                                >
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  이미지 선택
                                </Button>
                              </div>
                              
                              {field.value && showImagePreview && (
                                <div className="relative w-full h-32 overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                                  <img
                                    src={field.value}
                                    alt="미리보기"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2 flex gap-1">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      className="h-6 w-6 bg-white/80 hover:bg-white"
                                      onClick={() => setShowImagePreview(false)}
                                    >
                                      <EyeOff className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {field.value && !showImagePreview && (
                                <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowImagePreview(true)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    미리보기 보기
                                  </Button>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                            <div className="text-xs text-muted-foreground">
                              💡 JPG, PNG 파일만 업로드 가능해요 (최대 5MB)
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* 공개 범위 */}
                      {/* <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 font-semibold">
                              <EyeIcon className="h-4 w-4 text-muted-foreground" />
                              공개 범위
                            </FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                                  <SelectValue placeholder="선택해주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="public">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span>전체 공개</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="partial">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                      <span>부분 공개</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="private">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      <span>비공개</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                            <div className="text-xs text-muted-foreground">
                              🔍 검색 노출과 추천 알고리즘에 영향을 줘요
                            </div>
                          </FormItem>
                        )}
                      /> */}
                    </div>

                    {/* 오른쪽 컬럼 */}
                    <div className="space-y-4">
                      {/* 해시태그 */}
                      <FormField
                        control={form.control}
                        name="hashtags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 font-semibold">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              해시태그
                              <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="#패션, #핸드메이드, #친환경"
                                onKeyDown={handleHashtagKeyDown}
                                className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                maxLength={100}
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="text-xs text-muted-foreground">
                              💡 쉼표(,)로 구분해서 입력하세요
                            </div>
                            
                            {displayHashtags.length > 0 && (
                              <div className="mt-3 p-3 bg-white rounded-lg border">
                                <div className="text-xs font-medium text-muted-foreground mb-2">미리보기:</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {displayHashtags.map((tag, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="secondary" 
                                      className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      {/* 피어맵 주소 - 핵심 수정 부분! */}
                      <FormField
                        control={form.control}
                        name="mapAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 font-semibold">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              피어맵 표시 주소
                              <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                            </FormLabel>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="지도에서 위치를 선택하거나 직접 입력하세요"
                                    className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    onChange={handleManualAddressChange}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleOpenMapDialog}
                                  className="whitespace-nowrap hover:bg-green-50 hover:border-green-300 transition-all"
                                >
                                  <MapPin className="h-4 w-4 mr-2" />
                                  지도에서 선택
                                </Button>
                              </div>
                              
                              {/* 선택된 위치 정보 표시 */}
                              {mapLocation && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-green-800 mb-1">
                                        선택된 위치 📍
                                      </div>
                                      <div className="text-sm text-green-700 break-words">
                                        {mapLocation.address}
                                      </div>
                                      <div className="text-xs text-green-600 mt-1">
                                        위도: {mapLocation.lat.toFixed(6)}, 경도: {mapLocation.lng.toFixed(6)}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setMapLocation(null);
                                        form.setValue('mapAddress', '', { shouldValidate: true });
                                      }}
                                      className="text-green-600 hover:text-green-800 hover:bg-green-100"
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                            <div className="text-xs text-muted-foreground">
                              🗺️ 지도에서 정확한 위치를 선택하면 피어맵에서 찾기 쉬워져요!
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* 추천인 코드 */}
                      {/* <FormField
                        control={form.control}
                        name="referralCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 font-semibold">
                              <Gift className="h-4 w-4 text-muted-foreground" />
                              추천인 코드
                              <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="추천인 코드가 있다면 입력해주세요"
                                className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                maxLength={20}
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="text-xs text-muted-foreground">
                              🎁 추천인과 함께 특별 혜택을 받을 수 있어요
                            </div>
                          </FormItem>
                        )}
                      /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 나머지 코드 유지 */}
          </form>
        </Form>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Separator className="my-6" />
            {/* 하단 버튼 영역 - 통합된 버튼 그룹 */}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
                {/* 왼쪽 버튼 그룹 (뒤로가기/취소) */}
                <div className="flex gap-3">
                  {currentStep === 2 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      이전 단계
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 sm:flex-none"
                    >
                      취소
                    </Button>
                  )}
                </div>

                {/* 오른쪽 버튼 그룹 (주요 액션) */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {currentStep === 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleNextStep}
                      disabled={isLoading || isDuplicateAddress}
                      className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-800 border-gray-300 hover:border-gray-400 min-w-[150px]"
                    >
                      추가 설정하기
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className={`flex-1 sm:flex-none min-w-[150px] ${
                      currentStep === 1 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isLoading || isDuplicateAddress}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {currentStep === 1 ? '처리 중...' : '저장 중...'}
                      </>
                    ) : (
                      <>
                        {currentStep === 1 ? '피어몰 생성하기' : '피어몰 생성하기'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      {/* 지도 선택 다이얼로그 - 핵심 부분! */}
      <Suspense fallback={null}>
        <MapSelectorDialog
          isOpen={isMapDialogOpen}
          onClose={handleCloseMapDialog}
          onSelect={handleLocationSelect}
          initialPosition={mapLocation || { lat: 37.5665, lng: 126.9780, address: form.getValues('mapAddress') || form.getValues('address') || '' }}
          initialAddress={form.getValues('mapAddress') || form.getValues('address')}
        />
      </Suspense>
    </Dialog>
  );
};

export default CreatePeermallModal;