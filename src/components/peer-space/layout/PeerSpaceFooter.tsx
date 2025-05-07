
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { PeerMallConfig } from '@/components/peer-space/types';

interface PeerSpaceFooterProps {
  config: PeerMallConfig;
}

const PeerSpaceFooter: React.FC<PeerSpaceFooterProps> = ({ config }) => {
  const quickLinks = [
    { label: '소개', url: `/peermall/${config.id}/about` },
    { label: '콘텐츠', url: `/peermall/${config.id}/content` },
    { label: '커뮤니티', url: `/peermall/${config.id}/community` },
    { label: '이벤트', url: `/peermall/${config.id}/events` },
    { label: '리뷰', url: `/peermall/${config.id}/reviews` },
    { label: '문의하기', url: `/peermall/${config.id}/contact` },
  ];
  
  const socialIcons = {
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    youtube: <Youtube className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">{config.title}</h4>
            <p className="text-gray-300 text-sm mb-4">
              {config.description}
            </p>
            <p className="text-gray-400 text-xs">
              피어 #{config.peerNumber}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">바로가기</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">연락처</h4>
            <ul className="space-y-3">
              {config.address && (
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{config.address}</span>
                </li>
              )}
              {config.contactEmail && (
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <a href={`mailto:${config.contactEmail}`} className="text-gray-300 hover:text-white transition-colors">
                    {config.contactEmail}
                  </a>
                </li>
              )}
              {config.contactPhone && (
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <a href={`tel:${config.contactPhone}`} className="text-gray-300 hover:text-white transition-colors">
                    {config.contactPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">뉴스레터 구독</h4>
            <p className="text-gray-300 text-sm mb-3">
              최신 소식과 이벤트 정보를 받아보세요
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="이메일 주소" 
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="rounded-l-none">구독</Button>
            </div>
          </div>
        </div>
        
        {/* Social & Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {config.socialLinks && Object.entries(config.socialLinks).map(([platform, url]) => (
              url && socialIcons[platform as keyof typeof socialIcons] && (
                <a 
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {socialIcons[platform as keyof typeof socialIcons]}
                </a>
              )
            ))}
          </div>
          
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {config.title}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PeerSpaceFooter;
