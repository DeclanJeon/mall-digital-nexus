
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart2, Book, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InfoHub = () => {
  return (
    <section className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-primary-300">통합 정보 허브</h2>
        <p className="text-sm text-gray-500">제품, 콘텐츠, 지식의 통합적인 시각화</p>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="lifecycle">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="lifecycle" className="data-[state=active]:bg-primary-300">제품 생애주기</TabsTrigger>
            <TabsTrigger value="visualization" className="data-[state=active]:bg-primary-300">정보 깊이</TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary-300">사례 갤러리</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lifecycle">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-medium mb-1">기획</h3>
                  <p className="text-xs text-gray-600">제품 아이디어와 기획</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <BarChart2 className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-medium mb-1">개발</h3>
                  <p className="text-xs text-gray-600">제품 제작 및 생산</p>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Book className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-medium mb-1">유통</h3>
                  <p className="text-xs text-gray-600">제품 판매 및 배포</p>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <ArrowRight className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="font-medium mb-1">피드백</h3>
                  <p className="text-xs text-gray-600">고객 반응 및 리뷰</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-center text-gray-600">
                피어몰은 제품의 기획부터 피드백까지 전 과정을 투명하게 공개하여 소비자와 생산자 간의 신뢰를 구축합니다.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="visualization">
            <div className="bg-gray-50 p-6 rounded-lg mb-4 flex flex-col items-center">
              <div className="w-full max-w-md h-[200px] bg-white rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col">
                  <div className="h-1/3 bg-blue-100 p-3 flex items-center">
                    <span className="text-sm font-medium">표면 정보</span>
                  </div>
                  <div className="h-1/3 bg-blue-200 p-3 flex items-center">
                    <span className="text-sm font-medium">심층 정보</span>
                  </div>
                  <div className="h-1/3 bg-blue-300 p-3 flex items-center">
                    <span className="text-sm font-medium">전문가 분석</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-gray-600 mb-4">
                피어몰의 정보는 여러 레이어로 구성되어 있어 사용자가 필요에 따라 깊이 있는 정보에 접근할 수 있습니다.
              </p>
              <Button variant="outline" className="w-full max-w-xs">
                정보 깊이 탐색하기
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                  <img 
                    src={`https://picsum.photos/300/300?random=${i}`}
                    alt={`사례 이미지 ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <span className="text-white text-xs p-2">사례 #{i}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              모든 사례 보기
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default InfoHub;
