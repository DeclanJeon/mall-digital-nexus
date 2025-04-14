
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-300 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4">
              <span className="text-accent-100">Peer</span>mall
            </h2>
            <p className="text-sm text-gray-300 mb-4">
              'Peer'(귀족, 동료)와 'Mall'(쇼핑 장소)의 합성어로, 귀한 고객들이 품격 있게 사거나 팔 수 있는 사이트입니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent-100 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent-100 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent-100 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent-100 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">페이지</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-accent-100 transition-colors">홈</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">소개</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">서비스</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">커뮤니티</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">고객센터</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-accent-100 transition-colors">피어몰 생성</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">QR 코드 시스템</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">디지털 명함</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">전화등록부</a></li>
              <li><a href="#" className="hover:text-accent-100 transition-colors">이메일 QR</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">뉴스레터 구독</h3>
            <p className="text-sm text-gray-300 mb-4">최신 업데이트와 소식을 받아보세요.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="이메일 주소"
                className="py-2 px-3 text-text-100 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent-100 flex-1"
              />
              <button className="bg-accent-100 hover:bg-accent-200 py-2 px-3 rounded-r-md transition-colors">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2025 Peermall. 모든 권리 보유.</p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-accent-100 transition-colors">이용약관</a>
              <a href="#" className="hover:text-accent-100 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-accent-100 transition-colors">사이트맵</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
