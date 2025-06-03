
import React from "react";
import { Card } from "@/components/ui/card";
import { Package, Plus, Search, Filter, SortAsc, Tag, DollarSign, ShoppingCart, Star, Award, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const productCategories = [
  { id: "digital", name: "디지털 상품", count: 5 },
  { id: "physical", name: "실물 상품", count: 7 },
  { id: "service", name: "서비스", count: 3 },
  { id: "subscription", name: "구독", count: 2 },
];

const products = [
  {
    id: "prod-1",
    name: "프리미엄 코딩 강의",
    category: "digital",
    price: "49,900",
    inventory: "무제한",
    sales: 28,
    rating: 4.8,
    status: "active"
  },
  {
    id: "prod-2",
    name: "개발자 스티커 세트",
    category: "physical",
    price: "12,000",
    inventory: 43,
    sales: 156,
    rating: 4.9,
    status: "active"
  },
  {
    id: "prod-3",
    name: "멘토링 패키지",
    category: "service",
    price: "250,000",
    inventory: "예약제",
    sales: 5,
    rating: 5.0,
    status: "active"
  },
];

const ProductManagementSection: React.FC = () => {
  return (
    <Card className="p-6 bg-white/70">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-primary-300 mr-2" />
          <h2 className="text-lg font-bold text-primary-300">제품 관리</h2>
        </div>
        <Button size="sm" variant="default">
          <Plus className="w-4 h-4 mr-1" />
          새 제품 등록
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 좌측 사이드바 - 제품 카테고리 및 필터 */}
        <div className="md:w-64 space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">제품 카테고리</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm p-2 bg-primary-100/30 rounded">
                <span>전체</span>
                <span className="bg-primary-300 text-white px-2 rounded-full text-xs">{productCategories.reduce((acc, cat) => acc + cat.count, 0)}</span>
              </div>
              {productCategories.map(category => (
                <div key={category.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <span>{category.name}</span>
                  <span className="bg-gray-200 px-2 rounded-full text-xs">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">재고 상태</h3>
            <div className="space-y-1">
              <div className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>재고 있음</span>
              </div>
              <div className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>품절</span>
              </div>
              <div className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>품절 임박</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">가격대</h3>
            <div className="flex items-center gap-2 p-2">
              <input type="text" placeholder="최소" className="border rounded-md p-1 w-1/2 text-sm" />
              <span>~</span>
              <input type="text" placeholder="최대" className="border rounded-md p-1 w-1/2 text-sm" />
            </div>
            <Button size="sm" variant="outline" className="w-full mt-1">적용</Button>
          </div>
        </div>
        
        {/* 우측 메인 제품 영역 */}
        <div className="flex-1">
          {/* 검색 및 정렬 영역 */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="제품 검색..." 
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
          
          {/* 제품 목록 테이블 */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium">제품명</th>
                  <th className="text-left p-3 text-sm font-medium">카테고리</th>
                  <th className="text-left p-3 text-sm font-medium">가격</th>
                  <th className="text-left p-3 text-sm font-medium">재고</th>
                  <th className="text-left p-3 text-sm font-medium">판매량</th>
                  <th className="text-left p-3 text-sm font-medium">평점</th>
                  <th className="text-center p-3 text-sm font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-primary-100/30 rounded-full text-xs">
                        {product.category === 'digital' && '디지털 상품'}
                        {product.category === 'physical' && '실물 상품'}
                        {product.category === 'service' && '서비스'}
                        {product.category === 'subscription' && '구독'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-primary-300" />
                        {product.price}원
                      </div>
                    </td>
                    <td className="p-3">{product.inventory}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <ShoppingCart className="h-3 w-3 mr-1 text-primary-300" />
                        {product.sales}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {product.rating}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Award className="h-4 w-4" />
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
          
          {/* 페이지네이션 */}
          {products.length > 0 ? (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">17개 항목 중 1-3 표시</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>이전</Button>
                <Button size="sm" variant="outline">다음</Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              등록된 제품이 없습니다. '새 제품 등록' 버튼을 클릭하여 첫 번째 제품을 만들어보세요.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductManagementSection;
