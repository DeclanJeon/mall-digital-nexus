
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BadgeData } from './types';
import { CircleIcon } from 'lucide-react';

interface BadgeDisplayProps {
  badges: BadgeData[];
  limit?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const BadgeDisplay = ({ 
  badges, 
  limit = 5, 
  size = 'md',
  showTooltip = true
}: BadgeDisplayProps) => {
  const displayBadges = badges.slice(0, limit);
  const remainingCount = Math.max(0, badges.length - limit);

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'px-3 py-1.5'
  };
  
  // Helper function to render badge icon with proper TypeScript support
  const renderBadgeIcon = (icon: React.ReactNode | React.ComponentType | string) => {
    // Handle React elements - avoid directly cloning due to unknown prop types
    if (React.isValidElement(icon)) {
      // For valid elements, we'll wrap them in a span with our desired styling
      return (
        <span className="inline-flex h-3 w-3 mr-1.5">
          {icon}
        </span>
      );
    }
    
    // Handle component types (functions)
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="h-3 w-3 mr-1.5" />;
    }
    
    // Handle string-based icon (could be an icon name or path)
    if (typeof icon === 'string') {
      return <span className="h-3 w-3 mr-1.5">{icon}</span>;
    }
    
    // Default fallback
    return <CircleIcon className="h-3 w-3 mr-1.5" />;
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((badge) => (
        <Badge 
          key={badge.id} 
          variant="outline" 
          className={`${sizeClasses[size]} border-opacity-50 ${badge.color ? badge.color.replace('text-', 'border-') : 'border-gray-500'} ${badge.color || 'text-gray-700'}`}
          title={showTooltip ? badge.description : undefined}
        >
          {badge.icon && renderBadgeIcon(badge.icon)}
          {!badge.icon && <CircleIcon className="h-3 w-3 mr-1.5" />}
          {badge.name}
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge 
          variant="outline" 
          className={`${sizeClasses[size]} border-gray-300 text-gray-500`}
        >
          +{remainingCount} 더보기
        </Badge>
      )}
    </div>
  );
};

export default BadgeDisplay;
