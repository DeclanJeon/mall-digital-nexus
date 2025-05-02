
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "제목은 2글자 이상이어야 합니다.",
  }),
  content: z.string().min(10, {
    message: "내용은 10글자 이상이어야 합니다.",
  }),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(true),
  date: z.date().optional(),
  priority: z.string().optional(),
  terms: z.boolean().default(false).refine((val) => val === true, {
    message: "이용 약관에 동의해야 합니다.",
  }),
  slider: z.number().min(1).max(100).optional(),
  checkbox: z.array(z.string()).optional(),
  radio: z.string().optional(),
})

const NewCommunity = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState('');
  const [terms, setTerms] = useState(false);
  const [slider, setSlider] = useState<number>(50);
  const [checkbox, setCheckbox] = useState<string[]>([]);
  const [radio, setRadio] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "제출 완료.",
      description: "성공적으로 제출되었습니다.",
    });
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTagChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleSubmit = () => {
    if (!title || !content) {
      toast({
        title: "필수 항목을 입력해주세요.",
        description: "제목과 내용을 모두 입력해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    const newPost = {
      id: uuidv4(),
      title,
      content,
      imageUrl,
      tags,
      category,
      isPublic,
      date,
      priority,
      terms,
      slider,
      checkbox,
      radio,
    };

    let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]') as any[];
    posts.push(newPost);
    localStorage.setItem('communityPosts', JSON.stringify(posts));

    toast({
      title: "게시글 작성 완료!",
      description: "성공적으로 게시글이 작성되었습니다.",
    });

    navigate('/community');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style>
        {`
        .space-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(135deg, #0c0e17, #1f2d3d);
        }
        `}
      </style>
      <div className="space-background"></div>

      <div className="container mx-auto p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">새 게시글 작성</h1>

        <div className="mb-4">
          <Label htmlFor="title" className="block text-sm font-medium mb-1">제목</Label>
          <Input
            type="text"
            id="title"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={handleTitleChange}
            className="text-black"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="content" className="block text-sm font-medium mb-1">내용</Label>
          <Textarea
            id="content"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={handleContentChange}
            className="text-black"
            rows={8}
          />
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">태그</Label>
          <Input
            placeholder="태그를 입력하세요 (쉼표로 구분)"
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="text-black"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="category" className="block text-sm font-medium mb-1">카테고리</Label>
          <Select onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="공지">공지</SelectItem>
              <SelectItem value="자유">자유</SelectItem>
              <SelectItem value="질문">질문</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-center">
          <Label htmlFor="isPublic" className="mr-2 text-sm font-medium">공개 설정</Label>
          <Switch
            id="isPublic"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="date" className="block text-sm font-medium mb-1">날짜</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal text-black",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : <span>날짜 선택</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-4">
          <Label htmlFor="priority" className="block text-sm font-medium mb-1">우선순위</Label>
          <Select onValueChange={setPriority}>
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="높음">높음</SelectItem>
              <SelectItem value="보통">보통</SelectItem>
              <SelectItem value="낮음">낮음</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-center">
          <Label htmlFor="terms" className="mr-2 text-sm font-medium">이용 약관 동의</Label>
          <Switch
            id="terms"
            checked={terms}
            onCheckedChange={setTerms}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="slider" className="block text-sm font-medium mb-1">슬라이더 값</Label>
          <Slider
            defaultValue={[slider]}
            max={100}
            min={1}
            step={1}
            onValueChange={(value) => setSlider(value[0])}
          />
          <p className="text-sm text-gray-500 mt-1">현재 값: {slider}</p>
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">체크박스</Label>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox1"
                checked={checkbox.includes("옵션 1")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCheckbox([...checkbox, "옵션 1"]);
                  } else {
                    setCheckbox(checkbox.filter((item) => item !== "옵션 1"));
                  }
                }}
              />
              <Label htmlFor="checkbox1">옵션 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox2"
                checked={checkbox.includes("옵션 2")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCheckbox([...checkbox, "옵션 2"]);
                  } else {
                    setCheckbox(checkbox.filter((item) => item !== "옵션 2"));
                  }
                }}
              />
              <Label htmlFor="checkbox2">옵션 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox3"
                checked={checkbox.includes("옵션 3")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCheckbox([...checkbox, "옵션 3"]);
                  } else {
                    setCheckbox(checkbox.filter((item) => item !== "옵션 3"));
                  }
                }}
              />
              <Label htmlFor="checkbox3">옵션 3</Label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">라디오 버튼</Label>
          <RadioGroup defaultValue={radio} onValueChange={setRadio} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="라디오 1" id="radio1" />
              <Label htmlFor="radio1">라디오 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="라디오 2" id="radio2" />
              <Label htmlFor="radio2">라디오 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="라디오 3" id="radio3" />
              <Label htmlFor="radio3">라디오 3</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">이미지 URL</Label>
          <Input
            type="text"
            placeholder="이미지 URL을 입력하세요"
            onChange={(e) => setImageUrl(e.target.value)}
            className="text-black"
          />
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Preview" className="max-h-48 rounded-md" />
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full">게시글 작성</Button>
      </div>
    </div>
  );
};

export default NewCommunity;
