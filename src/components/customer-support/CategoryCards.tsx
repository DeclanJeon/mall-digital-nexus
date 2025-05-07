
import React from 'react';
import { User, Store, Headphones, Bell, Star, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, icon, link }) => {
  return (
    <Link 
      to={link}
      className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-5 transition-all hover:shadow-md hover:bg-[#f5f4f1]"
    >
      <div className="mb-4 h-12 w-12 rounded-full bg-[#d4eaf7] flex items-center justify-center text-[#00668c]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[#3b3c3d]">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
};

const CategoryCards = () => {
  const categories = [
    {
      title: '계정 관리',
      description: '로그인, 회원정보, 보안 설정에 대한 도움말',
      icon: <User className="h-6 w-6" />,
      link: '#accounts'
    },
    {
      title: '피어몰 운영',
      description: '피어몰 설정, 상품 관리, 운영 팁',
      icon: <Store className="h-6 w-6" />,
      link: '#mall-operation'
    },
    {
      title: 'TIE/VI 이용',
      description: '실시간 지원 서비스 이용 방법',
      icon: <Headphones className="h-6 w-6" />,
      link: '#tie-support'
    },
    {
      title: '광고 센터',
      description: '광고 등록, 관리, 성과 분석',
      icon: <Bell className="h-6 w-6" />,
      link: '#ads'
    },
    {
      title: 'QR코드 활용',
      description: 'QR코드 생성 및 활용 방법',
      icon: <Star className="h-6 w-6" />,
      link: '#qr-codes'
    },
    {
      title: '결제/환불',
      description: '결제 수단, 환불 절차, 정산 관련 안내',
      icon: <Mail className="h-6 w-6" />,
      link: '#payment'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">무엇을 도와드릴까요?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
            icon={category.icon}
            link={category.link}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
