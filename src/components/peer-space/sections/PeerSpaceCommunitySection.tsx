import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageSquare, FileText, User } from 'lucide-react';
import { Content, PeerMallConfig } from '../types';
import Community from '@/components/community/Community';

interface PeerSpaceCommunitySectionProps {
  isOwner: boolean;
  config: PeerMallConfig;
  posts: Content[];
  filteredPosts: Content[];
}

const PeerSpaceCommunitySection: React.FC<PeerSpaceCommunitySectionProps> = ({
  isOwner,
  config,
  posts,
  filteredPosts,
}) => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <Community />
    </div>
  ); 
};

export default PeerSpaceCommunitySection;
