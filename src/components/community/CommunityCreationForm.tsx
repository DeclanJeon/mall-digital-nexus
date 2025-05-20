
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Switch
} from "@/components/ui/switch";
import { WeatherType } from "@/services/weatherService";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileImage, FileVideo, Upload, Link as LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import EmojiPicker from "@/components/community/EmojiPicker";

// Define the location information type
interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  district?: string;
  displayName?: string;
}

// Define image upload type
type ImageType = "image" | "gif" | "video" | "url";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다.").max(30, "이름은 최대 30자까지 가능합니다."),
  description: z.string().max(500, "설명은 최대 500자까지 가능합니다.").optional(),
  type: z.enum(["city", "village", "zone", "personal"]),
  privacy: z.enum(["public", "partial", "private", "timed"]),
  owner: z.string().min(1, "운영자 이름을 입력해주세요."),
  status: z.enum(["normal", "growing"]),
  weather: z.enum(["sunny", "cloudy", "rainy", "snowy", "foggy"]),
  memberCount: z.number().int().min(1).default(1),
  postCount: z.number().int().default(0),
  vitalityIndex: z.number().int().min(0).max(100).default(50),
  lastActive: z.string().default("방금 전"),
  hasEvent: z.boolean().default(false),
  hasSosSignal: z.boolean().default(false),
  imageUrl: z.string().optional(),
  imageType: z.enum(["image", "gif", "video", "url"]).optional(),
  emoji: z.string().optional(),
});

// Export this type so GlobeMap can use it
export type CommunityFormValues = z.infer<typeof formSchema>;

interface CommunityCreationFormProps {
  onSubmit: (data: CommunityFormValues) => void;
  onCancel: () => void;
  locationInfo: LocationInfo | null;
}

const CommunityCreationForm: React.FC<CommunityCreationFormProps> = ({ 
  onSubmit, 
  onCancel,
  locationInfo 
}) => {
  const [selectedImageTab, setSelectedImageTab] = useState<string>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  
  // Form default values incorporating location info
  const defaultValues = {
    name: locationInfo?.city || locationInfo?.district || "",
    type: "zone" as const,
    privacy: "public" as const,
    owner: "",
    status: "normal" as const,
    weather: "sunny" as const,
    memberCount: 1,
    postCount: 0,
    vitalityIndex: 50,
    lastActive: "방금 전",
    hasEvent: false,
    hasSosSignal: false,
    imageUrl: "",
    imageType: "image" as const,
    emoji: "",
  };

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    let imageType: ImageType = "image";
    if (file.type.includes("image/gif")) {
      imageType = "gif";
    } else if (file.type.includes("video/")) {
      imageType = "video";
    } else if (!file.type.includes("image/")) {
      alert("지원하지 않는 파일 형식입니다.");
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      form.setValue("imageUrl", result);
      form.setValue("imageType", imageType);
    };
    reader.readAsDataURL(file);
  };

  // Handle URL input
  const handleUrlInput = (url: string) => {
    if (url) {
      // Detect URL type
      let urlType: ImageType = "image";
      if (url.match(/\.(gif|webp)$/i)) {
        urlType = "gif";
      } else if (url.match(/\.(mp4|webm|mov)$/i)) {
        urlType = "video";
      } else if (!url.match(/\.(jpg|jpeg|png|webp|svg|avif)$/i)) {
        urlType = "url";
      }
      
      form.setValue("imageUrl", url);
      form.setValue("imageType", urlType);
      
      // Only set preview for direct image/gif/video URLs, not for complex external links
      if (urlType !== "url") {
        setImagePreview(url);
      } else {
        setImagePreview(null);
      }
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    form.setValue("emoji", selectedEmoji);
  };

  const handleSubmit = (values: CommunityFormValues) => {
    // Ensure emoji is included
    if (emoji) {
      values.emoji = emoji;
    }
    
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>커뮤니티 이름</FormLabel>
              <FormControl>
                <Input placeholder="커뮤니티 이름을 입력하세요" {...field} />
              </FormControl>
              <FormDescription>
                커뮤니티를 대표하는 이름을 입력하세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emoji Picker */}
        <FormItem>
          <FormLabel>커뮤니티 아이콘 (이모지)</FormLabel>
          <FormControl>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} selectedEmoji={emoji} />
          </FormControl>
          <FormDescription>
            커뮤니티를 대표할 이모지를 선택하세요.
          </FormDescription>
        </FormItem>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <FormLabel>커뮤니티 대표 이미지</FormLabel>
          <Tabs value={selectedImageTab} onValueChange={setSelectedImageTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                <span>업로드</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <span>URL</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                <span>미리보기</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">PNG, JPG, GIF, MP4 파일 (최대 10MB)</p>
                <Input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleFileUpload}
                  className="max-w-xs"
                />
              </div>
            </TabsContent>
            <TabsContent value="url" className="pt-4">
              <div className="space-y-4">
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="이미지/비디오 URL을 입력하세요"
                        onChange={(e) => handleUrlInput(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => handleUrlInput(form.getValues("imageUrl") || "")}
                      >
                        확인
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    이미지, GIF, 동영상 링크를 입력하세요.
                  </FormDescription>
                </FormItem>
              </div>
            </TabsContent>
            <TabsContent value="preview" className="pt-4">
              {imagePreview ? (
                <div className="flex items-center justify-center">
                  {form.getValues("imageType") === "video" ? (
                    <video 
                      src={imagePreview} 
                      className="max-h-60 max-w-full rounded-md" 
                      controls 
                    />
                  ) : (
                    <img 
                      src={imagePreview} 
                      alt="Community preview" 
                      className="max-h-60 max-w-full rounded-md object-contain" 
                    />
                  )}
                </div>
              ) : form.getValues("imageUrl") && form.getValues("imageType") === "url" ? (
                <Card className="p-4 text-center">
                  <LinkIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">외부 링크</p>
                  <a 
                    href={form.getValues("imageUrl")} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    {form.getValues("imageUrl")}
                  </a>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-md">
                  <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                  <p>미리보기가 없습니다.</p>
                  <p className="text-sm mt-2">이미지를 업로드하거나 URL을 입력하세요.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>커뮤니티 설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="커뮤니티에 대한 설명을 입력하세요"
                  className="h-20 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>커뮤니티 타입</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="커뮤니티 타입 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="city">도시</SelectItem>
                    <SelectItem value="village">마을</SelectItem>
                    <SelectItem value="zone">구역</SelectItem>
                    <SelectItem value="personal">개인 공간</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>공개 설정</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="공개 설정 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">공개</SelectItem>
                    <SelectItem value="partial">부분 공개</SelectItem>
                    <SelectItem value="private">비공개</SelectItem>
                    <SelectItem value="timed">시간 제한</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  커뮤니티 접근 권한을 설정합니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>운영자 이름</FormLabel>
                <FormControl>
                  <Input placeholder="운영자 이름을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>초기 상태</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal">일반</SelectItem>
                    <SelectItem value="growing">성장 중</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hasEvent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>이벤트 포함</FormLabel>
                  <FormDescription>
                    특별 이벤트를 개최하는 커뮤니티
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
          
          <FormField
            control={form.control}
            name="hasSosSignal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>SOS 신호</FormLabel>
                  <FormDescription>
                    도움이 필요한 위기 커뮤니티
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
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">커뮤니티 생성</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CommunityCreationForm;
