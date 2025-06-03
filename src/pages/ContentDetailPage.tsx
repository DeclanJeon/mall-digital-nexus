
import React, { useEffect, useState } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import CommunityDetail from "@/components/community/CommunityDetail";
import { CommunityZone } from "@/types/community";
import { loadCommunitiesFromLocalStorage } from "@/utils/storageUtils";

const CommunityDetailPage = () => {
  const { communityId } = useParams();
  const location = useLocation();
  const [community, setCommunity] = useState<CommunityZone | undefined>(
    location.state?.community
  );
  
  // If no community data in location state, try to load from localStorage
  useEffect(() => {
    if (!community && communityId) {
      const communities = loadCommunitiesFromLocalStorage();
      const foundCommunity = communities.find(c => c.id === communityId);
      if (foundCommunity) {
        setCommunity(foundCommunity);
      }
    }
  }, [communityId, community]);
  
  // If no community data is available, navigate back to the community map
  if (!community && !communityId) {
    return <Navigate to="/community" replace />;
  }
  
  // Show loading while retrieving community data
  if (!community && communityId) {
    return <div className="flex items-center justify-center h-screen">커뮤니티 정보를 불러오는 중...</div>;
  }
  
  return <CommunityDetail community={community!} />;
};

export default CommunityDetailPage;
