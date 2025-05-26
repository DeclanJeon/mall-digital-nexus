import React from 'react';
// Removed redundant Navigation import
import QRCodeGeneratorForm from '@/components/feature-sections/QRCodeGeneratorForm';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const QRCodeGenerator = () => {
  return (
    // Apply the same gradient background as Index page and adjust padding
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-200 pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-6"> 
        <div className="max-w-4xl mx-auto">
          {/* Ensure heading color matches */}
          <div className="flex justify-between items-center mb-10"> 
            <h1 className="text-3xl font-bold text-white">QR 코드 생성</h1>
            <Link to="/personal-lounge">
              {/* Button is commented out, keeping it that way */}
              {/* <Button variant="outline" className="flex items-center">
                  <span>내 피어몰 관리</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button> */}
              </Link>
            </div>

            <QRCodeGeneratorForm /> 
          </div>
        </div>
      </div>
  );
};

export default QRCodeGenerator;
