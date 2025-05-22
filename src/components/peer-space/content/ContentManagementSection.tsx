import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader 
} from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  ExternalLink, 
  Pencil, 
  Trash,
  Grid,
  LayoutGrid,
  Star,
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link } from 'react-router-dom';
import { Content } from '../types';

interface ContentItem extends Content {
  id: string;
  peerSpaceAddress: string;
  title: string;
  description: string;
  type: string;
  date: string;
  status?: 'published' | 'draft';
  views: number;
  likes: number;
  comments: number;
  saves: number;
}

const contentTypes = [
  { id: "article", name: "아티클", count: 12 },
  { id: "video", name: "비디오", count: 5 },
  { id: "course", name: "강의", count: 3 },
  { id: "ebook", name: "E-Book", count: 2 },
];

const initialContentItems: ContentItem[] = [
  {
    id: "content-1",
    peerSpaceAddress: "peer-space-address",
    title: "프로그래밍 기초 가이드",
    description: "프로그래밍 기본 개념을 배우기 위한 가이드",
    type: "article",
    date: "2025-04-10",
    status: "published",
    views: 432,
    likes: 28,
    comments: 0,
    saves: 0
  },
  {
    id: "content-2",
    peerSpaceAddress: "peer-space-address",
    title: "데이터 분석 시작하기",
    description: "데이터 분석의 기초를 소개하는 강의",
    type: "course",
    date: "2025-04-05",
    status: "published",
    views: 215,
    likes: 19,
    comments: 0,
    saves: 0
  },
  {
    id: "content-3",
    peerSpaceAddress: "peer-space-address",
    title: "UI/UX 디자인 원칙",
    description: "효율적인 UI/UX 디자인을 위한 기본 원칙",
    type: "video",
    date: "2025-04-01",
    status: "draft",
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0
  }
];

interface ContentManagementSectionProps {
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onContentEdit?: (content: ContentItem) => void;
  onContentDelete?: (contentId: string) => void;
}

const ContentManagementSection: React.FC<ContentManagementSectionProps> = ({
  viewMode = 'grid',
  onViewModeChange,
  onContentEdit,
  onContentDelete
}) => {
  const [contentItems, setContentItems] = useState(initialContentItems);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Card className="p-6 bg-white/70">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-primary-300 mr-2" />
          <h2 className="text-lg font-bold text-primary-300">콘텐츠 관리</h2>
        </div>
        <Button size="sm" variant="default">
          <Plus className="w-4 h-4 mr-1" />
          새 콘텐츠 추가
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 좌측 사이드바 - 콘텐츠 타입 및 필터 */}
        <div className="md:w-64 space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">콘텐츠 타입</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm p-2 bg-primary-100/30 rounded">
                <span>전체</span>
                <span className="bg-primary-300 text-white px-2 rounded-full text-xs">
                  {contentTypes.reduce((acc, type) => acc + type.count, 0)}
                </span>
              </div>
              {contentTypes.map(type => (
                <div key={type.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <span>{type.name}</span>
                  <span className="bg-gray-200 px-2 rounded-full text-xs">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">상태</h3>
            <div className="space-y-1">
              <div className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>발행됨</span>
              </div>
              <div className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>초안</span>
              </div>
              <div className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>보관됨</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 우측 메인 콘텐츠 영역 */}
        <div className="flex-1">
          {/* 검색 및 정렬 영역 */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="콘텐츠 검색..." 
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                필터
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-1" />
                정렬
              </Button>
            </div>
          </div>
          
          {/* 콘텐츠 목록 테이블 */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium">제목</th>
                  <th className="text-left p-3 text-sm font-medium">타입</th>
                  <th className="text-left p-3 text-sm font-medium">생성일</th>
                  <th className="text-left p-3 text-sm font-medium">상태</th>
                  <th className="text-left p-3 text-sm font-medium">조회수</th>
                  <th className="text-left p-3 text-sm font-medium">좋아요</th>
                  <th className="text-left p-3 text-sm font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {contentItems.map(content => (
                  <tr key={content.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{content.title}</td>
                    <td className="p-3">{content.type}</td>
                    <td className="p-3">{content.date}</td>
                    <td className="p-3">
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                        {content.status === 'published' ? '발행됨' : '초안'}
                      </Badge>
                    </td>
                    <td className="p-3">{content.views}</td>
                    <td className="p-3">{content.likes}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onContentEdit?.(content)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onContentDelete?.(content.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentManagementSection;
