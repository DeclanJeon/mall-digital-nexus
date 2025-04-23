
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContentManagementSection: React.FC = () => {
  return (
    <Card className="p-6 bg-white/70 mb-4">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 text-primary-300 mr-2" />
        <h2 className="text-lg font-bold text-primary-300">콘텐츠 관리</h2>
      </div>
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="default">
          <Plus className="w-4 h-4 mr-1" />
          새 콘텐츠 추가
        </Button>
      </div>
      <div className="text-text-200 text-sm">
        등록된 콘텐츠가 여기에 나열됩니다. (예시: 아직 콘텐츠가 없습니다)
      </div>
    </Card>
  );
};

export default ContentManagementSection;
