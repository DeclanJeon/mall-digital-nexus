
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Search, Plus, MoreHorizontal, Users, MessageSquare, Calendar, Link2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const groupCategories = [
  "디자인",
  "개발",
  "마케팅",
  "창업",
  "투자",
  "인테리어",
  "예술",
  "음악",
  "교육",
  "패션",
  "건강",
  "여행",
];

const groups = [
  {
    id: 1,
    name: "디자인 창업 모임",
    description: "디자인과 창업에 관심있는 사람들의 모임입니다.",
    memberCount: 128,
    postCount: 45,
    lastActive: "어제",
    avatar: "/placeholder.svg",
    categories: ["디자인", "창업"],
  },
  {
    id: 2,
    name: "웹개발 스터디",
    description: "React, Vue, Angular 등 웹개발에 관한 이야기를 나눠요.",
    memberCount: 96,
    postCount: 73,
    lastActive: "2시간 전",
    avatar: "/placeholder.svg",
    categories: ["개발"],
  },
  {
    id: 3,
    name: "아트 커뮤니티",
    description: "다양한 예술 작품과 전시 정보를 공유합니다.",
    memberCount: 215,
    postCount: 112,
    lastActive: "방금 전",
    avatar: "/placeholder.svg",
    categories: ["예술", "디자인"],
  },
  {
    id: 4,
    name: "마케팅 인사이트",
    description: "최신 마케팅 트렌드와 전략에 대해 논의하는 그룹입니다.",
    memberCount: 89,
    postCount: 34,
    lastActive: "3일 전",
    avatar: "/placeholder.svg",
    categories: ["마케팅"],
  },
  {
    id: 5,
    name: "인테리어 디자인 그룹",
    description: "인테리어 디자인 아이디어와 팁을 공유합니다.",
    memberCount: 156,
    postCount: 67,
    lastActive: "1주일 전",
    avatar: "/placeholder.svg",
    categories: ["인테리어", "디자인"],
  },
];

const GroupDiscussions = () => {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGroupPrivacy, setSelectedGroupPrivacy] = useState<boolean | "indeterminate">(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const handleCreateGroup = (data) => {
    console.log("Creating new group:", data);
    toast({
      title: "그룹 생성",
      description: "새로운 그룹이 생성되었습니다: " + data.groupName,
    });
    setShowCreateDialog(false);
    reset();
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category) 
        : [...prev, category]
    );
  };
  
  const filteredGroups = groups.filter(group => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by selected categories
    const matchesCategories = selectedCategories.length === 0 || 
      group.categories.some(category => selectedCategories.includes(category));
      
    return matchesSearch && matchesCategories;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="그룹 검색"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 그룹 만들기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>새로운 그룹 만들기</DialogTitle>
              <DialogDescription>
                관심사가 비슷한 사람들과 함께 이야기를 나눌 수 있는 그룹을 만들어보세요.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateGroup)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="groupName">그룹 이름</Label>
                  <Input
                    id="groupName"
                    placeholder="그룹 이름을 입력하세요"
                    {...register("groupName", { required: true })}
                  />
                  {errors.groupName && (
                    <span className="text-sm text-red-500">그룹 이름을 입력해주세요</span>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">그룹 설명</Label>
                  <Textarea
                    id="description"
                    placeholder="그룹에 대한 설명을 입력하세요"
                    {...register("description", { required: true })}
                  />
                  {errors.description && (
                    <span className="text-sm text-red-500">그룹 설명을 입력해주세요</span>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label>카테고리</Label>
                  <ScrollArea className="h-[100px] border rounded-md p-2">
                    <div className="grid grid-cols-3 gap-2">
                      {groupCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            {...register(`categories.${category}`)} 
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex items-start space-x-3 space-y-0">
                  <Checkbox 
                    id="isPrivate"
                    checked={selectedGroupPrivacy === true}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setSelectedGroupPrivacy(checked);
                      }
                    }}
                    {...register("isPrivate")}
                  />
                  <div className="space-y-1 leading-none">
                    <label
                      htmlFor="isPrivate"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      비공개 그룹
                    </label>
                    <p className="text-sm text-muted-foreground">
                      그룹이 검색에 표시되지 않으며, 초대를 통해서만 가입할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">그룹 만들기</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {groupCategories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategories.includes(category)
                ? "bg-accent-200 text-white"
                : "bg-gray-100 text-text-200 hover:bg-gray-200"
            } transition-colors`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <p className="text-text-200 mt-1">{group.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {group.categories.map((category) => (
                        <span 
                          key={category}
                          className="bg-gray-100 text-xs px-2 py-1 rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-200">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{group.memberCount}명</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>글 {group.postCount}개</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>활동 {group.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <Button>
                      그룹 가입
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Link2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-text-200">검색 결과가 없습니다</p>
            <p className="text-sm text-text-200 mt-1">다른 검색어나 카테고리로 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDiscussions;
