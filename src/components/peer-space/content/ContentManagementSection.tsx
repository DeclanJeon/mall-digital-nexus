
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus, Search, Filter, SortAsc, ExternalLink, Tag, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const contentTypes = [
  { id: "article", name: "아티클", count: 12 },
  { id: "video", name: "비디오", count: 5 },
  { id: "course", name: "강의", count: 3 },
  { id: "ebook", name: "E-Book", count: 2 },
];

const contentItems = [
  {
    id: "content-1",
    title: "프로그래밍 기초 가이드",
    type: "article",
    created: "2025-04-10",
    status: "published",
    views: 432,
    likes: 28
  },
  {
    id: "content-2",
    title: "데이터 분석 시작하기",
    type: "course",
    created: "2025-04-05",
    status: "published",
    views: 215,
    likes: 19
  },
  {
    id: "content-3",
    title: "UI/UX 디자인 원칙",
    type: "video",
    created: "2025-04-01",
    status: "draft",
    views: 0,
    likes: 0
  },
];

const ContentManagementSection: React.FC = () => {
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
                <span className="bg-primary-300 text-white px-2 rounded-full text-xs">{contentTypes.reduce((acc, type) => acc + type.count, 0)}</span>
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
                  <th className="text-center p-3 text-sm font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{item.title}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-primary-100/30 rounded-full text-xs">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{item.created}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'published' ? '발행됨' : '초안'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{item.views}</td>
                    <td className="p-3 text-sm">{item.likes}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 페이지네이션 또는 "더 보기" */}
          {contentItems.length > 0 ? (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">3개 항목 중 1-3 표시</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>이전</Button>
                <Button size="sm" variant="outline" disabled>다음</Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              등록된 콘텐츠가 없습니다. '새 콘텐츠 추가' 버튼을 클릭하여 첫 번째 콘텐츠를 만들어보세요.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ContentManagementSection;
