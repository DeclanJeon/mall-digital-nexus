
import React, { useState, useEffect } from 'react';
import { getCommunityStatistics } from "@/utils/storageUtils";
import CommunityBoard from '@/components/community/CommunityBoard';

interface CommunityStats {
  totalCommunities: number;
  activeCommunities: number;
  activeUsers: number;
  todayPosts: number;
}

const Community = () => {
  const [activeTab, setActiveTab] = useState("board");
  const [statistics, setStatistics] = useState<CommunityStats>({
    totalCommunities: 0,
    activeCommunities: 0,
    activeUsers: 0,
    todayPosts: 0
  });

  // Load community statistics
  useEffect(() => {
    // Load statistics from local storage
    const stats = getCommunityStatistics();

    // If we have real data, use it; otherwise use some default values
    if (stats.totalCommunities > 0) {
      setStatistics(stats);
    } else {
      // Fallback default statistics
      setStatistics({
        totalCommunities: 23,
        activeCommunities: 18,
        activeUsers: 487,
        todayPosts: 41
      });
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto py-6">
        <CommunityBoard zoneName="디지털 도시" />
      </div>
    </div>
  );
};

export default Community;
