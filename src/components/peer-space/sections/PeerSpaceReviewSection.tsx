import React from 'react';
import { PeerMallConfig } from '../types';

interface PeerSpaceReviewSectionProps {
  config: PeerMallConfig;
  isOwner: boolean;
}

const PeerSpaceReviewSection: React.FC<PeerSpaceReviewSectionProps> = ({
  config,
  isOwner
}) => {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">리뷰</h2>
      </div>
      
      <div className="text-center py-16 border rounded-lg bg-gray-50">
        <p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
        {isOwner && (
          <p className="text-sm text-gray-400 mt-2">리뷰 시스템을 활성화하여 사용자들의 피드백을 받아보세요.</p>
        )}
      </div>
    </section>
  );
};

export default PeerSpaceReviewSection;
