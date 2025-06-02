import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';

// Lazy imports
const MapSelectorDialog = lazy(() => import('@/components/peermall-features/MapSelectorDialog'));

// Icons
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  MapPin,
  Image as ImageIcon,
  FileText,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Camera,
  Globe,
  Shield,
  Sparkles,
  Heart,
  Star,
  Zap,
  Palette,
  Hash
} from 'lucide-react';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// API & Types
import { getPeermallByAddress, updatePeermall } from '@/api';
import { Peermall, PeermallFormData } from '@/types/peermall';
import { getPeerMallData, updatePeerMall } from '@/services/peerMallService';

// **스키마 정의**
const settingsSchema = z.object({
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  ownerName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  imageId: z.string().optional(),
  hashtags: z.string().optional(),
  mapAddress: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// **메인 컴포넌트**
const PeerSpaceSettings: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // **상태 관리**
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(true);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchParams] = useSearchParams();
  const peerMallKey = searchParams.get('mk');
  const [peerMall, setPeerMall] = useState<Peermall | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // **폼 설정**
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      description: '',
      ownerName: '',
      email: '',
      imageUrl: '',
      imageKey: '',
      imageId: '',
      hashtags: '',
      mapAddress: '',
    },
    mode: 'onBlur',
  });

  // **데이터 바인딩**
  useEffect(() => {
    setIsLoading(true);

    const loadPeerMall = async () => {
      const loadedPeerMall = await getPeerMallData(address, peerMallKey);
      setPeerMall(loadedPeerMall);
      setIsLoading(false);
    };

    loadPeerMall();
  }, [address, peerMallKey]);

  useEffect(() => {
    if (peerMall) {
      form.reset({
        name: peerMall.peerMallName,
        description: peerMall.description,
        ownerName: peerMall.ownerName,
        email: peerMall.email,
        imageUrl: peerMall.imageUrl,
        imageKey: peerMall.imageKey,
        imageId: peerMall.imageId,
        hashtags: peerMall.hashtags,
        mapAddress: peerMall.peerMallAddress,
      });
    }
  }, [peerMall]);

  // **폼 변경 감지**
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onBack = () => {
    window.history.back();
  };

  // **저장 뮤테이션**
  const saveMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      if (!address) throw new Error('주소가 없습니다');

      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (mapLocation) {
        formData.append('lat', String(mapLocation.lat));
        formData.append('lng', String(mapLocation.lng));
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('originName', address);
      formData.append('peerMallKey', peerMallKey);

      return await updatePeerMall(formData);
    },
    onSuccess: () => {
      toast({
        title: '설정이 저장되었습니다! 🎉',
        description: '변경사항이 성공적으로 적용되었습니다.',
      });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['peermall', address] });
    },
    onError: (error) => {
      toast({
        title: '저장 실패',
        description: '설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
        variant: 'destructive',
      });
      console.error('저장 오류:', error);
    },
  });

  // **이벤트 핸들러들**
  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: '입력 확인 필요',
        description: '필수 항목을 모두 올바르게 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveMutation.mutateAsync(form.getValues());
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
      form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
      setShowImagePreview(true);
      toast({
        title: '이미지 업로드 완료! 📸',
        description: '대표 이미지가 설정되었습니다.',
      });
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setMapLocation(location);
    form.setValue('mapAddress', location.address, { shouldValidate: true });
    toast({
      title: '위치 선택 완료! 📍',
      description: `${location.address}로 설정되었습니다.`,
    });
    setIsMapDialogOpen(false);
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  // **해시태그 처리**
  const rawHashtags = form.watch('hashtags') || '';
  const displayHashtags = rawHashtags
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
    .map(t => (t.startsWith('#') ? t : `#${t}`));

  // **RequiredLabel 컴포넌트**
  const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="flex items-center gap-1 font-semibold">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  // **완성도 계산**
  const calculateCompleteness = () => {
    const values = form.getValues();
    let completed = 0;
    const total = 6;

    if (values.name) completed++;
    if (values.description) completed++;
    if (values.ownerName) completed++;
    if (values.email) completed++;
    if (values.imageUrl) completed++;
    if (values.mapAddress) completed++;

    return Math.round((completed / total) * 100);
  };

  const completeness = calculateCompleteness();

  // **로딩 상태**
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-blue-200 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">피어몰 정보 로딩 중...</p>
            <p className="text-sm text-gray-500">잠시만 기다려주세요 ✨</p>
          </div>
        </div>
      </div>
    );
  }

  // **에러 상태**
  if (!peerMall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-gray-800">피어몰을 찾을 수 없어요</h3>
              <p className="text-gray-600 leading-relaxed">
                요청하신 피어몰 정보를 불러올 수 없습니다.<br />
                주소를 다시 확인해주세요.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* **헤더 영역** */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBack()}
                className="hover:bg-white/60 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                피어몰로 돌아가기
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                  <AvatarImage src={peerMall.imageUrl} alt={peerMall.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                    {peerMall.name?.charAt(0)?.toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {peerMall.name} 설정
                  </h1>
                  <p className="text-sm text-gray-500">@{address}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasChanges && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  저장 필요
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    변경사항 저장
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* **메인 콘텐츠** */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
            {/* **완성도 표시** */}
            <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">피어몰 완성도</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {completeness}%
                  </span>
                </div>
                <Progress value={completeness} className="h-3 mb-3" />
                <p className="text-sm text-gray-600">
                  {completeness === 100 ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <Check className="h-4 w-4" />
                      완벽해요! 모든 정보가 입력되었습니다 🎉
                    </span>
                  ) : (
                    `${6 - Math.floor((completeness / 100) * 6)}개 항목이 더 필요해요`
                  )}
                </p>
              </CardContent>
            </Card>

            {/* **통합 설정 카드** */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    피어몰 정보 설정
                  </CardTitle>
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  고객들이 가장 먼저 보게 될 피어몰의 핵심 정보를 설정해보세요. 
                  완성도가 높을수록 더 많은 고객들이 찾아올 거예요! ✨
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* **기본 정보 섹션** */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">기본 정보</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                  </div>

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
                            className="h-12 text-base border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          방문자들이 가장 먼저 보게 될 피어몰 이름입니다
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
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
                              className="h-11 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                              className="h-11 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                            placeholder="어떤 피어몰인지 간단히 소개해주세요! 고객들이 가장 먼저 보게 될 설명이에요."
                            className="min-h-[120px] border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                            maxLength={500}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            고객들에게 어떤 가치를 제공하는지 명확하게 설명해보세요
                          </span>
                          <span>{field.value?.length || 0}/500</span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-8" />

                {/* **브랜딩 섹션** */}
                <div className="space-y-6">
                  {/* <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">브랜딩 & 개성</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                  </div> */}

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* 왼쪽: 대표 이미지 */}
                    <div className="space-y-4">
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
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <input
                                  id="img-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('img-upload')?.click()}
                                  className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                                >
                                  <Camera className="w-4 h-4 mr-2" />
                                  이미지 변경
                                </Button>
                              </div>
                              
                              {field.value && showImagePreview && (
                                <div className="relative w-full h-48 overflow-hidden rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30 group">
                                  <img
                                    src={field.value}
                                    alt="대표 이미지"
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                                  <div className="absolute top-3 right-3 flex gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-md"
                                      onClick={() => setShowImagePreview(false)}
                                    >
                                      <EyeOff className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {field.value && !showImagePreview && (
                                <div className="flex items-center justify-center h-40 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/30">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowImagePreview(true)}
                                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    미리보기 보기
                                  </Button>
                                </div>
                              )}

                              {!field.value && (
                                <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                  <div className="text-center space-y-2">
                                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                                    <p className="text-sm text-gray-500">대표 이미지를 업로드해보세요</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                            <FormDescription className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              JPG, PNG 파일만 업로드 가능해요 (최대 5MB)
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 오른쪽: 해시태그 */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="hashtags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1 font-semibold">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              해시태그
                              <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="#패션, #핸드메이드, #친환경"
                                onKeyDown={handleHashtagKeyDown}
                                className="h-11 border-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                maxLength={100}
                              />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              쉼표(,)로 구분해서 입력하세요
                            </FormDescription>
                            
                            {displayHashtags.length > 0 && (
                              <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                <div className="text-xs font-medium text-purple-700 mb-3 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  미리보기:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {displayHashtags.map((tag, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="secondary" 
                                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border-0 shadow-sm"
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
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* **위치 정보 섹션** */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">위치 정보</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                  </div>

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
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="지도에서 위치를 선택하거나 직접 입력하세요"
                                className="h-11 border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsMapDialogOpen(true)}
                              className="whitespace-nowrap h-11 px-4 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              지도에서 선택
                            </Button>
                          </div>
                          
                          {mapLocation && (
                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1">
                                    <Check className="h-4 w-4" />
                                    선택된 위치
                                  </div>
                                  <div className="text-sm text-green-700 break-words mb-2">
                                    {mapLocation.address}
                                  </div>
                                  <div className="text-xs text-green-600 font-mono">
                                    {/* //위도: {mapLocation.lat.toFixed(6)} | 경도: {mapLocation.lng.toFixed(6)} */}
                                    위도: {mapLocation.lat} | 경도: {mapLocation.lng}
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
                        <FormDescription className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          지도에서 정확한 위치를 선택하면 피어맵에서 찾기 쉬워져요!
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* **도움말 섹션** */}
                <Alert className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm leading-relaxed">
                    <strong className="text-blue-800">개인정보 보호:</strong> 이메일 주소는 절대 공개되지 않으며, 
                    피어몰 관리와 중요한 알림 발송에만 사용됩니다. 모든 정보는 안전하게 암호화되어 저장돼요! 🔒
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* **추가 정보 카드** */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">거의 다 완성되었어요!</h3>
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                      설정을 저장하면 피어맵에서 고객들이 여러분의 멋진 피어몰을 찾을 수 있어요. 
                      더 많은 기능들이 곧 추가될 예정이니 기대해주세요! 🚀
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    {['🎨', '📍', '💝', '✨'].map((emoji, i) => (
                      <span 
                        key={i} 
                        className="text-2xl animate-bounce" 
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>

      {/* **지도 선택 다이얼로그** */}
      <Suspense fallback={null}>
        <MapSelectorDialog
          isOpen={isMapDialogOpen}
          onClose={() => setIsMapDialogOpen(false)}
          onSelect={handleLocationSelect}
          initialPosition={mapLocation || { 
            lat: 37.5665, 
            lng: 126.9780, 
            address: form.getValues('mapAddress') || '' 
          }}
          initialAddress={form.getValues('mapAddress') || ''}
        />
      </Suspense>

      {/* **하단 고정 저장 바 (모바일)** */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/20 p-4 shadow-2xl md:hidden z-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">완성도</span>
                <span className="text-sm font-bold text-purple-600">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2" />
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg h-12 text-base font-medium"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                변경사항 저장하기
              </>
            )}
          </Button>
        </div>
      )}

      {/* **배경 데코레이션** */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default PeerSpaceSettings;