
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bookmark, MessageCircle, // Store, ShoppingCart, Zap - 기존 아이콘 대신 추가
        Store, ShoppingCart, Zap } from 'lucide-react'; // 예시: lucide-react 라이브러리 사용 가정


const ServiceCardsSection = () => {
  const services = [
    {
      // icon: <Store className="w-12 h-12 text-primary-300" />, // 기존 아이콘
      icon: <Users className="w-12 h-12 text-primary-300" />, // 변경된 아이콘: Users
      title: '피어 스퀘어',
      description: '지금 바로 피어 스퀘어에 참여하여 당신의 목소리를 내고, 다른 피어들의 이야기에 귀 기울여 보세요! 함께 만들어가는 활기찬 피어몰 커뮤니티가 당신을 기다립니다!',
      buttonText: '함께하기',
      buttonLink: '/community', // 링크는 실제 커뮤니티 페이지로 변경하는 것이 좋습니다.
      iconBgColor: 'bg-blue-100',
      buttonVariant: 'outline'
    },
    {
      // icon: <ShoppingCart className="w-12 h-12 text-yellow-500" />, // 기존 아이콘
      icon: <Bookmark className="w-12 h-12 text-yellow-500" />, // 변경된 아이콘: Bookmark
      title: '나만의 바로가기 허브', // 또는 '큐레이션 링크'
      description: '흩어져 있던 북마크와 즐겨찾기를 한곳에 모아 나만의 디지털 지도처럼 활용하세요. 원하는 곳으로 빠르게 이동할 수 있습니다.',
      buttonText: '시작하기',
      buttonLink: '/curation-link', // 링크는 실제 기능 페이지로 변경하는 것이 좋습니다.
      iconBgColor: 'bg-yellow-100',
      buttonVariant: 'outline'
    },
    {
      // icon: <Zap className="w-12 h-12 text-green-500" />, // 기존 아이콘
      icon: <MessageCircle className="w-12 h-12 text-green-500" />, // 변경된 아이콘: MessageCircle
      title: '피어와 장벽 없이, 바로 톡! 하세요.', // 또는 '피어 넘버'
      description: '궁금한 피어, 협업하고 싶은 동료에게 피어 넘버로 직접 1:1 통신을 하세요 이메일 주소나 복잡한 절차 없이, 즉시 연결되는 다이렉트 소통을 경험할 수 있습니다.',
      buttonText: '피어넘버 확인하기', // '발급받기' 보다는 '확인하기'가 더 적절할 수 있습니다.
      buttonLink: '/peer-number', // 링크는 실제 기능 페이지로 변경하는 것이 좋습니다.
      iconBgColor: 'bg-green-100',
      buttonVariant: 'default'
    }
  ];

  return (
    <section className="py-16 bg-bg-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">피어몰에서 당신의 세상을 넓히세요!</h2>
          <p className="text-text-200 max-w-3xl mx-auto">
            당신의 세상을 더 체계적으로 관리하고, 피어들과 의미 있는 가치를 나누는 즐거움을 경험할 수 있습니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className={`${service.iconBgColor} p-4 rounded-full mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-text-200 mb-6">{service.description}</p>
                <Button 
                  variant={service.buttonVariant === 'default' ? "default" : "outline"} 
                  className={`w-full ${service.buttonVariant === 'default' ? 'bg-accent-100 hover:bg-accent-200' : ''}`}
                  asChild
                >
                  <a href={service.buttonLink}>{service.buttonText}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCardsSection;
