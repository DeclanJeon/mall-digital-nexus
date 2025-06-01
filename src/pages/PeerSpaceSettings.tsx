import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';

// Lazy imports
// MapSelectorDialog만 lazy load (MapMarkerSelector는 그 안에서 처리)

const MapSelectorDialog = lazy(() => import('@/components/peermall-features/MapSelectorDialog'));

// Icons
import { 
  ArrowLeft,
  Save,
  Settings,
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
  ChevronRight,
  Camera,
  Globe,
  Shield,
  Bell,
  Palette,
  Layout,
  Users,
  BarChart3,
  HelpCircle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

// API & Types
import { getPeermallByAddress, updatePeermall } from '@/api';
import { PeermallFormData } from '@/types/peermall';

// **스키마 정의**
const settingsSchema = z.object({
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  ownerName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(),
  mapAddress: z.string().optional(),
  visibility: z.enum(['public', 'partial', 'private']).optional(),
  notifications: z.boolean().optional(),
  autoSave: z.boolean().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// **메인 컴포넌트**
const PeerSpaceSettings: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // **상태 관리**
  const [activeTab, setActiveTab] = useState('basic');
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

  // **데이터 페칭**
  const { data: peermall, isLoading, error } = useQuery({
    queryKey: ['peermall', address],
    queryFn: () => getPeermallByAddress(address || ''),
    enabled: !!address,
  });

  // **폼 설정**
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      description: '',
      ownerName: '',
      email: '',
      imageUrl: '',
      hashtags: '',
      mapAddress: '',
      visibility: 'public',
      notifications: true,
      autoSave: true,
    },
    mode: 'onBlur',
  });

  // **데이터 바인딩 - 피어몰 데이터가 로드되면 폼에 설정**
  useEffect(() => {
    if (peermall) {
      const hashtags = peermall.tags?.join(', ') || '';
      
      form.reset({
        name: peermall.name || '',
        description: peermall.description || '',
        ownerName: peermall.ownerName || '',
        email: peermall.email || '',
        imageUrl: peermall.imageUrl || '',
        hashtags: hashtags,
        mapAddress: peermall.location?.address || '',
        visibility: (peermall.visibility as 'public' | 'partial' | 'private') || 'public',
        notifications: true, // 기본값
        autoSave: true, // 기본값
      });

      // 지도 위치 설정
      if (peermall.location?.lat && peermall.location?.lng) {
        setMapLocation({
          lat: peermall.location.lat,
          lng: peermall.location.lng,
          address: peermall.location.address || '',
        });
      }
    }
  }, [peermall, form]);

  // **폼 변경 감지**
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // **저장 뮤테이션**
  const saveMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      if (!address) throw new Error('주소가 없습니다');
      
      const formData = new FormData();
      
      // 기본 데이터 추가
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // 위치 정보 추가
      if (mapLocation) {
        formData.append('lat', String(mapLocation.lat));
        formData.append('lng', String(mapLocation.lng));
      }

      // 이미지 파일 추가
      if (imageFile) {
        formData.append('image', imageFile);
      }

      return updatePeermall(address, formData);
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

  // **로딩 상태**
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">피어몰 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // **에러 상태**
  if (error || !peermall) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">피어몰을 찾을 수 없습니다</h3>
              <p className="text-muted-foreground mt-2">
                요청하신 피어몰 정보를 불러올 수 없습니다.
              </p>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* **헤더 영역** */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/space/${address}`)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                피어몰로 돌아가기
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={peermall.imageUrl} alt={peermall.name} />
                  <AvatarFallback>
                    {peermall.name?.charAt(0)?.toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold">{peermall.name} 설정</h1>
                  <p className="text-sm text-muted-foreground">@{address}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  저장되지 않은 변경사항
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-blue-600 hover:bg-blue-700"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* **탭 네비게이션** */}
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">기본 정보</span>
                </TabsTrigger>
                <TabsTrigger value="branding" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">브랜딩</span>
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">위치</span>
                </TabsTrigger>
                {/* <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">개인정보</span>
                </TabsTrigger> */}
                {/* <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">알림</span>
                </TabsTrigger> */}
                {/* <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">고급</span>
                </TabsTrigger> */}
              </TabsList>

              {/* **기본 정보 탭** */}
              <TabsContent value="basic" className="space-y-6">
                <Card className="border-blue-100 bg-blue-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <CardTitle className="text-blue-700">기본 정보</CardTitle>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <CardDescription>
                      피어몰의 기본적인 정보를 관리하세요. 이 정보는 방문자들에게 가장 먼저 보여집니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                          <FormDescription>
                            💡 방문자들이 가장 먼저 보게 될 피어몰 이름입니다
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
                              placeholder="어떤 피어몰인지 간단히 소개해주세요! 고객들이 가장 먼저 보게 될 설명이에요."
                              className="min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                              maxLength={500}
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>💡 고객들에게 어떤 가치를 제공하는지 명확하게 설명해보세요</span>
                            <span>{field.value?.length || 0}/500</span>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* **브랜딩 탭** */}
              <TabsContent value="branding" className="space-y-6">
                <Card className="border-purple-100 bg-purple-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <CardTitle className="text-purple-700">브랜딩 & 개성</CardTitle>
                      <Palette className="w-4 h-4 text-purple-500" />
                    </div>
                    <CardDescription>
                      피어몰만의 개성과 브랜드 아이덴티티를 설정하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
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
                                    className="hover:bg-purple-50 hover:border-purple-300 transition-all"
                                  >
                                    <Camera className="w-4 h-4 mr-2" />
                                    이미지 변경
                                  </Button>
                                </div>
                                
                                {field.value && showImagePreview && (
                                  <div className="relative w-full h-40 overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                                    <img
                                      src={field.value}
                                      alt="대표 이미지"
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
                                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setShowImagePreview(true)}
                                      className="text-muted-foreground hover:text-foreground"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      미리보기 보기
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                              <FormDescription>
                                💡 JPG, PNG 파일만 업로드 가능해요 (최대 5MB)
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
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                해시태그
                                <span className="text-xs text-muted-foreground ml-1">(선택)</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="#패션, #핸드메이드, #친환경"
                                  onKeyDown={handleHashtagKeyDown}
                                  className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                  maxLength={100}
                                />
                              </FormControl>
                              <FormMessage />
                              <FormDescription>
                                💡 쉼표(,)로 구분해서 입력하세요
                              </FormDescription>
                              
                              {displayHashtags.length > 0 && (
                                <div className="mt-3 p-3 bg-white rounded-lg border">
                                  <div className="text-xs font-medium text-muted-foreground mb-2">미리보기:</div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {displayHashtags.map((tag, i) => (
                                      <Badge 
                                        key={i} 
                                        variant="secondary" 
                                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* **위치 탭** */}
              <TabsContent value="location" className="space-y-6">
                <Card className="border-green-100 bg-green-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <CardTitle className="text-green-700">위치 정보</CardTitle>
                      <MapPin className="w-4 h-4 text-green-500" />
                    </div>
                    <CardDescription>
                      피어맵에서 고객들이 쉽게 찾을 수 있도록 위치를 설정하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="지도에서 위치를 선택하거나 직접 입력하세요"
                                  className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsMapDialogOpen(true)}
                                className="whitespace-nowrap hover:bg-green-50 hover:border-green-300 transition-all"
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                지도에서 선택
                              </Button>
                            </div>
                            
                            {mapLocation && (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
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
                          <FormDescription>
                            🗺️ 지도에서 정확한 위치를 선택하면 피어맵에서 찾기 쉬워져요!
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* **개인정보 탭** */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="border-orange-100 bg-orange-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <CardTitle className="text-orange-700">개인정보 & 공개 설정</CardTitle>
                      <Shield className="w-4 h-4 text-orange-500" />
                    </div>
                    <CardDescription>
                      피어몰의 공개 범위와 개인정보 보호 설정을 관리하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1 font-semibold">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            공개 범위
                          </FormLabel>
                          <div className="grid gap-3">
                            {[
                              {
                                value: 'public' as const,
                                title: '전체 공개',
                                description: '모든 사람이 피어몰을 보고 검색할 수 있어요',
                                color: 'bg-green-500',
                                icon: Globe
                              },
                              {
                                value: 'partial' as const,
                                title: '부분 공개',
                                description: '링크를 아는 사람만 피어몰을 볼 수 있어요',
                                color: 'bg-yellow-500',
                                icon: Eye
                              },
                              {
                                value: 'private' as const,
                                title: '비공개',
                                description: '본인만 피어몰을 볼 수 있어요',
                                color: 'bg-red-500',
                                icon: EyeOff
                              }
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                                  field.value === option.value
                                    ? 'border-orange-300 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => field.onChange(option.value)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-3 h-3 ${option.color} rounded-full mt-1`}></div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <option.icon className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{option.title}</span>
                                      {field.value === option.value && (
                                        <Check className="h-4 w-4 text-orange-600" />
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                          <FormDescription>
                            🔍 공개 범위는 검색 노출과 추천 알고리즘에 영향을 줘요
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>개인정보 보호:</strong> 이메일 주소는 절대 공개되지 않으며, 
                        피어몰 관리와 중요한 알림 발송에만 사용됩니다.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* **알림 탭** */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-blue-100 bg-blue-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <CardTitle className="text-blue-700">알림 설정</CardTitle>
                      <Bell className="w-4 h-4 text-blue-500" />
                    </div>
                    <CardDescription>
                      피어몰 활동과 관련된 알림을 받을 방법을 설정하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-medium">
                                이메일 알림
                              </FormLabel>
                              <FormDescription>
                                새로운 방문자, 리뷰, 메시지 등에 대한 알림을 이메일로 받습니다
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

                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="text-base font-medium">브라우저 알림</div>
                          <div className="text-sm text-muted-foreground">
                            실시간으로 중요한 활동 알림을 받습니다
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="text-base font-medium">마케팅 알림</div>
                          <div className="text-sm text-muted-foreground">
                            피어몰 성장에 도움이 되는 팁과 업데이트를 받습니다
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <Alert>
                      <Bell className="h-4 w-4" />
                      <AlertDescription>
                        <strong>알림 주기:</strong> 너무 많은 알림을 방지하기 위해 
                        유사한 알림들은 하루에 한 번씩 모아서 발송됩니다.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* **고급 설정 탭** */}
              <TabsContent value="advanced" className="space-y-6">
                <Card className="border-gray-100 bg-gray-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <CardTitle className="text-gray-700">고급 설정</CardTitle>
                      <Settings className="w-4 h-4 text-gray-500" />
                    </div>
                    <CardDescription>
                      개발자를 위한 고급 기능과 실험적 기능들을 설정하세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="autoSave"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-medium">
                                자동 저장
                              </FormLabel>
                              <FormDescription>
                                변경사항을 자동으로 저장합니다 (5분마다)
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

                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="text-base font-medium">개발자 모드</div>
                          <div className="text-sm text-muted-foreground">
                            고급 개발자 도구와 디버깅 정보를 표시합니다
                          </div>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="text-base font-medium">베타 기능</div>
                          <div className="text-sm text-muted-foreground">
                            출시 전 새로운 기능들을 미리 체험해볼 수 있습니다
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">피어몰 통계</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-blue-600">
                            {peermall?.followers || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">팔로워</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-green-600">
                            {peermall?.reviewCount || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">리뷰</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-purple-600">
                            {peermall?.rating || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">평점</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.floor(Math.random() * 100)}
                          </div>
                          <div className="text-xs text-muted-foreground">이번 달 방문</div>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <HelpCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>도움이 필요하신가요?</strong> 
                        <Button variant="link" className="p-0 h-auto text-blue-600 ml-1">
                          고객 지원 센터
                        </Button>
                        에서 더 자세한 가이드를 확인하실 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg md:hidden z-50">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
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
      )}
    </div>
  );
};

export default PeerSpaceSettings;