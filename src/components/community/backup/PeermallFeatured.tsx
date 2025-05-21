
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PeermallFeaturedProps {
  peermall: any;
}

const PeermallFeatured: React.FC<PeermallFeaturedProps> = ({ peermall }) => {
  return (
    <section className="py-20 bg-bg-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">특별 컬렉션</h2>
          <p className="text-lg text-text-200 max-w-3xl mx-auto">
            {peermall.subtitle}를 위한 엄선된 특별 컬렉션을 만나보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {peermall.featured.map((item, index) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 mb-4">{item.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary-300"
                >
                  더 알아보기
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="link" 
            className="text-accent-200 hover:text-accent-100 text-lg font-medium flex items-center mx-auto"
          >
            모든 컬렉션 보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PeermallFeatured;
