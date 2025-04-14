
import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Plus, 
  Lock,
  Globe,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

// Mock group data
const MOCK_GROUPS = [
  {
    id: 1,
    name: "피어몰 창업가 모임",
    description: "피어몰을 시작한 분들의 정보 공유 및 네트워킹 그룹입니다.",
    members: 142,
    topics: 37,
    posts: 283,
    isPrivate: false,
    tags: ["창업", "비즈니스", "네트워킹"],
    lastActive: "2025-04-14T09:30:00",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group1"
  },
  {
    id: 2,
    name: "디지털 아트 크리에이터",
    description: "디지털 아트워크 제작 및 판매에 관심있는 크리에이터 모임입니다.",
    members: 98,
    topics: 24,
    posts: 156,
    isPrivate: false,
    tags: ["디지털아트", "NFT", "일러스트레이션"],
    lastActive: "2025-04-13T14:15:00",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group2"
  },
  {
    id: 3,
    name: "한국 수공예품 판매자",
    description: "전통 및 현대 한국 수공예품을 제작하고 판매하는 분들의 그룹입니다.",
    members: 76,
    topics: 18,
    posts: 112,
    isPrivate: true,
    tags: ["수공예", "전통공예", "핸드메이드"],
    lastActive: "2025-04-12T11:45:00",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group3"
  },
  {
    id: 4,
    name: "콘텐츠 마케팅 전략가",
    description: "피어몰에서의 효과적인 콘텐츠 마케팅 전략을 논의하는 그룹입니다.",
    members: 113,
    topics: 29,
    posts: 201,
    isPrivate: false,
    tags: ["마케팅", "콘텐츠", "전략"],
    lastActive: "2025-04-14T08:20:00",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group4"
  },
  {
    id: 5,
    name: "음식 콘텐츠 크리에이터",
    description: "레시피, 요리 비디오 및 음식 관련 콘텐츠를 만드는 크리에이터 그룹입니다.",
    members: 87,
    topics: 22,
    posts: 148,
    isPrivate: false,
    tags: ["음식", "레시피", "요리"],
    lastActive: "2025-04-13T16:05:00",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group5"
  },
];

// Popular tags
const POPULAR_TAGS = [
  "전체",
  "창업",
  "디지털아트",
  "마케팅",
  "수공예",
  "콘텐츠",
  "NFT",
  "비즈니스",
];

const GroupDiscussions = () => {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("전체");
  const [showPrivate, setShowPrivate] = useState(true);
  
  // New group form state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupTags, setNewGroupTags] = useState("");
  const [newGroupPrivate, setNewGroupPrivate] = useState(false);

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupDescription.trim()) {
      toast.error("그룹 이름과 설명을 모두 입력해주세요.");
      return;
    }
    
    const tagsArray = newGroupTags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName,
      description: newGroupDescription,
      members: 1,
      topics: 0,
      posts: 0,
      isPrivate: newGroupPrivate,
      tags: tagsArray.length > 0 ? tagsArray : ["기타"],
      lastActive: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=group${groups.length + 1}`
    };

    setGroups([newGroup, ...groups]);
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupTags("");
    setNewGroupPrivate(false);
    toast.success("그룹이 생성되었습니다!");
  };

  // Filter groups
  const filteredGroups = groups
    .filter(group => 
      (searchQuery === "" || 
       group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       group.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTag === "전체" || group.tags.includes(selectedTag)) &&
      (showPrivate || !group.isPrivate)
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}일 전`;
    if (diffHours > 0) return `${diffHours}시간 전`;
    if (diffMins > 0) return `${diffMins}분 전`;
    return "방금 전";
  };

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <Input
            placeholder="그룹 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            {POPULAR_TAGS.map((tag) => (
              <Button 
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="show-private" 
              checked={showPrivate} 
              onCheckedChange={setShowPrivate} 
            />
            <label htmlFor="show-private" className="text-sm">비공개 그룹 표시</label>
          </div>
        </div>
      </div>
      
      {/* Create new group button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">그룹 토론</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 그룹 만들기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>새 그룹 만들기</DialogTitle>
              <DialogDescription>
                관심사가 비슷한 사람들과 함께할 수 있는 그룹을 만들어보세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="group-name">그룹 이름</label>
                <Input
                  id="group-name"
                  placeholder="그룹 이름"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="group-description">그룹 설명</label>
                <Input
                  id="group-description"
                  placeholder="그룹에 대한 간단한 설명을 적어주세요."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="group-tags">태그 (쉼표로 구분)</label>
                <Input
                  id="group-tags"
                  placeholder="예: 디자인, 마케팅, 창업"
                  value={newGroupTags}
                  onChange={(e) => setNewGroupTags(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="group-private" 
                  checked={newGroupPrivate} 
                  onCheckedChange={setNewGroupPrivate} 
                />
                <label htmlFor="group-private">비공개 그룹으로 설정</label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateGroup}>그룹 생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Group cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 overflow-hidden">
                  <CardTitle className="flex items-center gap-2">
                    <span className="truncate">{group.name}</span>
                    {group.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription className="line-clamp-2">{group.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-0">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{group.members.toLocaleString()}명</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-xs">최근활동 {timeAgo(group.lastActive)}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  참여하기
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
            검색 조건에 맞는 그룹이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDiscussions;
