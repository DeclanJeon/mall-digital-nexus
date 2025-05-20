
import React from 'react';
import { Helmet } from "react-helmet-async";
import Community from '@/components/community/Community';

const CommunityPage = () => {
  return (
    <>
      <Helmet>
        <title>커뮤니티 지도 - 피어몰</title>
        <meta name="description" content="전 세계 커뮤니티를 탐색하고 참여하세요" />
      </Helmet>
      <Community />
    </>
  );
};

export default CommunityPage;
