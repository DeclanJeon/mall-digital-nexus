
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Space } from './types';

interface SpaceCardProps {
  space: Space;
}

const SpaceCard = ({ space }: SpaceCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-white/20 transition-all">
      <Link to={`/space/${space.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={space.imageUrl}
            alt={space.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-white group-hover:text-[#E91E63] transition-colors">
              {space.title}
            </h3>
            {space.isAdult && (
              <Badge variant="outline" className="bg-[#E91E63]/10 text-[#E91E63] border-[#E91E63]/20">
                18+
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{space.memberCount} Members</span>
            </div>
            <span>{space.postCount} Posts</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default SpaceCard;
