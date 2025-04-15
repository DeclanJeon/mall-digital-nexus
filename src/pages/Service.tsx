
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  QrCode, Smartphone, Mail, Link2, Layers, Users, Bookmark, Phone,
  MapPin, ShoppingBag, Gift, Compass, GraduationCap, Users2, ShoppingCart,
  Shield, Bot, Palette, Ticket, HandshakeIcon, Award, Globe, Lock
} from 'lucide-react';

const ServicePage = () => {
  const serviceCategories = [
    {
      name: "핵심 서비스",
      services: [
        {
          icon: <Layers className="h-8 w-8 text-primary-300" />,
          title: '피어몰(나만의 홈페이지)',
          description: '자신만의 특별한 온라인 공간을 만들고 꾸며보세요. 블로그, 포트폴리오, 상점 등 다양한 용도로 활용할 수 있는 맞춤형 웹사이트입니다.',
        },
        {
          icon: <Users className="h-8 w-8 text-primary-300" />,
          title: '피어 스퀘어(커뮤니티)',
          description: '같은 관심사를 가진 사람들과 소통하고 정보를 나눌 수 있는 커뮤니티 공간입니다. 그룹 채팅, 포럼, 이벤트 등을 통해 새로운 인연을 만들어보세요.',
        },
        {
          icon: <Bookmark className="h-8 w-8 text-primary-300" />,
          title: '피어허브(즐겨찾기)',
          description: '자주 방문하는 사이트, 콘텐츠, 피어몰을 한곳에 모아 효율적으로 관리하세요. 카테고리별 정리와 검색 기능으로 빠르게 찾을 수 있습니다.',
        },
        {
          icon: <Phone className="h-8 w-8 text-primary-300" />,
          title: '피어넘버(나만의 번호)',
          description: '개인 전화번호 대신 사용할 수 있는 가상 번호로, 프라이버시를 보호하면서도 원활한 소통이 가능합니다. 언제든지 변경하거나 관리할 수 있어요.',
        }
      ]
    },
    {
      name: "QR 서비스",
      services: [
        {
          icon: <QrCode className="h-8 w-8 text-accent-100" />,
          title: '멀티QR(통합 정보)',
          description: '하나의 QR 코드에 여러 정보(연락처, 소셜미디어, 웹사이트 등)를 담아 간편하게 공유하세요. 스캔하는 사람의 상황에 맞게 다른 정보를 보여줄 수도 있습니다.',
        },
        {
          icon: <Mail className="h-8 w-8 text-accent-100" />,
          title: '이메일 QR(이메일)',
          description: 'QR 코드를 스캔하면 즉시 이메일 작성 화면이 열리는 서비스입니다. 명함이나 홍보물에 넣어 손쉽게 이메일 연락을 유도할 수 있어요.',
        },
        {
          icon: <Smartphone className="h-8 w-8 text-accent-100" />,
          title: '디지털 명함(연락처)',
          description: '종이 명함 대신 QR 코드 하나로 모든 연락처 정보를 공유하는 친환경 솔루션입니다. 정보가 바뀌어도 실시간으로 업데이트됩니다.',
        },
        {
          icon: <Compass className="h-8 w-8 text-accent-100" />,
          title: '보물찾기 QR 퀘스트',
          description: '특정 장소에 숨겨진 QR코드를 찾아 스캔하면 피어몰에서 특별한 혜택(할인 쿠폰, 아이템 등)을 주는 게임형 이벤트 시스템입니다.',
        }
      ]
    },
    {
      name: "쇼핑 서비스",
      services: [
        {
          icon: <MapPin className="h-8 w-8 text-primary-300" />,
          title: '스토어 지도',
          description: '주변의 피어몰 스토어를 지도에서 쉽게 찾고 방문할 수 있습니다. 카테고리별 필터링과 실시간 정보 업데이트 기능을 제공합니다.',
        },
        {
          icon: <ShoppingBag className="h-8 w-8 text-primary-300" />,
          title: '스마트 장바구니',
          description: '여러 피어몰에서 상품을 담아도 하나의 장바구니에서 관리하고 결제할 수 있는 통합 쇼핑 솔루션입니다.',
        },
        {
          icon: <Gift className="h-8 w-8 text-primary-300" />,
          title: '피어몰 선물 가게',
          description: '친구의 피어몰에 방문해서 응원하는 마음으로 작은 선물을 보내거나, 후원할 수 있는 기능입니다. 창작자와 소상공인을 위한 스폰서/에이전트 기능도 제공합니다.',
        },
        {
          icon: <ShoppingCart className="h-8 w-8 text-primary-300" />,
          title: '스마트 장바구니 추천',
          description: '사용자의 관심사와 행동 패턴을 분석하여 개인화된 상품을 추천해주는 AI 기반 추천 시스템입니다.',
        }
      ]
    },
    {
      name: "커뮤니티 서비스",
      services: [
        {
          icon: <GraduationCap className="h-8 w-8 text-accent-100" />,
          title: '피어몰 지식 공유',
          description: '자신이 잘 아는 분야의 지식이나 노하우를 피어몰에 공유하고, 다른 사람들에게 가르쳐주거나 도움을 줄 수 있는 전문가 네트워크입니다.',
        },
        {
          icon: <Users2 className="h-8 w-8 text-accent-100" />,
          title: '피어몰 협업 스튜디오',
          description: '여러 명의 사용자가 함께 피어몰을 만들고 꾸미거나, 공동 프로젝트를 진행할 수 있는 협업 공간입니다.',
        },
        {
          icon: <Award className="h-8 w-8 text-accent-100" />,
          title: '피어몰 미션 릴레이',
          description: '재미있는 미션을 수행하고 친구를 지목하여 릴레이를 이어가는 소셜 게임입니다. 성공 시 특별한 배지를 획득할 수 있습니다.',
        },
        {
          icon: <Globe className="h-8 w-8 text-accent-100" />,
          title: '피어몰 세계 여행',
          description: '전 세계 사용자들이 만든 피어몰을 구경하고, 다양한 문화와 콘텐츠를 경험할 수 있는 글로벌 네트워크입니다. 자동 번역 기능을 제공합니다.',
        }
      ]
    },
    {
      name: "특별 서비스",
      services: [
        {
          icon: <Shield className="h-8 w-8 text-primary-300" />,
          title: '피어몰 안심 인증서',
          description: '블록체인 기술을 활용하여 디지털 콘텐츠나 상품의 진위를 증명하는 인증 시스템입니다. 신뢰할 수 있는 정보와 거래를 보장합니다.',
        },
        {
          icon: <Bot className="h-8 w-8 text-primary-300" />,
          title: 'AI 똑똑 비서',
          description: '피어몰 제작과 관리를 도와주는 AI 비서입니다. 콘텐츠 추천, 문구 작성, 정보 요약 등 다양한 작업을 지원합니다.',
        },
        {
          icon: <Palette className="h-8 w-8 text-primary-300" />,
          title: '피어몰 디자인 마켓',
          description: '자신이 디자인한 피어몰 템플릿이나 스킨을 판매하거나 공유할 수 있는 마켓플레이스입니다. 창작자들의 수익 창출을 지원합니다.',
        },
        {
          icon: <Ticket className="h-8 w-8 text-primary-300" />,
          title: '우리 동네 행사 알리미',
          description: '지역 기반의 소규모 행사를 등록하고 홍보할 수 있는 플랫폼입니다. QR코드로 참가 신청과 모바일 티켓 발급이 가능합니다.',
        },
        {
          icon: <HandshakeIcon className="h-8 w-8 text-primary-300" />,
          title: '재능 바꾸기 장터',
          description: '화폐 대신 개인의 재능과 기술을 교환할 수 있는 대안적 거래 플랫폼입니다. 다양한 재능을 공유하고 새로운 것을 배울 수 있습니다.',
        },
        {
          icon: <Lock className="h-8 w-8 text-primary-300" />,
          title: '나만의 비밀 일기장/금고',
          description: 'P2P 암호화 기술로 보호되는 개인 전용 디지털 공간입니다. 중요한 파일이나 개인적인 기록을 안전하게 보관할 수 있습니다.',
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-100 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-100 to-white py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRjVGN0ZBIiBkPSJNMCAwaDEyMDB2NTMzSDB6Ii8+PHBhdGggZD0iTTAgMGwxMjAwIDUzMkgweiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=')] bg-cover bg-center opacity-30"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-100 filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-200 filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-300 font-montserrat">
              피어몰의 혁신적인 서비스
            </h1>
            <p className="text-lg md:text-xl text-text-200 mb-8 font-opensans">
              디지털 세상에서 더 나은 연결과 경험을 위한 다양한 서비스를 만나보세요.
              피어몰은 온라인과 오프라인의 경계를 허물고 모두에게 새로운 가능성을 제공합니다.
            </p>
            <Button size="lg" className="bg-accent-100 hover:bg-accent-200 text-white font-medium px-8">
              서비스 시작하기
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="핵심 서비스" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-bg-200 p-1 rounded-full h-auto flex-wrap justify-center">
              {serviceCategories.map((category) => (
                <TabsTrigger 
                  key={category.name} 
                  value={category.name}
                  className="px-4 py-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-accent-200 transition-all"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {serviceCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-0 animate-enter">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {category.services.map((service, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-100/30 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>
                    
                    <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                      <div className="p-3 rounded-lg bg-bg-100 group-hover:bg-primary-100 transition-colors">
                        {service.icon}
                      </div>
                      <CardTitle className="text-xl font-semibold text-primary-300">{service.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <p className="text-text-200 mb-4">{service.description}</p>
                      <Button variant="outline" className="w-full border-primary-200 hover:bg-primary-100 hover:text-primary-300 transition-colors">
                        자세히 보기
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Feature Highlight */}
      <section className="bg-bg-200 py-16 my-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="bg-white p-4 rounded-xl shadow-lg transform rotate-1 relative">
                <div className="absolute inset-0 bg-accent-100/10 rounded-xl transform -rotate-2 z-0"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="피어몰 서비스 미리보기" 
                  className="w-full h-auto rounded-lg z-10 relative"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6 text-primary-300">
                당신의 디지털 라이프를<br />더 스마트하게
              </h2>
              <p className="text-lg text-text-200 mb-6">
                피어몰은 단순한 웹사이트 제작 도구가 아닙니다. QR 코드, 커뮤니티, 쇼핑, AI 기능이 통합된 올인원 디지털 생태계로, 
                온라인과 오프라인의 경계를 허물고 더 풍부한 연결 경험을 제공합니다.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: '직관적인 사용성', desc: '복잡한 기술 지식 없이도 누구나 쉽게 사용할 수 있습니다.' },
                  { title: '강력한 보안', desc: '블록체인과 P2P 암호화로 개인 정보와 콘텐츠를 안전하게 보호합니다.' },
                  { title: '지속적인 혁신', desc: '새로운 기능과 서비스가 정기적으로 업데이트됩니다.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="p-1 bg-accent-100 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-300">{item.title}</h4>
                      <p className="text-text-200">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-accent-200 to-primary-300 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white">
              지금 바로 피어몰과 함께 시작하세요
            </h2>
            <p className="text-white/90 text-lg mb-8">
              더 나은 디지털 경험을 위한 첫걸음, 피어몰이 함께합니다.<br />
              여러분만의 특별한 온라인 공간을 만들어보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-white text-accent-200 hover:bg-bg-100">
                무료로 시작하기
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                서비스 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
