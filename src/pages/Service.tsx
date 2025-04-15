import React from 'react';
import Header from '@/components/CategoryNav';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Smartphone, Mail, Link2, Layers } from 'lucide-react';

const ServicePage = () => {
  const services = [
    {
      icon: <QrCode className="h-8 w-8 text-primary-300" />,
      title: '디지털 명함 서비스',
      description: '개인/기업용 맞춤형 디지털 명함을 생성하고 QR 코드로 연락처(전화, 이메일, SNS)를 통합하여 공유합니다. 다양한 디자인 템플릿을 제공하며 명함 공유 및 관리 기능을 지원합니다.',
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary-300" />,
      title: '전화등록부 시스템',
      description: 'QR 코드를 스캔하여 연락처를 간편하게 자동 등록하고 그룹별로 관리할 수 있습니다. 이메일 연동을 통해 연락처를 동기화하고, 연락처 기반의 네트워킹 도구를 제공합니다.',
    },
    {
      icon: <Mail className="h-8 w-8 text-primary-300" />,
      title: '이메일 QR 서비스',
      description: '이메일 주소를 담은 QR 코드를 생성하여 스캔 시 즉시 이메일 작성 화면으로 연결합니다. 자주 사용하는 이메일 템플릿 저장 및 발송 기록 관리 기능을 지원합니다.',
    },
    {
      icon: <Link2 className="h-8 w-8 text-primary-300" />,
      title: '피어몰 연결 서비스',
      description: '피어몰 홈페이지 및 상품/콘텐츠별 딥링크 QR 코드를 자동으로 생성합니다. QR 코드 스캔 통계를 분석하고, 오프라인-온라인 연계 마케팅 도구로 활용할 수 있습니다. 다중 링크를 하나의 페이지로 통합하는 큐레이션 링크 기능도 포함됩니다.',
    },
    {
      icon: <Layers className="h-8 w-8 text-primary-300" />,
      title: '멀티 QR 솔루션',
      description: '하나의 QR 코드로 여러 기능을 제공하는 동적 QR 코드 시스템입니다. 사용자 행동 및 상황에 따라 지능적으로 콘텐츠를 노출하며, 실시간 업데이트가 가능합니다.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-bg-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-10 text-primary-300">피어몰 서비스 소개</h1>
          <p className="text-center text-lg text-text-200 mb-12">
            피어몰은 QR 코드를 기반으로 다양한 연결과 편의를 제공하는 혁신적인 서비스들을 제공합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary-300">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-200">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicePage;
