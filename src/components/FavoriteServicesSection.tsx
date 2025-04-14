import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddServiceModal from './AddServiceModal'; // 모달 컴포넌트 임포트

// Swiper 스타일 임포트
import 'swiper/css';
import 'swiper/css/navigation'; // 필요하다면 네비게이션 스타일 추가

// TODO: 실제 서비스 데이터 타입 정의
interface FavoriteService {
  id: number;
  name: string;
  link: string; // 서비스 링크 추가
  iconUrl?: string; // 서비스 아이콘 URL (옵션)
}

const FavoriteServicesSection: React.FC = () => {
  const [services, setServices] = useState<FavoriteService[]>([
    
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddService = (name: string, link: string) => {
    const newService: FavoriteService = {
      id: Date.now(), // 임시 ID
      name,
      link,
    };
    setServices([...services, newService]);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">즐겨찾는 서비스</h2>
      <Swiper
        spaceBetween={16} // 슬라이드 간 간격
        slidesPerView={'auto'} // 한 번에 보여줄 슬라이드 수 (자동 조절)
        className="favorite-services-swiper"
      >
        {/* 기존 서비스 목록 */}
        {services.map((service) => (
          <SwiperSlide key={service.id} style={{ width: 'auto' }}>
            {/* 서비스를 클릭하면 해당 링크로 이동하도록 a 태그 추가 */}
            <a href={service.link} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="w-40 h-24 flex flex-col items-center justify-center text-center p-2 cursor-grab hover:shadow-md transition-shadow">
                {/* TODO: 서비스 아이콘 표시 */}
                <CardContent className="p-0">
                  <p className="text-sm font-medium">{service.name}</p>
                </CardContent>
              </Card>
            </a>
          </SwiperSlide>
        ))}

        {/* 서비스 추가 버튼 */}
        <SwiperSlide style={{ width: 'auto' }}>
          <Card className="w-40 h-24 flex items-center justify-center border-dashed border-2 hover:border-primary transition-colors">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
              onClick={handleOpenModal} // 모달 열기 함수로 변경
            >
              <Plus className="h-8 w-8 mb-1" />
              <span className="text-xs">서비스 추가</span>
            </Button>
          </Card>
        </SwiperSlide>
      </Swiper>

      {/* 서비스 추가 모달 */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddService={handleAddService}
      />
    </section>
  );
};

export default FavoriteServicesSection;
