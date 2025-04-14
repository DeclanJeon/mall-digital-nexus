
import React from 'react';
import { ArrowRight, Award, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PeermallAboutProps {
  peermall: any;
}

const PeermallAbout: React.FC<PeermallAboutProps> = ({ peermall }) => {
  // Sample values - in a real app these would come from the peermall data
  const values = [
    {
      icon: <Award className="h-8 w-8 text-accent-200" />,
      title: '최고의 품질',
      description: '우리는 품질에 대해 타협하지 않습니다. 모든 제품은 최고의 재료와 장인 기술로 제작됩니다.'
    },
    {
      icon: <Shield className="h-8 w-8 text-accent-200" />,
      title: '신뢰와 정직',
      description: '고객의 신뢰를 가장 중요하게 생각합니다. 모든 제품과 서비스는 정직함을 바탕으로 제공됩니다.'
    },
    {
      icon: <Check className="h-8 w-8 text-accent-200" />,
      title: '고객 만족',
      description: '고객이 만족할 때까지 끝까지 책임지는 서비스를 제공합니다. 고객의 행복이 우리의 성공입니다.'
    }
  ];
  
  // Sample history - in a real app these would come from the peermall data
  const history = [
    { year: '2015', event: '럭셔리 리빙 설립' },
    { year: '2017', event: '첫 플래그십 스토어 오픈' },
    { year: '2019', event: '디자인 어워드 수상' },
    { year: '2021', event: '국내 10개 도시로 확장' },
    { year: '2023', event: '온라인 플랫폼 리뉴얼' },
    { year: '2025', event: '아시아 시장 진출' }
  ];

  return (
    <div>
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">브랜드 소개</h2>
        <p className="text-lg text-text-200 max-w-3xl mx-auto">
          {peermall.subtitle}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 className="text-2xl font-bold mb-4">스토리</h3>
          <p className="text-text-200 mb-6 leading-relaxed">
            {peermall.longDescription}
          </p>
          <Button 
            className="bg-accent-200 hover:bg-accent-100 text-white"
          >
            자세히 알아보기
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000" 
            alt="About Us" 
            className="w-full h-80 object-cover"
          />
        </div>
      </div>
      
      <div className="bg-bg-100 p-12 rounded-lg mb-20">
        <h3 className="text-2xl font-bold mb-8 text-center">우리의 가치</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                {value.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{value.title}</h4>
              <p className="text-text-200">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-20">
        <h3 className="text-2xl font-bold mb-8 text-center">브랜드 히스토리</h3>
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
          
          <div className="relative space-y-8">
            {history.map((item, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
                <div className="flex-1 md:text-right p-6">
                  <div className={i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}>
                    <h4 className="text-xl font-bold text-accent-200">{item.year}</h4>
                    <p className="text-text-200">{item.event}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent-200 border-4 border-white"></div>
                <div className="flex-1 p-6">
                  <div className={i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-primary-300 text-white p-12 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4">함께 작업하고 싶으신가요?</h3>
        <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
          귀하의 비전을 현실로 만들기 위해 함께 협력하고 싶습니다. 지금 바로 연락주세요.
        </p>
        <Button 
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-primary-300"
        >
          문의하기 <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PeermallAbout;
