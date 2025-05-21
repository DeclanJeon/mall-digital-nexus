
import React from 'react';
import { X } from 'lucide-react';

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-peermall-blue text-white p-5 rounded-2xl mb-6 relative animate-fade-in">
      <button 
        className="absolute top-3 right-3 hover:bg-peermall-dark-blue/20 p-1 rounded-full transition-colors"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">자신만의 피어몰을 시작하세요</h2>
          <p className="mb-4 opacity-90">I govern, You govern, We govern - 피어몰에서는 당신이 주체입니다.</p>
          <div className="flex gap-3">
            <button className="bg-white text-peermall-blue font-medium px-5 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              스페이스 생성
            </button>
            <button className="border border-white px-5 py-2 rounded-lg hover:bg-peermall-dark-blue/30 transition-colors">
              더 알아보기
            </button>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="relative w-48 h-48">
            <img 
              src="https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=300&auto=format&fit=crop"
              alt="VR Headset" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
