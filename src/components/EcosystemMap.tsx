
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const EcosystemMap = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);
  
  const ecosystemLayers = [
    { id: 0, name: '소비자', color: 'bg-blue-100' },
    { id: 1, name: '제작자/판매자', color: 'bg-green-100' },
    { id: 2, name: '커뮤니티', color: 'bg-purple-100' },
    { id: 3, name: '지식/정보', color: 'bg-orange-100' },
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-300">피어몰 생태계 맵</h2>
          <Layers className="h-5 w-5 text-accent-200" />
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative w-full h-[300px] bg-gray-50 rounded-lg mb-4 overflow-hidden">
          {/* Visual representation of layers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <div className="w-48 h-48 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-primary-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Layer labels */}
          <div className="absolute top-4 right-4 space-y-2">
            {ecosystemLayers.map((layer) => (
              <div 
                key={layer.id}
                className={`px-3 py-1 rounded-full text-xs ${layer.color} ${activeLayer === layer.id ? 'ring-2 ring-primary-300' : ''} cursor-pointer`}
                onClick={() => setActiveLayer(layer.id)}
              >
                {layer.name}
              </div>
            ))}
          </div>
        </div>
        
        <Collapsible>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">피어몰 생태계 레이어</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <p className="text-sm text-gray-600 mb-4">
              피어몰 생태계는 소비자, 제작자, 커뮤니티, 지식 레이어가 유기적으로 연결되어 가치를 창출합니다. 각 레이어를 클릭하여 자세히 알아보세요.
            </p>
            
            <Button className="w-full" variant="outline">
              생태계 맵 탐색하기
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default EcosystemMap;
