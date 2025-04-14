
import React from 'react';
import { QrCode, Smartphone, Mail, Users, Link } from 'lucide-react';

const QRFeature = () => {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8 text-accent-100" />,
      title: '간편하고 스마트한 공유',
      description: '스터디 자료, 프로젝트 관련 사이트, 추천 피어몰 목록, 관심 기사 모음 등… 여러 링크를 하나하나 보낼 필요 없이, 생성된 QR코드나 페이지 링크 하나로 손쉽게 공유하세요.'
    },
    {
      icon: <Users className="h-8 w-8 text-accent-100" />,
      title: '온/오프라인 경험 연결',
      description: '명함, 포스터, 발표 자료, 상품 패키지 등에 큐레이션 링크 QR코드를 넣어보세요. 오프라인에서의 만남을 풍부한 온라인 정보와 경험으로 자연스럽게 연결할 수 있습니다.'
    },
    {
      icon: <Mail className="h-8 w-8 text-accent-100" />,
      title: '가치 있는 정보 큐레이터',
      description: '여러분의 안목으로 선별한 유용한 링크 컬렉션을 만들어 피어들에게 공유해보세요. 신뢰할 수 있는 정보와 가치를 나누는 멋진 큐레이터가 될 수 있습니다.'
    },
    {
      icon: <QrCode className="h-8 w-8 text-accent-100" />,
      title: '나만의 바로가기 허브',
      description: '흩어져 있던 북마크와 즐겨찾기를 한곳에 모아 나만의 디지털 지도처럼 활용하세요. 원하는 곳으로 빠르게 이동할 수 있습니다.'
    },
    
  ];

  return (
    <section className="bg-bg-200 py-12 my-8 rounded-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center mb-10">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-primary-300 mb-4">하나의 링크로 연결되는<br />스마트한 생활</h2>
            <p className="text-text-200 mb-6">피어몰의 큐레이션 링크 시스템으로 가상세계와 현실세계를 연결 하세요.</p>
            <button className="btn-accent flex items-center">
              <Link className="h-5 w-5 mr-2" />
              서비스 시작하기
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
