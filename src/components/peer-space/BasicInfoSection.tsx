
import React from "react";
import { Card } from "@/components/ui/card";
import { User, Info } from "lucide-react";

const BasicInfoSection: React.FC = () => {
  return (
    <Card className="p-6 bg-white/70 mb-4">
      <div className="flex items-center mb-4">
        <User className="w-5 h-5 text-primary-300 mr-2" />
        <h2 className="text-lg font-bold text-primary-300">기본 정보</h2>
      </div>
      <div className="space-y-3">
        <div className="flex gap-6 flex-wrap">
          <div>
            <div className="text-sm text-primary-200 mb-1">이름</div>
            <div className="font-semibold text-text-100">피어스페이스 예시 사업장</div>
          </div>
          <div>
            <div className="text-sm text-primary-200 mb-1">설명</div>
            <div className="text-text-200">이곳에 피어스페이스의 간단한 소개 또는 설명이 들어갑니다.</div>
          </div>
        </div>
        <div>
          <Info className="inline mr-1 text-primary-200" />
          <span className="text-xs text-text-200">이 정보는 피어스페이스 프로필에 표시됩니다.</span>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
