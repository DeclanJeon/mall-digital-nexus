
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PeermallHeroProps {
  peermall: any;
}

const PeermallHero: React.FC<PeermallHeroProps> = ({ peermall }) => {
  return (
    <section className="relative">
      <div className="h-[70vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${peermall.hero.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {peermall.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              {peermall.hero.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-accent-200 hover:bg-accent-100 text-white border-0 rounded-md"
              >
                컬렉션 보기
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-300 rounded-md"
              >
                더 알아보기
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2">프리미엄 품질</h3>
            <p className="text-text-200 mb-4">최고의 장인들이 엄선된 재료로 제작한 제품들</p>
            <Button 
              variant="link" 
              className="text-accent-200 hover:text-accent-100 p-0 flex items-center"
            >
              자세히 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2">맞춤형 디자인</h3>
            <p className="text-text-200 mb-4">당신의 공간에 맞게 커스터마이징 가능한 디자인</p>
            <Button 
              variant="link" 
              className="text-accent-200 hover:text-accent-100 p-0 flex items-center"
            >
              자세히 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2">전문 컨설팅</h3>
            <p className="text-text-200 mb-4">인테리어 전문가의 세심한 컨설팅 서비스 제공</p>
            <Button 
              variant="link" 
              className="text-accent-200 hover:text-accent-100 p-0 flex items-center"
            >
              자세히 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeermallHero;
