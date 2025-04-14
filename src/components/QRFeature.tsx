
import React from 'react';
import { QrCode, Smartphone, Mail, Users, Link } from 'lucide-react';

const QRFeature = () => {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8 text-accent-100" />,
      title: '디지털 명함',
      description: '연락처와 SNS를 한번에 공유하는 맞춤형 디지털 명함을 생성하세요.'
    },
    {
      icon: <Users className="h-8 w-8 text-accent-100" />,
      title: '전화등록부 시스템',
      description: '스캔으로 연락처를 자동 등록하고 효율적으로 관리하세요.'
    },
    {
      icon: <Mail className="h-8 w-8 text-accent-100" />,
      title: '이메일 서비스',
      description: '스캔하여 즉시 이메일을 작성하고 전송할 수 있습니다.'
    },
    {
      icon: <QrCode className="h-8 w-8 text-accent-100" />,
      title: 'Dynamic Links',
      description: '하나의 코드로 여러 기능을 제공하는 동적 연결 시스템을 활용하세요.'
    }
  ];

  return (
    <section className="bg-bg-200 py-12 my-8 rounded-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center mb-10">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-primary-300 mb-4">하나의 링크로 연결되는<br />스마트한 생활</h2>
            <p className="text-text-200 mb-6">피어몰의 통합 링크 시스템으로 온라인과 오프라인을 연결하고, 번거로운 작업을 간소화하세요.</p>
            <button className="btn-accent flex items-center">
              <Link className="h-5 w-5 mr-2" />
              다이나믹 링크 시작하기
            </button>
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-8">
            <div className="bg-white shadow-lg rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-full -mt-12 -mr-12 opacity-50"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {features.map((feature, index) => (
                  <div key={index} className="bg-bg-100 p-4 rounded-md hover-scale">
                    <div className="mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-200">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRFeature;
