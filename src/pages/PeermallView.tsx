
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PeermallHeader from '@/components/peermall/PeermallHeader';
import PeermallHero from '@/components/peermall/PeermallHero';
import PeermallFeatured from '@/components/peermall/PeermallFeatured';
import PeermallAbout from '@/components/peermall/PeermallAbout';
import PeermallProducts from '@/components/peermall/PeermallProducts';
import PeermallCommunity from '@/components/peermall/PeermallCommunity';
import PeermallContact from '@/components/peermall/PeermallContact';
import PeermallFooter from '@/components/peermall/PeermallFooter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample Peermall data - in a real app this would come from an API
const mockPeermall = {
  id: 'luxury-living',
  title: 'Luxury Living',
  subtitle: 'Premium Home Decor & Lifestyle',
  description: '최고의 디자인과 품질로 럭셔리한 생활을 경험하세요. Luxury Living은 귀하의 공간을 더욱 특별하게 만들어 드립니다.',
  longDescription: '럭셔리 리빙은 2015년에 설립된 프리미엄 라이프스타일 브랜드로, 엄선된 고품질 가구와 인테리어 소품을 제공합니다. 우리는 최고급 소재만을 사용하여 시간이 지나도 변치 않는 아름다움을 선사하며, 모든 제품은 숙련된 장인들에 의해 정교하게 제작됩니다. 럭셔리 리빙과 함께라면 귀하의 공간은 단순한 거주 공간이 아닌, 당신의 품격과 개성을 표현하는 특별한 장소가 될 것입니다.',
  owner: '김태희',
  contactEmail: 'contact@luxuryliving.com',
  contactPhone: '02-1234-5678',
  address: '서울특별시 강남구 청담동 123-45',
  socialLinks: {
    instagram: 'https://instagram.com/luxuryliving',
    facebook: 'https://facebook.com/luxuryliving',
    twitter: 'https://twitter.com/luxuryliving'
  },
  hero: {
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?q=80&w=1000',
    tagline: '당신의 공간을 위한 최고의 선택'
  },
  featured: [
    {
      id: 'featured-1',
      title: '가을 컬렉션',
      description: '따뜻한 분위기의 시즌 한정 컬렉션을 만나보세요',
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000',
      link: '#autumn-collection'
    },
    {
      id: 'featured-2',
      title: '미니멀 라이프',
      description: '심플하고 세련된 디자인으로 미니멀한 생활을 완성하세요',
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000',
      link: '#minimal-life'
    },
    {
      id: 'featured-3',
      title: '스칸디나비안',
      description: '북유럽의 감성을 담은 스칸디나비안 스타일',
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000',
      link: '#scandinavian'
    }
  ],
  products: [
    {
      id: 'product-1',
      name: '모던 소파',
      price: 1890000,
      description: '최고급 이탈리아 가죽으로 제작된 모던 소파',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000',
      category: '가구',
      tags: ['소파', '거실', '인테리어'],
      featured: true,
      bestseller: true
    },
    {
      id: 'product-2',
      name: '대리석 테이블',
      price: 1350000,
      description: '이탈리아 카라라 대리석 커피 테이블',
      imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000',
      category: '가구',
      tags: ['테이블', '대리석', '인테리어'],
      featured: true
    },
    {
      id: 'product-3',
      name: '천연 양모 러그',
      price: 680000,
      description: '뉴질랜드 천연 양모로 제작된 프리미엄 러그',
      imageUrl: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=1000',
      category: '인테리어',
      tags: ['러그', '카펫', '인테리어'],
      featured: false
    },
    {
      id: 'product-4',
      name: '포셀린 화병',
      price: 450000,
      description: '수공예 포셀린 디자이너 화병',
      imageUrl: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000',
      category: '소품',
      tags: ['화병', '도자기', '인테리어'],
      featured: false
    },
    {
      id: 'product-5',
      name: '월넛 책장',
      price: 1250000,
      description: '월넛 원목으로 제작된 고급 책장',
      imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1000',
      category: '가구',
      tags: ['책장', '원목', '인테리어'],
      featured: true
    },
    {
      id: 'product-6',
      name: '조명 세트',
      price: 890000,
      description: '프리미엄 황동 소재의 조명 세트',
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000',
      category: '조명',
      tags: ['조명', '인테리어', '황동'],
      featured: false
    }
  ],
  posts: [
    {
      id: 'post-1',
      title: '가을 인테리어 트렌드',
      excerpt: '2025년 가을, 인테리어 트렌드는 자연스러운 소재와 풍부한 질감, 그리고 따뜻한 색상이 주목받고 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000',
      author: '정서연',
      date: '2025-09-15',
      category: '트렌드'
    },
    {
      id: 'post-2',
      title: '작은 공간 활용법',
      excerpt: '좁은 공간도 스마트한 가구 배치와 효율적인 수납으로 넓고 쾌적하게 활용할 수 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1617104678098-de229db51175?q=80&w=1000',
      author: '김민준',
      date: '2025-08-28',
      category: '인테리어 팁'
    },
    {
      id: 'post-3',
      title: '친환경 소재의 중요성',
      excerpt: '인테리어에서도 지속가능한 소재 선택이 중요해지고 있는 이유와 그 효과에 대해 알아봅니다.',
      imageUrl: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000',
      author: '이지은',
      date: '2025-08-10',
      category: '지속가능성'
    }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      content: '럭셔리 리빙의 제품들은 정말 기대 이상입니다. 특히 소파는 디자인뿐 아니라 앉았을 때의 편안함까지 모두 만족스럽습니다.',
      author: '김지현',
      position: '인테리어 디자이너',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      id: 'testimonial-2',
      content: '고객 서비스가 매우 친절하고 전문적입니다. 제품 상담부터 배송, 설치까지 모두 완벽했습니다.',
      author: '박준호',
      position: '건축가',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 'testimonial-3',
      content: '품질과 디자인 모두 최고급입니다. 가격이 있지만 그만한 가치가 충분히 있는 제품들입니다.',
      author: '이수진',
      position: '패션 디자이너',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ]
};

const PeermallView = () => {
  const { peermallId } = useParams();
  const [activeTab, setActiveTab] = useState("home");
  
  // In a real app, you would fetch the Peermall data using the peermallId
  // For now, we'll just use our mock data
  const peermall = mockPeermall;
  
  return (
    <div className="min-h-screen bg-white">
      <PeermallHeader peermall={peermall} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="container mx-auto px-4 border-b">
          <TabsList className="h-14 bg-transparent">
            <TabsTrigger value="home" className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-accent-200">
              홈
            </TabsTrigger>
            <TabsTrigger value="products" className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-accent-200">
              제품
            </TabsTrigger>
            <TabsTrigger value="community" className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-accent-200">
              커뮤니티
            </TabsTrigger>
            <TabsTrigger value="about" className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-accent-200">
              소개
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-accent-200">
              연락처
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="home" className="mt-0">
          <PeermallHero peermall={peermall} />
          <PeermallFeatured peermall={peermall} />
        </TabsContent>
        
        <TabsContent value="products" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <PeermallProducts peermall={peermall} />
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <PeermallCommunity peermall={peermall} />
          </div>
        </TabsContent>
        
        <TabsContent value="about" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <PeermallAbout peermall={peermall} />
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-0">
          <div className="container mx-auto px-4 py-12">
            <PeermallContact peermall={peermall} />
          </div>
        </TabsContent>
      </Tabs>
      
      <PeermallFooter peermall={peermall} />
    </div>
  );
};

export default PeermallView;
