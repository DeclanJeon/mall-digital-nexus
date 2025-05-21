import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Store,
  FileText,
  Image as ImageIcon,
  User,
  Mail,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Gift,
  Eye as EyeIcon
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// NetworkSection.tsx와 동일한 키
const STORAGE_KEY_NETWORK = 'peerMall_networkData';
const LOCAL_STORAGE_PEERMALL_KEY_PREFIX = 'peermall_';

// 폼 유효성 스키마
const formSchema = z.object({
  address: z.string()
    .min(1, { message: '피어몰 주소를 입력해주세요' })
    .regex(/^[a-z0-9-]+$/, { message: '소문자, 숫자, 하이픈(-)만 사용 가능합니다' }),
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  representativeName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  membershipType: z.enum(['personal', 'family', 'enterprise'], {
    message: '패밀리 멤버를 선택해주세요'
  }),
  familyMember: z.string().optional(),
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(),
  mapAddress: z.string().optional(),
  visibility: z.enum(['public', 'partial', 'private'], {
    message: '공개 범위를 선택해주세요',
  }),
  requestCertification: z.boolean().optional(),
  referralCode: z.string().optional(),
});

interface PeermallFormData {
  address: string;
  name: string;
  description: string;
  representativeName: string;
  email: string;
  membershipType: 'personal' | 'family' | 'enterprise';
  familyMember: string;
  imageUrl: string;
  hashtags: string;
  mapAddress: string;
  visibility: 'public' | 'private';
  requestCertification: boolean;
  referralCode: string;
  title: string;
  owner: string;
  type: string;
}

interface CreatePeermallSuccessData extends PeermallFormData {
  id: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
  membershipType: 'personal' | 'family' | 'enterprise';
}

interface CreatePeermallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: CreatePeermallSuccessData) => void;
}

// 로컬스토리지에 저장된 NetworkSection 데이터에서 추출
interface FamilyMember {
  id: string;
  name: string;
  image?: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  certified?: boolean;
  description?: string;
}

const CreatePeermallModal: React.FC<CreatePeermallModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(true);
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false);

  // 1) NetworkSection에서 쓰는 로컬스토리지를 읽어서 패밀리 멤버 목록 세팅
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_NETWORK);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setFamilyMembers(parsed.family || []);
      } catch {
        setFamilyMembers([]);
      }
    }
  }, []);

  // 2) React Hook Form 세팅
  const form = useForm<PeermallFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      description: '',
      representativeName: '',
      email: '',
      membershipType: 'personal',
      familyMember: '',
      imageUrl: '',
      hashtags: '',
      mapAddress: '',
      visibility: 'public',
      requestCertification: false,
      referralCode: '',
      title: '',
      owner: '',
      type: ''
    },
    mode: 'onBlur',
  });

  // 피어몰 주소 중복 체크
  const checkDuplicateAddress = (address: string) => {
    const all = JSON.parse(
      localStorage.getItem('all_peermall_addresses') || '[]'
    );
    return all.includes(address);
  };

  // 주소 변경 시 중복 검사
  useEffect(() => {
    const sub = form.watch((values, { name }) => {
      if (name === 'address' && values.address) {
        setIsDuplicateAddress(checkDuplicateAddress(values.address));
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // 이미지 업로드 프리뷰
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue('imageUrl', reader.result as string, {
        shouldValidate: true,
      });
      setShowImagePreview(true);
    };
    reader.onerror = () => {
      toast({
        title: '이미지 업로드 실패',
        description: '이미지를 읽는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    };
    reader.readAsDataURL(file);
  };

  // 해시태그 입력 엔터 방지 & 출력 배열
  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };
  const rawHashtags = form.watch('hashtags') || '';
  const displayHashtags = rawHashtags
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
    .map(t => (t.startsWith('#') ? t : `#${t}`));

  // 현재 선택된 멤버십
  const selectedMembership = form.watch('membershipType');
  const canPickFamily =
    selectedMembership === 'family' ||
    selectedMembership === 'enterprise';

  // 폼 제출 처리
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsLoading(true);

    // 주소 중복 최종 확인
    if (checkDuplicateAddress(values.address)) {
      setIsDuplicateAddress(true);
      toast({
        title: '중복된 주소',
        description: '이미 사용 중인 주소입니다.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // 해시태그 배열 가공
    const tags = (values.hashtags || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t)
      .map((t: string) => (t.startsWith('#') ? t : `#${t}`));

    const id = values.address.toLowerCase().replace(/\s+/g, '-');
    const dataForStorage = {
      address: id,
      title: values.name,
      description: values.description,
      owner: values.representativeName,
      email: values.email,
      imageUrl: values.imageUrl || '',
      membershipType: values.membershipType,
      familyMember:
        values.membershipType === 'personal' ? '' : values.familyMember,
      visibility: values.visibility,
      requestCertification: !!values.requestCertification,
      hashtags: values.hashtags || '',
      tags,
      mapAddress: values.mapAddress || '',
      referralCode: values.referralCode || '',
      type: 'peermall',
      rating: 0,
      reviewCount: 0,
      location: {
        address: values.mapAddress || values.address,
        lat: 0,
        lng: 0,
      },
      createdAt: new Date().toISOString(),
    };

    // 인덱스DB 저장 시뮬레이션
    await new Promise(r => setTimeout(r, 600));
    await add(STORES.PEER_SPACES, dataForStorage);

    // 로컬스토리지에도 기록
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_PEERMALL_KEY_PREFIX}${id}`,
        JSON.stringify(dataForStorage)
      );
      const all = JSON.parse(
        localStorage.getItem('all_peermall_addresses') || '[]'
      );
      if (!all.includes(id)) {
        all.push(id);
        localStorage.setItem('all_peermall_addresses', JSON.stringify(all));
      }
    } catch {
      toast({
        title: '저장 경고',
        description: '일부 로컬 저장에 실패했습니다.',
        variant: 'default',
      });
    }

    toast({
      title: '등록 완료',
      description: `${values.name} 피어몰이 생성되었습니다.`,
      variant: 'default',
    });

    form.reset();
    setShowImagePreview(true);
    setIsDuplicateAddress(false);
    setIsLoading(false);

    if (onSuccess) onSuccess({
      ...dataForStorage,
      id,
      name: dataForStorage.title,
      representativeName: dataForStorage.owner,
      membershipType: dataForStorage.membershipType,
      visibility: dataForStorage.visibility === 'partial' ? 'public' : dataForStorage.visibility,
      familyMember: dataForStorage.familyMember,
      imageUrl: dataForStorage.imageUrl,
      hashtags: dataForStorage.hashtags,
      mapAddress: dataForStorage.mapAddress,
      requestCertification: dataForStorage.requestCertification,
      referralCode: dataForStorage.referralCode,
      title: dataForStorage.title,
      owner: dataForStorage.owner,
      type: dataForStorage.type
    } satisfies CreatePeermallSuccessData);
    else onClose();
  };

  interface RequiredLabelProps {
    children: React.ReactNode;
  }

  const RequiredLabel: React.FC<RequiredLabelProps> = ({ children }) => (
    <span className="flex items-center gap-1 font-semibold">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  const handleCancel = () => {
    form.reset();
    setShowImagePreview(true);
    setIsDuplicateAddress(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="sm:max-w-[620px] max-h-[95vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Store className="h-5 w-5 text-blue-500" /> 피어몰 만들기
          </DialogTitle>
          <div className="mt-2 text-xs text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>
                피어몰은 <strong>사용자 자율 운영</strong> 온라인 공간입니다. 정책사항을
                꼭 확인하세요.
              </li>
              <li>
                공개범위·해시태그·설명은 검색·추천·신뢰도 평가에 활용됩니다.
              </li>
            </ul>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>* 표시는 필수 입력 항목입니다.</span>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* 왼쪽 */}
              <div className="space-y-5">
                {/* 주소 */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>피어몰 주소(URL)</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <span className="bg-gray-50 px-3 py-2 text-sm text-muted-foreground border-r">
                            peermall.com/space/
                          </span>
                          <Input
                            {...field}
                            placeholder="my-store"
                            className="flex-1 border-0 focus:ring-0"
                            maxLength={30}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {isDuplicateAddress && (
                        <div className="mt-1 flex items-center text-xs text-red-500">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          이미 사용 중인 주소입니다.
                        </div>
                      )}
                      <div className="mt-1 text-xs text-muted-foreground">
                        소문자·숫자·하이픈만 가능. 변경 불가
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
                          placeholder="예: 내멋진가게"
                          maxLength={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        패밀리 멤버
                        <span className="text-xs text-muted-foreground ml-1">
                          (필수)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="패밀리 멤버의 피어ID를 입력하세요."
                          maxLength={20}
                        />
                      </FormControl>
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
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        추천인 코드
                        <span className="text-xs text-muted-foreground ml-1">
                          (선택)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="추천인 코드를 입력하세요"
                          maxLength={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 공개범위 */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        공개 범위
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">공개</SelectItem>
                            <SelectItem value="partial">
                              부분공개
                            </SelectItem>
                            <SelectItem value="private">
                              비공개
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 피어맵 표시 주소 */}
                <FormField
                  control={form.control}
                  name="mapAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        피어맵 표시 주소
                        <span className="text-xs text-muted-foreground ml-1">
                          (선택)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="예: 서울 강남구 테헤란로 123"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 오른쪽 */}
              <div className="space-y-5">
                {/* 대표자 */}
                <FormField
                  control={form.control}
                  name="representativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>
                          <User className="inline-block h-4 w-4 mr-1 text-muted-foreground" />
                          대표자 이름
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="홍길동" />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 설명 */}
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
                          placeholder="피어몰 설명을 작성해주세요 (최소 10자)."
                          className="min-h-[90px]"
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
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        해시태그
                        <span className="text-xs text-muted-foreground ml-1">
                          (선택, 쉼표 구분)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="#패션, #핸드메이드"
                          onKeyDown={handleHashtagKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                      {displayHashtags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {displayHashtags.map((tag, i) => (
                            <Badge key={i} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* 대표 이미지 */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field: { value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        대표 이미지
                        <span className="text-xs text-muted-foreground ml-1">
                          (선택)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Input
                            id="img-upl"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            {...field}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById('img-upl')?.click()
                            }
                          >
                            이미지 선택
                          </Button>
                          {value && showImagePreview && (
                            <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-gray-100">
                              <img
                                src={value}
                                alt="미리보기"
                                className="h-full w-full object-cover"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0"
                                onClick={() => setShowImagePreview(false)}
                              >
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {value && !showImagePreview && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowImagePreview(true)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 인증 요청 */}
                {canPickFamily && (
                  <FormField
                    control={form.control}
                    name="requestCertification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1 font-semibold">
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                          인증 요청
                        </FormLabel>
                        <FormControl>
                          <input
                            id="cert-req"
                            type="checkbox"
                            checked={field.value}
                            onChange={e =>
                              field.onChange(e.target.checked)
                            }
                            className="mr-2 scale-125"
                          />
                          <label htmlFor="cert-req" className="text-xs">
                            인증된 피어몰은 검색·신뢰도 평가 우대
                          </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator className="my-5" />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
                disabled={isLoading || isDuplicateAddress}
              >
                {isLoading ? '등록 중...' : '피어몰 생성 완료'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePeermallModal;
