import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface HeroSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  subtitle: string;
  buttonText: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  badges: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides, badges }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="relative mb-8 rounded-xl overflow-hidden h-[400px] shadow-lg">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto h-full flex flex-col justify-center px-8">
            <div className="max-w-lg">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs uppercase">
                {slide.subtitle}
              </span>
              <h1 className="text-4xl font-bold text-white mt-4 mb-3">{slide.title}</h1>
              <p className="text-white/80 mb-6 text-lg">{slide.description}</p>
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-5 right-5 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      
      <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 max-w-[200px]">
        {badges.map((badge, i) => (
          <Badge key={i} className="bg-white/90 text-blue-800 shadow-sm">
            {badge}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
