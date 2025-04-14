
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react';

interface PeermallFooterProps {
  peermall: any;
}

const PeermallFooter: React.FC<PeermallFooterProps> = ({ peermall }) => {
  return (
    <footer className="bg-primary-300 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to={`/peermall/${peermall.id}`} className="inline-block mb-6">
              <h3 className="text-2xl font-bold">{peermall.title}</h3>
            </Link>
            <p className="text-gray-300 mb-6">
              {peermall.description}
            </p>
            <div className="flex space-x-4">
              {peermall.socialLinks.facebook && (
                <a href={peermall.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent-100 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {peermall.socialLinks.twitter && (
                <a href={peermall.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent-100 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {peermall.socialLinks.instagram && (
                <a href={peermall.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-100 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">페이지</h4>
            <ul className="space-y-2">
              <li><Link to={`/peermall/${peermall.id}`} className="text-gray-300 hover:text-accent-100 transition-colors">홈</Link></li>
              <li><Link to={`/peermall/${peermall.id}?tab=products`} className="text-gray-300 hover:text-accent-100 transition-colors">제품</Link></li>
              <li><Link to={`/peermall/${peermall.id}?tab=community`} className="text-gray-300 hover:text-accent-100 transition-colors">커뮤니티</Link></li>
              <li><Link to={`/peermall/${peermall.id}?tab=about`} className="text-gray-300 hover:text-accent-100 transition-colors">소개</Link></li>
              <li><Link to={`/peermall/${peermall.id}?tab=contact`} className="text-gray-300 hover:text-accent-100 transition-colors">연락처</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">고객 지원</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-accent-100 transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-100 transition-colors">배송 정보</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-100 transition-colors">교환 및 반품</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-100 transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-100 transition-colors">이용약관</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">연락처</h4>
            <address className="not-italic text-gray-300 mb-4">
              <p>{peermall.address}</p>
              <p className="mt-2">{peermall.contactPhone}</p>
              <p>{peermall.contactEmail}</p>
            </address>
            <h4 className="font-bold text-lg mb-2">뉴스레터</h4>
            <div className="flex">
              <input 
                type="email"
                placeholder="이메일 주소"
                className="bg-primary-300 border border-gray-500 text-white px-4 py-2 rounded-l-md focus:outline-none focus:border-accent-100 flex-1"
              />
              <button className="bg-accent-200 hover:bg-accent-100 px-3 py-2 rounded-r-md transition-colors">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p>&copy; 2025 {peermall.title}. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Powered by <span className="text-accent-100">Peermall</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PeermallFooter;
