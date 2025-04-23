
import React from "react";
import { Card } from "@/components/ui/card";
import { Paintbrush, Image } from "lucide-react";

const DesignSettingsSection: React.FC = () => {
  return (
    <Card className="p-6 bg-white/70 mb-4">
      <div className="flex items-center mb-4">
        <Paintbrush className="w-5 h-5 text-primary-300 mr-2" />
        <h2 className="text-lg font-bold text-primary-300">디자인 설정</h2>
      </div>
      <div className="space-y-2">
        <div className="flex gap-6 flex-wrap">
          <div>
            <div className="text-sm text-primary-200 mb-1">배경 이미지</div>
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-accent-200" />
              <span className="text-text-200">미리보기</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-primary-200 mb-1">테마 컬러</div>
            <div>
              <span className="inline-block rounded-full w-5 h-5 bg-primary-200 border mr-2 align-middle"></span>
              <span className="text-text-200">primary</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-text-200">로고, 컬러, 이미지 등은 여기서 손쉽게 변경할 수 있도록 구현할 예정입니다.</div>
      </div>
    </Card>
  );
};

export default DesignSettingsSection;
