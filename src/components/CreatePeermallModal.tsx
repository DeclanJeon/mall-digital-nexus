import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  MapPin, 
  Store, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Phone, 
  Map, 
  Ticket, 
  X,
  Hash // Import Hash icon
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
// Select components are imported but not used, consider removing if not needed later
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with validation
const formSchema = z.object({
  address: z.string().min(1, { message: '피어몰 주소를 입력해주세요' }),
  name: z.string().min(2, { message: '피어몰 이름은 2자 이상이어야 합니다' }),
  description: z.string().min(10, { message: '설명은 10자 이상이어야 합니다' }),
  hashtags: z.string().optional(), // Add hashtags field (optional string)
  imageUrl: z.string().min(1, { message: '대표 이미지를 선택해주세요' }),
  representativeName: z.string().min(1, { message: '대표자 이름을 입력해주세요' }),
  contact: z.string().min(1, { message: '연락처를 입력해주세요' }),
  mapAddress: z.string().min(1, { message: '지도상 주소를 입력해주세요' }),
  referralCode: z.string().optional(),
  hasReferral: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePeermallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (peermallId: string) => void;
}

const CreatePeermallModal: React.FC<CreatePeermallModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      description: '',
      hashtags: '', // Add default value for hashtags
      imageUrl: '',
      representativeName: '',
      contact: '',
      mapAddress: '',
      referralCode: '',
      hasReferral: false,
    },
  });

  // Image upload handler (mock)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // Here we're just creating a fake URL
      const fakeImageUrl = URL.createObjectURL(file);
      form.setValue('imageUrl', fakeImageUrl);
    }
  };

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    // Process hashtags (split string into array, trim whitespace)
    const processedValues = {
      ...values,
      hashtags: values.hashtags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
    };
    console.log('피어몰 생성 데이터:', processedValues);
    
    // In a real implementation, you would send the data to a server
    toast({
      title: "피어몰 생성 요청",
      description: "피어몰 생성이 요청되었습니다. 검토 후 승인됩니다.",
    });
    
    // Generate a mock peermall ID based on the address
    const peermallId = values.address.toLowerCase().replace(/\s+/g, '-');
    
    // Reset the form
    form.reset();
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess(peermallId);
    } else {
      // Just close the modal if no callback provided
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            피어몰 만들기
          </DialogTitle>
          <DialogDescription>
            새로운 피어몰을 생성하기 위한 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 피어몰 주소 */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> 피어몰 주소
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-1">peermall.com/</span>
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
                    <Store className="h-4 w-4" /> 피어몰 이름
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
                    <FileText className="h-4 w-4" /> 피어몰 설명
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
                    <Hash className="h-4 w-4" /> 해시태그 (쉼표로 구분)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="예: #맛집, #핸드메이드, #서울" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* 대표 이미지 */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" /> 대표 이미지
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
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
                      <input 
                        type="hidden" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* 대표자 이름 */}
            <FormField
              control={form.control}
              name="representativeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <User className="h-4 w-4" /> 대표자 이름
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
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> 연락처
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="이메일 또는 전화번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* 맵 주소 */}
            <FormField
              control={form.control}
              name="mapAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Map className="h-4 w-4" /> 지도상 주소
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="서울시 강남구 테헤란로" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      <Ticket className="h-4 w-4" /> 추천인 코드 / 스폰서 등록
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
                  <FormItem>
                    <FormControl>
                      <Input placeholder="추천인 코드를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">
                피어몰 생성하기
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePeermallModal;
