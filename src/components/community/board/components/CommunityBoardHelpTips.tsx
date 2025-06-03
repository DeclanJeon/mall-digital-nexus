import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

interface CommunityBoardHelpTipsProps {
  showHelpTips: boolean;
  dismissHelpTips: () => void;
}

const CommunityBoardHelpTips: React.FC<CommunityBoardHelpTipsProps> = ({
  showHelpTips,
  dismissHelpTips,
}) => {
  if (!showHelpTips) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-blue-50 border-l-4 border-blue-400 p-4 flex justify-between items-center"
    >
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800">커뮤니티 사용 팁</h3>
          <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
            <li><kbd className="px-1.5 py-0.5 bg-white rounded border shadow-sm text-xs">/</kbd> 키를 눌러 빠르게 검색하기</li>
            <li>필터와 정렬 옵션을 활용해 원하는 게시글 빠르게 찾기</li>
          </ul>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={dismissHelpTips}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default CommunityBoardHelpTips;
