
import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface PeermallContactProps {
  peermall: any;
}

const PeermallContact: React.FC<PeermallContactProps> = ({ peermall }) => {
  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">연락처</h2>
        <p className="text-lg text-text-200 max-w-3xl mx-auto">
          질문이나 제안이 있으신가요? 언제든지 연락주세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-accent-100/10 p-4 rounded-full mb-4">
              <Mail className="h-6 w-6 text-accent-200" />
            </div>
            <h3 className="text-lg font-bold mb-2">이메일</h3>
            <p className="text-text-200 mb-2">{peermall.contactEmail}</p>
            <p className="text-sm text-gray-500">24시간 이내 답변드립니다</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-accent-100/10 p-4 rounded-full mb-4">
              <Phone className="h-6 w-6 text-accent-200" />
            </div>
            <h3 className="text-lg font-bold mb-2">전화</h3>
            <p className="text-text-200 mb-2">{peermall.contactPhone}</p>
            <p className="text-sm text-gray-500">월-금: 9AM - 6PM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-accent-100/10 p-4 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-accent-200" />
            </div>
            <h3 className="text-lg font-bold mb-2">주소</h3>
            <p className="text-text-200 mb-2">{peermall.address}</p>
            <p className="text-sm text-gray-500">쇼룸 방문 예약 가능</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <h3 className="text-2xl font-bold mb-6">문의하기</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <Input id="name" placeholder="홍길동" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <Input id="email" type="email" placeholder="example@email.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <Input id="subject" placeholder="문의 제목" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
              <Textarea id="message" placeholder="문의 내용을 입력해주세요" rows={6} />
            </div>
            <Button className="w-full bg-accent-200 hover:bg-accent-100">
              <Send className="h-4 w-4 mr-2" />
              메시지 보내기
            </Button>
          </form>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-6">오시는 길</h3>
          <div className="bg-gray-200 h-80 mb-6 rounded-lg overflow-hidden">
            {/* In a real app, you would integrate with a map API like Google Maps or Mapbox */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <MapPin className="h-16 w-16 text-gray-500" />
              <span className="sr-only">지도</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">영업 시간</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-text-200">
                <span>월요일 - 금요일</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between text-text-200">
                <span>토요일</span>
                <span>10:00 - 17:00</span>
              </div>
              <div className="flex justify-between text-text-200">
                <span>일요일</span>
                <span>휴무</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-bg-100 p-12 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4">뉴스레터 구독하기</h3>
        <p className="text-text-200 mb-6">새로운 제품, 특별 할인, 이벤트 소식을 가장 먼저 받아보세요</p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input placeholder="이메일 주소" className="flex-1" />
          <Button className="bg-accent-200 hover:bg-accent-100 whitespace-nowrap">구독하기</Button>
        </div>
      </div>
    </div>
  );
};

export default PeermallContact;
