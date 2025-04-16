
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'swiper/css';
import 'swiper/css/navigation';

const TrendingSlider = () => {
  const trendingItems = [
    {
      id: 1,
      title: '이번 주 인기 제품',
      description: '소비자들이 가장 많이 찾은 제품을 만나보세요',
      imageUrl: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80',
      link: '#'
    },
    {
      id: 2,
      title: '실시간 인기 콘텐츠',
      description: '지금 가장 활발하게 논의되고 있는 콘텐츠',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80',
      link: '#'
    },
    {
      id: 3,
      title: '주목할 만한 피어몰',
      description: '독특한 아이템과 콘텐츠로 주목받는 피어몰',
      imageUrl: 'https://images.unsplash.com/photo-1628527304948-06172200406c?auto=format&fit=crop&q=80',
      link: '#'
    },
    {
      id: 4,
      title: '새로운 트렌드',
      description: '커뮤니티에서 떠오르는 새로운 트렌드',
      imageUrl: 'https://images.unsplash.com/photo-1573511860302-28c524319d2a?auto=format&fit=crop&q=80',
      link: '#'
    },
  ];

  return (
    <section className="mb-10 bg-white rounded-xl overflow-hidden shadow-md">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-primary-300">실시간 인기 콘텐츠</h2>
      </div>
      
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={0}
        slidesPerView={1}
        className="trending-slider"
      >
        {trendingItems.map(item => (
          <SwiperSlide key={item.id}>
            <div className="relative h-[300px]">
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70" />
              </div>
              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                <p className="text-lg mb-4">{item.description}</p>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary-300 w-fit"
                >
                  자세히 보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TrendingSlider;
