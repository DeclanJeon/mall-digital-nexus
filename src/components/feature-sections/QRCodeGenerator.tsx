import React from 'react';
// Removed redundant Navigation import
import QRCodeGeneratorForm from '@/components/feature-sections/QRCodeGeneratorForm';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const QRCodeGenerator = () => {
  return (
    // Apply the same gradient background as Index page and adjust padding
    <div className="min-h-screen bg-gradient-to-br from-bg-100 via-bg-200 to-primary-300/20">
      <div className="container mx-auto px-6"> 
        <div className="max-w-4xl mx-auto">
          {/* Ensure heading color matches */}
          <div className="flex justify-between items-center mb-10"> 
            {/* <h1 className="text-3xl font-bold text-white">QR 코드 생성</h1> */}
          </div>

          <QRCodeGeneratorForm /> 
          </div>
        </div>
      </div>
  );
};

export default QRCodeGenerator;
