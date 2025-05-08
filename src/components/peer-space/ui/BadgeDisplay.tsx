
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BadgeData } from "../types";

interface BadgeDisplayProps {
  badge: BadgeData;
  size?: 'sm' | 'md' | 'lg';
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, size = 'md' }) => {
  // Basic render function for a badge
  return (
    <Badge variant="outline" className={`bg-${badge.color || 'primary'}-100 text-${badge.color || 'primary'}-800`}>
      {badge.name}
    </Badge>
  );
};

export default BadgeDisplay;
