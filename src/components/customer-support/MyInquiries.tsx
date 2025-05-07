import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Inquiry {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'pending' | 'answered' | 'resolved';
  content: string;
  answer?: string;
  answerDate?: string;
  attachments?: string[];
}

const MyInquiries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  // Mock data for inquiries
  const inquiries: Inquiry[] = [
    {
      id: 'INQ-2023-05-01-1234',
      title: '피어몰 상품 등록 오류',
      category: '피어몰 운영',
      date: '2023-05-01',
      status: 'answered',
      content: '상품을 등록하려고 할 때 이미지 업로드 후 오류가 발생합니다. 어떻게 해결할 수 있나요?',
      answer: '안녕하세요, 피어몰을 이용해 주셔서 감사합니다. 이미지 업로드 오류는 파일 크기나 형식에 문제가 있을 수 있습니다. 파일 크기는 10MB 이하, 형식은 JPG, PNG, WEBP만 지원합니다. 또한 일시적인 서버 문제일 수 있으니 잠시 후 다시 시도해 보시기 바랍니다.',
      answerDate: '2023-05-02',
      attachments: ['error_screenshot.png']
    },
    {
      id: 'INQ-2023-04-28-9876',
      title: '결제 승인 지연 문의',
      category: '결제/환불',
      date: '2023-04-28',
      status: 'pending',
      content: '어제 결제를 완료했는데 아직 승인 대기 중으로 표시됩니다. 언제 처리될까요?'
    },
    {
      id: 'INQ-2023-04-15-5432',
      title: '추천인 포인트 미적립',
      category: '계정 관련',
      date: '2023-04-15',
      status: 'resolved',
      content: '친구가 제 추천 코드로 가입했는데 추천 포인트가 적립되지 않았습니다.',
      answer: '안녕하세요, 문의 주셔서 감사합니다. 추천인 포인트는 추천받은 회원이 첫 구매 완료 후 정산됩니다. 확인 결과 추천받으신 회원님이 아직 첫 구매를 완료하지 않으셨습니다. 첫 구매 완료 후 자동으로 포인트가 적립될 예정입니다.',
      answerDate: '2023-04-16'
    },
    {
      id: 'INQ-2023-04-10-3210',
      title: 'QR코드 생성 방법',
      category: 'QR코드 활용',
      date: '2023-04-10',
      status: 'resolved',
      content: '피어몰 제품에 QR코드를 추가하는 방법을 알려주세요.',
      answer: '안녕하세요, 문의 주셔서 감사합니다. 피어몰 제품에 QR코드를 추가하는 방법은 다음과 같습니다:\n\n1. 피어몰 관리자 페이지 접속\n2. 좌측 메뉴에서 "QR코드 관리" 클릭\n3. "새 QR코드 생성" 버튼 클릭\n4. QR코드 유형(제품, 이벤트, 프로모션 등) 선택\n5. 연결할 URL 또는 콘텐츠 입력\n6. 생성 완료 후 다운로드 또는 제품 상세 페이지에 직접 추가\n\n자세한 안내는 첨부된 가이드를 참조해 주세요.',
      answerDate: '2023-04-11',
      attachments: ['qr_code_guide.pdf']
    }
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-[#fff3cd] text-[#856404] border-[#856404]">대기중</Badge>;
      case 'answered':
        return <Badge variant="outline" className="bg-[#d4eaf7] text-[#00668c] border-[#00668c]">답변완료</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-[#d4edda] text-[#28a745] border-[#28a745]">해결됨</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">문의 내역</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="문의 검색"
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </form>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            <span>필터</span>
          </Button>
          <Button variant="outline" className="flex gap-2">
            <Calendar className="h-4 w-4" />
            <span>기간</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4 h-auto bg-[#f5f4f1]">
          <TabsTrigger value="all" className="py-2">
            전체
          </TabsTrigger>
          <TabsTrigger value="pending" className="py-2">
            대기중
          </TabsTrigger>
          <TabsTrigger value="answered" className="py-2">
            답변완료
          </TabsTrigger>
          <TabsTrigger value="resolved" className="py-2">
            해결됨
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="border border-[#cccbc8] rounded-lg p-4 hover:bg-[#f5f4f1] cursor-pointer"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{inquiry.title}</h3>
                  {getStatusBadge(inquiry.status)}
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex gap-3">
                    <span>문의번호: {inquiry.id}</span>
                    <span>유형: {inquiry.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{inquiry.date}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <div className="space-y-4">
            {inquiries.filter(i => i.status === 'pending').map((inquiry) => (
              <div
                key={inquiry.id}
                className="border border-[#cccbc8] rounded-lg p-4 hover:bg-[#f5f4f1] cursor-pointer"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{inquiry.title}</h3>
                  {getStatusBadge(inquiry.status)}
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex gap-3">
                    <span>문의번호: {inquiry.id}</span>
                    <span>유형: {inquiry.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{inquiry.date}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="answered" className="mt-0">
          <div className="space-y-4">
            {inquiries.filter(i => i.status === 'answered').map((inquiry) => (
              <div
                key={inquiry.id}
                className="border border-[#cccbc8] rounded-lg p-4 hover:bg-[#f5f4f1] cursor-pointer"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{inquiry.title}</h3>
                  {getStatusBadge(inquiry.status)}
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex gap-3">
                    <span>문의번호: {inquiry.id}</span>
                    <span>유형: {inquiry.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{inquiry.date}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-0">
          <div className="space-y-4">
            {inquiries.filter(i => i.status === 'resolved').map((inquiry) => (
              <div
                key={inquiry.id}
                className="border border-[#cccbc8] rounded-lg p-4 hover:bg-[#f5f4f1] cursor-pointer"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{inquiry.title}</h3>
                  {getStatusBadge(inquiry.status)}
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex gap-3">
                    <span>문의번호: {inquiry.id}</span>
                    <span>유형: {inquiry.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{inquiry.date}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#cccbc8]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedInquiry.title}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedInquiry(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>문의번호: {selectedInquiry.id}</span>
                <span>{selectedInquiry.date}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">문의 내용</h3>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{selectedInquiry.content}</p>
                
                {selectedInquiry.attachments && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">첨부 파일:</h4>
                    <div className="flex gap-2">
                      {selectedInquiry.attachments.map((file, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm"
                          className="text-[#71c4ef] border-[#71c4ef]"
                        >
                          {file}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedInquiry.answer ? (
                <div className="bg-[#f5f4f1] p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">답변</h3>
                    <span className="text-sm text-gray-500">{selectedInquiry.answerDate}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.answer}</p>
                </div>
              ) : (
                <div className="bg-[#fff3cd] p-4 rounded-lg mb-6 text-[#856404]">
                  <p>아직 답변이 등록되지 않았습니다. 빠른 시일 내에 답변드리겠습니다.</p>
                </div>
              )}
              
              {selectedInquiry.status === 'answered' && (
                <div className="border-t border-[#cccbc8] pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">문제가 해결되었나요?</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-[#28a745] text-[#28a745]">
                        예, 해결되었습니다
                      </Button>
                      <Button variant="outline" className="border-[#dc3545] text-[#dc3545]">
                        아니오, 추가 문의가 필요합니다
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Textarea 
                      placeholder="추가 질문이 있으시면 입력해주세요" 
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button className="bg-[#00668c] hover:bg-[#00668c]/90">
                        추가 질문하기
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedInquiry.status === 'pending' && (
                <Button className="bg-[#dc3545] hover:bg-[#dc3545]/90">
                  문의 취소하기
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInquiries;
