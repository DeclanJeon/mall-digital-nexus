import React, { useState, useEffect } from 'react';
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
  MapPin,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const formSchema = z.object({
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
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(),
  mapAddress: z.string().optional(),
  familyMember: z.string().optional(),
  visibility: z.enum(['public', 'partial', 'private'], {
    message: '공개 범위를 선택해주세요',
  }),
  requestCertification: z.boolean().optional(),
});

const LOCAL_STORAGE_PEERMALL_KEY_PREFIX = 'peermall_';

const CreatePeermallModal = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(true);
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch('/src/data/family-members.json');
        const data = await response.json();
        setFamilyMembers(data);
      } catch {
        setFamilyMembers([]);
      }
    };
    fetchFamilyMembers();
  }, []);

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
      mapAddress: '',
      familyMember: '',
      visibility: 'public',
      requestCertification: false
    },
    mode: 'onBlur',
  });

  // 피어몰 주소 중복(유일성) 체크
  const checkDuplicateAddress = (address) => {
    const allPeermallAddresses = JSON.parse(localStorage.getItem('all_peermall_addresses') || '[]');
    return allPeermallAddresses.includes(address);
  };

  // 주소 입력 변경시 중복 체크
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'address' && values.address) {
        setIsDuplicateAddress(checkDuplicateAddress(values.address));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
        setShowImagePreview(true);
      };
      reader.onerror = () => {
        toast({
          title: "이미지 업로드 실패",
          description: "이미지를 읽는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const hashtagsValue = form.watch('hashtags');
  const displayHashtags = hashtagsValue
    ?.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag)
    .map(tag => (tag.startsWith('#') ? tag : `#${tag}`)) || [];

  // 멤버십 유형 선택에 따른 familyMember 필드 활성화
  const selectedMembership = form.watch('membershipType');
  const selectedVisibility = form.watch('visibility');
  const canRequestCertification = ['family', 'enterprise'].includes(selectedMembership);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      // 주소 중복 재확인
      if (checkDuplicateAddress(values.address)) {
        setIsDuplicateAddress(true);
        toast({
          title: "중복된 주소",
          description: "이미 사용 중인 피어몰 주소(URL)입니다. 다른 주소를 입력해주세요.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const processedHashtags = values.hashtags
        ?.split(',')
        .map(tag => {
          const trimmedTag = tag.trim();
          return trimmedTag && (trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`);
        })
        .filter(tag => tag) || [];

      const peermallId = values.address.toLowerCase().replace(/\s+/g, '-');

      const peermallDataForStorage = {
        address: peermallId,
        title: values.name,
        description: values.description,
        owner: values.representativeName,
        email: values.email,
        imageUrl: values.imageUrl || '',
        category: values.membershipType,
        tags: processedHashtags,
        membershipType: values.membershipType,
        mapAddress: values.mapAddress || '',
        familyMember: values.membershipType === 'family' ? values.familyMember : '',
        visibility: values.visibility,
        requestCertification: !!values.requestCertification,
        rating: 0,
        reviewCount: 0,
        location: {
          address: values.mapAddress || values.address,
          lat: 0,
          lng: 0,
        },
        createdAt: new Date().toISOString(),
      };
      
      await new Promise(resolve => setTimeout(resolve, 800)); // 네트워크 대기 시뮬레이션

      await add(STORES.PEER_SPACES, peermallDataForStorage);

      // localStorage 저장
      try {
        localStorage.setItem(`${LOCAL_STORAGE_PEERMALL_KEY_PREFIX}${peermallId}`, JSON.stringify(peermallDataForStorage));
        const allPeermallAddresses = JSON.parse(localStorage.getItem('all_peermall_addresses') || '[]');
        if (!allPeermallAddresses.includes(peermallId)) {
          allPeermallAddresses.push(peermallId);
          localStorage.setItem('all_peermall_addresses', JSON.stringify(allPeermallAddresses));
        }
      } catch (storageError) {
        toast({
          title: "데이터 저장 경고",
          description: "피어몰 정보는 등록되었으나, 일부 로컬 데이터 저장에 실패했습니다.",
          variant: "default",
        });
      }

      toast({
        title: "피어몰 등록 완료",
        description: `${values.name} 피어몰이 성공적으로 등록되었습니다.`,
        variant: "default",
      });

      form.reset();
      setShowImagePreview(true);
      if (onSuccess) {
        onSuccess({ id: peermallId, name: values.name, type: values.membershipType, ...peermallDataForStorage });
      } else {
        onClose();
      }
    } catch (error) {
      toast({
        title: "피어몰 등록 실패",
        description: "피어몰 등록 중 오류가 발생했습니다. 입력 내용을 확인해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredLabel = ({ children }) => (
    <span className="flex items-center gap-1 font-semibold">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  const handleCloseAndReset = () => {
    form.reset();
    setShowImagePreview(true);
    setIsDuplicateAddress(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleCloseAndReset(); }}>
      <DialogContent className="sm:max-w-[620px] max-h-[95vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Store className="h-5 w-5 text-blue-500" />
            피어몰 만들기
          </DialogTitle>
          <div className="text-xs text-muted-foreground mt-2">
            <ul className="list-disc list-inside">
              <li>피어몰은 <strong>사용자 자율 운영</strong> 온라인 공간입니다. <span className="text-blue-600">정책사항</span>을 꼭 참고하세요.</li>
              <li>family/enterprise 멤버십은 <strong>패밀리 멤버</strong> 지정 및 <strong>인증</strong> 요청이 가능합니다.</li>
              <li>공개범위, 해시태그, 설명은 검색·노출·추천에 활용됩니다.</li>
            </ul>
          </div>
          <div className="mt-1 text-xs flex items-center gap-1 text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>\* 표시는 필수 입력 항목입니다.</span>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 왼쪽 섹션 */}
              <div className="space-y-5">
                {/* 주소 */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><RequiredLabel>피어몰 주소(URL)</RequiredLabel></FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <span className="text-sm text-muted-foreground pl-3 pr-1 py-2 bg-gray-50 border-r">peermall.com/space/</span>
                          <Input
                            placeholder="my-store"
                            {...field}
                            className="border-0 rounded-l-none focus:ring-0 flex-1"
                            maxLength={30}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {isDuplicateAddress && (
                        <div className="text-xs text-red-500 mt-1">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          이 주소는 이미 사용 중입니다.
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        영문 소문자, 숫자, 하이픈(-)만 사용. <span className="text-blue-600">주소는 생성 후 변경 불가</span>
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
                      <FormLabel><RequiredLabel>피어몰 이름</RequiredLabel></FormLabel>
                      <FormControl>
                        <Input placeholder="예: 내멋진가게" {...field} maxLength={20} />
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
                      <FormLabel><RequiredLabel>멤버십 유형</RequiredLabel></FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="멤버십 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal (개인몰)</SelectItem>
                            <SelectItem value="family">Family (클솔패밀리)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (기업/단체)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        family/enterprise는 <span className="text-blue-600">패밀리 멤버</span> 지정 및 <span className="text-blue-600">인증</span> 요청 가능
                      </div>
                    </FormItem>
                  )}
                />

                {/* 패밀리 멤버 (family/enterprise만) */}
                {['family', 'enterprise'].includes(selectedMembership) && (
                  <FormField
                    control={form.control}
                    name="familyMember"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="flex items-center gap-1 font-semibold">
                            <User className="h-4 w-4 text-muted-foreground" />
                            클솔 패밀리 멤버 지정
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="패밀리 멤버 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {familyMembers.length === 0 && (
                                <SelectItem value="">패밀리 멤버 정보 없음</SelectItem>
                              )}
                              {familyMembers.map(member => (
                                <SelectItem value={member.id} key={member.id}>
                                  {member.name} {member.role ? `(${member.role})` : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-muted-foreground mt-1">
                          피어몰 정책상 <span className="text-blue-600">패밀리 멤버 필수 선택</span>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {/* 공개범위 */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="flex items-center gap-1 font-semibold">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          공개 범위
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="공개여부 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">공개 (지도/검색 노출)</SelectItem>
                            <SelectItem value="partial">부분공개 (지도에 흐릿하게 표시, 제한적 노출)</SelectItem>
                            <SelectItem value="private">비공개 (초대/키 필요, 지도 미표시)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        공개/부분공개는 <span className="text-blue-600">피어맵</span> 및 검색 결과에 노출됨
                      </div>
                    </FormItem>
                  )}
                />

                {/* 피어맵 표시 주소 */}
                <FormField
                  control={form.control}
                  name="mapAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          피어맵 표시 주소
                          <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 서울 강남구 테헤란로 123" {...field} />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        입력 시 지도에 위치가 표시됩니다.
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              {/* 오른쪽 섹션 */}
              <div className="space-y-5">
                {/* 대표자 이름 */}
                <FormField
                  control={form.control}
                  name="representativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel><User className="h-4 w-4 inline-block mr-1 text-muted-foreground" />대표자 이름</RequiredLabel>
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
                          <Mail className="h-4 w-4 inline-block mr-1 text-muted-foreground" />이메일 주소
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1">
                        알림 및 약관, 정책 변경 시 통지에 사용됩니다.
                      </div>
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
                      <FormLabel><RequiredLabel>피어몰 설명</RequiredLabel></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="피어몰을 잘 나타내는 설명을 작성해주세요 (최소 10자)."
                          className="min-h-[90px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        설명은 검색·추천·신뢰도 평가에 반영됩니다.
                      </div>
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
                        <FileText className="h-4 w-4 text-muted-foreground" /> 해시태그
                        <span className="text-xs text-muted-foreground ml-1">(선택, 쉼표로 구분)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="#패션, #핸드메이드, #맛집"
                          {...field}
                          onKeyDown={handleHashtagKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                      {displayHashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {displayHashtags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
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
                  render={({ field: { onChange, value, ...restField } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 font-semibold">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" /> 대표 이미지
                        <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            {...restField}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('imageUpload')?.click()}
                            size="sm"
                          >
                            이미지 선택
                          </Button>
                          {value && typeof value === 'string' && showImagePreview && (
                            <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-gray-100">
                              <img
                                src={value}
                                alt="이미지 미리보기"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0"
                                onClick={() => setShowImagePreview(false)}
                                title="미리보기 숨기기"
                              >
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {!showImagePreview && value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowImagePreview(true)}
                              title="미리보기 보기"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 인증 요청 (family, enterprise만) */}
                {canRequestCertification && (
                  <FormField
                    control={form.control}
                    name="requestCertification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1 font-semibold">
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                          피어몰 인증 요청
                        </FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={e => field.onChange(e.target.checked)}
                            className="scale-125 mr-2"
                            id="certification-request"
                          />
                        </FormControl>
                        <label htmlFor="certification-request" className="text-xs text-muted-foreground">
                          인증된 피어몰은 신뢰도와 검색 노출에서 우대됩니다.
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator className="my-5" />

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleCloseAndReset} className="w-full sm:w-auto">
                취소
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto font-semibold"
                disabled={isLoading || isDuplicateAddress}
              >
                {isLoading ? "등록 중..." : "피어몰 생성 완료"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePeermallModal;
