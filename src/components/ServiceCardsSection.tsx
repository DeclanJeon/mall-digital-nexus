
import React from 'react';
import { Store, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ServiceCardsSection = () => {
  const services = [
    {
      icon: <Store className="w-12 h-12 text-primary-300" />,
      title: '피어몰 만들기',
      description: '딱 본 안에 나만의 피어몰을 구축하고 온라인 비즈니스를 시작하세요. 쉽고 간편한 설정으로 빠르게 시작할 수 있습니다.',
      buttonText: '피어몰 만들기',
      buttonLink: '/create-peermall',
      iconBgColor: 'bg-blue-100',
      buttonVariant: 'outline'
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-yellow-500" />,
      title: '쇼핑하기',
      description: '수많은 피어몰에서 다양한 제품을 발견하고 쇼핑해보세요. 독특한 아이템부터 일상 필수품까지 모두 만나볼 수 있습니다.',
      buttonText: '쇼핑 시작하기',
      buttonLink: '/shopping',
      iconBgColor: 'bg-yellow-100',
      buttonVariant: 'outline'
    },
    {
      icon: <Zap className="w-12 h-12 text-green-500" />,
      title: 'VIP 혜택',
      description: 'VIP 멤버십에 가입하고 특별한 혜택을 누리세요. 추가 할인, 특별 이벤트 초대, 프리미엄 고객 지원 서비스를 제공합니다.',
      buttonText: 'VIP 가입하기',
      buttonLink: '/vip-membership',
      iconBgColor: 'bg-green-100',
      buttonVariant: 'default'
    }
  ];

  return (
    <section className="py-16 bg-bg-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">피어몰에서 쇼핑을 시작하세요</h2>
          <p className="text-text-200 max-w-3xl mx-auto">
            다양한 판매자들의 피어몰에서 특별한 제품을 발견하거나, 직접 피어몰을 만들어 판매를 시작해보세요.
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
