
import React from "react";
import { Card } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductManagementSection: React.FC = () => {
  return (
    <Card className="p-6 bg-white/70 mb-4">
      <div className="flex items-center mb-4">
        <Package className="w-5 h-5 text-primary-300 mr-2" />
        <h2 className="text-lg font-bold text-primary-300">제품 관리</h2>
      </div>
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="default">
          <Plus className="w-4 h-4 mr-1" />
          새 제품 등록
        </Button>
      </div>
      <div className="text-text-200 text-sm">
        등록된 제품이 여기에 나열됩니다. (예시: 아직 등록된 제품이 없습니다)
      </div>
    </Card>
  );
};

export default ProductManagementSection;
